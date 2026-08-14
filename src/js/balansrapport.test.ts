import { beforeEach, describe, expect, it } from "vitest";
import { generateBalansrapport, type Balansrapport } from "./balansrapport";
import {
  skapaArsresultatTransaktion,
  skapaNollningTransaktion,
} from "./bokslut";
import { transactions } from "./signals";
import { laddaJournal, rensaJournal } from "./test-helpers";

const HEADER = `; Testkontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
account eget_kapital
alias 2010 = eget_kapital
account skulder:leverantörsskulder
alias 2440 = skulder:leverantörsskulder
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

const rad = (rapport: Balansrapport, konto: number) =>
  [...rapport.tillgangar, ...rapport.egetKapitalSkulder].find(
    (r) => r.konto === konto,
  );

function bokfor(transaktion: unknown | null) {
  if (transaktion) {
    transactions.value = [...transactions.value, transaktion as never];
  }
}

beforeEach(rensaJournal);

describe("tillgångar och skulder", () => {
  it("visar tillgångar som de bokförs och skulder med omvänt tecken", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Inköp på kredit
    4000  1000.00 SEK
    2440  -1000.00 SEK`,
        `2025-03-02 Insättning
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
      ),
    );

    const rapport = generateBalansrapport("2025");

    // 1930 bokförs i debet och visas positivt
    expect(rad(rapport, 1930)?.ub).toBe(5000);
    // 2440 bokförs i kredit men visas som en positiv skuld
    expect(rad(rapport, 2440)?.ub).toBe(1000);
    expect(rad(rapport, 2018)?.ub).toBe(5000);
  });

  it("delar upp saldot i ingående balans och årets förändring", async () => {
    await laddaJournal(
      journal(
        `2024-06-01 Insättning år ett
    1930  3000.00 SEK
    2018  -3000.00 SEK`,
        `2025-06-01 Insättning år två
    1930  2000.00 SEK
    2018  -2000.00 SEK`,
      ),
    );

    const bank = rad(generateBalansrapport("2025"), 1930)!;

    expect(bank.ib).toBe(3000);
    expect(bank.forandring).toBe(2000);
    expect(bank.ub).toBe(5000);
  });

  it("utelämnar konton som saknar rörelse", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Insättning
    1930  1000.00 SEK
    2018  -1000.00 SEK`,
      ),
    );

    expect(rad(generateBalansrapport("2025"), 2440)).toBeUndefined();
  });
});

describe("beräknat resultat", () => {
  it("klumpar ihop resultatkontona till ett beräknat resultat", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
        `2025-03-02 Inköp
    4000  4000.00 SEK
    1930  -4000.00 SEK`,
      ),
    );

    const rapport = generateBalansrapport("2025");

    expect(rapport.beraknatResultat).toBe(6000);
    // Resultatkontona ska inte dyka upp som egna rader
    expect(rad(rapport, 3000)).toBeUndefined();
    expect(rad(rapport, 4000)).toBeUndefined();
  });

  it("ackumulerar resultat från tidigare år som inte omförts", async () => {
    await laddaJournal(
      journal(
        `2024-03-01 Försäljning år ett
    1930  1000.00 SEK
    3000  -1000.00 SEK`,
        `2025-03-01 Försäljning år två
    1930  2000.00 SEK
    3000  -2000.00 SEK`,
      ),
    );

    expect(generateBalansrapport("2025").beraknatResultat).toBe(3000);
  });

  it("går mot noll när resultatet omförts vid bokslut", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );
    bokfor(skapaArsresultatTransaktion("2025"));

    const rapport = generateBalansrapport("2025");

    expect(rapport.beraknatResultat).toBeCloseTo(0, 6);
    // Resultatet ligger nu på 2019 i eget kapital i stället
    expect(rad(rapport, 2019)?.ub).toBe(10000);
  });
});

describe("balansen", () => {
  it("balanserar en enkel journal", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
        `2025-03-02 Inköp på kredit
    4000  4000.00 SEK
    2440  -4000.00 SEK`,
      ),
    );

    const rapport = generateBalansrapport("2025");

    expect(rapport.differensOre).toBe(0);
    expect(rapport.summaTillgangar).toBe(rapport.summaEgetKapitalSkulder);
  });

  it("balanserar genom hela bokslutskedjan", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  12500.00 SEK
    3001  -10000.00 SEK
    2611  -2500.00 SEK`,
        `2025-03-02 Inköp
    4000  800.00 SEK
    2640  200.00 SEK
    1930  -1000.00 SEK`,
        `2025-07-01 Eget uttag
    2013  3000.00 SEK
    1930  -3000.00 SEK`,
      ),
    );

    bokfor(skapaArsresultatTransaktion("2025"));
    bokfor(skapaNollningTransaktion("2025"));

    for (const year of ["2025", "2026"]) {
      expect(generateBalansrapport(year).differensOre).toBe(0);
    }
  });

  it("upptäcker en obalanserad journal i stället för att dölja den", async () => {
    // En transaktion som inte summerar till noll — parsern accepterar den,
    // rapporten ska visa differensen så att felet syns.
    await laddaJournal(
      journal(
        `2025-03-01 Trasig transaktion
    1930  1000.00 SEK
    2440  -900.00 SEK`,
      ),
    );

    expect(generateBalansrapport("2025").differensOre).toBe(10000);
  });

  it("räknar differensen i ören så att öresfel inte försvinner", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 En öre fel
    1930  100.00 SEK
    2440  -99.99 SEK`,
      ),
    );

    expect(generateBalansrapport("2025").differensOre).toBe(1);
  });
});

describe("avgränsning i tid", () => {
  it("tar inte med transaktioner från kommande år", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Insättning
    1930  1000.00 SEK
    2018  -1000.00 SEK`,
        `2026-03-01 Insättning nästa år
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
      ),
    );

    expect(rad(generateBalansrapport("2025"), 1930)?.ub).toBe(1000);
    expect(rad(generateBalansrapport("2026"), 1930)?.ub).toBe(6000);
  });
});
