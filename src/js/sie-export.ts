import type { Transaction } from "./parse-journal-file";
import { transactions } from "./signals";
import { tolkaVerifikat } from "./verifikat";

/**
 * SIE4-export — svensk standard för bokföringsutbyte (SIE-gruppens filformat,
 * typ 4). En fil per räkenskapsår: saldon i ören (#IB/#UB/#RES) samt alla
 * verifikationer (#VER med #TRANS-rader).
 *
 * Verifikationens serie och nummer kommer ur hledgers kodfält via
 * tolkaVerifikat ("A12" → serie "A", nummer "12"), och serien börjar om varje
 * år vilket gör att en årsfil kan skapas rakt av. Verifikat utan giltig kod
 * tas inte med — de syns istället som serievarningar i utdata.
 *
 * Belopp är hela ören. Teckenuppsättningen enligt specen är CP437 (IBM PC),
 * där de svenska bokstäverna ligger på andra bytepositioner än latin1 — se
 * kodatCp437().
 */

const PROGRAM_VERSION = "1.0";
const RADSLUT = "\r\n";

export type SieVarningar = {
  /** Verifikat under året utan giltig kod — tas inte med i filen. */
  onumrerade: number;
  /** Nummer som förekommer på mer än ett verifikat. */
  dubbletter: Array<number>;
  /** Nummer som saknas mellan lägsta och högsta använda. */
  luckor: Array<number>;
};

export type SieFil = {
  sie: string;
  varningar: SieVarningar;
};

export type SieVal = {
  /** Företagets namn till #FNAMN. */
  fnamn?: string;
};

/** Resultatkonto = 3000–8999, samma konvention som NE-bilagan. */
const arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;

/** "ÅÅÅÅ-MM-DD" → SIE:s ÅÅÅÅMMDD. */
const sieDatum = (datum: string) => datum.replace(/-/g, "");

/** Hela ören utan decimaler. */
const ore = (belopp: number) => Math.round(belopp * 100);

/** Tar bort tecken SIE-strängar inte tål (citering, radbrytningar). */
function saneraText(text: string): string {
  return text
    .replace(/["\r\n]/g, " ")
    .trim()
    .slice(0, 128);
}

/** Kontona som berörs av underlaget, sorterade stigande. */
function kontonIOrdning(
  txs: Array<Transaction>,
  valj: (konto: number) => boolean,
): Array<number> {
  const konton = new Set<number>();

  for (const tx of txs) {
    for (const posting of tx.postings) {
      if (valj(posting.account)) {
        konton.add(posting.account);
      }
    }
  }

  return [...konton].sort((a, b) => a - b);
}

/** Summan av alla poster på kontot fram till och med datumet, i ören. */
function saldoOre(
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

/**
 * Genererar SIE4-texten för ett år utifrån godtyckligt transaktionsunderlag.
 * Ingående balans räknas som alla transaktioner FÖRE årets start (journalen
 * kan innehålla flera år), utgående som allt genom årsslutet, och resultatet
 * som årets rörelse på resultatkontona.
 */
export function genereraSieFor(
  year: string,
  txs: Array<Transaction>,
  val: SieVal = {},
): SieFil {
  const start = `${year}-01-01`;
  const slut = `${year}-12-31`;
  const foreStart = (datum: string) => datum < start;
  const genomArslutet = (datum: string) => datum <= slut;

  const aretsTxs = txs.filter((tx) => tx.date.slice(0, 4) === year);

  // --- Seriekoll ---
  const nummer = aretsTxs
    .map((tx) => tolkaVerifikat(tx.code))
    .filter((v) => v !== null)
    .map((v) => v.nummer);

  const antalPerNummer = new Map<number, number>();

  for (const n of nummer) {
    antalPerNummer.set(n, (antalPerNummer.get(n) ?? 0) + 1);
  }

  const lagsta = nummer.length > 0 ? Math.min(...nummer) : 0;
  const hogsta = nummer.length > 0 ? Math.max(...nummer) : 0;
  const luckor: Array<number> = [];

  for (let n = lagsta; n <= hogsta; n++) {
    if (!antalPerNummer.has(n)) {
      luckor.push(n);
    }
  }

  const varningar: SieVarningar = {
    onumrerade: aretsTxs.filter((tx) => tolkaVerifikat(tx.code) === null)
      .length,
    dubbletter: [...antalPerNummer.entries()]
      .filter(([, antal]) => antal > 1)
      .map(([n]) => n)
      .sort((a, b) => a - b),
    luckor,
  };

  // --- Saldon ---
  const balansKonton = kontonIOrdning(txs, (k) => !arResultatkonto(k));
  const resultatKonton = kontonIOrdning(txs, arResultatkonto);

  const rader: Array<string> = [
    "#FLAGGA 0",
    `#PROGRAM "hledger-web-gui" "${PROGRAM_VERSION}"`,
    "#FORMAT PCG4",
    `#GEN ${sieDatum(new Date().toISOString().slice(0, 10))}`,
    `#FNAMN "${saneraText(val.fnamn ?? "")}"`,
    `#RAR 0 ${sieDatum(start)} ${sieDatum(slut)}`,
    "#MVAL SEK",
  ];

  for (const konto of balansKonton) {
    const ib = saldoOre(txs, konto, foreStart);

    if (ib !== 0) {
      rader.push(`#IB 0 ${konto} ${ib}`);
    }
  }

  for (const konto of balansKonton) {
    const ub = saldoOre(txs, konto, genomArslutet);

    if (ub !== 0) {
      rader.push(`#UB 0 ${konto} ${ub}`);
    }
  }

  for (const konto of resultatKonton) {
    const res = saldoOre(txs, konto, genomArslutet);

    if (res !== 0) {
      rader.push(`#RES 0 ${konto} ${res}`);
    }
  }

  // --- Verifikationer, kronologiskt ---
  const verifikat = aretsTxs
    .flatMap((tx) => {
      const v = tolkaVerifikat(tx.code);
      return v ? [{ tx, v }] : [];
    })
    .sort((a, b) =>
      a.tx.date === b.tx.date
        ? a.v.nummer - b.v.nummer
        : a.tx.date.localeCompare(b.tx.date),
    );

  for (const { tx, v } of verifikat) {
    rader.push(
      `#VER "${v.serie}" "${v.nummer}" ${sieDatum(tx.date)} "${saneraText(tx.description)}"`,
    );
    rader.push("{");

    for (const posting of tx.postings) {
      rader.push(`    #TRANS ${posting.account} {} ${ore(posting.amount)}`);
    }

    rader.push("}");
  }

  return { sie: rader.join(RADSLUT) + RADSLUT, varningar };
}

/** Wrapper som läser den aktiva journalen ur signalerna. */
export function genereraSie(year: string, val: SieVal = {}): SieFil {
  return genereraSieFor(year, transactions.value, val);
}

/** CP437-koder för tecken utanför ASCII som förekommer i svenska namn.
 *  Exporteras för att avkodningen i sie-import ska spegla exakt samma
 *  mappning. */
export const CP437_MAPPA: Record<string, number> = {
  ä: 0x84,
  å: 0x86,
  ö: 0x94,
  Ä: 0x8e,
  Å: 0x8f,
  Ö: 0x99,
  é: 0x82,
  É: 0x90,
  ü: 0x81,
  Ü: 0x9a,
  ß: 0xe1,
};

/**
 * Kodar text till CP437 (IBM PC) enligt SIE-specen. Svenska bokstäver mappas
 * explicit — de ligger på andra byte än i latin1 — och tecken utanför
 * tabellen ersätts med '?' som räknas och rapporteras.
 */
export function kodatCp437(text: string): {
  bytes: Uint8Array;
  ersatta: number;
} {
  const bytes = new Uint8Array(text.length);
  let ersatta = 0;

  for (let i = 0; i < text.length; i++) {
    const tecken = text[i];
    const kod = tecken.charCodeAt(0);

    if (kod <= 0x7f) {
      bytes[i] = kod;
    } else if (tecken in CP437_MAPPA) {
      bytes[i] = CP437_MAPPA[tecken];
    } else {
      bytes[i] = 0x3f; // '?'
      ersatta++;
    }
  }

  return { bytes, ersatta };
}
