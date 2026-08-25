/**
 * Periodiseringsfond för enskild firma (IL 30 kap) — deklarationsposter som
 * aldrig bokförs. Avsättningen (NE R34) får vara högst 30 % av överskottet
 * enligt R33, och varje kohort måste återföras till fullo senare sex år efter
 * avsättningsåret (NE R32).
 *
 * Porterad från accounted (gnubok, github.com/erp-mafia/accounted,
 * AGPL-3.0-or-later).
 */

/** Enskild firma får avsätta 30 % (aktiebolag 25 %). */
export const PFOND_MAX_ANDEL = 0.3;

/** Högst sex år på fonden — därefter obligatorisk återföring. */
export const PFOND_MAX_AR = 6;

export type PeriodiseringsFond = {
  /** Året avsättningen gjordes — kohorten som bär återföringstiden. */
  ar: number;
  /** Kvarstående saldo, alltid positivt. */
  saldo: number;
};

export type PfondAvsattningForslag = {
  ruta: "R34";
  /** R33-värdet underlaget räknades från. */
  overskott: number;
  /** Högsta tillåtna avsättning = floor(30 % av positivt överskott). */
  maxBelopp: number;
  onskatBelopp: number;
  /** Ifyllnadsbelopp på blanketten — alltid positivt. */
  belopp: number;
  varningar: Array<string>;
};

export type PfondAvsattningInput = {
  /** Överskott/underskott före avsättning, dvs. summorutan R33. */
  overskott: number;
  /** Önskat belopp; default är maximalt. */
  onskatBelopp?: number;
};

/**
 * Föreslår årets avsättning till periodiseringsfond. Returnerar null när
 * beloppet blir noll — vid underskott eller önskan om ingen avsättning.
 */
export function proposeraPfondAvsattning(
  input: PfondAvsattningInput,
): PfondAvsattningForslag | null {
  const bas = Math.max(0, Math.floor(input.overskott));
  const maxBelopp = Math.floor(bas * PFOND_MAX_ANDEL);
  const onskatBelopp = Math.max(0, Math.floor(input.onskatBelopp ?? maxBelopp));
  const belopp = Math.min(onskatBelopp, maxBelopp);

  if (belopp === 0) {
    return null;
  }

  const varningar: Array<string> = [];

  if (onskatBelopp > maxBelopp) {
    varningar.push(
      `Begärt belopp (${onskatBelopp} kr) översteg 30 %-taket. Avsättningen begränsades till ${maxBelopp} kr.`,
    );
  }

  return {
    ruta: "R34",
    overskott: input.overskott,
    maxBelopp,
    onskatBelopp,
    belopp,
    varningar,
  };
}

export type PfondAterforingsRad = {
  kohortAr: number;
  /** Fondens saldo före återföringen. */
  saldo: number;
  /** Ifyllnadsbelopp i R32 — hela saldot för obligatoriska kohorter. */
  belopp: number;
  obligatorisk: boolean;
  varningar: Array<string>;
};

export type PfondAterforingInput = {
  fonder: Array<PeriodiseringsFond>;
  /** Deklarationsåret. */
  ar: number;
  /** Valfria delåterföringar per kohortår; obligatoriska kohorter återförs
   *  alltid till fullo oavsett vad som önskas. */
  delar?: Record<number, number>;
};

/**
 * Föreslår återföringar ur tidigare års periodiseringsfonder. Kohorter vars
 * sex år gått återförs med tvång; yngre kan återföras helt eller delvis.
 */
export function proposeraPfondAterforing(
  input: PfondAterforingInput,
): Array<PfondAterforingsRad> {
  const rader: Array<PfondAterforingsRad> = [];

  for (const fond of input.fonder) {
    const obligatorisk = fond.ar + PFOND_MAX_AR <= input.ar;
    const onskat = Math.max(0, Math.floor(input.delar?.[fond.ar] ?? 0));
    const belopp = obligatorisk ? fond.saldo : Math.min(onskat, fond.saldo);

    if (belopp === 0) {
      continue;
    }

    rader.push({
      kohortAr: fond.ar,
      saldo: fond.saldo,
      belopp,
      obligatorisk,
      varningar: obligatorisk
        ? [
            `Periodiseringsfond ${fond.ar} har nått 6-årsgränsen och måste återföras.`,
          ]
        : [],
    });
  }

  return rader;
}
