# hledger-web-gui

Bokföring i webbläsaren för enskild firma. Appen arbetar direkt mot
hledger-journalfiler: du öppnar din `.journal`-fil, bokför verifikat med
verifikationsnumrering och luckkontroll, och får momsrapport, balansrapport,
bokslut, NE-bilaga med skattemässiga justeringar samt SRU-export till
Skatteverkets filöverföring.

## Funktioner

### Bokföring

- **Öppna och spara journal** — via File System Access API (filen sparas direkt
  tillbaka på disk) eller vanlig filväljare med nedladdning som fallback
- **Verifikationsnumrering** — löpnummer per räkenskapsår i serien A, skrivet i
  hledgers kodfält (`2025-03-01 (A12) …`). Serien granskas kontinuerligt:
  luckor, dubbletter och onumrerade verifikat syns direkt
- **Mallar** — snabbinmatning av återkommande verifikat med val av betalkonto
- **Live-förhandsvisning** av den sparade journalen

### Moms

- **Momsrapport** enligt SKV 4700, summerad i ören och avrundad per ruta
- **Sammanslagen momsvy** — momsdeklarationen är gemensam per person, så en
  andra journal (andra verksamheten) kan laddas in som read-only underlag;
  rutorna summeras då i ören över båda journalerna och avrundas en gång
- **Momsomföring** — nollar momskontona mot 2650/1650 med öresutjämning på
  3740, samma verifikat som Bokio bokför
- **Momsbetalning** — reglerar 2650/1650 mot företags-, skatte- eller
  eget kapitalkonto

### Balansrapport och bokslut

- **Balansrapport** med ingående/utgående saldon per konto
- **Årets resultat** — omföring från resultatkontona till 2019 (31 dec)
- **Nollställning av eget kapital** — underkontona 2011–2019 nollas mot 2010
  (1 jan året därpå), samma mönster som Bokio

### NE-bilaga (SKV 2161)

- **Räkenskapsschemat R1–R11** mappat ur BAS-kontosaldo, med varningar för
  konton utan NE-ruta
- **Skattemässiga justeringar R12–R48** längs blankettens summokedjan:
  - R13/R14 beräknas ur bokföringen (ej avdragsgilla kostnader, skattefria
    intäkter)
  - **Räntefördelning** R30/R31 — SLR + 6/1 procentenheter, obligatorisk
    negativ räntefördelning vid kapitalunderlag under −500 000 kr, tak mot R29
    enligt Skatteverket
  - **Egenavgifter** R40–R43 — schablonavdrag 25/10/20 % med föregående års
    poster
  - **Periodiseringsfond** R32/R34 — avsättning högst 30 % av R33,
    sexårskohorter med obligatorisk återföring
  - **Expansionsfond** R36/R37 — tak mot R35 och mot 125,94 % av
    kapitalunderlaget, expansionsskatt 20,6 % som info
  - Övriga rutor markeras "fylls i manuellt"
- **SRU-export** — INFO.SRU och BLANKETTER.SRU i ISO 8859-1/CRLF enligt
  Skatteverkets tekniska beskrivning, redo för filöverföringstjänsten

Deklarationsuppgifterna (kapitalunderlag, personnummer m.m.) lever bara i
minnet och nollas när sidan laddas om.

## Förutsättningar

Journalen ska använda numeriska BAS-kontoalias, eftersom rapporterna slår upp
kontonummer:

```
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
```

Räkenskapsåret är kalenderår. Driver du två verksamheter har de var sin
journalfil — appen arbetar per journal, och den gemensamma momsdeklarationen
hanteras via den sammanslagna vyn.

## Kom igång

```bash
npm install
npm run dev        # utvecklingsserver på http://localhost:5173
```

| Kommando           | Funktion                          |
| ------------------ | --------------------------------- |
| `npm run dev`      | Utvecklingsserver                 |
| `npm run build`    | Bygg till `dist/`                 |
| `npm run server`   | Servera det byggda                |
| `npm test`         | Kör testerna (Vitest)             |
| `npm run typecheck`| TypeScript-kontroll               |

Testerna ligger kolokaliserade med koden (`src/js/*.test.ts`) och laddar
journals via samma parser som appen.

## Projektstruktur

```
src/
├── js/
│   ├── components/          # Webact-komponenter (rapporter, formulär, export)
│   ├── pages/               # Sidor kopplade till routern
│   ├── signals.ts           # Preact-signaler för applikationstillstånd
│   ├── parse-journal-file.ts# Journalparser
│   ├── verifikat.ts         # Verifikationsnumrering och seriegranskning
│   ├── mallar.ts            # Verifikatsmallar
│   ├── moms-rutor.ts        # Momskonto → ruta-mappningar (SKV 4700)
│   ├── momsrapport.ts       # Momsrapport, omföring och betalning
│   ├── balansrapport.ts     # Balansrapport
│   ├── bokslut.ts           # Årets resultat och nollställning
│   ├── ne-bilaga.ts         # NE-bilagan R1–R48 med justeringskedjan
│   ├── rantefordelning.ts / egenavgifter.ts /
│   │   periodiseringsfond.ts / expansionsfond.ts   # Deklarationskalkyler
│   ├── ne-sru.ts            # SRU-generator (ISO 8859-1)
│   └── app-router.ts / app.ts
├── css/style.css
└── index.html
```

## Webbläsarstöd

Filöppning/-sparning på disk kräver File System Access API (Chrome/Edge).
I Firefox/Safari fungerar appen med vanlig filväljare och nedladdning.

## Kända begränsningar

- Den sammanslagna momsvyn läser den andra journalen read-only; redigering
  sker när journalen är aktiv
- Räntefördelningsregler före beskattningsår 2025 (±50 000-gränserna) och
  sparat fördelningsbelopp som stat är ej modellerat
- Avkastning enligt K10-reglerna (blankett K1) stöds inte ännu
- SIE4-export saknas (verifikatmodellen är dock designad för den)

## Licens

Licensed under the [GNU AGPL-3.0-or-later](LICENSE).

Parts of the Swedish tax report logic (BAS account ranges, SKV form mappings)
are informed by [accounted](https://github.com/erp-mafia/accounted)
(gnubok, Copyright (C) 2025-2026 Jakob Wennberg, AGPL-3.0), whose license this
project shares so code can be reused directly.
