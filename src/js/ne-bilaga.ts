import { aliases, transactions } from "./signals";

/**
 * NE-bilaga (Inkomst av näringsverksamhet, enskilda näringsidkare)
 *
 * Räkenskapsschemat R1–R11: BAS-kontosaldon mappas till blankettens rutor
 * enligt BAS-kontogruppens kopplingstabell "NE - Inkomst av näringsverksamhet,
 * Enskilda näringsidkare" (bas.se/kontoplaner/sru/).
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

export type NeBilaga = {
  year: string;
  intakter: Array<NeRad>; // R1–R4
  kostnader: Array<NeRad>; // R5–R10
  /** R11 — intäkter minus kostnader. Positivt = vinst. */
  bokfortResultat: number;
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

/** Matchas i ordning — smala intervall (3100, 3200-serien, 7820) ligger
 *  före de breda de överlappar, så första träff avgör rutan. */
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
    intervall: [[3200, 3299]],
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
    intervall: [
      [5000, 6990],
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
    intervall: [[7820, 7820]],
    kostnad: true,
  },
  {
    ruta: "R10",
    beskrivning:
      "Avskrivningar maskiner, inventarier och immateriella tillgångar",
    intervall: [
      [7700, 7819],
      [7821, 7899],
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
    const rad = rader.get(mappning.ruta)!;

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

  const iOrdning = (rutor: Array<NeRuta>) =>
    rutor.map((ruta) => rader.get(ruta)!);

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

  return {
    year,
    intakter,
    kostnader,
    bokfortResultat: summaIntakter - summaKostnader,
    varningar,
  };
}
