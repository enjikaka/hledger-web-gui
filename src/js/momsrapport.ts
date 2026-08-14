import type { Posting, Transaction } from "./parse-journal-file";
import { transactions } from "./signals";

const UTGAENDE_MOMS_KONTON = [2611, 2621, 2631];
const INGAENDE_MOMS_KONTO = 2640;
const MOMSKONTON = [...UTGAENDE_MOMS_KONTON, INGAENDE_MOMS_KONTO];

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

export interface Momsrapport {
  year: string;
  momspliktigForsaljning: number;
  utgaendeMoms25: number;
  utgaendeMoms12: number;
  utgaendeMoms6: number;
  ingaendeMoms: number;
  nettoMoms: number;
}

export function generateMomsrapport(year: string): Momsrapport {
  // Filter transactions for the specified period. Momsomföringar exkluderas
  // så att rapporten fortsätter visa periodens verkliga moms även efter att
  // deklarationen bokförts (annars skulle allt summera till noll).
  const periodTransactions = transactions.value.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === parseInt(year) && !arMomsomforing(tx);
  });

  let momspliktigForsaljning = 0;
  let utgaendeMoms25 = 0;
  let utgaendeMoms12 = 0;
  let utgaendeMoms6 = 0;
  let ingaendeMoms = 0;

  // Summera signerat: intäkter och utgående moms bokförs i kredit (negativt),
  // så tecknet byts vid summeringen. Kreditnotor/rättelser dras då av korrekt.
  periodTransactions.forEach((tx) => {
    tx.postings.forEach((posting) => {
      const account = posting.account;
      const amount = posting.amount;

      // Ruta 05: Momspliktig försäljning
      if ([3000, 3001, 3002].includes(account)) {
        momspliktigForsaljning -= amount;
      }

      // Ruta 10: Utgående moms 25 %
      if (account === 2611) {
        utgaendeMoms25 -= amount;
      }

      // Ruta 11: Utgående moms 12 %
      if (account === 2621) {
        utgaendeMoms12 -= amount;
      }

      // Ruta 12: Utgående moms 6 %
      if (account === 2631) {
        utgaendeMoms6 -= amount;
      }

      // Ruta 48: Ingående moms (bokförs i debet, positivt)
      if (account === 2640) {
        ingaendeMoms += amount;
      }
    });
  });

  // Calculate netto moms (output VAT - input VAT)
  const nettoMoms = utgaendeMoms25 + utgaendeMoms12 + utgaendeMoms6 - ingaendeMoms;

  return {
    year,
    momspliktigForsaljning,
    utgaendeMoms25,
    utgaendeMoms12,
    utgaendeMoms6,
    ingaendeMoms,
    nettoMoms,
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
    if (arMomsomforing(tx) && (!omforingsAr || tx.date.slice(0, 4) > omforingsAr)) {
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

  return {
    uuid: crypto.randomUUID(),
    date: datum,
    description: skuld.attBetala
      ? "Momsinbetalning till Skatteverket"
      : "Återbetalning av moms från Skatteverket",
    postings: [
      posting(skuld.konto, -skuld.saldoOre),
      posting(motkonto, skuld.saldoOre),
    ],
  };
}

/**
 * Skapar momsomföringen som avslutar årets momsredovisning, samma verifikat
 * som Bokio bokför automatiskt:
 *  - varje momskonto (2611/2621/2631/2640) nollas på öret,
 *  - nettot bokförs i hela kronor (öretalen faller bort, SFL 22 kap 1 §)
 *    på 2650 i kredit (att betala) eller 1650 i debet (att återfå),
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

  // Positivt netto = moms att betala. Öretalen faller bort (trunkering mot
  // noll), så 2650/1650 alltid matchar beloppet i deklarationen.
  const deklareratOre = Math.trunc(nettoOre / 100) * 100;

  if (deklareratOre > 0) {
    postings.push(posting(REDOVISNINGSKONTO_MOMS, -deklareratOre));
  } else if (deklareratOre < 0) {
    postings.push(posting(MOMSFORDRAN, -deklareratOre));
  }

  const gapOre = nettoOre - deklareratOre;

  if (gapOre !== 0) {
    postings.push(posting(ORESUTJAMNING, -gapOre));
  }

  return {
    uuid: crypto.randomUUID(),
    date: `${year}-12-31`,
    description: `Momsredovisning ${year}`,
    postings,
  };
}
