import type { Posting, Transaction } from "./parse-journal-file";
import { numrera } from "./verifikat";

export type MallTyp = "köp" | "försäljning" | "insättning" | "uttag";

export type Mall = {
  namn: string;
  typ: MallTyp;
  beskrivning: string;
  /** Momssats som andel, t.ex. 0.25. 0 = momsfritt. */
  momssats: 0 | 0.06 | 0.12 | 0.25;
  /** Kostnads-/intäktskonto, eller kapitalkonto för insättning/uttag. */
  konto: number;
  betalkonto: number;
};

const INGAENDE_MOMS = 2640;

/** Valbara kapitalkällor för köp/försäljning. Privata betalningar (t.ex.
 *  Granngården på privat kreditkort) bokförs mot 2018 Egna insättningar
 *  i stället för att dras från bankkontot. */
export const betalkonton = [
  { konto: 1930, namn: "1930 Företagskonto" },
  { konto: 2018, namn: "2018 Egen insättning (privat betalning)" },
];

const UTGAENDE_MOMS: Record<number, number> = {
  25: 2611,
  12: 2621,
  6: 2631,
};

export const mallar: Array<Mall> = [
  {
    namn: "Hönsfoder (Granngården)",
    typ: "köp",
    beskrivning: "Granngården, Hönsfoder, #höns",
    momssats: 0.25,
    konto: 4022,
    betalkonto: 1930,
  },
  {
    namn: "Fårfoder (Granngården)",
    typ: "köp",
    beskrivning: "Granngården, Fårfoder, #får",
    momssats: 0.25,
    konto: 4021,
    betalkonto: 1930,
  },
  {
    namn: "Äggförsäljning",
    typ: "försäljning",
    beskrivning: "Försäljning, Ägg, #höns",
    momssats: 0.12,
    konto: 3002,
    betalkonto: 1930,
  },
  {
    namn: "Patreon",
    typ: "försäljning",
    beskrivning: "Patreon, Medlemsintäkter",
    momssats: 0,
    konto: 3305,
    betalkonto: 1930,
  },
  {
    namn: "Google Adsense",
    typ: "försäljning",
    beskrivning: "Google, Adsense-intäkter",
    momssats: 0,
    konto: 3308,
    betalkonto: 1930,
  },
  {
    namn: "Egen insättning",
    typ: "insättning",
    beskrivning: "Egen insättning",
    momssats: 0,
    konto: 2018,
    betalkonto: 1930,
  },
  {
    namn: "Eget uttag",
    typ: "uttag",
    beskrivning: "Eget uttag",
    momssats: 0,
    konto: 2013,
    betalkonto: 1930,
  },
];

/**
 * Bygger postings från en mall och totalbelopp inkl. moms.
 * Räknar i hela ören så att raderna alltid summerar till exakt noll.
 */
export function skapaPostings(
  mall: Mall,
  beloppInklMoms: number,
  betalkonto: number = mall.betalkonto,
): Array<Posting> {
  const totalOre = Math.round(beloppInklMoms * 100);
  const momsOre = Math.round((totalOre * mall.momssats) / (1 + mall.momssats));
  const nettoOre = totalOre - momsOre;

  const kr = (ore: number) => ore / 100;
  const posting = (account: number, ore: number): Posting => ({
    account,
    amount: kr(ore),
    currency: "SEK",
  });

  switch (mall.typ) {
    case "köp": {
      const rows = [posting(mall.konto, nettoOre)];
      if (momsOre !== 0) rows.push(posting(INGAENDE_MOMS, momsOre));
      rows.push(posting(betalkonto, -totalOre));
      return rows;
    }
    case "försäljning": {
      const rows = [posting(mall.konto, -nettoOre)];
      if (momsOre !== 0) {
        rows.push(
          posting(UTGAENDE_MOMS[Math.round(mall.momssats * 100)], -momsOre),
        );
      }
      rows.push(posting(betalkonto, totalOre));
      return rows;
    }
    case "insättning":
      return [
        posting(mall.betalkonto, totalOre),
        posting(mall.konto, -totalOre),
      ];
    case "uttag":
      return [
        posting(mall.konto, totalOre),
        posting(mall.betalkonto, -totalOre),
      ];
  }
}

export function skapaTransaktion(
  mall: Mall,
  datum: string,
  beloppInklMoms: number,
  beskrivning: string,
  betalkonto: number = mall.betalkonto,
): Transaction {
  return numrera({
    uuid: crypto.randomUUID(),
    date: datum,
    description: beskrivning || mall.beskrivning,
    postings: skapaPostings(mall, beloppInklMoms, betalkonto),
  });
}
