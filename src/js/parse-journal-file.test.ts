import { describe, expect, it } from "vitest";
import {
  type JournalItem,
  parseJournalFile,
  type Transaction,
} from "./parse-journal-file";

async function parsa(text: string): Promise<Array<JournalItem>> {
  const file = new File([text], "test.journal", { type: "text/plain" });
  const items: Array<JournalItem> = [];

  for await (const item of parseJournalFile(file)) {
    items.push(item);
  }

  return items;
}

const av = <T extends JournalItem["type"]>(
  items: Array<JournalItem>,
  typ: T,
): Array<Extract<JournalItem, { type: T }>["data"]> =>
  items
    .filter((item) => item.type === typ)
    .map((item) => item.data) as never;

const transaktioner = (items: Array<JournalItem>) =>
  av(items, "transaction") as Array<Transaction>;

/** Postings som "konto belopp valuta", för läsbara förväntningar. */
const rader = (tx: Transaction) =>
  tx.postings.map((p) => `${p.account} ${p.amount} ${p.currency}`.trim());

describe("kontodefinitioner", () => {
  it("läser account- och aliasrader", async () => {
    const items = await parsa(`account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
account eget_kapital
alias 2010 = eget_kapital
`);

    expect(av(items, "account")).toEqual([
      { name: "tillgångar:bankkonto" },
      { name: "eget_kapital" },
    ]);
    expect(av(items, "alias")).toEqual([
      { id: 1930, to: "tillgångar:bankkonto" },
      { id: 2010, to: "eget_kapital" },
    ]);
  });

  it("tål varierande mellanrum kring likhetstecknet", async () => {
    const items = await parsa(`alias 1930=tillgångar:bankkonto
alias 2010    =    eget_kapital
`);

    expect(av(items, "alias")).toEqual([
      { id: 1930, to: "tillgångar:bankkonto" },
      { id: 2010, to: "eget_kapital" },
    ]);
  });
});

describe("headern", () => {
  it("bevaras ordagrant med kommentarer och tomrader", async () => {
    const header = `; Tillgångar
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto

; Eget kapital
account eget_kapital
alias 2010 = eget_kapital
`;

    const items = await parsa(`${header}
2025-01-01 Insättning
    1930  100.00 SEK
    2010  -100.00 SEK
`);

    // Kommentarer och blankrader ska överleva en spara-runda oförändrade
    const [ut] = av(items, "header") as Array<string>;
    expect(ut.trim()).toBe(header.trim());
    expect(ut).toContain("; Tillgångar");
    expect(ut).toContain("; Eget kapital");
  });

  it("tappar inte sista raden när filen saknar avslutande radbrytning", async () => {
    const items = await parsa(`; Kontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto`);

    // Raden ska finnas både som aliaspost och ordagrant i headern, annars
    // försvinner den när journalen sparas tillbaka.
    expect(av(items, "alias")).toEqual([
      { id: 1930, to: "tillgångar:bankkonto" },
    ]);
    expect(av(items, "header")[0]).toContain(
      "alias 1930 = tillgångar:bankkonto",
    );
  });

  it("blir hela filen när journalen saknar transaktioner", async () => {
    const text = `; Bara kontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto`;

    const items = await parsa(text);

    expect(transaktioner(items)).toHaveLength(0);
    expect(av(items, "header")).toEqual([text]);
  });

  it("yttrar sig exakt en gång", async () => {
    const items = await parsa(`account a
2025-01-01 En
    1930  100.00 SEK
    2010  -100.00 SEK

2025-01-02 Två
    1930  50.00 SEK
    2010  -50.00 SEK
`);

    expect(items.filter((i) => i.type === "header")).toHaveLength(1);
  });
});

describe("transaktioner", () => {
  it("läser datum, beskrivning och postings", async () => {
    const items = await parsa(`2025-03-15 Granngården, Hönsfoder, #höns
    4022  252.74 SEK
    2640  63.18 SEK
    1930  -315.92 SEK
`);

    const [tx] = transaktioner(items);

    expect(tx.date).toBe("2025-03-15");
    expect(tx.description).toBe("Granngården, Hönsfoder, #höns");
    expect(rader(tx)).toEqual([
      "4022 252.74 SEK",
      "2640 63.18 SEK",
      "1930 -315.92 SEK",
    ]);
  });

  it("ger varje transaktion ett eget uuid", async () => {
    const items = await parsa(`2025-01-01 En
    1930  100.00 SEK
    2010  -100.00 SEK

2025-01-02 Två
    1930  50.00 SEK
    2010  -50.00 SEK
`);

    const [a, b] = transaktioner(items);

    expect(a.uuid).not.toBe(b.uuid);
    expect(a.uuid).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("tar med den sista transaktionen även utan avslutande radbrytning", async () => {
    const items = await parsa(`2025-01-01 En
    1930  100.00 SEK
    2010  -100.00 SEK

2025-01-02 Sista utan radslut
    1930  50.00 SEK
    2010  -50.00 SEK`);

    const txs = transaktioner(items);

    expect(txs).toHaveLength(2);
    expect(txs[1].description).toBe("Sista utan radslut");
    expect(rader(txs[1])).toEqual(["1930 50 SEK", "2010 -50 SEK"]);
  });

  it("hoppar över kommentarer mellan och inuti transaktioner", async () => {
    const items = await parsa(`2025-01-01 En
    1930  100.00 SEK
    ; en anteckning mitt i verifikatet
    2010  -100.00 SEK

; en kommentar mellan verifikaten

2025-01-02 Två
    1930  50.00 SEK
    2010  -50.00 SEK
`);

    const txs = transaktioner(items);

    expect(txs).toHaveLength(2);
    expect(rader(txs[0])).toEqual(["1930 100 SEK", "2010 -100 SEK"]);
    expect(txs[1].description).toBe("Två");
  });

  it("hanterar belopp utan valuta och med minustecken", async () => {
    const items = await parsa(`2025-01-01 Utan valuta
    1930  100
    2010  -100
`);

    expect(rader(transaktioner(items)[0])).toEqual(["1930 100", "2010 -100"]);
  });

  it("klarar transaktioner som spänner över flera läsblock", async () => {
    // Filen läses i chunkar; en stor journal tvingar fram flera varv
    const enTx = (n: number) =>
      `2025-01-01 Transaktion ${n}\n    1930  100.00 SEK\n    2010  -100.00 SEK\n`;
    const text = `account a\nalias 1930 = a\n\n${Array.from(
      { length: 2000 },
      (_, i) => enTx(i),
    ).join("\n")}`;

    const txs = transaktioner(await parsa(text));

    expect(txs).toHaveLength(2000);
    expect(txs[0].description).toBe("Transaktion 0");
    expect(txs[1999].description).toBe("Transaktion 1999");
    expect(rader(txs[1999])).toEqual(["1930 100 SEK", "2010 -100 SEK"]);
  });
});

describe("trasig indata", () => {
  it("kräver två mellanslag mellan konto och belopp — annars tappas raden", async () => {
    const items = await parsa(`2025-01-01 Ett mellanslag
    1930 100.00 SEK
    2010  -100.00 SEK
`);

    const [tx] = transaktioner(items);

    // Dokumenterar nuvarande beteende: raden med ett mellanslag försvinner
    // tyst och verifikatet blir obalanserat utan att någon varnar.
    expect(rader(tx)).toEqual(["2010 -100 SEK"]);
  });

  it("ger NaN som kontonummer för namngivna konton", async () => {
    const items = await parsa(`2025-01-01 Namngivet konto
    tillgångar:bankkonto  100.00 SEK
    2010  -100.00 SEK
`);

    const [tx] = transaktioner(items);

    // Appen förutsätter numeriska konton via alias. En hledger-journal som
    // bokför direkt på kontonamn ger NaN och räknas inte med i rapporterna.
    expect(tx.postings[0].account).toBeNaN();
  });

  it("hoppar över en transaktion vars datumrad saknar beskrivning", async () => {
    const items = await parsa(`2025-01-01
    1930  100.00 SEK
    2010  -100.00 SEK
`);

    expect(transaktioner(items)).toHaveLength(0);
  });

  it("ger en transaktion utan postings när alla rader är trasiga", async () => {
    const items = await parsa(`2025-01-01 Allt trasigt
    1930  hundra kronor
`);

    const [tx] = transaktioner(items);

    expect(tx.description).toBe("Allt trasigt");
    expect(tx.postings).toEqual([]);
  });
});
