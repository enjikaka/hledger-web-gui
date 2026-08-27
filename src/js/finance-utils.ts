import type { Transaction } from "./parse-journal-file";

/** Hela ören utan decimaler. */
export const ore = (belopp: number) => Math.round(belopp * 100);

/** Summan av alla poster på kontot fram till och med datumet, i ören. */
export function saldoOre(
  txs: Array<Transaction>,
  konto: number,
  gäller: (datum: string) => boolean,
): number {
  let summa = 0;

  for (const tx of txs) {
    if (!gäller(tx.date)) {
      continue;
    }

    for (const posting of tx.postings) {
      if (posting.account === konto) {
        summa += ore(posting.amount);
      }
    }
  }

  return summa;
}
