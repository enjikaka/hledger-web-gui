import { describe, expect, it } from "vitest";
import { beraknaEgenavgifter } from "./egenavgifter";

describe("beraknaEgenavgifter", () => {
  it("full kategori: 25 % schablonavdrag på positivt överskott", () => {
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: 200_000,
      kategori: "full",
    });

    // Inga föregående-års-poster → netto 200 000, schablon 25 % = 50 000
    expect(forslag.schablonavdrag).toBe(50_000);
    expect(forslag.uppskattadeEgenavgifter).toBe(Math.round(200_000 * 0.2897));
  });

  it("pensionär: 10 % schablonavdrag", () => {
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: 200_000,
      kategori: "pensionar",
    });

    expect(forslag.schablonavdrag).toBe(20_000);
  });

  it("passiv verksamhet: 20 % schablonavdrag (SLP-grund)", () => {
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: 200_000,
      kategori: "passiv",
    });

    expect(forslag.schablonavdrag).toBe(40_000);
  });

  it("väger in föregående års medgivna avdrag och påförda egenavgifter", () => {
    // Netto = 200 000 + 30 000 (R40) − 25 000 (R41) = 205 000
    // Schablon 25 % = 51 250
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: 200_000,
      kategori: "full",
      foregaendeArsSchablonavdrag: 30_000,
      foregaendeArsPafort: 25_000,
    });

    expect(forslag.nettoOverskott).toBe(205_000);
    expect(forslag.schablonavdrag).toBe(51_250);
  });

  it("ger noll avdrag på förlustår och varnar för att överskott saknas", () => {
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: -10_000,
      kategori: "full",
    });

    expect(forslag.schablonavdrag).toBe(0);
    expect(forslag.varningar.some((v) => /inget överskott/i.test(v))).toBe(
      true,
    );
  });

  it("påminner om den automatiska nedsättningen när aktivt överskott överstiger 40 000 kr", () => {
    const forslag = beraknaEgenavgifter({
      overskottForeEgenavgifter: 100_000,
      kategori: "full",
    });

    expect(forslag.varningar.some((v) => /7,5/.test(v))).toBe(true);
  });
});
