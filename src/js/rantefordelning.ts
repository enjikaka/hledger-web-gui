/**
 * Räntefördelning (IL 53 kap) för enskild firma — en deklarationspost som
 * aldrig bokförs. Positiv räntefördelning (frivillig) dras i NE-bilagan R30
 * och redovisas som kapitalinkomst på Inkomstdeklaration 1 (T4); negativ
 * räntefördelning är ett tillägg till resultatet i R31 och blir obligatorisk
 * när kapitalunderlaget understiger −500 000 kr.
 *
 * Regler som hanteras utanför modulen:
 * - Positiv räntefördelning får inte överstiga resultatet före räntefördelning
 *   (R29); överskjutande belopp blir sparat fördelningsbelopp — taket läggs på
 *   i ne-bilaga-kedjan.
 * - Kapitalunderlaget räknas fram med hjälpblankett SKV 2196 och matas in
 *   manuellt.
 * - Äldre regler (beskattningsår före 2025: gränserna ±50 000 kr) samt
 *   proportionering för räkenskapsår kortare än tolv månader saknas.
 *
 * Porterad från accounted (gnubok, github.com/erp-mafia/accounted,
 * AGPL-3.0-or-later).
 */

/** Tilläggspoängen ovanpå statslåneräntan: +6 pe positivt, +1 pe negativt. */
export const POSITIV_TILLAG = 0.06;
export const NEGATIV_TILLAG = 0.01;

/** Negativ räntefördelning triggas först när kapitalunderlaget är mer
 *  negativt än detta belopp (IL 53 kap 4 §). */
export const NEGATIV_TROSKEL = -500_000;

/** Minsta tillåtna räntesats — skyddar mot orimliga värden vid låg SLR. */
const MIN_SATS = 0.005;

/**
 * Statslåneräntan den 30 november året före inkomståret, nycklad per
 * inkomstår. Värdena kommer från accounted; kontrollera mot Skatteverket
 * inför deklaration. År utanför tabellen faller tillbaka på närmast kända
 * värde — använd överskrivningsfältet i UI:t tills rätt sats är känd.
 */
const SLR_PER_AR: Record<number, number> = {
  2025: 0.0196,
  2026: 0.0255,
};

/** Tabellvärde för statslåneräntan givet inkomståret. */
export function slrForAr(inkomsar: number): number {
  if (inkomsar in SLR_PER_AR) {
    return SLR_PER_AR[inkomsar];
  }

  const ar = Object.keys(SLR_PER_AR).map(Number);
  const narmast =
    inkomsar > Math.max(...ar) ? Math.max(...ar) : Math.min(...ar);

  return SLR_PER_AR[narmast];
}

export type RantefordelningsForslag = {
  /** Positiv räntefördelning är ett avdrag, negativ ett tillägg. */
  riktning: "positiv" | "negativ";
  /** R30 (positiv) eller R31 (negativ) på NE-bilagan. */
  ruta: "R30" | "R31";
  kapitalunderlag: number;
  /** Använda statslåneräntan. */
  slrSats: number;
  /** Slutlig sats inklusive tilläggspoäng. */
  rantefordelningsSats: number;
  /** Ifyllnadsbelopp på blanketten — alltid positivt. */
  belopp: number;
  varningar: Array<string>;
};

export type RantefordelningsInput = {
  /** Justerat eget kapital i verksamheten vid föregående års utgång.
   *  Positivt = kapitalöverskott, negativt = kapitalunderskott. */
  kapitalunderlag: number;
  /** Överskrivning av tabellvärdet för statslåneräntan. Default är
   *  SLR 2025-11-30 (2,55 %), dvs. inkomstår 2026. */
  slrSats?: number;
};

/**
 * Föreslår positiv eller negativ räntefördelning. De båda är ömsesidigt
 * uteslutande via kapitalunderlagets tecken, och mellan 0 och −500 000 kr
 * finns ingen räntefördelning alls (null).
 */
export function beraknaRantefordelning(
  input: RantefordelningsInput,
): RantefordelningsForslag | null {
  const slrSats = input.slrSats ?? 0.0255;
  const positivSats = Math.max(MIN_SATS, slrSats + POSITIV_TILLAG);
  const negativSats = Math.max(MIN_SATS, slrSats + NEGATIV_TILLAG);

  const arPositiv = input.kapitalunderlag > 0;
  const arNegativObligatorisk = input.kapitalunderlag < NEGATIV_TROSKEL;

  if (!arPositiv && !arNegativObligatorisk) {
    return null;
  }

  // Math.round (inte floor/ceil) suger upp IEEE 754-avvikelsen:
  // 1 000 000 × (0,0255 + 0,06) blir 85499,999… i JS, och floor hade skurit
  // en krona från användarens avdrag utan någon ekonomisk grund.
  const belopp = arPositiv
    ? Math.round(input.kapitalunderlag * positivSats)
    : Math.round(Math.abs(input.kapitalunderlag) * negativSats);

  return {
    riktning: arPositiv ? "positiv" : "negativ",
    ruta: arPositiv ? "R30" : "R31",
    kapitalunderlag: input.kapitalunderlag,
    slrSats,
    rantefordelningsSats: arPositiv ? positivSats : negativSats,
    belopp,
    varningar: arPositiv
      ? []
      : [
          "Negativ räntefördelning är obligatorisk när kapitalunderlaget är mer negativt än -500 000 kr.",
        ],
  };
}
