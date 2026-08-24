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

type NeMappning = {
  ruta: NeRuta;
  beskrivning: string;
  intervall: Array<[start: number, slut: number]>;
  /** Kostnadskonton bokförs i debet (positivt); intäktskonton i kredit,
   *  så tecknet byts vid summeringen. */
  kostnad: boolean;
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
 * resultat och saldon. Bara R13 och R14 räknas fram ur kontosaldon —
 * resten är manuella tills dess att egenavgifter, räntefördelning och
 * fonder implementerats (se PLAN.md).
 */
function byggJusteringar(
  saldon: Map<number, number>,
  bokfortResultat: number,
): { rader: Array<NeJusteringsrad>; skattemassigtResultat: number } {
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

  const rader: Array<NeJusteringsrad> = [];
  let ackumulerat = bokfortResultat;
  let summaIndex = 0;

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
    const rad = beraknat.get(spec.ruta) ?? {
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

  return { rader, skattemassigtResultat: ackumulerat };
}

/** Årets resultat — används i omföringen vid bokslut. En transaktion som rör
 *  8999 är en resultatdisposition och ska inte räknas med i räkenskapsschemat
 *  (den skulle nolla resultatkontona). */
const RESULTATDISPOSITION_KONTO = 8999;

export function generateNeBilaga(year: string): NeBilaga {
  const saldon = new Map<number, number>();

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
  const { rader: justeringar, skattemassigtResultat } = byggJusteringar(
    saldon,
    bokfortResultat,
  );

  return {
    year,
    intakter,
    kostnader,
    bokfortResultat,
    justeringar,
    skattemassigtResultat,
    varningar,
  };
}
