import { beforeEach, describe, expect, it } from "vitest";
import {
  beraknaArsresultatOre,
  harArsresultat,
  harNollning,
  skapaArsresultatTransaktion,
  skapaNollningTransaktion,
} from "./bokslut";
import { generateBalansrapport } from "./balansrapport";
import { transactions } from "./signals";
import { laddaJournal, radrader, rensaJournal, summaOre } from "./test-helpers";

const HEADER = `; Testkontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
account eget_kapital
alias 2010 = eget_kapital
account eget_kapital:egna_uttag
alias 2013 = eget_kapital:egna_uttag
account eget_kapital:egna_insättningar
alias 2018 = eget_kapital:egna_insättningar
account eget_kapital:årets_resultat
alias 2019 = eget_kapital:årets_resultat
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

const VINSTAR = `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK

2025-04-01 Inköp
    4000  4000.00 SEK
    1930  -4000.00 SEK`;

function bokfor(transaktion: { postings: unknown } | null) {
  if (transaktion) {
    transactions.value = [...transactions.value, transaktion as never];
  }
  return transaktion;
}

beforeEach(rensaJournal);

describe("beraknaArsresultatOre", () => {
  it("räknar intäkter minus kostnader som vinst", async () => {
    await laddaJournal(journal(VINSTAR));

    expect(beraknaArsresultatOre("2025")).toBe(600000);
  });

  it("ger negativt resultat vid förlust", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1000.00 SEK
    3000  -1000.00 SEK`,
        `2025-04-01 Inköp
    4000  2500.00 SEK
    1930  -2500.00 SEK`,
      ),
    );

    expect(beraknaArsresultatOre("2025")).toBe(-150000);
  });

  it("räknar bara resultatkonton, inte balanskonton", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Egen insättning, rör bara balansräkningen
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
      ),
    );

    expect(beraknaArsresultatOre("2025")).toBe(0);
  });

  it("håller isär åren", async () => {
    await laddaJournal(
      journal(
        VINSTAR,
        `2026-03-01 Försäljning nästa år
    1930  2000.00 SEK
    3000  -2000.00 SEK`,
      ),
    );

    expect(beraknaArsresultatOre("2025")).toBe(600000);
    expect(beraknaArsresultatOre("2026")).toBe(200000);
  });
});

describe("skapaArsresultatTransaktion", () => {
  it("omför vinsten från 8999 till 2019 per 31 december", async () => {
    await laddaJournal(journal(VINSTAR));

    const arsresultat = skapaArsresultatTransaktion("2025")!;

    expect(arsresultat.date).toBe("2025-12-31");
    expect(arsresultat.description).toBe("Årets resultat 2025");
    expect(radrader(arsresultat.postings)).toEqual(["8999 6000", "2019 -6000"]);
    expect(summaOre(arsresultat.postings)).toBe(0);
  });

  it("vänder tecknen vid förlust", async () => {
    await laddaJournal(
      journal(
        `2025-04-01 Inköp utan intäkter
    4000  2500.00 SEK
    1930  -2500.00 SEK`,
      ),
    );

    const arsresultat = skapaArsresultatTransaktion("2025")!;

    expect(radrader(arsresultat.postings)).toEqual(["8999 -2500", "2019 2500"]);
  });

  it("nollar resultaträkningen när den bokförts", async () => {
    await laddaJournal(journal(VINSTAR));
    bokfor(skapaArsresultatTransaktion("2025"));

    // Omföringen exkluderas ur beräkningen, men balansrapportens beräknade
    // resultat ska nu vara noll eftersom 8999 möter resultatkontona.
    expect(generateBalansrapport("2025").beraknatResultat).toBeCloseTo(0, 6);
    expect(harArsresultat("2025")).toBe(true);
  });

  it("räknar inte om resultatet utifrån en redan bokförd omföring", async () => {
    await laddaJournal(journal(VINSTAR));
    const forsta = bokfor(skapaArsresultatTransaktion("2025")) as {
      postings: Array<{ account: number; amount: number }>;
    };

    expect(radrader(skapaArsresultatTransaktion("2025")!.postings)).toEqual(
      radrader(forsta.postings),
    );
  });

  it("returnerar null när året saknar resultat", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Egen insättning
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
      ),
    );

    expect(skapaArsresultatTransaktion("2025")).toBeNull();
  });
});

describe("skapaNollningTransaktion", () => {
  it("nollar underkontona mot 2010 per 1 januari året efter", async () => {
    await laddaJournal(
      journal(
        VINSTAR,
        `2025-06-01 Egen insättning
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
        `2025-07-01 Eget uttag
    2013  3000.00 SEK
    1930  -3000.00 SEK`,
      ),
    );
    bokfor(skapaArsresultatTransaktion("2025"));

    const nollning = skapaNollningTransaktion("2025")!;

    expect(nollning.date).toBe("2026-01-01");
    expect(nollning.description).toBe("Nollställning av eget kapital 2025");
    // 2013 uttag +3000 (debet), 2018 insättning −5000 (kredit),
    // 2019 årets resultat −6000 (kredit) → netto −8000 till 2010
    expect(radrader(nollning.postings)).toEqual([
      "2013 -3000",
      "2018 5000",
      "2019 6000",
      "2010 -8000",
    ]);
    expect(summaOre(nollning.postings)).toBe(0);
  });

  it("lämnar underkontona på noll och samlar allt på 2010", async () => {
    await laddaJournal(
      journal(
        VINSTAR,
        `2025-07-01 Eget uttag
    2013  3000.00 SEK
    1930  -3000.00 SEK`,
      ),
    );
    bokfor(skapaArsresultatTransaktion("2025"));
    bokfor(skapaNollningTransaktion("2025"));

    const ek = generateBalansrapport("2026").egetKapitalSkulder;
    const saldo = (konto: number) =>
      ek.find((rad) => rad.konto === konto)?.ub ?? 0;

    expect(saldo(2013)).toBeCloseTo(0, 6);
    expect(saldo(2019)).toBeCloseTo(0, 6);
    // Vinst 6000 − uttag 3000 = 3000 kvar som eget kapital
    expect(saldo(2010)).toBeCloseTo(3000, 6);
    expect(generateBalansrapport("2026").differensOre).toBe(0);
  });

  it("dubbelnollar inte — andra året tar bara med nya rörelser", async () => {
    await laddaJournal(
      journal(
        VINSTAR,
        `2026-05-01 Eget uttag år två
    2013  1000.00 SEK
    1930  -1000.00 SEK`,
      ),
    );
    bokfor(skapaArsresultatTransaktion("2025"));
    bokfor(skapaNollningTransaktion("2025"));
    bokfor(skapaArsresultatTransaktion("2026"));

    const nollning2026 = skapaNollningTransaktion("2026")!;

    expect(nollning2026.date).toBe("2027-01-01");
    // Endast år två: uttaget 1000. 2019 är noll eftersom 2026 saknar resultat.
    expect(radrader(nollning2026.postings)).toEqual(["2013 -1000", "2010 1000"]);
    expect(summaOre(nollning2026.postings)).toBe(0);
  });

  it("returnerar null när underkontona saknar saldon", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning utan bokslut
    1930  1000.00 SEK
    3000  -1000.00 SEK`,
      ),
    );

    expect(skapaNollningTransaktion("2025")).toBeNull();
  });
});

describe("harNollning", () => {
  it("hittar nollningen som är daterad året efter", async () => {
    await laddaJournal(journal(VINSTAR));
    bokfor(skapaArsresultatTransaktion("2025"));

    expect(harNollning("2025")).toBe(false);

    bokfor(skapaNollningTransaktion("2025"));

    expect(harNollning("2025")).toBe(true);
    // Nollningen ligger i 2026 men hör till 2025 — 2026 är inte nollat
    expect(harNollning("2026")).toBe(false);
  });
});
