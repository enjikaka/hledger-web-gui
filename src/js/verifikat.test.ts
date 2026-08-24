import { beforeEach, describe, expect, it } from "vitest";
import { skapaArsresultatTransaktion } from "./bokslut";
import { skapaTransaktion, mallar } from "./mallar";
import { skapaMomsomforing } from "./momsrapport";
import { hledgerOutput, transactions } from "./signals";
import { laddaJournal, rensaJournal } from "./test-helpers";
import {
  granskaSerie,
  harSerieproblem,
  nastaVerifikat,
  numrera,
  tolkaVerifikat,
} from "./verifikat";

const HEADER = `account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

const tx = (datum: string, kod: string | null, beskrivning: string) =>
  `${datum} ${kod ? `(${kod}) ` : ""}${beskrivning}
    1930  100.00 SEK
    3000  -100.00 SEK`;

beforeEach(rensaJournal);

describe("tolkaVerifikat", () => {
  it("delar serie och nummer", () => {
    expect(tolkaVerifikat("A12")).toEqual({ serie: "A", nummer: 12 });
    expect(tolkaVerifikat("B7")).toEqual({ serie: "B", nummer: 7 });
  });

  it("antar standardserien när koden bara är en siffra", () => {
    expect(tolkaVerifikat("5")).toEqual({ serie: "A", nummer: 5 });
  });

  it("ger null för koder som inte är verifikationsnummer", () => {
    expect(tolkaVerifikat(undefined)).toBeNull();
    expect(tolkaVerifikat("")).toBeNull();
    expect(tolkaVerifikat("faktura-2025")).toBeNull();
    // Ett uuid uppfyller lagtextens ord men duger inte som serie
    expect(tolkaVerifikat(crypto.randomUUID())).toBeNull();
  });
});

describe("parsern läser kodfältet", () => {
  it("plockar ut numret utan att blanda in det i beskrivningen", async () => {
    await laddaJournal(
      journal(tx("2025-03-01", "A12", "Granngården, Hönsfoder")),
    );

    const [transaktion] = transactions.value;

    expect(transaktion.code).toBe("A12");
    expect(transaktion.description).toBe("Granngården, Hönsfoder");
  });

  it("klarar transaktioner utan kod", async () => {
    await laddaJournal(journal(tx("2025-03-01", null, "Utan nummer")));

    const [transaktion] = transactions.value;

    expect(transaktion.code).toBeUndefined();
    expect(transaktion.description).toBe("Utan nummer");
  });
});

describe("hledgerOutput skriver kodfältet", () => {
  it("skriver numret i parentes efter datumet", async () => {
    await laddaJournal(
      journal(tx("2025-03-01", "A12", "Granngården, Hönsfoder")),
    );

    expect(hledgerOutput.value).toContain(
      "2025-03-01 (A12) Granngården, Hönsfoder",
    );
  });

  it("överlever en runda in och ut", async () => {
    const original = journal(
      tx("2025-03-01", "A1", "Första"),
      tx("2025-03-02", "A2", "Andra"),
    );

    await laddaJournal(original);
    const utdata = hledgerOutput.value;
    await laddaJournal(utdata);

    expect(transactions.value.map((t) => t.code)).toEqual(["A1", "A2"]);
    expect(hledgerOutput.value).toBe(utdata);
  });

  it("utelämnar parentesen när numret saknas", async () => {
    await laddaJournal(journal(tx("2025-03-01", null, "Utan nummer")));

    expect(hledgerOutput.value).toContain("2025-03-01 Utan nummer");
    expect(hledgerOutput.value).not.toContain("()");
  });
});

describe("nastaVerifikat", () => {
  it("börjar på 1 i en tom journal", async () => {
    await laddaJournal(journal());

    expect(nastaVerifikat("2025")).toBe("A1");
  });

  it("fortsätter från högsta använda numret", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-03-02", "A2", "Andra"),
      ),
    );

    expect(nastaVerifikat("2025")).toBe("A3");
  });

  it("återanvänder inte numret på ett borttaget verifikat", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-03-02", "A2", "Andra"),
        tx("2025-03-03", "A3", "Tredje"),
      ),
    );

    // Ta bort mittenverifikatet, som i UI:t
    transactions.value = transactions.value.filter((t) => t.code !== "A2");

    // A2 är förbrukat — serien ska fortsätta på 4, annars tappar numreringen
    // sin betydelse som fullständighetskontroll
    expect(nastaVerifikat("2025")).toBe("A4");
  });

  it("börjar om på 1 varje räkenskapsår", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-12-31", "A2", "Andra"),
      ),
    );

    expect(nastaVerifikat("2026")).toBe("A1");
  });

  it("räknar serierna oberoende av varandra", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Serie A"),
        tx("2025-03-02", "B5", "Serie B"),
      ),
    );

    expect(nastaVerifikat("2025", "A")).toBe("A2");
    expect(nastaVerifikat("2025", "B")).toBe("B6");
  });
});

describe("numrera", () => {
  it("sätter nästa nummer på en onumrerad transaktion", async () => {
    await laddaJournal(journal(tx("2025-03-01", "A1", "Första")));

    const numrerad = numrera({
      uuid: crypto.randomUUID(),
      date: "2025-04-01",
      description: "Ny",
      postings: [],
    });

    expect(numrerad.code).toBe("A2");
  });

  it("rör inte en transaktion som redan har ett nummer", async () => {
    await laddaJournal(journal(tx("2025-03-01", "A1", "Första")));

    const original = {
      uuid: crypto.randomUUID(),
      date: "2025-04-01",
      code: "A99",
      description: "Redan numrerad",
      postings: [],
    };

    expect(numrera(original)).toBe(original);
  });
});

describe("transaktioner som appen skapar får nummer", () => {
  it("numrerar en transaktion från mall", async () => {
    await laddaJournal(journal(tx("2025-03-01", "A1", "Första")));

    const transaktion = skapaTransaktion(
      mallar[0],
      "2025-04-01",
      315.92,
      "Granngården",
    );

    expect(transaktion.code).toBe("A2");
  });

  it("numrerar momsomföringen", async () => {
    await laddaJournal(
      journal(`2025-03-01 (A1) Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`),
    );

    expect(skapaMomsomforing("2025")!.code).toBe("A2");
  });

  it("numrerar bokslutsverifikaten", async () => {
    await laddaJournal(
      journal(`2025-03-01 (A1) Försäljning
    1930  1000.00 SEK
    3000  -1000.00 SEK`),
    );

    expect(skapaArsresultatTransaktion("2025")!.code).toBe("A2");
  });

  it("ger löpande nummer när flera bokförs efter varandra", async () => {
    await laddaJournal(journal());

    for (const beskrivning of ["Ett", "Två", "Tre"]) {
      transactions.value = [
        ...transactions.value,
        skapaTransaktion(mallar[0], "2025-04-01", 100, beskrivning),
      ];
    }

    expect(transactions.value.map((t) => t.code)).toEqual(["A1", "A2", "A3"]);
  });
});

describe("granskaSerie", () => {
  it("är nöjd med en obruten serie", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-03-02", "A2", "Andra"),
        tx("2025-03-03", "A3", "Tredje"),
      ),
    );

    const problem = granskaSerie("2025");

    expect(problem).toEqual({
      luckor: [],
      dubbletter: [],
      onumrerade: 0,
      borjarPa: null,
    });
    expect(harSerieproblem(problem)).toBe(false);
  });

  it("hittar luckan efter ett borttaget verifikat", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-03-03", "A3", "Tredje"),
      ),
    );

    const problem = granskaSerie("2025");

    expect(problem.luckor).toEqual([2]);
    expect(harSerieproblem(problem)).toBe(true);
  });

  it("hittar flera luckor", async () => {
    await laddaJournal(
      journal(tx("2025-03-01", "A1", "Första"), tx("2025-03-05", "A5", "Femte")),
    );

    expect(granskaSerie("2025").luckor).toEqual([2, 3, 4]);
  });

  it("hittar dubbletter", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Första"),
        tx("2025-03-02", "A1", "Också ett"),
      ),
    );

    const problem = granskaSerie("2025");

    expect(problem.dubbletter).toEqual([1]);
    expect(problem.luckor).toEqual([]);
  });

  it("räknar onumrerade verifikat", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "Numrerad"),
        tx("2025-03-02", null, "Onumrerad"),
      ),
    );

    expect(granskaSerie("2025").onumrerade).toBe(1);
  });

  it("larmar inte om serien börjar på annat än 1", async () => {
    // Löpande numrering över årsgränsen är ett giltigt val
    await laddaJournal(
      journal(
        tx("2026-03-01", "A18", "Artonde"),
        tx("2026-03-02", "A19", "Nittonde"),
      ),
    );

    const problem = granskaSerie("2026");

    expect(problem.luckor).toEqual([]);
    expect(problem.borjarPa).toBe(18);
    expect(harSerieproblem(problem)).toBe(false);
  });

  it("hittar luckor även i en serie som inte börjar på 1", async () => {
    await laddaJournal(
      journal(
        tx("2026-03-01", "A18", "Artonde"),
        tx("2026-03-03", "A20", "Tjugonde"),
      ),
    );

    expect(granskaSerie("2026").luckor).toEqual([19]);
  });

  it("granskar ett år i taget", async () => {
    await laddaJournal(
      journal(
        tx("2025-03-01", "A1", "År ett"),
        tx("2026-03-01", "A1", "År två"),
      ),
    );

    // Samma nummer i olika år är korrekt, inte en dubblett
    expect(granskaSerie("2025").dubbletter).toEqual([]);
    expect(granskaSerie("2026").dubbletter).toEqual([]);
  });
});
