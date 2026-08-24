import type { Posting, Transaction } from "./parse-journal-file";
import { transactions } from "./signals";
import { numrera } from "./verifikat";

/**
 * Bokslutsfunktioner för enskild firma, samma automatiska verifikat som Bokio:
 *
 * 1. Årets resultat (31 dec): resultatet bokförs 8999 mot 2019 så att
 *    resultatkontona summerar till noll för året.
 * 2. Nollställning av eget kapital (1 jan året därpå): underkontona
 *    2011–2019 (egna uttag, egna insättningar, årets resultat) nollas
 *    mot 2010 Eget kapital.
 */

/** Årets resultat — resultatkontot som används i omföringen vid bokslut. */
export const ARETS_RESULTAT = 8999;
/** Årets resultat — balanskontot under eget kapital. */
export const ARETS_RESULTAT_EK = 2019;
export const EGET_KAPITAL = 2010;

const rorArsresultat = (tx: Transaction) =>
  tx.postings.some((posting) => posting.account === ARETS_RESULTAT);

const arKapitalUnderkonto = (konto: number) => konto >= 2011 && konto <= 2019;

const posting = (account: number, ore: number): Posting => ({
  account,
  amount: ore / 100,
  currency: "SEK",
});

/** Årets resultat i ören. Positivt = vinst. Transaktioner som rör 8999
 *  (tidigare resultatomföring) räknas inte med. */
export function beraknaArsresultatOre(year: string): number {
  let ore = 0;

  for (const tx of transactions.value) {
    if (tx.date.slice(0, 4) !== year || rorArsresultat(tx)) {
      continue;
    }

    for (const p of tx.postings) {
      if (p.account >= 3000 && p.account <= 8999) {
        ore += Math.round(p.amount * 100);
      }
    }
  }

  // Intäkter bokförs i kredit (negativt) — vinst blir positiv efter teckenbyte.
  // `ore === 0` fångar -0, som annars läcker ut som "−0 kr" i formatteringen.
  return ore === 0 ? 0 : -ore;
}

export function harArsresultat(year: string): boolean {
  return transactions.value.some(
    (tx) => tx.date.slice(0, 4) === year && rorArsresultat(tx),
  );
}

export function skapaArsresultatTransaktion(year: string): Transaction | null {
  const resultatOre = beraknaArsresultatOre(year);

  if (resultatOre === 0) {
    return null;
  }

  // Vinst: 8999 i debet (nollar resultaträkningen), 2019 i kredit.
  // Förlust ger omvända tecken med samma formel.
  return numrera({
    uuid: crypto.randomUUID(),
    date: `${year}-12-31`,
    description: `Årets resultat ${year}`,
    postings: [
      posting(ARETS_RESULTAT, resultatOre),
      posting(ARETS_RESULTAT_EK, -resultatOre),
    ],
  });
}

/** Nollningen för år X bokförs 1 jan år X+1 och rör 2010 plus underkonton. */
export function harNollning(year: string): boolean {
  const foljandeAr = String(parseInt(year, 10) + 1);

  return transactions.value.some((tx) => {
    if (tx.date.slice(0, 4) !== foljandeAr) {
      return false;
    }

    const konton = new Set(tx.postings.map((posting) => posting.account));
    return konton.has(EGET_KAPITAL) && [...konton].some(arKapitalUnderkonto);
  });
}

export function skapaNollningTransaktion(year: string): Transaction | null {
  // Utgående balans per underkonto t.o.m. 31 dec, ackumulerat över alla år
  // (tidigare års nollningar är daterade 1 jan och ingår i summeringen).
  const saldonOre = new Map<number, number>();

  for (const tx of transactions.value) {
    if (tx.date.slice(0, 4) > year) {
      continue;
    }

    for (const p of tx.postings) {
      if (arKapitalUnderkonto(p.account)) {
        saldonOre.set(
          p.account,
          (saldonOre.get(p.account) ?? 0) + Math.round(p.amount * 100),
        );
      }
    }
  }

  const postings: Array<Posting> = [];
  let summaOre = 0;

  for (const [konto, saldo] of [...saldonOre.entries()].sort(
    ([a], [b]) => a - b,
  )) {
    if (saldo === 0) {
      continue;
    }

    postings.push(posting(konto, -saldo));
    summaOre += saldo;
  }

  if (postings.length === 0) {
    return null;
  }

  postings.push(posting(EGET_KAPITAL, summaOre));

  return numrera({
    uuid: crypto.randomUUID(),
    date: `${parseInt(year, 10) + 1}-01-01`,
    description: `Nollställning av eget kapital ${year}`,
    postings,
  });
}
