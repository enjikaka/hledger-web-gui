import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMomsrapport,
  rutbelopp,
  skapaMomsomforing,
} from "./momsrapport";
import { laddaJournal, radrader, rensaJournal, summaOre } from "./test-helpers";

/**
 * Omvänd skattskyldighet: köparen redovisar både utgående och ingående moms.
 * Underlaget hamnar i ruta 20–24, den beräknade utgående momsen i 30–32 och
 * samma belopp dras av i ruta 48 — netto noll för den som har full avdragsrätt.
 */

const HEADER = `; Testkontoplan
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
`;

const journal = (...transaktioner: Array<string>) =>
  `${HEADER}\n${transaktioner.join("\n\n")}\n`;

beforeEach(rensaJournal);

describe("inköp av tjänster från annat EU-land (ruta 21)", () => {
  it("lägger underlaget i 21, beräknad moms i 30 och avdraget i 48", async () => {
    await laddaJournal(
      journal(
        // Programvara från Irland, 1 000 kr. Fakturan är utan moms;
        // 25 % beräknas och redovisas åt båda hållen.
        `2025-03-01 Molntjänst från EU-leverantör
    4535  1000.00 SEK
    2614  -250.00 SEK
    2645  250.00 SEK
    1930  -1000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "21")).toBe(1000);
    expect(rutbelopp(rapport, "30")).toBe(250);
    expect(rutbelopp(rapport, "48")).toBe(250);
    // Full avdragsrätt → förvärvet kostar ingen moms
    expect(rapport.nettoMoms).toBe(0);
  });

  it("hanterar 12 % och 6 % i rutorna 31 och 32", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Tjänst EU 12 %
    4536  1000.00 SEK
    2624  -120.00 SEK
    2645  120.00 SEK
    1930  -1000.00 SEK`,
        `2025-03-02 Tjänst EU 6 %
    4537  500.00 SEK
    2634  -30.00 SEK
    2645  30.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "21")).toBe(1500);
    expect(rutbelopp(rapport, "31")).toBe(120);
    expect(rutbelopp(rapport, "32")).toBe(30);
    expect(rutbelopp(rapport, "48")).toBe(150);
    expect(rapport.nettoMoms).toBe(0);
  });
});

describe("inköp av varor från annat EU-land (ruta 20)", () => {
  it("lägger varuförvärvet i ruta 20", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Varuinköp från Tyskland
    4515  4000.00 SEK
    2614  -1000.00 SEK
    2645  1000.00 SEK
    1930  -4000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "20")).toBe(4000);
    expect(rutbelopp(rapport, "30")).toBe(1000);
    expect(rutbelopp(rapport, "48")).toBe(1000);
    expect(rapport.nettoMoms).toBe(0);
  });
});

describe("inköp av tjänster från land utanför EU (ruta 22)", () => {
  it("skiljer tjänster utanför EU från EU-tjänster", async () => {
    await laddaJournal(
      journal(
        // t.ex. en amerikansk molntjänst
        `2025-03-01 Tjänst från USA
    4531  2000.00 SEK
    2614  -500.00 SEK
    2645  500.00 SEK
    1930  -2000.00 SEK`,
        `2025-03-02 Tjänst från EU
    4535  1000.00 SEK
    2614  -250.00 SEK
    2645  250.00 SEK
    1930  -1000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "22")).toBe(2000);
    expect(rutbelopp(rapport, "21")).toBe(1000);
    // Den beräknade momsen slås ihop per skattesats, oavsett ursprung
    expect(rutbelopp(rapport, "30")).toBe(750);
    expect(rutbelopp(rapport, "48")).toBe(750);
    expect(rapport.nettoMoms).toBe(0);
  });
});

describe("omvänd skattskyldighet inom Sverige (ruta 23 och 24)", () => {
  it("skiljer varor från tjänster", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Inköp varor i Sverige, omvänd skattskyldighet
    4415  1000.00 SEK
    2614  -250.00 SEK
    2647  250.00 SEK
    1930  -1000.00 SEK`,
        `2025-03-02 Inköpt byggtjänst, omvänd skattskyldighet
    4425  8000.00 SEK
    2614  -2000.00 SEK
    2647  2000.00 SEK
    1930  -8000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "23")).toBe(1000);
    expect(rutbelopp(rapport, "24")).toBe(8000);
    expect(rutbelopp(rapport, "30")).toBe(2250);
    expect(rutbelopp(rapport, "48")).toBe(2250);
    expect(rapport.nettoMoms).toBe(0);
  });
});

describe("försäljning av tjänster utomlands", () => {
  it("redovisar EU-tjänster i ruta 39 och tjänster utanför EU i ruta 40", async () => {
    await laddaJournal(
      journal(
        // Google Adsense — tjänst till näringsidkare i annat EU-land
        `2025-03-01 Google, Adsense-intäkter
    1930  3000.00 SEK
    3308  -3000.00 SEK`,
        // Patreon — tjänst omsatt utanför EU
        `2025-03-02 Patreon, Medlemsintäkter
    1930  1500.00 SEK
    3305  -1500.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "39")).toBe(3000);
    expect(rutbelopp(rapport, "40")).toBe(1500);
    // Ingen utgående moms — köparen redovisar den i sitt land
    expect(rutbelopp(rapport, "10")).toBe(0);
    expect(rapport.nettoMoms).toBe(0);
  });

  it("redovisar varuförsäljning till EU i 35 och export i 36", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Varuförsäljning till Danmark
    1930  5000.00 SEK
    3108  -5000.00 SEK`,
        `2025-03-02 Varuexport till Norge
    1930  2000.00 SEK
    3105  -2000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "35")).toBe(5000);
    expect(rutbelopp(rapport, "36")).toBe(2000);
    expect(rapport.nettoMoms).toBe(0);
  });

  it("håller momsfri försäljning i ruta 42 skild från momspliktig i 05", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Momspliktig försäljning
    1930  1250.00 SEK
    3001  -1000.00 SEK
    2611  -250.00 SEK`,
        `2025-03-02 Momsfri intäkt
    1930  700.00 SEK
    3100  -700.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "05")).toBe(1000);
    expect(rutbelopp(rapport, "42")).toBe(700);
    expect(rapport.nettoMoms).toBe(250);
  });
});

describe("uttag och särskilda underlag (ruta 06–08)", () => {
  it("redovisar momspliktiga uttag i ruta 06, skilt från försäljning i 05", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  1250.00 SEK
    3001  -1000.00 SEK
    2611  -250.00 SEK`,
        // Egna varuuttag: ägg till hushållet, moms ska ändå redovisas
        `2025-03-02 Eget uttag av varor
    2013  560.00 SEK
    3401  -500.00 SEK
    2612  -60.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "05")).toBe(1000);
    expect(rutbelopp(rapport, "06")).toBe(500);
    // 2612 är uttagsmoms 25 % och hamnar i samma ruta som annan utgående moms
    expect(rutbelopp(rapport, "10")).toBe(310);
    expect(rapport.nettoMoms).toBe(310);
  });

  it("tar med VMB-moms (2616) i ruta 10", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning med vinstmarginalbeskattning
    1930  5000.00 SEK
    3000  -4000.00 SEK
    2616  -1000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "10")).toBe(1000);
    expect(rapport.nettoMoms).toBe(1000);
  });

  it("tar med uthyrningsmoms (2613) i ruta 10", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Uthyrning, frivillig skattskyldighet
    1930  12500.00 SEK
    3000  -10000.00 SEK
    2613  -2500.00 SEK`,
      ),
    );

    expect(rutbelopp(generateMomsrapport("2025"), "10")).toBe(2500);
  });

  it("fyller inte i ruta 07 och 08 — de har inget konto att räkna från", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Vinstmarginalbeskattad försäljning
    1930  5000.00 SEK
    3000  -4000.00 SEK
    2616  -1000.00 SEK`,
        `2025-03-02 Uthyrning
    1930  12500.00 SEK
    3000  -10000.00 SEK
    2613  -2500.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    // Beskattningsunderlaget vid VMB (07) är marginalen, inte ett kontosaldo,
    // och hyresunderlaget (08) går inte att skilja från annan försäljning på
    // kontonivå. Båda måste fyllas i för hand i deklarationen — rapporten visar
    // dem som noll och ska inte låtsas räkna ut dem.
    expect(rutbelopp(rapport, "07")).toBe(0);
    expect(rutbelopp(rapport, "08")).toBe(0);
    expect(rapport.rutor.has("07")).toBe(false);
    expect(rapport.rutor.has("08")).toBe(false);
  });
});

describe("import av varor (ruta 50 och 60–62)", () => {
  it("lägger underlaget i ruta 50 och importmomsen i 60", async () => {
    await laddaJournal(
      journal(
        // Import från land utanför EU: Tullverket tar tull,
        // momsen redovisas i deklarationen och dras av i samma veva
        `2025-03-01 Import av varor från Norge
    4545  8000.00 SEK
    2615  -2000.00 SEK
    2645  2000.00 SEK
    1930  -8000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "50")).toBe(8000);
    expect(rutbelopp(rapport, "60")).toBe(2000);
    expect(rutbelopp(rapport, "48")).toBe(2000);
    expect(rapport.nettoMoms).toBe(0);
  });

  it("håller isär importmoms 12 % och 6 % i rutorna 61 och 62", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Import 12 %
    4546  1000.00 SEK
    2625  -120.00 SEK
    2645  120.00 SEK
    1930  -1000.00 SEK`,
        `2025-03-02 Import 6 %
    4547  500.00 SEK
    2635  -30.00 SEK
    2645  30.00 SEK
    1930  -500.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "50")).toBe(1500);
    expect(rutbelopp(rapport, "61")).toBe(120);
    expect(rutbelopp(rapport, "62")).toBe(30);
    expect(rutbelopp(rapport, "48")).toBe(150);
    expect(rapport.nettoMoms).toBe(0);
  });

  it("importmomsen räknas in i nettot när den inte är avdragsgill", async () => {
    await laddaJournal(
      journal(
        // Utan motsvarande avdrag på 2645 blir importmomsen en kostnad
        `2025-03-01 Import utan avdragsrätt
    4545  8000.00 SEK
    2615  -2000.00 SEK
    1930  -6000.00 SEK`,
      ),
    );

    const rapport = generateMomsrapport("2025");

    expect(rutbelopp(rapport, "60")).toBe(2000);
    expect(rutbelopp(rapport, "48")).toBe(0);
    expect(rapport.nettoMoms).toBe(2000);
  });
});

describe("momsomföring med omvänd skattskyldighet", () => {
  it("nollar även 2614 och 2645, inte bara de vanliga momskontona", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning i Sverige
    1930  1250.00 SEK
    3001  -1000.00 SEK
    2611  -250.00 SEK`,
        `2025-03-02 Tjänst från EU
    4535  1000.00 SEK
    2614  -250.00 SEK
    2645  250.00 SEK
    1930  -1000.00 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    // 2614 och 2645 tar ut varandra; kvar blir 250 att betala från 2611
    expect(radrader(omforing.postings)).toEqual([
      "2611 250",
      "2614 250",
      "2645 -250",
      "2650 -250",
    ]);
    expect(summaOre(omforing.postings)).toBe(0);
  });

  it("ger inget att betala när förvärvsmomsen tar ut sig själv", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Tjänst från EU
    4535  1000.00 SEK
    2614  -250.00 SEK
    2645  250.00 SEK
    1930  -1000.00 SEK`,
      ),
    );

    const omforing = skapaMomsomforing("2025")!;

    expect(radrader(omforing.postings)).toEqual(["2614 250", "2645 -250"]);
    expect(summaOre(omforing.postings)).toBe(0);
    expect(generateMomsrapport("2025").nettoMoms).toBe(0);
  });
});
