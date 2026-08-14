import { beforeEach, describe, expect, it } from "vitest";
import { beraknaArsresultatOre, skapaArsresultatTransaktion } from "./bokslut";
import { generateNeBilaga, type NeBilaga, type NeRuta } from "./ne-bilaga";
import { transactions } from "./signals";
import { laddaJournal, rensaJournal } from "./test-helpers";

const HEADER = `; Testkontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
account inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder
alias 4022 = inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

/** Belopp i en ruta, oavsett om den ligger bland intäkter eller kostnader. */
function ruta(bilaga: NeBilaga, ruta: NeRuta): number {
  const rad = [...bilaga.intakter, ...bilaga.kostnader].find(
    (r) => r.ruta === ruta,
  );

  if (!rad) {
    throw new Error(`Ruta ${ruta} saknas i bilagan`);
  }

  return rad.belopp;
}

beforeEach(rensaJournal);

describe("intäktsrutorna R1–R4", () => {
  it("lägger momspliktig försäljning i R1", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  12500.00 SEK
    3001  -10000.00 SEK
    2611  -2500.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // Endast nettot är intäkt — momsen är en skuld, inte ett resultatkonto
    expect(ruta(bilaga, "R1")).toBe(10000);
    expect(bilaga.bokfortResultat).toBe(10000);
  });

  it("lägger momsfria intäkter i R2", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Momsfri intäkt
    1930  5000.00 SEK
    3100  -5000.00 SEK`,
        `2025-03-02 Övrig rörelseintäkt
    1930  1000.00 SEK
    3990  -1000.00 SEK`,
      ),
    );

    expect(ruta(generateNeBilaga("2025"), "R2")).toBe(6000);
  });

  it("lägger VMB- och omvänd moms-försäljning (32xx) i R1, inte i R3", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1000.00 SEK
    3000  -1000.00 SEK`,
        `2025-03-02 Försäljning inom byggsektorn, omvänd betalningsskyldighet
    1930  2000.00 SEK
    3231  -2000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // BAS 3200–3299 är försäljningskonton (VMB och omvänd moms) och hör till
    // R1. R3 avser förmånsvärden och har inget kontointervall alls.
    expect(ruta(bilaga, "R1")).toBe(3000);
    expect(ruta(bilaga, "R3")).toBe(0);
  });

  it("räknar aldrig fram R3 — förmånsvärden fylls i för hand", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning VMB
    1930  5000.00 SEK
    3211  -5000.00 SEK`,
      ),
    );

    expect(ruta(generateNeBilaga("2025"), "R3")).toBe(0);
  });

  it("lägger ränteintäkter i R4", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Ränta på företagskonto
    1930  150.00 SEK
    8310  -150.00 SEK`,
      ),
    );

    expect(ruta(generateNeBilaga("2025"), "R4")).toBe(150);
  });
});

describe("kostnadsrutorna R5–R10", () => {
  it("lägger varuinköp i R5 och övriga kostnader i R6", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Inköp foder
    4022  800.00 SEK
    2640  200.00 SEK
    1930  -1000.00 SEK`,
        `2025-03-02 Kontorsmaterial
    6110  500.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(ruta(bilaga, "R5")).toBe(800);
    expect(ruta(bilaga, "R6")).toBe(500);
    expect(bilaga.bokfortResultat).toBe(-1300);
  });

  it("lägger lönekostnader i R7 och räntekostnader i R8", async () => {
    await laddaJournal(
      journal(
        `2025-03-25 Lön
    7010  20000.00 SEK
    1930  -20000.00 SEK`,
        `2025-03-31 Räntekostnad
    8410  300.00 SEK
    1930  -300.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(ruta(bilaga, "R7")).toBe(20000);
    expect(ruta(bilaga, "R8")).toBe(300);
  });

  it("skiljer avskrivning på byggnad (R9) från övriga avskrivningar (R10)", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Avskrivning byggnad
    7820  10000.00 SEK
    1110  -10000.00 SEK`,
        `2025-12-31 Avskrivning inventarier
    7830  5000.00 SEK
    1210  -5000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(ruta(bilaga, "R9")).toBe(10000);
    expect(ruta(bilaga, "R10")).toBe(5000);
  });

  it("lägger hela 782x-gruppen i R9, inte bara samlingskontot", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Avskrivning ladugård
    7821  24000.00 SEK
    1119  -24000.00 SEK`,
        `2025-12-31 Avskrivning markanläggning
    7824  3000.00 SEK
    1159  -3000.00 SEK`,
        `2025-12-31 Avskrivning immateriell tillgång
    7810  1000.00 SEK
    1019  -1000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // 7821 byggnader och 7824 markanläggningar hör till R9 — hamnade de i
    // R10 skulle byggnadsavskrivningen redovisas som maskiner på blanketten
    expect(ruta(bilaga, "R9")).toBe(27000);
    expect(ruta(bilaga, "R10")).toBe(1000);
  });
});

describe("R11 bokfört resultat", () => {
  it("är intäkter minus kostnader", async () => {
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

    expect(generateNeBilaga("2025").bokfortResultat).toBe(6000);
  });

  it("är summan av de avrundade rutorna, så blanketten går ihop", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  8123.45 SEK
    3000  -8123.45 SEK`,
        `2025-03-02 Inköp
    4000  2345.67 SEK
    1930  -2345.67 SEK`,
        `2025-03-03 Kontorsmaterial
    6110  111.11 SEK
    1930  -111.11 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");
    const summa = (rader: typeof bilaga.intakter) =>
      rader.reduce((total, rad) => total + rad.belopp, 0);

    // Skatteverket kontrollräknar blanketten: R11 måste vara exakt differensen
    // mellan de ifyllda rutorna, inte en egen avrundning av råsaldona.
    expect(bilaga.bokfortResultat).toBe(
      summa(bilaga.intakter) - summa(bilaga.kostnader),
    );
    expect(bilaga.bokfortResultat).toBe(8123 - 2346 - 111);
  });

  it("kan skilja någon krona från det bokförda resultatet, eftersom varje ruta avrundas", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  8123.45 SEK
    3000  -8123.45 SEK`,
        `2025-03-02 Inköp
    4000  2345.67 SEK
    1930  -2345.67 SEK`,
        `2025-03-03 Kontorsmaterial
    6110  111.11 SEK
    1930  -111.11 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");
    const bokfortKr = beraknaArsresultatOre("2025") / 100;

    // Bokföringen är exakt (5 666,67), blanketten avrundad (5 666).
    // Differensen ska stanna inom öresavrundningen per ruta.
    expect(bokfortKr).toBeCloseTo(5666.67, 2);
    expect(Math.abs(bilaga.bokfortResultat - bokfortKr)).toBeLessThan(
      bilaga.intakter.length + bilaga.kostnader.length,
    );
  });

  it("påverkas inte av att resultatet omförs vid bokslut", async () => {
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

    const fore = generateNeBilaga("2025");
    transactions.value = [
      ...transactions.value,
      skapaArsresultatTransaktion("2025")!,
    ];

    // Omföringen nollar 3000/4000 mot 8999 — utan spärren skulle bilagan bli tom
    expect(generateNeBilaga("2025")).toEqual(fore);
    expect(generateNeBilaga("2025").bokfortResultat).toBe(6000);
  });
});

describe("avrundning och avgränsning", () => {
  it("avrundar per ruta, inte per konto", async () => {
    await laddaJournal(
      journal(
        // Tre konton med 0,50 vardera: kontovis avrundning skulle ge 3 kr,
        // rutavis ger korrekta 2 kr (1,50 → 2)
        `2025-03-01 Tre småposter
    1930  1.50 SEK
    3000  -0.50 SEK
    3001  -0.50 SEK
    3002  -0.50 SEK`,
      ),
    );

    expect(ruta(generateNeBilaga("2025"), "R1")).toBe(2);
  });

  it("tar inte med balanskonton", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Egen insättning
    1930  5000.00 SEK
    2018  -5000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(bilaga.bokfortResultat).toBe(0);
    expect(bilaga.varningar).toEqual([]);
  });

  it("håller isär åren", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning 2025
    1930  1000.00 SEK
    3000  -1000.00 SEK`,
        `2026-03-01 Försäljning 2026
    1930  2000.00 SEK
    3000  -2000.00 SEK`,
      ),
    );

    expect(ruta(generateNeBilaga("2025"), "R1")).toBe(1000);
    expect(ruta(generateNeBilaga("2026"), "R1")).toBe(2000);
  });

  it("varnar för resultatkonton utan NE-ruta i stället för att tappa dem", async () => {
    await laddaJournal(
      journal(
        // 8910 (skatt) saknar ruta i räkenskapsschemat
        `2025-12-31 Skattekostnad
    8910  1000.00 SEK
    1930  -1000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(bilaga.varningar).toHaveLength(1);
    expect(bilaga.varningar[0]).toContain("8910");
    expect(bilaga.bokfortResultat).toBe(0);
  });

  it("visar kontouppdelningen bakom varje ruta", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Fårfoder
    4021  200.00 SEK
    1930  -200.00 SEK`,
        `2025-03-02 Hönsfoder
    4022  300.00 SEK
    1930  -300.00 SEK`,
      ),
    );

    const r5 = generateNeBilaga("2025").kostnader.find((r) => r.ruta === "R5")!;

    expect(r5.belopp).toBe(500);
    expect(r5.konton).toEqual([
      { konto: 4021, namn: "", belopp: 200 },
      {
        konto: 4022,
        namn: "inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder",
        belopp: 300,
      },
    ]);
  });
});
