import { beforeEach, describe, expect, it } from "vitest";
import type { Transaction } from "./parse-journal-file";
import { genereraSieFor, kodatCp437 } from "./sie-export";
import { decodaCp437, sieTillJournal, tolkaSie } from "./sie-import";
import { laddaJournal, rensaJournal } from "./test-helpers";

/** Handskriven SIE-fil med två perioder, kontonamn, IB-rader, citerad text
 *  med mellanslag och negativa belopp — som en Bokio-export kan se ut. */
const FIXTURE = [
  "#FLAGGA 0",
  '#PROGRAM "Bokio" "2.1"',
  "#FORMAT PCG4",
  "#GEN 20260801",
  '#FNAMN "Barlingshult Gård"',
  "#RAR -1 20240101 20241231",
  "#RAR 0 20250101 20251231",
  "#MVAL SEK",
  '#KONTO 1930 "Bankkonto"',
  '#KONTO 2018 "Egen insättning"',
  '#KONTO 3000 "Försäljning"',
  "#KPTYP BAS1996",
  "#IB -1 1930 500000",
  "#IB -1 2018 -500000",
  '#VER "A" "1" 20240615 "Hönsförsäljning"',
  "{",
  "    #TRANS 1930 {} 125000",
  "    #TRANS 3000 {} -125000",
  "}",
  '#VER "A" "2" 20250210 "Inköp av foder, grovfoder"',
  "{",
  "    #TRANS 4010 {} 45075",
  "    #TRANS 1930 {} -45075",
  "}",
  "#RES 0 3000 -125000",
  "#UB 0 1930 579925",
].join("\r\n");

describe("tolkaSie", () => {
  beforeEach(rensaJournal);

  it("tolkar perioder, kontonamn, IB-rader och verifikationer", () => {
    const data = tolkaSie(FIXTURE);

    expect(data.fnamn).toBe("Barlingshult Gård");
    expect(data.signerad).toBe(false);
    expect(data.perioder).toEqual([
      { nummer: "-1", start: "2024-01-01", slut: "2024-12-31" },
      { nummer: "0", start: "2025-01-01", slut: "2025-12-31" },
    ]);
    expect(data.kontonamn.get(1930)).toBe("Bankkonto");
    expect(data.ingaendeBalans.get("-1")?.get(1930)).toBe(500000);

    // Datumet på andra verifikatet saknas inte; texten med komma bevaras
    const [forsta, andra] = data.verifikat;
    expect(forsta).toMatchObject({
      serie: "A",
      nummer: "1",
      datum: "2024-06-15",
      text: "Hönsförsäljning",
    });
    expect(forsta.poster).toEqual([
      { konto: 1930, beloppOre: 125000 },
      { konto: 3000, beloppOre: -125000 },
    ]);

    // #VER utan datum får periodens slutdatum
    expect(andra.datum).toBe("2025-02-10");
    // #RES och #UB räknas som hoppade; #KPTYP m.fl. är kända och tysta
    expect(data.hoppadePoster).toBe(2);
  });

  it("varnar för signerade filer (#FLAGGA 1)", () => {
    const data = tolkaSie(
      [
        "#FLAGGA 1",
        '#FNAMN "Signerad firma"',
        '#VER "A" "1" 20250301 "Text"',
        "{",
        "    #TRANS 1930 {} 100",
        "    #TRANS 3000 {} -100",
        "}",
      ].join("\r\n"),
    );

    expect(data.signerad).toBe(true);
  });

  it("kastar när filen saknar verifikationer", () => {
    expect(() => tolkaSie("#FLAGGA 0\r\n#FNAMN Tom\r\n")).toThrow(
      /inga verifikationer/i,
    );
  });
});

describe("sieTillJournal", () => {
  beforeEach(rensaJournal);

  it("bygger konton, alias, transaktioner och IB-verifikat", () => {
    const journal = sieTillJournal(tolkaSie(FIXTURE));

    // Kontona sorterade på nummer; namnen från #KONTO i gemener med
    // blankstag → understreck (åäö bevaras), 4010 saknar #KONTO-rad
    expect(journal.konton.map((k) => k.name)).toEqual([
      "bankkonto",
      "egen_insättning",
      "försäljning",
      "konto_4010",
    ]);
    expect(journal.aliaser).toEqual([
      { id: 1930, to: "bankkonto" },
      { id: 2018, to: "egen_insättning" },
      { id: 3000, to: "försäljning" },
      { id: 4010, to: "konto_4010" },
    ]);

    // IB-verifikat först (periodstart), sedan verifikationerna kronologiskt
    const [ib, forsta, andra] = journal.transaktioner;

    expect(ib.code).toBe("IB2024");
    expect(ib.date).toBe("2024-01-01");
    expect(ib.description).toBe("Ingående balans 2024");
    expect(ib.postings).toEqual([
      { account: 1930, amount: 5000, currency: "SEK" },
      { account: 2018, amount: -5000, currency: "SEK" },
    ]);

    expect(forsta).toMatchObject({
      date: "2024-06-15",
      code: "A1",
      description: "Hönsförsäljning",
    });
    expect(andra.postings).toEqual([
      { account: 4010, amount: 450.75, currency: "SEK" },
      { account: 1930, amount: -450.75, currency: "SEK" },
    ]);

    expect(journal.ar).toEqual(["2024", "2025"]);
  });

  it("ger fallback-namn när filen saknar #KONTO-rader", () => {
    const fil = [
      "#RAR 0 20250101 20251231",
      '#VER "A" "1" 20250301 "Kaffe"',
      "{",
      "    #TRANS 6110 {} 2500",
      "    #TRANS 1930 {} -2500",
      "}",
    ].join("\r\n");
    const journal = sieTillJournal(tolkaSie(fil));

    expect(journal.aliaser).toContainEqual({ id: 6110, to: "konto_6110" });
    expect(journal.aliaser).toContainEqual({ id: 1930, to: "konto_1930" });
  });
});

describe("round-trip mot exporten", () => {
  beforeEach(rensaJournal);

  it("återskapar transaktionerna från en egen SIE-export", async () => {
    await laddaJournal(
      `account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto

2025-03-01 (A7) Försäljning på gårdsbutiken
    1930  1251.88 SEK
    3000  -1001.50 SEK
    2611  -250.38 SEK
`,
    );

    const original = {
      date: "2025-03-01",
      code: "A7",
      description: "Försäljning på gårdsbutiken",
      postings: [
        { account: 1930, beloppOre: 125188 },
        { account: 3000, beloppOre: -100150 },
        { account: 2611, beloppOre: -25038 },
      ],
    };

    // Exportera → CP437-bytes → avkoda → tolka → bygga journal
    const txs = [
      {
        uuid: "x",
        date: original.date,
        code: original.code,
        description: original.description,
        postings: original.postings.map((p) => ({
          account: p.account,
          amount: p.beloppOre / 100,
          currency: "SEK",
        })),
      } satisfies Transaction,
    ];

    const { sie } = genereraSieFor("2025", txs, { fnamn: "Gården" });
    const bytes = kodatCp437(sie);
    const journal = sieTillJournal(tolkaSie(decodaCp437(bytes.bytes)));

    const [tx] = journal.transaktioner;

    expect(tx.date).toBe(original.date);
    expect(tx.code).toBe(original.code);
    expect(tx.description).toBe(original.description);
    expect(
      tx.postings.map((p) => ({
        account: p.account,
        ore: Math.round(p.amount * 100),
      })),
    ).toEqual(
      original.postings.map(({ account, beloppOre }) => ({
        account,
        ore: beloppOre,
      })),
    );
  });

  it("avkodar CP437-bytes tillbaka till svenska tecken", () => {
    const bytes = kodatCp437("Gård Skörd Höst").bytes;

    expect(decodaCp437(bytes)).toBe("Gård Skörd Höst");
  });
});
