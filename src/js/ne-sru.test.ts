import { describe, expect, it } from "vitest";
import type { NeBilaga } from "./ne-bilaga";
import {
  genereraNeSru,
  kodatLatin1,
  type SruUppgifter,
  valideraBlanketterSru,
} from "./ne-sru";

/** Fast tidpunkt så att #SKAPAD och #IDENTITET blir deterministiska. */
const NU = new Date(2026, 2, 15, 12, 34, 56);

const UPPGIFTER: SruUppgifter = {
  personnummer: "810101-1234",
  namn: "Maria Larsson",
  postnr: "414 55",
  postort: "Göteborg",
};

const rad = (
  ruta: string,
  belopp: number,
  summa = false,
): NeBilaga["justeringar"][number] => ({
  ruta,
  beskrivning: "",
  belopp,
  summa,
  manuell: false,
  konton: [],
});

/** Liten komplett bilaga: försäljning 10 000, ränta 200, inköp 3 000 → R11
 *  7 200; återlagd kostnad 800, positiv räntefördelning 1 000 → överskott. */
function bilaga(): NeBilaga {
  return {
    year: "2025",
    balans: [
      { ruta: "B1", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B2", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B3", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B4", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B5", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B6", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B7", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B8", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B9", beskrivning: "", belopp: 12500, konton: [] },
      { ruta: "B10", beskrivning: "", belopp: 7200, konton: [] },
      { ruta: "B11", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B12", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B13", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B14", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "B15", beskrivning: "", belopp: 3000, konton: [] },
      { ruta: "B16", beskrivning: "", belopp: 2300, konton: [] },
    ],
    intakter: [
      { ruta: "R1", beskrivning: "", belopp: 10000, konton: [] },
      { ruta: "R2", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R3", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R4", beskrivning: "", belopp: 200, konton: [] },
    ],
    kostnader: [
      { ruta: "R5", beskrivning: "", belopp: 3000, konton: [] },
      { ruta: "R6", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R7", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R8", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R9", beskrivning: "", belopp: 0, konton: [] },
      { ruta: "R10", beskrivning: "", belopp: 0, konton: [] },
    ],
    bokfortResultat: 7200,
    justeringar: [
      rad("R12", 7200, true),
      rad("R13", 800),
      rad("R17", 8000, true),
      rad("R29", 8000, true),
      rad("R30", 1000),
      rad("R33", 7000, true),
      rad("R35", 7000, true),
      rad("R42", 7000, true),
      rad("R47", 7000, true),
    ],
    skattemassigtResultat: 7000,
    varningar: [],
  };
}

/** Plockar ut alla #UPPGIFT-rader som "kod belopp". */
function uppgifter(content: string): Array<string> {
  return [...content.matchAll(/^#UPPGIFT (\d{4}) (-?\d+)$/gm)].map(
    ([_, kod, belopp]) => `${kod} ${belopp}`,
  );
}

describe("genereraNeSru — INFO.SRU", () => {
  it("bygger DATABESKRIVNING- och MEDIELEV-blocken i rätt ordning", () => {
    const filer = genereraNeSru(bilaga(), UPPGIFTER, NU);

    // Personnumret normaliserat till 12 siffror, postnumret utan mellanslag
    expect(filer.infoSru).toBe(
      [
        "#DATABESKRIVNING_START",
        "#PRODUKT SRU",
        "#SKAPAD 20260315 123456",
        "#PROGRAM hledger-web-gui 1.0",
        "#FILNAMN BLANKETTER.SRU",
        "#DATABESKRIVNING_SLUT",
        "#MEDIELEV_START",
        "#ORGNR 198101011234",
        "#NAMN Maria Larsson",
        "#POSTNR 41455",
        "#POSTORT Göteborg",
        "#MEDIELEV_SLUT",
        "",
      ].join("\r\n"),
    );
  });

  it("härleder sekeln för tiosiffriga personnummer ur åldern vid inkomståret", () => {
    // Född -81 är vuxen 2025 och kan inte vara född 2081 → 1900-tal
    const aldre = genereraNeSru(
      bilaga(),
      {
        ...UPPGIFTER,
        personnummer: "8101011234",
      },
      NU,
    );

    expect(aldre.infoSru).toContain("#ORGNR 198101011234");

    // Född -05 är fem år gammal som 1905-född men 20 år som 2005-född
    const yngre = genereraNeSru(
      bilaga(),
      {
        ...UPPGIFTER,
        personnummer: "0505051234",
      },
      NU,
    );

    expect(yngre.infoSru).toContain("#ORGNR 200505051234");
  });

  it("vägrar generera utan personnummer, namn eller postuppgifter", () => {
    expect(() =>
      genereraNeSru(bilaga(), { ...UPPGIFTER, personnummer: "" }, NU),
    ).toThrow(/personnummer/i);
    expect(() =>
      genereraNeSru(bilaga(), { ...UPPGIFTER, personnummer: "123" }, NU),
    ).toThrow(/personnummer/i);
    expect(() =>
      genereraNeSru(bilaga(), { ...UPPGIFTER, namn: "" }, NU),
    ).toThrow(/namn/i);
    expect(() =>
      genereraNeSru(bilaga(), { ...UPPGIFTER, postnr: "" }, NU),
    ).toThrow(/postnummer/i);
    expect(() =>
      genereraNeSru(bilaga(), { ...UPPGIFTER, postort: "" }, NU),
    ).toThrow(/postort/i);
  });
});

describe("genereraNeSru — BLANKETTER.SRU", () => {
  it("exporterar rutorna i blanketordning med sina fältkoder", () => {
    const filer = genereraNeSru(bilaga(), UPPGIFTER, NU);

    // Kalenderår slutar i december → P4; räkenskapsårets datum med
    const inledning = [
      "#BLANKETT NE-2025P4",
      "#IDENTITET 198101011234 20260315 123456",
      "#NAMN Maria Larsson",
      "#UPPGIFT 7011 20250101",
      "#UPPGIFT 7012 20251231",
    ].join("\r\n");

    expect(filer.blanketterSru.slice(0, inledning.length + 2)).toBe(
      `${inledning}\r\n`,
    );

    // Nollrutor utelämnas (R2 saknas), mellansummor (R17/R29/R33/R35/R42)
    // saknar koder och faller bort, R12 och slutresultatet R47 följer med.
    expect(uppgifter(filer.blanketterSru)).toEqual([
      "7011 20250101",
      "7012 20251231",
      "7280 12500",
      "7300 7200",
      "7382 3000",
      "7383 2300",
      "7400 10000",
      "7403 200",
      "7500 3000",
      "7440 7200",
      "7600 7200",
      "7601 800",
      "7708 1000",
      "7630 7000",
    ]);

    const avslut = "#BLANKETTSLUT\r\n#FIL_SLUT\r\n";

    expect(
      filer.blanketterSru.slice(filer.blanketterSru.length - avslut.length),
    ).toBe(avslut);
  });

  it("exporterar R48 i stället för R47 vid underskott", () => {
    const underskott = bilaga();

    underskott.justeringar.pop();
    underskott.justeringar.push(rad("R48", 500, true));

    const filer = genereraNeSru(underskott, UPPGIFTER, NU);

    expect(uppgifter(filer.blanketterSru)).toContain("7730 500");
    expect(uppgifter(filer.blanketterSru)).not.toContain("7630 500");
  });

  it("sanerar namn: inga #-tecken, inga radbrytningar", () => {
    const filer = genereraNeSru(
      bilaga(),
      { ...UPPGIFTER, namn: "Maria\nLarsson #1" },
      NU,
    );

    expect(filer.infoSru).toContain("#NAMN Maria Larsson 1");
  });
});

describe("valideraBlanketterSru", () => {
  it("godkänner en korrekt fil", () => {
    const filer = genereraNeSru(bilaga(), UPPGIFTER, NU);

    expect(valideraBlanketterSru(filer.blanketterSru).giltig).toBe(true);
  });

  it("fångar saknade obligatoriska poster", () => {
    const ofullstandig = "#BLANKETT NE-2025P4\r\n#FIL_SLUT\r\n";
    const kontroll = valideraBlanketterSru(ofullstandig);

    expect(kontroll.giltig).toBe(false);
    expect(kontroll.fel.some((f) => f.includes("#IDENTITET"))).toBe(true);
    expect(kontroll.fel.some((f) => f.includes("7011"))).toBe(true);
    expect(kontroll.fel.some((f) => f.includes("7012"))).toBe(true);
  });
});

describe("kodatLatin1", () => {
  it("kodar svenska tecken till latin1-bytes", () => {
    // G = 71, ö = 246, b = 98, o = 111, r = 114, g = 103
    expect([...kodatLatin1("Göteborg")]).toEqual([
      71, 246, 116, 101, 98, 111, 114, 103,
    ]);
  });

  it("avvisar tecken utanför ISO 8859-1", () => {
    expect(() => kodatLatin1("pris: 10 €")).toThrow(/ISO 8859-1/);
  });
});
