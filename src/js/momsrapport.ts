import { transactions } from "./signals";

export interface Momsrapport {
  year: string;
  momspliktigForsaljning: number;
  utgaendeMoms25: number;
  utgaendeMoms12: number;
  ingaendeMoms: number;
  nettoMoms: number;
}

export function generateMomsrapport(year: string): Momsrapport {
  // Filter transactions for the specified period
  const periodTransactions = transactions.value.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === parseInt(year);
  });

  let momspliktigForsaljning = 0;
  let utgaendeMoms25 = 0;
  let utgaendeMoms12 = 0;
  let ingaendeMoms = 0;

  // Process each transaction
  periodTransactions.forEach((tx) => {
    tx.postings.forEach((posting) => {
      const account = posting.account.toLowerCase();
      const amount = Math.abs(posting.amount); // Use absolute value

      // [A05] Momspliktig försäljning - sum of 25% and 12% VAT sales
      if (["3000", "3001", "3002"].includes(account)) {
        momspliktigForsaljning += amount;
      }

      // [B10] Utgående moms 25%
      if (account === "2611") {
        utgaendeMoms25 += amount;
      }

      // [B12] Utgående moms 12%
      if (account === "2621") {
        utgaendeMoms12 += amount;
      }

      // [F48] Ingående moms
      if (account === "2640") {
        ingaendeMoms += amount;
      }
    });
  });

  // Calculate netto moms (output VAT - input VAT)
  const nettoMoms = utgaendeMoms25 + utgaendeMoms12 - ingaendeMoms;

  return {
    year,
    momspliktigForsaljning,
    utgaendeMoms25,
    utgaendeMoms12,
    ingaendeMoms,
    nettoMoms,
  };
}

export function formatMomsrapport(report: Momsrapport): string {
  return `Momsrapport för ${report.year}
---------------------------
[A05] Momspliktig försäljning: ${report.momspliktigForsaljning.toFixed(2)}
[B10] Utgående moms 25 %: ${report.utgaendeMoms25.toFixed(2)}
[B12] Utgående moms 12 %: ${report.utgaendeMoms12.toFixed(2)}
[F48] Ingående moms: ${report.ingaendeMoms.toFixed(2)}
Netto moms: ${report.nettoMoms.toFixed(2)}`;
}
