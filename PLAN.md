# Plan – återstående arbete

Sammanställt 2026-08-24 utifrån minnesanteckningar och genomgång av koden.

## Klart ✅

- **Moms**: rutmappning (SKV 4700), momsrapport per journal, momsomföring
  (2650/1650 + 3740 öresutjämning), momsbetalning
- **Bokslut**: årets resultat (8999→2019), nollställning av eget kapital
  (2011–2019→2010), Bokio-mönster
- **NE-bilaga**: räkenskapsschemat R1–R11, varningar för omappade konton
- Balansrapport, verifikatsnumrering med luckdetektering, mallar med
  betalkontoval (1930/2018)
- **Skattemässiga justeringar (R12+)**: R12 (=R11), R13 (ej avdragsgilla
  kostnader ur bokföringen) och R14 (skattefria intäkter, 8314)
  beräknade; summorutor R17/R21/R29/R33/R35/R42/R47/R48 beräknade längs
  kedjan, övriga manuella (SKV 2161)
- **Egenavgifter och räntefördelning** (port från accounted
  `lib/bokslut/enskild-firma/`): positiv/negativ räntefördelning (SLR+6/+1
  pe, obligatorisk negativ vid < −500 000 kr, IL 53 kap) i R30/R31;
  schablonavdrag för egenavgifter i R43 (satser 28,97/10,21/24,26 %,
  schabloner 25/10/20 %, föregående års poster i R40/R41). SLR-tabell
  (2025/2026) med överskrivningsfält. Positiv räntefördelning takas mot R29
  enligt Skatteverket (avdraget får inte skapa underskott); överskjutande
  belopp redovisas som sparat fördelningsbelopp. Inmatning via
  `<ne-deklaration>` på NE-sidan; tillståndet lever i minnet per år.
  OBS: körs mot **en journal** än så länge — räntefördelning görs visserligen
  per verksamhet, men egenavgifter ska beräknas på det gemensamma resultatet
  (IL 14 kap 12 §), se punkt 3. Ej modellerat: sparat fördelningsbelopp som
  stat (höjer nästa års kapitalunderlag) samt regler före beskattningsår 2025.
- **Periodiseringsfond** (port från accounted): avsättning högst 30 % av
  R33 (floor, R34) och sexårskohorter med obligatorisk full återföring
  (IL 30 kap 7 §, R32); redigerbar kohortlista i samma UI-kort.
- **Sammanslagen momsvy**: växel på momsrapportsidan ("Endast denna journal"
  / "Sammanslagen"). En andra journal laddas in read-only (`extraJournal`,
  minne endast) och rutorna summeras i ören över båda journalerna med en
  enda avrundning per ruta (`generateMomsrapportFor`) — att addera
  färdigavrundade rapporter kostar upp till en krona per ruta. Omföring/
  betalning bokförs fortsatt per aktiv journal.

## Kvar ❌

1. **SRU-export av NE-bilagan** — porta från accounted
   `lib/reports/ne-bilaga/sru-generator.ts` (INFO.SRU/BLANKETTER.SRU,
   ISO 8859-1, fältkoder R1–R11 = 7400–7403, 7500–7505, 7440; datum
   7011/7012). Behåll upphovsrättsnotisen (gnubok, AGPL-3.0). OBS: ska
   troligen även täcka R12–R48 nu när justeringarna finns.
2. **Expansionsfond** — porta från accounted
   `lib/bokslut/enskild-firma/expansionsfond-calculator.ts`. Ren
   skattemekanism: 20,6 % expansionsfondsskatt på nettoändring, totalt
   saldo tak 125,94 % av kapitalunderlaget (IL 34 kap), återföring ≤
   saldo. Motsvarar NE R36/R37. Kapitalunderlaget kan matas in manuellt i
   NE-sidans räntefördelningskort redan idag.
3. **K1-blanketten**.
4. **SIE4-export?** — `verifikat.ts` är designad för det ("en SIE-fil per år
   går att skapa rakt av") men ingen export finns. Bekräfta om den ska med.
5. **README** — beskriver fortfarande den gamla generiska journalhanteraren;
   uppdatera med moms/NE/bokslut.

## Prioritering inför deklarationen

1 → 2 (SRU-export först, sedan expansionsfond).

## Konsekvens för två verksamheter

- Appen arbetar **per journal** = per verksamhet. Alla rapporter gör redan
  rätt.
- Per verksamhet: bokföring, R1–R11, B1–B10, årets resultat, eget kapital,
  NE-justeringar R12–R23.
- Gemensamt: NE R24+ utom räntefördelning (som görs per verksamhet),
  dvs. skattemässiga justeringar, egenavgifter och momsdeklarationen.
  Momsvyn är sammanslagen (se Klart). Egenavgifter/fonder beräknas idag
  mot en journal; `extraJournal`-mönstret finns på plats, så när behovet
  aktualiseras räcker det att mata in sammanslaget underlag (R42-basen
  respektive kapitalunderlaget) — kalkylerna kan vara som de är.
