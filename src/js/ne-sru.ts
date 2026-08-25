import type { NeBilaga } from "./ne-bilaga";

/**
 * SRU-export av NE-bilagan — Skatteverkets maskinläsbara format bestående av
 * två filer: INFO.SRU (uppgiftslämnaren) och BLANKETTER.SRU (blankettblocken).
 * Filerna ska kodas i ISO 8859-1 med CRLF-radbrytningar.
 *
 * NE-bilagan är en bilaga till Inkomstdeklaration 1 som lämnas av en fysisk
 * person, så identiteten är ägarens PERSONNUMMER (ÅÅÅÅMMDDNNNN) — inte ett
 * organisationsnummer med "16"-prefix som på INK2.
 *
 * Fältkoderna kommer från Skatteverkets tekniska beskrivning (2025P4) och
 * stämmer för R1–R11 med BAS-kontogruppens officiella kopplingstabell
 * "NE - Inkomst av näringsverksamhet, Enskilda näringsidkare"
 * (bas.se/kontoplaner/sru/). Konventionen är 76xx = plusposter och 77xx =
 * minusposter på blanketten, samma tecken som räkenskapskedjan.
 *
 * Summorutorna R17, R21, R29, R33, R35 och R42 har inga fältkoder — Skatteverket
 * räknar dem själva. R12 (7600, överförs från R11) finns däremot med som egen
 * post och exporteras.
 *
 * Porterad från accounted (gnubok, github.com/erp-mafia/accounted,
 * AGPL-3.0-or-later).
 */

const CRLF = "\r\n";
const PROGRAM_VERSION = "1.0";
/** Appnamnet i #PROGRAM-posten. */
const PROGRAM_NAMN = "hledger-web-gui";

/** Räkenskapsårets start-/slutdatum — standardperioder delade mellan blanketter. */
export const FISCAL_START_CODE = "7011";
export const FISCAL_END_CODE = "7012";

/** Fältkoder för räkenskapsschemat R1–R10 (sid 1). */
const SCHEMA_KODER: Record<string, string> = {
  R1: "7400", // Försäljning och utfört arbete samt övriga momspliktiga intäkter
  R2: "7401", // Momsfria intäkter
  R3: "7402", // Bil- och bostadsförmån m.m.
  R4: "7403", // Ränteintäkter m.m.
  R5: "7500", // Varor, material och tjänster
  R6: "7501", // Övriga externa kostnader
  R7: "7502", // Anställd personal
  R8: "7503", // Räntekostnader m.m.
  R9: "7504", // Avskrivningar byggnader och markanläggningar
  R10: "7505", // Avskrivningar maskiner, inventarier och immateriella tillgångar
};

/** Bokfört resultat (R11) och skattemässiga justeringarna R12–R48 (sid 2).
 *  Summorutorna saknas medvetet — de beräknas av Skatteverket. */
const JUSTERING_KODER: Record<string, string> = {
  R11: "7440",
  R12: "7600", // Bokfört resultat, överfört från R11
  R13: "7601",
  R14: "7700",
  R15: "7602",
  R16: "7701",
  R18: "7702",
  R19: "7603",
  // R20 har två koder efter tecken; appen fyller bara minusdelen
  // ("andel till medhjälpande make") → 7703.
  R20: "7703",
  R22: "7704",
  R23: "7604",
  R24: "7705",
  R25: "7706",
  R26: "7605",
  R27: "7606",
  R28: "7707",
  R30: "7708",
  R31: "7607",
  R32: "7608",
  R34: "7709",
  R36: "7710",
  R37: "7609",
  R38: "7711",
  R39: "7712",
  R40: "7610",
  R41: "7713",
  R43: "7714",
  R44: "7611",
  R45: "7612",
  R46: "7613",
  R47: "7630",
  R48: "7730",
};

export type SruUppgifter = {
  /** Personnummer, 10 eller 12 siffror (bindestreck/spaces ignoreras). */
  personnummer: string;
  namn: string;
  postnr?: string;
  postort?: string;
};

export type NeSruFil = {
  infoSru: string;
  blanketterSru: string;
};

/** Periodsuffix till blanketttypen, utifrån månaden räkenskapsåret slutar.
 *  P1 = jan–apr, P2 = maj–aug, P4 = sep–dec (kalenderår → P4). */
function periodSuffix(slutDatum: string): string {
  const manad = parseInt(slutDatum.slice(5, 7), 10);

  if (manad >= 1 && manad <= 4) {
    return "P1";
  }

  if (manad >= 5 && manad <= 8) {
    return "P2";
  }

  return "P4";
}

/**
 * Normaliserar personnumret till 12 siffror ÅÅÅÅMMDDNNNN. Till skillnad från
 * juridiska persons orgnr läggs inget "16" framför — för en fysisk person är
 * sekeln födelsesekeln. Ett 10-siffrigt nummer får sekeln härledd ur åldern:
 * en NE-deklarant är vuxen, så sekeln väljs så att åldern vid inkomståret blir
 * ≥ 18 men < 110, där 1900-tal föredras. Returnerar noll-platshållare vid
 * ogiltig inmatning; anroparen validerar och vägrar generera.
 */
function normaliseraPersonnummer(raw: string | null, inkomsar: number): string {
  const siffror = (raw || "").replace(/\D/g, "");

  if (siffror.length === 12) {
    return siffror;
  }

  if (siffror.length === 10) {
    const aa = parseInt(siffror.slice(0, 2), 10);
    const alderOm2000Tal = inkomsar - (2000 + aa);
    const sekel = alderOm2000Tal >= 18 && alderOm2000Tal < 110 ? "20" : "19";

    return `${sekel}${siffror}`;
  }

  return "000000000000";
}

/** Date → ÅÅÅÅMMDD. */
function formateraDatum(date: Date): string {
  return (
    `${date.getFullYear()}` +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0")
  );
}

/** Date → TTMMSS. */
function formateraTid(date: Date): string {
  return (
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

/** Hela kronor utan decimaler eller tusentalsseparatorer. */
const formateraBelopp = (belopp: number) => Math.trunc(belopp).toString();

/** '#' är reserverat i SRU; radbrytningar blir mellanslag; max 250 tecken. */
function sanera(text: string): string {
  return text
    .replace(/#/g, "")
    .replace(/[\r\n]/g, " ")
    .slice(0, 250);
}

/** INFO.SRU — metadata om uppgiftslämnaren. */
function genereraInfoSru(
  uppgifter: SruUppgifter,
  nu: Date,
  personnummer12: string,
): string {
  const rader = [
    "#DATABESKRIVNING_START",
    "#PRODUKT SRU",
    `#SKAPAD ${formateraDatum(nu)} ${formateraTid(nu)}`,
    `#PROGRAM ${sanera(PROGRAM_NAMN)} ${PROGRAM_VERSION}`,
    "#FILNAMN BLANKETTER.SRU",
    "#DATABESKRIVNING_SLUT",
    "#MEDIELEV_START",
    `#ORGNR ${personnummer12}`,
    `#NAMN ${sanera(uppgifter.namn)}`,
    `#POSTNR ${(uppgifter.postnr || "").replace(/\s/g, "")}`,
    `#POSTORT ${sanera(uppgifter.postort || "")}`,
    "#MEDIELEV_SLUT",
  ];

  return rader.join(CRLF) + CRLF;
}

/** BLANKETTER.SRU — NE-blankettblocket med alla icke-noll rutor. */
function genereraBlanketterSru(
  bilaga: NeBilaga,
  uppgifter: SruUppgifter,
  nu: Date,
  personnummer12: string,
): string {
  const start = `${bilaga.year}-01-01`;
  const slut = `${bilaga.year}-12-31`;
  const rader: Array<string> = [
    `#BLANKETT NE-${bilaga.year}${periodSuffix(slut)}`,
    `#IDENTITET ${personnummer12} ${formateraDatum(nu)} ${formateraTid(nu)}`,
    `#NAMN ${sanera(uppgifter.namn)}`,
    `#UPPGIFT ${FISCAL_START_CODE} ${start.replace(/-/g, "")}`,
    `#UPPGIFT ${FISCAL_END_CODE} ${slut.replace(/-/g, "")}`,
  ];

  const skjutIn = (kod: string, belopp: number) => {
    if (belopp !== 0) {
      rader.push(`#UPPGIFT ${kod} ${formateraBelopp(belopp)}`);
    }
  };

  // Sidan 1: räkenskapsschemat i blanketordning ...
  for (const rad of [...bilaga.intakter, ...bilaga.kostnader]) {
    const kod = SCHEMA_KODER[rad.ruta];

    if (kod && rad.belopp !== 0) {
      skjutIn(kod, rad.belopp);
    }
  }

  // ... R11 ...
  skjutIn(JUSTERING_KODER.R11, bilaga.bokfortResultat);

  // ... sidan 2: justeringarna i blanketordning. Mellansummorutorna
  // (R17, R21, R29, R33, R35, R42) saknar fältkoder och beräknas av
  // Skatteverket — de faller bort av sig själva i kodtabellen.
  for (const rad of bilaga.justeringar) {
    const kod = JUSTERING_KODER[rad.ruta];

    if (kod && rad.belopp !== 0) {
      skjutIn(kod, rad.belopp);
    }
  }

  rader.push("#BLANKETTSLUT", "#FIL_SLUT");

  return rader.join(CRLF) + CRLF;
}

/**
 * Genererar en komplett SRU-inlämning (INFO.SRU + BLANKETTER.SRU) för
 * NE-bilagan. Kastar vid saknat personnummer/namn/postuppgifter hellre än att
 * lämna en strukturellt korrekt fil med platshållare som Skatteverket skulle
 * avvisa.
 */
export function genereraNeSru(
  bilaga: NeBilaga,
  uppgifter: SruUppgifter,
  nu: Date = new Date(),
): NeSruFil {
  const inkomsar = parseInt(bilaga.year, 10);
  const personnummer12 = normaliseraPersonnummer(
    uppgifter.personnummer,
    inkomsar,
  );

  if (!/^\d{12}$/.test(personnummer12) || personnummer12 === "000000000000") {
    throw new Error(
      "NE-bilagan kräver ett giltigt personnummer (ÅÅÅÅMMDDNNNN eller ÅÅMMDDNNNN).",
    );
  }

  if (!uppgifter.namn.trim()) {
    throw new Error("Namnet får inte vara tomt.");
  }

  if (!(uppgifter.postnr ?? "").trim() || !(uppgifter.postort ?? "").trim()) {
    throw new Error("Postnummer och postort krävs i MEDIELEV-blocket.");
  }

  return {
    infoSru: genereraInfoSru(uppgifter, nu, personnummer12),
    blanketterSru: genereraBlanketterSru(bilaga, uppgifter, nu, personnummer12),
  };
}

/** Förhandskontroll av BLANKETTER.SRU:s obligatoriska struktur. */
export function valideraBlanketterSru(content: string): {
  giltig: boolean;
  fel: Array<string>;
} {
  const fel: Array<string> = [];

  if (!/^#BLANKETT NE-/m.test(content)) {
    fel.push("#BLANKETT NE- block saknas");
  }

  if (!/^#IDENTITET /m.test(content)) {
    fel.push("#IDENTITET saknas");
  }

  if (!/^#NAMN /m.test(content)) {
    fel.push("#NAMN saknas");
  }

  // Räkenskapsårets datum är obligatoriska — deras frånvaro ger avvisning
  // hos Skatteverket, så de fångas redan här.
  if (!new RegExp(`^#UPPGIFT ${FISCAL_START_CODE} `, "m").test(content)) {
    fel.push(`#UPPGIFT ${FISCAL_START_CODE} (räkenskapsårets början) saknas`);
  }

  if (!new RegExp(`^#UPPGIFT ${FISCAL_END_CODE} `, "m").test(content)) {
    fel.push(`#UPPGIFT ${FISCAL_END_CODE} (räkenskapsårets slut) saknas`);
  }

  if (!/^#FIL_SLUT/m.test(content)) {
    fel.push("#FIL_SLUT saknas");
  }

  const antalBlockslut = (content.match(/^#BLANKETTSLUT/gm) || []).length;

  if (antalBlockslut !== 1) {
    fel.push(`Förväntade 1 #BLANKETTSLUT, hittade ${antalBlockslut}`);
  }

  return { giltig: fel.length === 0, fel };
}

/**
 * Kodar text till ISO 8859-1-bytes. TextEncoder klarar bara UTF-8, så
 * latin1-kodningen görs tecken för tecken; tecken utanför latin1 (t.ex. €)
 * avvisas i stället för att tyst skrivas om.
 */
export function kodatLatin1(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);

  for (let i = 0; i < text.length; i++) {
    const kod = text.charCodeAt(i);

    if (kod > 0xff) {
      throw new Error(
        `Tecknet "${text[i]}" (position ${i}) saknas i ISO 8859-1.`,
      );
    }

    bytes[i] = kod;
  }

  return bytes;
}
