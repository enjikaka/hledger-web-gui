import {
  arKreditnormal,
  INGAENDE_RUTOR,
  KONTO_RUTA,
  MOMSKONTON,
  type MomsRuta,
  RUTA_BESKRIVNING,
  UTGAENDE_RUTOR,
} from "./moms-rutor";
import type { Posting, Transaction } from "./parse-journal-file";
import { transactions } from "./signals";
import { numrera } from "./verifikat";

/** Redovisningskonto för moms — nettot att betala bokförs hit i kredit. */
export const REDOVISNINGSKONTO_MOMS = 2650;
/** Momsfordran — moms att återfå bokförs hit i debet. */
export const MOMSFORDRAN = 1650;
/** Öres- och kronutjämning — tar upp öresgapet när nettot avrundas till hela kronor. */
export const ORESUTJAMNING = 3740;

/**
 * Motkonton vid betalning/återbetalning av moms. Pengarna går normalt via
 * företagskontot eller skattekontot, men låter man dem gå till eller från
 * privat konto bokförs det mot eget kapital i stället.
 *
 * Vilket kapitalkonto som gäller beror på riktningen: en återbetalning som
 * hamnar privat är ett eget uttag, en inbetalning ur egen ficka en egen
 * insättning. Bara det relevanta av dem erbjuds.
 */
export function momsMotkonton(
  attBetala: boolean,
): Array<{ konto: number; namn: string }> {
  return [
    { konto: 1930, namn: "1930 Företagskonto" },
    { konto: 1630, namn: "1630 Skattekonto" },
    attBetala
      ? { konto: 2018, namn: "2018 Egen insättning (betald privat)" }
      : { konto: 2013, namn: "2013 Eget uttag (till privat konto)" },
  ];
}

/** En momsomföring nollar momskontona mot 2650/1650. Betalningen av momsen
 *  (2650 mot 1930) rör inga momskonton och matchar därför inte. */
export function arMomsomforing(tx: Transaction): boolean {
  const konton = new Set(tx.postings.map((posting) => posting.account));
  return (
    (konton.has(REDOVISNINGSKONTO_MOMS) || konton.has(MOMSFORDRAN)) &&
    MOMSKONTON.some((konto) => konton.has(konto))
  );
}

export interface Momsrad {
  ruta: MomsRuta;
  beskrivning: string;
  belopp: number;
}

export interface Momsrapport {
  year: string;
  /** Belopp per ruta. Rutor utan rörelse saknas i mappen. */
  rutor: Map<MomsRuta, number>;
  /** Ruta 49: utgående moms minus ingående. Positivt = att betala. */
  nettoMoms: number;
}

/** Belopp i en ruta, 0 om den saknar rörelse. */
export const rutbelopp = (rapport: Momsrapport, ruta: MomsRuta) =>
  rapport.rutor.get(ruta) ?? 0;

export function momsrader(
  rapport: Momsrapport,
  rutor: Array<MomsRuta>,
): Array<Momsrad> {
  return rutor.map((ruta) => ({
    ruta,
    beskrivning: RUTA_BESKRIVNING[ruta],
    belopp: rutbelopp(rapport, ruta),
  }));
}

export function generateMomsrapport(year: string): Momsrapport {
  // Filter transactions for the specified period. Momsomföringar exkluderas
  // så att rapporten fortsätter visa periodens verkliga moms även efter att
  // deklarationen bokförts (annars skulle allt summera till noll).
  const periodTransactions = transactions.value.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === parseInt(year) && !arMomsomforing(tx);
  });

  // Summera signerat i ören: intäkter och utgående moms bokförs i kredit
  // (negativt) och byter tecken, inköpsunderlag och ingående moms tas som de
  // bokförs. Kreditnotor och rättelser dras därmed av korrekt.
  const oren = new Map<MomsRuta, number>();

  for (const tx of periodTransactions) {
    for (const posting of tx.postings) {
      const ruta = KONTO_RUTA[posting.account];

      if (!ruta) {
        continue;
      }

      const ore = Math.round(posting.amount * 100);

      oren.set(
        ruta,
        (oren.get(ruta) ?? 0) + (arKreditnormal(ruta) ? -ore : ore),
      );
    }
  }

  // Skatteverket tar bara hela kronor, så varje ruta avrundas här vid källan
  // (0,50 uppåt). Ruta 49 räknas sedan ur de avrundade rutorna, annars kan
  // raderna på skärmen sluta summera till nettot längst ned.
  const rutor = new Map<MomsRuta, number>();

  for (const [ruta, ore] of oren) {
    const kronor = Math.round(ore / 100);

    if (kronor !== 0) {
      rutor.set(ruta, kronor);
    }
  }

  const summa = (valda: Array<MomsRuta>) =>
    valda.reduce((total, ruta) => total + (rutor.get(ruta) ?? 0), 0);

  return {
    year,
    rutor,
    nettoMoms: summa(UTGAENDE_RUTOR) - summa(INGAENDE_RUTOR),
  };
}

export function harMomsomforing(year: string): boolean {
  return transactions.value.some(
    (tx) => tx.date.slice(0, 4) === year && arMomsomforing(tx),
  );
}

export type MomsSkuld = {
  /** 2650 (skuld) eller 1650 (fordran). */
  konto: number;
  /** Bokfört saldo i ören: negativt på 2650 = att betala,
   *  positivt på 1650 = att få tillbaka. */
  saldoOre: number;
  /** Beloppet att betala eller få tillbaka, alltid positivt. */
  beloppOre: number;
  attBetala: boolean;
  /** Året för den momsomföring som skapade saldot, eller null om ingen
   *  hittas. Styr förslaget på betaldatum — skulden hör till omföringens
   *  år, inte till det år som råkar vara valt i årsväljaren. */
  omforingsAr: string | null;
};

/**
 * Obetald moms enligt bokföringen. 2650 och 1650 är avräkningskonton som ska
 * gå tillbaka till noll när Skatteverket dragit eller betalat ut pengarna,
 * så ett kvarvarande saldo är just det som ännu inte reglerats.
 *
 * Saldot räknas över alla år: momsomföringen bokförs 31 december men
 * betalningen sker året därpå, och båda ska ingå i samma avräkning.
 */
export function momsSkuld(): MomsSkuld | null {
  let saldo2650 = 0;
  let saldo1650 = 0;
  let omforingsAr: string | null = null;

  for (const tx of transactions.value) {
    if (
      arMomsomforing(tx) &&
      (!omforingsAr || tx.date.slice(0, 4) > omforingsAr)
    ) {
      omforingsAr = tx.date.slice(0, 4);
    }

    for (const posting of tx.postings) {
      if (posting.account === REDOVISNINGSKONTO_MOMS) {
        saldo2650 += Math.round(posting.amount * 100);
      } else if (posting.account === MOMSFORDRAN) {
        saldo1650 += Math.round(posting.amount * 100);
      }
    }
  }

  const saldoOre = saldo2650 !== 0 ? saldo2650 : saldo1650;

  if (saldoOre === 0) {
    return null;
  }

  return {
    konto: saldo2650 !== 0 ? REDOVISNINGSKONTO_MOMS : MOMSFORDRAN,
    saldoOre,
    beloppOre: Math.abs(saldoOre),
    attBetala: saldoOre < 0,
    omforingsAr,
  };
}

/**
 * Skapar betalningen som reglerar momsskulden mot Skatteverket: avräknings-
 * kontot nollas och motsvarande belopp går in på eller ut från motkontot.
 *
 * Returnerar null om det inte finns någon obetald moms.
 */
export function skapaMomsbetalning(
  datum: string,
  motkonto: number,
): Transaction | null {
  const skuld = momsSkuld();

  if (!skuld) {
    return null;
  }

  const posting = (account: number, ore: number): Posting => ({
    account,
    amount: ore / 100,
    currency: "SEK",
  });

  return numrera({
    uuid: crypto.randomUUID(),
    date: datum,
    description: skuld.attBetala
      ? "Momsinbetalning till Skatteverket"
      : "Återbetalning av moms från Skatteverket",
    postings: [
      posting(skuld.konto, -skuld.saldoOre),
      posting(motkonto, skuld.saldoOre),
    ],
  });
}

/**
 * Skapar momsomföringen som avslutar årets momsredovisning, samma verifikat
 * som Bokio bokför automatiskt:
 *  - varje momskonto som deklarationen läser från nollas på öret,
 *  - nettot bokförs i hela kronor på 2650 i kredit (att betala) eller 1650
 *    i debet (att återfå) — samma belopp som ruta 49 i rapporten,
 *  - öresgapet balanseras på 3740.
 *
 * Returnerar null om det inte finns någon moms att omföra.
 */
export function skapaMomsomforing(year: string): Transaction | null {
  const saldonOre = new Map<number, number>();

  for (const tx of transactions.value) {
    if (tx.date.slice(0, 4) !== year || arMomsomforing(tx)) {
      continue;
    }

    for (const posting of tx.postings) {
      if (MOMSKONTON.includes(posting.account)) {
        saldonOre.set(
          posting.account,
          (saldonOre.get(posting.account) ?? 0) +
            Math.round(posting.amount * 100),
        );
      }
    }
  }

  const posting = (account: number, ore: number): Posting => ({
    account,
    amount: ore / 100,
    currency: "SEK",
  });

  const postings: Array<Posting> = [];
  let nettoOre = 0;

  for (const konto of MOMSKONTON) {
    const saldo = saldonOre.get(konto) ?? 0;

    if (saldo === 0) {
      continue;
    }

    postings.push(posting(konto, -saldo));
    nettoOre += -saldo;
  }

  if (postings.length === 0) {
    return null;
  }

  // Positivt netto = moms att betala. Beloppet hämtas ur rapportens ruta 49
  // i stället för att avrundas här på nytt, så att 2650/1650 alltid är exakt
  // det som fylls i deklarationen — även när rutornas egna avrundningar
  // sammantaget drar iväg något öre från råsaldot.
  const deklareratOre = Math.round(generateMomsrapport(year).nettoMoms * 100);

  if (deklareratOre > 0) {
    postings.push(posting(REDOVISNINGSKONTO_MOMS, -deklareratOre));
  } else if (deklareratOre < 0) {
    postings.push(posting(MOMSFORDRAN, -deklareratOre));
  }

  const gapOre = nettoOre - deklareratOre;

  if (gapOre !== 0) {
    postings.push(posting(ORESUTJAMNING, -gapOre));
  }

  return numrera({
    uuid: crypto.randomUUID(),
    date: `${year}-12-31`,
    description: `Momsredovisning ${year}`,
    postings,
  });
}
