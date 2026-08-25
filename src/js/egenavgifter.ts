/**
 * Egenavgifter och särskild löneskatt för enskild firma — NE-bilagans
 * R40–R43 (SKV 2161). Avgifterna betalas personligen via Inkomstdeklaration 1,
 * aldrig som verifikat i bokföringen; modulen räknar bara fram årets
 * schablonavdrag (R43).
 *
 * Beräkningen ska göras på det gemensamma skattemässiga resultatet över alla
 * verksamheter (IL 14 kap 12 §) — se PLAN.md om sammanslagen vy.
 *
 * Porterad från accounted (gnubok, github.com/erp-mafia/accounted,
 * AGPL-3.0-or-later).
 */

/** Full egenavgiftssats (aktiv verksamhet, född 1959 eller senare). */
export const EGENAVGIFTER_FULL = 0.2897;
/** Nedsatt sats för pensionärer. */
export const EGENAVGIFTER_PENSIONAR = 0.1021;
/** Passiv verksamhet beskattas med särskild löneskatt i stället. */
export const SLP_PASSIV = 0.2426;

/** Schablonavdragens procentsatser per kategori (R43). */
export const SCHABLONAVDRAG_FULL = 0.25;
export const SCHABLONAVDRAG_PENSIONAR = 0.1;
export const SCHABLONAVDRAG_PASSIV = 0.2;

export type EgenavgiftsKategori = "full" | "pensionar" | "passiv";

const SATSER: Record<
  EgenavgiftsKategori,
  { schablon: number; avgifter: number }
> = {
  full: { schablon: SCHABLONAVDRAG_FULL, avgifter: EGENAVGIFTER_FULL },
  pensionar: {
    schablon: SCHABLONAVDRAG_PENSIONAR,
    avgifter: EGENAVGIFTER_PENSIONAR,
  },
  passiv: { schablon: SCHABLONAVDRAG_PASSIV, avgifter: SLP_PASSIV },
};

export type EgenavgiftsForslag = {
  kategori: EgenavgiftsKategori;
  /** Överskott före R40/R41 — underlaget utan föregående års poster. */
  overskottForeEgenavgifter: number;
  foregaendeArsSchablonavdrag: number;
  foregaendeArsPafort: number;
  /** max(0, överskott + föregående års schablon − föregående års påförda),
   *  dvs. samma tal som summorutan R42 när det är positivt. */
  nettoOverskott: number;
  schablonSats: number;
  /** R43 — ifyllnadsbeloppet på blanketten. */
  schablonavdrag: number;
  egenavgifterSats: number;
  /** Uppskattade egenavgifter för planering — Skatteverket fastställer det
   *  faktiska beloppet vid slutlikvidationen. */
  uppskattadeEgenavgifter: number;
  varningar: Array<string>;
};

export type EgenavgiftsInput = {
  /** Överskott före egenavgifter, från NE-bilagan men utan R40/R41. */
  overskottForeEgenavgifter: number;
  kategori?: EgenavgiftsKategori;
  /** Föregående års medgivna (schablon)avdrag — läggs tillbaka, jfr R40. */
  foregaendeArsSchablonavdrag?: number;
  /** Föregående års påförda egenavgifter — dras av, jfr R41. */
  foregaendeArsPafort?: number;
};

/**
 * Räknar fram årets schablonavdrag (R43). Nettoöverskottet är överskottet
 * justerat med föregående års poster — i blankettordningen motsvaras det av
 * summorutan R42.
 */
export function beraknaEgenavgifter(
  input: EgenavgiftsInput,
): EgenavgiftsForslag {
  const kategori = input.kategori ?? "full";
  const satser = SATSER[kategori];

  const foregaendeSchablon = input.foregaendeArsSchablonavdrag ?? 0;
  const foregaendePafort = input.foregaendeArsPafort ?? 0;

  const nettoOverskott = Math.max(
    0,
    input.overskottForeEgenavgifter + foregaendeSchablon - foregaendePafort,
  );
  const schablonavdrag = Math.floor(nettoOverskott * satser.schablon);
  const uppskattadeEgenavgifter = Math.round(nettoOverskott * satser.avgifter);

  const varningar: Array<string> = [];

  if (kategori === "full" && nettoOverskott > 40_000) {
    varningar.push(
      "För aktiv näringsverksamhet med överskott över 40 000 kr ger Skatteverket en automatisk nedsättning av egenavgifterna (7,5 %, högst 15 000 kr per år).",
    );
  }

  if (input.overskottForeEgenavgifter <= 0) {
    varningar.push("Inget överskott att beräkna egenavgifter på.");
  }

  return {
    kategori,
    overskottForeEgenavgifter: input.overskottForeEgenavgifter,
    foregaendeArsSchablonavdrag: foregaendeSchablon,
    foregaendeArsPafort: foregaendePafort,
    nettoOverskott,
    schablonSats: satser.schablon,
    schablonavdrag,
    egenavgifterSats: satser.avgifter,
    uppskattadeEgenavgifter,
    varningar,
  };
}
