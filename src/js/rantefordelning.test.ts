import { describe, expect, it } from "vitest";
import {
  beraknaRantefordelning,
  NEGATIV_TROSKEL,
  slrForAr,
} from "./rantefordelning";

describe("beraknaRantefordelning", () => {
  it("positiv: SLR + 6 pe × kapitalunderlag", () => {
    // Default-SLR är 2025-11-30 = 2,55 % → positiv sats 8,55 %.
    // 1 000 000 × 0,0855 = 85 500
    const forslag = beraknaRantefordelning({ kapitalunderlag: 1_000_000 });

    expect(forslag).not.toBeNull();
    expect(forslag?.riktning).toBe("positiv");
    expect(forslag?.ruta).toBe("R30");
    expect(forslag?.belopp).toBe(85_500);
  });

  it("avrundar till hela kronor trots flyttalsbrus", () => {
    // 1 000 000 × (0,0255 + 0,06) blir 85499,999… i JS — Math.round räddar
    // den sista kronan som floor hade skurit av.
    const forslag = beraknaRantefordelning({
      kapitalunderlag: 1_000_000,
      slrSats: 0.0255,
    });

    expect(forslag?.belopp).toBe(85_500);
  });

  it("ger ingen räntefördelning mellan 0 och −500 000 kr", () => {
    expect(beraknaRantefordelning({ kapitalunderlag: 0 })).toBeNull();
    expect(beraknaRantefordelning({ kapitalunderlag: -100_000 })).toBeNull();

    // Gränsfallet −500 000 exakt triggar inte — det ska vara "mer negativt än"
    expect(
      beraknaRantefordelning({ kapitalunderlag: NEGATIV_TROSKEL }),
    ).toBeNull();
  });

  it("negativ räntefördelning under tröskeln: SLR + 1 pe × |kapitalunderlag|", () => {
    // −600 000 < −500 000. 600 000 × (2,55 % + 1 %) = 21 300
    const forslag = beraknaRantefordelning({ kapitalunderlag: -600_000 });

    expect(forslag?.riktning).toBe("negativ");
    expect(forslag?.ruta).toBe("R31");
    expect(forslag?.belopp).toBe(21_300);
    expect(forslag?.varningar[0]).toContain("-500 000");
  });

  it("använder en inskickad statslåneränta i stället för defaulten", () => {
    // Inkomstår 2025: SLR = 1,96 % → positiv sats 7,96 %. På 100 000 = 7 960
    const forslag = beraknaRantefordelning({
      kapitalunderlag: 100_000,
      slrSats: 0.0196,
    });

    expect(forslag?.belopp).toBe(7_960);
  });
});

describe("slrForAr", () => {
  it("slår upp tabellvärdet per inkomstår", () => {
    expect(slrForAr(2025)).toBe(0.0196);
    expect(slrForAr(2026)).toBe(0.0255);
  });

  it("faller tillbaka på närmast kända året utanför tabellen", () => {
    expect(slrForAr(2030)).toBe(0.0255);
    expect(slrForAr(2020)).toBe(0.0196);
  });
});
