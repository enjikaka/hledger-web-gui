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
- **Expansionsfond** (port från accounted, kontrollerad mot Skatteverket):
  avsättning i R36 med dubbla tak — högst resultatet före avsättning (R35)
  och totalt saldo högst 125,94 % av kapitalunderlaget vid årets utgång
  (floor); återföring i R37 begränsas av saldot. Expansionsskatt 20,6 %
  på ändringen visas som info (betalas i år / tillgodoräknas). Varning
  (utan auto-återföring) när befintligt saldo överstiger taket — överskjutande
  belopp måste återföras till beskattning. Eget fält för kapitalunderlaget,
  som gäller vid årets utgång (räntefördelningens gäller föregående års).
- **SRU-export av NE-bilagan** (port från accounted): INFO.SRU +
  BLANKETTER.SRU i ISO 8859-1/CRLF via `<ne-export>` på NE-sidan.
  Fältkoderna enligt Skatteverkets tekniska beskrivning 2025P4: R1–R10 =
  7400–7403/7500–7505 (korsvaliderade mot BAS-kontogruppens officiella
  kopplingstabell), R11 = 7440 och hela justeringskedjan R12–R48
  (7600/7601/7700 … 7630/7730); konventionen 76xx = pluspost, 77xx =
  minuspost stämmer med räkenskapskedjans tecken. Mellansummorutorna
  (R17/R21/R29/R33/R35/R42) har inga koder — Skatteverket räknar dem.
  Personnummer normaliseras till 12 siffror med sekeln härledd ur åldern;
  genereringen vägrar vid ogiltiga uppgifter och preflight-kontrollerar
  blankettblocket. Inmatningen (pnr/namn/postnr/postort) lever bara i minnet.
- **README** — omskriven till svenska och uppdaterad med aktuell funktionsbild
  (bokföring, moms inkl. sammanslagen vy, bokslut, NE-bilaga med
  deklarationskorten, SRU-export), förutsättningar för journalformatet,
  begränsningar och projektstruktur.
- **SIE4-export** (fullständig): en fil per räkenskapsår från sidan
  Inställningar — `#FLAGGA/#PROGRAM/#FORMAT PCG4/#GEN/#FNAMN/#RAR/#MVAL`,
  saldon i ören (`#IB` = alla transaktioner före årets start, `#UB` genom
  årsslutet, `#RES` på resultatkonton) och alla numrerade verifikationer som
  `#VER "serie" "nr" <datum> "<text>"` med `#TRANS`-rader. Seriegranskning
  (luckor/dubbletter/onumrerade) körs före exporten; onumrerade verifikat
  tas inte med. Filen kodas i CP437 enligt specen.
- **SIE4-import** (för migrering från Bokio m.fl.): fil läses in på sidan
  Inställningar, avkodas från CP437 (UTF-8-BOM sniffas) och förhandsvisas —
  företag, år, antal verifikationer/konton. VER → transaktioner med koder,
  #KONTO-namn → hledger-kontonamn (fallback `konto_<nr>`, gemener), IB-rader
  → verifikat "(IBÅÅÅÅ)" daterat periodstart i egen serie så A-kedjans
  luckkontroll inte stör; #UB/#RES hoppas över (redundant mot VER) och
  okända poster räknas. Lägg in som Ersätt eller Lägg till (varning vid
  överlappande år) — därefter sparas allt som vanlig .journal.

## Kvar ❌

1. **K1-blanketten** — osäker relevans: gäller bara om någon av verksamheterna
   äger aktier i fåmansföretag (K10-regler). Väntar på besked; annars strykes.
2. **SRU-export av B-sidorna?** — balanssidan (B1–B16, koderna 7200–7383) är
   verifierad i kodlistan men exporteras inte än; NE-rapporten visar inte
   heller balanssaldon. Balansberäkningen från SIE4-exporten kan återanvändas.

## Prioritering

Inget som blockerar deklarationen återstår — bokföring, moms, NE-bilaga med
alla justeringar, SRU-export och SIE4-export är på plats. K1 väntar på besked;
därefter ev. B-sidorna i SRU:n (liten påbyggnad nu när saldobereäkningen finns).

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
