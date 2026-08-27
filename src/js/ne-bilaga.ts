import { beraknaEgenavgifter, type EgenavgiftsKategori } from "./egenavgifter";
import { beraknaExpansionsfondAndring } from "./expansionsfond";
import {
  type PeriodiseringsFond,
  proposeraPfondAterforing,
  proposeraPfondAvsattning,
} from "./periodiseringsfond";
import { beraknaRantefordelning, slrForAr } from "./rantefordelning";
import { aliases, transactions } from "./signals";

/**
 * NE-bilaga (Inkomst av näringsverksamhet, enskilda näringsidkare)
 *
 * Räkenskapsschemat R1–R11: BAS-kontosaldon mappas till blankettens rutor
 * enligt BAS-kontogruppens kopplingstabell "NE - Inkomst av näringsverksamhet,
 * Enskilda näringsidkare" (bas.se/kontoplaner/sru/).
 *
 * Skattemässiga justeringar R12–R48 (SKV 2161): R12 förs över från R11 och
 * R13 räknas fram ur bokföringen (ej avdragsgilla kostnader). Summorutorna
 * R17, R21, R29, R33, R35, R42 och R47/R48 räknas ut längs kedjan; övriga
 * rutor fylls i för hand i deklarationen. Rutorna R24 och framåt finns bara
 * på NE-bilagan — NEA-bilagan (underverksamheten) slutar vid R22/R23.
 */

export type NeRuta =
  | "R1"
  | "R2"
  | "R3"
  | "R4"
  | "R5"
  | "R6"
  | "R7"
  | "R8"
  | "R9"
  | "R10";

export type NeBalansRuta =
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "B6"
  | "B7"
  | "B8"
  | "B9"
  | "B10"
  | "B11"
  | "B12"
  | "B13"
  | "B14"
  | "B15"
  | "B16";

export type NeKontoRad = {
  konto: number;
  namn: string;
  belopp: number;
};

export type NeRad = {
  ruta: NeRuta;
  beskrivning: string;
  belopp: number;
  konton: Array<NeKontoRad>;
};

export type NeBalansRad = {
  ruta: NeBalansRuta;
  beskrivning: string;
  belopp: number;
  konton: Array<NeKontoRad>;
};

/** Justeringsrutor som fyller i belopp (summorutorna räknas fram). */
export type NeJusteringsRuta =
  | "R13"
  | "R14"
  | "R15"
  | "R16"
  | "R18"
  | "R19"
  | "R20"
  | "R22"
  | "R23"
  | "R24"
  | "R25"
  | "R26"
  | "R27"
  | "R28"
  | "R30"
  | "R31"
  | "R32"
  | "R34"
  | "R36"
  | "R37"
  | "R38"
  | "R39"
  | "R40"
  | "R41"
  | "R43"
  | "R44"
  | "R45"
  | "R46";

/** En rad i avsnittet "Skattemässiga justeringar", i blankettordning. */
export type NeJusteringsrad = {
  ruta: string;
  beskrivning: string;
  /** Ifyllnadsbelopp för justeringsrutor (alltid positivt), ackumulerad
   *  summa för summorutor. */
  belopp: number;
  /** Summorutorna R12, R17, R21, R29, R33, R35, R42 och R47/R48. */
  summa: boolean;
  /** true = kan inte räknas fram ur bokföringen, fylls i för hand. */
  manuell: boolean;
  konton: Array<NeKontoRad>;
};

export type NeBilaga = {
  year: string;
  /** Balansräkningen B1–B16, utgående balans vid årets slut. */
  balans: Array<NeBalansRad>;
  intakter: Array<NeRad>; // R1–R4
  kostnader: Array<NeRad>; // R5–R10
  /** R11 — intäkter minus kostnader. Positivt = vinst. */
  bokfortResultat: number;
  /** Skattemässiga justeringar R12–R48, i blankettordning. */
  justeringar: Array<NeJusteringsrad>;
  /** Skattemässigt resultat efter R12–R46. Positivt = R47 överskott,
   *  negativt = R48 underskott. */
  skattemassigtResultat: number;
  varningar: Array<string>;
};

/**
 * Använda deklarationsuppgifter för rutor som inte går att läsa ur
 * bokföringen — räntefördelning, egenavgifter och periodiseringsfond.
 * Saknas uppgifter förblir rutorna manuella, precis som förr.
 *
 * Obs: egenavgifter ska egentligen beräknas på det gemensamma resultatet
 * över alla verksamheter (IL 14 kap 12 §); tills den sammanslagna vyn finns
 * (PLAN.md punkt 4) används denna journals resultat.
 */
export type NeDeklarationsVal = {
  rantefordelning?: {
    /** Kapitalunderlaget vid föregående års utgång (justerat eget kapital). */
    kapitalunderlag: number;
    /** Överskrivning av tabellvärdet för statslåneräntan. */
    slrOverskrivning?: number;
  };
  egenavgifter?: {
    kategori: EgenavgiftsKategori;
    /** Föregående års medgivna avdrag (schablon) → R40. */
    foregaendeArsSchablonavdrag?: number;
    /** Föregående års påförda egenavgifter → R41. */
    foregaendeArsPafort?: number;
  };
  periodiseringsfond?: {
    /** Tidigare års fonder — behövs för återföring i R32. */
    fonder: Array<PeriodiseringsFond>;
    /** Årets avsättning; default är maximalt (30 % av R33) → R34. */
    onskadAvsattning?: number;
  };
  expansionsfond?: {
    /** Kapitalunderlaget vid årets utgång (SKV 2196). */
    kapitalunderlag?: number;
    /** Kvarstående avsättningar från tidigare år, positivt. */
    befintligtSaldo?: number;
    /** Önskad ändring: positivt = avsättning (R36),
     *  negativt = återföring (R37). */
    onskadAndring?: number;
  };
};

type NeMappning = {
  ruta: NeRuta;
  beskrivning: string;
  intervall: Array<[start: number, slut: number]>;
  /** Kostnadskonton bokförs i debet (positivt); intäktskonton i kredit,
   *  så tecknet byts vid summeringen. */
  kostnad: boolean;
};

type NeBalansMappning = {
  ruta: NeBalansRuta;
  beskrivning: string;
  intervall: Array<[start: number, slut: number]>;
  /** Tillgångar visas med debetsaldo som positivt, eget kapital/skulder med
   *  kreditsaldo som positivt. */
  tecken: 1 | -1;
};

/**
 * Rutor som inte går att räkna fram ur kontosaldon. R3 avser förmånsvärden
 * som beskattas hos näringsidkaren och som saknar eget BAS-konto — de fylls
 * i för hand i deklarationen.
 *
 * Obs: BAS 3200–3299 är "Försäljning VMB och omvänd moms" och alltså
 * försäljning, inte förmåner. Det intervallet hör till R1.
 */
export const MANUELLA_NE_RUTOR = new Set<NeRuta>(["R3"]);

/** Matchas i ordning — smala intervall (3100, 7820) ligger före de breda de
 *  överlappar, så första träff avgör rutan. */
const NE_MAPPNINGAR: Array<NeMappning> = [
  {
    ruta: "R2",
    beskrivning: "Momsfria intäkter",
    intervall: [
      [3100, 3100],
      [3900, 3999],
    ],
    kostnad: false,
  },
  {
    ruta: "R3",
    beskrivning: "Bil- och bostadsförmån m.m.",
    intervall: [],
    kostnad: false,
  },
  {
    ruta: "R1",
    beskrivning:
      "Försäljning och utfört arbete samt övriga momspliktiga intäkter",
    intervall: [
      [3000, 3599],
      [3700, 3799],
    ],
    kostnad: false,
  },
  {
    ruta: "R4",
    beskrivning: "Ränteintäkter m.m.",
    intervall: [[8310, 8330]],
    kostnad: false,
  },
  {
    ruta: "R5",
    beskrivning: "Varor, material och tjänster",
    intervall: [[4000, 4990]],
    kostnad: true,
  },
  {
    ruta: "R6",
    beskrivning: "Övriga externa kostnader",
    // BAS kopplingstabell NE_EJ_K1_17: R6 = 50xx–69xx. Taket ska alltså
    // inte gå vid 6990 — 6991–6999 (bl.a. 6992 ej avdragsgilla kostnader)
    // hör hemma här.
    intervall: [
      [5000, 6999],
      [7970, 7970],
    ],
    kostnad: true,
  },
  {
    ruta: "R7",
    beskrivning: "Anställd personal",
    intervall: [[7000, 7699]],
    kostnad: true,
  },
  {
    ruta: "R8",
    beskrivning: "Räntekostnader m.m.",
    intervall: [[8400, 8499]],
    kostnad: true,
  },
  {
    ruta: "R9",
    beskrivning: "Avskrivningar byggnader och markanläggningar",
    // Hela 782x-gruppen hör hit: 7820 (samlingskonto), 7821 byggnader,
    // 7824 markanläggningar, 7829 övriga byggnader. Bara 7820 räcker inte —
    // bokför man ladugårdsavskrivningen på 7821 hamnar den annars i R10.
    intervall: [[7820, 7829]],
    kostnad: true,
  },
  {
    ruta: "R10",
    beskrivning:
      "Avskrivningar maskiner, inventarier och immateriella tillgångar",
    intervall: [
      [7700, 7819],
      [7830, 7899],
    ],
    kostnad: true,
  },
];

function hittaMappning(konto: number): NeMappning | undefined {
  return NE_MAPPNINGAR.find((mappning) =>
    mappning.intervall.some(([start, slut]) => konto >= start && konto <= slut),
  );
}

/** Balansräkningens B1–B16 enligt BAS kopplingstabell NE_EJ_K1. */
const BALANS_MAPPNINGAR: Array<NeBalansMappning> = [
  {
    ruta: "B1",
    beskrivning: "Immateriella anläggningstillgångar",
    intervall: [[1000, 1099]],
    tecken: 1,
  },
  {
    ruta: "B2",
    beskrivning: "Byggnader och markanläggningar",
    intervall: [
      [1100, 1129],
      [1150, 1179],
      [1190, 1199],
    ],
    tecken: 1,
  },
  {
    ruta: "B3",
    beskrivning: "Mark och andra tillgångar som inte får skrivas av",
    intervall: [
      [1130, 1149],
      [1180, 1189],
      [1291, 1291],
    ],
    tecken: 1,
  },
  {
    ruta: "B4",
    beskrivning: "Maskiner och inventarier",
    intervall: [
      [1200, 1290],
      [1292, 1299],
    ],
    tecken: 1,
  },
  {
    ruta: "B5",
    beskrivning: "Övriga anläggningstillgångar",
    intervall: [[1300, 1399]],
    tecken: 1,
  },
  {
    ruta: "B6",
    beskrivning: "Varulager",
    intervall: [[1400, 1499]],
    tecken: 1,
  },
  {
    ruta: "B7",
    beskrivning: "Kundfordringar",
    intervall: [[1500, 1599]],
    tecken: 1,
  },
  {
    ruta: "B8",
    beskrivning: "Övriga fordringar",
    intervall: [[1600, 1899]],
    tecken: 1,
  },
  {
    ruta: "B9",
    beskrivning: "Kassa och bank",
    intervall: [[1900, 1999]],
    tecken: 1,
  },
  {
    ruta: "B10",
    beskrivning: "Eget kapital",
    intervall: [
      [2010, 2019],
      [2050, 2059],
    ],
    tecken: -1,
  },
  {
    ruta: "B11",
    beskrivning: "Obeskattade reserver",
    intervall: [[2100, 2199]],
    tecken: -1,
  },
  {
    ruta: "B12",
    beskrivning: "Avsättningar",
    intervall: [[2200, 2299]],
    tecken: -1,
  },
  {
    ruta: "B13",
    beskrivning: "Låneskulder",
    intervall: [
      [2300, 2399],
      [2410, 2419],
      [2480, 2489],
    ],
    tecken: -1,
  },
  {
    ruta: "B14",
    beskrivning: "Skatteskulder",
    intervall: [],
    tecken: -1,
  },
  {
    ruta: "B15",
    beskrivning: "Leverantörsskulder",
    intervall: [
      [2440, 2449],
      [2460, 2479],
    ],
    tecken: -1,
  },
  {
    ruta: "B16",
    beskrivning: "Övriga skulder",
    intervall: [
      [2420, 2439],
      [2450, 2459],
      [2490, 2499],
      [2600, 2999],
    ],
    tecken: -1,
  },
];

function hittaBalansMappning(konto: number): NeBalansMappning | undefined {
  return BALANS_MAPPNINGAR.find((mappning) =>
    mappning.intervall.some(([start, slut]) => konto >= start && konto <= slut),
  );
}

/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
const arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;

/**
 * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13
 * (Skatteverkets exempel: representation, föreningsavgifter, böter och
 * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —
 * R13 är en återläggning ovanpå schemat, ingen omflyttning.
 *
 * 6072 (representation) och 7632 (personalrepresentation) är uttryckligen
 * dubbelmappade i BAS kopplingstabell ("R6/R7 + NE sid. 2"); 6982
 * (föreningsavgifter), 6992 (övriga kostnader, t.ex. böter och
 * skattetillägg) och 7622 (sjuk- och hälsovård) bär namnet "ej
 * avdragsgill/a" i BAS-kontoplanen.
 */
const EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622, 7632];

/** Bokförda intäkter som inte ska tas upp dras av i R14. 8314 Skattefria
 *  ränteintäkter är dubbelmappad i BAS kopplingstabell ("R4 + NE sid. 2"). */
const EJ_BESKATTBARA_INTAKTER = [8314];

type JusteringsSpec = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  /** +1 ökar det skattemässiga resultatet, −1 minskar. */
  tecken: 1 | -1;
};

/** Justeringsrutorna i blankettordning, med tecknet från SKV 2161. */
const JUSTERINGAR: Array<JusteringsSpec> = [
  {
    ruta: "R13",
    beskrivning: "Bokförda kostnader som inte ska dras av",
    tecken: 1,
  },
  {
    ruta: "R14",
    beskrivning: "Bokförda intäkter som inte ska tas upp",
    tecken: -1,
  },
  {
    ruta: "R15",
    beskrivning: "Intäkter som inte bokförts men som ska tas upp",
    tecken: 1,
  },
  {
    ruta: "R16",
    beskrivning: "Kostnader som inte bokförts men som ska dras av",
    tecken: -1,
  },
  {
    ruta: "R18",
    beskrivning: "Underskott från gemensam verksamhet eller NEA-bilaga",
    tecken: -1,
  },
  {
    ruta: "R19",
    beskrivning: "Överskott från gemensam verksamhet eller NEA-bilaga",
    tecken: 1,
  },
  { ruta: "R20", beskrivning: "Andel till medhjälpande make", tecken: -1 },
  {
    ruta: "R22",
    beskrivning: "Övriga skattemässiga justeringar – kostnader",
    tecken: -1,
  },
  {
    ruta: "R23",
    beskrivning: "Övriga skattemässiga justeringar – intäkter",
    tecken: 1,
  },
  {
    ruta: "R24",
    beskrivning: "Outnyttjat underskott från föregående beskattningsår",
    tecken: -1,
  },
  {
    ruta: "R25",
    beskrivning: "Skogs- och substansminskningsavdrag enligt bilaga N8",
    tecken: -1,
  },
  {
    ruta: "R26",
    beskrivning:
      "Återföring av värdeminskningsavdrag m.m. vid försäljning av näringsfastighet",
    tecken: 1,
  },
  {
    ruta: "R27",
    beskrivning: "Uttag från skogs-, skogsskade- eller upphovsmannakonto",
    tecken: 1,
  },
  {
    ruta: "R28",
    beskrivning: "Inbetalning till skogs-, skogsskade- eller upphovsmannakonto",
    tecken: -1,
  },
  { ruta: "R30", beskrivning: "Positiv räntefördelning", tecken: -1 },
  { ruta: "R31", beskrivning: "Negativ räntefördelning", tecken: 1 },
  { ruta: "R32", beskrivning: "Återföring av periodiseringsfond", tecken: 1 },
  {
    ruta: "R34",
    beskrivning: "Avsättning till periodiseringsfond (högst 30 % av R33)",
    tecken: -1,
  },
  { ruta: "R36", beskrivning: "Ökning av expansionsfond", tecken: -1 },
  { ruta: "R37", beskrivning: "Minskning av expansionsfond", tecken: 1 },
  { ruta: "R38", beskrivning: "Avdrag för pensionssparande", tecken: -1 },
  {
    ruta: "R39",
    beskrivning: "Särskild löneskatt på pensionssparavdrag (24,26 % av R38)",
    tecken: -1,
  },
  {
    ruta: "R40",
    beskrivning:
      "Medgivet avdrag för egenavgifter och särskild löneskatt föregående år",
    tecken: 1,
  },
  {
    ruta: "R41",
    beskrivning: "Påförda egenavgifter och särskild löneskatt föregående år",
    tecken: -1,
  },
  {
    ruta: "R43",
    beskrivning:
      "Årets beräknade avdrag för egenavgifter och särskild löneskatt",
    tecken: -1,
  },
  {
    ruta: "R44",
    beskrivning: "Sjukpenning som hör till näringsverksamheten",
    tecken: 1,
  },
  { ruta: "R45", beskrivning: "Allmänt avdrag", tecken: 1 },
  { ruta: "R46", beskrivning: "Underskott som utnyttjas i kapital", tecken: 1 },
];

/** Summorutorna och var i kedjan de ligger (efter vilken justeringsruta). */
const SUMRUTOR: Array<{
  efter: NeJusteringsRuta | "R12";
  ruta: string;
  beskrivning: string;
}> = [
  { efter: "R12", ruta: "R12", beskrivning: "Bokfört resultat" },
  {
    efter: "R16",
    ruta: "R17",
    beskrivning: "Sammanlagt resultat av verksamheten",
  },
  {
    efter: "R20",
    ruta: "R21",
    beskrivning: "Min andel av resultatet från verksamheten/erna",
  },
  {
    efter: "R28",
    ruta: "R29",
    beskrivning: "Överskott/underskott före räntefördelning",
  },
  {
    efter: "R32",
    ruta: "R33",
    beskrivning: "Överskott/underskott före avsättning till periodiseringsfond",
  },
  {
    efter: "R34",
    ruta: "R35",
    beskrivning: "Överskott/underskott före ökning av expansionsfond",
  },
  {
    efter: "R41",
    ruta: "R42",
    beskrivning: "Överskott/underskott före årets avdrag för egenavgifter",
  },
];

/**
 * Bygger avsnittet "Skattemässiga justeringar" (R12–R48) ur bokfört
 * resultat och saldon. R13 och R14 räknas fram ur kontosaldon; räntefördelning
 * (R30/R31), periodiseringsfond (R32/R34) och egenavgifter (R40–R43) styrs av
 * användarens deklarationsuppgifter — resten är manuella.
 */
function byggJusteringar(
  saldon: Map<number, number>,
  bokfortResultat: number,
  val: NeDeklarationsVal,
  year: string,
): {
  rader: Array<NeJusteringsrad>;
  skattemassigtResultat: number;
  varningar: Array<string>;
} {
  const kontonamn = (konto: number) =>
    aliases.value.find((alias) => alias.id === konto)?.to ?? "";

  const beraknade: Array<{
    ruta: NeJusteringsRuta;
    konton: Array<number>;
    /** Kostnader bokförs i debet, intäkter i kredit — ifyllnadsbeloppet
     *  på blanketten är alltid positivt. */
    kostnad: boolean;
  }> = [
    { ruta: "R13", konton: EJ_AVDRAGSGILLA, kostnad: true },
    { ruta: "R14", konton: EJ_BESKATTBARA_INTAKTER, kostnad: false },
  ];

  const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>();

  for (const { ruta, konton, kostnad } of beraknade) {
    let summa = 0;
    const kontoRader: Array<NeKontoRad> = [];

    for (const konto of konton) {
      const saldo = saldon.get(konto) ?? 0;

      if (Math.abs(saldo) < 0.005) {
        continue;
      }

      const belopp = kostnad ? saldo : -saldo;
      summa += belopp;
      kontoRader.push({
        konto,
        namn: kontonamn(konto),
        belopp: Math.round(belopp),
      });
    }

    beraknat.set(ruta, {
      ruta,
      beskrivning: "",
      belopp: Math.round(summa),
      summa: false,
      manuell: false,
      konton: kontoRader,
    });
  }

  /**
   * Deklarationsbaserade rutor — ifyllnadsbelopp som styrs av användarens
   * uppgifter i stället för bokföringen. R30/R31 (räntefördelning), R34 och
   * R43 beräknas lazy i loopen eftersom deras underlag först står klart där
   * kedjan nått fram.
   */
  const deklarationer = new Map<NeJusteringsRuta, number>();
  const justeringsVarningar: Array<string> = [];

  /** Räntefördelningsförslaget appliceras i loopen — positiv räntefördelning
   *  får nämligen inte överstiga resultatet före räntefördelning (R29). */
  let rfForslag: ReturnType<typeof beraknaRantefordelning> = null;

  if (val.rantefordelning) {
    rfForslag = beraknaRantefordelning({
      kapitalunderlag: val.rantefordelning.kapitalunderlag,
      slrSats: val.rantefordelning.slrOverskrivning ?? slrForAr(Number(year)),
    });

    if (rfForslag) {
      justeringsVarningar.push(...rfForslag.varningar);
    }
  }

  /** Expansionsfondens 125,94 %-tak läses här; taket mot inkomsten (R35)
   *  appliceras i loopen, där ackumulerat är exakt R35 vid R36. */
  let efForslag: ReturnType<typeof beraknaExpansionsfondAndring> = null;

  if (val.expansionsfond) {
    efForslag = beraknaExpansionsfondAndring({
      kapitalunderlag: val.expansionsfond.kapitalunderlag,
      befintligtSaldo: val.expansionsfond.befintligtSaldo,
      onskadAndring: val.expansionsfond.onskadAndring,
    });

    if (efForslag) {
      justeringsVarningar.push(...efForslag.varningar);
    }
  }

  if (val.periodiseringsfond) {
    for (const rad of proposeraPfondAterforing({
      fonder: val.periodiseringsfond.fonder,
      ar: Number(year),
    })) {
      deklarationer.set("R32", (deklarationer.get("R32") ?? 0) + rad.belopp);
      justeringsVarningar.push(...rad.varningar);
    }
  }

  if (val.egenavgifter) {
    deklarationer.set("R40", val.egenavgifter.foregaendeArsSchablonavdrag ?? 0);
    deklarationer.set("R41", val.egenavgifter.foregaendeArsPafort ?? 0);
  }

  const rader: Array<NeJusteringsrad> = [];
  let ackumulerat = bokfortResultat;
  let summaIndex = 0;
  /** Underlaget till R43 — kedjans värde precis före R40 läggs på. */
  let basForeR40 = bokfortResultat;

  const skjutUtSummorFramtill = (efter: string) => {
    while (
      summaIndex < SUMRUTOR.length &&
      SUMRUTOR[summaIndex].efter === efter
    ) {
      const summa = SUMRUTOR[summaIndex++];
      rader.push({
        ruta: summa.ruta,
        beskrivning: summa.beskrivning,
        belopp: ackumulerat,
        summa: true,
        manuell: false,
        konton: [],
      });
    }
  };

  skjutUtSummorFramtill("R12");

  for (const spec of JUSTERINGAR) {
    let rad = beraknat.get(spec.ruta);

    if (!rad && deklarationer.has(spec.ruta)) {
      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp: deklarationer.get(spec.ruta)!,
        summa: false,
        manuell: false,
        konton: [],
      };
    }

    // Positiv räntefördelning får inte skapa underskott — avdraget är
    // högst resultatet före räntefördelningen (R29). Överskjutande belopp
    // blir sparat fördelningsbelopp och kan användas senare år.
    if (!rad && spec.ruta === "R30" && rfForslag?.riktning === "positiv") {
      const tak = Math.max(0, ackumulerat);
      const belopp = Math.min(rfForslag.belopp, tak);

      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp,
        summa: false,
        manuell: false,
        konton: [],
      };

      if (belopp < rfForslag.belopp) {
        justeringsVarningar.push(
          `Positiv räntefördelning begränsades till resultatet före räntefördelning (R29). ${rfForslag.belopp - belopp} kr sparas som sparat fördelningsbelopp till kommande år.`,
        );
      }
    }

    if (!rad && spec.ruta === "R31" && rfForslag?.riktning === "negativ") {
      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp: rfForslag.belopp,
        summa: false,
        manuell: false,
        konton: [],
      };
    }

    // R34:s tak är 30 % av R33 — och ackumulerat är exakt R33 här, eftersom
    // summorutan ligger mellan R32 och R34 i blankettordningen.
    if (!rad && spec.ruta === "R34" && val.periodiseringsfond) {
      const forslag = proposeraPfondAvsattning({
        overskott: ackumulerat,
        onskatBelopp: val.periodiseringsfond.onskadAvsattning,
      });

      if (forslag) {
        rad = {
          ruta: spec.ruta,
          beskrivning: "",
          belopp: forslag.belopp,
          summa: false,
          manuell: false,
          konton: [],
        };
        justeringsVarningar.push(...forslag.varningar);
      }
    }

    // Avsättning till expansionsfond får vara högst inkomsten före avsättning
    // (R35) — ackumulerat är exakt R35 här, precis som vid R34-taket.
    if (!rad && spec.ruta === "R36" && efForslag?.riktning === "avsattning") {
      const tak = Math.max(0, ackumulerat);

      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp: Math.min(efForslag.belopp, tak),
        summa: false,
        manuell: false,
        konton: [],
      };

      if (tak < efForslag.belopp) {
        justeringsVarningar.push(
          `Avsättning till expansionsfond begränsades till resultatet före avsättning (R35). ${efForslag.belopp - tak} kr kan inte sättas av i år.`,
        );
      }
    }

    if (!rad && spec.ruta === "R37" && efForslag?.riktning === "aterforing") {
      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp: efForslag.belopp,
        summa: false,
        manuell: false,
        konton: [],
      };
    }

    // R43 räknas på underlaget före föregående års poster — med R40/R41
    // tillämpade blir det samma nettoöverskott som summorutan R42.
    if (!rad && spec.ruta === "R43" && val.egenavgifter) {
      const forslag = beraknaEgenavgifter({
        overskottForeEgenavgifter: basForeR40,
        kategori: val.egenavgifter.kategori,
        foregaendeArsSchablonavdrag:
          val.egenavgifter.foregaendeArsSchablonavdrag ?? 0,
        foregaendeArsPafort: val.egenavgifter.foregaendeArsPafort ?? 0,
      });

      rad = {
        ruta: spec.ruta,
        beskrivning: "",
        belopp: forslag.schablonavdrag,
        summa: false,
        manuell: false,
        konton: [],
      };
      justeringsVarningar.push(...forslag.varningar);
    }

    if (spec.ruta === "R40") {
      basForeR40 = ackumulerat;
    }

    rad ??= {
      ruta: spec.ruta,
      beskrivning: "",
      belopp: 0,
      summa: false,
      manuell: true,
      konton: [],
    };

    rad.beskrivning = spec.beskrivning;
    ackumulerat += spec.tecken * rad.belopp;
    rader.push(rad);
    skjutUtSummorFramtill(spec.ruta);
  }

  // R47/R48 — samma tal, tecknet avgör vilken ruta som fylls i
  const overskott = ackumulerat >= 0;
  rader.push({
    ruta: overskott ? "R47" : "R48",
    beskrivning: overskott ? "Överskott" : "Underskott",
    belopp: Math.abs(ackumulerat),
    summa: true,
    manuell: false,
    konton: [],
  });

  return {
    rader,
    skattemassigtResultat: ackumulerat,
    varningar: justeringsVarningar,
  };
}

/** Årets resultat — används i omföringen vid bokslut. En transaktion som rör
 *  8999 är en resultatdisposition och ska inte räknas med i räkenskapsschemat
 *  (den skulle nolla resultatkontona). */
const RESULTATDISPOSITION_KONTO = 8999;

function byggBalansRader(
  saldon: Map<number, number>,
  resultatSaldo: number,
  kontonamn: (konto: number) => string,
): Array<NeBalansRad> {
  const rader = new Map<NeBalansRuta, NeBalansRad>(
    BALANS_MAPPNINGAR.map((mappning) => [
      mappning.ruta,
      {
        ruta: mappning.ruta,
        beskrivning: mappning.beskrivning,
        belopp: 0,
        konton: [],
      },
    ]),
  );

  const radFor = (ruta: NeBalansRuta): NeBalansRad => {
    const rad = rader.get(ruta);

    if (!rad) {
      throw new Error(`Intern fel: NE-ruta ${ruta} saknas i balansräkningen`);
    }

    return rad;
  };

  for (const [konto, saldo] of [...saldon.entries()].sort(
    ([a], [b]) => a - b,
  )) {
    if (Math.abs(saldo) < 0.005) {
      continue;
    }

    const mappning = hittaBalansMappning(konto);

    if (!mappning) {
      continue;
    }

    const belopp = mappning.tecken * saldo;
    const rad = radFor(mappning.ruta);

    rad.belopp += belopp;
    rad.konton.push({
      konto,
      namn: kontonamn(konto),
      belopp: Math.round(belopp),
    });
  }

  const aretsResultat = Math.round(-resultatSaldo);
  if (aretsResultat !== 0) {
    const rad = radFor("B10");
    rad.belopp += aretsResultat;
    rad.konton.push({
      konto: RESULTATDISPOSITION_KONTO,
      namn: "Beräknat resultat som inte omförts",
      belopp: aretsResultat,
    });
  }

  for (const rad of rader.values()) {
    rad.belopp = Math.round(rad.belopp);
  }

  return BALANS_MAPPNINGAR.map((mappning) => radFor(mappning.ruta));
}

export function generateNeBilaga(
  year: string,
  val: NeDeklarationsVal = {},
): NeBilaga {
  const saldon = new Map<number, number>();
  const balansSaldon = new Map<number, number>();
  let balanseratResultat = 0;

  for (const tx of transactions.value) {
    const txYear = tx.date.slice(0, 4);

    if (txYear > year) {
      continue;
    }

    for (const posting of tx.postings) {
      if (posting.account >= 3000) {
        balanseratResultat += posting.amount;
      } else {
        balansSaldon.set(
          posting.account,
          (balansSaldon.get(posting.account) ?? 0) + posting.amount,
        );
      }
    }
  }

  for (const tx of transactions.value) {
    if (tx.date.slice(0, 4) !== year) {
      continue;
    }

    if (
      tx.postings.some(
        (posting) => posting.account === RESULTATDISPOSITION_KONTO,
      )
    ) {
      continue;
    }

    for (const posting of tx.postings) {
      if (!arResultatkonto(posting.account)) {
        continue;
      }

      saldon.set(
        posting.account,
        (saldon.get(posting.account) ?? 0) + posting.amount,
      );
    }
  }

  const kontonamn = (konto: number) =>
    aliases.value.find((alias) => alias.id === konto)?.to ?? "";

  const balans = byggBalansRader(balansSaldon, balanseratResultat, kontonamn);

  const rader = new Map<NeRuta, NeRad>(
    NE_MAPPNINGAR.map((mappning) => [
      mappning.ruta,
      {
        ruta: mappning.ruta,
        beskrivning: mappning.beskrivning,
        belopp: 0,
        konton: [],
      },
    ]),
  );

  const omappade: Array<number> = [];

  // Alla NE_MAPPNINGAR-rutor är förhandskapade i rader, så detta kan
  // inte misslyckas — kastar ändå istället för att lita på en !-assertion.
  const radFor = (ruta: NeRuta): NeRad => {
    const rad = rader.get(ruta);

    if (!rad) {
      throw new Error(`Intern fel: NE-ruta ${ruta} saknas i räkenskapsschemat`);
    }

    return rad;
  };

  for (const [konto, saldo] of [...saldon.entries()].sort(
    ([a], [b]) => a - b,
  )) {
    if (Math.abs(saldo) < 0.005) {
      continue;
    }

    const mappning = hittaMappning(konto);

    if (!mappning) {
      omappade.push(konto);
      continue;
    }

    const belopp = mappning.kostnad ? saldo : -saldo;
    const rad = radFor(mappning.ruta);

    // Summera exakt — avrundas per ruta efter loopen, annars kan
    // öresavrundningar per konto driva iväg R11 från bokfört resultat
    rad.belopp += belopp;
    rad.konton.push({
      konto,
      namn: kontonamn(konto),
      belopp: Math.round(belopp),
    });
  }

  // Skatteverket vill ha hela kronor på blanketten
  for (const rad of rader.values()) {
    rad.belopp = Math.round(rad.belopp);
  }

  const iOrdning = (rutor: Array<NeRuta>) => rutor.map(radFor);

  const intakter = iOrdning(["R1", "R2", "R3", "R4"]);
  const kostnader = iOrdning(["R5", "R6", "R7", "R8", "R9", "R10"]);

  const summaIntakter = intakter.reduce((sum, rad) => sum + rad.belopp, 0);
  const summaKostnader = kostnader.reduce((sum, rad) => sum + rad.belopp, 0);

  const varningar: Array<string> = [];

  if (omappade.length > 0) {
    varningar.push(
      `Konton utan NE-ruta (räknas inte med): ${omappade.join(", ")}. ` +
        "Kontrollera var de hör hemma i räkenskapsschemat.",
    );
  }

  const bokfortResultat = summaIntakter - summaKostnader;
  const {
    rader: justeringar,
    skattemassigtResultat,
    varningar: justeringsVarningar,
  } = byggJusteringar(saldon, bokfortResultat, val, year);

  return {
    year,
    balans,
    intakter,
    kostnader,
    bokfortResultat,
    justeringar,
    skattemassigtResultat,
    varningar: [...varningar, ...justeringsVarningar],
  };
}
