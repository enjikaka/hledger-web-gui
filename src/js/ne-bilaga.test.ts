import { beforeEach, describe, expect, it } from "vitest";
import { beraknaArsresultatOre, skapaArsresultatTransaktion } from "./bokslut";
import {
  generateNeBilaga,
  type NeBilaga,
  type NeJusteringsrad,
  type NeRuta,
} from "./ne-bilaga";
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

/** Rad i justeringsavsnittet, både justeringsrutor ("R13") och summorutor ("R17"). */
function jrad(bilaga: NeBilaga, ruta: string): NeJusteringsrad {
  const rad = bilaga.justeringar.find((r) => r.ruta === ruta);

  if (!rad) {
    throw new Error(`Ruta ${ruta} saknas bland justeringarna`);
  }

  return rad;
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

describe("skattemässiga justeringar R12–R48", () => {
  it("för över det bokförda resultatet från R11 till R12", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(jrad(bilaga, "R12").belopp).toBe(10000);
    expect(jrad(bilaga, "R12").summa).toBe(true);
  });

  it("lägger tillbaka ej avdragsgilla kostnader i R13 — men de ligger kvar i räkenskapsschemat", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Representation, ej avdragsgill
    6072  500.00 SEK
    1930  -500.00 SEK`,
        `2025-03-02 Böter
    6992  300.00 SEK
    1930  -300.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // Kostnaderna är bokförda och hör hemma i R6 ...
    expect(ruta(bilaga, "R6")).toBe(800);
    expect(bilaga.bokfortResultat).toBe(-800);

    // ... men får inte dras av, så de läggs tillbaka i R13
    const r13 = jrad(bilaga, "R13");
    expect(r13.belopp).toBe(800);
    expect(r13.manuell).toBe(false);
    expect(r13.konton).toEqual([
      { konto: 6072, namn: "", belopp: 500 },
      { konto: 6992, namn: "", belopp: 300 },
    ]);

    // R17 = R12 + R13: återläggningen tar ut det bokförda resultatet
    expect(jrad(bilaga, "R17").belopp).toBe(0);
    expect(bilaga.skattemassigtResultat).toBe(0);
  });

  it("räknar summorutorna längs kedjan när bara bokföringsbaserade rutor har belopp", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
        `2025-03-02 Böter
    6992  800.00 SEK
    1930  -800.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(jrad(bilaga, "R12").belopp).toBe(9200);
    expect(jrad(bilaga, "R17").belopp).toBe(10000);
    expect(jrad(bilaga, "R21").belopp).toBe(10000);
    expect(jrad(bilaga, "R29").belopp).toBe(10000);
    expect(jrad(bilaga, "R33").belopp).toBe(10000);
    expect(jrad(bilaga, "R35").belopp).toBe(10000);
    expect(jrad(bilaga, "R42").belopp).toBe(10000);
    expect(jrad(bilaga, "R47").belopp).toBe(10000);
    expect(bilaga.skattemassigtResultat).toBe(10000);
  });

  it("drar bort skattefria ränteintäkter (8314) i R14 — men de ligger kvar i R4", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Skattefri ränta
    1930  200.00 SEK
    8314  -200.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // Intäkten är bokförd och syns i R4 ...
    expect(ruta(bilaga, "R4")).toBe(200);

    // ... men ska inte beskattas, så den dras bort i R14
    const r14 = jrad(bilaga, "R14");
    expect(r14.belopp).toBe(200);
    expect(r14.manuell).toBe(false);
    expect(r14.konton).toEqual([{ konto: 8314, namn: "", belopp: 200 }]);

    // R17 = R12 − R14: intäkten påverkar inte det skattemässiga resultatet
    expect(jrad(bilaga, "R17").belopp).toBe(0);
  });

  it("markerar rutor utan bokföringsunderlag som manuella med belopp 0", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    for (const ruta of ["R15", "R16", "R18", "R24", "R34", "R40", "R43"]) {
      const rad = jrad(bilaga, ruta);
      expect(rad.manuell).toBe(true);
      expect(rad.belopp).toBe(0);
      expect(rad.konton).toEqual([]);
    }
  });

  it("visar R47 Överskott vid vinst och R48 Underskott vid förlust", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );

    const vinst = generateNeBilaga("2025");
    expect(vinst.justeringar.at(-1)!.ruta).toBe("R47");
    expect(vinst.justeringar.at(-1)!.belopp).toBe(10000);

    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
        `2025-04-01 Inköp
    4000  15000.00 SEK
    1930  -15000.00 SEK`,
      ),
    );

    const forlust = generateNeBilaga("2025");
    expect(forlust.justeringar.at(-1)!.ruta).toBe("R48");
    expect(forlust.justeringar.at(-1)!.belopp).toBe(5000);
    expect(forlust.skattemassigtResultat).toBe(-5000);
  });

  it("håller isär åren vid R13", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Böter 2025
    6992  300.00 SEK
    1930  -300.00 SEK`,
        `2026-03-01 Böter 2026
    6992  700.00 SEK
    1930  -700.00 SEK`,
      ),
    );

    expect(jrad(generateNeBilaga("2025"), "R13").belopp).toBe(300);
    expect(jrad(generateNeBilaga("2026"), "R13").belopp).toBe(700);
  });
});

describe("räntefördelning, egenavgifter och periodiseringsfond", () => {
  const forsalkJournal = async () =>
    laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );

  it("drar positiv räntefördelning i R30 och följer kedjan till R47", async () => {
    await forsalkJournal();

    // SLR 2,55 % + 6 pe = 8,55 %. 100 000 × 0,0855 = 8 550
    const bilaga = generateNeBilaga("2025", {
      rantefordelning: { kapitalunderlag: 100_000, slrOverskrivning: 0.0255 },
    });

    const r30 = jrad(bilaga, "R30");
    expect(r30.manuell).toBe(false);
    expect(r30.belopp).toBe(8550);
    expect(jrad(bilaga, "R31").manuell).toBe(true);

    // R33 = R29 − R30 = 10 000 − 8 550
    expect(jrad(bilaga, "R33").belopp).toBe(1450);
    expect(jrad(bilaga, "R47").belopp).toBe(1450);
    expect(bilaga.skattemassigtResultat).toBe(1450);
  });

  it("begränsar positiv räntefördelning till R29 — överskjutande belopp sparas", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  5000.00 SEK
    3000  -5000.00 SEK`,
      ),
    );

    // Förslaget är 8 550 kr men resultatet före räntefördelning (R29) är
    // bara 5 000 kr — avdraget får inte skapa underskott.
    const bilaga = generateNeBilaga("2025", {
      rantefordelning: { kapitalunderlag: 100_000, slrOverskrivning: 0.0255 },
    });

    expect(jrad(bilaga, "R30").belopp).toBe(5000);
    expect(jrad(bilaga, "R33").belopp).toBe(0);
    expect(jrad(bilaga, "R47").belopp).toBe(0);
    expect(
      bilaga.varningar.some((v) => v.includes("sparat fördelningsbelopp")),
    ).toBe(true);
  });

  it("lägger negativ räntefördelning till i R31 när kapitalunderlaget under −500 000 kr", async () => {
    await forsalkJournal();

    const bilaga = generateNeBilaga("2025", {
      rantefordelning: { kapitalunderlag: -600_000, slrOverskrivning: 0.0255 },
    });

    const r31 = jrad(bilaga, "R31");
    expect(r31.manuell).toBe(false);
    expect(r31.belopp).toBe(21300);

    // Tillägget höjer det skattemässiga resultatet: 10 000 + 21 300
    expect(jrad(bilaga, "R33").belopp).toBe(31300);
    expect(bilaga.varningar.some((v) => v.includes("-500 000"))).toBe(true);
  });

  it("räknar fram schablonavdraget i R43 och följer kedjan via R42", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  200000.00 SEK
    3000  -200000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      egenavgifter: { kategori: "full" },
    });

    expect(jrad(bilaga, "R40").manuell).toBe(false);
    expect(jrad(bilaga, "R41").manuell).toBe(false);
    expect(jrad(bilaga, "R42").belopp).toBe(200000);

    const r43 = jrad(bilaga, "R43");
    expect(r43.manuell).toBe(false);
    expect(r43.belopp).toBe(50_000); // 25 % av 200 000

    expect(jrad(bilaga, "R47").belopp).toBe(150_000);
    expect(bilaga.varningar.some((v) => /nedsättning/i.test(v))).toBe(true);
  });

  it("väger in föregående års poster (R40/R41) i schablonavdraget", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  200000.00 SEK
    3000  -200000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      egenavgifter: {
        kategori: "full",
        foregaendeArsSchablonavdrag: 30_000,
        foregaendeArsPafort: 25_000,
      },
    });

    expect(jrad(bilaga, "R40").belopp).toBe(30_000);
    expect(jrad(bilaga, "R41").belopp).toBe(25_000);
    expect(jrad(bilaga, "R42").belopp).toBe(205_000);
    expect(jrad(bilaga, "R43").belopp).toBe(51_250); // 25 % av 205 000
    expect(jrad(bilaga, "R47").belopp).toBe(153_750);
  });

  it("sätter maximal periodiseringsfondavsättning i R34 som default", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  100000.00 SEK
    3000  -100000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      periodiseringsfond: { fonder: [] },
    });

    const r34 = jrad(bilaga, "R34");
    expect(r34.manuell).toBe(false);
    expect(r34.belopp).toBe(30_000); // 30 % av R33 = 100 000

    expect(jrad(bilaga, "R33").belopp).toBe(100_000);
    expect(jrad(bilaga, "R35").belopp).toBe(70_000);
    expect(jrad(bilaga, "R47").belopp).toBe(70_000);
  });

  it("hedrar en lägre önskad avsättning till periodiseringsfonden", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  100000.00 SEK
    3000  -100000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      periodiseringsfond: { fonder: [], onskadAvsattning: 10_000 },
    });

    expect(jrad(bilaga, "R34").belopp).toBe(10_000);
    expect(jrad(bilaga, "R35").belopp).toBe(90_000);
  });

  it("återför gamla periodiseringsfonder i R32 — och taket på R34 växer med", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  100000.00 SEK
    3000  -100000.00 SEK`,
      ),
    );

    // Kohort 2019 har passerat sexårsgränsen vid deklarationen för 2025
    const bilaga = generateNeBilaga("2025", {
      periodiseringsfond: { fonder: [{ ar: 2019, saldo: 5000 }] },
    });

    const r32 = jrad(bilaga, "R32");
    expect(r32.manuell).toBe(false);
    expect(r32.belopp).toBe(5000);

    // R33 = 100 000 + 5 000, taket = 30 % av R33 = 31 500
    expect(jrad(bilaga, "R33").belopp).toBe(105_000);
    expect(jrad(bilaga, "R34").belopp).toBe(31_500);
    expect(jrad(bilaga, "R35").belopp).toBe(73_500);
    expect(jrad(bilaga, "R47").belopp).toBe(73_500);
    expect(bilaga.varningar.some((v) => v.includes("måste återföras"))).toBe(
      true,
    );
  });

  it("lämnar räntefördelnings- och fondrutorna manuella utan deklarationsuppgifter", async () => {
    await forsalkJournal();

    const bilaga = generateNeBilaga("2025");

    for (const ruta of ["R30", "R31", "R32", "R36", "R37"]) {
      const rad = jrad(bilaga, ruta);
      expect(rad.manuell).toBe(true);
      expect(rad.belopp).toBe(0);
    }
  });

  it("sätter av till expansionsfond i R36 och följer kedjan via R35", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  100000.00 SEK
    3000  -100000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      expansionsfond: {
        kapitalunderlag: 100_000,
        befintligtSaldo: 0,
        onskadAndring: 40_000,
      },
    });

    const r36 = jrad(bilaga, "R36");
    expect(r36.manuell).toBe(false);
    expect(r36.belopp).toBe(40_000);

    expect(jrad(bilaga, "R35").belopp).toBe(100_000);
    expect(jrad(bilaga, "R42").belopp).toBe(60_000);
    expect(jrad(bilaga, "R47").belopp).toBe(60_000);
  });

  it("takar avsättningen till expansionsfond mot R35 — resultatet får inte bli negativt", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  100000.00 SEK
    3000  -100000.00 SEK`,
      ),
    );

    // Önskan 150 000 kr men inkomsten före avsättning (R35) är bara 100 000.
    // Kapitalunderlaget räcker (taket 125 940), så det är R35 som begränsar.
    const bilaga = generateNeBilaga("2025", {
      expansionsfond: {
        kapitalunderlag: 100_000,
        befintligtSaldo: 0,
        onskadAndring: 150_000,
      },
    });

    expect(jrad(bilaga, "R36").belopp).toBe(100_000);
    expect(jrad(bilaga, "R42").belopp).toBe(0);
    expect(jrad(bilaga, "R47").belopp).toBe(0);
    expect(bilaga.varningar.some((v) => v.includes("(R35)"))).toBe(true);
  });

  it("återförer expansionsfond i R37 och höjer resultatet", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  50000.00 SEK
    3000  -50000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025", {
      expansionsfond: {
        kapitalunderlag: 100_000,
        befintligtSaldo: 30_000,
        onskadAndring: -30_000,
      },
    });

    const r37 = jrad(bilaga, "R37");
    expect(r37.manuell).toBe(false);
    expect(r37.belopp).toBe(30_000);
    expect(jrad(bilaga, "R36").manuell).toBe(true);

    // Intäkten vid återföringen ökar resultatet: 50 000 + 30 000
    expect(jrad(bilaga, "R47").belopp).toBe(80_000);
  });
});
