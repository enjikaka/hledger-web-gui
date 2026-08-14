import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMomsrapport,
  harMomsomforing,
  rutbelopp,
  momsSkuld,
  skapaMomsbetalning,
  skapaMomsomforing,
} from "./momsrapport";
import { laddaJournal, rensaJournal, radrader, summaOre } from "./test-helpers";
import { transactions } from "./signals";

const HEADER = `; Testkontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
account tillgångar:momsfordran
alias 1650 = tillgångar:momsfordran
account skulder:redovisningskonto_moms
alias 2650 = skulder:redovisningskonto_moms
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

/** Bokför en momsomföring och lägger den till journalen, som knappen gör. */
function bokforOmforing(year: string) {
  const omforing = skapaMomsomforing(year);
  if (omforing) {
    transactions.value = [...transactions.value, omforing];
  }
  return omforing;
}

beforeEach(rensaJournal);

describe("generateMomsrapport", () => {
  it("summerar utgående moms per skattesats", async () => {
    await laddaJournal(
      journal(
        // 25 %: 10 000 netto + 2 500 moms
        `2025-03-01 Försäljning 25 %
    1930  12500.00 SEK
    3001  -10000.00 SEK
    2611  -2500.00 SEK`,
        // 12 %: 1 000 netto + 120 moms
        `2025-04-01 Äggförsäljning 12 %
    1930  1120.00 SEK
    3002  -1000.00 SEK
    2621  -120.00 SEK`,
        // 6 %: 500 netto + 30 moms
        `2025-05-01 Försäljning 6 %
    1930  530.00 SEK
    3003  -500.00 SEK
    2631  -30.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "10")).toBe(2500);
    expect(rutbelopp(rapport, "11")).toBe(120);
    expect(rutbelopp(rapport, "12")).toBe(30);
    expect(rutbelopp(rapport, "48")).toBe(0);
    expect(rapport.nettoMoms).toBe(2650);
  });

  it("drar av ingående moms i ruta 48", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3001  -1000.00 SEK
    2611  -250.00 SEK`,
        `2025-03-05 Inköp foder
    4022  400.00 SEK
    2640  100.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "48")).toBe(100);
    expect(rapport.nettoMoms).toBe(150);
  });

  it("räknar kreditnotor som avdrag, inte som ny försäljning", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
        `2025-03-10 Kreditnota, returnerad vara
    1930  -1250.00 SEK
    3000  1000.00 SEK
    2611  250.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "05")).toBe(0);
    expect(rutbelopp(rapport, "10")).toBe(0);
    expect(rapport.nettoMoms).toBe(0);
  });

  it("håller isär åren", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Försäljning 2025
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
        `2026-01-01 Försäljning 2026
    1930  2500.00 SEK
    3000  -2000.00 SEK
    2611  -500.00 SEK`,
      ),
    );

    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(250);
    expect(rutbelopp(generateMomsrapport("2026"), "10")).toBe(500);
  });
});

describe("skapaMomsomforing", () => {
  it("nollar momskontona och bokför nettot i hela kronor", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
        `2025-03-05 Inköp
    4000  400.00 SEK
    2640  100.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    expect(omforing.date).toBe("2025-12-31");
    expect(omforing.description).toBe("Momsredovisning 2025");
    // 250 utgående − 100 ingående = 150 att betala, krediteras 2650
    expect(radrader(omforing.postings)).toEqual([
      "2611 250",
      "2640 -100",
      "2650 -150",
    ]);
    expect(summaOre(omforing.postings)).toBe(0);
  });

  it("avrundar uppåt från 50 öre, inte nedåt", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning med ören över halva kronan
    1930  1000.00 SEK
    3000  -892.14 SEK
    2611  -107.86 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    // 107,86 ska bli 108 kr i deklarationen — inte 107 som vid trunkering
    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(108);
    expect(radrader(omforing.postings)).toEqual([
      "2611 107.86",
      "2650 -108",
      "3740 0.14",
    ]);
    expect(summaOre(omforing.postings)).toBe(0);
  });

  it("avrundar exakt 50 öre uppåt", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning på halva kronan
    1930  1000.00 SEK
    3000  -899.50 SEK
    2611  -100.50 SEK`,
      ),
    );

    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(101);
  });

  it("avrundar nedåt under 50 öre", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning strax under halva kronan
    1930  1000.00 SEK
    3000  -899.51 SEK
    2611  -100.49 SEK`,
      ),
    );

    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(100);
  });

  it("ger hela kronor i alla rutor", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning med ören
    1930  1234.56 SEK
    3000  -987.65 SEK
    2611  -246.91 SEK`,
        `2025-03-02 Inköp med ören
    4000  400.33 SEK
    2640  100.08 SEK
    1930  -500.41 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    for (const [, belopp] of rapport.rutor) {
      expect(Number.isInteger(belopp)).toBe(true);
    }
    expect(Number.isInteger(rapport.nettoMoms)).toBe(true);
  });

  it("låter rutorna summera till ruta 49", async () => {
    await laddaJournal(
      journal(
        // Ören som drar åt olika håll vid avrundning
        `2025-03-01 Försäljning
    1930  1000.00 SEK
    3000  -899.60 SEK
    2611  -100.40 SEK`,
        `2025-03-02 Inköp
    4000  400.00 SEK
    2640  50.60 SEK
    1930  -450.60 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    // 100,40 → 100 och 50,60 → 51. Nettot måste vara 49, inte 49,80 → 50.
    expect(rutbelopp(rapport, "10")).toBe(100);
    expect(rutbelopp(rapport, "48")).toBe(51);
    expect(rapport.nettoMoms).toBe(49);
  });

  it("lägger öresdifferensen på 3740 när nettot avrundas", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning med ören
    1930  1000.00 SEK
    3000  -892.86 SEK
    2611  -107.14 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    // 107,14 deklareras som 107 kr; 0,14 balanseras på 3740
    expect(radrader(omforing.postings)).toEqual([
      "2611 107.14",
      "2650 -107",
      "3740 -0.14",
    ]);
    expect(summaOre(omforing.postings)).toBe(0);
  });

  it("bokför moms att återfå mot 1650 i stället för 2650", async () => {
    await laddaJournal(
      journal(
        `2025-03-05 Enbart inköp
    4000  400.00 SEK
    2640  100.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    expect(radrader(omforing.postings)).toEqual(["2640 -100", "1650 100"]);
    expect(summaOre(omforing.postings)).toBe(0);
  });

  it("returnerar null när det inte finns någon moms att omföra", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Momsfri försäljning
    1930  1000.00 SEK
    3305  -1000.00 SEK`,
      ),
    );

    expect(skapaMomsomforing("2025")).toBeNull();
  });

  it("låter rapporten visa periodens moms även efter att omföringen bokförts", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
      ),
    );

    const fore = generateMomsrapport("2025");
    bokforOmforing("2025");
    const efter = generateMomsrapport("2025");

    expect(efter).toEqual(fore);
    expect(rutbelopp(efter, "10")).toBe(250);
    expect(harMomsomforing("2025")).toBe(true);
  });

  it("räknar inte med en redan bokförd omföring en andra gång", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
      ),
    );

    const forsta = bokforOmforing("2025")!;
    const andra = skapaMomsomforing("2025")!;

    expect(radrader(andra.postings)).toEqual(radrader(forsta.postings));
  });
});

describe("momsskuld och betalning", () => {
  it("ser skulden på 2650 och nollar den vid inbetalning", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
      ),
    );
    bokforOmforing("2025");

    const skuld = momsSkuld()!;
    expect(skuld.konto).toBe(2650);
    expect(skuld.beloppOre).toBe(25000);
    expect(skuld.attBetala).toBe(true);
    expect(skuld.omforingsAr).toBe("2025");

    const betalning = skapaMomsbetalning("2026-02-12", 1930)!;
    expect(betalning.description).toBe("Momsinbetalning till Skatteverket");
    expect(radrader(betalning.postings)).toEqual(["2650 250", "1930 -250"]);
    expect(summaOre(betalning.postings)).toBe(0);

    transactions.value = [...transactions.value, betalning];
    expect(momsSkuld()).toBeNull();
  });

  it("ser fordran på 1650 och nollar den vid återbetalning", async () => {
    await laddaJournal(
      journal(
        `2025-03-05 Enbart inköp
    4000  400.00 SEK
    2640  100.00 SEK
    1930  -500.00 SEK`,
      ),
    );
    bokforOmforing("2025");

    const skuld = momsSkuld()!;
    expect(skuld.konto).toBe(1650);
    expect(skuld.attBetala).toBe(false);

    const betalning = skapaMomsbetalning("2026-02-12", 1930)!;
    expect(betalning.description).toBe(
      "Återbetalning av moms från Skatteverket",
    );
    expect(radrader(betalning.postings)).toEqual(["1650 -100", "1930 100"]);

    transactions.value = [...transactions.value, betalning];
    expect(momsSkuld()).toBeNull();
  });

  it("bokför återbetalning som eget uttag när pengarna går privat", async () => {
    await laddaJournal(
      journal(
        `2025-03-05 Enbart inköp
    4000  400.00 SEK
    2640  100.00 SEK
    1930  -500.00 SEK`,
      ),
    );
    bokforOmforing("2025");

    const betalning = skapaMomsbetalning("2026-02-12", 2013)!;

    expect(radrader(betalning.postings)).toEqual(["1650 -100", "2013 100"]);
    expect(summaOre(betalning.postings)).toBe(0);
  });

  it("bokför inbetalning som egen insättning när den betalas privat", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
      ),
    );
    bokforOmforing("2025");

    const betalning = skapaMomsbetalning("2026-02-12", 2018)!;

    expect(radrader(betalning.postings)).toEqual(["2650 250", "2018 -250"]);
  });

  it("betalningen påverkar inte momsrapporten", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3000  -1000.00 SEK
    2611  -250.00 SEK`,
      ),
    );
    bokforOmforing("2025");
    transactions.value = [
      ...transactions.value,
      skapaMomsbetalning("2026-02-12", 1930)!,
    ];

    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(250);
    expect(rutbelopp(generateMomsrapport("2026"), "10")).toBe(0);
  });

  it("returnerar null när det inte finns någon obetald moms", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Momsfri försäljning
    1930  1000.00 SEK
    3305  -1000.00 SEK`,
      ),
    );

    expect(momsSkuld()).toBeNull();
    expect(skapaMomsbetalning("2026-02-12", 1930)).toBeNull();
  });
});
