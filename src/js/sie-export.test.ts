import { beforeEach, describe, expect, it } from "vitest";
import { genereraSie, genereraSieFor, kodatCp437 } from "./sie-export";
import { transactions } from "./signals";
import { laddaJournal, rensaJournal } from "./test-helpers";

const journal = (...transaktioner: Array<string>) =>
  `${transaktioner.join("\n\n")}\n`;

/** Två år: insättning 2024 ger ingående balans, 2025 har två numrerade
 *  verifikat plus ett onumrerat som ska exkluderas men ingå i saldon. */
const UNDERLAG = journal(
  `2024-01-01 (A1) Egen insättning
    1930  10000.00 SEK
    2018  -10000.00 SEK`,
  `2025-03-01 (A1) Försäljning
    1930  12500.00 SEK
    3000  -10000.00 SEK
    2611  -2500.00 SEK`,
  `2025-04-01 (A2) Inköp
    4022  800.50 SEK
    1930  -800.50 SEK`,
  `2025-05-01 Utan nummer
    1930  100.00 SEK
    3001  -100.00 SEK`,
);

describe("genereraSieFor", () => {
  beforeEach(rensaJournal);

  it("bygger headern, saldon i ören och verifikationer kronologiskt", async () => {
    await laddaJournal(UNDERLAG);

    const { sie } = genereraSieFor("2025", [...transactions.value], {
      fnamn: "Barlingshult",
    });

    const rader = sie.split("\r\n");
    const utanGen = rader.filter((rad) => !rad.startsWith("#GEN"));
    const genRad = rader.find((rad) => rad.startsWith("#GEN")) ?? "";

    // #GEN är generationstidpunkten — bara formatet kontrolleras
    expect(genRad).toMatch(/^#GEN \d{8}$/);
    expect(utanGen).toEqual([
      "#FLAGGA 0",
      '#PROGRAM "hledger-web-gui" "1.0"',
      "#FORMAT PCG4",
      '#FNAMN "Barlingshult"',
      "#RAR 0 20250101 20251231",
      "#MVAL SEK",
      // Ingående balans: bara 2024 års transaktioner
      "#IB 0 1930 1000000",
      "#IB 0 2018 -1000000",
      // Utgående balans inkluderar årets rörelse (12500 − 800,50 + 100)
      "#UB 0 1930 2179950",
      "#UB 0 2018 -1000000",
      // Momsskulden är ett balanskonto och hamnar i UB, inte RES
      "#UB 0 2611 -250000",
      // Resultatkontornas rörelse inom året
      "#RES 0 3000 -1000000",
      "#RES 0 3001 -10000",
      "#RES 0 4022 80050",
      '#VER "A" "1" 20250301 "Försäljning"',
      "{",
      "    #TRANS 1930 {} 1250000",
      "    #TRANS 3000 {} -1000000",
      "    #TRANS 2611 {} -250000",
      "}",
      '#VER "A" "2" 20250401 "Inköp"',
      "{",
      "    #TRANS 4022 {} 80050",
      "    #TRANS 1930 {} -80050",
      "}",
      "",
    ]);
  });

  it("exkluderar onumrerade verifikat och rapporterar dem som varning", async () => {
    await laddaJournal(UNDERLAG);

    const { sie, varningar } = genereraSieFor("2025", [...transactions.value]);

    expect(sie.match(/^#VER/gm)).toHaveLength(2);
    expect(varningar.onumrerade).toBe(1);
    expect(varningar.luckor).toEqual([]);
    expect(varningar.dubbletter).toEqual([]);
  });

  it("rapporterar luckor och dubbletter i serien", async () => {
    await laddaJournal(
      journal(
        `2025-01-01 (A1) Första
    1930  100.00 SEK
    3000  -100.00 SEK`,
        `2025-02-01 (A3) Tredje — A2 saknas
    1930  200.00 SEK
    3000  -200.00 SEK`,
        `2025-03-01 (A3) Dubblett av trean
    1930  300.00 SEK
    3000  -300.00 SEK`,
      ),
    );

    const { varningar } = genereraSieFor("2025", [...transactions.value]);

    expect(varningar.luckor).toEqual([2]);
    expect(varningar.dubbletter).toEqual([3]);
  });

  it("wrapper-läsningen ur signalerna ger samma fil", async () => {
    await laddaJournal(UNDERLAG);

    expect(genereraSie("2025", { fnamn: "X" })).toEqual(
      genereraSieFor("2025", [...transactions.value], { fnamn: "X" }),
    );
  });
});

describe("kodatCp437", () => {
  it("mappar svenska bokstäver till CP437-bytepositioner", () => {
    // å = 0x86, ä = 0x84, ö = 0x94 — andra positioner än i latin1
    expect([...kodatCp437("åäö").bytes]).toEqual([0x86, 0x84, 0x94]);
    expect([...kodatCp437("ÅÄÖ").bytes]).toEqual([0x8f, 0x8e, 0x99]);
  });

  it("låter ASCII passera och ersätter okända tecken med '?', räknat", () => {
    const ascii = kodatCp437("AB1");

    expect([...ascii.bytes]).toEqual([65, 66, 49]);
    expect(ascii.ersatta).toBe(0);

    const okant = kodatCp437("10 €");

    expect(okant.bytes[3]).toBe(0x3f);
    expect(okant.ersatta).toBe(1);
  });
});
