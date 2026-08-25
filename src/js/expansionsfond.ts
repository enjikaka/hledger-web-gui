/**
 * Expansionsfond för enskild firma (IL 34 kap) — en deklarationspost som
 * aldrig bokförs. Avsättning (NE R36) ger avdrag i näringsverksamheten mot
 * en särskild expansionsfondsskatt på 20,6 % som betalas samma år; vid
 * återföring (R37) tas beloppet upp som intäkt och den betalda skatten
 * tillgodoräknas. Det finns ingen tidsgräns för när avsättningen senast ska
 * återföras, och delåterföringar är fria.
 *
 * Regler som hanteras utanför modulen:
 * - Avsättningen får vara högst inkomsten före avsättning, dvs. ruta R35 på
 *   NE-bilagan — det taket läggs på i ne-bilaga-kedjan.
 * - Kapitalunderlaget räknas fram med hjälpblankett SKV 2196 och matas in
 *   manuellt. Obs: gäller vid ÅRETS utgång, till skillnad från
 *   räntefördelningens kapitalunderlag (föregående års utgång).
 * - När verksamheten upphör eller överlåts gäller särskilda regler (bilaga
 *   N7) som inte modelleras här.
 *
 * Porterad från accounted (gnubok, github.com/erp-mafia/accounted,
 * AGPL-3.0-or-later).
 */

/** Expansionsfondsskatt — samma nivå som bolagsskatten. */
export const EXPANSIONSFOND_SKATT = 0.206;

/**
 * Totalt avsatt saldo (detta år + tidigare år) får vara högst 125,94 % av
 * kapitalunderlaget: kapitalet plus den 20,6-procentiga skatten.
 */
export const EXPANSIONSFOND_TAK = 1.2594;

export type ExpansionsfondsForslag = {
  riktning: "avsattning" | "aterforing";
  /** R36 (ökning/avsättning) eller R37 (minskning/återföring). */
  ruta: "R36" | "R37";
  kapitalunderlag: number;
  befintligtSaldo: number;
  /** Högsta totala saldo = floor(125,94 % av positivt kapitalunderlag). */
  maxTotalSaldo: number;
  onskadAndring: number;
  /** Ifyllnadsbelopp på blanketten — alltid positivt. */
  belopp: number;
  /** 20,6 % av ändringen: betalas i år vid avsättning,
   *  tillgodoräknas vid återföring. */
  skattPaAndring: number;
  /** Saldo efter ändringen. */
  nyttSaldo: number;
  varningar: Array<string>;
};

export type ExpansionsfondsInput = {
  /** Kapitalunderlaget vid årets utgång. */
  kapitalunderlag?: number;
  /** Kvarstående avsättningar från tidigare år, alltid positivt. */
  befintligtSaldo?: number;
  /** Önskad ändring: positivt = avsättning, negativt = återföring. */
  onskadAndring?: number;
};

/**
 * Räknar fram årets ändring av expansionsfonden. Avsättningen begränsas av
 * 125,94 %-taket på det totala saldot och återföringen av befintligt saldo;
 * taket mot inkomsten (R35) läggs på i ne-bilaga-kedjan. Returnerar null när
 * ingen ändring önskas.
 */
export function beraknaExpansionsfondAndring(
  input: ExpansionsfondsInput,
): ExpansionsfondsForslag | null {
  const kapitalunderlag = Math.max(0, Math.floor(input.kapitalunderlag ?? 0));
  const befintligtSaldo = Math.max(0, Math.floor(input.befintligtSaldo ?? 0));
  const onskadAndring = Math.round(input.onskadAndring ?? 0);

  if (onskadAndring === 0) {
    return null;
  }

  const maxTotalSaldo = Math.floor(kapitalunderlag * EXPANSIONSFOND_TAK);
  const arAvsattning = onskadAndring > 0;

  let andring: number;

  if (arAvsattning) {
    // Taket gäller totalsaldot, så bara utrymmet upp till det kan avsättas.
    const utrymme = Math.max(0, maxTotalSaldo - befintligtSaldo);
    andring = Math.min(onskadAndring, utrymme);
  } else {
    andring = -Math.min(-onskadAndring, befintligtSaldo);
  }

  const varningar: Array<string> = [];

  if (arAvsattning && andring < onskadAndring) {
    varningar.push(
      `Begärt belopp (${onskadAndring} kr) överstiger taket på 125,94 % av kapitalunderlaget (${maxTotalSaldo} kr totalt). Avsättningen begränsades till ${andring} kr.`,
    );
  }

  if (!arAvsattning && -andring < -onskadAndring) {
    varningar.push(
      `Återföringen begränsades till befintligt saldo (${befintligtSaldo} kr).`,
    );
  }

  // Överskjutande saldo måste återföras till beskattning — appen varnar men
  // låter användaren styra återföringen själv.
  if (befintligtSaldo > maxTotalSaldo) {
    varningar.push(
      `Expansionsfonden (${befintligtSaldo} kr) överstiger taket på ${maxTotalSaldo} kr (125,94 % av kapitalunderlaget). Överskjutande ${befintligtSaldo - maxTotalSaldo} kr måste återföras till beskattning.`,
    );
  }

  return {
    riktning: arAvsattning ? "avsattning" : "aterforing",
    ruta: arAvsattning ? "R36" : "R37",
    kapitalunderlag,
    befintligtSaldo,
    maxTotalSaldo,
    onskadAndring,
    belopp: Math.abs(andring),
    skattPaAndring: Math.round(Math.abs(andring) * EXPANSIONSFOND_SKATT),
    nyttSaldo: befintligtSaldo + andring,
    varningar,
  };
}
