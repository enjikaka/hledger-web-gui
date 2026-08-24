import type { Transaction } from "./parse-journal-file";
import { transactions } from "./signals";

/**
 * Verifikationsnummer enligt bokföringslagen 5 kap 7 §, som kräver ett
 * "verifikationsnummer eller annat identifieringstecken" i varje verifikation.
 *
 * Numret skrivs i hledgers kodfält — `2025-03-01 (A12) Beskrivning` — som är
 * avsett för just den här sortens referens och följer med vid en SIE-export
 * (`#VER "A" "12"`).
 *
 * Serien börjar om på 1 varje räkenskapsår, vilket är svensk praxis och det
 * som gör att en SIE-fil per år går att skapa rakt av. Varje bokföring har sin
 * egen serie: driver man två verksamheter i var sin journal numreras de
 * oberoende av varandra.
 *
 * Poängen med en obruten serie är fullständighetskontroll — saknas ett nummer
 * syns det. Ett uuid hade uppfyllt lagtextens ord men aldrig avslöjat en lucka,
 * och därför används löpnummer här.
 */

/** Enskild firma klarar sig med en serie. Bokio kallar den likaså "A". */
export const SERIE = "A";

type Verifikat = { serie: string; nummer: number };

/** Delar "A12" i serie och nummer. Ogiltiga koder ger null. */
export function tolkaVerifikat(code: string | undefined): Verifikat | null {
  const match = code?.trim().match(/^([A-ZÅÄÖ]*)(\d+)$/i);

  if (!match) {
    return null;
  }

  return {
    serie: (match[1] || SERIE).toUpperCase(),
    nummer: parseInt(match[2], 10),
  };
}

export const formateraVerifikat = ({ serie, nummer }: Verifikat) =>
  `${serie}${nummer}`;

/** Alla nummer som används i serien under året, i stigande ordning. */
function anvandaNummer(year: string, serie = SERIE): Array<number> {
  const nummer = transactions.value
    .filter((tx) => tx.date.slice(0, 4) === year)
    .map((tx) => tolkaVerifikat(tx.code))
    .filter((v): v is Verifikat => v !== null && v.serie === serie)
    .map((v) => v.nummer);

  return [...new Set(nummer)].sort((a, b) => a - b);
}

/**
 * Nästa lediga nummer i serien. Räknar från högsta använda numret i stället
 * för antalet verifikat — annars skulle ett borttaget verifikat få sitt nummer
 * återanvänt, och serien tappa sin betydelse som fullständighetskontroll.
 */
export function nastaVerifikat(year: string, serie = SERIE): string {
  const nummer = anvandaNummer(year, serie);
  const hogsta = nummer.length > 0 ? nummer[nummer.length - 1] : 0;

  return formateraVerifikat({ serie, nummer: hogsta + 1 });
}

/** Sätter nästa lediga nummer på en transaktion som saknar ett. */
export function numrera(transaktion: Transaction, serie = SERIE): Transaction {
  if (transaktion.code) {
    return transaktion;
  }

  return {
    ...transaktion,
    code: nastaVerifikat(transaktion.date.slice(0, 4), serie),
  };
}

export type Serieproblem = {
  /** Nummer som saknas mellan det lägsta och högsta använda. */
  luckor: Array<number>;
  /** Nummer som förekommer på mer än ett verifikat. */
  dubbletter: Array<number>;
  /** Verifikat helt utan nummer. */
  onumrerade: number;
  /** Lägsta använda numret när serien inte börjar på 1. Serien ska normalt
   *  starta om på 1 varje räkenskapsår — men den som numrerar löpande över
   *  årsgränsen gör inget fel, så det här är en upplysning och inte ett fel. */
  borjarPa: number | null;
};

/**
 * Kontrollerar serien för ett år. En obruten serie utan dubbletter är vad som
 * gör att man kan lita på att inget verifikat fattas.
 */
export function granskaSerie(year: string, serie = SERIE): Serieproblem {
  const arets = transactions.value.filter(
    (tx) => tx.date.slice(0, 4) === year,
  );

  const nummer = arets
    .map((tx) => tolkaVerifikat(tx.code))
    .filter((v): v is Verifikat => v !== null && v.serie === serie)
    .map((v) => v.nummer);

  const antalPerNummer = new Map<number, number>();

  for (const n of nummer) {
    antalPerNummer.set(n, (antalPerNummer.get(n) ?? 0) + 1);
  }

  // Luckor räknas mellan lägsta och högsta använda numret. Att serien börjar
  // på något annat än 1 rapporteras för sig — annars skulle en journal med
  // löpande numrering över årsgränsen larma om varje nummer i föregående år.
  const lagsta = nummer.length > 0 ? Math.min(...nummer) : 0;
  const hogsta = nummer.length > 0 ? Math.max(...nummer) : 0;
  const luckor: Array<number> = [];

  for (let n = lagsta; n <= hogsta; n++) {
    if (!antalPerNummer.has(n)) {
      luckor.push(n);
    }
  }

  return {
    luckor,
    dubbletter: [...antalPerNummer.entries()]
      .filter(([, antal]) => antal > 1)
      .map(([n]) => n)
      .sort((a, b) => a - b),
    onumrerade: arets.filter((tx) => tolkaVerifikat(tx.code) === null).length,
    borjarPa: lagsta > 1 ? lagsta : null,
  };
}

/** Fel som bryter mot fullständighetskontrollen. Att serien börjar på annat
 *  än 1 räknas inte hit — det är ett upplysningsvärt val, inte ett fel. */
export const harSerieproblem = (problem: Serieproblem) =>
  problem.luckor.length > 0 ||
  problem.dubbletter.length > 0 ||
  problem.onumrerade > 0;
