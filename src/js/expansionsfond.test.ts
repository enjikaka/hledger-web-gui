import { describe, expect, it } from "vitest";
import {
  beraknaExpansionsfondAndring,
  EXPANSIONSFOND_TAK,
} from "./expansionsfond";

describe("beraknaExpansionsfondAndring", () => {
  it("avsätter inom taket och räknar ut expansionsskatten", () => {
    const forslag = beraknaExpansionsfondAndring({
      kapitalunderlag: 100_000,
      befintligtSaldo: 0,
      onskadAndring: 50_000,
    });

    expect(forslag?.ruta).toBe("R36");
    expect(forslag?.belopp).toBe(50_000);
    expect(forslag?.skattPaAndring).toBe(10_300); // 20,6 % av 50 000
    expect(forslag?.nyttSaldo).toBe(50_000);
    expect(forslag?.varningar).toEqual([]);
  });

  it("floorar taket till hela kronor", () => {
    // 101 × 1,2594 = 127,1994 → 127
    const forslag = beraknaExpansionsfondAndring({
      kapitalunderlag: 101,
      onskadAndring: 200,
    });

    expect(forslag?.maxTotalSaldo).toBe(127);
  });

  it("begränsar avsättningen till utrymmet under totalsaldotaket", () => {
    // Taket gäller totalsaldot: 125 940 − 120 000 i saldo = 5 940 kvar
    const forslag = beraknaExpansionsfondAndring({
      kapitalunderlag: 100_000,
      befintligtSaldo: 120_000,
      onskadAndring: 20_000,
    });

    expect(EXPANSIONSFOND_TAK).toBe(1.2594);
    expect(forslag?.belopp).toBe(5_940);
    expect(forslag?.varningar[0]).toContain("125,94 %");
  });

  it("begränsar återföringen till befintligt saldo", () => {
    const forslag = beraknaExpansionsfondAndring({
      kapitalunderlag: 100_000,
      befintligtSaldo: 30_000,
      onskadAndring: -40_000,
    });

    expect(forslag?.ruta).toBe("R37");
    expect(forslag?.belopp).toBe(30_000);
    expect(forslag?.nyttSaldo).toBe(0);
    expect(forslag?.varningar[0]).toContain("befintligt saldo");
  });

  it("returnerar null när ingen ändring önskas", () => {
    expect(beraknaExpansionsfondAndring({ onskadAndring: 0 })).toBeNull();
    expect(beraknaExpansionsfondAndring({})).toBeNull();
  });

  it("varnar om obligatorisk återföring när saldot överstiger taket", () => {
    const forslag = beraknaExpansionsfondAndring({
      kapitalunderlag: 100_000,
      befintligtSaldo: 130_000,
      onskadAndring: 1_000,
    });

    // Varningen ska komma oavsett vad användaren önskar ...
    expect(forslag?.varningar.some((v) => v.includes("måste återföras"))).toBe(
      true,
    );

    // ... och även när användaren själv vill återföra.
    const aterforing = beraknaExpansionsfondAndring({
      kapitalunderlag: 100_000,
      befintligtSaldo: 130_000,
      onskadAndring: -5_000,
    });

    expect(
      aterforing?.varningar.some((v) => v.includes("måste återföras")),
    ).toBe(true);
  });
});
