import { aliases, transactions } from "./signals";
import { ore } from "./finance-utils";


export type KontoRad = {
  konto: number;
  namn: string;
  /** Ingående balans — saldo vid årets början */
  ib: number;
  /** Förändring under året */
  forandring: number;
  /** Utgående balans — saldo vid årets slut */
  ub: number;
};

export type Balansrapport = {
  year: string;
  tillgangar: Array<KontoRad>;
  egetKapitalSkulder: Array<KontoRad>;
  /** Beräknat resultat (UB): intäkter minus kostnader, ackumulerat
   *  t.o.m. valt år för år som inte omförts. Positivt = vinst. */
  beraknatResultat: number;
  summaTillgangar: number;
  summaEgetKapitalSkulder: number;
  /** Skillnad i ören mellan sidorna — ska vara 0 om bokföringen stämmer */
  differensOre: number;
};

export function generateBalansrapport(year: string): Balansrapport {
  const saldon = new Map<number, { ib: number; forandring: number }>();
  let resultat = 0;

  for (const tx of transactions.value) {
    const txYear = tx.date.slice(0, 4);

    if (txYear > year) {
      continue;
    }

    for (const posting of tx.postings) {
      if (posting.account >= 3000) {
        // Resultatkonton (3xxx–8xxx) klumpas till beräknat resultat
        resultat += posting.amount;
        continue;
      }

      const saldo = saldon.get(posting.account) ?? { ib: 0, forandring: 0 };

      if (txYear < year) {
        saldo.ib += posting.amount;
      } else {
        saldo.forandring += posting.amount;
      }

      saldon.set(posting.account, saldo);
    }
  }

  const kontonamn = (konto: number) =>
    aliases.value.find((alias) => alias.id === konto)?.to ?? "";

  const rad = (konto: number, ib: number, forandring: number, tecken: 1 | -1): KontoRad => ({
    konto,
    namn: kontonamn(konto),
    ib: tecken * ib,
    forandring: tecken * forandring,
    ub: tecken * (ib + forandring),
  });

  const rader = [...saldon.entries()]
    .filter(([, saldo]) => saldo.ib !== 0 || saldo.forandring !== 0)
    .sort(([a], [b]) => a - b);

  // Tillgångar (1xxx) visas som de bokförs (debet positivt).
  // Eget kapital & skulder (2xxx) bokförs i kredit — visas med omvänt tecken.
  const tillgangar = rader
    .filter(([konto]) => konto < 2000)
    .map(([konto, saldo]) => rad(konto, saldo.ib, saldo.forandring, 1));

  const egetKapitalSkulder = rader
    .filter(([konto]) => konto >= 2000)
    .map(([konto, saldo]) => rad(konto, saldo.ib, saldo.forandring, -1));

  const beraknatResultat = -resultat;
  const summaTillgangar = tillgangar.reduce((sum, rad) => sum + rad.ub, 0);
  const summaEgetKapitalSkulder =
    egetKapitalSkulder.reduce((sum, rad) => sum + rad.ub, 0) + beraknatResultat;

  return {
    year,
    tillgangar,
    egetKapitalSkulder,
    beraknatResultat,
    summaTillgangar,
    summaEgetKapitalSkulder,
    differensOre:
      ore(summaTillgangar) - ore(summaEgetKapitalSkulder),

  };
}
