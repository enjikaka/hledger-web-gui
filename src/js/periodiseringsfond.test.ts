import { describe, expect, it } from "vitest";
import {
  proposeraPfondAterforing,
  proposeraPfondAvsattning,
} from "./periodiseringsfond";

describe("proposeraPfondAvsattning", () => {
  it("sätter som default maximalt 30 % av överskottet", () => {
    const forslag = proposeraPfondAvsattning({ overskott: 100_000 });

    expect(forslag?.ruta).toBe("R34");
    expect(forslag?.maxBelopp).toBe(30_000);
    expect(forslag?.belopp).toBe(30_000);
  });

  it("avrundar taket nedåt till hela kronor", () => {
    // floor(101 × 0,30) = floor(30,3) = 30
    const forslag = proposeraPfondAvsattning({ overskott: 101 });

    expect(forslag?.belopp).toBe(30);
  });

  it("begränsar ett önskat belopp över taket och varnar", () => {
    const forslag = proposeraPfondAvsattning({
      overskott: 100_000,
      onskatBelopp: 50_000,
    });

    expect(forslag?.belopp).toBe(30_000);
    expect(forslag?.varningar[0]).toContain("30 %-taket");
  });

  it("returnerar null vid underskott eller noll önskan", () => {
    expect(proposeraPfondAvsattning({ overskott: -5_000 })).toBeNull();
    expect(
      proposeraPfondAvsattning({ overskott: 100_000, onskatBelopp: 0 }),
    ).toBeNull();
  });
});

describe("proposeraPfondAterforing", () => {
  it("återför hela saldot när kohorten nått sex år", () => {
    // Kohort 2019 + 6 = 2025 ≤ deklarationsåret 2025 → obligatorisk
    const rader = proposeraPfondAterforing({
      fonder: [{ ar: 2019, saldo: 5_000 }],
      ar: 2025,
    });

    expect(rader).toHaveLength(1);
    expect(rader[0].obligatorisk).toBe(true);
    expect(rader[0].belopp).toBe(5_000);
    expect(rader[0].varningar[0]).toContain("6-årsgränsen");
  });

  it("triggar inte förrän gränsen är passerad", () => {
    // Kohort 2020 + 6 = 2026 > 2025 — ingen obligatorisk återföring än
    const rader = proposeraPfondAterforing({
      fonder: [{ ar: 2020, saldo: 8_000 }],
      ar: 2025,
    });

    expect(rader).toHaveLength(0);
  });

  it("äter valfria delåterföringar men klemmar mot saldot", () => {
    const rader = proposeraPfondAterforing({
      fonder: [{ ar: 2023, saldo: 8_000 }],
      ar: 2025,
      delar: { 2023: 99_000 },
    });

    expect(rader[0].obligatorisk).toBe(false);
    expect(rader[0].belopp).toBe(8_000);
    expect(rader[0].varningar).toEqual([]);
  });

  it("blandar obligatoriska och frivilliga kohorter i samma år", () => {
    const rader = proposeraPfondAterforing({
      fonder: [
        { ar: 2019, saldo: 4_000 },
        { ar: 2023, saldo: 10_000 },
      ],
      ar: 2025,
      delar: { 2023: 2_500 },
    });

    expect(rader.map((r) => r.belopp)).toEqual([4_000, 2_500]);
    expect(rader.map((r) => r.obligatorisk)).toEqual([true, false]);
  });
});
