import { transactions } from "./signals";

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
  // Filter transactions for the specified period
  const periodTransactions = transactions.value.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === parseInt(year);
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

export function formatMomsrapport(report: Momsrapport): string {
  // Skatteverket vill ha hela kronor i momsdeklarationen
  const kr = (amount: number) => Math.round(amount).toString();

  return `Momsrapport för ${report.year}
---------------------------
[05] Momspliktig försäljning: ${kr(report.momspliktigForsaljning)}
[10] Utgående moms 25 %: ${kr(report.utgaendeMoms25)}
[11] Utgående moms 12 %: ${kr(report.utgaendeMoms12)}
[12] Utgående moms 6 %: ${kr(report.utgaendeMoms6)}
[48] Ingående moms: ${kr(report.ingaendeMoms)}
Netto moms (ruta 49): ${kr(report.nettoMoms)}`;
}
