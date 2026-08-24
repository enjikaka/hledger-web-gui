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

## Kvar ❌

1. **SRU-export av NE-bilagan** — porta från accounted
   `lib/reports/ne-bilaga/sru-generator.ts` (INFO.SRU/BLANKETTER.SRU,
   ISO 8859-1, fältkoder R1–R11 = 7400–7403, 7500–7505, 7440; datum
   7011/7012). Behåll upphovsrättsnotisen (gnubok, AGPL-3.0). OBS: ska
   troligen även täcka R12–R48 nu när justeringarna finns.
2. **Egenavgifter och räntefördelning** — porta från accounted
   `lib/bokslut/enskild-firma/`. Beräknas på det **gemensamma** skattemässiga
   resultatet över båda journalerna (IL 14 kap 12 §), inte per verksamhet.
   Motsvarar NE R30/R31 och R40–R43.
3. **Periodiseringsfond / expansionsfond** — samma källa i accounted, ej
   porterad än. Motsvarar NE R32–R37 (avsättning högst 30 % av R33).
4. **Sammanslagen momsvy över journalerna** — momsdeklarationen är gemensam
   (momsregistreringen följer personen). Summera i **ören** över båda
   journalerna och avrunda **en gång** — addera aldrig färdigavrundade rutor
   (upp till en krona fel per ruta annars).
5. **K1-blanketten**.
6. **SIE4-export?** — `verifikat.ts` är designad för det ("en SIE-fil per år
   går att skapa rakt av") men ingen export finns. Bekräfta om den ska med.
7. **README** — beskriver fortfarande den gamla generiska journalhanteraren;
   uppdatera med moms/NE/bokslut.

## Prioritering inför deklarationen

4 → 1 → 2/3 (sammanslagen moms, SRU, sedan egenavgifter/
räntefördelning och fonder).

## Konsekvens för två verksamheter

- Appen arbetar **per journal** = per verksamhet. Alla rapporter gör redan
  rätt.
- Per verksamhet: bokföring, R1–R11, B1–B10, årets resultat, eget kapital,
  NE-justeringar R12–R23.
- Gemensamt: NE R24+, skattemässiga justeringar, egenavgifter,
  räntefördelning och momsdeklarationen — dessa kräver en sammanslagen vy
  (punkt 2 och 4).
