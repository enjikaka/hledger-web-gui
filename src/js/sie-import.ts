import type { Account, Alias, Transaction } from "./parse-journal-file";
import { CP437_MAPPA } from "./sie-export";

/**
 * SIE4-import — motsvarigheten till sie-export, för migrering från t.ex.
 * Bokio. Filen avkodas från CP437 (SIE-specens teckenuppsättning), tolkas
 * rad för rad och byggs om till appens journalmodell: konton med alias,
 * transaktioner med verifikationskoder och — per period — ett verifikat
 * "(IBÅÅÅÅ)" för den ingående balansen.
 *
 * #UB/#RES hoppas över medvetet: de är redundanta mot verifikationerna och
 * skulle räknas dubbelt. Saknas transdatum på en #VER används periodens
 * slutdatum (senast sedda #RAR), enligt specens möjlighet att utelämna
 * datumet.
 */

export type SiePeriod = {
  nummer: string;
  /** ISO-datum ÅÅÅÅ-MM-DD. */
  start: string;
  slut: string;
};

export type SieVerifikat = {
  serie: string;
  nummer: string;
  /** ISO-datum, eller null när filen utelämnade det. */
  datum: string | null;
  text: string;
  poster: Array<{ konto: number; beloppOre: number }>;
};

export type SieData = {
  fnamn: string;
  perioder: Array<SiePeriod>;
  /** Kontonamn ur #KONTO-rader — valfria i specen. */
  kontonamn: Map<number, string>;
  /** Periodnummer → konto → belopp i ören. */
  ingaendeBalans: Map<string, Map<number, number>>;
  verifikat: Array<SieVerifikat>;
  /** Poster som tolkats men inte används (#UB/#RES/#OBJEKT m.fl.). */
  hoppadePoster: number;
  /** #FLAGGA 1 = signerad fil — ofarlig att läsa, men värd en notis. */
  signerad: boolean;
};

const OMVAND_CP437: Record<number, string> = Object.fromEntries(
  Object.entries(CP437_MAPPA).map(([tecken, kod]) => [kod, tecken]),
);

/**
 * Avkodar SRU/SIE-bytes till text. UTF-8-BOM sniffas först (nya program
 * skriver ibland UTF-8 trots specen); annars CP437 med ASCII genomsläppte
 * och latin1-liknande fall-back för byte utanför tabellen.
 */
export function decodaCp437(bytes: Uint8Array): string {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(bytes.slice(3));
  }

  let text = "";

  for (const byte of bytes) {
    text +=
      byte <= 0x7f
        ? String.fromCharCode(byte)
        : (OMVAND_CP437[byte] ?? String.fromCharCode(byte));
  }

  return text;
}

/** Delar en rad i fält: blanksteg separerar utanför citattecken, och
 *  citattecknen själva tas bort medan innehållet bevaras. "{}" överlever. */
function faltaRad(rad: string): Array<string> {
  const delar: Array<string> = [];
  let aktuell = "";
  let inomCitat = false;

  for (const tecken of rad.trim()) {
    if (tecken === '"') {
      inomCitat = !inomCitat;
      continue;
    }

    if (!inomCitat && (tecken === " " || tecken === "\t")) {
      if (aktuell) {
        delar.push(aktuell);
        aktuell = "";
      }
      continue;
    }

    aktuell += tecken;
  }

  if (aktuell) {
    delar.push(aktuell);
  }

  return delar;
}

/** ÅÅÅÅMMDD → ÅÅÅÅ-MM-DD; ogiltig längd returneras orörd. */
function isoDatum(aaaammdd: string): string {
  if (/^\d{8}$/.test(aaaammdd)) {
    return `${aaaammdd.slice(0, 4)}-${aaaammdd.slice(4, 6)}-${aaaammdd.slice(6, 8)}`;
  }

  return aaaammdd;
}

/** Tolkar en redan avkodad SIE-fil. Kastar om inga verifikationer finns —
 *  en sådan fil skulle ge en tom bokföring som ser giltig ut. */
export function tolkaSie(text: string): SieData {
  const data: SieData = {
    fnamn: "",
    perioder: [],
    kontonamn: new Map(),
    ingaendeBalans: new Map(),
    verifikat: [],
    hoppadePoster: 0,
    signerad: false,
  };

  const rader = text.split(/\r?\n/);

  for (let i = 0; i < rader.length; i++) {
    const rad = rader[i].trim();

    if (!rad.startsWith("#")) {
      continue;
    }

    const falt = faltaRad(rad);
    const etikett = falt[0];

    switch (etikett) {
      case "#FNAMN": {
        // Namnet kan innehålla blankstag — fält-tolkaren hanterar citaten.
        data.fnamn = saneraText(falt.slice(1).join(" "));
        break;
      }
      case "#FLAGGA":
        data.signerad ||= falt[1] === "1";
        break;
      case "#RAR": {
        // #RAR periodnummer startdatum slutdatum
        if (falt.length >= 4) {
          data.perioder.push({
            nummer: falt[1],
            start: isoDatum(falt[2]),
            slut: isoDatum(falt[3]),
          });
        }
        break;
      }
      case "#KONTO": {
        const nr = parseInt(falt[1], 10);
        const namn = falt.slice(2).join(" ");

        if (Number.isFinite(nr)) {
          data.kontonamn.set(nr, namn);
        }
        break;
      }
      case "#IB": {
        if (falt.length >= 4) {
          const period = falt[1];
          const konto = parseInt(falt[2], 10);
          const belopp = parseInt(falt[3], 10);

          if (Number.isFinite(konto) && Number.isFinite(belopp)) {
            const perPeriod =
              data.ingaendeBalans.get(period) ?? new Map<number, number>();
            perPeriod.set(konto, belopp);
            data.ingaendeBalans.set(period, perPeriod);
          }
        }
        break;
      }
      case "#VER": {
        // #VER serie nummer [datum] [text ...]
        const serie = falt[1] ?? "";
        const nummer = falt[2] ?? "";

        const datumFalt = falt[3];
        const arDatum = /^\d{8}$/.test(datumFalt ?? "");
        const datum = arDatum ? isoDatum(datumFalt) : null;

        // Texten är allt efter datumet, sammanfogat (citerad text är redan
        // ett fält; ociterad flerords-text sällsynt men stöds).
        const textDel = arDatum ? falt.slice(4) : falt.slice(3);

        // Samla { ... }-blocket.
        const poster: Array<{ konto: number; beloppOre: number }> = [];

        while (i + 1 < rader.length) {
          i++;
          const blockRad = rader[i].trim();

          if (blockRad === "}") {
            break;
          }

          if (!blockRad.startsWith("#TRANS")) {
            continue;
          }

          const tf = faltaRad(blockRad);

          // #TRANS konto {} belopp [datum] [text] [kvantitet]
          if (tf.length >= 4) {
            const konto = parseInt(tf[1], 10);
            const belopp = parseInt(tf[3], 10);

            if (Number.isFinite(konto) && Number.isFinite(belopp)) {
              poster.push({ konto, beloppOre: belopp });
            } else {
              data.hoppadePoster++;
            }
          }
        }

        data.verifikat.push({
          serie,
          nummer,
          datum,
          text: saneraText(textDel.join(" ")),
          poster,
        });
        break;
      }
      case "":
      // Kända rader som tolkas men inte används.
      case "#PROGRAM":
      case "#FORMAT":
      case "#GEN":
      case "#KPTYP":
      case "#MVAL":
      case "#TAXAR":
      case "#OMFATTNING":
        break;
      default:
        // #UB, #RES samt okända rader — räknas så inget försvinner tyst.
        data.hoppadePoster++;
        break;
    }
  }

  if (data.verifikat.length === 0) {
    throw new Error(
      "Filen innehåller inga verifikationer (#VER) — inget att importera.",
    );
  }

  return data;
}

/** Hledger-kontonamn: gemener, och blankstag/otillåtna sekvenser →
 *  understreck. Svenska bokstäver (åäö) bevaras. */
function tillHledgerNamn(namn: string): string {
  return namn
    .trim()
    .replace(/[^\p{L}\p{N}_:.-]+/gu, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
}

function unikaNamn(basen: string, anvanda: Set<string>): string {
  if (!anvanda.has(basen)) {
    anvanda.add(basen);
    return basen;
  }

  let n = 2;

  while (anvanda.has(`${basen}_${n}`)) {
    n++;
  }

  const namn = `${basen}_${n}`;
  anvanda.add(namn);

  return namn;
}

export type ImporteradJournal = {
  konton: Array<Account>;
  aliaser: Array<Alias>;
  transaktioner: Array<Transaction>;
  /** Åren som berörs av importen — används för varning vid Lägg till. */
  ar: Array<string>;
};

/**
 * Bygger appens journalmodell av tolkad SIE-data: konton med alias,
 * verifikationerna som transaktioner samt — per period med IB-rader — ett
 * verifikat "(IBÅÅÅÅ)" daterat periodstarten. Serien "IB" hålls åtskild från
 * bokföringsserien A så dess luckkontroll inte störas.
 */
export function sieTillJournal(data: SieData): ImporteradJournal {
  const konton: Array<Account> = [];
  const aliaser: Array<Alias> = [];
  const anvandaNamn = new Set<string>();

  const allaKonton = new Set<number>(data.kontonamn.keys());

  for (const v of data.verifikat) {
    for (const p of v.poster) {
      allaKonton.add(p.konto);
    }
  }

  for (const perPeriod of data.ingaendeBalans.values()) {
    for (const konto of perPeriod.keys()) {
      allaKonton.add(konto);
    }
  }

  const namnFor = new Map<number, string>();

  for (const konto of [...allaKonton].sort((a, b) => a - b)) {
    const bas =
      tillHledgerNamn(data.kontonamn.get(konto) ?? "") || `konto_${konto}`;
    const namn = unikaNamn(bas, anvandaNamn);

    namnFor.set(konto, namn);
    konton.push({ name: namn });
    aliaser.push({ id: konto, to: namn });
  }

  const periodStartFor = new Map(data.perioder.map((p) => [p.nummer, p.start]));

  type Rad = { datum: string; ordning: number; tx: Transaction };
  const rader: Array<Rad> = [];

  for (const v of data.verifikat) {
    const senasteSlut = data.perioder.at(-1)?.slut;
    const datum = v.datum ?? senasteSlut;

    if (!datum) {
      continue;
    }

    rader.push({
      datum,
      ordning: 1,
      tx: {
        uuid: crypto.randomUUID(),
        date: datum,
        code: `${v.serie}${v.nummer}`,
        description: v.text || `Verifikation ${v.serie}${v.nummer}`,
        postings: v.poster.map((p) => ({
          account: p.konto,
          amount: p.beloppOre / 100,
          currency: "SEK",
        })),
      },
    });
  }

  for (const [period, perPeriod] of data.ingaendeBalans) {
    const start = periodStartFor.get(period);

    if (!start || perPeriod.size === 0) {
      continue;
    }

    const ar = start.slice(0, 4);

    rader.push({
      datum: start,
      ordning: 0,
      tx: {
        uuid: crypto.randomUUID(),
        date: start,
        code: `IB${ar}`,
        description: `Ingående balans ${ar}`,
        postings: [...perPeriod.entries()]
          .sort(([a], [b]) => a - b)
          .map(([konto, beloppOre]) => ({
            account: konto,
            amount: beloppOre / 100,
            currency: "SEK",
          })),
      },
    });
  }

  const transaktioner = rader
    .sort((a, b) => a.datum.localeCompare(b.datum) || a.ordning - b.ordning)
    .map(({ tx }) => tx);

  return {
    konton,
    aliaser,
    transaktioner,
    ar: [...new Set(transaktioner.map((tx) => tx.date.slice(0, 4)))].sort(),
  };
}

/** '#' är reserverat och radbrytningar olagliga i SIE-strängar. */
function saneraText(text: string): string {
  return text
    .replace(/#/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}
