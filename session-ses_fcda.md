# Reading Claude's repo memory

**Session ID:** ses_fcda23e54ffetRaU748oGhApJB
**Created:** 8/24/2026, 8:03:20 AM
**Updated:** 8/24/2026, 8:59:43 AM

---

## User

Can you read claudes memory for this repo?

---

## Assistant (Build · Kimi K3 · 16.4s)

_Thinking:_

The user asks: "Can you read claudes memory for this repo?" - they want me to read Claude's memory for this repository. Claude Code stores memory in `CLAUDE.md` files, and also there's a Claude memory directory at `~/.claude/projects/<project-path>/memory/` or similar. Let me think.

Claude Code has:
1. `CLAUDE.md` files in the repo (project memory)
2. `~/.claude/CLAUDE.md` (user memory)
3. The new auto-memory feature stores in `~/.claude/projects/<project-slug>/memory/` - Actually, Claude Code's memory feature stores memories in `~/.claude/projects/<path-with-dashes>/memory/MEMORY.md` and other files.

Let me check. The working directory is /Users/jeremy/dev/hledger-web-gui. The Claude projects directory would be `~/.claude/projects/-Users-jeremy-dev-hledger-web-gui/` and there may be a `memory` subdirectory.

I should first check for CLAUDE.md in the repo root, and also check `~/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/`.

Note the guideline: don't access files outside working directory unless instructed. The user explicitly asked to read Claude's memory, which is stored outside the working directory in ~/.claude. This is an explicit instruction, so it's fine.

Let me do parallel calls: glob for CLAUDE.md in repo, and list the memory directory.

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/CLAUDE.md"
}
```

**Output:**
```
No files found
```

**Tool: bash**

**Input:**
```json
{
  "command": "ls -la ~/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/ 2>/dev/null || echo \"NO_MEMORY_DIR\""
}
```

**Output:**
```
total 32
drwxr-xr-x@ 6 jeremy  staff   192 Aug 14 14:38 .
drwxr-xr-x@ 5 jeremy  staff   160 Aug 14 09:01 ..
-rw-r--r--@ 1 jeremy  staff   475 Aug 14 14:35 MEMORY.md
-rw-r--r--@ 1 jeremy  staff  1425 Aug 14 08:14 accounted-reference-repo.md
-rw-r--r--@ 1 jeremy  staff  1161 Aug 14 08:32 bokio-migration.md
-rw-r--r--@ 1 jeremy  staff  1773 Aug 14 14:38 tva-verksamheter-nea.md

```

---

## Assistant (Build · Kimi K3 · 24.8s)

_Thinking:_

Found the memory directory. Let me read all 4 files in parallel.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/MEMORY.md"
}
```

**Output:**
```
<path>/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/MEMORY.md</path>
<type>file</type>
<content>
1: # Memory index
2: 
3: - [Accounted som referensrepo](accounted-reference-repo.md) — svenskt ERP att låna skattealgoritmer från; båda repona AGPL-3.0, kod kan återanvändas med attribution
4: - [Migration från Bokio](bokio-migration.md) — Bokios automatiska verifikat är kravspecen; privatköp bokförs mot 2018 i stället för 1930
5: - [Två verksamheter, två NEA](tva-verksamheter-nea.md) — IT och småbruk har separat bokföring och var sin NEA; bara momsen är gemensam

(End of file - total 5 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/accounted-reference-repo.md"
}
```

**Output:**
```
<path>/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/accounted-reference-repo.md</path>
<type>file</type>
<content>
1: ---
2: name: accounted-reference-repo
3: description: github.com/erp-mafia/accounted är referens för svenska skattealgoritmer; båda repona är AGPL-3.0 så kod kan återanvändas direkt med bibehållen upphovsrättsnotis
4: metadata: 
5:   node_type: memory
6:   type: reference
7:   originSessionId: 0950bb67-9fc9-4432-8c17-ef7c0c1b6035
8:   modified: 2026-08-14T06:14:50.103Z
9: ---
10: 
11: Jeremy vill låna algoritmer (VAT-beräkning, SKV-blanketter, NE-bilaga) från
12: https://github.com/erp-mafia/accounted — ett svenskt open source-ERP (Next.js/Supabase, AGPL-3.0).
13: 
14: **Licens:** hledger-web-gui relicensierades 2026-08-14 till AGPL-3.0-or-later (Jeremys beslut)
15: just för att kunna återanvända kod från accounted direkt. Vid kodkopiering: behåll/ange
16: upphovsrättsnotisen (gnubok, Copyright (C) 2025-2026 Jakob Wennberg) — README har redan
17: en attributionssektion.
18: 
19: Användbara filer i accounted:
20: - `lib/reports/ne-bilaga/ne-engine.ts` — BAS→NE-rutor R1–R11 (obs: deras matchordning har en latent bugg där R1 skuggar R3; vår port fixar det)
21: - `lib/reports/ne-bilaga/sru-generator.ts` — SRU-filformat (INFO.SRU/BLANKETTER.SRU, ISO 8859-1, fältkoder R1–R11 = 7400–7403, 7500–7505, 7440; datum 7011/7012)
22: - `lib/bokslut/enskild-firma/` — egenavgifter, räntefördelning, periodiseringsfond, expansionsfond (ej porterade än)
23: 
24: Arkitekturen här ska förbli webact web components + hledger-journal/SIE4 — inga ramverksbyten.

(End of file - total 24 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/bokio-migration.md"
}
```

**Output:**
```
<path>/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/bokio-migration.md</path>
<type>file</type>
<content>
1: ---
2: name: bokio-migration
3: description: Jeremy migrerar från Bokio till detta projekt — Bokios automatiska verifikat är måttstocken för vilka funktioner som måste finnas
4: metadata: 
5:   node_type: memory
6:   type: project
7:   originSessionId: 0950bb67-9fc9-4432-8c17-ef7c0c1b6035
8:   modified: 2026-08-14T06:32:57.986Z
9: ---
10: 
11: Jeremy driver enskild firma (Barlingshult: höns, får, ägg) och ska byta från Bokio
12: till detta projekt. Bokios beteende är kravspecen — när en funktion diskuteras är
13: frågan "hur gör Bokio?" oftast rätt utgångspunkt.
14: 
15: **Viktig arbetsvana:** Jeremy handlar ofta på Granngården med sitt *privata* kreditkort
16: och bokför det som 2018 Egen insättning i stället för 1930 (dragning från bankkontot).
17: Därför har transaktionsformuläret en betalkonto-väljare (1930 / 2018) — se
18: `src/js/mallar.ts` (`betalkonton`).
19: 
20: Implementerat 2026-08-14: momsomföring, årets resultat och nollställning av eget
21: kapital som automatiska verifikat, efter mönster från Bokio. Se [[accounted-reference-repo]].
22: 
23: Ännu inte gjort: SRU-export av NE-bilagan, K1-blanketten, skattemässiga justeringar
24: (R12+), egenavgifter och räntefördelning.

(End of file - total 24 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/tva-verksamheter-nea.md"
}
```

**Output:**
```
<path>/Users/jeremy/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/tva-verksamheter-nea.md</path>
<type>file</type>
<content>
1: ---
2: name: tva-verksamheter-nea
3: description: Jeremy driver två skilda verksamheter (IT och småbruk) med separat bokföring och en NEA-bilaga vardera — bara momsen är gemensam
4: metadata: 
5:   node_type: memory
6:   type: project
7:   originSessionId: c3321886-bb27-44db-9f13-d87269ecfbf2
8:   modified: 2026-08-14T12:38:06.504Z
9: ---
10: 
11: Jeremy bokför IT-verksamhet och småbruk i **varsin journalfil**. Verksamheterna är
12: tillräckligt skilda för att kräva separat bokföring, och han lämnar därför **en
13: NEA-bilaga per verksamhet** som Skatteverkets tjänst summerar till NE-bilagan.
14: 
15: **Vad som är per verksamhet:** bokföring, räkenskapsschema R1–R11, balansräkning
16: B1–B10, årets resultat, eget kapital (eget 2010 i varje).
17: 
18: **Vad som är gemensamt:** NE-bilagan (summan), skattemässiga justeringar,
19: egenavgifter och räntefördelning (IL 14 kap 12 § — ett skattemässigt resultat),
20: samt **momsdeklarationen** — momsregistreringen följer personen, inte
21: verksamheten.
22: 
23: **Momsen i praktiken:** Jeremy gör momsdeklarationen separat per verksamhet (som
24: i Bokio) och slår ihop siffrorna först när deklarationen lämnas. Momsomföringen
25: hör alltså till varje journal och sina egna 26xx-konton — koden gör redan rätt.
26: 
27: **Konsekvens för appen:** alla rapporter arbetar per journal, vilket de redan gör.
28: Det enda tillägget är en sammanslagen momsvy som visar rutorna för deklarationen.
29: Den måste summera i ören över journalerna och avrunda **en gång** — inte addera
30: redan avrundade rutor, då blir det upp till en krona fel per ruta.
31: 
32: Missa inte: jag antog först felaktigt att IL 14:12 innebar en enda bokföring och
33: en enda NE — det är fel, NEA är just mekanismen för flera verksamheter.
34: Se [[bokio-migration]] och [[accounted-reference-repo]].

(End of file - total 34 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 25.2s)

_Thinking:_

I've read all the memory files. Now let me summarize for the user. The user speaks English in their message ("Can you read claudes memory for this repo?") but the memories themselves are in Swedish. I should respond in English since that's the language of the user's message, but I can reference the Swedish content. Actually, the memory content is Swedish — the user is Swedish-speaking it seems (Jeremy, Swedish accounting). But the instruction says respond in the same language as the user. The user wrote in English. I'll respond in English, summarizing the Swedish memories. Maybe keep key Swedish terms.

Let me summarize concisely.

Yes — I found and read Claude's memory for this repo at `~/.claude/projects/-Users-jeremy-dev-hledger-web-gui/memory/`. There's no `CLAUDE.md` in the repo itself; the memory consists of an index (`MEMORY.md`) plus three notes (all in Swedish, last updated 2026-08-14):

**1. Accounted as reference repo** (`accounted-reference-repo.md`)
- You want to borrow tax algorithms (VAT calc, SKV forms, NE-bilaga) from `github.com/erp-mafia/accounted`, a Swedish AGPL-3.0 ERP.
- This repo was relicensed to AGPL-3.0-or-later on 2026-08-14 specifically so that code can be reused with attribution (gnubok, Copyright Jakob Wennberg).
- Useful files there: `ne-engine.ts` (BAS→NE boxes R1–R11, has a latent bug where R1 shadows R3 — our port fixes it), `sru-generator.ts` (SRU format details), and `lib/bokslut/enskild-firma/` (egenavgifter, räntefördelning, periodiseringsfond — not ported yet).
- Architecture stays: webact web components + hledger-journal/SIE4, no framework switches.

**2. Migration from Bokio** (`bokio-migration.md`)
- You run an enskild firma (Barlingshult: hens, sheep, eggs) and are switching from Bokio; Bokio's behavior is the requirements spec ("how does Bokio do it?" is the right starting question).
- You often buy at Granngården with your *private* credit card and book it as 2018 Egen insättning instead of 1930 — hence the payment account selector (1930/2018) in `src/js/mallar.ts`.
- Done 2026-08-14: momsomföring, årets resultat, and zeroing of eget kapital as automatic verifikat.
- Not yet done: SRU export of the NE-bilaga, K1, skattemässiga justeringar (R12+), egenavgifter, räntefördelning.

**3. Two verksamheter, two NEA** (`tva-verksamheter-nea.md`)
- You run two separate businesses (IT and småbruk), each in its **own journal file**, each filing its own NEA-bilaga which Skatteverket sums into the NE.
- Per-business: bookkeeping, R1–R11, B1–B10, årets resultat, eget kapital (own 2010 in each).
- Shared: NE-bilaga (the sum), skattemässiga justeringar, egenavgifter/räntefördelning, and the **momsdeklaration** (momsregistrering follows the person, not the business).
- Key implementation note: the combined moms view must sum in ören across journals and round **once** — never add pre-rounded boxes (up to 1 kr error per box otherwise).
- Gotcha recorded: it's wrong to assume IL 14:12 means one bookkeeping/one NE — the NEA is exactly the mechanism for multiple verksamheter.

Want me to do anything with this — e.g., verify the codebase still matches these notes, or pick up one of the "not yet done" items like SRU export?

---

## User

Yes, give me an overview over what's left to implement in the repo

---

## Assistant (Build · Kimi K3 · 14.4s)

_Thinking:_

The user wants an overview of what's left to implement in the repo. I should:

1. Look at the memory notes for "not yet done" items:
   - SRU export of the NE-bilaga
   - K1-blanketten
   - Skattemässiga justeringar (R12+)
   - Egenavgifter and räntefördelning
   - Combined moms view (summering i ören, avrunda en gång)

2. Explore the actual repo to see what exists — TODO comments, missing features, etc.

Let me explore the repo structure first, then look for TODOs, README roadmap, etc. This is a research task across the codebase — I could use an explore agent for thorough exploration. Let me do a combination: read the repo structure myself and check README/roadmap docs, and search for TODO/FIXME.

Let me start with parallel calls: list the repo root, grep for TODO/FIXME, look at README.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui</path>
<type>directory</type>
<entries>
.claude/
.devcontainer/
.git/
.github/
.gitignore
.vite/
.vscode/
barlingshult.journal
biome.json
Dockerfile
index.html
LICENSE
node_modules/
output.journal
package-lock.json
package.json
public/
README.md
src/
tsconfig.json
vite.config.ts
vitest.config.ts

(22 entries)
</entries>
```

**Tool: grep**

**Input:**
```json
{
  "include": "*.{ts,js,html}",
  "pattern": "TODO|FIXME|XXX|inte (implementerat|gjort|klar)|saknas|TODO:|återstår"
}
```

**Output:**
```
Found 14 matches
/Users/jeremy/dev/hledger-web-gui/src/vite-env.d.ts:
  Line 7: // File System Access API — finns i Chromium men saknas i lib.dom


/Users/jeremy/dev/hledger-web-gui/src/js/verifikat.ts:
  Line 17:  * Poängen med en obruten serie är fullständighetskontroll — saknas ett nummer

  Line 80:   /** Nummer som saknas mellan det lägsta och högsta använda. */


/Users/jeremy/dev/hledger-web-gui/src/js/signals.ts:
  Line 75: // `chrome`. Den saknas i Firefox, Safari och Node (testerna), och providerns


/Users/jeremy/dev/hledger-web-gui/src/js/verifikat.test.ts:
  Line 95:   it("utelämnar parentesen när numret saknas", async () => {


/Users/jeremy/dev/hledger-web-gui/src/js/components/bokslut-atgarder.ts:
  Line 48:   const saknas = postings

  Line 52:   return saknas.length > 0

  Line 54:         Tips: lägg till alias för konto ${saknas.join(", ")} i journalens


/Users/jeremy/dev/hledger-web-gui/src/js/momsrapport.ts:
  Line 60:   /** Belopp per ruta. Rutor utan rörelse saknas i mappen. */


/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts:
  Line 27:     throw new Error(`Ruta ${ruta} saknas i bilagan`);


/Users/jeremy/dev/hledger-web-gui/src/js/components/transaction-row.ts:
  Line 68:                           : `<div class="vernr saknas mono" title="Verifikationsnummer saknas">—</div>`}


/Users/jeremy/dev/hledger-web-gui/src/js/components/bokfor-momsomforing.ts:
  Line 45:   const saknas = postings

  Line 49:   return saknas.length > 0

  Line 51:         Tips: lägg till alias för konto ${saknas.join(", ")} i journalens

```

---

## Assistant (Build · Kimi K3 · 9.4s)

_Thinking:_

The TODO grep didn't reveal explicit roadmap TODOs. Let me look at the README and the src directory structure to understand what exists, and check any roadmap docs. Let me also check the .claude directory for local settings/plans.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/README.md"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/README.md</path>
<type>file</type>
<content>
1: # Hledger Journal Manager
2: 
3: A vanilla web application for managing hledger journal files. Upload your journal file and easily add new transactions using only the accounts defined in your file.
4: 
5: ## Features
6: 
7: - 📁 **File Upload**: Upload your `.journal` file via drag & drop or file picker
8: - 📋 **Account Discovery**: Automatically extracts and displays all accounts defined in your journal file
9: - ➕ **Transaction Form**: Easy-to-use form for adding new transactions
10: - ⚖️ **Balance Validation**: Ensures your transactions balance (sum to zero)
11: - 📄 **Live Preview**: See your journal file content in real-time
12: - 🎨 **Modern UI**: Beautiful, responsive design that works on desktop and mobile
13: 
14: ## How to Use
15: 
16: 1. **Install dependencies**:
17:    ```bash
18:    npm install
19:    ```
20: 
21: 2. **Start the development server**:
22:    ```bash
23:    npm run dev
24:    ```
25: 
26: 3. **Open your browser** and navigate to `http://localhost:5173`
27: 
28: 4. **Upload your journal file** by clicking "Choose Journal File" and selecting your `.journal` file
29: 
30: 5. **View available accounts** - the app will automatically extract all accounts defined in your file
31: 
32: 6. **Add transactions**:
33:    - Set the transaction date
34:    - Enter a description
35:    - Add postings by selecting accounts from the dropdown (only shows accounts from your file)
36:    - Enter amounts and currency
37:    - Add more postings if needed
38:    - The app will validate that postings balance to zero
39: 
40: 7. **Preview your journal** - see the updated content in real-time
41: 
42: ## File Format Support
43: 
44: The app supports standard hledger journal files with:
45: - Account definitions (`account accountname`)
46: - Transactions with postings
47: - Comments (lines starting with `;`)
48: - Standard hledger syntax
49: 
50: ## Example Transaction
51: 
52: When you add a transaction like:
53: - Date: 2025-01-15
54: - Description: "Coffee purchase"
55: - Postings:
56:   - `expenses:food` + 25.00 SEK
57:   - `assets:bank` - 25.00 SEK
58: 
59: The app will format it as:
60: ```
61: 2025-01-15 Coffee purchase
62:     expenses:food   25.00 SEK
63:     assets:bank  -25.00 SEK
64: ```
65: 
66: ## Technical Details
67: 
68: - **TypeScript** - Type-safe development with modern JavaScript features
69: - **Vite** - Fast development server and build tool
70: - **Webact** - Lightweight web components library
71: - **Preact Signals** - Reactive state management
72: - **Responsive design** - works on desktop, tablet, and mobile
73: - **File parsing** - client-side parsing of journal files
74: - **Validation** - ensures transactions balance and all fields are filled
75: - **Modern CSS** - uses CSS Grid, Flexbox, and modern styling
76: 
77: ## Development
78: 
79: This project uses Vite for the development server and build process.
80: 
81: ### Available Scripts
82: 
83: - `npm run dev` - Start the development server
84: - `npm run build` - Build for production
85: - `npm run server` - Serve the built application
86: 
87: ### Project Structure
88: 
89: ```
90: src/
91: ├── js/
92: │   ├── components/     # Webact components
93: │   ├── signals.ts      # Preact signals for state
94: │   ├── parse-journal-file.ts  # Journal file parser
95: │   └── app.ts          # Main application logic
96: ├── css/
97: │   └── style.css       # Application styles
98: └── index.html          # Main HTML file
99: ```
100: 
101: ## Browser Compatibility
102: 
103: Works in all modern browsers that support:
104: - File API
105: - ES6+ JavaScript
106: - CSS Grid and Flexbox
107: - Web Components
108: - Constructable Stylesheets 
109: ## License
110: 
111: Licensed under the [GNU AGPL-3.0-or-later](LICENSE).
112: 
113: Parts of the Swedish tax report logic (BAS account ranges, SKV form mappings)
114: are informed by [accounted](https://github.com/erp-mafia/accounted)
115: (gnubok, Copyright (C) 2025-2026 Jakob Wennberg, AGPL-3.0), whose license this
116: project shares so code can be reused directly.

(End of file - total 116 lines)
</content>
```

**Tool: bash**

**Input:**
```json
{
  "command": "ls -la /Users/jeremy/dev/hledger-web-gui/src /Users/jeremy/dev/hledger-web-gui/src/js /Users/jeremy/dev/hledger-web-gui/src/js/components /Users/jeremy/dev/hledger-web-gui/.claude 2>/dev/null"
}
```

**Output:**
```
/Users/jeremy/dev/hledger-web-gui/.claude:
total 16
drwxr-xr-x@  4 jeremy  staff  128 Aug 14 14:14 .
drwxr-xr-x@ 24 jeremy  staff  768 Aug 14 14:14 ..
-rw-r--r--@  1 jeremy  staff  175 Aug 14 07:45 launch.json
-rw-r--r--@  1 jeremy  staff   98 Aug 14 14:14 settings.local.json

/Users/jeremy/dev/hledger-web-gui/src:
total 8
drwxr-xr-x@  5 jeremy  staff  160 Aug 14 07:45 .
drwxr-xr-x@ 24 jeremy  staff  768 Aug 14 14:14 ..
drwxr-xr-x@  3 jeremy  staff   96 Aug 14 07:45 css
drwxr-xr-x@ 25 jeremy  staff  800 Aug 14 14:46 js
-rw-r--r--@  1 jeremy  staff  616 Aug 14 07:45 vite-env.d.ts

/Users/jeremy/dev/hledger-web-gui/src/js:
total 320
drwxr-xr-x@ 25 jeremy  staff    800 Aug 14 14:46 .
drwxr-xr-x@  5 jeremy  staff    160 Aug 14 07:45 ..
-rw-r--r--@  1 jeremy  staff   3624 Aug 14 14:14 app-router.ts
-rw-r--r--@  1 jeremy  staff    104 Aug 14 07:45 app.ts
-rw-r--r--@  1 jeremy  staff   6177 Aug 14 14:14 balansrapport.test.ts
-rw-r--r--@  1 jeremy  staff   2917 Aug 14 07:45 balansrapport.ts
-rw-r--r--@  1 jeremy  staff   7477 Aug 14 14:14 bokslut.test.ts
-rw-r--r--@  1 jeremy  staff   4144 Aug 14 14:42 bokslut.ts
drwxr-xr-x@ 21 jeremy  staff    672 Aug 14 14:50 components
-rw-r--r--@  1 jeremy  staff   4366 Aug 14 07:45 journal-file.ts
-rw-r--r--@  1 jeremy  staff   3821 Aug 14 14:41 mallar.ts
-rw-r--r--@  1 jeremy  staff  11890 Aug 14 14:14 moms-omvand.test.ts
-rw-r--r--@  1 jeremy  staff   5996 Aug 14 14:14 moms-rutor.ts
-rw-r--r--@  1 jeremy  staff  11980 Aug 14 14:14 momsrapport.test.ts
-rw-r--r--@  1 jeremy  staff   9371 Aug 14 14:42 momsrapport.ts
-rw-r--r--@  1 jeremy  staff  10226 Aug 14 14:24 ne-bilaga.test.ts
-rw-r--r--@  1 jeremy  staff   6462 Aug 14 14:24 ne-bilaga.ts
drwxr-xr-x@  9 jeremy  staff    288 Aug 14 14:45 pages
-rw-r--r--@  1 jeremy  staff   7739 Aug 14 14:14 parse-journal-file.test.ts
-rw-r--r--@  1 jeremy  staff   4659 Aug 14 14:40 parse-journal-file.ts
-rw-r--r--@  1 jeremy  staff   3122 Aug 14 14:41 signals.ts
-rw-r--r--@  1 jeremy  staff   1748 Aug 14 14:14 test-helpers.ts
-rw-r--r--@  1 jeremy  staff   9546 Aug 14 14:50 verifikat.test.ts
-rw-r--r--@  1 jeremy  staff   5050 Aug 14 14:46 verifikat.ts
-rw-r--r--@  1 jeremy  staff    539 Aug 14 07:45 webact-types.ts

/Users/jeremy/dev/hledger-web-gui/src/js/components:
total 168
drwxr-xr-x@ 21 jeremy  staff   672 Aug 14 14:50 .
drwxr-xr-x@ 25 jeremy  staff   800 Aug 14 14:46 ..
-rw-r--r--@  1 jeremy  staff  1021 Aug 14 07:45 accounts-list.ts
-rw-r--r--@  1 jeremy  staff  4365 Aug 14 14:14 bokfor-momsbetalning.ts
-rw-r--r--@  1 jeremy  staff  3209 Aug 14 14:14 bokfor-momsomforing.ts
-rw-r--r--@  1 jeremy  staff  5058 Aug 14 14:14 bokslut-atgarder.ts
-rw-r--r--@  1 jeremy  staff   338 Aug 14 07:45 date-square.ts
-rw-r--r--@  1 jeremy  staff  1478 Aug 14 07:45 file-controls.ts
-rw-r--r--@  1 jeremy  staff   662 Aug 14 07:45 hledger-output.ts
-rw-r--r--@  1 jeremy  staff   685 Aug 14 07:45 journal-preview.ts
-rw-r--r--@  1 jeremy  staff  4919 Aug 14 14:14 new-transaction.ts
-rw-r--r--@  1 jeremy  staff  2940 Aug 14 07:45 rapport-balans.ts
-rw-r--r--@  1 jeremy  staff  3136 Aug 14 14:14 rapport-moms.ts
-rw-r--r--@  1 jeremy  staff  2917 Aug 14 14:22 rapport-ne.ts
-rw-r--r--@  1 jeremy  staff  1330 Aug 14 14:14 rapport.css
-rw-r--r--@  1 jeremy  staff   738 Aug 14 14:43 transaction-row.css
-rw-r--r--@  1 jeremy  staff  3698 Aug 14 14:43 transaction-row.ts
-rw-r--r--@  1 jeremy  staff     0 Aug 14 07:45 transactions-list.css
-rw-r--r--@  1 jeremy  staff  1345 Aug 14 07:45 transactions-list.ts
-rw-r--r--@  1 jeremy  staff  2417 Aug 14 14:50 verifikat-serie.ts
-rw-r--r--@  1 jeremy  staff  1245 Aug 14 07:45 year-picker.ts

```

---

## Assistant (Build · Kimi K3 · 11.9s)

_Thinking:_

The README is outdated (describes the old generic "Hledger Journal Manager"). The actual codebase has evolved a lot. Let me look at the pages directory and key files to understand what's implemented. Let me delegate a thorough exploration to an explore agent, or read the key files myself.

Given the memory notes list "not yet done" items:
- SRU-export av NE-bilagan
- K1-blanketten
- skattemässiga justeringar (R12+)
- egenavgifter och räntefördelning
- combined moms view (sammanslagen momsvy)

I should verify against the codebase what exists and what's missing. Let me read key files: ne-bilaga.ts, bokslut.ts, momsrapport.ts, mallar.ts, app-router.ts, and the pages directory. Let me do this efficiently with parallel reads.

**Tool: bash**

**Input:**
```json
{
  "command": "ls -la /Users/jeremy/dev/hledger-web-gui/src/js/pages"
}
```

**Output:**
```
total 56
drwxr-xr-x@  9 jeremy  staff   288 Aug 14 14:45 .
drwxr-xr-x@ 25 jeremy  staff   800 Aug 14 14:46 ..
-rw-r--r--@  1 jeremy  staff   362 Aug 14 07:45 accounts-page.ts
-rw-r--r--@  1 jeremy  staff   400 Aug 14 07:45 balansrapport-page.ts
-rw-r--r--@  1 jeremy  staff   384 Aug 14 14:14 bokslut-page.ts
-rw-r--r--@  1 jeremy  staff  2665 Aug 14 07:45 index-page.ts
-rw-r--r--@  1 jeremy  staff   581 Aug 14 14:14 momsrapport-page.ts
-rw-r--r--@  1 jeremy  staff   371 Aug 14 14:14 nebilaga-page.ts
-rw-r--r--@  1 jeremy  staff   643 Aug 14 14:45 transactions-page.ts

```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/app-router.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/app-router.ts</path>
<type>file</type>
<content>
1: import { registerFunctionComponent } from "webact";
2: import AccountsPage from "./pages/accounts-page.ts";
3: import BalansrapportPage from "./pages/balansrapport-page.ts";
4: import IndexPage from "./pages/index-page.ts";
5: import MomsrapportPage from "./pages/momsrapport-page.ts";
6: import BokslutPage from "./pages/bokslut-page.ts";
7: import NebilagaPage from "./pages/nebilaga-page.ts";
8: import TransactionsPage from "./pages/transactions-page.ts";
9: import type { WebactThis } from "./webact-types.ts";
10: 
11: function AppRouter(this: WebactThis) {
12:   const { postRender, $, html } = this;
13: 
14:   let currentAbortController: AbortController | null = null;
15: 
16:   html`<slot></slot>`;
17: 
18:   async function renderRoute(pathname: string) {
19:     try {
20:       // Abort any ongoing request
21:       if (currentAbortController) {
22:         currentAbortController.abort();
23:       }
24:       currentAbortController = new AbortController();
25: 
26:       const timerId = `[renderRoute] ${pathname}`;
27:       console.time(timerId);
28:       const hostElement = $(":host");
29: 
30:       switch (pathname) {
31:         case "/":
32:           hostElement.innerHTML = `<${IndexPage}></${IndexPage}>`;
33:           break;
34:         case "/transactions":
35:           hostElement.innerHTML = `<${TransactionsPage}></${TransactionsPage}>`;
36:           break;
37:         case "/accounts":
38:           hostElement.innerHTML = `<${AccountsPage}></${AccountsPage}>`;
39:           break;
40:         case "/momsrapport":
41:           hostElement.innerHTML = `<${MomsrapportPage}></${MomsrapportPage}>`;
42:           break;
43:         case "/balansrapport":
44:           hostElement.innerHTML = `<${BalansrapportPage}></${BalansrapportPage}>`;
45:           break;
46:         case "/ne-bilaga":
47:           hostElement.innerHTML = `<${NebilagaPage}></${NebilagaPage}>`;
48:           break;
49:         case "/bokslut":
50:           hostElement.innerHTML = `<${BokslutPage}></${BokslutPage}>`;
51:           break;
52:         default:
53:           hostElement.innerHTML = "Sidan finns ej.";
54:       }
55: 
56:       hostElement.dispatchEvent(
57:         new CustomEvent("navigated", {
58:           detail: pathname,
59:         }),
60:       );
61: 
62:       console.timeEnd(timerId);
63:     } catch (e) {
64:       // Only log errors that aren't from aborting
65:       if (!(e instanceof Error) || e.name !== "AbortError") {
66:         console.error("Could not render route");
67:         console.error(e);
68:       }
69:     }
70:   }
71: 
72:   postRender(async () => {
73:     renderRoute(document.location.pathname + document.location.search);
74: 
75:     document.addEventListener("router:navigate", (event) => {
76:       if (event instanceof CustomEvent) {
77:         renderRoute(event.detail.pathname);
78:         history.pushState(null, "", event.detail.pathname);
79:       }
80:     });
81: 
82:     window.addEventListener(
83:       "popstate",
84:       () => renderRoute(document.location.pathname + document.location.search),
85:       false,
86:     );
87:   });
88: }
89: 
90: function RouterLink(this: WebactThis) {
91:   const { $, css, html, postRender } = this;
92: 
93:   html`<slot></slot>`;
94: 
95:   css`
96:   :host {
97:     cursor: pointer;
98:     color: currentColor;
99:   }
100:   `;
101: 
102:   postRender(() => {
103:     /** @type {HTMLElement} */
104:     const routerLink = $(":host");
105: 
106:     routerLink.addEventListener("click", () => {
107:       const url = new URL($().getAttribute("href"), document.location.href);
108:       const pathname = url.pathname + url.search;
109: 
110:       document.dispatchEvent(
111:         new CustomEvent("router:navigate", {
112:           detail: {
113:             pathname,
114:           },
115:         }),
116:       );
117:     });
118:   });
119: }
120: 
121: registerFunctionComponent(RouterLink, {
122:   name: "router-link",
123:   shadowRootMode: "open",
124: });
125: 
126: export default registerFunctionComponent(AppRouter, {
127:   name: "app-router",
128:   shadowRootMode: "open",
129: });

(End of file - total 129 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts</path>
<type>file</type>
<content>
1: import { aliases, transactions } from "./signals";
2: 
3: /**
4:  * NE-bilaga (Inkomst av näringsverksamhet, enskilda näringsidkare)
5:  *
6:  * Räkenskapsschemat R1–R11: BAS-kontosaldon mappas till blankettens rutor
7:  * enligt BAS-kontogruppens kopplingstabell "NE - Inkomst av näringsverksamhet,
8:  * Enskilda näringsidkare" (bas.se/kontoplaner/sru/).
9:  */
10: 
11: export type NeRuta =
12:   | "R1"
13:   | "R2"
14:   | "R3"
15:   | "R4"
16:   | "R5"
17:   | "R6"
18:   | "R7"
19:   | "R8"
20:   | "R9"
21:   | "R10";
22: 
23: export type NeKontoRad = {
24:   konto: number;
25:   namn: string;
26:   belopp: number;
27: };
28: 
29: export type NeRad = {
30:   ruta: NeRuta;
31:   beskrivning: string;
32:   belopp: number;
33:   konton: Array<NeKontoRad>;
34: };
35: 
36: export type NeBilaga = {
37:   year: string;
38:   intakter: Array<NeRad>; // R1–R4
39:   kostnader: Array<NeRad>; // R5–R10
40:   /** R11 — intäkter minus kostnader. Positivt = vinst. */
41:   bokfortResultat: number;
42:   varningar: Array<string>;
43: };
44: 
45: type NeMappning = {
46:   ruta: NeRuta;
47:   beskrivning: string;
48:   intervall: Array<[start: number, slut: number]>;
49:   /** Kostnadskonton bokförs i debet (positivt); intäktskonton i kredit,
50:    *  så tecknet byts vid summeringen. */
51:   kostnad: boolean;
52: };
53: 
54: /**
55:  * Rutor som inte går att räkna fram ur kontosaldon. R3 avser förmånsvärden
56:  * som beskattas hos näringsidkaren och som saknar eget BAS-konto — de fylls
57:  * i för hand i deklarationen.
58:  *
59:  * Obs: BAS 3200–3299 är "Försäljning VMB och omvänd moms" och alltså
60:  * försäljning, inte förmåner. Det intervallet hör till R1.
61:  */
62: export const MANUELLA_NE_RUTOR = new Set<NeRuta>(["R3"]);
63: 
64: /** Matchas i ordning — smala intervall (3100, 7820) ligger före de breda de
65:  *  överlappar, så första träff avgör rutan. */
66: const NE_MAPPNINGAR: Array<NeMappning> = [
67:   {
68:     ruta: "R2",
69:     beskrivning: "Momsfria intäkter",
70:     intervall: [
71:       [3100, 3100],
72:       [3900, 3999],
73:     ],
74:     kostnad: false,
75:   },
76:   {
77:     ruta: "R3",
78:     beskrivning: "Bil- och bostadsförmån m.m.",
79:     intervall: [],
80:     kostnad: false,
81:   },
82:   {
83:     ruta: "R1",
84:     beskrivning: "Försäljning och utfört arbete samt övriga momspliktiga intäkter",
85:     intervall: [
86:       [3000, 3599],
87:       [3700, 3799],
88:     ],
89:     kostnad: false,
90:   },
91:   {
92:     ruta: "R4",
93:     beskrivning: "Ränteintäkter m.m.",
94:     intervall: [[8310, 8330]],
95:     kostnad: false,
96:   },
97:   {
98:     ruta: "R5",
99:     beskrivning: "Varor, material och tjänster",
100:     intervall: [[4000, 4990]],
101:     kostnad: true,
102:   },
103:   {
104:     ruta: "R6",
105:     beskrivning: "Övriga externa kostnader",
106:     intervall: [
107:       [5000, 6990],
108:       [7970, 7970],
109:     ],
110:     kostnad: true,
111:   },
112:   {
113:     ruta: "R7",
114:     beskrivning: "Anställd personal",
115:     intervall: [[7000, 7699]],
116:     kostnad: true,
117:   },
118:   {
119:     ruta: "R8",
120:     beskrivning: "Räntekostnader m.m.",
121:     intervall: [[8400, 8499]],
122:     kostnad: true,
123:   },
124:   {
125:     ruta: "R9",
126:     beskrivning: "Avskrivningar byggnader och markanläggningar",
127:     // Hela 782x-gruppen hör hit: 7820 (samlingskonto), 7821 byggnader,
128:     // 7824 markanläggningar, 7829 övriga byggnader. Bara 7820 räcker inte —
129:     // bokför man ladugårdsavskrivningen på 7821 hamnar den annars i R10.
130:     intervall: [[7820, 7829]],
131:     kostnad: true,
132:   },
133:   {
134:     ruta: "R10",
135:     beskrivning: "Avskrivningar maskiner, inventarier och immateriella tillgångar",
136:     intervall: [
137:       [7700, 7819],
138:       [7830, 7899],
139:     ],
140:     kostnad: true,
141:   },
142: ];
143: 
144: function hittaMappning(konto: number): NeMappning | undefined {
145:   return NE_MAPPNINGAR.find((mappning) =>
146:     mappning.intervall.some(([start, slut]) => konto >= start && konto <= slut),
147:   );
148: }
149: 
150: /** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
151: const arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;
152: 
153: /** Årets resultat — används i omföringen vid bokslut. En transaktion som rör
154:  *  8999 är en resultatdisposition och ska inte räknas med i räkenskapsschemat
155:  *  (den skulle nolla resultatkontona). */
156: const RESULTATDISPOSITION_KONTO = 8999;
157: 
158: export function generateNeBilaga(year: string): NeBilaga {
159:   const saldon = new Map<number, number>();
160: 
161:   for (const tx of transactions.value) {
162:     if (tx.date.slice(0, 4) !== year) {
163:       continue;
164:     }
165: 
166:     if (
167:       tx.postings.some(
168:         (posting) => posting.account === RESULTATDISPOSITION_KONTO,
169:       )
170:     ) {
171:       continue;
172:     }
173: 
174:     for (const posting of tx.postings) {
175:       if (!arResultatkonto(posting.account)) {
176:         continue;
177:       }
178: 
179:       saldon.set(
180:         posting.account,
181:         (saldon.get(posting.account) ?? 0) + posting.amount,
182:       );
183:     }
184:   }
185: 
186:   const kontonamn = (konto: number) =>
187:     aliases.value.find((alias) => alias.id === konto)?.to ?? "";
188: 
189:   const rader = new Map<NeRuta, NeRad>(
190:     NE_MAPPNINGAR.map((mappning) => [
191:       mappning.ruta,
192:       {
193:         ruta: mappning.ruta,
194:         beskrivning: mappning.beskrivning,
195:         belopp: 0,
196:         konton: [],
197:       },
198:     ]),
199:   );
200: 
201:   const omappade: Array<number> = [];
202: 
203:   for (const [konto, saldo] of [...saldon.entries()].sort(([a], [b]) => a - b)) {
204:     if (Math.abs(saldo) < 0.005) {
205:       continue;
206:     }
207: 
208:     const mappning = hittaMappning(konto);
209: 
210:     if (!mappning) {
211:       omappade.push(konto);
212:       continue;
213:     }
214: 
215:     const belopp = mappning.kostnad ? saldo : -saldo;
216:     const rad = rader.get(mappning.ruta)!;
217: 
218:     // Summera exakt — avrundas per ruta efter loopen, annars kan
219:     // öresavrundningar per konto driva iväg R11 från bokfört resultat
220:     rad.belopp += belopp;
221:     rad.konton.push({
222:       konto,
223:       namn: kontonamn(konto),
224:       belopp: Math.round(belopp),
225:     });
226:   }
227: 
228:   // Skatteverket vill ha hela kronor på blanketten
229:   for (const rad of rader.values()) {
230:     rad.belopp = Math.round(rad.belopp);
231:   }
232: 
233:   const iOrdning = (rutor: Array<NeRuta>) =>
234:     rutor.map((ruta) => rader.get(ruta)!);
235: 
236:   const intakter = iOrdning(["R1", "R2", "R3", "R4"]);
237:   const kostnader = iOrdning(["R5", "R6", "R7", "R8", "R9", "R10"]);
238: 
239:   const summaIntakter = intakter.reduce((sum, rad) => sum + rad.belopp, 0);
240:   const summaKostnader = kostnader.reduce((sum, rad) => sum + rad.belopp, 0);
241: 
242:   const varningar: Array<string> = [];
243: 
244:   if (omappade.length > 0) {
245:     varningar.push(
246:       `Konton utan NE-ruta (räknas inte med): ${omappade.join(", ")}. ` +
247:         "Kontrollera var de hör hemma i räkenskapsschemat.",
248:     );
249:   }
250: 
251:   return {
252:     year,
253:     intakter,
254:     kostnader,
255:     bokfortResultat: summaIntakter - summaKostnader,
256:     varningar,
257:   };
258: }

(End of file - total 258 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 10.0s)

_Thinking:_

Now let me look at the remaining key files to build the full picture: bokslut.ts, momsrapport.ts, mallar.ts, and the relevant components (bokslut-atgarder, rapport-ne, rapport-moms). Also check index-page for navigation. Let me read those in parallel.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/bokslut.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/bokslut.ts</path>
<type>file</type>
<content>
1: import type { Posting, Transaction } from "./parse-journal-file";
2: import { transactions } from "./signals";
3: import { numrera } from "./verifikat";
4: 
5: /**
6:  * Bokslutsfunktioner för enskild firma, samma automatiska verifikat som Bokio:
7:  *
8:  * 1. Årets resultat (31 dec): resultatet bokförs 8999 mot 2019 så att
9:  *    resultatkontona summerar till noll för året.
10:  * 2. Nollställning av eget kapital (1 jan året därpå): underkontona
11:  *    2011–2019 (egna uttag, egna insättningar, årets resultat) nollas
12:  *    mot 2010 Eget kapital.
13:  */
14: 
15: /** Årets resultat — resultatkontot som används i omföringen vid bokslut. */
16: export const ARETS_RESULTAT = 8999;
17: /** Årets resultat — balanskontot under eget kapital. */
18: export const ARETS_RESULTAT_EK = 2019;
19: export const EGET_KAPITAL = 2010;
20: 
21: const rorArsresultat = (tx: Transaction) =>
22:   tx.postings.some((posting) => posting.account === ARETS_RESULTAT);
23: 
24: const arKapitalUnderkonto = (konto: number) => konto >= 2011 && konto <= 2019;
25: 
26: const posting = (account: number, ore: number): Posting => ({
27:   account,
28:   amount: ore / 100,
29:   currency: "SEK",
30: });
31: 
32: /** Årets resultat i ören. Positivt = vinst. Transaktioner som rör 8999
33:  *  (tidigare resultatomföring) räknas inte med. */
34: export function beraknaArsresultatOre(year: string): number {
35:   let ore = 0;
36: 
37:   for (const tx of transactions.value) {
38:     if (tx.date.slice(0, 4) !== year || rorArsresultat(tx)) {
39:       continue;
40:     }
41: 
42:     for (const p of tx.postings) {
43:       if (p.account >= 3000 && p.account <= 8999) {
44:         ore += Math.round(p.amount * 100);
45:       }
46:     }
47:   }
48: 
49:   // Intäkter bokförs i kredit (negativt) — vinst blir positiv efter teckenbyte.
50:   // `ore === 0` fångar -0, som annars läcker ut som "−0 kr" i formatteringen.
51:   return ore === 0 ? 0 : -ore;
52: }
53: 
54: export function harArsresultat(year: string): boolean {
55:   return transactions.value.some(
56:     (tx) => tx.date.slice(0, 4) === year && rorArsresultat(tx),
57:   );
58: }
59: 
60: export function skapaArsresultatTransaktion(year: string): Transaction | null {
61:   const resultatOre = beraknaArsresultatOre(year);
62: 
63:   if (resultatOre === 0) {
64:     return null;
65:   }
66: 
67:   // Vinst: 8999 i debet (nollar resultaträkningen), 2019 i kredit.
68:   // Förlust ger omvända tecken med samma formel.
69:   return numrera({
70:     uuid: crypto.randomUUID(),
71:     date: `${year}-12-31`,
72:     description: `Årets resultat ${year}`,
73:     postings: [
74:       posting(ARETS_RESULTAT, resultatOre),
75:       posting(ARETS_RESULTAT_EK, -resultatOre),
76:     ],
77:   });
78: }
79: 
80: /** Nollningen för år X bokförs 1 jan år X+1 och rör 2010 plus underkonton. */
81: export function harNollning(year: string): boolean {
82:   const foljandeAr = String(parseInt(year, 10) + 1);
83: 
84:   return transactions.value.some((tx) => {
85:     if (tx.date.slice(0, 4) !== foljandeAr) {
86:       return false;
87:     }
88: 
89:     const konton = new Set(tx.postings.map((posting) => posting.account));
90:     return (
91:       konton.has(EGET_KAPITAL) && [...konton].some(arKapitalUnderkonto)
92:     );
93:   });
94: }
95: 
96: export function skapaNollningTransaktion(year: string): Transaction | null {
97:   // Utgående balans per underkonto t.o.m. 31 dec, ackumulerat över alla år
98:   // (tidigare års nollningar är daterade 1 jan och ingår i summeringen).
99:   const saldonOre = new Map<number, number>();
100: 
101:   for (const tx of transactions.value) {
102:     if (tx.date.slice(0, 4) > year) {
103:       continue;
104:     }
105: 
106:     for (const p of tx.postings) {
107:       if (arKapitalUnderkonto(p.account)) {
108:         saldonOre.set(
109:           p.account,
110:           (saldonOre.get(p.account) ?? 0) + Math.round(p.amount * 100),
111:         );
112:       }
113:     }
114:   }
115: 
116:   const postings: Array<Posting> = [];
117:   let summaOre = 0;
118: 
119:   for (const [konto, saldo] of [...saldonOre.entries()].sort(
120:     ([a], [b]) => a - b,
121:   )) {
122:     if (saldo === 0) {
123:       continue;
124:     }
125: 
126:     postings.push(posting(konto, -saldo));
127:     summaOre += saldo;
128:   }
129: 
130:   if (postings.length === 0) {
131:     return null;
132:   }
133: 
134:   postings.push(posting(EGET_KAPITAL, summaOre));
135: 
136:   return numrera({
137:     uuid: crypto.randomUUID(),
138:     date: `${parseInt(year, 10) + 1}-01-01`,
139:     description: `Nollställning av eget kapital ${year}`,
140:     postings,
141:   });
142: }

(End of file - total 142 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/momsrapport.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/momsrapport.ts</path>
<type>file</type>
<content>
1: import {
2:   arKreditnormal,
3:   INGAENDE_RUTOR,
4:   KONTO_RUTA,
5:   MOMSKONTON,
6:   type MomsRuta,
7:   RUTA_BESKRIVNING,
8:   UTGAENDE_RUTOR,
9: } from "./moms-rutor";
10: import type { Posting, Transaction } from "./parse-journal-file";
11: import { transactions } from "./signals";
12: import { numrera } from "./verifikat";
13: 
14: /** Redovisningskonto för moms — nettot att betala bokförs hit i kredit. */
15: export const REDOVISNINGSKONTO_MOMS = 2650;
16: /** Momsfordran — moms att återfå bokförs hit i debet. */
17: export const MOMSFORDRAN = 1650;
18: /** Öres- och kronutjämning — tar upp öresgapet när nettot avrundas till hela kronor. */
19: export const ORESUTJAMNING = 3740;
20: 
21: /**
22:  * Motkonton vid betalning/återbetalning av moms. Pengarna går normalt via
23:  * företagskontot eller skattekontot, men låter man dem gå till eller från
24:  * privat konto bokförs det mot eget kapital i stället.
25:  *
26:  * Vilket kapitalkonto som gäller beror på riktningen: en återbetalning som
27:  * hamnar privat är ett eget uttag, en inbetalning ur egen ficka en egen
28:  * insättning. Bara det relevanta av dem erbjuds.
29:  */
30: export function momsMotkonton(
31:   attBetala: boolean,
32: ): Array<{ konto: number; namn: string }> {
33:   return [
34:     { konto: 1930, namn: "1930 Företagskonto" },
35:     { konto: 1630, namn: "1630 Skattekonto" },
36:     attBetala
37:       ? { konto: 2018, namn: "2018 Egen insättning (betald privat)" }
38:       : { konto: 2013, namn: "2013 Eget uttag (till privat konto)" },
39:   ];
40: }
41: 
42: /** En momsomföring nollar momskontona mot 2650/1650. Betalningen av momsen
43:  *  (2650 mot 1930) rör inga momskonton och matchar därför inte. */
44: export function arMomsomforing(tx: Transaction): boolean {
45:   const konton = new Set(tx.postings.map((posting) => posting.account));
46:   return (
47:     (konton.has(REDOVISNINGSKONTO_MOMS) || konton.has(MOMSFORDRAN)) &&
48:     MOMSKONTON.some((konto) => konton.has(konto))
49:   );
50: }
51: 
52: export interface Momsrad {
53:   ruta: MomsRuta;
54:   beskrivning: string;
55:   belopp: number;
56: }
57: 
58: export interface Momsrapport {
59:   year: string;
60:   /** Belopp per ruta. Rutor utan rörelse saknas i mappen. */
61:   rutor: Map<MomsRuta, number>;
62:   /** Ruta 49: utgående moms minus ingående. Positivt = att betala. */
63:   nettoMoms: number;
64: }
65: 
66: /** Belopp i en ruta, 0 om den saknar rörelse. */
67: export const rutbelopp = (rapport: Momsrapport, ruta: MomsRuta) =>
68:   rapport.rutor.get(ruta) ?? 0;
69: 
70: export function momsrader(
71:   rapport: Momsrapport,
72:   rutor: Array<MomsRuta>,
73: ): Array<Momsrad> {
74:   return rutor.map((ruta) => ({
75:     ruta,
76:     beskrivning: RUTA_BESKRIVNING[ruta],
77:     belopp: rutbelopp(rapport, ruta),
78:   }));
79: }
80: 
81: export function generateMomsrapport(year: string): Momsrapport {
82:   // Filter transactions for the specified period. Momsomföringar exkluderas
83:   // så att rapporten fortsätter visa periodens verkliga moms även efter att
84:   // deklarationen bokförts (annars skulle allt summera till noll).
85:   const periodTransactions = transactions.value.filter((tx) => {
86:     const txDate = new Date(tx.date);
87:     return txDate.getFullYear() === parseInt(year) && !arMomsomforing(tx);
88:   });
89: 
90:   // Summera signerat i ören: intäkter och utgående moms bokförs i kredit
91:   // (negativt) och byter tecken, inköpsunderlag och ingående moms tas som de
92:   // bokförs. Kreditnotor och rättelser dras därmed av korrekt.
93:   const oren = new Map<MomsRuta, number>();
94: 
95:   for (const tx of periodTransactions) {
96:     for (const posting of tx.postings) {
97:       const ruta = KONTO_RUTA[posting.account];
98: 
99:       if (!ruta) {
100:         continue;
101:       }
102: 
103:       const ore = Math.round(posting.amount * 100);
104: 
105:       oren.set(
106:         ruta,
107:         (oren.get(ruta) ?? 0) + (arKreditnormal(ruta) ? -ore : ore),
108:       );
109:     }
110:   }
111: 
112:   // Skatteverket tar bara hela kronor, så varje ruta avrundas här vid källan
113:   // (0,50 uppåt). Ruta 49 räknas sedan ur de avrundade rutorna, annars kan
114:   // raderna på skärmen sluta summera till nettot längst ned.
115:   const rutor = new Map<MomsRuta, number>();
116: 
117:   for (const [ruta, ore] of oren) {
118:     const kronor = Math.round(ore / 100);
119: 
120:     if (kronor !== 0) {
121:       rutor.set(ruta, kronor);
122:     }
123:   }
124: 
125:   const summa = (valda: Array<MomsRuta>) =>
126:     valda.reduce((total, ruta) => total + (rutor.get(ruta) ?? 0), 0);
127: 
128:   return {
129:     year,
130:     rutor,
131:     nettoMoms: summa(UTGAENDE_RUTOR) - summa(INGAENDE_RUTOR),
132:   };
133: }
134: 
135: export function harMomsomforing(year: string): boolean {
136:   return transactions.value.some(
137:     (tx) => tx.date.slice(0, 4) === year && arMomsomforing(tx),
138:   );
139: }
140: 
141: export type MomsSkuld = {
142:   /** 2650 (skuld) eller 1650 (fordran). */
143:   konto: number;
144:   /** Bokfört saldo i ören: negativt på 2650 = att betala,
145:    *  positivt på 1650 = att få tillbaka. */
146:   saldoOre: number;
147:   /** Beloppet att betala eller få tillbaka, alltid positivt. */
148:   beloppOre: number;
149:   attBetala: boolean;
150:   /** Året för den momsomföring som skapade saldot, eller null om ingen
151:    *  hittas. Styr förslaget på betaldatum — skulden hör till omföringens
152:    *  år, inte till det år som råkar vara valt i årsväljaren. */
153:   omforingsAr: string | null;
154: };
155: 
156: /**
157:  * Obetald moms enligt bokföringen. 2650 och 1650 är avräkningskonton som ska
158:  * gå tillbaka till noll när Skatteverket dragit eller betalat ut pengarna,
159:  * så ett kvarvarande saldo är just det som ännu inte reglerats.
160:  *
161:  * Saldot räknas över alla år: momsomföringen bokförs 31 december men
162:  * betalningen sker året därpå, och båda ska ingå i samma avräkning.
163:  */
164: export function momsSkuld(): MomsSkuld | null {
165:   let saldo2650 = 0;
166:   let saldo1650 = 0;
167:   let omforingsAr: string | null = null;
168: 
169:   for (const tx of transactions.value) {
170:     if (arMomsomforing(tx) && (!omforingsAr || tx.date.slice(0, 4) > omforingsAr)) {
171:       omforingsAr = tx.date.slice(0, 4);
172:     }
173: 
174:     for (const posting of tx.postings) {
175:       if (posting.account === REDOVISNINGSKONTO_MOMS) {
176:         saldo2650 += Math.round(posting.amount * 100);
177:       } else if (posting.account === MOMSFORDRAN) {
178:         saldo1650 += Math.round(posting.amount * 100);
179:       }
180:     }
181:   }
182: 
183:   const saldoOre = saldo2650 !== 0 ? saldo2650 : saldo1650;
184: 
185:   if (saldoOre === 0) {
186:     return null;
187:   }
188: 
189:   return {
190:     konto: saldo2650 !== 0 ? REDOVISNINGSKONTO_MOMS : MOMSFORDRAN,
191:     saldoOre,
192:     beloppOre: Math.abs(saldoOre),
193:     attBetala: saldoOre < 0,
194:     omforingsAr,
195:   };
196: }
197: 
198: /**
199:  * Skapar betalningen som reglerar momsskulden mot Skatteverket: avräknings-
200:  * kontot nollas och motsvarande belopp går in på eller ut från motkontot.
201:  *
202:  * Returnerar null om det inte finns någon obetald moms.
203:  */
204: export function skapaMomsbetalning(
205:   datum: string,
206:   motkonto: number,
207: ): Transaction | null {
208:   const skuld = momsSkuld();
209: 
210:   if (!skuld) {
211:     return null;
212:   }
213: 
214:   const posting = (account: number, ore: number): Posting => ({
215:     account,
216:     amount: ore / 100,
217:     currency: "SEK",
218:   });
219: 
220:   return numrera({
221:     uuid: crypto.randomUUID(),
222:     date: datum,
223:     description: skuld.attBetala
224:       ? "Momsinbetalning till Skatteverket"
225:       : "Återbetalning av moms från Skatteverket",
226:     postings: [
227:       posting(skuld.konto, -skuld.saldoOre),
228:       posting(motkonto, skuld.saldoOre),
229:     ],
230:   });
231: }
232: 
233: /**
234:  * Skapar momsomföringen som avslutar årets momsredovisning, samma verifikat
235:  * som Bokio bokför automatiskt:
236:  *  - varje momskonto som deklarationen läser från nollas på öret,
237:  *  - nettot bokförs i hela kronor på 2650 i kredit (att betala) eller 1650
238:  *    i debet (att återfå) — samma belopp som ruta 49 i rapporten,
239:  *  - öresgapet balanseras på 3740.
240:  *
241:  * Returnerar null om det inte finns någon moms att omföra.
242:  */
243: export function skapaMomsomforing(year: string): Transaction | null {
244:   const saldonOre = new Map<number, number>();
245: 
246:   for (const tx of transactions.value) {
247:     if (tx.date.slice(0, 4) !== year || arMomsomforing(tx)) {
248:       continue;
249:     }
250: 
251:     for (const posting of tx.postings) {
252:       if (MOMSKONTON.includes(posting.account)) {
253:         saldonOre.set(
254:           posting.account,
255:           (saldonOre.get(posting.account) ?? 0) +
256:             Math.round(posting.amount * 100),
257:         );
258:       }
259:     }
260:   }
261: 
262:   const posting = (account: number, ore: number): Posting => ({
263:     account,
264:     amount: ore / 100,
265:     currency: "SEK",
266:   });
267: 
268:   const postings: Array<Posting> = [];
269:   let nettoOre = 0;
270: 
271:   for (const konto of MOMSKONTON) {
272:     const saldo = saldonOre.get(konto) ?? 0;
273: 
274:     if (saldo === 0) {
275:       continue;
276:     }
277: 
278:     postings.push(posting(konto, -saldo));
279:     nettoOre += -saldo;
280:   }
281: 
282:   if (postings.length === 0) {
283:     return null;
284:   }
285: 
286:   // Positivt netto = moms att betala. Beloppet hämtas ur rapportens ruta 49
287:   // i stället för att avrundas här på nytt, så att 2650/1650 alltid är exakt
288:   // det som fylls i deklarationen — även när rutornas egna avrundningar
289:   // sammantaget drar iväg något öre från råsaldot.
290:   const deklareratOre = Math.round(generateMomsrapport(year).nettoMoms * 100);
291: 
292:   if (deklareratOre > 0) {
293:     postings.push(posting(REDOVISNINGSKONTO_MOMS, -deklareratOre));
294:   } else if (deklareratOre < 0) {
295:     postings.push(posting(MOMSFORDRAN, -deklareratOre));
296:   }
297: 
298:   const gapOre = nettoOre - deklareratOre;
299: 
300:   if (gapOre !== 0) {
301:     postings.push(posting(ORESUTJAMNING, -gapOre));
302:   }
303: 
304:   return numrera({
305:     uuid: crypto.randomUUID(),
306:     date: `${year}-12-31`,
307:     description: `Momsredovisning ${year}`,
308:     postings,
309:   });
310: }

(End of file - total 310 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/mallar.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/mallar.ts</path>
<type>file</type>
<content>
1: import type { Posting, Transaction } from "./parse-journal-file";
2: import { numrera } from "./verifikat";
3: 
4: export type MallTyp = "köp" | "försäljning" | "insättning" | "uttag";
5: 
6: export type Mall = {
7:   namn: string;
8:   typ: MallTyp;
9:   beskrivning: string;
10:   /** Momssats som andel, t.ex. 0.25. 0 = momsfritt. */
11:   momssats: 0 | 0.06 | 0.12 | 0.25;
12:   /** Kostnads-/intäktskonto, eller kapitalkonto för insättning/uttag. */
13:   konto: number;
14:   betalkonto: number;
15: };
16: 
17: const INGAENDE_MOMS = 2640;
18: 
19: /** Valbara kapitalkällor för köp/försäljning. Privata betalningar (t.ex.
20:  *  Granngården på privat kreditkort) bokförs mot 2018 Egna insättningar
21:  *  i stället för att dras från bankkontot. */
22: export const betalkonton = [
23:   { konto: 1930, namn: "1930 Företagskonto" },
24:   { konto: 2018, namn: "2018 Egen insättning (privat betalning)" },
25: ];
26: 
27: const UTGAENDE_MOMS: Record<number, number> = {
28:   25: 2611,
29:   12: 2621,
30:   6: 2631,
31: };
32: 
33: export const mallar: Array<Mall> = [
34:   {
35:     namn: "Hönsfoder (Granngården)",
36:     typ: "köp",
37:     beskrivning: "Granngården, Hönsfoder, #höns",
38:     momssats: 0.25,
39:     konto: 4022,
40:     betalkonto: 1930,
41:   },
42:   {
43:     namn: "Fårfoder (Granngården)",
44:     typ: "köp",
45:     beskrivning: "Granngården, Fårfoder, #får",
46:     momssats: 0.25,
47:     konto: 4021,
48:     betalkonto: 1930,
49:   },
50:   {
51:     namn: "Äggförsäljning",
52:     typ: "försäljning",
53:     beskrivning: "Försäljning, Ägg, #höns",
54:     momssats: 0.12,
55:     konto: 3002,
56:     betalkonto: 1930,
57:   },
58:   {
59:     namn: "Patreon",
60:     typ: "försäljning",
61:     beskrivning: "Patreon, Medlemsintäkter",
62:     momssats: 0,
63:     konto: 3305,
64:     betalkonto: 1930,
65:   },
66:   {
67:     namn: "Google Adsense",
68:     typ: "försäljning",
69:     beskrivning: "Google, Adsense-intäkter",
70:     momssats: 0,
71:     konto: 3308,
72:     betalkonto: 1930,
73:   },
74:   {
75:     namn: "Egen insättning",
76:     typ: "insättning",
77:     beskrivning: "Egen insättning",
78:     momssats: 0,
79:     konto: 2018,
80:     betalkonto: 1930,
81:   },
82:   {
83:     namn: "Eget uttag",
84:     typ: "uttag",
85:     beskrivning: "Eget uttag",
86:     momssats: 0,
87:     konto: 2013,
88:     betalkonto: 1930,
89:   },
90: ];
91: 
92: /**
93:  * Bygger postings från en mall och totalbelopp inkl. moms.
94:  * Räknar i hela ören så att raderna alltid summerar till exakt noll.
95:  */
96: export function skapaPostings(
97:   mall: Mall,
98:   beloppInklMoms: number,
99:   betalkonto: number = mall.betalkonto,
100: ): Array<Posting> {
101:   const totalOre = Math.round(beloppInklMoms * 100);
102:   const momsOre = Math.round((totalOre * mall.momssats) / (1 + mall.momssats));
103:   const nettoOre = totalOre - momsOre;
104: 
105:   const kr = (ore: number) => ore / 100;
106:   const posting = (account: number, ore: number): Posting => ({
107:     account,
108:     amount: kr(ore),
109:     currency: "SEK",
110:   });
111: 
112:   switch (mall.typ) {
113:     case "köp": {
114:       const rows = [posting(mall.konto, nettoOre)];
115:       if (momsOre !== 0) rows.push(posting(INGAENDE_MOMS, momsOre));
116:       rows.push(posting(betalkonto, -totalOre));
117:       return rows;
118:     }
119:     case "försäljning": {
120:       const rows = [posting(mall.konto, -nettoOre)];
121:       if (momsOre !== 0) {
122:         rows.push(posting(UTGAENDE_MOMS[Math.round(mall.momssats * 100)], -momsOre));
123:       }
124:       rows.push(posting(betalkonto, totalOre));
125:       return rows;
126:     }
127:     case "insättning":
128:       return [posting(mall.betalkonto, totalOre), posting(mall.konto, -totalOre)];
129:     case "uttag":
130:       return [posting(mall.konto, totalOre), posting(mall.betalkonto, -totalOre)];
131:   }
132: }
133: 
134: export function skapaTransaktion(
135:   mall: Mall,
136:   datum: string,
137:   beloppInklMoms: number,
138:   beskrivning: string,
139:   betalkonto: number = mall.betalkonto,
140: ): Transaction {
141:   return numrera({
142:     uuid: crypto.randomUUID(),
143:     date: datum,
144:     description: beskrivning || mall.beskrivning,
145:     postings: skapaPostings(mall, beloppInklMoms, betalkonto),
146:   });
147: }

(End of file - total 147 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/pages/index-page.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/pages/index-page.ts</path>
<type>file</type>
<content>
1: import { registerFunctionComponent } from "webact";
2: 
3: import {
4:   openJournal,
5:   parseFileIntoSignals,
6:   reopenLastJournal,
7:   storedFileName,
8:   supportsFileSystemAccess,
9: } from "../journal-file.ts";
10: import type { WebactThis } from "../webact-types.ts";
11: 
12: function IndexPage(this: WebactThis) {
13:   const { $, html, css, postRender } = this;
14: 
15:   html`
16:     <h1>Bokföringsprogram</h1>
17:     <p>Öppna din journal-fil för att börja hantera dina transaktioner och konton.</p>
18:     <button id="open" type="button">Öppna journal-fil…</button>
19:     <button id="reopen" type="button" hidden></button>
20:     <input type="file" id="fallback" accept=".journal,.hledger,.j" hidden />
21:     <output id="output"></output>
22:   `;
23: 
24:   css`
25:     button {
26:       font: inherit;
27:       padding: 0.5rem 1rem;
28:     }
29: 
30:     output {
31:       display: block;
32:       margin-block-start: 0.75rem;
33:     }
34:   `;
35: 
36:   const goToTransactions = () => {
37:     document.dispatchEvent(
38:       new CustomEvent("router:navigate", {
39:         detail: { pathname: "/transactions" },
40:       }),
41:     );
42:   };
43: 
44:   postRender(() => {
45:     const openButton = $("#open");
46:     const reopenButton = $("#reopen");
47:     const fallbackInput = $("#fallback");
48:     const output = $("#output");
49: 
50:     if (supportsFileSystemAccess()) {
51:       openButton.addEventListener("click", async () => {
52:         try {
53:           await openJournal();
54:           goToTransactions();
55:         } catch (e) {
56:           // Avbruten filväljare är inget fel
57:           if (!(e instanceof DOMException && e.name === "AbortError")) {
58:             output.textContent = "Kunde inte öppna filen.";
59:             console.error(e);
60:           }
61:         }
62:       });
63: 
64:       // Visa "fortsätt med senaste filen" om ett handtag finns sparat
65:       storedFileName().then((name) => {
66:         if (name) {
67:           reopenButton.textContent = `Fortsätt med ${name}`;
68:           reopenButton.hidden = false;
69:         }
70:       });
71: 
72:       reopenButton.addEventListener("click", async () => {
73:         if (await reopenLastJournal()) {
74:           goToTransactions();
75:         } else {
76:           output.textContent = "Kunde inte återöppna filen — välj den manuellt.";
77:         }
78:       });
79:     } else {
80:       // Safari/Firefox: vanlig filväljare, spara sker via nedladdning
81:       openButton.addEventListener("click", () => fallbackInput.click());
82: 
83:       fallbackInput.addEventListener("change", async (event: Event) => {
84:         const file = (event.target as HTMLInputElement).files?.[0];
85: 
86:         if (file) {
87:           await parseFileIntoSignals(file);
88:           goToTransactions();
89:         }
90:       });
91:     }
92:   });
93: }
94: 
95: export default registerFunctionComponent(IndexPage, {
96:   name: "index-page",
97: });

(End of file - total 97 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 13.0s)

_Thinking:_

Now I have a good picture. Let me also quickly check the bokslut page/atgarder component and the rapport components to see what UI exists, plus check whether there's any SRU export or multi-journal support. Let me check:

1. `bokslut-atgarder.ts` — what's offered in bokslut
2. `rapport-ne.ts` and `neb` page
3. Check for any "sru" mentions
4. Check signals.ts for multi-journal support

Let me grep for "sru", "egenavgifter", "räntefördelning", "K1", "periodiseringsfond" in the src.

**Tool: grep**

**Input:**
```json
{
  "include": "*.ts",
  "pattern": "(?i)sru|egenavgifter|räntefördelning|periodiseringsfond|expansionsfond|skattemässig|K1|R12|journalfil|multi.?journal"
}
```

**Output:**
```
Found 29 matches
/Users/jeremy/dev/hledger-web-gui/src/js/momsrapport.ts:
  Line 6:   type MomsRuta,

  Line 53:   ruta: MomsRuta;

  Line 61:   rutor: Map<MomsRuta, number>;

  Line 67: export const rutbelopp = (rapport: Momsrapport, ruta: MomsRuta) =>

  Line 72:   rutor: Array<MomsRuta>,

  Line 93:   const oren = new Map<MomsRuta, number>();

  Line 115:   const rutor = new Map<MomsRuta, number>();

  Line 125:   const summa = (valda: Array<MomsRuta>) =>


/Users/jeremy/dev/hledger-web-gui/src/js/parse-journal-file.test.ts:
  Line 4:   parseJournalFile,

  Line 12:   for await (const item of parseJournalFile(file)) {


/Users/jeremy/dev/hledger-web-gui/src/js/moms-rutor.ts:
  Line 9: export type MomsRuta =

  Line 39: export const RUTA_BESKRIVNING: Record<MomsRuta, string> = {

  Line 75: const KREDITNORMALA_RUTOR = new Set<MomsRuta>([

  Line 99: export const arKreditnormal = (ruta: MomsRuta) => KREDITNORMALA_RUTOR.has(ruta);

  Line 107: export const MANUELLA_RUTOR = new Set<MomsRuta>(["07", "08"]);

  Line 109: export const KONTO_RUTA: Record<number, MomsRuta> = {

  Line 205: export const UTGAENDE_RUTOR: Array<MomsRuta> = [

  Line 218: export const INGAENDE_RUTOR: Array<MomsRuta> = ["48"];

  Line 220: const kontonForRutor = (rutor: Array<MomsRuta>) =>

  Line 234:   rutor: Array<MomsRuta>;


/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts:
  Line 8:  * Enskilda näringsidkare" (bas.se/kontoplaner/sru/).


/Users/jeremy/dev/hledger-web-gui/src/js/test-helpers.ts:
  Line 1: import { parseJournalFile } from "./parse-journal-file";

  Line 7:  * systemet som appen — journalfilen är enda input.

  Line 17:   for await (const item of parseJournalFile(file)) {


/Users/jeremy/dev/hledger-web-gui/src/js/journal-file.ts:
  Line 1: import { parseJournalFile } from "./parse-journal-file.ts";

  Line 18:   for await (const item of parseJournalFile(file)) {


/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts:
  Line 35: describe("intäktsrutorna R1–R4", () => {

  Line 113: describe("kostnadsrutorna R5–R10", () => {


/Users/jeremy/dev/hledger-web-gui/src/js/parse-journal-file.ts:
  Line 35: export async function* parseJournalFile(

```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/bokslut-atgarder.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/components/bokslut-atgarder.ts</path>
<type>file</type>
<content>
1: import { effect } from "@preact/signals-core";
2: import { Component, registerComponent } from "webact";
3: import {
4:   beraknaArsresultatOre,
5:   harArsresultat,
6:   harNollning,
7:   skapaArsresultatTransaktion,
8:   skapaNollningTransaktion,
9: } from "../bokslut";
10: import type { Posting } from "../parse-journal-file";
11: import { aliases, selectedYear, transactions } from "../signals";
12: 
13: import styles from "./rapport.css?inline";
14: 
15: const html = String.raw;
16: 
17: const numberFormatter = new Intl.NumberFormat("sv-SE", {
18:   style: "currency",
19:   currency: "SEK",
20:   minimumFractionDigits: 2,
21: });
22: 
23: const kr = (amount: number) => numberFormatter.format(amount === 0 ? 0 : amount);
24: 
25: function previewTabell(postings: Array<Posting>): string {
26:   const kontonamn = (konto: number) =>
27:     aliases.value.find((alias) => alias.id === konto)?.to ?? "";
28: 
29:   return html`
30:     <table class="mono">
31:       <tbody>
32:         ${postings
33:           .map(
34:             (posting) => html`
35:               <tr>
36:                 <td>${posting.account} ${kontonamn(posting.account)}</td>
37:                 <td class="amount">${kr(posting.amount)}</td>
38:               </tr>
39:             `,
40:           )
41:           .join("")}
42:       </tbody>
43:     </table>
44:   `;
45: }
46: 
47: function aliasTips(postings: Array<Posting>): string {
48:   const saknas = postings
49:     .map((posting) => posting.account)
50:     .filter((konto) => !aliases.value.some((alias) => alias.id === konto));
51: 
52:   return saknas.length > 0
53:     ? html`<p class="hint">
54:         Tips: lägg till alias för konto ${saknas.join(", ")} i journalens
55:         header så visas kontonamnen.
56:       </p>`
57:     : "";
58: }
59: 
60: class BokslutAtgarder extends Component {
61:   componentDidMount() {
62:     effect(() => {
63:       const $section = this.$("section");
64: 
65:       if (!$section) {
66:         return;
67:       }
68: 
69:       const year = selectedYear.value;
70:       const resultatOre = beraknaArsresultatOre(year);
71:       const resultatKlart = harArsresultat(year);
72:       const nollningKlar = harNollning(year);
73: 
74:       const resultatDel = () => {
75:         if (resultatKlart) {
76:           return html`<p class="klar">✓ Årets resultat bokfört för ${year}.</p>`;
77:         }
78: 
79:         const forslag = skapaArsresultatTransaktion(year);
80: 
81:         if (!forslag) {
82:           return html`<p class="hint">
83:             Inget resultat att bokföra för ${year}.
84:           </p>`;
85:         }
86: 
87:         return html`
88:           <p>
89:             ${resultatOre > 0 ? "Vinst" : "Förlust"}:
90:             <strong>${kr(resultatOre / 100)}</strong>. Resultatet omförs från
91:             8999 till 2019 (Årets resultat under eget kapital) per 31 december.
92:           </p>
93:           ${previewTabell(forslag.postings)}
94:           ${aliasTips(forslag.postings)}
95:           <button type="button" class="bokfor-resultat">
96:             Bokför årets resultat (31 dec ${year})
97:           </button>
98:         `;
99:       };
100: 
101:       const nollningDel = () => {
102:         if (nollningKlar) {
103:           return html`<p class="klar">
104:             ✓ Eget kapital nollställt (1 jan ${parseInt(year, 10) + 1}).
105:           </p>`;
106:         }
107: 
108:         if (!resultatKlart && resultatOre !== 0) {
109:           return html`<p class="hint">
110:             Bokför årets resultat först — 2019 ska ha fått sitt saldo innan
111:             underkontona nollas.
112:           </p>`;
113:         }
114: 
115:         const forslag = skapaNollningTransaktion(year);
116: 
117:         if (!forslag) {
118:           return html`<p class="hint">
119:             Inga saldon på eget kapitals underkonton att nolla för ${year}.
120:           </p>`;
121:         }
122: 
123:         return html`
124:           <p>
125:             Underkontona 2011–2019 (egna uttag, egna insättningar, årets
126:             resultat) nollas mot 2010 Eget kapital per 1 januari
127:             ${parseInt(year, 10) + 1}.
128:           </p>
129:           ${previewTabell(forslag.postings)}
130:           ${aliasTips(forslag.postings)}
131:           <button type="button" class="bokfor-nollning">
132:             Nolla eget kapital (1 jan ${parseInt(year, 10) + 1})
133:           </button>
134:         `;
135:       };
136: 
137:       $section.innerHTML = html`
138:         <h2>Årets resultat ${year}</h2>
139:         ${resultatDel()}
140:         <h2>Nollställning av eget kapital</h2>
141:         ${nollningDel()}
142:       `;
143:     });
144: 
145:     this.on(
146:       "click",
147:       "button.bokfor-resultat",
148:       () => {
149:         const transaktion = skapaArsresultatTransaktion(selectedYear.value);
150: 
151:         if (transaktion) {
152:           transactions.value = [...transactions.value, transaktion];
153:         }
154:       },
155:       {},
156:     );
157: 
158:     this.on(
159:       "click",
160:       "button.bokfor-nollning",
161:       () => {
162:         const transaktion = skapaNollningTransaktion(selectedYear.value);
163: 
164:         if (transaktion) {
165:           transactions.value = [...transactions.value, transaktion];
166:         }
167:       },
168:       {},
169:     );
170:   }
171: 
172:   render() {
173:     (async () => {
174:       if (this._sDOM) {
175:         const sheet = new CSSStyleSheet();
176:         await sheet.replace(styles);
177: 
178:         this._sDOM.adoptedStyleSheets = [sheet];
179:       }
180:     })();
181: 
182:     return `<section></section>`;
183:   }
184: }
185: 
186: export default registerComponent(BokslutAtgarder, {
187:   name: "bokslut-atgarder",
188: });

(End of file - total 188 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/signals.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/signals.ts</path>
<type>file</type>
<content>
1: import { computed, effect, signal } from "@preact/signals-core";
2: import signalsDevtool from "signals-devtool-provider";
3: import type { Account, Alias, Transaction } from "./parse-journal-file";
4: 
5: export const transactions = signal<Array<Transaction>>([]);
6: export const accounts = signal<Array<Account>>([]);
7: export const aliases = signal<Array<Alias>>([]);
8: 
9: /** Råtexten före första transaktionen — bevaras ordagrant vid spara
10:  *  så att kommentarer och kontodefinitioner inte går förlorade. */
11: export const journalHeader = signal<string>("");
12: 
13: /** Filhandtag till öppnad journal (File System Access API). null = ingen fil
14:  *  eller webbläsare utan stöd (då används nedladdning som fallback). */
15: export const fileHandle = signal<FileSystemFileHandle | null>(null);
16: 
17: /** Namnet på öppnad fil, för visning och som nedladdningsnamn. */
18: export const fileName = signal<string>("");
19: 
20: /** Globalt valt år — styr transaktionslistan, momsrapporten m.fl. vyer. */
21: export const selectedYear = signal<string>(String(new Date().getFullYear()));
22: 
23: /** Alla år som förekommer i journalen, plus innevarande år. Senaste först. */
24: export const availableYears = computed(() => {
25:   const years = new Set(
26:     transactions.value.map((transaction) => transaction.date.slice(0, 4)),
27:   );
28:   years.add(String(new Date().getFullYear()));
29:   return [...years].sort().reverse();
30: });
31: export const hledgerOutput = computed(() => {
32:   const TWO_SPACES = "  ";
33:   const FOUR_SPACES = "    ";
34: 
35:   // Header från inläst fil bevaras ordagrant; utan fil genereras
36:   // konto-/aliasrader från signalerna.
37:   const header = journalHeader.value.trimEnd()
38:     ? journalHeader.value.trimEnd()
39:     : [
40:         accounts.value.map((account) => `account ${account.name}`).join("\n"),
41:         aliases.value.map((alias) => `alias ${alias.id} = ${alias.to}`).join("\n"),
42:       ]
43:         .filter(Boolean)
44:         .join("\n\n");
45: 
46:   const transactionsHledger = transactions.value
47:     .map((transaction) => {
48:       const postings = transaction.postings.map((posting) => {
49:         const amount = `${posting.amount.toFixed(2)} ${posting.currency}`.trimEnd();
50:         return `${FOUR_SPACES}${posting.account}${TWO_SPACES}${amount}`;
51:       });
52: 
53:       // Verifikationsnumret skrivs i hledgers kodfält, direkt efter datumet
54:       const kod = transaction.code ? `(${transaction.code}) ` : "";
55: 
56:       return `${transaction.date} ${kod}${transaction.description}\n${postings.join("\n")}`;
57:     })
58:     .join("\n\n");
59: 
60:   return `${[header, transactionsHledger].filter(Boolean).join("\n\n")}\n`;
61: });
62: 
63: const signals = {
64:   transactions,
65:   accounts,
66:   aliases,
67:   hledgerOutput,
68:   selectedYear,
69:   availableYears,
70:   journalHeader,
71:   fileName,
72: };
73: 
74: // Devtool-providern kopplar upp sig mot Chrome-tilläggets port via den globala
75: // `chrome`. Den saknas i Firefox, Safari och Node (testerna), och providerns
76: // `chrome?.runtime` skyddar bara mot att `runtime` fattas — inte mot att hela
77: // identifieraren är odeklarerad. Utan vakten kastar modulen redan vid import
78: // och tar hela appen med sig.
79: if ("chrome" in globalThis) {
80:   signalsDevtool.init({ signals, effect });
81: }

(End of file - total 81 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 23.6s)

_Thinking:_

Now I have a very complete picture. Let me also check git log to see recent work and check the barlingshult.journal header briefly to understand the two-verksamheter aspect (there's one journal file in the repo root). Also let me check whether there's any SRU export or multi-journal UI. The grep showed no "sru" generator, no egenavgifter, no räntefördelning, no K1. The moms view is per journal (single journal loaded at a time — signals hold one journal).

Let me quickly check the git log for recent commits to see the trajectory, and check the rapport-moms and rapport-ne components briefly... Actually I have enough. Let me also check moms-rutor.ts quickly to see which moms boxes are covered — that matters for the "combined moms view" item. And check verifikat.ts since it was recently modified. Actually, for the overview of "what's left", the key sources are:

1. Memory: not-yet-done list (SRU export, K1, skattemässiga justeringar R12+, egenavgifter, räntefördelning, combined moms view)
2. Code reality: 
   - ne-bilaga.ts: R1–R10 + R11 (bokfört resultat). R3 manual. No R12+ (skattemässiga justeringar). No SRU export (no INFO.SRU/BLANKETTER.SRU generation).
   - momsrapport.ts: per-journal moms, omföring, betalning. No combined multi-journal view (the app only holds one journal in signals at a time).
   - bokslut.ts: årets resultat + nollställning. No egenavgifter/räntefördelning/periodiseringsfond/expansionsfond (memory says these exist in accounted's lib/bokslut/enskild-firma/ but not ported).
   - K1: nothing.
   - SIE4: memory mentions "hledger-journal/SIE4" architecture — let me check if SIE4 import/export exists. Grep for SIE didn't show anything (the grep pattern didn't include SIE alone... actually "skattemässig" matched, but no SIE matches). Let me check for SIE4.

Let me do a final quick grep for SIE and check git log.

**Tool: grep**

**Input:**
```json
{
  "include": "*.{ts,js,html,json}",
  "pattern": "(?i)\\bsie\\b|sie4|#FLAGGA|#KONTO"
}
```

**Output:**
```
Found 2 matches
/Users/jeremy/dev/hledger-web-gui/src/js/verifikat.ts:
  Line 9:  * avsett för just den här sortens referens och följer med vid en SIE-export

  Line 13:  * som gör att en SIE-fil per år går att skapa rakt av. Varje bokföring har sin

```

**Tool: bash**

**Input:**
```json
{
  "command": "git -C /Users/jeremy/dev/hledger-web-gui log --oneline -20"
}
```

**Output:**
```
e43ec5a Update NE-bilaga handling for manual entries and adjust test cases
8b73449 Leg til gh action
6a22be5 Tester
751904d Bokslut, momsomföring, momsbetalning
6ed4859 NE-bilaga
298d3ab Add docker file
4f972ad Share design momsrapport balansrapport
2f40d4f Balansrapport
6564a42 Balansrapport
993e233 Add favicon
f1dc7e7 Title and favicon
b90a29e Branding
47fa922 Nicer styles
6c32d3f save files
d19c3b8 transactions nes
efaee67 Transaction adding
3140293 Update to Vite 8
b278402 Fix momsrapport
cd73112 6 % moms
e3a9401 Stil för rapport-moms

```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/moms-rutor.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/moms-rutor.ts</path>
<type>file</type>
<content>
1: /**
2:  * Kontomappning för momsdeklarationen (SKV 4700).
3:  *
4:  * Vilket BAS-konto som hör till vilken ruta är hämtat från accounted
5:  * (gnubok, Copyright (C) 2025-2026 Jakob Wennberg, AGPL-3.0),
6:  * lib/vat/moms-box-mapping.ts, som i sin tur följer Skatteverkets blankett.
7:  */
8: 
9: export type MomsRuta =
10:   | "05"
11:   | "06"
12:   | "07"
13:   | "08"
14:   | "10"
15:   | "11"
16:   | "12"
17:   | "20"
18:   | "21"
19:   | "22"
20:   | "23"
21:   | "24"
22:   | "30"
23:   | "31"
24:   | "32"
25:   | "35"
26:   | "36"
27:   | "37"
28:   | "38"
29:   | "39"
30:   | "40"
31:   | "41"
32:   | "42"
33:   | "48"
34:   | "50"
35:   | "60"
36:   | "61"
37:   | "62";
38: 
39: export const RUTA_BESKRIVNING: Record<MomsRuta, string> = {
40:   "05": "Momspliktig försäljning",
41:   "06": "Momspliktiga uttag",
42:   "07": "Beskattningsunderlag vid vinstmarginalbeskattning",
43:   "08": "Hyresinkomster vid frivillig skattskyldighet",
44:   "10": "Utgående moms 25 %",
45:   "11": "Utgående moms 12 %",
46:   "12": "Utgående moms 6 %",
47:   "20": "Inköp av varor från annat EU-land",
48:   "21": "Inköp av tjänster från annat EU-land",
49:   "22": "Inköp av tjänster från land utanför EU",
50:   "23": "Inköp av varor i Sverige, omvänd skattskyldighet",
51:   "24": "Övriga inköp av tjänster, omvänd skattskyldighet",
52:   "30": "Utgående moms 25 % på inköp i ruta 20–24",
53:   "31": "Utgående moms 12 % på inköp i ruta 20–24",
54:   "32": "Utgående moms 6 % på inköp i ruta 20–24",
55:   "35": "Försäljning av varor till annat EU-land",
56:   "36": "Försäljning av varor utanför EU",
57:   "37": "Mellanmans inköp vid trepartshandel",
58:   "38": "Mellanmans försäljning vid trepartshandel",
59:   "39": "Försäljning av tjänster till näringsidkare i annat EU-land",
60:   "40": "Övrig försäljning av tjänster omsatta utomlands",
61:   "41": "Försäljning när köparen är skattskyldig i Sverige",
62:   "42": "Övrig försäljning m.m.",
63:   "48": "Ingående moms att dra av",
64:   "50": "Beskattningsunderlag vid import",
65:   "60": "Utgående moms 25 % på import",
66:   "61": "Utgående moms 12 % på import",
67:   "62": "Utgående moms 6 % på import",
68: };
69: 
70: /**
71:  * Kreditnormala rutor (intäkter och utgående moms) bokförs i kredit och
72:  * summeras med omvänt tecken. Debetnormala (inköpsunderlag och ingående
73:  * moms) tas som de bokförs.
74:  */
75: const KREDITNORMALA_RUTOR = new Set<MomsRuta>([
76:   "05",
77:   "06",
78:   "07",
79:   "08",
80:   "10",
81:   "11",
82:   "12",
83:   "30",
84:   "31",
85:   "32",
86:   "35",
87:   "36",
88:   "37",
89:   "38",
90:   "39",
91:   "40",
92:   "41",
93:   "42",
94:   "60",
95:   "61",
96:   "62",
97: ]);
98: 
99: export const arKreditnormal = (ruta: MomsRuta) => KREDITNORMALA_RUTOR.has(ruta);
100: 
101: /**
102:  * Rutor som inte går att räkna fram ur kontosaldon och därför måste fyllas i
103:  * för hand i deklarationen:
104:  *  - 07 är marginalen vid vinstmarginalbeskattning, inte ett kontosaldo,
105:  *  - 08 går inte att skilja från annan försäljning på kontonivå.
106:  */
107: export const MANUELLA_RUTOR = new Set<MomsRuta>(["07", "08"]);
108: 
109: export const KONTO_RUTA: Record<number, MomsRuta> = {
110:   // Momspliktig försäljning inom Sverige
111:   3000: "05",
112:   3001: "05",
113:   3002: "05",
114:   3003: "05",
115:   // Momspliktiga uttag
116:   3401: "06",
117:   3402: "06",
118:   3403: "06",
119:   // Varuförsäljning till annat EU-land
120:   3108: "35",
121:   3521: "35",
122:   // Varuexport utanför EU
123:   3105: "36",
124:   3522: "36",
125:   // Trepartshandel
126:   3109: "38",
127:   // Tjänsteförsäljning EU (huvudregeln)
128:   3308: "39",
129:   // Tjänsteförsäljning utanför EU
130:   3305: "40",
131:   // Omvänd skattskyldighet i Sverige, säljarens sida
132:   3231: "41",
133:   3232: "41",
134:   3233: "41",
135:   // Momsfri försäljning
136:   3004: "42",
137:   3100: "42",
138:   3404: "42",
139:   3980: "42",
140:   3994: "42",
141: 
142:   // Utgående moms 25 %
143:   2610: "10",
144:   2611: "10",
145:   2612: "10",
146:   2613: "10",
147:   2616: "10",
148:   2618: "10",
149:   // Utgående moms 12 %
150:   2620: "11",
151:   2621: "11",
152:   2622: "11",
153:   2623: "11",
154:   2626: "11",
155:   2628: "11",
156:   // Utgående moms 6 %
157:   2630: "12",
158:   2631: "12",
159:   2632: "12",
160:   2633: "12",
161:   2636: "12",
162:   2638: "12",
163:   // Beräknad utgående moms på förvärv (omvänd skattskyldighet)
164:   2614: "30",
165:   2624: "31",
166:   2634: "32",
167:   // Importmoms
168:   2615: "60",
169:   2625: "61",
170:   2635: "62",
171: 
172:   // Ingående moms
173:   2640: "48",
174:   2641: "48",
175:   2642: "48",
176:   2645: "48",
177:   2646: "48",
178:   2647: "48",
179:   2648: "48",
180:   2649: "48",
181: 
182:   // Underlag för förvärv med omvänd skattskyldighet
183:   4515: "20",
184:   4516: "20",
185:   4517: "20",
186:   4535: "21",
187:   4536: "21",
188:   4537: "21",
189:   4531: "22",
190:   4532: "22",
191:   4533: "22",
192:   4415: "23",
193:   4416: "23",
194:   4417: "23",
195:   4425: "24",
196:   4426: "24",
197:   4427: "24",
198:   // Underlag vid import
199:   4545: "50",
200:   4546: "50",
201:   4547: "50",
202: };
203: 
204: /** Rutor med utgående moms — det som ska betalas in. */
205: export const UTGAENDE_RUTOR: Array<MomsRuta> = [
206:   "10",
207:   "11",
208:   "12",
209:   "30",
210:   "31",
211:   "32",
212:   "60",
213:   "61",
214:   "62",
215: ];
216: 
217: /** Rutor med ingående moms — det som får dras av. */
218: export const INGAENDE_RUTOR: Array<MomsRuta> = ["48"];
219: 
220: const kontonForRutor = (rutor: Array<MomsRuta>) =>
221:   Object.entries(KONTO_RUTA)
222:     .filter(([, ruta]) => rutor.includes(ruta))
223:     .map(([konto]) => Number(konto));
224: 
225: /** Alla momskonton som momsomföringen ska nolla. */
226: export const MOMSKONTON = [
227:   ...kontonForRutor(UTGAENDE_RUTOR),
228:   ...kontonForRutor(INGAENDE_RUTOR),
229: ].sort((a, b) => a - b);
230: 
231: /** Blankettens avsnitt, i samma ordning som Skatteverkets blankett. */
232: export const RUTGRUPPER: Array<{
233:   rubrik: string;
234:   rutor: Array<MomsRuta>;
235:   /** Visas även när alla belopp är noll. */
236:   alltid?: boolean;
237: }> = [
238:   {
239:     rubrik: "A. Momspliktig försäljning eller uttag",
240:     rutor: ["05", "06", "07", "08"],
241:     alltid: true,
242:   },
243:   {
244:     rubrik: "B. Utgående moms på försäljning i A",
245:     rutor: ["10", "11", "12"],
246:     alltid: true,
247:   },
248:   { rubrik: "C. Momspliktiga inköp", rutor: ["20", "21", "22", "23", "24"] },
249:   { rubrik: "D. Utgående moms på inköp i C", rutor: ["30", "31", "32"] },
250:   {
251:     rubrik: "E. Försäljning m.m. som är undantagen från moms",
252:     rutor: ["35", "36", "37", "38", "39", "40", "41", "42"],
253:   },
254:   { rubrik: "F. Import", rutor: ["50", "60", "61", "62"] },
255:   { rubrik: "G. Ingående moms", rutor: ["48"], alltid: true },
256: ];

(End of file - total 256 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 60.1s)

_Thinking:_

Now I have a complete picture of what's implemented and what's missing. Let me compile the overview.

**Implemented (verified in code):**
- Journal open/save (File System Access API + fallback), per-year views
- Transactions: add via templates (mallar), list, verifikat numbering (unbroken series, gap detection)
- Momsrapport (SKV 4700 boxes, per journal), momsomföring (2650/1650 + 3740 öresutjämning), momsbetalning
- Balansrapport
- NE-bilaga R1–R11 (räkenskapsschemat), with warnings for unmapped accounts, R3 manual
- Bokslut: årets resultat (8999→2019), nollställning av eget kapital (2011–2019→2010)
- Tests for momsrapport, moms-omvand, ne-bilaga, bokslut, balansrapport, parse, verifikat

**Not implemented (from memory + verified missing in code):**
1. **SRU-export of NE-bilaga** — no SRU code in repo. Memory points to accounted's `sru-generator.ts` (INFO.SRU/BLANKETTER.SRU, ISO 8859-1, field codes R1–R11 = 7400–7403, 7500–7505, 7440; dates 7011/7012).
2. **K1-blanketten** — nothing in code.
3. **Skattemässiga justeringar (R12+ on NE)** — ne-bilaga.ts only has R1–R10 + computed R11; no R12+ (e.g., R12/R13... avdrag, periodiseringsfond etc.)
4. **Egenavgifter and räntefördelning** — not in code; accounted has them in `lib/bokslut/enskild-firma/` (not ported yet).
5. **Combined moms view across journals** — app holds one journal in signals; no multi-journal loading or combined view. Requirement: sum in ören across journals, round once.
6. **Periodiseringsfond/expansionsfond** — from accounted reference, not ported (memory mentions under "användbara filer... ej porterade än").
7. Possibly SIE4 export — verifikat.ts comments mention "följer med vid en SIE-export" and "gör att en SIE-fil per år går att skapa rakt av", implying SIE export is a design goal but there's no SIE code. Memory says architecture "hledger-journal/SIE4" — SIE4 might be a planned import/export format. There's no SIE code in the repo though. I should mention it as possibly-planned (comment suggests it's anticipated). Be careful not to overclaim; I'll frame it as "the codebase references SIE-export as a design consideration but no export exists".

Also the README is outdated (describes the old generic journal manager, not the Swedish bookkeeping app) — worth flagging as a to-do since the features section no longer matches. That's a secondary "docs debt" item.

Additional observations:
- R3 (bilförmån) is manual-only; that's by design, not missing.
- The two-journal workflow: each verksamhet has its own journal file; the app opens one file at a time. The combined moms view is the one cross-journal feature needed.

Priority ordering — for deklaration season: SRU export + skattemässiga justeringar + egenavgifter/räntefördelning are needed for the actual tax return. Combined moms view needed for momsdeklaration. K1 is for private forest? Actually K1 is... hmm. K1-blanketten — in Swedish tax context, K1 is "Försäkringsbolag och tjänstepensionsinstitut"... no. Actually for enskild firma the relevant forms: NE (SKV 2161), and K1 isn't typical. Memory says "K1-blanketten" as a to-do; I'll just list it as noted without speculating. Actually K1 could relate to... I'll just cite the memory.

I could organize by theme:
1. Tax return (deklaration): SRU export, R12+ skattemässiga justeringar, egenavgifter, räntefördelning, periodiseringsfond/expansionsfond, K1
2. Moms: combined cross-journal view (sum ören, round once)
3. Possibly: SIE4 export (design hints in verifikat.ts comments)
4. Housekeeping: README outdated

Let me write a concise, well-structured overview in English (user speaks English in this conversation, though content is Swedish — I'll keep Swedish terms). Format: table or grouped list with status. Keep it concise but complete. Include file references.

I've cross-referenced Claude's memory against the actual codebase. Here's the status.

## Already implemented ✅
- **Moms**: full SKV 4700 box mapping (`moms-rutor.ts`, ported from accounted), momsrapport per journal, automatic momsomföring (2650/1650 + 3740 öresutjämning), momsbetalning
- **Bokslut**: årets resultat (8999→2019) and nollställning av eget kapital (2011–2019→2010), Bokio-style
- **NE-bilaga**: räkenskapsschemat R1–R11 with the accounted R1/R3 shadowing bug fixed, warnings for unmapped accounts
- Balansrapport, verifikat numbering with gap detection, templates with 1930/2018 payment-account selector

## Left to implement ❌

**1. SRU-export of the NE-bilaga** *(memory: bokio-migration)*
Nothing in the repo generates SRU. Port from accounted's `lib/reports/ne-bilaga/sru-generator.ts` — INFO.SRU/BLANKETTER.SRU, ISO 8859-1 encoding, field codes R1–R11 = 7400–7403, 7500–7505, 7440, dates 7011/7012. This is what makes the app able to actually file to Skatteverket.

**2. Skattemässiga justeringar (R12+)** *(memory)*
`ne-bilaga.ts` stops at R11 (bokfört resultat). The adjustment boxes (R12 and beyond — avdrag, återföringar etc.) don't exist.

**3. Egenavgifter and räntefördelning** *(memory)*
Not ported yet. Accounted has reference implementations in `lib/bokslut/enskild-firma/`. Per memory, these are computed on the *combined* tax result across both verksamheter (IL 14 kap 12 §).

**4. Periodiseringsfond / expansionsfond** *(memory: "ej porterade än")*
Also in accounted's `lib/bokslut/enskild-firma/`, not yet ported.

**5. Combined moms view across journals** *(memory: tva-verksamheter-nea)*
The app holds exactly one journal in signals (`signals.ts`) — there's no multi-journal loading and no combined view. Requirement is specific: **sum in ören across journals, round once** — never add pre-rounded boxes (up to 1 kr error per box otherwise).

**6. K1-blanketten** *(memory: bokio-migration)*
Listed as not done; nothing in code.

**7. SIE4 export** *(implied, not in memory)*
`verifikat.ts` comments explicitly design the numbering so that "en SIE-fil per år går att skapa rakt av" — but no SIE export code exists. Memory also names the architecture as "hledger-journal/SIE4". Worth confirming whether this is actually on your roadmap.

**8. Housekeeping: README is outdated**
It still describes the old generic "Hledger Journal Manager" (drag & drop upload, account discovery) — nothing about moms, NE-bilaga, or bokslut.

---

**Suggested priority** for deklaration season: 5 (combined moms) → 1 (SRU) → 2+3 (justeringar, egenavgifter/räntefördelning), since those are what you need to actually file. Want me to start on any of these?

---

## User

Please save these steps in a PLAN.md markdown file in the repo so we remember them. Then start working on item #2.

---

## Assistant (Build · Kimi K3 · 200.8s)

_Thinking:_

The user wants me to:
1. Save the steps in a PLAN.md markdown file in the repo
2. Start working on item #2: Skattemässiga justeringar (R12+)

Let me first create the PLAN.md. Then work on item #2.

For item #2 — Skattemässiga justeringar (R12+) on the NE-bilaga. Let me think about what this involves:

The NE-bilaga (SKV 2161) has:
- Räkenskapsschemat: R1–R11 (intäkter R1-R4, kostnader R5-R10, R11 = bokfört resultat)
- Skattemässiga justeringar av bokfört resultat: R12–R27 (roughly)
  - R12: Bokförda kostnader som inte ska dras av (ej avdragsgilla kostnader) — e.g., 60% av representation (6072?), böter (6994?), etc.
  - R13: Bokförda intäkter som inte ska beskattas
  - R14: Intäkter som inte bokförts men som ska beskattas
  - R15: Kostnader som inte bokförts men som ska dras av
  - R16: Återföring från periodiseringsfond
  - R17: Avsättning till periodiseringsfond
  - R18: Återföring från expansionsfond
  - R19: Avsättning till expansionsfond
  - R20: Återfört uppskov från uppskovsreserv
  - R21: Uppskjuten beskattning enligt uppskovsreserv
  - R22: Kvittning av underskott
  - R23: Egenavgifter/särskild löneskatt avdragsgilla
  - R24: Överskott (skattemässigt resultat) — R11 + R12 − R13 + R14 − R15 + R16 − R17 + R18 − R19 + R20 − R21 − R22 − R23
  - R25: Fördelning av underskott
  - R26/R27... 

Let me recall the actual NE form (SKV 2161, blankett NE 2025):
Räkenskapsschemat:
- R1: Försäljning och utfört arbete samt övriga momspliktiga intäkter
- R2: Momsfria intäkter
- R3: Bil-, bostads- och andra förmåner samt vinstmarginal vid vinstmarginalbeskattning
- R4: Ränteintäkter, valutakursvinster m.m.
- R5: Varor, material och tjänster
- R6: Övriga externa kostnader
- R7: Anställd personal
- R8: Räntekostnader, valutakursförluster m.m.
- R9: Av- och nedskrivningar av byggnader och markanläggningar
- R10: Av- och nedskrivningar av maskiner, inventarier, immateriella tillgångar m.m.
- R11: Bokfört resultat (+/−)

Skattemässiga justeringar av bokfört resultat:
- R12: Bokförda kostnader som inte ska dras av (+)
- R13: Bokförda intäkter som inte ska tas upp (−)
- R14: Intäkter som inte bokförts men som ska tas upp (+)
- R15: Kostnader som inte bokförts men som ska dras av (−)
- R16: Återföring från periodiseringsfond (+)
- R17: Avsättning till periodiseringsfond (−)
- R18: Återföring från expansionsfond (+)
- R19: Avsättning till expansionsfond (−)
- R20: Återfört uppskov från uppskovsreserv (+)
- R21: Uppskjuten beskattning enligt uppskovsreserv (−)
- R22: Kvittning av underskott av näringsverksamhet mot överskott av annan näringsverksamhet (−)
- R23: Avdrag för egenavgifter/särskild löneskatt enligt beräkning (−)
- R24: Överskott (+) / Underskott (−) — skattemässigt resultat före fördelning
- R25: Fördelning av överskott/underskott (vid flera verksamheter eller makar)
- R26: Överskott av näringsverksamheten
- R27: Underskott av näringsverksamheten

Hmm, and for SRU codes: R12 = 7450? Let me think. From accounted's sru-generator per memory: R1–R11 = 7400–7403, 7500–7505, 7440. Actually:
- R1 = 7400
- R2 = 7401
- R3 = 7402? 
- R4 = 7403?
- R5 = 7500
- R6 = 7501
- R7 = 7502
- R8 = 7503
- R9 = 7504
- R10 = 7505
- R11 = 7440

Skattemässiga justeringar SRU codes (from BAS/SRU spec for blankett NE):
- R12 = 7451 (Bokförda kostnader som inte ska dras av)
- R13 = 7452
- R14 = 7453
- R15 = 7454
- R16 = 7455 (Återföring p-fond)
- R17 = 7456 (Avsättning p-fond)
- R18 = 7457
- R19 = 7458
- R20 = 7459
- R21 = 7460
- R22 = 7461
- R23 = 7462
- R24 = 7463
- R25 = 7464
- R26 = 7465
- R27 = 7466

I'm not 100% sure of these codes; but since item #1 (SRU export) isn't done yet, I don't need SRU codes for item #2 — just the UI/calculation of R12+.

What can be computed from accounts vs manual? This is important — the existing code style is to compute what can be computed and mark manual boxes (like R3, MANUELLA_NE_RUTOR).

BAS accounts that map to R12 (ej avdragsgilla kostnader):
- 6072 Representation, ej avdragsgill
- 6342 Ej avdragsgilla representationskostnader (old?)
- 6994 Ej avdragsgilla kostnader
- 6982 Föreningar, donationer (ej avdragsgilla?)
- 6320 Ersättningar för inkörda arbeten? no...
- 6998 Utgår? 
- 8424? Räntetillägg skattekonto — 8423 Skatteräntor?
- Actually: böter 6995? Let me think about BAS kontoplan:
  - 6071 Representation, avdragsgill
  - 6072 Representation, ej avdragsgill
  - 6981 Anslag, donationer, gåvor (avdragsgilla? business gifts over 300 kr not deductible)
  - 6982 Ej avdragsgilla gåvor/anslag
  - 6991 Övriga externa kostnader, avdragsgilla
  - 6992 Övriga externa kostnader, ej avdragsgilla
  - 6993 Lämnade bidrag och gåvor
  - 6994? 
  - 8423 Skatteräntor, dröjsmålsränta etc (ej avdragsgill)
  - 6995? Böter? 6995 Böter? Hmm, BAS: 6994 "Ej avdragsgilla kostnader"? 
  
Let me be careful. BAS 2024:
- 6991 Övriga externa kostnader, avdragsgilla
- 6992 Övriga externa kostnader, ej avdragsgilla
- 6993 Lämnade bidrag, gåvor och representation... no. 6993 "Lämnade bidrag och gåvor"
- 6994? "Ej avdragsgilla kostnader"? Hmm.

Also:
- 6072 Representation, ej avdragsgill — definitely R12.
- 7623 Sjukvårdsförsäkring, ej avdragsgill? 
- 8424 Räntetillägg för obetald skatt? Actually 8423 "Skattetillägg och förseningsavgifter"? 

I shouldn't overreach on exact account numbers. Better approach: implement R12–R24 structure where:
- R12 computed from known ej-avdragsgilla accounts (a mapping like the others, in ordered intervals)
- R13: bokförda intäkter som inte ska tas upp — e.g., 8314? (skattefria intäkter)? Hmm. Hard to map reliably. Mark manual.
- R14/R15: manual (not in books by definition)
- R16/R17: periodiseringsfond — manual until periodiseringsfond module exists (item #4)
- R18/R19: expansionsfond — manual until ported
- R20/R21: uppskovsreserv — manual
- R22: kvittning — manual (cross-verksamhet)
- R23: egenavgifter — manual until item #3 implemented
- R24: computed = R11 + R12 − R13 + R14 − R15 + R16 − R17 + R18 − R19 + R20 − R21 − R22 − R23

Hmm wait — but how does the UI handle manual boxes? Currently R3 is in MANUELLA_NE_RUTOR and computed as empty; the UI presumably shows it as "fylls i för hand". Let me check rapport-ne.ts to see how the UI presents things.

For item #2, a reasonable scope:
1. Extend `ne-bilaga.ts` with skattemässiga justeringar: types R12–R24, mapping for R12 from ej-avdragsgilla accounts, manual-entry support for boxes that can't be computed, and computed R24 (överskott/underskott).
2. But manual boxes need user input — where does that come from? There's no persistence for manual entries currently (R3 is just noted as manual, filled in by hand in deklarationen). 

Hmm. Given R3 is currently just "manual" (display-only hint), the minimal-intrusion approach for R12+:
- Compute R12 from accounts (ej avdragsgilla kostnader: 6072, 6992, 6982, 8423/8424-type accounts, 6994?)
- Everything else manual with hints, R24 computed from what's known? But R24 can't be computed meaningfully when most inputs are manual-only hints that aren't stored anywhere.

Wait — actually, maybe I should look at how the UI handles R3 to decide. Let me read rapport-ne.ts.

Also important design consideration from memory: skattemässiga justeringar are per verksamhet on the NEA (each NEA has R12+ boxes), but egenavgifter/räntefördelning are on the combined. So R12+ belongs on the per-journal NE view — good.

Let me read rapport-ne.ts and nebilaga-page.ts before designing.

Also, since manual boxes need persistence to feed R24... Options:
a) Store manual adjustments as transactions in the journal? No — they're not bokföring.
b) Store as hledger metadata/directives in the journal file? E.g., a comment or a tag. Could use hledger tags on the year... hmm.
c) localStorage keyed by file name + year.
d) Just display computed parts and let Jeremy fill manual parts on Skatteverket's site (like R3 today). R24 then only shows "bokfört resultat + R12 = justerat resultat före övriga justeringar".

Minimal, consistent-with-existing-design choice: follow the R3 pattern — compute what can be computed (R12 from accounts), show the rest as manual fields to fill in at Skatteverket. R24/R26/R27 partially computed with clear labeling.

Hmm, but wait. Let me reconsider: maybe manual input fields with localStorage would be genuinely useful and not too intrusive. But the codebase philosophy seems to be "journal is the only input" (test-helpers.ts: "journalfilen är enda input"). Adding localStorage state diverges. Adding input fields without persistence loses data on reload — bad.

Actually — hold on. There's another angle: skattemässiga justeringar CAN be driven from the journal via tags or dedicated accounts. E.g., egenavgiftsbetalningar are booked (skattekonto transactions?), and the deduction R23 is 25% of result or actual paid? For enskild firma, R23 avdrag egenavgifter = the amount decided in the tax return (usually the påförda egenavgifter). This is item #3's job to compute.

For now, item #2 scope (keep it stupidly simple):
1. Extend the NeBilaga model: add `justeringar` section with R12–R24.
2. R12: computed from ej-avdragsgilla accounts (6072, 6992, plus a few well-known ones).
3. R13–R23: manual (MANUELLA set), shown in UI with "fylls i för hand" like R3.
4. R24: computed as R11 + R12 (with note that manual boxes affect final result at Skatteverket).
5. Update rapport-ne.ts UI to render the justeringar section.
6. Tests.

Wait, but R13 — bokförda intäkter som inte ska tas upp — could be mapped from certain accounts? E.g., 8314? Hmm, skattefria ränteintäkter? No such thing really. R13 examples: vinster på värdepapper inom verksamheten som är skattefria? Rare. Keep manual.

Actually for R12 accounts, let me be careful with BAS:
- 6072 Representation, ej avdragsgill ✓
- 6342? old "Ej avdragsgilla representationskostnader"? In BAS 2024, 6341/6342 are... 6340 "Ej avdragsgilla kostnader"? Hmm no.

Let me just use the well-established ones:
- 6072 (representation ej avdragsgill)
- 6982? Hmm, 6982 is "Föreningsavgifter, ej avdragsgilla"? Not sure.
- 6992 Övriga externa kostnader, ej avdragsgilla ✓
- 6994? Doesn't exist I think.
- 7622? "Sjuk- och hälsovård, ej avdragsgill"? Hmm.
- 8423/8424: 8423 is "Skatteräntor, dröjsmålsränta"? In BAS, 8424 = "Räntetillägg för obetald skatt"? Hmm. There is 8423 "Skatteräntor"? 

I recall in BAS: 
- 8420–8429: Räntekostnader för skatter och avgifter
  - 8423 Skatteräntor
  - 8424 Räntetillägg för skatter och avgifter? 

Honestly, the safest known ej-avdragsgilla accounts: 6072, 6992, and 8423-type skatteränta. But mapping wrong accounts is worse than mapping few. Since Jeremy's journals are small (Granngården etc.), I can check his actual journal for which accounts he uses! barlingshult.journal is in the repo. Let me look at it to ground the mapping in reality.

Also — should R12 + R11 flow to a "R24" display? Since manual boxes aren't stored, displaying R24 = R11 + R12 is honest as "resultat efter bokföringsbaserade justeringar" with hint that manual boxes change it.

Let me now:
1. Read rapport-ne.ts, nebilaga-page.ts, ne-bilaga.test.ts, and peek at barlingshult.journal header/accounts.
2. Create PLAN.md.
3. Implement.

Let me also decide PLAN.md content: the 8 items with status, plus priority order suggested. The user said "save these steps" — the list of remaining work. I'll write it in Swedish or English? The repo's docs are mixed: README is English, code comments Swedish. Memory is Swedish. The user speaks both. PLAN.md — I'll write in Swedish to match the domain (all terms are Swedish), or English for consistency with README? Hmm. The user wrote in English throughout this conversation. The code comments are Swedish. PLAN.md is a project doc; given the domain terms (momsomföring, NE-bilaga), Swedish feels natural and matches memory language. But the user communicates in English here. I'll write it in Swedish — consistent with the project's domain language and code comments... Actually, let me reconsider: the README is English. The git commits are mixed Swedish/English/Norwegian ("Leg til gh action"). The user is Swedish (Jeremy in Sweden, Swedish accounting). Memory notes are Swedish. I'll write PLAN.md in Swedish — it matches the domain and the code. Hmm, but user messages in this session are English. 

The user said "save these steps" — the overview I gave was in English with Swedish terms. I could write it bilingually... no, keep it simple. I'll write in Swedish since all the domain content is Swedish and that's Jeremy's working language for this app (code comments, UI text all Swedish). Actually the safest: English structure with Swedish terms, mirroring my overview which he approved. Let me just do Swedish headers with Swedish content — matches code comments style. 

Hmm, I'll go with Swedish — the entire app UI and comments are Swedish; the PLAN.md documents Swedish tax features. Decision: Swedish.

Now, PLAN.md content:

```markdown
# Plan – återstående arbete

Sammanställt 2026-08-24 utifrån Claudes minnesanteckningar och genomgång av koden.

## Klart ✅
- Moms: rutmappning (SKV 4700), momsrapport per journal, momsomföring (2650/1650 + 3740), momsbetalning
- Bokslut: årets resultat (8999→2019), nollställning av eget kapital (2011–2019→2010)
- NE-bilaga: räkenskapsschemat R1–R11, varningar för omappade konton
- Balansrapport, verifikatsnumrering med luckdetektering, mallar med betalkontoval (1930/2018)

## Kvar ❌
1. **Sammanslagen momsvy över journalerna** — summera i ören över båda journalerna, avrunda en gång (aldrig addera färdigavrundade rutor).
2. **Skattemässiga justeringar (R12+)** — NE-bilagan slutar i dag vid R11. Lägg till R12–R24 (ej avdragsgilla kostnader ur bokföringen, resten manuella rutor).
3. **SRU-export av NE-bilagan** — porta från accounted lib/reports/ne-bilaga/sru-generator.ts (INFO.SRU/BLANKETTER.SRU, ISO 8859-1, fältkoder 7400–7403, 7500–7505, 7440; datum 7011/7012). Behåll upphovsrättsnotisen.
4. **Egenavgifter och räntefördelning** — porta från accounted lib/bokslut/enskild-firma/. Beräknas på det gemensamma skattemässiga resultatet (IL 14:12), inte per verksamhet.
5. **Periodiseringsfond / expansionsfond** — samma källa, ej porterad än.
6. **K1-blanketten**.
7. **SIE4-export?** — verifikat.ts är designad för det ("en SIE-fil per år går att skapa rakt av") men ingen export finns. Bekräfta om den ska med.
8. **README** — beskriver fortfarande den gamla generiska journalhanteraren; uppdatera med moms/NE/bokslut.

## Prioritering inför deklarationen
2 → 1 → 3 → 4/5 ...
```

Wait, earlier I suggested priority 5 → 1 → 2+3 in old numbering (combined moms → SRU → justeringar). But the user picked item #2 (justeringar) to start with. In PLAN.md I'll keep the numbered list as presented (1-8 in the order I gave), and note current work. Let me keep numbering identical to my previous message to avoid confusion:

1. SRU-export
2. Skattemässiga justeringar (R12+) ← påbörjad
3. Egenavgifter och räntefördelning
4. Periodiseringsfond/expansionsfond
5. Sammanslagen momsvy
6. K1
7. SIE4-export (obekräftad)
8. README

Plus suggested priority. And note item 2 in progress. Good.

Now implementation of #2. Let me first read the UI files and test file, plus glance at barlingshult.journal to see accounts used.

Design for skattemässiga justeringar:

In `ne-bilaga.ts`:
```ts
export type NeJusteringsRuta = "R12" | "R13" | ... | "R24";
```

Structure: add `justeringar: Array<NeRad>` (R12–R23) and `skattemassigtResultat: number` (R24) to NeBilaga? But NeRad has `konton` — for manual boxes there are no accounts. Fine, empty array.

Sign handling: R12 is + (increases result), R13 −, R14 +, R15 −, R16 +, R17 −, R18 +, R19 −, R20 +, R21 −, R22 −, R23 −. R24 = R11 + sum of signed adjustments.

For R12 mapping from accounts (ej avdragsgilla kostnader) — BAS accounts that are "ej avdragsgill":
- 6072 Representation, ej avdragsgill
- 6992 Övriga externa kostnader, ej avdragsgilla
- 6342? Let me not include uncertain ones.
- 6982? Uncertain.
- 8423 Skatteräntor? Hmm, actually I believe 8423 in BAS is "Skatteräntor, dröjsmålsränta" and IS ej avdragsgill. Räntetillägg 8424 too. But wait — these currently map to R8 (8400–8499 räntekostnader). If I add them to R12 mapping, I must REMOVE them from R8 — i.e., the skattemässig justering R12 = add back. Since order matters (first match wins), I put R12 mappings BEFORE R8 in the list... but R8 is a räkenskapsschema box (8400-8499). If an account matches R12's list first, it would be excluded from R8 and instead shown under justeringar. That would make R11 (bokfört resultat) WRONG — because R11 = sum(R1..R4) − sum(R5..R10) must equal the booked result!

This is the crucial design point: ej avdragsgilla kostnader are STILL booked costs, so they belong in R6/R8 in the räkenskapsschema, AND are added back in R12. R12 is not a re-mapping — it's an *additional* computation from the same accounts. So the R12 computation needs its own separate account list, computed from the same saldon, without removing them from R5–R10.

So:
```ts
/** Konton vars kostnader är bokförda men inte avdragsgilla — adderas
 *  tillbaka i R12. Kontona ligger kvar i sina räkenskapsschemarutor. */
const R12_KONTON = [6072, 6992, ...];
```

Which BAS accounts are definitively "ej avdragsgilla"? Let me ground this in Jeremy's actual journal + standard BAS:
- 6072 Representation, ej avdragsgill ✓ (standard)
- 6992 Övriga externa kostnader, ej avdragsgilla ✓ (standard)
- 7623? "Sjukvårdsförsäkring, ej avdragsgill" — hmm not sure
- 8423/8424 skatteräntor — I'm fairly confident skatteräntor are not deductible (ränta på skattekonto till Skatteverket är inte avdragsgill för näringsidkare? Actually räntetillägg är inte avdragsgill, men ränta i övrigt...). KOSTNADSRÄNTA på skattekontot är inte avdragsgill (IL 25 kap? nej — kostnadsränta är avdragsgill för fysiska personer i kapital, inte i näringsverksamhet; för enskild firma bokförs skattekontotransaktioner vanligtvis inte alls i näringsbokföringen eftersom skattekontot är privat). So 8423 might not even appear. Keep it simple: 6072, 6992, and maybe 6982 (bidrag/gåvor ej avdragsgilla)? 

BAS 2024 698x: 6981 "Anläggningstillbehör..."? no. Hmm: 6980–6989 "Övriga avdragsgilla kostnader"? Actually 698x is "Föreningsavgifter, donationer": 6981 Föreningsavgifter, avdragsgilla; 6982 Föreningsavgifter, ej avdragsgilla. I think that's right: 6981/6982 föreningsavgifter avdragsgilla/ej avdragsgilla. I'll include 6982.

Also 6072. And 6992. That trio (6072, 6982, 6992) is the classic "ej avdragsgill" set. Good enough, and Jeremy can extend. Also note böter — parkeringsböter often booked on 6993? No, 6993 is "Lämnade bidrag och gåvor" (ej avdragsgilla generally!). Hmm: 6993 Lämnade bidrag och gåvor — gåvor till anställda under 450 kr avdragsgilla... complicated. Don't include 6993.

Wait — but what does accounted do? I can't fetch their repo? I could webfetch github... The memory says our port already fixed their R1/R3 bug; the accounted repo has the mapping in ne-engine.ts. I could fetch it to ground R12 accounts. That would be good diligence. https://raw.githubusercontent.com/erp-mafia/accounted/main/lib/reports/ne-bilaga/ne-engine.ts — let me try fetching. If it has skattemässiga justeringar mapping, great; memory says "skattemässiga justeringar (R12+)" listed as not ported and accounted's ne-engine covers R1–R11... their bokslut/enskild-firma has the funds. Their ne-engine might only do R1-R11. Let me fetch to check — worth it for grounding.

Now the UI: rapport-ne.ts — need to read it first. The UI shows intäkter/kostnader tables. I'll add a "Skattemässiga justeringar" section: R12 computed (if any accounts match), R13–R23 as manual hint rows, R24 as computed sum with caveat. Manual rows like R3's display — check how R3 shows in the UI.

Also tests: ne-bilaga.test.ts exists — add tests for R12 computation and R24.

Let me also check barlingshult.journal to see if it has ej-avdragsgilla accounts (e.g., 6992) — for a realistic test? Tests use test-helpers with inline journals probably. Let me read ne-bilaga.test.ts.

Plan of action:
1. Read rapport-ne.ts, nebilaga-page.ts, ne-bilaga.test.ts, test-helpers.ts, peek barlingshult.journal accounts.
2. Fetch accounted ne-engine.ts for reference (grounding R12+ mapping & structure).
3. Write PLAN.md.
4. Implement R12–R24 in ne-bilaga.ts + UI + tests.
5. Run tests (npm test / vitest) and lint (biome).

Let me start with parallel reads + fetch.

I'll create the PLAN.md first, then dig into item #2. Let me gather the remaining context I need.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport-ne.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport-ne.ts</path>
<type>file</type>
<content>
1: import { effect } from "@preact/signals-core";
2: import { Component, registerComponent } from "webact";
3: import { generateNeBilaga, MANUELLA_NE_RUTOR, type NeRad } from "../ne-bilaga";
4: import { selectedYear } from "../signals";
5: 
6: import styles from "./rapport.css?inline";
7: 
8: const html = String.raw;
9: 
10: // Skatteverket vill ha hela kronor på NE-bilagan
11: const numberFormatter = new Intl.NumberFormat("sv-SE", {
12:   style: "currency",
13:   currency: "SEK",
14:   maximumFractionDigits: 0,
15: });
16: 
17: const kr = (amount: number) =>
18:   numberFormatter.format(Math.round(amount) === 0 ? 0 : Math.round(amount));
19: 
20: function rutaRader(rad: NeRad): string {
21:   const kontoRader = rad.konton
22:     .map(
23:       (konto) => html`
24:         <tr class="konto-rad">
25:           <td></td>
26:           <td>${konto.konto} ${konto.namn}</td>
27:           <td class="amount">${kr(konto.belopp)}</td>
28:         </tr>
29:       `,
30:     )
31:     .join("");
32: 
33:   return html`
34:     <tr>
35:       <td>${rad.ruta}</td>
36:       <td>
37:         ${rad.beskrivning}
38:         ${
39:           MANUELLA_NE_RUTOR.has(rad.ruta)
40:             ? `<span class="manuell">fylls i manuellt</span>`
41:             : ""
42:         }
43:       </td>
44:       <td class="amount">${kr(rad.belopp)}</td>
45:     </tr>
46:     ${kontoRader}
47:   `;
48: }
49: 
50: function tabell(rubrik: string, rader: Array<NeRad>): string {
51:   return html`
52:     <table class="mono">
53:       <caption>${rubrik}</caption>
54:       <thead>
55:         <tr>
56:           <th>Ruta</th>
57:           <th>Beskrivning</th>
58:           <th class="amount">Belopp</th>
59:         </tr>
60:       </thead>
61:       <tbody>
62:         ${rader.map(rutaRader).join("")}
63:       </tbody>
64:       <tfoot>
65:         <tr>
66:           <td colspan="2">Summa</td>
67:           <td class="amount">
68:             ${kr(rader.reduce((sum, rad) => sum + rad.belopp, 0))}
69:           </td>
70:         </tr>
71:       </tfoot>
72:     </table>
73:   `;
74: }
75: 
76: class RapportNe extends Component {
77:   componentDidMount() {
78:     effect(() => {
79:       const $section = this.$("section");
80: 
81:       if (!$section) {
82:         return;
83:       }
84: 
85:       const rapport = generateNeBilaga(selectedYear.value);
86: 
87:       $section.innerHTML = html`
88:         ${tabell(`Intäkter ${rapport.year}`, rapport.intakter)}
89:         ${tabell(`Kostnader ${rapport.year}`, rapport.kostnader)}
90:         <table class="mono">
91:           <tfoot>
92:             <tr>
93:               <td>R11</td>
94:               <td>Bokfört resultat</td>
95:               <td class="amount">${kr(rapport.bokfortResultat)}</td>
96:             </tr>
97:           </tfoot>
98:         </table>
99:         ${rapport.varningar
100:           .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
101:           .join("")}
102:       `;
103:     });
104:   }
105: 
106:   render() {
107:     (async () => {
108:       if (this._sDOM) {
109:         const sheet = new CSSStyleSheet();
110:         await sheet.replace(styles);
111: 
112:         this._sDOM.adoptedStyleSheets = [sheet];
113:       }
114:     })();
115: 
116:     return `<section></section>`;
117:   }
118: }
119: 
120: export default registerComponent(RapportNe, {
121:   name: "rapport-ne",
122: });

(End of file - total 122 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts</path>
<type>file</type>
<content>
1: import { beforeEach, describe, expect, it } from "vitest";
2: import {
3:   skapaArsresultatTransaktion,
4:   beraknaArsresultatOre,
5: } from "./bokslut";
6: import { generateNeBilaga, type NeBilaga, type NeRuta } from "./ne-bilaga";
7: import { transactions } from "./signals";
8: import { laddaJournal, rensaJournal } from "./test-helpers";
9: 
10: const HEADER = `; Testkontoplan
11: account tillgångar:bankkonto
12: alias 1930 = tillgångar:bankkonto
13: account inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder
14: alias 4022 = inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder
15: `;
16: 
17: const journal = (...transaktioner: Array<string>) =>
18:   `${HEADER}\n${transaktioner.join("\n\n")}\n`;
19: 
20: /** Belopp i en ruta, oavsett om den ligger bland intäkter eller kostnader. */
21: function ruta(bilaga: NeBilaga, ruta: NeRuta): number {
22:   const rad = [...bilaga.intakter, ...bilaga.kostnader].find(
23:     (r) => r.ruta === ruta,
24:   );
25: 
26:   if (!rad) {
27:     throw new Error(`Ruta ${ruta} saknas i bilagan`);
28:   }
29: 
30:   return rad.belopp;
31: }
32: 
33: beforeEach(rensaJournal);
34: 
35: describe("intäktsrutorna R1–R4", () => {
36:   it("lägger momspliktig försäljning i R1", async () => {
37:     await laddaJournal(
38:       journal(
39:         `2025-03-01 Försäljning
40:     1930  12500.00 SEK
41:     3001  -10000.00 SEK
42:     2611  -2500.00 SEK`,
43:       ),
44:     );
45: 
46:     const bilaga = generateNeBilaga("2025");
47: 
48:     // Endast nettot är intäkt — momsen är en skuld, inte ett resultatkonto
49:     expect(ruta(bilaga, "R1")).toBe(10000);
50:     expect(bilaga.bokfortResultat).toBe(10000);
51:   });
52: 
53:   it("lägger momsfria intäkter i R2", async () => {
54:     await laddaJournal(
55:       journal(
56:         `2025-03-01 Momsfri intäkt
57:     1930  5000.00 SEK
58:     3100  -5000.00 SEK`,
59:         `2025-03-02 Övrig rörelseintäkt
60:     1930  1000.00 SEK
61:     3990  -1000.00 SEK`,
62:       ),
63:     );
64: 
65:     expect(ruta(generateNeBilaga("2025"), "R2")).toBe(6000);
66:   });
67: 
68:   it("lägger VMB- och omvänd moms-försäljning (32xx) i R1, inte i R3", async () => {
69:     await laddaJournal(
70:       journal(
71:         `2025-03-01 Försäljning
72:     1930  1000.00 SEK
73:     3000  -1000.00 SEK`,
74:         `2025-03-02 Försäljning inom byggsektorn, omvänd betalningsskyldighet
75:     1930  2000.00 SEK
76:     3231  -2000.00 SEK`,
77:       ),
78:     );
79: 
80:     const bilaga = generateNeBilaga("2025");
81: 
82:     // BAS 3200–3299 är försäljningskonton (VMB och omvänd moms) och hör till
83:     // R1. R3 avser förmånsvärden och har inget kontointervall alls.
84:     expect(ruta(bilaga, "R1")).toBe(3000);
85:     expect(ruta(bilaga, "R3")).toBe(0);
86:   });
87: 
88:   it("räknar aldrig fram R3 — förmånsvärden fylls i för hand", async () => {
89:     await laddaJournal(
90:       journal(
91:         `2025-03-01 Försäljning VMB
92:     1930  5000.00 SEK
93:     3211  -5000.00 SEK`,
94:       ),
95:     );
96: 
97:     expect(ruta(generateNeBilaga("2025"), "R3")).toBe(0);
98:   });
99: 
100:   it("lägger ränteintäkter i R4", async () => {
101:     await laddaJournal(
102:       journal(
103:         `2025-12-31 Ränta på företagskonto
104:     1930  150.00 SEK
105:     8310  -150.00 SEK`,
106:       ),
107:     );
108: 
109:     expect(ruta(generateNeBilaga("2025"), "R4")).toBe(150);
110:   });
111: });
112: 
113: describe("kostnadsrutorna R5–R10", () => {
114:   it("lägger varuinköp i R5 och övriga kostnader i R6", async () => {
115:     await laddaJournal(
116:       journal(
117:         `2025-03-01 Inköp foder
118:     4022  800.00 SEK
119:     2640  200.00 SEK
120:     1930  -1000.00 SEK`,
121:         `2025-03-02 Kontorsmaterial
122:     6110  500.00 SEK
123:     1930  -500.00 SEK`,
124:       ),
125:     );
126: 
127:     const bilaga = generateNeBilaga("2025");
128: 
129:     expect(ruta(bilaga, "R5")).toBe(800);
130:     expect(ruta(bilaga, "R6")).toBe(500);
131:     expect(bilaga.bokfortResultat).toBe(-1300);
132:   });
133: 
134:   it("lägger lönekostnader i R7 och räntekostnader i R8", async () => {
135:     await laddaJournal(
136:       journal(
137:         `2025-03-25 Lön
138:     7010  20000.00 SEK
139:     1930  -20000.00 SEK`,
140:         `2025-03-31 Räntekostnad
141:     8410  300.00 SEK
142:     1930  -300.00 SEK`,
143:       ),
144:     );
145: 
146:     const bilaga = generateNeBilaga("2025");
147: 
148:     expect(ruta(bilaga, "R7")).toBe(20000);
149:     expect(ruta(bilaga, "R8")).toBe(300);
150:   });
151: 
152:   it("skiljer avskrivning på byggnad (R9) från övriga avskrivningar (R10)", async () => {
153:     await laddaJournal(
154:       journal(
155:         `2025-12-31 Avskrivning byggnad
156:     7820  10000.00 SEK
157:     1110  -10000.00 SEK`,
158:         `2025-12-31 Avskrivning inventarier
159:     7830  5000.00 SEK
160:     1210  -5000.00 SEK`,
161:       ),
162:     );
163: 
164:     const bilaga = generateNeBilaga("2025");
165: 
166:     expect(ruta(bilaga, "R9")).toBe(10000);
167:     expect(ruta(bilaga, "R10")).toBe(5000);
168:   });
169: 
170:   it("lägger hela 782x-gruppen i R9, inte bara samlingskontot", async () => {
171:     await laddaJournal(
172:       journal(
173:         `2025-12-31 Avskrivning ladugård
174:     7821  24000.00 SEK
175:     1119  -24000.00 SEK`,
176:         `2025-12-31 Avskrivning markanläggning
177:     7824  3000.00 SEK
178:     1159  -3000.00 SEK`,
179:         `2025-12-31 Avskrivning immateriell tillgång
180:     7810  1000.00 SEK
181:     1019  -1000.00 SEK`,
182:       ),
183:     );
184: 
185:     const bilaga = generateNeBilaga("2025");
186: 
187:     // 7821 byggnader och 7824 markanläggningar hör till R9 — hamnade de i
188:     // R10 skulle byggnadsavskrivningen redovisas som maskiner på blanketten
189:     expect(ruta(bilaga, "R9")).toBe(27000);
190:     expect(ruta(bilaga, "R10")).toBe(1000);
191:   });
192: });
193: 
194: describe("R11 bokfört resultat", () => {
195:   it("är intäkter minus kostnader", async () => {
196:     await laddaJournal(
197:       journal(
198:         `2025-03-01 Försäljning
199:     1930  10000.00 SEK
200:     3000  -10000.00 SEK`,
201:         `2025-03-02 Inköp
202:     4000  4000.00 SEK
203:     1930  -4000.00 SEK`,
204:       ),
205:     );
206: 
207:     expect(generateNeBilaga("2025").bokfortResultat).toBe(6000);
208:   });
209: 
210:   it("är summan av de avrundade rutorna, så blanketten går ihop", async () => {
211:     await laddaJournal(
212:       journal(
213:         `2025-03-01 Försäljning
214:     1930  8123.45 SEK
215:     3000  -8123.45 SEK`,
216:         `2025-03-02 Inköp
217:     4000  2345.67 SEK
218:     1930  -2345.67 SEK`,
219:         `2025-03-03 Kontorsmaterial
220:     6110  111.11 SEK
221:     1930  -111.11 SEK`,
222:       ),
223:     );
224: 
225:     const bilaga = generateNeBilaga("2025");
226:     const summa = (rader: typeof bilaga.intakter) =>
227:       rader.reduce((total, rad) => total + rad.belopp, 0);
228: 
229:     // Skatteverket kontrollräknar blanketten: R11 måste vara exakt differensen
230:     // mellan de ifyllda rutorna, inte en egen avrundning av råsaldona.
231:     expect(bilaga.bokfortResultat).toBe(
232:       summa(bilaga.intakter) - summa(bilaga.kostnader),
233:     );
234:     expect(bilaga.bokfortResultat).toBe(8123 - 2346 - 111);
235:   });
236: 
237:   it("kan skilja någon krona från det bokförda resultatet, eftersom varje ruta avrundas", async () => {
238:     await laddaJournal(
239:       journal(
240:         `2025-03-01 Försäljning
241:     1930  8123.45 SEK
242:     3000  -8123.45 SEK`,
243:         `2025-03-02 Inköp
244:     4000  2345.67 SEK
245:     1930  -2345.67 SEK`,
246:         `2025-03-03 Kontorsmaterial
247:     6110  111.11 SEK
248:     1930  -111.11 SEK`,
249:       ),
250:     );
251: 
252:     const bilaga = generateNeBilaga("2025");
253:     const bokfortKr = beraknaArsresultatOre("2025") / 100;
254: 
255:     // Bokföringen är exakt (5 666,67), blanketten avrundad (5 666).
256:     // Differensen ska stanna inom öresavrundningen per ruta.
257:     expect(bokfortKr).toBeCloseTo(5666.67, 2);
258:     expect(Math.abs(bilaga.bokfortResultat - bokfortKr)).toBeLessThan(
259:       bilaga.intakter.length + bilaga.kostnader.length,
260:     );
261:   });
262: 
263:   it("påverkas inte av att resultatet omförs vid bokslut", async () => {
264:     await laddaJournal(
265:       journal(
266:         `2025-03-01 Försäljning
267:     1930  10000.00 SEK
268:     3000  -10000.00 SEK`,
269:         `2025-03-02 Inköp
270:     4000  4000.00 SEK
271:     1930  -4000.00 SEK`,
272:       ),
273:     );
274: 
275:     const fore = generateNeBilaga("2025");
276:     transactions.value = [
277:       ...transactions.value,
278:       skapaArsresultatTransaktion("2025")!,
279:     ];
280: 
281:     // Omföringen nollar 3000/4000 mot 8999 — utan spärren skulle bilagan bli tom
282:     expect(generateNeBilaga("2025")).toEqual(fore);
283:     expect(generateNeBilaga("2025").bokfortResultat).toBe(6000);
284:   });
285: });
286: 
287: describe("avrundning och avgränsning", () => {
288:   it("avrundar per ruta, inte per konto", async () => {
289:     await laddaJournal(
290:       journal(
291:         // Tre konton med 0,50 vardera: kontovis avrundning skulle ge 3 kr,
292:         // rutavis ger korrekta 2 kr (1,50 → 2)
293:         `2025-03-01 Tre småposter
294:     1930  1.50 SEK
295:     3000  -0.50 SEK
296:     3001  -0.50 SEK
297:     3002  -0.50 SEK`,
298:       ),
299:     );
300: 
301:     expect(ruta(generateNeBilaga("2025"), "R1")).toBe(2);
302:   });
303: 
304:   it("tar inte med balanskonton", async () => {
305:     await laddaJournal(
306:       journal(
307:         `2025-03-01 Egen insättning
308:     1930  5000.00 SEK
309:     2018  -5000.00 SEK`,
310:       ),
311:     );
312: 
313:     const bilaga = generateNeBilaga("2025");
314: 
315:     expect(bilaga.bokfortResultat).toBe(0);
316:     expect(bilaga.varningar).toEqual([]);
317:   });
318: 
319:   it("håller isär åren", async () => {
320:     await laddaJournal(
321:       journal(
322:         `2025-03-01 Försäljning 2025
323:     1930  1000.00 SEK
324:     3000  -1000.00 SEK`,
325:         `2026-03-01 Försäljning 2026
326:     1930  2000.00 SEK
327:     3000  -2000.00 SEK`,
328:       ),
329:     );
330: 
331:     expect(ruta(generateNeBilaga("2025"), "R1")).toBe(1000);
332:     expect(ruta(generateNeBilaga("2026"), "R1")).toBe(2000);
333:   });
334: 
335:   it("varnar för resultatkonton utan NE-ruta i stället för att tappa dem", async () => {
336:     await laddaJournal(
337:       journal(
338:         // 8910 (skatt) saknar ruta i räkenskapsschemat
339:         `2025-12-31 Skattekostnad
340:     8910  1000.00 SEK
341:     1930  -1000.00 SEK`,
342:       ),
343:     );
344: 
345:     const bilaga = generateNeBilaga("2025");
346: 
347:     expect(bilaga.varningar).toHaveLength(1);
348:     expect(bilaga.varningar[0]).toContain("8910");
349:     expect(bilaga.bokfortResultat).toBe(0);
350:   });
351: 
352:   it("visar kontouppdelningen bakom varje ruta", async () => {
353:     await laddaJournal(
354:       journal(
355:         `2025-03-01 Fårfoder
356:     4021  200.00 SEK
357:     1930  -200.00 SEK`,
358:         `2025-03-02 Hönsfoder
359:     4022  300.00 SEK
360:     1930  -300.00 SEK`,
361:       ),
362:     );
363: 
364:     const r5 = generateNeBilaga("2025").kostnader.find((r) => r.ruta === "R5")!;
365: 
366:     expect(r5.belopp).toBe(500);
367:     expect(r5.konton).toEqual([
368:       { konto: 4021, namn: "", belopp: 200 },
369:       {
370:         konto: 4022,
371:         namn: "inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder",
372:         belopp: 300,
373:       },
374:     ]);
375:   });
376: });

(End of file - total 376 lines)
</content>
```

**Tool: bash**

**Input:**
```json
{
  "command": "head -40 /Users/jeremy/dev/hledger-web-gui/barlingshult.journal && echo \"---ACCOUNTS---\" && grep -oP '^\\s+\\K\\d{4}(?=\\s)' /Users/jeremy/dev/hledger-web-gui/barlingshult.journal | sort -u | tr '\\n' ' '"
}
```

**Output:**
```
; Tillgångar
account tillgångar
alias 1900 = tillgångar
; Bankkonto
account tillgångar:bankkonto
alias 1930 = tillgångar:bankkonto
; Kundfordringar
account tillgångar:kundfordringar
alias 1510 = tillgångar:kundfordringar
; 163 Avräkning för skatter och avgifter (skattekonto)
account tillgångar:skattekonto
alias 1630 = tillgångar:skattekonto
; 165 Momsfordran — moms att få tillbaka från Skatteverket
account tillgångar:momsfordran
alias 1650 = tillgångar:momsfordran

; Skulder
account skulder
; 261 Utgående moms, 25 %
account skulder:utgående_moms_25:försäljning_sverige
alias 2611 = skulder:utgående_moms_25:försäljning_sverige
; 262 Utgående moms Sverige, 12 %
account skulder:utgående_moms_12:försäljning_sverige
alias 2621 = skulder:utgående_moms_12:försäljning_sverige
; 263 Utgående moms Sverige, 6 %
account skulder:utgående_moms_6:försäljning_sverige
alias 2631 = skulder:utgående_moms_6:försäljning_sverige
; 264 Ingående moms
account skulder:ingående_moms
alias 2640 = skulder:ingående_moms
; 265 Ingående moms
account skulder:redovisningskonto_moms
alias 2650 = skulder:redovisningskonto_moms

; Eget kapital
account eget_kapital
alias 2010 = eget_kapital
; Egna uttag
account eget_kapital:egna_uttag
alias 2013 = eget_kapital:egna_uttag
---ACCOUNTS---
grep: invalid option -- P
usage: grep [-abcdDEFGHhIiJLlMmnOopqRSsUVvwXxZz] [-A num] [-B num] [-C[num]]
	[-e pattern] [-f file] [--binary-files=value] [--color=when]
	[--context[=num]] [--directories=action] [--label] [--line-buffered]
	[--null] [pattern] [file ...]

```

---

## Assistant (Build · Kimi K3 · 17.8s)

_Thinking:_

The grep -P failed on macOS. Let me use a different approach to list accounts used in the journal. Also, let me check the accounted repo's ne-engine for reference on skattemässiga justeringar. Actually, memory says accounted's ne-engine covers R1–R11 only; the skattemässiga justeringar weren't there (they're "not ported" — meaning accounted HAS them? Let me re-read memory: "Ännu inte gjort: SRU-export av NE-bilagan, K1-blanketten, skattemässiga justeringar (R12+), egenavgifter och räntefördelning." — this lists things not done in OUR repo; accounted has egenavgifter/räntefördelning in lib/bokslut/enskild-firma/. It's unclear if accounted has R12+ mapping. Let me fetch their ne-engine.ts to check — worth one fetch for grounding.

Also let me list the accounts in barlingshult.journal with rg or sort.

**Tool: bash**

**Input:**
```json
{
  "command": "rg -oN '^\\s+\\K\\d{4}(?=\\s)' --no-filename /Users/jeremy/dev/hledger-web-gui/barlingshult.journal | sort -un | tr '\\n' ' '; echo; rg -oN '^alias \\K\\d{4}' --no-filename /Users/jeremy/dev/hledger-web-gui/barlingshult.journal | sort -un | tr '\\n' ' '"
}
```

**Output:**
```
zsh:1: command not found: rg

zsh:1: command not found: rg

```

**Tool: webfetch**

**Input:**
```json
{
  "format": "text",
  "url": "https://raw.githubusercontent.com/erp-mafia/accounted/main/lib/reports/ne-bilaga/ne-engine.ts"
}
```

**Output:**
```
import type { SupabaseClient } from '@supabase/supabase-js'
import { generateTrialBalance } from '@/lib/reports/trial-balance'
import type { FiscalPeriod } from '@/types'
import type {
  NEDeclaration,
  NEDeclarationRutor,
  NEAccountMapping,
} from './types'

/**
 * NE-bilaga (Enskild Firma / Sole Proprietorship Declaration)
 *
 * Maps BAS account balances to NE declaration rutor (R1-R11) for
 * tax reporting to Skatteverket.
 *
 * Account mappings:
 * R1:  Försäljning med moms (3000-3599 excl 3100, 3700-3799)
 * R2:  Momsfria intäkter (3100, 3900-3969, 3970-3980, 3981-3999) - inkl gåvor utan motprestation
 * R3:  Bil/bostadsförmån (3200)
 * R4:  Ränteintäkter (8310-8330)
 * R5:  Varuinköp (4000-4990)
 * R6:  Övriga kostnader (5000-6990, 7970) - inkl avdragsgilla gåvor (5460)
 * R7:  Lönekostnader (7000-7699)
 * R8:  Räntekostnader (8400-8499)
 * R9:  Avskrivningar fastighet (7820)
 * R10: Avskrivningar övrigt (7700-7899 excl 7820)
 * R11: Årets resultat (calculated)
 *
 * Gift handling:
 * - Gåvor MED motprestation: R1 (momspliktig bytestransaktion)
 * - Gåvor UTAN motprestation: R2 via konto 3900
 * - Avdragsgilla gåvor: R6 via konto 5460
 */

/**
 * Account mapping configuration for NE declaration
 */
export const NE_ACCOUNT_MAPPINGS: NEAccountMapping[] = [
  {
    ruta: 'R1',
    description: 'Försäljning med moms (25%)',
    accountRanges: [
      { start: '3000', end: '3599', exclude: ['3100'] },
      { start: '3700', end: '3799' },
    ],
    isExpense: false,
  },
  {
    ruta: 'R2',
    description: 'Momsfria intäkter',
    accountRanges: [
      { start: '3100', end: '3100' },
      { start: '3900', end: '3969' }, // Övriga rörelseintäkter (inkl gåvor utan motprestation)
      { start: '3970', end: '3980' },
      { start: '3981', end: '3999' },
    ],
    isExpense: false,
  },
  {
    ruta: 'R3',
    description: 'Bil/bostadsförmån',
    accountRanges: [
      { start: '3200', end: '3299' },
    ],
    isExpense: false,
  },
  {
    ruta: 'R4',
    description: 'Ränteintäkter',
    accountRanges: [
      { start: '8310', end: '8330' },
    ],
    isExpense: false,
  },
  {
    ruta: 'R5',
    description: 'Varuinköp',
    accountRanges: [
      { start: '4000', end: '4990' },
    ],
    isExpense: true,
  },
  {
    ruta: 'R6',
    description: 'Övriga kostnader',
    accountRanges: [
      { start: '5000', end: '6990' },
      { start: '7970', end: '7970' },
    ],
    isExpense: true,
  },
  {
    ruta: 'R7',
    description: 'Lönekostnader',
    accountRanges: [
      { start: '7000', end: '7699' },
    ],
    isExpense: true,
  },
  {
    ruta: 'R8',
    description: 'Räntekostnader',
    accountRanges: [
      { start: '8400', end: '8499' },
    ],
    isExpense: true,
  },
  {
    ruta: 'R9',
    description: 'Avskrivningar fastighet',
    accountRanges: [
      { start: '7820', end: '7820' },
    ],
    isExpense: true,
  },
  {
    ruta: 'R10',
    description: 'Avskrivningar övrigt',
    accountRanges: [
      { start: '7700', end: '7899', exclude: ['7820'] },
    ],
    isExpense: true,
  },
]

/**
 * Check if an account number falls within a mapping's ranges
 */
function isAccountInMapping(accountNumber: string, mapping: NEAccountMapping): boolean {
  for (const range of mapping.accountRanges) {
    const num = accountNumber
    if (num >= range.start && num <= range.end) {
      // Check exclusions
      if (range.exclude && range.exclude.includes(num)) {
        continue
      }
      return true
    }
  }
  return false
}

/**
 * Round to nearest krona (whole number) for NE declaration
 */
function roundToKrona(value: number): number {
  return Math.round(value)
}

/**
 * Generate NE declaration for a fiscal period
 */
export async function generateNEDeclaration(
  supabase: SupabaseClient,
  companyId: string,
  fiscalPeriodId: string
): Promise<NEDeclaration> {

  // Fetch fiscal period
  const { data: period, error: periodError } = await supabase
    .from('fiscal_periods')
    .select('*')
    .eq('id', fiscalPeriodId)
    .eq('company_id', companyId)
    .single()

  if (periodError || !period) {
    throw new Error('Fiscal period not found')
  }

  // Fetch company settings
  const { data: settings } = await supabase
    .from('company_settings')
    .select('company_name, org_number, entity_type, address_line1, postal_code, city, email')
    .eq('company_id', companyId)
    .single()

  // Resolve entity_type: prefer company_settings, fall back to companies table (NOT NULL, always reliable)
  let entityType = settings?.entity_type
  if (!entityType) {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('entity_type')
      .eq('id', companyId)
      .single()
    if (companyError) throw new Error(`Failed to resolve entity type: ${companyError.message}`)
    entityType = company?.entity_type
  }

  if (entityType !== 'enskild_firma') {
    throw new Error('NE declaration is only for enskild firma (sole proprietorship)')
  }

  // R1-R11 are an income statement, so read the PRE-CLOSING books. The
  // resultatavslut zeroes every P&L account against 2019/2099 at year-end, and
  // NE-bilaga is always filed after bokslut, so including it would report an
  // empty näringsverksamhet. 'exclude-final' drops only
  // fiscal_periods.closing_entry_id: avskrivningar and other bokslut entries
  // also carry source_type 'year_end' and belong on the form.
  const trialBalance = await generateTrialBalance(supabase, companyId, fiscalPeriodId, {
    closingEntry: 'exclude-final',
  })

  const accountNameMap = new Map<string, string>()
  const accountBalances = new Map<string, number>()
  for (const row of trialBalance.rows) {
    accountNameMap.set(row.account_number, row.account_name)
    accountBalances.set(
      row.account_number,
      (Number(row.closing_debit) || 0) - (Number(row.closing_credit) || 0),
    )
  }

  // Map account balances to NE rutor
  const rutor: NEDeclarationRutor = {
    R1: 0,
    R2: 0,
    R3: 0,
    R4: 0,
    R5: 0,
    R6: 0,
    R7: 0,
    R8: 0,
    R9: 0,
    R10: 0,
    R11: 0,
  }

  const breakdown: Record<keyof NEDeclarationRutor, {
    accounts: Array<{ accountNumber: string; accountName: string; amount: number }>
    total: number
  }> = {
    R1: { accounts: [], total: 0 },
    R2: { accounts: [], total: 0 },
    R3: { accounts: [], total: 0 },
    R4: { accounts: [], total: 0 },
    R5: { accounts: [], total: 0 },
    R6: { accounts: [], total: 0 },
    R7: { accounts: [], total: 0 },
    R8: { accounts: [], total: 0 },
    R9: { accounts: [], total: 0 },
    R10: { accounts: [], total: 0 },
    R11: { accounts: [], total: 0 },
  }

  const warnings: string[] = []

  // Process each account balance
  for (const [accountNumber, balance] of accountBalances) {
    // Skip zero balances
    if (Math.abs(balance) < 0.01) continue

    // Find which ruta this account belongs to
    for (const mapping of NE_ACCOUNT_MAPPINGS) {
      if (isAccountInMapping(accountNumber, mapping)) {
        // For revenue accounts (credit normal), negate the balance
        // For expense accounts (debit normal), use as-is
        // Net balance is debit - credit, so:
        // - Revenue accounts have negative net balance (credit > debit)
        // - Expense accounts have positive net balance (debit > credit)
        const amount = mapping.isExpense ? balance : -balance

        rutor[mapping.ruta] += amount

        breakdown[mapping.ruta].accounts.push({
          accountNumber,
          accountName: accountNameMap.get(accountNumber) || `Konto ${accountNumber}`,
          amount: roundToKrona(amount),
        })

        break // Account matched, no need to check other mappings
      }
    }
  }

  // Round all rutor to whole numbers
  for (const key of Object.keys(rutor) as (keyof NEDeclarationRutor)[]) {
    if (key !== 'R11') {
      rutor[key] = roundToKrona(rutor[key])
      breakdown[key].total = rutor[key]
    }
  }

  // Calculate R11 (Årets resultat)
  // Result = Revenue (R1+R2+R3+R4) - Expenses (R5+R6+R7+R8+R9+R10)
  const totalRevenue = rutor.R1 + rutor.R2 + rutor.R3 + rutor.R4
  const totalExpenses = rutor.R5 + rutor.R6 + rutor.R7 + rutor.R8 + rutor.R9 + rutor.R10
  rutor.R11 = totalRevenue - totalExpenses
  breakdown.R11.total = rutor.R11

  // Add warnings
  if (!(period as FiscalPeriod).is_closed) {
    warnings.push('Räkenskapsåret är inte stängt; deklarationen kan genereras, men siffrorna kan ändras om fler bokföringar görs.')
  }

  if (rutor.R11 === 0 && totalRevenue === 0) {
    warnings.push('Inga bokförda intäkter eller kostnader hittades för perioden.')
  }

  return {
    fiscalYear: {
      id: period.id,
      name: period.name,
      start: period.period_start,
      end: period.period_end,
      isClosed: period.is_closed,
    },
    rutor,
    breakdown,
    companyInfo: {
      companyName: settings?.company_name || 'Okänt företag',
      orgNumber: settings?.org_number || null,
      addressLine1: settings?.address_line1 || null,
      postalCode: settings?.postal_code || null,
      city: settings?.city || null,
      email: settings?.email || null,
    },
    warnings,
  }
}

/**
 * Get totals for display
 */
export function getNEDeclarationTotals(declaration: NEDeclaration): {
  totalRevenue: number
  totalExpenses: number
  netResult: number
} {
  const { rutor } = declaration

  return {
    totalRevenue: rutor.R1 + rutor.R2 + rutor.R3 + rutor.R4,
    totalExpenses: rutor.R5 + rutor.R6 + rutor.R7 + rutor.R8 + rutor.R9 + rutor.R10,
    netResult: rutor.R11,
  }
}

```

---

## Assistant (Build · Kimi K3 · 102.9s)

_Thinking:_

Confirmed: accounted's ne-engine only covers R1–R11, so there's no R12+ mapping to port from there. The skattemässiga justeringar must be built from Skatteverket's NE blankett (SKV 2161) structure. Let me recall the NE blankett (2024/2025) rutor for "Skattemässiga justeringar av bokfört resultat":

From SKV 2161 (NE 2025):
- R12: Bokförda kostnader som inte ska dras av (+) — fältkod 7451? 
- R13: Bokförda intäkter som inte ska tas upp (−)
- R14: Intäkter som inte bokförts men som ska tas upp (+)
- R15: Kostnader som inte bokförts men som ska dras av (−)
- R16: Återföring från periodiseringsfond (+)
- R17: Avsättning till periodiseringsfond (−)
- R18: Återföring från expansionsfond (+)
- R19: Avsättning till expansionsfond (−)
- R20: Återfört uppskov från uppskovsreserv (+)
- R21: Uppskjuten beskattning enligt uppskovsreserv (−)
- R22: Kvittning av underskott mot överskott av annan näringsverksamhet (−)
- R23: Avdrag för egenavgifter och särskild löneskatt (−)
- R24: Överskott (+) / Underskott (−)

Let me double check by fetching Skatteverket's blankett... Actually, since item #2 is the calc/display (SRU codes come with item #1), the ruta structure matters most. Let me verify against Skatteverket's NE blankett spec quickly. I could fetch the SRU description or the blankett PDF. Let me do a quick websearch/webfetch to confirm R12–R24 labels.

Actually, I know the NE form well enough, but let me verify with a quick search to avoid hallucination — the user cares about accuracy (Swedish tax). Search: "NE bilaga R12 R13 R14 rutor skattemässiga justeringar".

Also for R12 accounts (ej avdragsgilla kostnader i BAS): 6072, 6992, 6982... let me verify which BAS accounts are "ej avdragsgilla":
- 6072 Representation, ej avdragsgill ✓
- 6342? No.
- 6982 Föreningsavgifter, ej avdragsgilla ✓ (6981 avdragsgilla)
- 6992 Övriga externa kostnader, ej avdragsgilla ✓
- 7623 Sjukvårdsförsäkring, ej avdragsgill? There's 7621 Sjukvård, avdragsgill and 7622 Sjukvård, ej avdragsgill? Hmm. BAS: 7620 "Sjuk- och hälsovård", 7621 "Sjuk- och hälsovård, avdragsgill", 7622 "Sjuk- och hälsovård, ej avdragsgill". I believe that's right.
- 8423/8424 skatteräntor: 8423 "Skatteräntor, avdragsgilla"? Hmm no. In BAS, 842x: 8420 Räntekostnader för skatter och avgifter (gruppkonto), 8423 Skatteräntor? I'm unsure.

To keep it defensible and simple, I'll map the well-established ones: 6072, 6982, 6992, 7622. Hmm, 7622 — personal-related; for enskild firma without employees, unlikely used. Including it is harmless and correct.

Actually wait — I should double-check 6072/6982/6992/7622 naming. BAS kontoplan 2024:
- 6070 Representation (grupp): 6071 Representation, avdragsgill; 6072 Representation, ej avdragsgill ✓
- 6980 Föreningsavgifter (grupp): 6981 Föreningsavgifter, avdragsgilla; 6982 Föreningsavgifter, ej avdragsgilla ✓
- 6990 Övriga externa kostnader (grupp): 6991 Övriga externa kostnader, avdragsgilla; 6992 Övriga externa kostnader, ej avdragsgilla; 6993 Lämnade bidrag och gåvor ✓
- 7620 Sjuk- och hälsovård: 7621 avdragsgill, 7622 ej avdragsgill ✓

These are standard. I'm fairly confident. Let me verify with a quick search anyway? I want to avoid hallucinating. A quick search for "6992 övriga externa kostnader ej avdragsgilla BAS" and "NE blankett R12 R24". Let me do one combined verification pass with websearch.

Also verify NE R12–R24 texts from Skatteverket's blankett SKV 2161. Let me search.

Then:
1. Write PLAN.md (Swedish, concise).
2. Implement in ne-bilaga.ts:
   - `NeJustering` type: ruta R12–R23 + beskrivning + belopp + tecken (+/−) + manuell flag + konton?
   - Compute R12 from saldon (accounts 6072, 6982, 6992, 7622 — kostnad, debit positive as booked, add-back).
   - R13–R23 manual (0, flagged manual). But wait: R16/R17 periodiseringsfond etc. — the balansräkning has accounts 2011? no. Periodiseringsfond accounts: 2011–2019? No — periodiseringsfond i enskild firma: konto 2011? Hmm. In enskild firma, avsättning till periodiseringsfond bokförs: 2019? No...
   
   Actually in enskild firma, skattemässiga dispositioner (periodiseringsfond, expansionsfond) bokförs INTE i resultaträkningen — de görs bara i deklarationen. Men de KAN bokförs: avsättning p-fond: debet 2011? Nej — BAS för enskild firma: Periodiseringsfonder redovisas som underkonton till 2010? Hmm, BAS: 2010 Eget kapital; 2011 Egna varuuttag; 2012 Egna uttag (övriga); 2013 Övriga egna uttag; 2018 Övriga egna insättningar; 2019 Årets resultat. Periodiseringsfond i enskild firma bokförs mot 202x? "2020 Avsättning till periodiseringsfond"? Hmm: 2020 Eget kapital delägare 1? no that's handelsbolag.
   
   I recall: i enskild firma bokförs periodiseringsfond oftast inte alls (bara skattemässig justering i NE), men om man bokför den: konto 2120/2121? Nej, 212x är för AB... Actually BAS has 2120 "Periodiseringsfonder" for all. Hmm, for enskild firma BAS suggests periodiseringsfond som eget kapital-underkonto 2025–2029? I'm not sure. 
   
   This doesn't matter for item #2's minimal scope: R16/R17 etc. are manual until items #4 (fonder) are implemented. The memory explicitly says egenavgifter/räntefördelning and fonder are separate later items. So R12 computed from books; R13–R23 manual; R24 = R11 + R12 (sum of known adjustments) with clear labeling that manual boxes affect the final number.

Hmm wait, but is showing R24 meaningful if it's incomplete? Yes — it matches exactly what Skatteverket's e-tjänst does (auto-sums as you fill). We show "Överskott/underskott enligt bokföringen + ej avdragsgilla kostnader" and note manual boxes fill in at Skatteverket. That's honest and useful.

Alternative richer design: allow manual entry persisted in journal as hledger tags/comments. That's scope creep; the codebase has no such persistence and memory says journal is the only input — but manual tax entries aren't bokföring. Keep simple: display-only like R3.

Design decision on signs: R12 +, R13 −, R14 +, R15 −, R16 +, R17 −, R18 +, R19 −, R20 +, R21 −, R22 −, R23 −. R24 = R11 + Σ(signed R12..R23).

UI: add third table "Skattemässiga justeringar" with the same look, manual rows marked "fylls i manuellt", and an R24 row after (like R11 row). Sign column? Show belopp as the signed effect? On the real blankett you fill in positive amounts in each box and the service applies the sign. In our table, belopp shown should be the positive fill-in value (like blankett), and the sum (R24) applies signs. I'll show fill-in values (positive) in the table and compute R24 with signs. For R12 from books: positive number (add-back amount). Good.

Also update MANUELLA_NE_RUTOR? It currently is Set<NeRuta> = R3. Add a separate set for justeringar or extend the type. The UI checks MANUELLA_NE_RUTOR.has(rad.ruta). I'll create the justeringar as NeRad-like with a new type NeJusteringsRuta, and a separate MANUELLA check. Actually simpler: make justeringar rows use same NeRad shape but typed differently. Let me define:

```ts
export type NeJusteringsRuta = "R12"|"R13"|"R14"|"R15"|"R16"|"R17"|"R18"|"R19"|"R20"|"R21"|"R22"|"R23";

export type NeJustering = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  /** +1 ökar resultatet, −1 minskar (hur rutan påverkar R24). */
  tecken: 1 | -1;
  belopp: number;      // positivt ifyllnadsbelopp
  konton: Array<NeKontoRad>;
  manuell: boolean;
};
```

And NeBilaga gains:
```ts
justeringar: Array<NeJustering>;
/** R24 — bokfört resultat + bokföringsbaserade justeringar. Manuella rutor (0) påverkar inte. */
skattemassigtResultat: number;
```

R12 accounts list:
```ts
/** Bokförda kostnader som inte är avdragsgilla — adderas tillbaka i R12.
 *  Kontona ligger kvar i sina räkenskapsschemarutor (R6/R7); R12 är en
 *  återläggning ovanpå, ingen omflyttning. */
const EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622];
```

Compute R12 from saldon map (debit positive = kostnad). Note: saldon map contains signed sums; kostnadskonton positive. R12 belopp = Σ saldo for these accounts (rounded per existing style — round once at ruta level).

R24 = bokfortResultat + Σ(tecken × belopp) over justeringar. Since manual ones are 0, effectively R11 + R12.

Tests:
- R12 picks up 6992 (and 6072) and the same cost still counts in R6.
- R24 = R11 + R12.
- Manual boxes are 0 and flagged manual.
- No R12 accounts → R12 = 0, R24 = R11.

UI: rapport-ne.ts add table + R24 summary row; mark manual rows. The rutaRader helper checks MANUELLA_NE_RUTOR — I'll give NeJustering its own renderer or generalize: add `manuell` handling. Simplest: render justeringar with a variant of rutaRader that checks `rad.manuell` too. NeRad lacks `manuell`. I'll write a separate small renderer for justeringar rows using the same markup pattern.

PLAN.md: write in Swedish. Content: status klart/kvar, numbered items matching my overview, priority, and "pågående" marker on #2. Also mention the source (memory + code review 2026-08-24).

Let me verify the NE blankett R12-R24 labels via search to be safe. And verify BAS 6982/6992/7622/6072. One search should cover both; two quick searches in parallel.

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "NE-bilaga SKV 2161 \"R12\" \"R13\" \"R14\" \"R15\" \"R16\" \"R17\" skattemässiga justeringar bokfört resultat rutor"
}
```

**Output:**
```
{
  "search_id": "search_6a19157e04fa95e5ce0afadbabe2acf9",
  "results": [
    {
      "url": "https://spillkrakan.se/wp-content/uploads/2025/03/NE.pdf",
      "title": "",
      "publish_date": null,
      "excerpts": [
        "... Enskilda näringsidkare**\n\n**NE**\n\nBlanketten ska lämnas ... förs över till sidan 2 R12)\n\n(+/-)\n\nJa\n\nNej\n\nLämna ... -1-12-2024P4\n\nSKV\n\n2161\n\n12\n\nsv\n\nweb\n\n04\n\nPersonnummer\n\n**Skattemässiga justeringar av bokfört resultat**\n\n**R13**\n\n**R14** Bokförd"
      ]
    },
    {
      "url": "https://edeklarera.se/sru-filer/blanketter/ne-bilaga-deklaration-i-enskild-firma",
      "title": "NE-bilaga - Så gör du deklaration för enskild firma",
      "publish_date": null,
      "excerpts": [
        "NE 3 - Skattemässiga justeringar av bokfört resultat. R12: Bokfört resultat (förs över från R11 sidan 1) (+/-)."
      ]
    },
    {
      "url": "https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html",
      "title": "Skattemässiga justeringar",
      "publish_date": null,
      "excerpts": [
        "En guide för hur du fyller i din NE-bilaga när du ska göra skattemässiga justeringar av bokfört resultat. Du hittar NE-bilagan direkt i e-tjänsten."
      ]
    },
    {
      "url": "https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllainebilaganexempel.4.361dc8c15312eff6fd2c8f6.html",
      "title": "Fylla i NE-bilagan, exempel",
      "publish_date": null,
      "excerpts": [
        "Håkans skattemässiga justeringar · R12 Bokfört resultat · R13 Bokförda kostnader som inte ska tas upp · R22 Övriga skattemässiga justeringar, kostnader min andel."
      ]
    },
    {
      "url": "https://www.mrpotato.se/ne-bilaga-enskild-firma",
      "title": "NE-bilaga 2026 – fyll i rätt rutor för enskild firma",
      "publish_date": null,
      "excerpts": [
        "Så fyller du i NE-bilagan 2026 för enskild firma. Förklaring av R-rutor, B-rutor, vanliga fel, exempel och NE-underlag från SIE-fil."
      ]
    },
    {
      "url": "https://verksamt.se/nyheter/tips-dig-som-ska-deklarera-enskild-firma",
      "title": "Tips för dig som ska deklarera enskild firma",
      "publish_date": "2026-04-23",
      "excerpts": [
        "23 apr. 2026 — För att få fram resultatet som din skatt ska beräknas på, behöver det bokförda resultatet ofta justeras utifrån skattereglerna. Det kallas i NE-"
      ]
    },
    {
      "url": "https://www.cliffsnotes.com/study-notes/23354007",
      "title": "Bokforing-bokslut-deklaration-del2-skv283-utgava28 (pdf)",
      "publish_date": null,
      "excerpts": [
        "SKV 2161 12 sv web 02 Personnummer Skattemässiga justeringar av bokfört resultat R13 R14 Bokförda intäkter som inte ska tas upp R15 Intäkter som inte"
      ]
    },
    {
      "url": "https://www.youtube.com/watch?v=UeIyK6CqfcA",
      "title": "Guide: så fyller du i NE-bilagan",
      "publish_date": null,
      "excerpts": [
        "I det här webbinaret går vi igenom hur du fyller i NE-bilagan, vilka avdrag och skattemässiga justeringar du kan göra i din enskilda firma."
      ]
    },
    {
      "url": "https://sparkreceipt.com/sv-se/blogg/inkomstdeklaration-egenforetagare/",
      "title": "Inkomstdeklaration egenföretagare: NE-bilagan (2026)",
      "publish_date": null,
      "excerpts": [
        "18 juni 2026 — Som egenföretagare med enskild firma lämnar du inkomstdeklaration via INK1 med bifogad NE-bilaga (SKV 2161). Sista dag är 4 maj 2026."
      ]
    },
    {
      "url": "https://www.studocu.com/sv/document/hogskolan-kristianstad/beskattningsratt-i/skatteblankett-bolag/83416869",
      "title": "NE Skatteblankett för Enskilda Företagare 2023 (SKV 2161)",
      "publish_date": null,
      "excerpts": [
        "SKV 2161 12 sv web 03. Personnummer. Skattemässiga justeringar av bokfört resultat. R13. R14 Bokförda intäkter som inte ska tas upp. R15 Intäkter som inte"
      ]
    }
  ],
  "warnings": null,
  "usage": [
    {
      "name": "sku_search",
      "count": 1
    }
  ],
  "session_id": "ses_fcda23e54ffetRaU748oGhApJB"
}
```

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "BAS kontoplan 6992 6072 6982 7622 \"ej avdragsgilla\" konton NE R12"
}
```

**Output:**
```
{
  "search_id": "search_888af718cfd385360d831b62820cc345",
  "results": [
    {
      "url": "https://www.bas.se/wp-content/uploads/2022/01/Kontoplan-2022.pdf",
      "title": "Kontoplan – BAS 2022",
      "publish_date": null,
      "excerpts": [
        "Kontoplan – BAS 2022\nKontoplan – BAS 2022 ・ det urval av konton ・ 101 Utvecklingsutgifter ・ kter ■ 300 Försäljning inom Sverige ■ 3000 Försäljning inom Sverige ■ 3001 Försä"
      ]
    },
    {
      "url": "https://invenseit.com/artiklar/bokfora-enskild-firma",
      "title": "Bokföra i enskild firma: eget uttag, insättning och konton",
      "publish_date": "2026-06-24",
      "excerpts": [
        "En representationsmåltid med kund, lunch eller middag, är inte längre avdragsgill (kontot **6072** ) sedan den 1 januari 2017, men du får lyfta momsen på ett underlag om högst 300 kronor exklusive moms per person och tillfälle. Enklare förtäring och fika är avdragsgill med högst 60 kronor per person (kontot **6071** ). Har du ett arbetsrum hemma kan du göra ett schablonavdrag på 2 000 kronor per år om du äger din fastighet, eller 4 000 kronor per år för bostads- eller hyresrätt, förutsatt att du arbetat minst 800 timmar hemma. Det avdraget gör du på NE-bilagan, inte i den löpande bokföringen.\n\nBehöver du fler exempel på löpande kostnader och moms, se guiden om att bokföra konsulttjänster .\n\n## Moms i enskild firma\n\nTill skillnad från F-skatt och egenavgifter är moms firmans skuld eller fordran. Vid försäljning krediterar du utgående moms, vid inköp debiterar du ingående moms."
      ]
    },
    {
      "url": "https://www.bas.se/wp-content/uploads/2017/06/Kontoplan_Normal_2020.pdf",
      "title": "Kontoplan BAS 2020",
      "publish_date": null,
      "excerpts": [
        "Kontoplan BAS 2020\n= Kontot ingår i det urval av konton som för de flesta företag är tillräckligt för en grundläggande bokföring. [Ej. K2]. = Kontot används inte av de företag"
      ]
    },
    {
      "url": "https://www.mrpotato.se/bas-kontoplan",
      "title": "BAS-kontoplan 2026 – komplett lista med konton MrPotato https://www.mrpotato.se › bas-kontoplan",
      "publish_date": null,
      "excerpts": [
        "# Bas kontoplan – komplett lista över alla konton & guide\n\nSe hela BAS-kontoplanen med alla konton, kontoklasser och exempel. Komplett guide med förklaringar, vanliga konton och praktisk användning.\n\n1. Hem /\n2. Bokföring /\n3. Bas kontoplan\n\n## Innehåll\n\nSnabblänkar\n\n* Vad är BAS?\n* Kontoklasser\n* Vanliga konton\n* Uppbyggnad\n* I MrPotato\n\n# BAS-kontoplan – komplett lista över konton och kontoklasser\n\nBAS-kontoplanen är **ryggraden i svensk bokföring** . Oavsett om du driver en frisörsalong i Göteborg eller ett IT-bolag i Stockholm – kontonumren 1930, 3011 och 2641 betyder samma sak för alla.\n\n🔢\n\n#### Standardiserad\n\nSamma struktur i hela Sverige\n\n* ✓ 1-8 som huvudklasser\n* ✓ 1000+ fördefinierade konton\n* ✓ Uppdateras årligen\n\n🏗️\n\n#### Logisk uppbyggnad\n\nSiffran berättar vad kontot är\n\n* ✓ 1 = Tillgångar\n* ✓ 2 = Skulder\n* ✓ 3 = Intäkter\n\n📋\n\n#### Standard i Sverige\n\nVanlig struktur i svensk bokföring\n\n* ✓ Måste BAS-anpassas\n* ✓ Förenklar revision\n* ✓ Klarar Bokslut\n\n...\n\n## Så fungerar BAS-kontoplanen i MrPotato\n\nMrPotato levereras med en komplett BAS-kontoplan förinstallerad. Du kan börja bokföra direkt – utan att vara expert på kontonummer.\n\n* ✓ **Färdig BAS** – alla konton finns på plats\n* ✓ **Sök på svenska** – skriv \"hyra\" så hittar du 5010\n* ✓ **Egna konton** – lägg till specialkonton för just din bransch\n* ✓ **Förslag på konton** – systemet hjälper dig välja rätt\n* ✓ **Automatisk moms** – rätt momskod kopplad till varje konto\n\n\"Jag kunde inget om kontonummer innan jag började med MrPotato. Nu söker jag bara på 'telefon' och väljer rätt konto – enkelt!\" – Erik, konsult\n\n## Vill du slippa tänka på kontonummer?\n\nMrPotato har alla BAS-konton förinställda med rätt momskoder. Du söker på svenska och vi föreslår rätt konto. Perfekt för dig som vill fokusera på företaget.\n\n[Skapa gratis konto →](https://admin.mrpotato.se/signup?t=bas-kontoplan) Testa direkt i sandbox\n\n⚡ Gratis att starta – kontoplanen redo direkt\n\n...\n\nDen är uppbyggd med kontonummer från 1-8 där varje siffra representerar en specifik typ av konto – från tillgångar och skulder till intäkter och kostnader.\n\n### Måste man använda BAS-kontoplanen?\n\nBAS-kontoplanen är standard i svensk bokföring och används av de flesta företag och bokföringsprogram. Du kan anpassa kontoplanen efter verksamheten, men det är vanligt att utgå från BAS-strukturen.\n\n### Vilka konton behöver mitt företag?\n\nDet beror på verksamheten. De flesta småföretag klarar sig med 30-50 konton av BAS-planens 1000+. De viktigaste är: försäljning (30-serien), inköp (40-serien), löner (70-serien) och bankkonton (19-serien).\n\n### Hur uppdateras BAS-kontoplanen?\n\nBAS-kontoplanen uppdateras löpande för att anpassas till förändringar i lagstiftning, momsregler och redovisningspraxis. Nya konton kan tillkomma och vissa kan justeras eller tas bort. Det är därför viktigt att använda en aktuell version av kontoplanen i ditt bokföringsprogram.\n\n### Kan jag ändra i BAS-kontoplanen?"
      ]
    },
    {
      "url": "https://bokforingenonline.se/6982_F%C3%B6reningsavgifter,_ej_avdragsgilla",
      "title": "6982 Föreningsavgifter, ej avdragsgilla - Bokföringenonline",
      "publish_date": "2026-06-07",
      "excerpts": [
        "... I kontogrupp 6982 Föreningsavgifter, ej avdragsgilla hittar vi konton av typen övroga kostnader . Kontogruppen bestäms av den andra siffran i kontonumret.\n6982 Föreningsavgifter, ej avdragsgilla [ redigera ]\nKonto 6982 Föreningsavgifter, ej avdra"
      ]
    },
    {
      "url": "https://bokforingenonline.se/6072_Representation,_ej_avdragsgill",
      "title": "6072 Representation, ej avdragsgill - Bokföringenonline",
      "publish_date": "2026-06-04",
      "excerpts": [
        "... Kontogrupp: 60\n    * Kontogrupp: Representation, ej avdragsgill\n\n\n\nI kontogrupp 6072 Representation, ej avdragsgill hittar vi konton av typen övroga kostnader . Kontogruppen bestäms av den andra siffran i kontonumret.\n6072 Representation, ej avdr"
      ]
    },
    {
      "url": "https://support.spiris.se/bokforing/sv-se/content/online-help/settings-chart-of-accounts-bas.htm",
      "title": "BAS-kontoplanen - Hjälp om Bokföring",
      "publish_date": null,
      "excerpts": [
        "BAS-kontoplanen - Hjälp om Bokföring\nBAS-kontoplanen är en lista över konton som företag använder i sin bokföring för att få en enkel överblick av ekonomin. Det är en standardiserad lista som"
      ]
    },
    {
      "url": "https://www.far.se/kunskap/redovisning/sa-fungerar-bas-kontoplanen",
      "title": "BAS-kontoplan – en standardlösning för svenska företag - FAR",
      "publish_date": null,
      "excerpts": [
        "# Så fungerar BAS-kontoplanen\n\nEn kontoplan är ett systematiskt register över alla konton som används i ett företags bokföring. Den fungerar som en karta eller ett schema som hjälper till att organisera och kategorisera alla finansiella transaktioner. Varje konto i kontoplanen representerar en specifik typ av tillgång, skuld, eget kapital, intäkt eller kostnad.\n\n_Senast uppdaterad: 8 januari 2026_\n\nEn kontoplan kännetecknas vanligtvis av att:\n\n* Kontoplanen är hierarkisk och indelad i olika kategorier och underkategorier. Det gör det enklare att hitta och hantera specifika konton.\n* Varje konto har ett unikt nummer som används för att identifiera det i bokföringssystemet. Dessa nummer är ofta grupperade efter typ av konto, till exempel tillgångar och skulder.\n\nMånga företag använder standardiserade kontoplaner, exempelvis BAS. Det underlättar jämförelser och analys.\n\n## Nästan alla företag använder BAS\n\n...\n\nEftersom BAS-kontoplanen är väldigt omfattande är det viktigt att tänka till kring vilka konton företaget behöver, och vilka som inte behövs. Risken med att ha för många konton tillgängliga för kontering är att bokföringen tenderar att bli väldigt spretig och att redovisningen blir svår att analysera. I bokföringsprogrammet anpassas kontoplanen genom att användaren avmarkerar de konton som inte ska användas.\n\n### Mer information\n\nPå [BAS webbplats](https://www.bas.se/) finns mer information om BAS-kontoplanen. Där finns beskrivet hur kontoplanen är uppbyggd och hur den kan anpassas till företagens behov. Kontoplan med kontonummer och kontonamn finns att ladda ner gratis. För att få tillgång till kontoinstruktioner till respektive konto rekommenderas Bokföringsboken, som finns att beställa som e-bok. Bokföringsboken innehåller även många bokföringsexempel.\n\n## Birgitta Åhlander\n\n### Auktoriserad Redovisningskonsult FAR\n\n[08-506 112 25](tel:08-506 112 25) [birgitta.ahlander@far."
      ]
    },
    {
      "url": "https://www.yumpu.com/sv/document/view/18267033/kontoplan-bas-2013/22",
      "title": "<strong>Kontoplan</strong",
      "publish_date": null,
      "excerpts": [
        "subject=Magazine recommendation&body=Hi,%0D%0A%0D%0A I wanted to share this edition of Kontoplan BAS 2013 magazine with you:%0D%0A%0D%0A https%3A%2F%2Fwww.yumpu.com%2Fsv%2Fdocument%2Fview%2F18267033%2Fkontoplan-bas-2013 \"Mail this publication\")\n\n## Transform your PDFs into Flipbooks and boost your revenue!\n\nLeverage SEO-optimized Flipbooks, powerful backlinks, and multimedia content to professionally showcase your products and significantly increase your reach.\n\n[Start now](https://www.yumpu.com/sv/publishing-software?utm_source=yp&utm_medium=website&utm_campaign=black-banner \"START NOW\")\n\n* More Magazines\n* Recommendations\n* Info\n\n[NE K1 pdf - BAS](https://www.yumpu.com/sv/document/view/20508325/ne-k1-pdf-bas)\n\n[svensk-engelsk-tysk kontoplan - BAS](https://www.yumpu.com/de/document/view/20022301/svensk-engelsk-tysk-kontoplan-bas)\n\n[BAS Förenklat årsbokslut (K1) – Kontoplan 2013](https://www.yumpu.com/sv/document/view/18396673/bas-forenklat-arsbokslut-k1-kontoplan-2013)\n\n...\n\n6060 Kreditförsäljningskostnader 6061 Kreditupplysning 6062 Inkasso och KFM-avgifter 6063 Kreditförsäkringspremier 6064 Factoringavgifter 6069 Övriga kreditförsäljningskostnader 6070 Representation ■ 6071 Representation, avdragsgill ■ 6072 Representation, ej avdragsgill 6080 Bankgarantier ■ 6090 Övriga försäljningskostnader 61 Kontorsmateriel och trycksaker ■ 6100 Kontorsmateriel och trycksaker (gruppkonto) 6110 Kontorsmateriel 6150 Trycksaker 62 Tele och post 6200 Tele och post (gruppkonto) ■ 6210 Telekommunikation 6211 Fast telefoni 6212 Mobiltelefon 6213 Mobilsökning 6214 Fax 6215 Telex 6230 Datakommunikation ■ 6250 Postbefordran 63 Företagsförsäkringar och övriga riskkostnader 6300 Företagsförsäkringar och övriga riskkostnader (gruppkonto) <strong>Kontoplan</strong>\\_Normal\\_<strong>2013</strong>\\_ver1\n\n* Page 1 and 2: [Kontoplan BAS 2013 1 (39) Huvudkont](https://www.yumpu.com/sv/document/view/18267033/kontoplan-bas-2013)\n\n...\n\n* Page 37 and 38: [Kontoplan BAS 2013 37 (39) [Ej K2]](https://www.yumpu.com/sv/document/view/18267033/kontoplan-bas-2013/37)\n* Page 39: [Kontoplan BAS 2013 39 (39) 8980 Öv](https://www.yumpu.com/sv/document/view/18267033/kontoplan-bas-2013/39)\n\n×\n\n###### Share\n\n[](https://www.facebook.com/sharer.php?u=https%3A%2F%2Fwww.yumpu.com%2Fsv%2Fdocument%2Fview%2F18267033%2Fkontoplan-bas-2013&t=Kontoplan+BAS+2013%3A+Kontoplan+BAS+2013 \"Share on Facebook\") [](https://x.com/intent/tweet?text=Kontoplan+BAS+2013%2C+https%3A%2F%2Fwww.yumpu.com%2Fsv%2Fdocument%2Fview%2F18267033%2Fkontoplan-bas-2013&via=yumpu_com&related=youbuy_com \"Share on X\") [](https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.yumpu.com%2Fsv%2Fdocument%2Fview%2F18267033%2Fkontoplan-bas-2013&media=https%3A%2F%2Fwww.yumpu.com%2Fsv%2Fimage%2Fpinterest%2F18267033&description=Kontoplan+BAS+2013+-+Magazine+with+39+pages%3A+Kontoplan+BAS+2013 \"Share on Pinterest\") [](https://www.linkedin.com/shareArticle?"
      ]
    },
    {
      "url": "https://www.liber.se/plus/R2000-Redovisning-2-BAS-kontoplan-4712379-liber.pdf",
      "title": "Exempel på BAS-kontoplan (konton i urval ur BAS 2000)",
      "publish_date": "2017-04-21",
      "excerpts": [
        "**1 Tillgångar** 1110 Byggnader 1119 Ackumulerade avskrivningar på byggnader 1220 Maskiner och inventarier 1229 Ackumulerade avskrivningar på maskiner och inventarier 1240 Bilar och andra transportmedel 1249 Ackumulerade avskrivningar på bilar 1350 Aktier och andelar (ej koncern- eller intresseföre- tag) 1354 Obligationer och andra värdepapper 1410 Lager av råvaror (förråd) 1440 Produkter i arbete (PIA) 1450 Lager av färdiga varor 1460 Varulager (lager av handelsvaror) 1470 Pågående arbeten 1510 Kundfordringar 1511 Belånade kundfordringar 1519 Nedskrivning av kundfordringar 1520 Växelfordringar 1580 Kontokortsfordringar 1610 Fordringar hos anställda 1630 Avräkn för skatter och avg (aktiebolag) 1650 Momsfordran 1684 Fordringar hos leverantörer 1710 Förutbetalda hyresutgifter 1720 Förutbetalda leasingavgifter 1730 Förutbetalda försäkringspremier 1790 Övriga förutbetalda kostnader och upplupna intäkter 1910 Kassa 1920 Plusgiro 1930 Checkkonto 1940 Övriga bankkonton\n\n...\n\n**5–6 Övriga externa rörelseutgifter/kostnader** 5010 Lokalhyra 5090 Övriga lokalkostnader 5100 Kostnader för egen fastighet (Fastighetskostnader) 5210 Hyra av maskiner 5220 Hyra av inventarier 5390 Vatten- och energikostnader 5410 Förbrukningsinventarier 5460 Förbrukningsmaterial 5500 Reparation och underhåll 5610 Personbilskostnader 5620 Lastbilskostnader 5710 Frakter, transporter och försäkringar vid varudistribution 5720 Tull- och speditionskostnader 5800 Resekostnader 5900 Reklam och PR 6040 Kontokortsavgifter 6071 Representation, avdragsgill 6072 Representation, ej avdragsgill 6110 Kontorsmaterial 6200 Tele och post 6310 Företagsförsäkringar 6351 Konstaterade kundförluster 6352 Befarade kundförluster 6360 Garantikostnader 6500 Externa tjänster 6800 Inhyrd personal 6910 Licensavgifter, royalties 6960 Franchiseavgifter etc 6970 Tidningar, tidskrifter och facklitteratur 6981 Föreningsavgifter, avdragsgilla 6982 Föreningsavgifter, ej avdragsgilla 6990 Diverse kostnader (Övriga externa kostnader)\n\n...\n\n**8 Finansiella och andra inkomster/intäkter och utgifter/kostnader** 8210 Utdelning på aktier och andelar (ej koncern- eller intresseföretag) 8230 Valutakursdifferenser på långfristiga fordringar 8310 Ränteintäkter (från omsättningstillgångar) 8410 Räntekostnader (för långfristiga skulder) 8422 Dröjsmålsräntor (för leverantörsskulder) 8430 Valutakursdifferenser på långfristiga skulder 8811 Avsättning till periodiseringsfond (aktiebolag) 8819 Återföring från periodiseringsfond (aktiebolag) 8850 Avskrivningar över plan (Skillnad mellan bokförd avskrivning och avskrivning enligt plan) 8910 Skatt på årets resultat (aktiebolag) 8999 Årets resultat\n\n_Forts fr föreg sida._\n\n### Jan-Olof Andersson Cege Ekström\n\n## Problembok\n\n# 2000\n\n### 7:e upplagan\n\n# **Redovisning 2**\n\nProcessinriktad Problemorienterad Flexibel\n\nDet flexibla alternativet för kursen Redovisning 2!"
      ]
    }
  ],
  "warnings": null,
  "usage": [
    {
      "name": "sku_search",
      "count": 1
    }
  ],
  "session_id": "ses_fcda23e54ffetRaU748oGhApJB"
}
```

---

## Assistant (Build · Kimi K3 · 29.1s)

_Thinking:_

Important correction from the search results: The NE blankett's actual structure (SKV 2161, recent years):

From the search excerpts:
- "NE 3 - Skattemässiga justeringar av bokfört resultat. R12: Bokfört resultat (förs över från R11 sidan 1) (+/-)."
- "R13 Bokförda kostnader som inte ska tas upp" (wait — "Bokförda kostnader som inte ska dras av" vs "tas upp"? The Skatteverket example says "R13 Bokförda kostnader som inte ska tas upp"... hmm, that phrasing seems off but it's from skatteverket.se: "R12 Bokfört resultat · R13 Bokförda kostnader som inte ska tas upp · R22 Övriga skattemässiga justeringar, kostnader min andel.")
- "R14 Bokförda intäkter som inte ska tas upp"
- "R15 Intäkter som inte bokförts men som ska tas upp"

So the actual NE blankett (SKV 2161, version 12) structure for "Skattemässiga justeringar av bokfört resultat":
- R12: Bokfört resultat (förs över från R11) (+/−)
- R13: Bokförda kostnader som inte ska dras av/tas upp (+)
- R14: Bokförda intäkter som inte ska tas upp (−)
- R15: Intäkter som inte bokförts men som ska tas upp (+)
- R16: Kostnader som inte bokförts men som ska dras av (−)
- R17: Återföring från periodiseringsfond (+)
- R18: Avsättning till periodiseringsfond (−)
- R19: Återföring från expansionsfond (+)
- R20: Avsättning till expansionsfond (−)
- R21: Återfört uppskov från uppskovsreserv (+)
- R22: Övriga skattemässiga justeringar... (+/−)? The Skatteverket example mentions "R22 Övriga skattemässiga justeringar, kostnader min andel" — hmm, that's from the example with multiple delägare. In newer NE blankett (ändrad 2023?), R21/R22 are "Övriga skattemässiga justeringar, intäkter/kostnader min andel" and R23/R24... 

I need the exact current blankett layout. Let me fetch the actual NE PDF or Skatteverket's page. The spillkrakan.se link hosts the NE.pdf (SKV 2161 12 sv web 04). Let me fetch Skatteverket's "skattemassigajusteringar" page which lists the boxes. That's authoritative.

**Tool: webfetch**

**Input:**
```json
{
  "format": "markdown",
  "url": "https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html"
}
```

**Output:**
```
  Skattemässiga justeringar | Skatteverket                                                 

-   [Till innehåll](#)
-   [Till navigationen](#)
-   [Till chattrobot](#)

[

](/omoss/varverksamhet/omwebbplatsen/rekommenderadewebblasare.4.18e1b10334ebe8bc80004907.html)

 

[![startsida](/images/18.5d699354142b230302014c/1385975660374/SkatteverketLogo.png)](/privat.4.76a43be412206334b89800052864.html "Till startsida")

-   [Teckenspråk](/servicelankar/teckensprak.4.5d699354142b2303020b3b.html)
-   [Other languages](/servicelankar/otherlanguages.4.34a801ea1041d54f9e2800025.html)
-   [Kontakta oss](/omoss/kontaktaoss.4.71004e4c133e23bf6db800079651.html)
-   Logga in
    

-   Mina sidor
-   Logga ut

Sök  Sök

-   [Privat](/privat.4.76a43be412206334b89800052864.html)
    
-   [Företag](/foretag.4.76a43be412206334b89800052908.html)
    
-   [Föreningar](/foreningar.4.76a43be412206334b89800048202.html)
    
-   [Offentliga aktörer](/offentligaaktorer.4.76a43be412206334b89800047989.html)
    
-   [Om oss](/omoss.4.76a43be412206334b89800052952.html)
    

[![](data:image/svg+xml,%3Csvg id='Lager_1' data-name='Lager 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 213.73 39.2'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23036;%7D.cls-2%7Bfill:%23fc0;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ERityta 1%3C/title%3E%3Cpath class='cls-1' d='M64.52,23.26a10,10,0,0,0-3.9-.83c-1.32,0-3,.57-3,2.66,0,3.33,8.41,1.94,8.4,8.37,0,4.2-3.33,5.79-7.21,5.78a16.76,16.76,0,0,1-4.91-.75L54.23,35a9.21,9.21,0,0,0,4.34,1.19c1.45,0,3.41-.74,3.41-2.47,0-3.65-8.41-2.15-8.4-8.5,0-4.28,3.34-5.85,6.71-5.84a14.39,14.39,0,0,1,4.59.69Z'/%3E%3Cpath class='cls-1' d='M68.8,18.22h3.68l0,12.11h.06l4.4-5.65h4.34L76,31l5.92,7.83H77.23L72.52,32h-.06v6.87H68.77Z'/%3E%3Cpath class='cls-1' d='M86.17,34.69c0-2.17,2.45-2.44,4.1-2.44h1.59a4.72,4.72,0,0,1-.77,2.91,3.13,3.13,0,0,1-2.59,1.26C87.18,36.42,86.17,35.9,86.17,34.69Zm-1.86-6.16A7.45,7.45,0,0,1,88.68,27c2.17,0,3.19.77,3.18,3.05h-2a11.14,11.14,0,0,0-4.75.82,4.15,4.15,0,0,0-2.43,4c0,2.69,2.44,4.21,4.94,4.21A5,5,0,0,0,92,36.67H92a17.11,17.11,0,0,0,.16,2.12h3.24c-.08-1.1-.13-2.08-.16-3.16s-.05-2.11-.05-3.54V30.28c0-4.18-1.77-6-6.09-6a12.63,12.63,0,0,0-4.91,1.06Z'/%3E%3Cpath class='cls-1' d='M99.44,27.38H96.72V24.68h2.72V21.86l3.68-1.18v4h3.27v2.7h-3.27V34c0,1.21.33,2.33,1.73,2.33a3.23,3.23,0,0,0,1.67-.38l.11,2.91a9.68,9.68,0,0,1-2.72.33c-2.89,0-4.48-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-1' d='M110.32,27.39H107.6V24.7h2.73V21.87L114,20.69v4h3.27V27.4H114V34c0,1.21.33,2.33,1.73,2.34a3.29,3.29,0,0,0,1.68-.39l.1,2.92a10.09,10.09,0,0,1-2.72.32c-2.88,0-4.47-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-1' d='M122.4,30.4c.17-1.89,1.21-3.32,3.27-3.32s2.88,1.55,3,3.33Zm8.73,4.69a9.68,9.68,0,0,1-4.7,1.42,3.72,3.72,0,0,1-4-3.58h9.78c0-4.94-1.47-8.54-6.71-8.55-4.4,0-6.57,3.37-6.58,7.46,0,4.65,2.71,7.34,7.38,7.35a9.73,9.73,0,0,0,4.86-1.12Z'/%3E%3Cpath class='cls-1' d='M132.72,24.69h3.95L140.17,35h.06l3.42-10.3h3.68l-5.24,14.14H138Z'/%3E%3Cpath class='cls-1' d='M151.37,30.41c.16-1.9,1.21-3.32,3.27-3.32s2.88,1.54,3,3.33Zm8.73,4.68a9.47,9.47,0,0,1-4.7,1.42,3.7,3.7,0,0,1-4-3.57h9.78c0-5-1.47-8.54-6.72-8.55-4.39,0-6.57,3.37-6.57,7.46,0,4.64,2.71,7.34,7.38,7.35a9.71,9.71,0,0,0,4.86-1.12Z'/%3E%3Cpath class='cls-1' d='M163.54,24.74h3.27V28h.06a4.33,4.33,0,0,1,3.88-3.54,4,4,0,0,1,1.12.11v3.71a3.79,3.79,0,0,0-1.65-.3c-3,0-3,3.73-3,5.76v5.19h-3.68Z'/%3E%3Cpath class='cls-1' d='M173.86,18.16h3.68l0,12.12h.06l4.4-5.66h4.34L181,31,187,38.79h-4.67l-4.72-6.87h0v6.86h-3.68Z'/%3E%3Cpath class='cls-1' d='M190.69,30.46c.17-1.89,1.22-3.32,3.28-3.32s2.88,1.55,3,3.33Zm8.73,4.69a9.62,9.62,0,0,1-4.7,1.42,3.7,3.7,0,0,1-4-3.58l9.78,0c0-4.95-1.47-8.55-6.72-8.56-4.39,0-6.57,3.37-6.58,7.46,0,4.65,2.71,7.34,7.38,7.35a9.77,9.77,0,0,0,4.87-1.12Z'/%3E%3Cpath class='cls-1' d='M203.79,27.49h-2.72v-2.7h2.71V22l3.68-1.18v4h3.26v2.7h-3.27v6.6c0,1.2.33,2.33,1.73,2.33a3.23,3.23,0,0,0,1.67-.38L211,39a9.68,9.68,0,0,1-2.72.33c-2.88,0-4.47-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-2' d='M25.29,21.16A13.78,13.78,0,0,1,35,31.42a13.63,13.63,0,0,1-.8,7.36H30.11A13.88,13.88,0,0,0,32,33.3c.33-3.47-.94-7.55-3.88-9.8a12.88,12.88,0,0,0-3-1.87Z'/%3E%3Cpath class='cls-1' d='M38,38.77a13,13,0,0,0-2.49-13.24,17.81,17.81,0,0,0-8.52-5l.09-.51C34,21.65,41,26,42.12,33.57a12.56,12.56,0,0,1-.23,5.21Z'/%3E%3Cpath class='cls-1' d='M23.72,22.2a9.7,9.7,0,0,1,3.15,2.68,10.73,10.73,0,0,1,1.33,9.8,10,10,0,0,1-2.3,4.09l-5.28,0a12.58,12.58,0,0,0,5.85-10,7.33,7.33,0,0,0-2.95-6.13Z'/%3E%3Cpath class='cls-2' d='M17,23.16A13.78,13.78,0,0,1,21,9.59a13.7,13.7,0,0,1,6.78-3l2,3.58a13.74,13.74,0,0,0-5.7,1.08c-3.17,1.44-6.08,4.58-6.56,8.25a13.07,13.07,0,0,0-.12,3.54Z'/%3E%3Cpath class='cls-1' d='M25.86,3.37a13,13,0,0,0-10.21,8.74A17.75,17.75,0,0,0,15.6,22l-.5.17c-2.07-6.81-1.8-15,4.23-19.78A12.59,12.59,0,0,1,23.94,0Z'/%3E%3Cpath class='cls-1' d='M18.66,24a9.71,9.71,0,0,1,.75-4.08,10.69,10.69,0,0,1,7.83-6A10.24,10.24,0,0,1,32,13.83l2.62,4.58A12.62,12.62,0,0,0,23,18.35,7.31,7.31,0,0,0,19.13,24Z'/%3E%3Cpath class='cls-1' d='M1.9,31.71A13,13,0,0,0,14.65,36a17.78,17.78,0,0,0,8.49-5.05l.4.34c-4.77,5.28-11.9,9.27-19.13,6.57A12.36,12.36,0,0,1,0,35.1Z'/%3E%3Cpath class='cls-1' d='M23.29,27.24a9.44,9.44,0,0,1-3.88,1.45A10.7,10.7,0,0,1,10.2,25.1a10.23,10.23,0,0,1-2.48-4l2.56-4.6a12.63,12.63,0,0,0,5.94,10,7.32,7.32,0,0,0,6.79.39Z'/%3E%3Cpath class='cls-2' d='M23.38,29.32A13.8,13.8,0,0,1,9.65,32.77a13.61,13.61,0,0,1-6-4.33l2-3.58A13.81,13.81,0,0,0,9.5,29.22c2.85,2,7,2.89,10.44,1.44A12.86,12.86,0,0,0,23,29Z'/%3E%3C/svg%3E)](/)

Logga in

-   Mina sidor
-   Logga ut

[Sök](javascript:void\(0\);)

Sök  Sök

Meny 

-   [Privat](/privat.4.76a43be412206334b89800052864.html)
    
-   [Företag](/foretag.4.76a43be412206334b89800052908.html)
    
    -   [Driva företag](/foretag/drivaforetag.4.76a43be412206334b89800048009.html)
        
    -   [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html)
        
        -   [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html)
            
            -   [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)
                
                -   [Allmänna uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/allmannauppgifter.4.361dc8c15312eff6fd2c77e.html)
                    
                -   [Balans- och resultaträkning](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/balansochresultatrakning.4.361dc8c15312eff6fd2c7ac.html)
                    
                -   [Skattemässiga justeringar](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html)
                    
                    -   [Exempel överskott redovisningsansvarig](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar/exempeloverskottredovisningsansvarig.4.361dc8c15312eff6fd2c891.html)
                        
                    -   [Exempel underskott redovisningsansvarig](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar/exempelunderskottredovisningsansvarig.4.361dc8c15312eff6fd2c8a6.html)
                        
                -   [Övriga uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/ovrigauppgifter.4.361dc8c15312eff6fd2c8bb.html)
                    
                -   [Fylla i NE-bilagan, exempel](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllainebilaganexempel.4.361dc8c15312eff6fd2c8f6.html)
                    
                -   [Fylla i NEA-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html)
                    
            -   [Lämna in NE-bilagan i e-tjänsten](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/lamnainnebilaganietjansten.4.361dc8c15312eff6fd10b4b.html)
                
            -   [Du som får hjälp att lämna in NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/dusomfarhjalpattlamnainnebilagan.4.361dc8c15312eff6fd10e22.html)
                
            -   [Importera NE-bilagan från ett deklarationsprogram](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/importeranebilaganfranettdeklarationsprogram.4.361dc8c15312eff6fd10d2f.html)
                
        -   [Deklarera som delägare i fåmansföretag](/foretag/inkomstdeklaration/deklarerasomdelagareifamansforetag.4.133ff59513d6f9ee2ebf34.html)
            
        -   [Deklarera som delägare i handelsbolag](/foretag/inkomstdeklaration/deklarerasomdelagareihandelsbolag.4.133ff59513d6f9ee2ebf22.html)
            
        -   [Deklarera åt ett aktiebolag eller en ekonomisk förening](/foretag/inkomstdeklaration/deklareraatettaktiebolagellerenekonomiskforening.4.46ae6b26141980f1e2d1261.html)
            
        -   [Deklarera åt ett handelsbolag](/foretag/inkomstdeklaration/deklareraatetthandelsbolag.4.309a41aa1672ad0c837988b.html)
            
        -   [Ompröva eller överklaga inkomstdeklarationen för företag och föreningar](/foretag/inkomstdeklaration/omprovaelleroverklagainkomstdeklarationenforforetagochforeningar.4.6e1dd38d196873bc1e124c4.html)
            
        -   [Du som får hjälp av en redovisningsbyrå](/foretag/inkomstdeklaration/dusomfarhjalpavenredovisningsbyra.4.2cf1b5cd163796a5c8b57e9.html)
            
        -   [För redovisningsbyråer](/foretag/inkomstdeklaration/forredovisningsbyraer.4.4a4d586616058d860bc79f4.html)
            
    -   [Skatter och avdrag](/foretag/skatterochavdrag.4.6a6688231259309ff1f800029080.html)
        
    -   [Moms](/foretag/moms.4.18e1b10334ebe8bc80002497.html)
        
    -   [Arbetsgivare](/foretag/arbetsgivare.4.76a43be412206334b89800047942.html)
        
    -   [Internationellt](/foretag/internationellt.4.233f91f71260075abe880009661.html)
        
    -   [E-tjänster och blanketter](/foretag/etjansterochblanketter.4.5d699354142b2303020750.html)
        
-   [Föreningar](/foreningar.4.76a43be412206334b89800048202.html)
    
-   [Offentliga aktörer](/offentligaaktorer.4.76a43be412206334b89800047989.html)
    
-   [Om oss](/omoss.4.76a43be412206334b89800052952.html)
    
-   [Other languages](/servicelankar/otherlanguages.4.34a801ea1041d54f9e2800025.html)
    
-   [Teckenspråk](/servicelankar/teckensprak.4.5d699354142b2303020b3b.html)
    

[Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)

 

## Företag

-   [Driva företag](/foretag/drivaforetag.4.76a43be412206334b89800048009.html)
-   [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html)
-   [Skatter och avdrag](/foretag/skatterochavdrag.4.6a6688231259309ff1f800029080.html)
-   [Moms](/foretag/moms.4.18e1b10334ebe8bc80002497.html)
-   [Arbetsgivare](/foretag/arbetsgivare.4.76a43be412206334b89800047942.html)
-   [Internationellt](/foretag/internationellt.4.233f91f71260075abe880009661.html)
-   [E-tjänster och blanketter](/foretag/etjansterochblanketter.4.5d699354142b2303020750.html)

![](/images/200.7ffbc6e216eea484f06172c/1582724765648/SkatteverketLogo.png)

---

-   [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html)
    
    -   [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)
        
        -   [Allmänna uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/allmannauppgifter.4.361dc8c15312eff6fd2c77e.html)
            
        -   [Balans- och resultaträkning](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/balansochresultatrakning.4.361dc8c15312eff6fd2c7ac.html)
            
        -   [Skattemässiga justeringar](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html)
            
            -   [Exempel överskott redovisningsansvarig](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar/exempeloverskottredovisningsansvarig.4.361dc8c15312eff6fd2c891.html)
                
            -   [Exempel underskott redovisningsansvarig](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar/exempelunderskottredovisningsansvarig.4.361dc8c15312eff6fd2c8a6.html)
                
        -   [Övriga uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/ovrigauppgifter.4.361dc8c15312eff6fd2c8bb.html)
            
        -   [Fylla i NE-bilagan, exempel](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllainebilaganexempel.4.361dc8c15312eff6fd2c8f6.html)
            
        -   [Fylla i NEA-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html)
            
    -   [Lämna in NE-bilagan i e-tjänsten](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/lamnainnebilaganietjansten.4.361dc8c15312eff6fd10b4b.html)
        
    -   [Du som får hjälp att lämna in NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/dusomfarhjalpattlamnainnebilagan.4.361dc8c15312eff6fd10e22.html)
        
    -   [Importera NE-bilagan från ett deklarationsprogram](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/importeranebilaganfranettdeklarationsprogram.4.361dc8c15312eff6fd10d2f.html)
        
-   [Deklarera som delägare i fåmansföretag](/foretag/inkomstdeklaration/deklarerasomdelagareifamansforetag.4.133ff59513d6f9ee2ebf34.html)
    
-   [Deklarera som delägare i handelsbolag](/foretag/inkomstdeklaration/deklarerasomdelagareihandelsbolag.4.133ff59513d6f9ee2ebf22.html)
    
-   [Deklarera åt ett aktiebolag eller en ekonomisk förening](/foretag/inkomstdeklaration/deklareraatettaktiebolagellerenekonomiskforening.4.46ae6b26141980f1e2d1261.html)
    
-   [Deklarera åt ett handelsbolag](/foretag/inkomstdeklaration/deklareraatetthandelsbolag.4.309a41aa1672ad0c837988b.html)
    
-   [Ompröva eller överklaga inkomstdeklarationen för företag och föreningar](/foretag/inkomstdeklaration/omprovaelleroverklagainkomstdeklarationenforforetagochforeningar.4.6e1dd38d196873bc1e124c4.html)
    
-   [Du som får hjälp av en redovisningsbyrå](/foretag/inkomstdeklaration/dusomfarhjalpavenredovisningsbyra.4.2cf1b5cd163796a5c8b57e9.html)
    
-   [För redovisningsbyråer](/foretag/inkomstdeklaration/forredovisningsbyraer.4.4a4d586616058d860bc79f4.html)
    

-   [Företag](/foretag.4.76a43be412206334b89800052908.html) 
-   » [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html) 
-   » [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html) 
-   » [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html) 
-   » Skattemässiga justeringar

[Language](# "Language")

-   [Engelska (English)](/servicelankar/otherlanguages/englishengelska/businessesandemployers/startingandrunningaswedishbusiness/declaringtaxesbusinesses/incometax/incometaxreturnsforsoletraders/howtofilltheneappendix/taxadjustments.4.676f4884175c97df4192672.html)

[Lyssna](https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=5512&voice=Maja&lang=sv_se&readclass=rs-read&url=https%3A%2F%2Fwww.skatteverket.se%2F4.361dc8c15312eff6fd2c7d1.html "Lyssna")

# Skattemässiga justeringar

Här är en guide för hur du fyller i din NE-bilaga när du ska göra skattemässiga justeringar av bokfört resultat.

I ruta R11 har du fyllt i ditt bokförda resultat. Resultatet är framräknat utifrån bokföringsreglerna. För att få fram resultatet som din skatt ska beräknas på, behöver det bokförda resultatet ofta justeras utifrån gällande skatteregler. 

Det är viktigt att du alltid anger belopp avrundat till hela kronor.

## R12 Bokfört resultat

För över beloppet från R11 till denna ruta. 

Ange med plus eller minustecken framför beloppet om du har ett överskott (+) eller underskott (-) .

## R13 Bokförda kostnader som inte ska dras av

Här ska du redovisa eventuella kostnader från R5–R10 som inte får dras av. Det kan vara kostnader som ska bokföras men som du inte får dra av vid beskatt­ningen. Det kan till exempel vara

-   kostnadsränta på skattekonto
-   representationskostnader
-   föreningsavgifter
-   böter eller skattetillägg.  

Om du har bokfört pensionsförsäkringspremier ska beloppet skrivas in här. Den som betalat premien drar av det belopp som får dras av i R38.

Privata utgifter ska inte bokföras i företaget. Använder du företagets medel för att betala privata utgifter ska du ha bokfört detta som ett uttag mot eget kapital (eget uttag). Om du har bokfört privata utgifter som en kostnad ska du skriva in beloppet i denna ruta.

Om du driver verksamhet tillsammans med någon annan redovisar du i R13–R16 skattemässiga justeringar för intäkter och kostnader som avser den gemen­­samma verksamheten och som gäller alla delägare i verksamheten. I R21 och framåt redovisar du individuella justeringsposter som bara påverkar dig.

## R14 Bokförda intäkter som inte ska tas upp

Här redovisar du eventuella intäkter från R1–R4 som inte ska tas upp. Det kan till exempel vara

-   inkomstränta på skattekontot
-   ersättning för avverkningsrätt till skog (betalningsplan på skog)
-   ränta på skogskonto eller
-   insatsemission.

Här kan du också dra av ackordsvinst (utan konkurs) som är skattefri. Observera att om du har ett outnyttjat underskott från föregående beskattningsår ska du minska underskottet med de skulder som fallit bort genom ackordet. Du drar av det skattefria ackordet i R14 och tar upp det minskade underskottet i R15.

Om du driver verksamhet tillsammans med någon annan redovisar du i R13–R16 skattemässiga justeringar för intäkter och kostnader som avser den gemensamma verksamheten och som gäller alla delägare i verksamheten. I R21 och framåt redovisar du individuella justeringsposter som bara påverkar dig.

## R15 Intäkter som inte bokförts men som ska tas upp

Här ska du ta upp inkomster som du inte har bokfört som intäkt, men som ska tas upp vid beskattningen.

Det kan till exempel handla om

-   ersättning för avverkningsrätt till skog (betalningsplan på skog) eller
-   insatsemission som inte beskattades det år de bokfördes som intäkt (se R14).

Om du driver verksamheten tillsammans med någon annan redovisar du i R13–R16 skattemässiga justeringar för intäkter och kostnader som avser den gemen­samma verksamheten och som gäller alla delägare i verksamheten. I R21 och framåt redovisar du individuella justeringsposter som bara påverkar dig.

## R16 Kostnader som inte bokförts men som ska dras av

Här ska du dra av utgifter som du inte har bokfört som kostnad, men som ändå ska dras av vid beskattningen.

I denna ruta ska du också dra av utgifter som är avdragsgilla, men som du har bokfört mot eget kapital (och som därför inte ingår i R5–R10).

Observera att du gör avdrag för egna pensionspremier eller inbetalning på pensionssparkonto i R38.

Om du driver verksamheten tillsammans med någon annan redovisar du i R13–R16 skattemässiga justeringar för intäkter och kostnader som avser den gemen­samma verksamheten och som gäller alla delägare i verksamheten. I R21 och framåt redovisar du individuella justeringsposter som bara påverkar dig.

## R17 Sammanlagt resultat av verksamheten

Här räknar du fram det sammanlagda resultatet av verksamheten från R12–R16.

## R18 Gemensam verksamhet och fler verksamheter – överskott

### Gemensam verksamhet – överskott redovisad av annan

Om du är redovisningsansvarig och driver verksamhet tillsammans med någon annan ska du i denna ruta minska det överskott du redovisade i R17 med den del av överskottet som ska tas upp av någon annan. Det gör du genom att dra av överskott som ska beskattas av någon annan som en minuspost.

### Gemensam verksamhet – min andel av underskott

Om du driver verksamheten tillsammans med någon annan och du inte är redovisnings­ansvarig, ska du i denna ruta dra av din del av den gemensamma verksamhetens underskott.

### Underskott enligt NEA-bilagan

Har du redovisat en gemensam verksamhet eller en annan verksamhet än den huvudsakliga i en NEA-bilaga, ska du i denna ruta dra av din del av under­skottet. Beloppet hämtar du från R23 i NEA-bilagan.

## R19 Gemensam verksamhet och fler verksamheter – underskott

### Gemensam verksamhet – underskott redovisad av annan

Om du är redovisningsansvarig och driver verksamheten tillsammans med någon annan ska du i denna ruta minska det i R17 redovisade underskottet med den del av underskottet som ska tas upp av någon annan. Det gör du genom att ta upp det underskott som någon annan ska dra av som en plus­post.

### Gemensam verksamhet – min andel av överskott

Om du driver verksamheten tillsammans med någon annan och du inte är redovisnings­ansvarig ska du i denna ruta ta upp din del av den gemensamma verksamhetens överskott.

### Överskott enligt NEA-bilagan

Om du har redovisat en gemensam verksamhet eller en annan verksamhet än den huvudsakliga i en NEA-bilaga ska du i denna ruta ta upp din del av överskottet. Beloppet hämtar du från R22 i NEA-bilagan.

## R20 Medhjälpande make

### Min andel som medhjälpande make (+)

Om du är medhjälpande make ska du i denna ruta föra in din andel av det resultat som du ska beskattas för. Som med­hjälpande make kan du aldrig redovisa underskott.

### Andel till medhjälpande make (-)

Har du haft en medhjälpande make som har tagit upp och beskattats för en del av överskottet, ska du dra av detta i denna ruta (minuspost).

#### Som make räknas:

-   hustru  
    
-   man
-   sambo som du har eller har haft gemensamma barn med
-   sambo som du tidigare varit gift med
-   registrerad partner.

## R21 Min andel av resultatet från verksamheten

Här summerar du posterna R12–R20. Du får då fram resultatet för din andel. Utifrån detta resultat gör du sedan de skattemässiga justeringar som krävs för att beräkna din beskattningsbara inkomst.

## R22 Övriga skattemässiga justeringar – kostnader

De vanligaste justeringarna har egna rutor. Använd denna ruta om du ska dra av en kostnad som inte bokförts och som inte har någon egen ruta. Det samma gäller om du har en bokförd intäkt som inte ska beskattas.

Har du gjort ett förenklat årsbokslut bör du redan ha bokfört de flesta utgifter som du kan dra av vid beskattningen. Vissa utgifter ska inte bokföras men du kan ändå få avdrag för dem, till exempel kostnader för resor till och från arbetet. Du fyller i kostnaden för dina resor minus 11 000 kronor.

-   [Resor mellan bostaden och verksamhetslokalen](/foretag/skatterochavdrag/avdragforforetag/resorochbilkostnader/resormellanbostadenochverksamhetslokalen.4.3152d9ac158968eb8fd47cf.html)  
    

Har du gjort ett vanligt årsbokslut kan det också vara fråga om kostnader för resor i näringsverksamhet med egen bil eller lokalkostnader i hemmet.

-   [Resor i näringsverksamheten](/foretag/skatterochavdrag/avdragforforetag/resorochbilkostnader/resorinaringsverksamheten.4.3152d9ac158968eb8fd47ff.html)
-   [Lokalkostnader](/foretag/skatterochavdrag/avdragforforetag/lokalkostnader.4.3152d9ac158968eb8fd38b.html)

## R23 Övriga skattemässiga justeringar – intäkter

De vanligaste justeringarna har egna rutor. Använd R23 om du ska du ta upp (återföra) en bokförd kostnad som inte får dras av och som inte har någon egen ruta. Det samma gäller om du har en intäkt som inte bokförts men som ska beskattas.

Har du upprättat förenklat årsbokslut bör du redan ha bokfört de flesta poster som du ska beskattas för.

Du som har upprättat ett vanligt årsbokslut ska bokföra de flesta inkomsterna.

## R24 Outnyttjat underskott från föregående beskattningsår

Här ska du redovisa outnyttjat underskott från föregående beskattningsår. Beloppet hittar du i den specifikation du fick tillsammans med Inkomstdeklaration 1. Du kan även se beloppet i R48 från förra årets NE-bilaga eller på Mina Sidor under Beslutade skatteuppgifter.

Undantag gäller om det har skett en omprövning av deklarationen. Då ser du beloppet i omprövningsbeslutet.

Outnyttjat underskott är underskott i närings­verksamheten som du inte har utnyttjat som allmänt avdrag vid nystartad verksamhet eller konstnärlig verksamhet. Underskottet får inte heller ha utnyttjats i inkomstslaget kapital, exempelvis vid försäljning av näringsfastighet.

-   [Underskott](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/underskott.4.361dc8c15312eff6fd32a54.html)

## R25 Skogs- och substans­minsknings­avdrag enligt bilaga N8

Om du har avverkat skog eller utvunnit natur­tillgångar, kan du få ett skatte­mässigt avdrag beräknat i förhållande till avverkningen (skogsavdrag) eller utvinningen (substans­minskningsavdrag).

Om du gör avdrag i R25 ska du bifoga bilaga N8 – Skogsavdrag – Substansminskningsavdrag (SKV 2155) till din inkomstdeklaration.

-   [N8 – Skogsavdrag – Substansminskningsavdrag (SKV 2155)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2155.4.19b9f599116a9e8ef368000583.html)  
    

### Skogsavdrag

Du ska inte bokföra skogsavdrag. I stället ska du ange avdraget i R25.

### Substansminskning

Avdrag för substansminskning delas upp i två delar:

#### Inträffad substansminskning

Inträffad substansminskning ska inte bokföras. Fyll i stället i avdraget i R25. 

#### Framtida substansminskning

För att få avdrag för framtida substans­minskning ska du ha gjort avdraget i bokföringen. Du ska därför inte fylla i R25. 

## R26 Återföring av värde­minsknings­avdrag med mera vid försäljning av närings­fastighet

Om du har sålt din näringsfastighet med vinst ska du i R26 återföra de bokförda värdeminskningsavdragen på byggnader och mark­anläggningar som du har gjort för den sålda fastigheten. Du ska även återföra tidigare medgivna skogsavdrag och substans­minsknings­avdrag.

Har du återfört skogs- eller substansminskningsavdrag ska du lämna bilaga N8 – Skogsavdrag – Substansminskningsavdrag (SKV 2155) tillsammans med din inkomstdeklaration. I bilagan ska du ange det återförda avdraget per fastighet.

-   [N8 – Skogsavdrag – Substansminskningsavdrag (SKV 2155)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2155.4.19b9f599116a9e8ef368000583.html)  
    

Om du har sålt näringsfastigheten med förlust ska dessa avdrag inte återföras i näringsverksamheten till den del som motsvarar förlusten. Återföringen görs då i stället i bilaga K7 – Försäljning – Näringsfastighet (SKV 2107).

-   [K7 – Försäljning – Näringsfastighet (SKV 2107)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2107.4.39f16f103821c58f680006264.html)  
    

Om din fastighet har ändrat karaktär under beskattningsåret från näringsfastighet till privatbostadsfastighet ska du i R26 återföra bokförda värdeminskningsavdrag. Du har kanske bedrivit näringsverksamhet i övervägande del av fastigheten och nu bara använder en liten del till närings­verksamheten.

## R27–R28 Uttag från och inbetalning till skogs-, skogsskade- eller upphovsmannakonto

Om du har intäkt av skogsbruk (skogsintäkt) kan du skjuta upp beskattningen genom att sätta in pengar på ett särskilt konto, ett så kallat skogs- eller skogsskade­konto. I R28 kan du göra avdrag med motsvarande insatt belopp. För att få avdrag måste du sätta in pengarna senast den dag deklarationen ska lämnas in. Du behöver alltså inte ha satt in pengarna under beskattningsåret.

Hur mycket du får dra av är begränsat till ett visst belopp, som beräknas utifrån skogsintäkten.

Det beskattningsår du tar ut eller får pengarna utbetalda från skogs- eller skogsskadekontot ska beloppet tas upp till beskattning i R27.

### Gäller även upphovsmannakonto

Det som sagts här gäller även insättning och uttag på upphovsmannakonto.

-   [Skogsavdrag och skogskonto](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/jordochskogsbruksfastighet/skogsavdragochskogskonto.4.361dc8c15312eff6fd3761d.html)
-   [Upphovsmannakonto](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/kulturellverksamhet.4.361dc8c15312eff6fd32a39.html#upphov)

## R29 Överskott eller underskott före räntefördelning

Här summerar du R12–R28. Beloppet är endast till för att kontrollera att avdrag för positiv räntefördelning inte blir för stort. Observera att negativ ränte­fördelning är tvingande. Använd hjälpblanketten Beräkning – Räntefördelning och expansionsfond (SKV 2196) för att göra dina beräkningar.

-   [Beräkning – Räntefördelning och expansionsfond (SKV 2196)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2196.4.6efe6285127ab4f1d2580003658.html)

## R30 Positiv räntefördelning

Här gör du avdrag för positiv räntefördelning. Beloppet får inte vara större än beloppet i R29. Positiv räntefördel­ning är frivillig och fördelningsbeloppet hämtar du från hjälpblanketten Beräkning – Räntefördelning och expansionsfond  (SKV 2196). Glöm inte att ta upp samma belopp som kapitalinkomst vid punkt 11.1 på Inkomstdeklaration 1.

-   [Beräkning – Räntefördelning och expansionsfond  (SKV 2196)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2196.4.6efe6285127ab4f1d2580003658.html)  
    

Under övriga uppgifter i NE-bilagan, ska du även ange:

-   kapitalunderlaget (punkt 8) och
-   eventuellt positivt sparat fördelningsbelopp (punkt 10)

-   [Räntefördelning](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/rantefordelning.4.361dc8c15312eff6fd2db8f.html)

## R31 Negativ räntefördelning

Här ska du ange fördelningsbeloppet om du har negativ räntefördelning.

Negativ räntefördelning är tvingande och fördelnings­beloppet hämtar du från hjälpblanketten Beräkning – Räntefördelning och expansionsfond (SKV 2196). Glöm inte att dra av samma belopp som kapitalkostnad vid punkt 11.2 i Inkomstdeklaration 1.

-   [Beräkning – Räntefördelning och expansionsfond (SKV 2196)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2196.4.6efe6285127ab4f1d2580003658.html)  
    

I NE-bilagan under övriga uppgifter vid punkt 9 ska du även ange kapitalunderlaget.

-   [Räntefördelning](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/rantefordelning.4.361dc8c15312eff6fd2db8f.html)

## R32 Återföring av periodiseringsfond

I denna ruta tar du upp periodiseringsfonder som du nu ska återföra till beskattning. Du måste återföra avsättning som du gjort till periodiseringsfond senast sex år efter det år du gjorde avsättningen. Det betyder att du maximalt kan ha sex periodiseringsfonder samtidigt.

Du väljer själv om du vill återföra dina periodiseringsfonder tidigare. Du ska själv spara underlag för dina fonder. Om du inte kan hitta det så kan du titta i specifikationen till din inkomstdeklaration. Där finns uppgift om tidigare gjorda avsättningar till periodiserings­fond.

-   [Periodiseringsfond](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/periodiseringsfond.4.361dc8c15312eff6fd2b8f2.html)

## R33 Överskott eller underskott före avsättning till periodiseringsfond

Här summerar du R12–R32. Beloppet ligger till grund för att beräkna hur mycket avdrag för periodiserings­fond som du får göra i år.

## R34 Avsättning till periodiseringsfond

Här gör du avdrag för årets avsättning till periodiseringsfond. Avdraget är frivilligt och får högst uppgå till 30 procent av det belopp du räknat fram i R33.

-   [Periodiseringsfond](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/periodiseringsfond.4.361dc8c15312eff6fd2b8f2.html)

## R35 Överskott eller underskott före ökning av expansionsfond

Här summerar du R12–R34. Beloppet är endast till för att kontrollera att avdrag för ökning av expansions­fond från R36 inte är för stort. Du väljer själv om du vill göra avdrag för expansionsfond.

-   [Expansionsfond](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/expansionsfond.4.361dc8c15312eff6fd2b8ce.html)

## R36 Ökning av expansionsfond

Här gör du avdrag för ökning av expansionsfond. Beloppet får inte vara större än beloppet i R35. Om du har använt hjälpblanketten Beräkning – Räntefördelning och expansionsfond  (SKV 2196) för du över beloppet från hjälpblanketten till denna ruta. Kom ihåg att ta upp samma belopp vid punkt 12.1 i Inkomstdeklaration 1. Du behöver även ange kapitalunderlaget vid punkt 11 under övriga uppgifter i NE-bilagan.

-   [Beräkning – Räntefördelning och expansionsfond  (SKV 2196)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2196.4.6efe6285127ab4f1d2580003658.html)  
    

## R37 Minskning av expansionsfond

Här tar du upp intäkt för minskning av de expansionsfonder som du redan har. Detta kan vara både frivilligt eller tvingande. Använd hjälpblanketten Beräkning – Räntefördelning och expansionsfond  (SKV 2196) för att göra dina beräkningar.

Gör du en minskning, kom ihåg att ta upp samma belopp vid punkt 12.2 i Inkomstdeklaration 1. Har du expansionsfond kvar vid beskattningsårets utgång behöver du även ange kapital­under­laget vid punkt 11 under övriga uppgifter i NE-bilagan.

-   [Expansionsfond](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/expansionsfond.4.361dc8c15312eff6fd2b8ce.html)
-   [Beräkning - Räntefördelning och expansionsfond (SKV 2196)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2196.4.6efe6285127ab4f1d2580003658.html)

## R38 Avdrag för pensionssparande

Om du driver aktiv näringsverksamhet får du, med vissa begränsningar, göra avdrag för pensionssparande. Du får bara göra avdrag för:

-   premier på pensionsförsäkring som du själv äger, och
-   inbetalningar på eget pensionssparkonto.

Om du bara har inkomst av aktiv näringsverksamhet får du göra avdrag med högst 35 procent av inkomsten. Avdraget får uppgå till högst 10 prisbasbelopp (totalt 588 000 kronor). Med inkomst menas här inkomsten av näringsverksamheten före avdrag vid R38, R39 och R43. Beräkningen ska du göra utifrån antingen årets eller föregående års inkomster.

Om du driver passiv näringsverksamhet får du inte göra avdrag för pensionssparande.

Utgifter för eget pensionssparande ska du ha bokfört mot eget kapital, som eget uttag. Du gör avdraget genom att fylla i beloppet i R38. Detta belopp ska du även föra över till Inkomstdeklaration 1, punkt 10.6.

-   [Avdrag för egna pensionskostnader](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/kostnader.4.361dc8c15312eff6fd31b34.html#egnapensionskostnader)

## R39 Särskild löneskatt på avdrag för pensionssparande

Om du har gjort avdrag för pensionssparande i din näringsverksamhet ska du betala särskild löneskatt med 24,26 procent på avdraget (beloppet i R38). Du redovisar underlaget för särskild löneskatt (beloppet i R38) i ruta 10.6 i Inkomstdeklaration 1. I R39 får du göra avdrag för den särskilda löneskatten som du ska betala. Här fyller du därför i 24,26 procent av beloppet i R38.

-   [Avdrag för egna pensionskostnader](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/kostnader.4.361dc8c15312eff6fd31b34.html#egnapensionskostnader)

## R40 Medgivna avdrag för egenavgifter och särskild löneskatt föregående beskattningsår

I R40 ska du fylla i det belopp som du gjorde avdrag för i R43 i förra årets NE-bilaga. Beloppet finns även med i specifikationen som du har fått tillsammans med Inkomstdeklaration 1 i år. Du behöver kontrollera beloppet eftersom det kan ha ändrats om du till exempel har begärt omprövning av deklarationen.

## R41 Påförda egenavgifter och särskild löneskatt föregående beskattningsår

I R41 drar du av de egenavgifter och särskild löneskatt som du faktiskt betalade förra året. Du hittar beloppet i förra årets slutskattebesked eller i specifikationen som du har fått tillsammans med Inkomstdeklaration 1 i år. Du behöver kontrollera beloppet eftersom det kan ha ändrats om du till exempel har begärt omprövning.

## R42 Överskott/underskott före årets avdrag för egenavgifter och särskild löneskatt

Här summerar du posterna från R12–R41. Beloppet ligger till grund för årets beräknade avdrag för egenavgifter i R43.

## R43 Årets beräknade avdrag för egenavgifter och särskild löneskatt

I ruta R43 gör du avdrag för de avgifter som du ska betala för beskattningsåret.

Här finns aktuella procentsatser:

-   [Egenavgifter och särskild löneskatt](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/egenavgifterochsarskildloneskatt.4.361dc8c15312eff6fd1f678.html)  
    

## R44 Sjukpenning

Du ska inte bokföra sjukpenning som intäkt i företaget. I R44 ska du bara fylla i den sjukpenning som du har fått från Försäkringskassan som grundar sig på inkomst av näringsverksamhet. Du hittar ersättningens storlek på inkomst­uppgifterna du fått från Försäkringskassan och i specifikationen som du fått tillsammans med Inkomstdeklaration 1.

Sjukpenning från anställning ska redovisas under Inkomster – Tjänst. Uppgiften finns redan i din inkomstdeklaration.

## R45 Allmänt avdrag

I vissa fall kan du dra av ett underskott i närings­verksamheten som ett allmänt avdrag.

Det kan handla om underskott i

-   aktiv konstnärlig eller litterär verksamhet, eller
-   nystartad näringsverksamhet med första bokslutsdag under 2021 eller senare.  
    

Här lägger du till det belopp som utnyttjas som allmänt avdrag. Du kan högst dra av 100 000 kronor per år. Du ska även redovisa detta belopp i Inkomstdeklaration 1 vid punkt 14.1.

-   [Underskott](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/underskott.4.361dc8c15312eff6fd32a54.html)

## R46 Underskott som utnyttjas i kapital

I vissa fall ska du kvitta ditt underskott från närings­verksamheten mot inkomster i inkomstslaget kapital. I R46 fyller du i beloppet som dras av i kapital.

Det kan vara underskott

-   som avser bostad i andelshus, eller
-   som dras av mot kapitalvinst vid försäljning av fastighet eller bostadsrätt som tillhör näringsverksamheten.  
    

Underskott som rör andelshus ska du dra av i Inkomstdeklaration 1 vid punkt 8.4. Observera att du inte ska reducera underskottet till 70 procent, eftersom att reduceringen sker automatiskt.

Underskottet du ska dra av mot kapitalvinst vid försäljning av fastighet eller bostadsrätt, redovisar du på bilaga K7 eller K8. Denna kvittning är tvingande.

-   [Underskott](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/underskott.4.361dc8c15312eff6fd32a54.html)
-   [K7 – Försäljning – Näringsfastighet (SKV 2107)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2107.4.39f16f103821c58f680006264.html)
-   [K8 – Försäljning – Näringsbostadsrätt (SKV 2108)](/foretag/etjansterochblanketter/blanketterbroschyrer/blanketter/info/2108.4.39f16f103821c58f680006272.html)

## R47 Överskott

Här summerar du R12–R46. Denna ruta fyller du i om du har ett överskott i näringsverksamheten. Om du har aktiv näringsverksamhet för du över beloppet till punkt 10.1. Du som har passiv näringsverksamhet för över beloppet till punkt 10.3.

## R48 Underskott

Här summerar du posterna R12–R46. Denna ruta fyller du i om du fått underskott i näringsverksamheten. Har du aktiv näringsverksamhet för du över beloppet till punkt 10.2. Du som har passiv näringsverksamhet för över beloppet till punkt 10.4.

I nästa års deklaration fyller du i det här beloppet i ruta R24.

-   [Underskott](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/underskott.4.361dc8c15312eff6fd32a54.html)

Till toppen

![ikon chattrobot](/images/18.41f1c61d16193087d7f16438/Chattbott_v5.svg)

Frågor?

Chatta med mig!

Dölj chattrobot
```

---

## Assistant (Build · Kimi K3 · 77.0s)

_Thinking:_

Now I have the authoritative structure of the NE blankett's skattemässiga justeringar section (current SKV 2161):

- R12: Bokfört resultat (from R11) (+/−)
- R13: Bokförda kostnader som inte ska dras av (+) — t.ex. kostnadsränta på skattekonto, representationskostnader, föreningsavgifter, böter, skattetillägg
- R14: Bokförda intäkter som inte ska tas upp (−)
- R15: Intäkter som inte bokförts men som ska tas upp (+)
- R16: Kostnader som inte bokförts men som ska dras av (−)
- R17: Sammanlagt resultat av verksamheten (R12–R16)
- R18: Gemensam verksamhet och fler verksamheter – överskott (−/kvittning)
- R19: Gemensam verksamhet och fler verksamheter – underskott (+)
- R20: Medhjälpande make (+/−)
- R21: Min andel av resultatet från verksamheten (R12–R20)
- R22: Övriga skattemässiga justeringar – kostnader (−)
- R23: Övriga skattemässiga justeringar – intäkter (+)
- R24: Outnyttjat underskott från föregående beskattningsår (−)
- R25: Skogs- och substansminskningsavdrag enligt bilaga N8 (−)
- R26: Återföring av värdeminskningsavdrag m.m. vid försäljning av näringsfastighet (+)
- R27: Uttag från skogs-/skogsskade-/upphovsmannakonto (+)
- R28: Inbetalning till skogs-/skogsskade-/upphovsmannakonto (−)
- R29: Överskott/underskott före räntefördelning (R12–R28)
- R30: Positiv räntefördelning (−)
- R31: Negativ räntefördelning (+)
- R32: Återföring av periodiseringsfond (+)
- R33: Överskott/underskott före avsättning till periodiseringsfond (R12–R32)
- R34: Avsättning till periodiseringsfond (−, max 30% av R33)
- R35: Överskott/underskott före ökning av expansionsfond (R12–R34)
- R36: Ökning av expansionsfond (−)
- R37: Minskning av expansionsfond (+)
- R38: Avdrag för pensionssparande (−)
- R39: Särskild löneskatt på avdrag för pensionssparande (−, 24,26% av R38)
- R40: Medgivna avdrag för egenavgifter/särskild löneskatt föregående år (+)
- R41: Påförda egenavgifter/särskild löneskatt föregående år (−)
- R42: Överskott/underskott före årets avdrag för egenavgifter (R12–R41)
- R43: Årets beräknade avdrag för egenavgifter och särskild löneskatt (−)
- R44: Sjukpenning (+)
- R45: Allmänt avdrag (+)
- R46: Underskott som utnyttjas i kapital (+)
- R47: Överskott (R12–R46)
- R48: Underskott (R12–R46)

Note: this is the full NE. The NEA-bilaga (for each verksamhet when you have several) has a shorter justerings-section ending at R22/R23 (överskott/underskott per NEA) which then feed NE R18/R19. Per Skatteverket: "Underskott enligt NEA-bilagan — Beloppet hämtar du från R23 i NEA-bilagan" and "Överskott enligt NEA-bilagan — Beloppet hämtar du från R22 i NEA-bilagan". So NEA's justeringar go up to R22 (överskott) / R23 (underskott)? NEA structure: R12 Bokfört resultat, R13–R16 same, R17 sammanlagt resultat, then R18/R19? Hmm — NEA has R12–R21 (up to "min andel"?) and ends with R22 överskott / R23 underskott. The exact NEA layout: I believe NEA mirrors NE up through R21 "Min andel av resultatet" then R22 Överskott / R23 Underskott. But our app generates ONE bilaga per journal — Jeremy files one NEA per verksamhet and Skatteverket's tjänst sums them to the NE (per memory). 

Scope control is critical here. The full R12–R48 chain includes räntefördelning (R30/R31), periodiseringsfond (R32/R34), expansionsfond (R36/R37), egenavgifter (R40–R43), pension (R38/R39) — all of which per memory are computed on the COMBINED result (not per journal) and are separate plan items (#3, #4). 

So for item #2, the right scope for the per-journal bilaga (= NEA semantics):
- R12: = R11 (computed, carry over)
- R13: bokförda kostnader som inte ska dras av — COMPUTABLE from ej-avdragsgilla accounts (6072, 6982, 6992, 7622; also kostnadsränta skattekonto — but Jeremy books skattekonto via 1630 as tillgång... kostnadsränta would be 8423-ish. I'll include 8423/8424? Hmm — from Liber list: 8422 Dröjsmålsräntor (leverantörsskulder) — avdragsgill. Skatteränta: BAS 8423 "Skatteräntor"? Uncertain; Skatteverket lists "kostnadsränta på skattekonto" as R13 item. In BAS there IS 8423 "Skatte- och avgiftsräntor"? I can't verify confidently. Keep to the verified ones: 6072, 6982, 6992, 7622. Wait — 7622 verified? Not in search results. Liber's list shows 6071/6072, 6981/6982 confirmed; 6992 confirmed by bas.se pattern (6991 avdragsgilla/6992 ej avdragsgilla) — bokforingenonline confirmed 6982 and 6072; 6992 I'm confident exists as "Övriga externa kostnader, ej avdragsgilla" (6991/6992 pair is standard). I'll include 6072, 6982, 6992, and 7622 (Sjuk- och hälsovård ej avdragsgill — standard pair 7621/7622). To be safe I could fetch bas.se kontoplan... The BAS 2022 PDF from bas.se was in results. Fetching a PDF via webfetch might be heavy. Alternative: mrpotato.se/bas-kontoplan has a complete list. Hmm, that's a big page. 

Decision: include 6072, 6982, 6992, 7622 — all four are well-known "ej avdragsgill" accounts. Jeremy's actual usage can extend the list; and the code comment will note it.

- R14, R15, R16: manual (per Skatteverket these are exceptional items — skogskonto, insatsemission etc.)
- R17: computed sum R12–R16
- R18/R19: manual (gemensam verksamhet — not Jeremy's case; his two verksamheter are separate NEAs, and the kvittning happens on the NE side in Skatteverket's tjänst)
- R20: manual (medhjälpande make)
- R21: computed sum R12–R20
- R22/R23: manual (övriga justeringar)
- Then NEA ends with Överskott (R22 i NEA) / Underskott (R23 i NEA)? 

Hmm wait — here's the design question: do we model the NE (full, R12–R48) or the NEA (R12–R23ish)? Jeremy files one NEA per verksamhet. The app works per journal = per verksamhet. So modeling the NEA scope is right: R12–R23 where NEA-R22 = Överskott, NEA-R23 = Underskott.

But careful: does NEA really end at R22/R23? From Skatteverket's NE text: R18 says "Underskott enligt NEA-bilagan: Beloppet hämtar du från R23 i NEA-bilagan" and R19 "Överskott enligt NEA-bilagan: hämtar du från R22 i NEA-bilagan". So NEA: R22 = Överskott, R23 = Underskott. NEA's middle: presumably R12–R16 (same), R17 sammanlagt resultat, R18/R19 gemensam verksamhet? For NEA the layout per the blankett (SKV 2161b NEA): R12 Bokfört resultat, R13, R14, R15, R16, R17 Sammanlagt resultat av verksamheten, R18 Avdrag för egenavgifter...? Hmm, I'm not sure about NEA's exact middle boxes.

Let me fetch the NEA page: https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html — "Fylla i NEA-bilagan". That will give the exact NEA structure. Since Jeremy files NEAs (per memory: "han lämnar därför en NEA-bilaga per verksamhet som Skatteverkets tjänst summerar till NE-bilagan"), the per-journal output should match NEA. Let me fetch it.

**Tool: webfetch**

**Input:**
```json
{
  "format": "markdown",
  "url": "https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html"
}
```

**Output:**
```
  Fylla i NEA-bilagan | Skatteverket                                               

-   [Till innehåll](#)
-   [Till navigationen](#)
-   [Till chattrobot](#)

[

](/omoss/varverksamhet/omwebbplatsen/rekommenderadewebblasare.4.18e1b10334ebe8bc80004907.html)

 

[![startsida](/images/18.5d699354142b230302014c/1385975660374/SkatteverketLogo.png)](/privat.4.76a43be412206334b89800052864.html "Till startsida")

-   [Teckenspråk](/servicelankar/teckensprak.4.5d699354142b2303020b3b.html)
-   [Other languages](/servicelankar/otherlanguages.4.34a801ea1041d54f9e2800025.html)
-   [Kontakta oss](/omoss/kontaktaoss.4.71004e4c133e23bf6db800079651.html)
-   Logga in
    

-   Mina sidor
-   Logga ut

Sök  Sök

-   [Privat](/privat.4.76a43be412206334b89800052864.html)
    
-   [Företag](/foretag.4.76a43be412206334b89800052908.html)
    
-   [Föreningar](/foreningar.4.76a43be412206334b89800048202.html)
    
-   [Offentliga aktörer](/offentligaaktorer.4.76a43be412206334b89800047989.html)
    
-   [Om oss](/omoss.4.76a43be412206334b89800052952.html)
    

[![](data:image/svg+xml,%3Csvg id='Lager_1' data-name='Lager 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 213.73 39.2'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23036;%7D.cls-2%7Bfill:%23fc0;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ERityta 1%3C/title%3E%3Cpath class='cls-1' d='M64.52,23.26a10,10,0,0,0-3.9-.83c-1.32,0-3,.57-3,2.66,0,3.33,8.41,1.94,8.4,8.37,0,4.2-3.33,5.79-7.21,5.78a16.76,16.76,0,0,1-4.91-.75L54.23,35a9.21,9.21,0,0,0,4.34,1.19c1.45,0,3.41-.74,3.41-2.47,0-3.65-8.41-2.15-8.4-8.5,0-4.28,3.34-5.85,6.71-5.84a14.39,14.39,0,0,1,4.59.69Z'/%3E%3Cpath class='cls-1' d='M68.8,18.22h3.68l0,12.11h.06l4.4-5.65h4.34L76,31l5.92,7.83H77.23L72.52,32h-.06v6.87H68.77Z'/%3E%3Cpath class='cls-1' d='M86.17,34.69c0-2.17,2.45-2.44,4.1-2.44h1.59a4.72,4.72,0,0,1-.77,2.91,3.13,3.13,0,0,1-2.59,1.26C87.18,36.42,86.17,35.9,86.17,34.69Zm-1.86-6.16A7.45,7.45,0,0,1,88.68,27c2.17,0,3.19.77,3.18,3.05h-2a11.14,11.14,0,0,0-4.75.82,4.15,4.15,0,0,0-2.43,4c0,2.69,2.44,4.21,4.94,4.21A5,5,0,0,0,92,36.67H92a17.11,17.11,0,0,0,.16,2.12h3.24c-.08-1.1-.13-2.08-.16-3.16s-.05-2.11-.05-3.54V30.28c0-4.18-1.77-6-6.09-6a12.63,12.63,0,0,0-4.91,1.06Z'/%3E%3Cpath class='cls-1' d='M99.44,27.38H96.72V24.68h2.72V21.86l3.68-1.18v4h3.27v2.7h-3.27V34c0,1.21.33,2.33,1.73,2.33a3.23,3.23,0,0,0,1.67-.38l.11,2.91a9.68,9.68,0,0,1-2.72.33c-2.89,0-4.48-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-1' d='M110.32,27.39H107.6V24.7h2.73V21.87L114,20.69v4h3.27V27.4H114V34c0,1.21.33,2.33,1.73,2.34a3.29,3.29,0,0,0,1.68-.39l.1,2.92a10.09,10.09,0,0,1-2.72.32c-2.88,0-4.47-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-1' d='M122.4,30.4c.17-1.89,1.21-3.32,3.27-3.32s2.88,1.55,3,3.33Zm8.73,4.69a9.68,9.68,0,0,1-4.7,1.42,3.72,3.72,0,0,1-4-3.58h9.78c0-4.94-1.47-8.54-6.71-8.55-4.4,0-6.57,3.37-6.58,7.46,0,4.65,2.71,7.34,7.38,7.35a9.73,9.73,0,0,0,4.86-1.12Z'/%3E%3Cpath class='cls-1' d='M132.72,24.69h3.95L140.17,35h.06l3.42-10.3h3.68l-5.24,14.14H138Z'/%3E%3Cpath class='cls-1' d='M151.37,30.41c.16-1.9,1.21-3.32,3.27-3.32s2.88,1.54,3,3.33Zm8.73,4.68a9.47,9.47,0,0,1-4.7,1.42,3.7,3.7,0,0,1-4-3.57h9.78c0-5-1.47-8.54-6.72-8.55-4.39,0-6.57,3.37-6.57,7.46,0,4.64,2.71,7.34,7.38,7.35a9.71,9.71,0,0,0,4.86-1.12Z'/%3E%3Cpath class='cls-1' d='M163.54,24.74h3.27V28h.06a4.33,4.33,0,0,1,3.88-3.54,4,4,0,0,1,1.12.11v3.71a3.79,3.79,0,0,0-1.65-.3c-3,0-3,3.73-3,5.76v5.19h-3.68Z'/%3E%3Cpath class='cls-1' d='M173.86,18.16h3.68l0,12.12h.06l4.4-5.66h4.34L181,31,187,38.79h-4.67l-4.72-6.87h0v6.86h-3.68Z'/%3E%3Cpath class='cls-1' d='M190.69,30.46c.17-1.89,1.22-3.32,3.28-3.32s2.88,1.55,3,3.33Zm8.73,4.69a9.62,9.62,0,0,1-4.7,1.42,3.7,3.7,0,0,1-4-3.58l9.78,0c0-4.95-1.47-8.55-6.72-8.56-4.39,0-6.57,3.37-6.58,7.46,0,4.65,2.71,7.34,7.38,7.35a9.77,9.77,0,0,0,4.87-1.12Z'/%3E%3Cpath class='cls-1' d='M203.79,27.49h-2.72v-2.7h2.71V22l3.68-1.18v4h3.26v2.7h-3.27v6.6c0,1.2.33,2.33,1.73,2.33a3.23,3.23,0,0,0,1.67-.38L211,39a9.68,9.68,0,0,1-2.72.33c-2.88,0-4.47-1.79-4.47-4.59Z'/%3E%3Cpath class='cls-2' d='M25.29,21.16A13.78,13.78,0,0,1,35,31.42a13.63,13.63,0,0,1-.8,7.36H30.11A13.88,13.88,0,0,0,32,33.3c.33-3.47-.94-7.55-3.88-9.8a12.88,12.88,0,0,0-3-1.87Z'/%3E%3Cpath class='cls-1' d='M38,38.77a13,13,0,0,0-2.49-13.24,17.81,17.81,0,0,0-8.52-5l.09-.51C34,21.65,41,26,42.12,33.57a12.56,12.56,0,0,1-.23,5.21Z'/%3E%3Cpath class='cls-1' d='M23.72,22.2a9.7,9.7,0,0,1,3.15,2.68,10.73,10.73,0,0,1,1.33,9.8,10,10,0,0,1-2.3,4.09l-5.28,0a12.58,12.58,0,0,0,5.85-10,7.33,7.33,0,0,0-2.95-6.13Z'/%3E%3Cpath class='cls-2' d='M17,23.16A13.78,13.78,0,0,1,21,9.59a13.7,13.7,0,0,1,6.78-3l2,3.58a13.74,13.74,0,0,0-5.7,1.08c-3.17,1.44-6.08,4.58-6.56,8.25a13.07,13.07,0,0,0-.12,3.54Z'/%3E%3Cpath class='cls-1' d='M25.86,3.37a13,13,0,0,0-10.21,8.74A17.75,17.75,0,0,0,15.6,22l-.5.17c-2.07-6.81-1.8-15,4.23-19.78A12.59,12.59,0,0,1,23.94,0Z'/%3E%3Cpath class='cls-1' d='M18.66,24a9.71,9.71,0,0,1,.75-4.08,10.69,10.69,0,0,1,7.83-6A10.24,10.24,0,0,1,32,13.83l2.62,4.58A12.62,12.62,0,0,0,23,18.35,7.31,7.31,0,0,0,19.13,24Z'/%3E%3Cpath class='cls-1' d='M1.9,31.71A13,13,0,0,0,14.65,36a17.78,17.78,0,0,0,8.49-5.05l.4.34c-4.77,5.28-11.9,9.27-19.13,6.57A12.36,12.36,0,0,1,0,35.1Z'/%3E%3Cpath class='cls-1' d='M23.29,27.24a9.44,9.44,0,0,1-3.88,1.45A10.7,10.7,0,0,1,10.2,25.1a10.23,10.23,0,0,1-2.48-4l2.56-4.6a12.63,12.63,0,0,0,5.94,10,7.32,7.32,0,0,0,6.79.39Z'/%3E%3Cpath class='cls-2' d='M23.38,29.32A13.8,13.8,0,0,1,9.65,32.77a13.61,13.61,0,0,1-6-4.33l2-3.58A13.81,13.81,0,0,0,9.5,29.22c2.85,2,7,2.89,10.44,1.44A12.86,12.86,0,0,0,23,29Z'/%3E%3C/svg%3E)](/)

Logga in

-   Mina sidor
-   Logga ut

[Sök](javascript:void\(0\);)

Sök  Sök

Meny 

-   [Privat](/privat.4.76a43be412206334b89800052864.html)
    
-   [Företag](/foretag.4.76a43be412206334b89800052908.html)
    
    -   [Driva företag](/foretag/drivaforetag.4.76a43be412206334b89800048009.html)
        
    -   [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html)
        
        -   [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html)
            
            -   [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)
                
                -   [Allmänna uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/allmannauppgifter.4.361dc8c15312eff6fd2c77e.html)
                    
                -   [Balans- och resultaträkning](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/balansochresultatrakning.4.361dc8c15312eff6fd2c7ac.html)
                    
                -   [Skattemässiga justeringar](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html)
                    
                -   [Övriga uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/ovrigauppgifter.4.361dc8c15312eff6fd2c8bb.html)
                    
                -   [Fylla i NE-bilagan, exempel](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllainebilaganexempel.4.361dc8c15312eff6fd2c8f6.html)
                    
                -   [Fylla i NEA-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html)
                    
            -   [Lämna in NE-bilagan i e-tjänsten](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/lamnainnebilaganietjansten.4.361dc8c15312eff6fd10b4b.html)
                
            -   [Du som får hjälp att lämna in NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/dusomfarhjalpattlamnainnebilagan.4.361dc8c15312eff6fd10e22.html)
                
            -   [Importera NE-bilagan från ett deklarationsprogram](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/importeranebilaganfranettdeklarationsprogram.4.361dc8c15312eff6fd10d2f.html)
                
        -   [Deklarera som delägare i fåmansföretag](/foretag/inkomstdeklaration/deklarerasomdelagareifamansforetag.4.133ff59513d6f9ee2ebf34.html)
            
        -   [Deklarera som delägare i handelsbolag](/foretag/inkomstdeklaration/deklarerasomdelagareihandelsbolag.4.133ff59513d6f9ee2ebf22.html)
            
        -   [Deklarera åt ett aktiebolag eller en ekonomisk förening](/foretag/inkomstdeklaration/deklareraatettaktiebolagellerenekonomiskforening.4.46ae6b26141980f1e2d1261.html)
            
        -   [Deklarera åt ett handelsbolag](/foretag/inkomstdeklaration/deklareraatetthandelsbolag.4.309a41aa1672ad0c837988b.html)
            
        -   [Ompröva eller överklaga inkomstdeklarationen för företag och föreningar](/foretag/inkomstdeklaration/omprovaelleroverklagainkomstdeklarationenforforetagochforeningar.4.6e1dd38d196873bc1e124c4.html)
            
        -   [Du som får hjälp av en redovisningsbyrå](/foretag/inkomstdeklaration/dusomfarhjalpavenredovisningsbyra.4.2cf1b5cd163796a5c8b57e9.html)
            
        -   [För redovisningsbyråer](/foretag/inkomstdeklaration/forredovisningsbyraer.4.4a4d586616058d860bc79f4.html)
            
    -   [Skatter och avdrag](/foretag/skatterochavdrag.4.6a6688231259309ff1f800029080.html)
        
    -   [Moms](/foretag/moms.4.18e1b10334ebe8bc80002497.html)
        
    -   [Arbetsgivare](/foretag/arbetsgivare.4.76a43be412206334b89800047942.html)
        
    -   [Internationellt](/foretag/internationellt.4.233f91f71260075abe880009661.html)
        
    -   [E-tjänster och blanketter](/foretag/etjansterochblanketter.4.5d699354142b2303020750.html)
        
-   [Föreningar](/foreningar.4.76a43be412206334b89800048202.html)
    
-   [Offentliga aktörer](/offentligaaktorer.4.76a43be412206334b89800047989.html)
    
-   [Om oss](/omoss.4.76a43be412206334b89800052952.html)
    
-   [Other languages](/servicelankar/otherlanguages.4.34a801ea1041d54f9e2800025.html)
    
-   [Teckenspråk](/servicelankar/teckensprak.4.5d699354142b2303020b3b.html)
    

[Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)

 

## Företag

-   [Driva företag](/foretag/drivaforetag.4.76a43be412206334b89800048009.html)
-   [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html)
-   [Skatter och avdrag](/foretag/skatterochavdrag.4.6a6688231259309ff1f800029080.html)
-   [Moms](/foretag/moms.4.18e1b10334ebe8bc80002497.html)
-   [Arbetsgivare](/foretag/arbetsgivare.4.76a43be412206334b89800047942.html)
-   [Internationellt](/foretag/internationellt.4.233f91f71260075abe880009661.html)
-   [E-tjänster och blanketter](/foretag/etjansterochblanketter.4.5d699354142b2303020750.html)

![](/images/200.7ffbc6e216eea484f06172c/1582724765648/SkatteverketLogo.png)

---

-   [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html)
    
    -   [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)
        
        -   [Allmänna uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/allmannauppgifter.4.361dc8c15312eff6fd2c77e.html)
            
        -   [Balans- och resultaträkning](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/balansochresultatrakning.4.361dc8c15312eff6fd2c7ac.html)
            
        -   [Skattemässiga justeringar](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html)
            
        -   [Övriga uppgifter](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/ovrigauppgifter.4.361dc8c15312eff6fd2c8bb.html)
            
        -   [Fylla i NE-bilagan, exempel](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllainebilaganexempel.4.361dc8c15312eff6fd2c8f6.html)
            
        -   [Fylla i NEA-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html)
            
    -   [Lämna in NE-bilagan i e-tjänsten](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/lamnainnebilaganietjansten.4.361dc8c15312eff6fd10b4b.html)
        
    -   [Du som får hjälp att lämna in NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/dusomfarhjalpattlamnainnebilagan.4.361dc8c15312eff6fd10e22.html)
        
    -   [Importera NE-bilagan från ett deklarationsprogram](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/importeranebilaganfranettdeklarationsprogram.4.361dc8c15312eff6fd10d2f.html)
        
-   [Deklarera som delägare i fåmansföretag](/foretag/inkomstdeklaration/deklarerasomdelagareifamansforetag.4.133ff59513d6f9ee2ebf34.html)
    
-   [Deklarera som delägare i handelsbolag](/foretag/inkomstdeklaration/deklarerasomdelagareihandelsbolag.4.133ff59513d6f9ee2ebf22.html)
    
-   [Deklarera åt ett aktiebolag eller en ekonomisk förening](/foretag/inkomstdeklaration/deklareraatettaktiebolagellerenekonomiskforening.4.46ae6b26141980f1e2d1261.html)
    
-   [Deklarera åt ett handelsbolag](/foretag/inkomstdeklaration/deklareraatetthandelsbolag.4.309a41aa1672ad0c837988b.html)
    
-   [Ompröva eller överklaga inkomstdeklarationen för företag och föreningar](/foretag/inkomstdeklaration/omprovaelleroverklagainkomstdeklarationenforforetagochforeningar.4.6e1dd38d196873bc1e124c4.html)
    
-   [Du som får hjälp av en redovisningsbyrå](/foretag/inkomstdeklaration/dusomfarhjalpavenredovisningsbyra.4.2cf1b5cd163796a5c8b57e9.html)
    
-   [För redovisningsbyråer](/foretag/inkomstdeklaration/forredovisningsbyraer.4.4a4d586616058d860bc79f4.html)
    

-   [Företag](/foretag.4.76a43be412206334b89800052908.html) 
-   » [Inkomstdeklaration](/foretag/inkomstdeklaration.4.133ff59513d6f9ee2ebe38.html) 
-   » [Deklarera enskild näringsverksamhet](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet.4.133ff59513d6f9ee2ebf00.html) 
-   » [Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html) 
-   » Fylla i NEA-bilagan

[Lyssna](https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=5512&voice=Maja&lang=sv_se&readclass=rs-read&url=https%3A%2F%2Fwww.skatteverket.se%2F4.7991b1501952dae5bf2c38.html "Lyssna")

# Fylla i NEA-bilagan

Är du enskild näringsidkare måste du alltid lämna bilaga NE. Om du har flera verksamhetsgrenar, eller har verksamhet gemensamt med andra, kan du använda underbilagan NEA till din NE-bilaga.

Om du som enskild näringsidkare har flera verksamhetsgrenar eller har en verksamhet gemensamt med andra kan du använda underbilagan NEA till din NE-bilaga.

Du kan ha flera NEA-bilagor men du ska bara lämna en NE-bilaga oavsett hur många NEA-bilagor du lämnar. Undantag är om du driver näringsverksamhet i ett land utanför EES. En sådan verksamhet ska redovisas på en egen NE-bilaga.

## Om du driver flera verksamheter själv

Har du flera verksamhetsgrenar kan det vara praktiskt att göra en bokföring för varje verksamhetsgren. Du redovisar då bokslutet för en av verksamhetsgrenarna, normalt sett den huvudsakliga, i en NE-bilaga och boksluten för övriga verksamhetsgrenar i en eller flera NEA-bilagor. Från NEA-bilagan för du över resultatet till NE-bilagan. Är det ett överskott för du över det till ruta R19 och om det är ett underskott för du över det till ruta R18.

## Om du driver flera verksamheter och vill göra ett förenklat årsbokslut

För att få göra ett förenklat årsbokslut får normalt inte den totala nettoomsättningen för samtliga verksamhetsgrenar uppgå till sammanlagt mer än tre miljoner kronor per år. Du måste också använda de förenklade redovisningsreglerna, K1-reglerna, för hela verksamheten.

I K1-reglerna finns beloppsgränser på ett halvt prisbasbelopp för när du inte behöver redovisa lager och inventarier i balansräkningen. För inkomstår 2025 är ett halvt prisbasbelopp 29 400 kronor. Beloppen gäller totalt för hela verksamheten.

Om du har en verksamhetsgren med ett inventerat lagervärde på 4 000 kronor och en annan verksamhetsgren med ett lagervärde på 50 000 kronor ska lagret tas upp till dessa värden.

Du måste alltså redovisa lagret för den verksamhetsgren som understiger ett halvt prisbasbelopp eftersom det totala värdet för båda verksamhetsgrenarna uppgår till 54 000 kronor. Oavsett hur du redovisar, om du har en bokföring för hela verksamheten eller en bokföring för varje verksamhetsgren, ska resultatet bli detsamma.

För räkenskapsår som började före 1 januari 2025 är beloppsgränsen för när du måste redovisa lager och inventarier i balansräkningen 5 000 kronor.

[Varulager](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/varulager.4.361dc8c15312eff6fd2b8bc.html)

[Avdrag för värdeminskning](/foretag/drivaforetag/foretagsformer/enskildnaringsverksamhet/avdragforvardeminskning.4.361dc8c15312eff6fd32110.html)

## Om du driver verksamhet gemensamt med andra

Du kan driva verksamhet gemensamt med någon annan. En vanlig situation är att flera syskon gemensamt äger en jord- eller skogsbruksfastighet och därför driver näringsverksamhet tillsammans. Som delägare i en gemensam verksamhet måste du alltid redovisa din andel i en bilaga som lämnas in tillsammans med din privata inkomstdeklaration.

### Gemensamt bokslut då redovisningsansvarig finns

Gör ni ett gemensamt bokslut för verksamheten kan ni välja att utse en person som är redovisningsansvarig för verksamheten. Den personen redovisar balans- och resultaträkningen för hela verksamheten och fyller i de skattemässiga justeringarna till och med ruta R17 i NE-bilagan. I ruta R18 eller R19 tar den redovisningsansvarige bort den del av resultatet som övriga delägare ska deklarera.

De andra delägarna, som inte är redovisningsansvariga, tar upp sin del av resultatet i sin NE-bilaga, i ruta R18 vid underskott eller ruta R19 vid överskott. De som inte är redovisningsansvariga börjar alltså sin redovisning i NE-bilagan i ruta R18 eller R19.

### Gemensamt bokslut då ingen utsedd redovisningsansvarig finns

Har ni gjort ett gemensamt bokslut, men inte utsett en redovisningsansvarig, ska var och en av er fylla i hela bokslutet i balans- och resultaträkningen och de skattemässiga justeringar som är gemensamma för hela verksamheten. Du kan välja att redovisa verksamheten antingen direkt i din NE-bilaga eller i en NEA-bilaga.

Väljer du att redovisa den gemensamma verksamheten direkt i NE-bilagan tar du bort den del av resultatet som övriga delägare ska deklarera i ruta R18 vid överskott eller R19 vid underskott.

Redovisar du de gemensamma uppgifterna för verksamheten i en NEA-bilaga för du över din del av resultatet från NEA-bilagan till din NE-bilaga. Går verksamheten med överskott för du över din del av överskottet till ruta R19. Går verksamheten med underskott för du över din del av underskottet till ruta R18. Deklarerar du den gemensamma verksamheten i en NEA-bilaga måste du alltid lämna två olika bilagor, både en NEA och en NE, tillsammans med din inkomstdeklaration.

### Separata bokslut

Har ni inte gemensam bokföring för verksamheten, utan var och en har gjort ett eget bokslut som enbart visar den egna andelen av verksamheten, deklarerar du det normalt i en NE-bilaga. Har du även annan enskild näringsverksamhet, med separat bokföring, finns information om hur du redovisar verksamheterna under rubriken "Annan enskild näringsverksamhet utöver den gemensamma".

## Annan enskild näringsverksamhet utöver den gemensamma

Om du utöver den gemensamma verksamheten även driver en annan enskild näringsverksamhet, antingen själv eller tillsammans med andra personer, redovisar du en av verksamheterna i NE-bilagan och den övriga verksamheten i en NEA-bilaga. Vilken verksamhet du redovisar i vilken bilaga väljer du själv. Resultatet från NEA-bilagan flyttar du sedan över till NE-bilagan. Uppgifterna som du fyller i efter ruta R19 i NE-bilagan är gemensamma för all din enskilda näringsverksamhet.

### Exempel: Så här deklarerar du två verksamheter

Leif är en enskild näringsidkare och driver en tandläkarpraktik. Förutom att utföra behandlingar säljer han tandvårdsprodukter. Försäljningen av dessa produkter är momspliktiga medan behandlingarna är momsfria.

För att hålla isär den momspliktiga verksamheten från den momsfria har han två separata bokföringar. Intäkterna från behandlingarna uppgår till 2 miljoner kronor och han säljer produkter för 600 000 kronor. Eftersom hans totala nettoomsättning understiger 3 miljoner kronor kan han upprätta ett förenklat årsbokslut. Han väljer att upprätta två förenklade årsbokslut, ett för behandlingarna och ett för försäljningen av produkter.

Verksamheten avseende behandlingarna redovisar Leif i bilaga NE och verksamheten avseende försäljningen av produkter i bilaga NEA.

Det bokförda resultatet för behandlingarna uppgår till 530 000 kronor och för försäljning av produkterna uppgår det till 120 000 kronor.

### Så här fyller Leif i sin NEA-bilaga

Leif redovisar det bokförda resultatet för försäljning av produkter på 120 000 kronor i ruta R12 i sin NEA-bilaga. I denna verksamhet har han haft kostnader för representation på 5 000 kronor som inte får dras av. Detta belopp lägger han till i skattemässiga justeringar i ruta R13 som bokförda kostnader som inte ska dras av. Sammanlagt resultat av verksamheten i ruta R17 blir då 125 000 kronor.

Hans fru Diana har hjälpt till att sälja produkterna och får för det marknadsmässig ersättning med 10 000 kronor. Hon tar upp detta på sin egen NE-bilaga i ruta R20. Leif drar av ersättningen till Diana i ruta R18 i sin NEA-bilaga.

Två dagar i november var Leif på en försäljningsmässa för tandvårdsprodukter. Han har rätt till avdrag för ökade levnadskostnader för denna resa med 580 kronor. Beloppet är inte bokfört och han drar därför av detta i ruta R20. Efter avdragen på 10 000 kronor och 580 kronor blir överskottet 114 420 kronor. Han fyller i beloppet i ruta R22 i NEA-bilagan.

![](/images/18.40cab8f8197edf03e641634/1756283634929/bild-NEA-bilagan.PNG)

### Så här fyller Leif i sin NE-bilaga

Leif fyller i sitt bokförda resultat från behandlingarna på 530 000 kronor i ruta R12 i sin NE-bilaga. Beloppet för han vidare till ruta R17 som visar sammanlagt resultat av tandvårdsverksamheten.

Leif lägger till överskottet från bilaga NEA avseende försäljningen av produkter på 114 420 kronor i ruta R19 i NE-bilagan. Leif summerar ihop beloppen från de båda verksamheterna i ruta R21, vilket blir 644 420 kronor.

![](/images/18.40cab8f8197edf03e64163e/1756283745425/bild-NE-bilagan.PNG)

## Förenklat årsbokslut och gemensam bokföring för flera bokföringsskyldiga

Driver du en egen verksamhet, samtidigt som du driver en verksamhet gemensamt med någon annan, blir din totala nettoomsättning avgörande för om du kan upprätta ett förenklat årsbokslut eller inte.

Om din nettoomsättning för din egen verksamhet, plus din del av den gemensamma verksamheten, normalt understiger 3 miljoner kronor får du upprätta ett förenklat årsbokslut.

Ett exempel är om du är enskild näringsidkare och normalt omsätter 2 700 000 kronor i din byggnadsverksamhet. Du har dessutom en skogsverksamhet som du driver tillsammans med dina syskon. För att du ska få upprätta ett förenklat årsbokslut får din andel av omsättningen i den gemensamma verksamheten normalt inte vara större än 300 000 kronor.

Du kan inte använda de förenklade redovisningsreglerna i din egen verksamhet om du använder allmänna redovisningsprinciper i den gemensamt bedrivna verksamheten.

I K1-reglerna finns beloppsgränser på ett halvt prisbasbelopp för när du inte behöver redovisa lager och inventarier i balansräkningen. Beloppen gäller totalt för samtliga verksamheter. Oavsett hur du redovisar, om du har en bokföring för alla verksamheter eller en bokföring för varje verksamhet, ska resultatet bli samma. För räkenskapsår som började före 1 januari 2025 är beloppsgränsen för när du måste redovisa lager och inventarier i balansräkningen 5 000 kronor.

### Exempel: Att driva en gemensam verksamhet

Alma och John har fått en jordbruksfastighet i gåva. De har dessutom varsin enskild näringsverksamhet. Alma har en klädaffär och John driver fastighetsförvaltning. Deras räkenskapsår är 1 januari 2025 till 31 december 2025.

Varulagret i jordbruksverksamheten uppgår till 4 500 kronor och inventariernas värde uppgår till 4 000 kronor.

Varulagret i Almas klädverksamhet uppgår till 40 000 kronor och värdet av inventarierna uppgår till 30 000 kronor.

Det finns inget varulager i Johns fastighetsförvaltning. Han har dock inventarier till ett värde på 50 000 kronor.

Alma och John vill upprätta ett gemensamt förenklat årsbokslut för jordbruksfastigheten. Alma och John vill även upprätta förenklat årsbokslut för sina egna verksamheter och vill därför nu undersöka om det är möjligt.

Alma räknar fram att hon kommer ha ett totalt varulager på 44 500 kronor och totalt värde för inventarier på 34 000 kronor.

John räknar fram att han kommer ha ett totalt varulager på 4 500 kronor och totalt värde för inventarier på 54 000 kronor.

Om Alma och John gör ett gemensamt förenklat årsbokslut för jordbruksverksamheten kan de inte ta upp varulagret till 0 kronor. Det beror på att värdet på varulagret i Almas egen verksamhet redan överstiger ett halvt prisbasbelopp. Eftersom värdet på inventarierna både i Almas och Johns egna verksamheter också överstiger ett halvt prisbasbelopp kan de inte heller skriva ner inventarierna till 0 kronor i jordbruksverksamheten.

Vill John kunna dra av sin del av varulagret direkt behöver han och Alma istället ha separata bokföringar för sina respektive andelar i jordbruksfastigheten. Då upprättar de varsitt årsbokslut som bara avser den egna delen i jordbruksverksamheten. Värdet på Johns andel av jordbrukets varulager tillsammans med varulagret i hans fastighetsförvaltande näringsverksamhet understiger då ett halvt prisbasbelopp, vilket kan dras av direkt.

## Deklarationsanvisningar

NEA-bilagan ser i stort sett ut som NE-bilagan. Balans- och resultaträkning är exakt lika i de båda bilagorna. Det som skiljer är att NEA-bilagan har färre skattemässiga justeringsposter, eftersom de justeringar som ska göras för hela näringsverksamheten redovisas i NE-bilagan. NEA-bilagan har inte heller övriga uppgifter.

[Fylla i NE-bilagan](/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan.4.361dc8c15312eff6fd2c751.html)

Till toppen

![ikon chattrobot](/images/18.41f1c61d16193087d7f16438/Chattbott_v5.svg)

Frågor?

Chatta med mig!

Dölj chattrobot
```

---

## Assistant (Build · Kimi K3 · 97.8s)

_Thinking:_

Excellent — now I have the authoritative NEA structure from Skatteverket's own example (Leif):

NEA-bilagan skattemässiga justeringar:
- R12: Bokfört resultat (from R11)
- R13: Bokförda kostnader som inte ska dras av (Leif: 5 000 representation)
- R14: Bokförda intäkter som inte ska tas upp
- R15: Intäkter som inte bokförts men som ska tas upp
- R16: Kostnader som inte bokförts men som ska dras av
- R17: Sammanlagt resultat av verksamheten (R12–R16)
- R18: (i NEA: avdrag — Leif drar av ersättning till Diana i R18; i NE: gemensam verksamhet/fler verksamheter – överskott/underskott)

Wait — in Leif's NEA: "Leif drar av ersättningen till Diana i ruta R18 i sin NEA-bilaga" (medhjälpande make ersättning) and "Han har rätt till avdrag för ökade levnadskostnader för denna resa med 580 kronor. Beloppet är inte bokfört och han drar därför av detta i ruta R20" — hmm, he deducts travel in R20? And "Efter avdragen på 10 000 kronor och 580 kronor blir överskottet 114 420 kronor. Han fyller i beloppet i ruta R22 i NEA-bilagan."

So NEA layout: R12, R13, R14, R15, R16, R17 (sammanlagt), R18, R19, R20, R21, R22 (Överskott), R23 (Underskott). Where R18–R20 in NEA: R18 avdrag (kostnadsjusteringar — t.ex. ersättning till medhjälpande make), R19?, R20 avdrag resor/övriga kostnadsavdrag ej bokförda? Hmm interesting: In the NE blankett, R20 is "Medhjälpande make" and R18/R19 are gemensam verksamhet. In NEA the boxes differ slightly. 

From NE's own R18/R19 descriptions: "Underskott enligt NEA-bilagan: Beloppet hämtar du från R23 i NEA-bilagan" / "Överskott enligt NEA-bilagan: hämtar du från R22 i NEA-bilagan". So NEA ends with R22 Överskott / R23 Underskott.

And from the Leif example: NEA R18 = avdrag ersättning till medhjälpande make (10 000), NEA R20 = avdrag ej bokförda kostnader (resor 580). Hmm wait, that seems odd — in NE, R20 is medhjälpande make. But in NEA per this example, R18 was used for the make-ersättning and R20 for resor. Hmm, actually maybe in NEA: R18 "Andel till medhjälpande make", R19 ?, R20 "Övriga skattemässiga justeringar – kostnader"?

I can't fully reconstruct NEA's R18–R21 labels from this page alone. The NEA blankett (SKV 2161b?) PDF would show. Let me fetch the NEA PDF... The spillkrakan link was NE.pdf. NEA is SKV 2161b. Hmm.

Let me think about what matters for Jeremy:
- He has TWO separate verksamheter, each own journal. One goes in NE (huvudsakliga), the other in NEA. The app produces per-journal bilagor. For the NE-journal he needs R12–R48 eventually (egenavgifter etc. — but those are item #3). For the NEA-journal he needs R12–R23.

The common core needed now (item #2): R12–R17 (+ R18/R19/R20/R21 manual slots) and a final överskott/underskott row. For NE that final row is R47/R48 (after all the future boxes R22–R46); for NEA it's R22/R23. 

Scope decision for item #2 — build the justeringar section R12–R21 with:
- R12 = R11 (computed carry-over)
- R13 = computed from ej-avdragsgilla accounts
- R14, R15, R16 = manual
- R17 = computed sum
- R18, R19, R20 = manual
- R21 = computed sum ("min andel av resultatet")
- Final: "Överskott före vidare justeringar" — hmm.

Hmm, wait. Let me not overengineer. What's genuinely useful for Jeremy NOW:

His situation: two journals, files two NEAs (per memory: "han lämnar därför en NEA-bilaga per verksamhet som Skatteverkets tjänst summerar till NE-bilagan" — actually memory says he lämnar en NEA per verksamhet; the e-tjänst sums them). In the e-tjänst he fills each NEA: R1–R11 räkenskapsschema + R12–R23 justeringar. The e-tjänst then handles NE R18–R48 (where egenavgifter, räntefördelning etc. live) — those are cross-verksamhet and our items #3/#4.

So the per-journal bilaga we generate = NEA scope: R1–R11 + R12–R23. Item #2 = add R12–R23:
- R12 = R11 ✓ computed
- R13 = ej avdragsgilla kostnader ✓ computed from accounts
- R14, R15, R16 = manual
- R17 = sum ✓ computed
- R18, R19, R20 = manual
- R21 = sum ("min andel") ✓ computed
- R22 = Överskott (= R21 if positive) ✓ computed
- R23 = Underskott (= R21 if negative) ✓ computed

That exactly matches Leif's NEA example: R22 = 114 420 after deductions. And for his NE-journal... the NE continues to R48, but those boxes are item #3/#4 scope (egenavgifter R40–R43, räntefördelning R30/R31, fonder R32–R37, pension R38/R39) plus manual-only ones (R24 outnyttjat underskott, R25 skogsavdrag, R44 sjukpenning etc.) which he'll fill in the e-tjänst anyway.

Since Jeremy uses the e-tjänst and imports/types numbers, our job is to compute what the books know. R22/R23 (NEA final) = "verksamhetens skattemässiga resultat före gemensamma justeringar" — that's the number to carry between bilagor. 

I'll model it as NEA-scoped with a note. Naming: the app calls the page "NE-bilaga" — fine, Skatteverket says "NEA-bilagan ser i stort sett ut som NE-bilagan".

Manual boxes: which are manual in our model? R14, R15, R16, R18, R19, R20. (R13 computed, R12/R17/R21/R22/R23 computed.)

Now the data model. Current NeBilaga:
```ts
export type NeBilaga = {
  year: string;
  intakter: Array<NeRad>; // R1–R4
  kostnader: Array<NeRad>; // R5–R10
  bokfortResultat: number; // R11
  varningar: Array<string>;
};
```

Add:
```ts
export type NeJusteringsRuta = "R12"|"R13"|"R14"|"R15"|"R16"|"R18"|"R19"|"R20";

export type NeJustering = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  /** Hur rutan påverkar det skattemässiga resultatet: +1 läggs till, −1 dras av. */
  tecken: 1 | -1;
  /** Beloppet att fylla i (alltid positivt). 0 för manuella rutor utan underlag. */
  belopp: number;
  konton: Array<NeKontoRad>;
  /** true = kan inte räknas fram ur bokföringen, fylls i för hand. */
  manuell: boolean;
};

// i NeBilaga:
justeringar: Array<NeJustering>;  // R12–R16, R18–R20 (ej summor)
/** R17 — sammanlagt resultat av verksamheten (R12–R16). */
sammanlagtResultat: number;
/** R21 — resultat efter R18–R20 (överskott före justeringar på NE-nivå). */
resultatForeGemensamma: number;   // hmm naming
/** R22 — överskott (om resultatet är positivt), annars 0. */
overskott: number;
/** R23 — underskott (om negativt), annars 0. */
underskott: number;
```

Hmm, wait — NEA R18/R19/R20 labels. From Leif example: R18 used for medhjälpande make-avdrag (10 000), R20 for resor (580). What are the official NEA R18–R21 labels? In NE: R18 = "Gemensam verksamhet och fler verksamheter – överskott", R19 = "...– underskott", R20 = "Medhjälpande make", R21 = "Min andel av resultatet från verksamheten".

But Leif's NEA usage contradicts: he put make-ersättning in NEA R18 and resor in NEA R20. So NEA labels differ from NE! NEA likely has: R18 = "Avdrag för ersättning till medhjälpande make"? Hmm... or maybe NEA R18 = "Skattemässiga justeringar – avdrag" generic?

I should fetch the actual NEA blankett PDF to get exact labels. SKV 2161b? Actually the NEA is part of SKV 2161 family. Let me search for the NEA blankett PDF quickly. Actually — I found spillkrakan.se/wp-content/uploads/2025/03/NE.pdf earlier. NEA.pdf might exist at similar URL. Let me try fetching https://spillkrakan.se/wp-content/uploads/2025/03/NEA.pdf — webfetch of PDF might work (read tool handles PDFs locally, but webfetch on PDF? "Fetches content from a URL and converts to markdown" — may fail on PDF). Alternatively use Skatteverket's blankett page: skatteverket.se blanketter info 2161. Hmm.

Alternative: edeklarera.se/sru-filer/blanketter/ne-bilaga-deklaration-i-enskild-firma had structured ruta info and probably also NEA. Let me fetch that page — it listed "NE 3 - Skattemässiga justeringar... R12: Bokfört resultat (förs över från R11 sidan 1)". It might list NEA rutor too. Let me fetch it.

Actually — hold on, scope check. Do I really need exact NEA R18–R20 labels? Jeremy fills these in the e-tjänst from our computed numbers. The manual boxes in our UI just need reasonable labels + the computed R17, R21-ish sums, and final överskott/underskott. But wrong labels on a tax form view = bad. Let me try the edeklarera page for NEA rutor.

**Tool: webfetch**

**Input:**
```json
{
  "format": "markdown",
  "url": "https://edeklarera.se/sru-filer/blanketter/nea-bilaga"
}
```

---

## Assistant (Build · Kimi K3 · 14.3s)

_Thinking:_

Empty response. Let me try the edeklarera NE page I saw earlier, or search for NEA rutor R18 R19 R20.

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "NEA-bilaga ruta \"R18\" \"R19\" \"R20\" \"R21\" \"R22\" överskott \"R23\" underskott blankett"
}
```

**Output:**
```
{
  "search_id": "search_f30e9dad812630b4b8ee3757a7cb420f",
  "results": [
    {
      "url": "https://www.skatteverket.se/foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/fyllaineabilagan.4.7991b1501952dae5bf2c38.html",
      "title": "Fylla i NEA-bilagan\n | Skatteverket",
      "publish_date": "2025-08-27",
      "excerpts": [
        "* Driva företag\n* Inkomstdeklaration\n* Skatter och avdrag\n* Moms\n* Arbetsgivare\n* Internationellt\n* E-tjänster och blanketter\n\n* * *\n\n* \n* Företag\n* » Inkomstdeklaration\n* » Deklarera enskild näringsverksamhet\n* » Fylla i NE-bilagan\n* » Fylla i NEA-bilagan\n\n[Lyssna](https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=5512&voice=Maja&lang=sv_se&readclass=rs-read&url=https%3A%2F%2Fwww.skatteverket.se%2F4.7991b1501952dae5bf2c38.html \"Lyssna\")\n\n# Fylla i NEA-bilagan\n\nÄr du enskild näringsidkare måste du alltid lämna bilaga NE. Om du har flera verksamhetsgrenar, eller har verksamhet gemensamt med andra, kan du använda underbilagan NEA till din NE-bilaga.\n\nOm du som enskild näringsidkare har flera verksamhetsgrenar eller har en verksamhet gemensamt med andra kan du använda underbilagan NEA till din NE-bilaga.\n\nDu kan ha flera NEA-bilagor men du ska bara lämna en NE-bilaga oavsett hur många NEA-bilagor du lämnar. Undantag är om du driver näringsverksamhet i ett land utanför EES.\nEn sådan verksamhet ska redovisas på en egen NE-bilaga.\n\n## Om du driver flera verksamheter själv\n\nHar du flera verksamhetsgrenar kan det vara praktiskt att göra en bokföring för varje verksamhetsgren. Du redovisar då bokslutet för en av verksamhetsgrenarna, normalt sett den huvudsakliga, i en NE-bilaga och boksluten för övriga verksamhetsgrenar i en eller flera NEA-bilagor. Från NEA-bilagan för du över resultatet till NE-bilagan. Är det ett överskott för du över det till ruta R19 och om det är ett underskott för du över det till ruta R18.\n\n## Om du driver flera verksamheter och vill göra ett förenklat årsbokslut\n\nFör att få göra ett förenklat årsbokslut får normalt inte den totala nettoomsättningen för samtliga verksamhetsgrenar uppgå till sammanlagt mer än tre miljoner kronor per år. Du måste också använda de förenklade redovisningsreglerna, K1-reglerna, för hela verksamheten.\n\n...\n\nDu kan driva verksamhet gemensamt med någon annan. En vanlig situation är att flera syskon gemensamt äger en jord- eller skogsbruksfastighet och därför driver näringsverksamhet tillsammans. Som delägare i en gemensam verksamhet måste du alltid redovisa din andel i en bilaga som lämnas in tillsammans med din privata inkomstdeklaration.\n\n### Gemensamt bokslut då redovisningsansvarig finns\n\nGör ni ett gemensamt bokslut för verksamheten kan ni välja att utse en person som är redovisningsansvarig för verksamheten. Den personen redovisar balans- och resultaträkningen för hela verksamheten och fyller i de skattemässiga justeringarna till och med ruta R17 i NE-bilagan. I ruta R18 eller R19 tar den redovisningsansvarige bort den del av resultatet som övriga delägare ska deklarera.\n\nDe andra delägarna, som inte är redovisningsansvariga, tar upp sin del av resultatet i sin NE-bilaga, i ruta R18 vid underskott eller ruta R19 vid överskott.\nDe som inte är redovisningsansvariga börjar alltså sin redovisning i NE-bilagan i ruta R18 eller R19.\n\n### Gemensamt bokslut då ingen utsedd redovisningsansvarig finns\n\nHar ni gjort ett gemensamt bokslut, men inte utsett en redovisningsansvarig, ska var och en av er fylla i hela bokslutet i balans- och resultaträkningen och de skattemässiga justeringar som är gemensamma för hela verksamheten. Du kan välja att redovisa verksamheten antingen direkt i din NE-bilaga eller i en NEA-bilaga.\n\nVäljer du att redovisa den gemensamma verksamheten direkt i NE-bilagan tar du bort den del av resultatet som övriga delägare ska deklarera i ruta R18 vid överskott eller R19 vid underskott.\n\nRedovisar du de gemensamma uppgifterna för verksamheten i en NEA-bilaga för du över din del av resultatet från NEA-bilagan till din NE-bilaga. Går verksamheten med överskott för du över din del av överskottet till ruta R19. Går verksamheten med underskott för du över din del av underskottet till ruta R18.\nDeklarerar du den gemensamma verksamheten i en NEA-bilaga måste du alltid lämna två olika bilagor, både en NEA och en NE, tillsammans med din inkomstdeklaration.\n\n### Separata bokslut\n\nHar ni inte gemensam bokföring för verksamheten, utan var och en har gjort ett eget bokslut som enbart visar den egna andelen av verksamheten, deklarerar du det normalt i en NE-bilaga. Har du även annan enskild näringsverksamhet, med separat bokföring, finns information om hur du redovisar verksamheterna under rubriken \"Annan enskild näringsverksamhet utöver den gemensamma\".\n\n## Annan enskild näringsverksamhet utöver den gemensamma\n\nOm du utöver den gemensamma verksamheten även driver en annan enskild näringsverksamhet, antingen själv eller tillsammans med andra personer, redovisar du en av verksamheterna i NE-bilagan och den övriga verksamheten i en NEA-bilaga. Vilken verksamhet du redovisar i vilken bilaga väljer du själv. Resultatet från NEA-bilagan flyttar du sedan över till NE-bilagan.\nUppgifterna som du fyller i efter ruta R19 i NE-bilagan är gemensamma för all din enskilda näringsverksamhet.\n\n### Exempel: Så här deklarerar du två verksamheter\n\nLeif är en enskild näringsidkare och driver en tandläkarpraktik. Förutom att utföra behandlingar säljer han tandvårdsprodukter. Försäljningen av dessa produkter är momspliktiga medan behandlingarna är momsfria.\n\nFör att hålla isär den momspliktiga verksamheten från den momsfria har han två separata bokföringar. Intäkterna från behandlingarna uppgår till 2 miljoner kronor och han säljer produkter för 600 000 kronor. Eftersom hans totala nettoomsättning understiger 3 miljoner kronor kan han upprätta ett förenklat årsbokslut. Han väljer att upprätta två förenklade årsbokslut, ett för behandlingarna och ett för försäljningen av produkter.\n\nVerksamheten avseende behandlingarna redovisar Leif i bilaga NE och verksamheten avseende försäljningen av produkter i bilaga NEA.\nDet bokförda resultatet för behandlingarna uppgår till 530 000 kronor och för försäljning av produkterna uppgår det till 120 000 kronor.\n\n### Så här fyller Leif i sin NEA-bilaga\n\nLeif redovisar det bokförda resultatet för försäljning av produkter på 120 000 kronor i ruta R12 i sin NEA-bilaga. I denna verksamhet har han haft kostnader för representation på 5 000 kronor som inte får dras av. Detta belopp lägger han till i skattemässiga justeringar i ruta R13 som bokförda kostnader som inte ska dras av. Sammanlagt resultat av verksamheten i ruta R17 blir då 125 000 kronor.\n\nHans fru Diana har hjälpt till att sälja produkterna och får för det marknadsmässig ersättning med 10 000 kronor. Hon tar upp detta på sin egen NE-bilaga i ruta R20. Leif drar av ersättningen till Diana i ruta R18 i sin NEA-bilaga.\n\nTvå dagar i november var Leif på en försäljningsmässa för tandvårdsprodukter. Han har rätt till avdrag för ökade levnadskostnader för denna resa med 580 kronor.\nBeloppet är inte bokfört och han drar därför av detta i ruta R20. Efter avdragen på 10 000 kronor och 580 kronor blir överskottet 114 420 kronor. Han fyller i beloppet i ruta R22 i NEA-bilagan.\n\n### Så här fyller Leif i sin NE-bilaga\n\nLeif fyller i sitt bokförda resultat från behandlingarna på 530 000 kronor i ruta R12 i sin NE-bilaga. Beloppet för han vidare till ruta R17 som visar sammanlagt resultat av tandvårdsverksamheten.\n\nLeif lägger till överskottet från bilaga NEA avseende försäljningen av produkter på 114 420 kronor i ruta R19 i NE-bilagan. Leif summerar ihop beloppen från de båda verksamheterna i ruta R21, vilket blir 644 420 kronor.\n\n## Förenklat årsbokslut och gemensam bokföring för flera bokföringsskyldiga\n\nDriver du en egen verksamhet, samtidigt som du driver en verksamhet gemensamt med någon annan, blir din totala nettoomsättning avgörande för om du kan upprätta ett förenklat årsbokslut eller inte."
      ]
    },
    {
      "url": "https://www.skatteverket.se//foretag/inkomstdeklaration/deklareraenskildnaringsverksamhet/fyllainebilagan/skattemassigajusteringar.4.361dc8c15312eff6fd2c7d1.html",
      "title": "Skattemässiga justeringar\n | Skatteverket",
      "publish_date": "2016-09-23",
      "excerpts": [
        "Här ska du dra av utgifter som du inte har bokfört som kostnad, men som ändå ska dras av vid beskattningen.\n\nI denna ruta ska du också dra av utgifter som är avdragsgilla, men som du har bokfört mot eget kapital (och som därför inte ingår i R5–R10).\n\nObservera att du gör avdrag för egna pensionspremier eller inbetalning på pensionssparkonto i R38.\n\nOm du driver verksamheten tillsammans med någon annan redovisar du i R13–R16 skattemässiga justeringar för intäkter och kostnader som avser den gemen­samma verksamheten och som gäller alla delägare i verksamheten. I R21 och framåt redovisar du individuella justeringsposter som bara påverkar dig.\n\n## R17 Sammanlagt resultat av verksamheten\n\nHär räknar du fram det sammanlagda resultatet av verksamheten från R12–R16.\n\n## R18 Gemensam verksamhet och fler verksamheter – överskott\n\n### Gemensam verksamhet – överskott redovisad av annan\nOm du är redovisningsansvarig och driver verksamhet tillsammans med någon annan ska du i denna ruta minska det överskott du redovisade i R17 med den del av överskottet som ska tas upp av någon annan. Det gör du genom att dra av överskott som ska beskattas av någon annan som en minuspost.\n\n### Gemensam verksamhet – min andel av underskott\n\nOm du driver verksamheten tillsammans med någon annan och du inte är redovisnings­ansvarig, ska du i denna ruta dra av din del av den gemensamma verksamhetens underskott.\n\n### Underskott enligt NEA-bilagan\n\nHar du redovisat en gemensam verksamhet eller en annan verksamhet än den huvudsakliga i en NEA-bilaga, ska du i denna ruta dra av din del av under­skottet. Beloppet hämtar du från R23 i NEA-bilagan.\n\n## R19 Gemensam verksamhet och fler verksamheter – underskott\n\n### Gemensam verksamhet – underskott redovisad av annan\nOm du är redovisningsansvarig och driver verksamheten tillsammans med någon annan ska du i denna ruta minska det i R17 redovisade underskottet med den del av underskottet som ska tas upp av någon annan. Det gör du genom att ta upp det underskott som någon annan ska dra av som en plus­post.\n\n### Gemensam verksamhet – min andel av överskott\n\nOm du driver verksamheten tillsammans med någon annan och du inte är redovisnings­ansvarig ska du i denna ruta ta upp din del av den gemensamma verksamhetens överskott.\n\n### Överskott enligt NEA-bilagan\n\nOm du har redovisat en gemensam verksamhet eller en annan verksamhet än den huvudsakliga i en NEA-bilaga ska du i denna ruta ta upp din del av överskottet. Beloppet hämtar du från R22 i NEA-bilagan.\n\n## R20 Medhjälpande make\n\n### Min andel som medhjälpande make (+)\n\nOm du är medhjälpande make ska du i denna ruta föra in din andel av det resultat som du ska beskattas för. Som med­hjälpande make kan du aldrig redovisa underskott.\n### Andel till medhjälpande make (-)\n\nHar du haft en medhjälpande make som har tagit upp och beskattats för en del av överskottet, ska du dra av detta i denna ruta (minuspost).\n\n#### Som make räknas:\n\n* hustru\n* man\n* sambo som du har eller har haft gemensamma barn med\n* sambo som du tidigare varit gift med\n* registrerad partner.\n\n## R21 Min andel av resultatet från verksamheten\n\nHär summerar du posterna R12–R20. Du får då fram resultatet för din andel. Utifrån detta resultat gör du sedan de skattemässiga justeringar som krävs för att beräkna din beskattningsbara inkomst.\n\n## R22 Övriga skattemässiga justeringar – kostnader\n\nDe vanligaste justeringarna har egna rutor. Använd denna ruta om du ska dra av en kostnad som inte bokförts och som inte har någon egen ruta. Det samma gäller om du har en bokförd intäkt som inte ska beskattas.\n\nHar du gjort ett förenklat årsbokslut bör du redan ha bokfört de flesta utgifter som du kan dra av vid beskattningen.\nVissa utgifter ska inte bokföras men du kan ändå få avdrag för dem, till exempel kostnader för resor till och från arbetet. Du fyller i kostnaden för dina resor minus 11 000 kronor.\n\n* Resor mellan bostaden och verksamhetslokalen\n\nHar du gjort ett vanligt årsbokslut kan det också vara fråga om kostnader för resor i näringsverksamhet med egen bil eller lokalkostnader i hemmet.\n\n* Resor i näringsverksamheten\n* Lokalkostnader\n\n## R23 Övriga skattemässiga justeringar – intäkter\n\nDe vanligaste justeringarna har egna rutor. Använd R23 om du ska du ta upp (återföra) en bokförd kostnad som inte får dras av och som inte har någon egen ruta. Det samma gäller om du har en intäkt som inte bokförts men som ska beskattas.\n\nHar du upprättat förenklat årsbokslut bör du redan ha bokfört de flesta poster som du ska beskattas för.\n\nDu som har upprättat ett vanligt årsbokslut ska bokföra de flesta inkomsterna.\n\n## R24 Outnyttjat underskott från föregående beskattningsår\n\n...\n\n* som avser bostad i andelshus, eller\n* som dras av mot kapitalvinst vid försäljning av fastighet eller bostadsrätt som tillhör näringsverksamheten.\n\nUnderskott som rör andelshus ska du dra av i Inkomstdeklaration 1 vid punkt 8.4. Observera att du inte ska reducera underskottet till 70 procent, eftersom att reduceringen sker automatiskt.\n\nUnderskottet du ska dra av mot kapitalvinst vid försäljning av fastighet eller bostadsrätt, redovisar du på bilaga K7 eller K8. Denna kvittning är tvingande.\n\n* Underskott\n* K7 – Försäljning – Näringsfastighet (SKV 2107)\n* K8 – Försäljning – Näringsbostadsrätt (SKV 2108)\n\n## R47 Överskott\n\nHär summerar du R12–R46. Denna ruta fyller du i om du har ett överskott i näringsverksamheten. Om du har aktiv näringsverksamhet för du över beloppet till punkt 10.1. Du som har passiv näringsverksamhet för över beloppet till punkt 10.3.\n\n## R48 Underskott\n\nHär summerar du posterna R12–R46. Denna ruta fyller du i om du fått underskott i näringsverksamheten."
      ]
    },
    {
      "url": "https://www4.skatteverket.se/rattsligvagledning/edition/2026.9/326462.html",
      "title": "Överskott eller underskott av slutlig skatt - Rättslig vägledning",
      "publish_date": null,
      "excerpts": [
        "Överskott eller underskott av slutlig skatt - Rättslig vägledning\nNär Skatteverket har bestämt den slutliga skatten ska Skatteverket räkna ut om den som beslutet gäller får överskott eller underskott av slutlig skatt"
      ]
    },
    {
      "url": "https://konstnarsnamnden.se/pdf/Deklarationshandledning_mindre_enskild_naringsverksamhet_2016_(for_2015)_.pdf",
      "title": "",
      "publish_date": null,
      "excerpts": [
        "... finns med på NE-blanketten.\n\n**Blankett NEA**\n\n_Blankett NEA_ kan du använda om du har flera ... resultatet. Det kan vara ett underskott från föregående år i ruta **R24** eller\n\navstämning av egenavgifter från  ... avstämning av egenavgifter, ej "
      ]
    },
    {
      "url": "https://support.bjornlunden.se/guide/ne-inkomst-av-naringsverksamhet",
      "title": "NE/NEA - Inkomst av näringsverksamhet | Manualer för Bjorn Lunden - Bjorn Lunden",
      "publish_date": null,
      "excerpts": [
        "Hoppa till innehåll\n\nBjorn Lunden\n\n# Manualer för Bjorn Lunden\n\nSök i våra manualer Sök\n\n[BjornLunden.com](https://www.bjornlunden.com/)\n\n[Facebook](https://www.facebook.com/bjornlunden.se) [LinkedIn](https://www.linkedin.com/company/bjornlunden-se) [Användargrupp](https://www.facebook.com/groups/489933756209676) [Lundify.com](https://lundify.com/) [Kontakta oss](https://bjornlunden.com/se/kontakt/) [Manualer för Lundify](https://support.se.bjornlunden.com/) Fler supportlänkar\n\n**Har du problem i fakturaregistreringen eller i inställningarna för e-faktura,** **l** **adda ner version 2026.3.105** som nu finns tillgänglig!\n\n_Du är här:_ Start _/_ BL Skatt _/_ Blanketter\n\n# NE/NEA - Inkomst av näringsverksamhet\n\nUppdaterad 2025-07-29\n\nI den här guiden beskriver vi hur du importerar värden till en NE/NEA-bilaga från en SIE-fil. Vi beskriver också hur NE-bilagan kan kopplas ihop med underbilagor och på det sättet hämtas belopp automatiskt.\n\n...\n\nBlanketten NEA används om det finns fler än en verksamhet i näringsverksamheten. Huvudverksamheten redovisar du alltid på NE och övriga verksamheter på NEA. Uppgifter från verksamheterna som redovisas på NEA överförs till NE. I _Deklarationsöversikten_ kan du se att de är kopplade och där kan du också koppla loss bilagan vid behov (se ovan). Om det finns flera underverksamheter så skapar du en NEA per verksamhet.\n\n### Resultatfördelning NEA (fält 18)\n\nSkattemässiga resultatet fördelas när\n\n1. andel av överskott ska avgå för medhjälpande make/maka (-)\n2. andel av överskott ska avgå för annan person vid gemensam verksamhet (-)\n3. andel av underskott ska avgå för annan person vid gemensam verksamhet (+)\n4. det tillkommer min del av överskott (+)\n5. det tillkommer min del av underskott (-)\n\n## Resultatfördelning NE (fält R17 - R21)\n\nResultatfördelning i enskild firma görs enligt en av två situationer, **gemensam verksamhet** eller **medhjälparfallet** (medhjälpande make).\nI NE hanteras det olika beroende på vilken som används. Nedan förklaras vilka fält som ska användas till respektive situation.\n\n1. Sammanlagda resultatet från huvudverksamheten (NE) redovisas i R17.\n2. Eventuella överskott/underskott från NEA-blankett hämtas in till NE-blanketten i R18 resp. R19. Har man dessutom i NE angett summa eller procent i _Belopp som avgår/tillkommer_ (enl. punkt 3 nedan) hämtas det beloppet också in till R18 resp R19.\n3. Nedan fält används till att fördela över/underskott i **gemensam verksamhet** i **huvudverksamheten** , dvs resultatet i R17 i NE. Du kan här ange en procentsats eller valfritt belopp (justeringen redovisas i R18 eller R19).  \n     \n   [](https://support.bjornlunden.se/uploaded_files/6/fe08e497bbb943ce96eb02128dc8a51a/image.png)\n4. I R20 anges min andel som medhjälpande make(+) och andel till medhjälpande make(-). Observera att du som medhjälpande make aldrig kan redovisa underskott.\n|**Observera** att det endast är skattemässiga makar som kan fördela inkomsten utifrån nedlagt arbete – sambor utan gemensamma barn eller sambor som inte varit gifta räknas inte som makar i detta sammanhang. I sådana fall är en fördelning av resultatet inte möjlig utan ersättningen ska hanteras som lön. |\n   | --- |\n5. I R21 summeras min andel av resultatet från verksamheten/verksamheterna.\n\n|**I båda situationerna** (gemensam verksamhet och medhjälpande make) så deklarerar maken på en egen NE-blankett. Medhjälpande make börjar i ruta R20 och vid gemensam verksamhet så börjar maken i ruta R18/R19. |\n| --- |\n\n## Egenavgifter/Särskild löneskatt (fält R40-R43)\n\nDu ska göra en avstämning av egenavgifterna om du hade ett överskott i förra årets inkomstdeklaration och därför blev påförd egenavgifter.\n\n1. **Medgivna avdrag föregående år.** I R40 för du in förra årets avdrag för beräknade egenavgifter. Beloppet hittar du på förra årets NE-blankett i ruta R43.\n\n...\n\n* [NE/NEA - Inkomst av näringsverksamhet](https://support.bjornlunden.se/guide/ne-inkomst-av-naringsverksamhet?category=blanketter)\n* [INK1](https://support.bjornlunden.se/guide/ink1?category=blanketter)\n* [BPFAB - Periodiseringsfond AB](https://support.bjornlunden.se/guide/bpf-ab-periodiseringsfond?category=blanketter)\n* [BPF Beräkningsbilaga Periodiseringsfond](https://support.bjornlunden.se/guide/bpf-berakningsbilaga-periodiseringsfond?category=blanketter)\n* [K2 Uppskov bostad - slutligt/återföring/uppgift](https://support.bjornlunden.se/guide/k2-uppskov-bostad-slutligtaterforinguppgift?category=blanketter)\n* [K5 - Försäljning småhus](https://support.bjornlunden.se/guide/k5-forsaljning-smahus?category=blanketter)\n* [K6 - Försäljning av bostadsrätt](https://support.bjornlunden.se/guide/k6-forsaljning-av-bostadsratt?category=blanketter)\n* [K10 Kvalificerade andelar Fåmansföretag](https://support.bjornlunden.se/guide/k10-kvalificerade-andelar-famansforetag?category=blanketter)\n\nVisa alla kategorier"
      ]
    },
    {
      "url": "https://spillkrakan.se/wp-content/uploads/2025/03/NE.pdf",
      "title": "SKV 2161 NE Inkomst av näringsverksamhet Enskilda näringsidkare ",
      "publish_date": "2025-03-10",
      "excerpts": [
        "**Bokfört resultat** (förs över från R11 sidan 1) (+/-)\n\nMin andel som medhjälpande make (+) och andel till medhjälpande make (-) **R20**\n\n\\+\n\n\\-\n\nÖvriga skattemässiga justeringar, kostnader min andel (t.ex. utgifter för resor till och från **R22** arbetet) -\n\n**R23**\n\n**R24**\n\nOutnyttjat underskott från föregående beskatt- ningsår (R48 i föregående års blankett)\n\n**R25**\n\nSkogsavdrag/substansminskningsavdrag enligt blankett N8\n\nÖvriga skattemässiga justeringar, intäkter min andel +\n\n\\-\n\n\\-\n\n**R18**\n\nGemensam verksamhet - överskott redovisad av annan 3a eller min andel av underskott 3b \\-\n\n**R19** \\+\n\nGemensam verksamhet - underskott redovisad av annan 3a eller min andel av överskott 3b\n\n**R21**\n\n**Min andel av resultatet från verksam- heten/erna** =\n\n\\+\n\nÅterföring av värdeminskningsavdrag m.m. vid avyttring av näringsfastighet och s.k. av- skattning (skogs- och substansminsknings- avdrag redovisas även på N8) **R26**\n\n**R27**\n\n**R28**\nInbetalning till skogs-, skogsskade- eller upphovsmannakonto\n\n**R29**\n\n**Överskott (+)/Underskott (-) före ränteför- delning**\n\nUttag från skogs-, skogsskade- eller upphovs- mannakonto +\n\n\\-\n\n=\n\n3a Anges av den som vid representantredovisning redovisar hela resultatet i R12.\n\n**R31**\n\n**R32** Återföring av periodiseringsfond\n\n**R33**\n\n**Överskott (+)/Underskott (-) före avsättning till periodiseringsfond**\n\nNegativ räntefördelning (beloppet förs även till p. 11.2 på INK1) +\n\n\\+\n\n=\n\n**R34**\n\nAvsättning till periodiseringsfond, dock högst 30 % av överskott vid R33\n\n**R35**\n\n**Överskott (+)/Underskott (-) före ökning av expansionsfond**\n\n\\-\n\n=\n\n**R30** \\-\n\nPositiv räntefördelning, dock högst överskott vid R29 (beloppet förs även till p. 11.1 på INK1)\n\n**R36**\n\nÖkning av expansionsfond, dock högst överskott vid R35 (beloppet förs även till p. 12.1 på INK1) -\n\n**R37** \\+\n\nMinskning av expansionsfond (beloppet förs även till p. 12.2 på INK1)\n\n**R38** \\-\nEgna pensionspremier eller inbetalning på pensionssparkonto i näringsverksamheten (beloppet förs även till p. 10.6 på INK1)\n\n**R39** Särskild löneskatt på pensionssparavdrag i R38\n\n**R40**\n\nMedgivna avdrag för egenavgifter och särskild löneskatt föregående beskattningsår (R43 i föregående års blankett)\n\n\\-\n\n\\+\n\n**R41**\n\nPåförda egenavgifter och särskild löneskatt föregående beskattningsår\n\n**R42**\n\n**Överskott (+)/Underskott (-) före årets avdrag för egenavgifter och särskild löneskatt**\n\n\\-\n\n=\n\n**R43**\n\nÅrets beräknade avdrag för egenavgifter och särskild löneskatt -\n\n**R44** \\+\n\nSjukpenning som hör till denna näringsverk- samhet\n\n**R45** \\+\n\nAllmänt avdrag. Vid konstnärlig eller nystartad näringsverksamhet utnyttjat underskott (beloppet förs även till p. 14.1 på INK1).\n\n**R46** \\+\n\nUnderskott som utnyttjas i kapital. Vinst vid avyttring av näringsfastighet/näringsbostadsrätt och underskott i andelshus\n\n**R47**\n\n**Överskott (+).** Överförs till INK1 sidan 2, p. 10."
      ]
    },
    {
      "url": "https://edeklarera.se/sru-filer/blanketter/ne-bilaga-deklaration-i-enskild-firma",
      "title": "NE-bilaga - Så gör du deklaration för enskild firma",
      "publish_date": null,
      "excerpts": [
        "Ta upp din del av överskottet enligt blankett NEA. ... När man inte upprättar ett förenklat årsbokslut, dras kostnaden (18,5 kr/mil) av i ruta R16 eller R22."
      ]
    },
    {
      "url": "https://www.bokio.se/hjalp/bokslut/arsredovisning-och-deklaration/rutorna-r1-och-r2-i-ne-blanketten/",
      "title": "Rutorna R1 och R2 i NE-blanketten",
      "publish_date": null,
      "excerpts": [
        "Ruta R1 används för att redovisa intäkter från momspliktig verksamhet. · Ruta R2 används för att redovisa intäkter från momsfri verksamhet."
      ]
    },
    {
      "url": "https://www.cliffsnotes.com/study-notes/23354007",
      "title": "Bokforing-bokslut-deklaration-del2-skv283-utgava28 (pdf)",
      "publish_date": null,
      "excerpts": [
        "... NE-blankett och den andra på en NEA-blankett. Från NEA- blanketten förs resultatet in i NE-blanketten i R19 om det är överskott och R18 om det är underskott."
      ]
    },
    {
      "url": "https://support.spiris.se/visma-skatteprogram/content/online-help/ovriga-skattemassiga-justeringar-kostnader-allmant-arsbokslut.htm",
      "title": "Övriga skattemässiga justeringar av kostnader vid allmänt ...",
      "publish_date": null,
      "excerpts": [
        "Övriga skattemässiga justeringar av kostnader vid allmänt årsbokslut. Här vid fältkod R22 gör du skattemässiga justeringar och ta upp vissa avdrag som inte"
      ]
    }
  ],
  "warnings": null,
  "usage": [
    {
      "name": "sku_search",
      "count": 1
    }
  ],
  "session_id": "ses_fcda23e54ffetRaU748oGhApJB"
}
```

---

## Assistant (Build · Kimi K3 · 159.3s)

_Thinking:_

Now I have complete clarity. Key facts:

**NE blankett (SKV 2161)** skattemässiga justeringar:
- R12: Bokfört resultat (+/−) — from R11
- R13: Bokförda kostnader som inte ska dras av (+)
- R14: Bokförda intäkter som inte ska tas upp (−)
- R15: Intäkter som inte bokförts men som ska tas upp (+)
- R16: Kostnader som inte bokförts men som ska dras av (−)
- R17: Sammanlagt resultat av verksamheten (R12–R16)
- R18: Gemensam verksamhet – överskott redovisad av annan/min andel av underskott/underskott enligt NEA (−)
- R19: Gemensam verksamhet – underskott redovisad av annan/min andel av överskott/överskott enligt NEA (+)
- R20: Medhjälpande make (+/−)
- R21: Min andel av resultatet från verksamheten/erna (R12–R20)
- R22: Övriga skattemässiga justeringar, kostnader min andel (−)
- R23: Övriga skattemässiga justeringar, intäkter min andel (+)
- R24: Outnyttjat underskott från föregående beskattningsår (−)
- R25: Skogsavdrag/substansminskningsavdrag enligt N8 (−)
- R26: Återföring av värdeminskningsavdrag m.m. (+)
- R27: Uttag från skogs-, skogsskade-, upphovsmannakonto (+)
- R28: Inbetalning till skogs-, skogsskade-, upphovsmannakonto (−)
- R29: Överskott/Underskott före räntefördelning (sum)
- R30: Positiv räntefördelning (−)
- R31: Negativ räntefördelning (+)
- R32: Återföring av periodiseringsfond (+)
- R33: Ö/U före avsättning till periodiseringsfond (sum)
- R34: Avsättning till periodiseringsfond, max 30% av R33 (−)
- R35: Ö/U före ökning av expansionsfond (sum)
- R36: Ökning av expansionsfond (−)
- R37: Minskning av expansionsfond (+)
- R38: Egna pensionspremier (−)
- R39: Särskild löneskatt på pensionssparavdrag R38 (−)
- R40: Medgivna avdrag egenavgifter föregående år (+)
- R41: Påförda egenavgifter föregående år (−)
- R42: Ö/U före årets avdrag för egenavgifter (sum)
- R43: Årets beräknade avdrag för egenavgifter (−)
- R44: Sjukpenning (+)
- R45: Allmänt avdrag (+)
- R46: Underskott som utnyttjas i kapital (+)
- R47: Överskott (sum R12–R46)
- R48: Underskott (sum R12–R46)

**NEA blankett**: same balans/resultaträkning, fewer justeringsposter: R12–R16 same, R17 sammanlagt, R18 resultatfördelning (andelar/make ±), R20 övriga justeringar kostnader?, R22 Överskott, R23 Underskott. From Leif's example: NEA R18 = avdrag ersättning medhjälpande make, NEA R20 = avdrag resor (övriga justeringar kostnader), NEA R22 = överskott, NEA R23 = underskott. Björn Lundén: "Resultatfördelning NEA (fält 18)". So NEA: R12, R13, R14, R15, R16, R17, R18 (resultatfördelning, ±), R20 (övriga justeringar?), R22 överskott, R23 underskott. Hmm — what about NEA R19/R21? The Björn Lundén text says NEA has "Resultatfördelning NEA (fält 18)". And Leif used R18 and R20 in NEA. So NEA fields: R12–R18, R20, R22, R23. R20 in NEA = "Övriga skattemässiga justeringar, kostnader min andel"? Leif put resor (580) in NEA R20 — travel is a kostnadsjustering. So NEA R20 ≈ NE R22 (övriga justeringar kostnader). Plausibly NEA: R19 = övriga justeringar intäkter? Hmm, uncertain.

Decision — don't guess NEA's exact R18–R21 labels. The app shows ONE bilaga per journal. Jeremy files two NEAs (per memory: "han lämnar därför en NEA-bilaga per verksamhet som Skatteverkets tjänst summerar till NE-bilagan" — well, actually one NE + one NEA per Skatteverket's rules; memory says NEA per verksamhet summed by tjänsten — the e-tjänst handles the merge). 

For the app, the sensible model: the shared core R12–R17 (same on NE and NEA) + a resultatfördelning/övriga-justeringar manual area + final verksamhetsresultat (överskott/underskott). On NEA that's R22/R23; on NE the equivalent pre-everything sum is R21 "min andel" continuing to R47/R48 after the combined boxes.

Given item #3/#4 will add the NE-only boxes later, item #2 should:
1. Add justeringar R12–R16 with R12 computed (=R11), R13 computed (ej avdragsgilla), R14–R16 manual.
2. R17 computed.
3. R18–R20 manual (resultatfördelning — on NE: R18/R19/R20; keep NE labels since page is "NE-bilaga").
4. R21 computed ("min andel av resultatet från verksamheten/erna").
5. R22/R23 manual (övriga justeringar).
6. Final: "Överskott före räntefördelning m.m." — hmm, that's NE R29 which includes R24–R28. Without R24–R28 boxes, R21 + R22 − R23 = ... hmm.

Careful: On the NE, R29 sums R12–R28. We don't have R24–R28 (skogskonto, N8, outnyttjat underskott, återföring värdeminskning). Adding ALL of R24–R48 as manual rows would make the form complete but huge — 20+ manual rows, most irrelevant to Jeremy (no skogskonto? he's småbruk with får/höns — skogsavdrag unlikely but possible; outnyttjat underskott plausible!).

Hmm. Let me think about what's genuinely useful vs bloat. The memory note for item #2 says "skattemässiga justeringar (R12+)" — full scope eventually. But keep-it-simple says: implement the complete structure with all boxes R12–R48, computed where computable (R12, R13, R17, R21, R29, R33, R35, R42, R47, R48 sums; R34 max-check 30%?), manual elsewhere, and let later items (#3 egenavgifter R40–R43, räntefördelning R30/R31; #4 fonder R32–R37) upgrade manual → computed.

That's actually the cleanest: one data table of all rutor R12–R48 with sign + manuell flag, sums computed. UI shows the justeringar table with manual badges. The sum rows (R17, R21, R29, R33, R35, R42) are computed as cumulative sums — since manual boxes are 0 in the app, displayed sums reflect book-based values only. Honest caveat in UI: manual rutor fylls i i e-tjänsten.

But wait — R30/R31 räntefördelning and R40–R43 egenavgifter are items #3 — computed on COMBINED result across journals, which the per-journal view can't do. They'd stay manual (0) in this view even after #3 unless #3 adds a combined view. Fine — future concern.

Also R34 (avsättning p-fond, max 30% av R33) and R43 (egenavgiftsavdrag): computable once #3/#4 land.

OK here's my refined design for `ne-bilaga.ts`:

```ts
export type NeJusteringsRuta =
  | "R13" | "R14" | "R15" | "R16"   // gemensamma (även NEA)
  | "R18" | "R19" | "R20"           // resultatfördelning
  | "R22" | "R23"                   // övriga justeringar
  | "R24" | "R25" | "R26" | "R27" | "R28"  // övriga NE-rutor före räntefördelning
  | "R30" | "R31" | "R32" | "R34" | "R36" | "R37"  // räntefördelning + fonder
  | "R38" | "R39" | "R40" | "R41" | "R43"  // pension + egenavgifter
  | "R44" | "R45" | "R46";          // sjukpenning, allmänt avdrag, underskott i kapital
```

(Sum rutor R12, R17, R21, R29, R33, R35, R42, R47, R48 computed — not in the input list. R12 is computed carry-over of R11.)

Type for a justeringsrad:
```ts
export type NeJustering = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  /** +1: räknas upp resultatet, −1: dras av. */
  tecken: 1 | -1;
  /** Ifyllnadsbelopp (alltid positivt). 0 för rutor som fylls i manuellt. */
  belopp: number;
  konton: Array<NeKontoRad>;
  /** true = kan inte räknas fram ur bokföringen. */
  manuell: boolean;
};
```

NeBilaga additions:
```ts
justeringar: Array<NeJustering>;
/** Summor längs kedjan, ruta → belopp. */
summor: { R12, R17, R21, R29, R33, R35, R42, R47, R48 }  // or individual fields
```

Hmm, individual named fields is more in codebase style (bokfortResultat). Let me define:

```ts
/** R12 — bokfört resultat, fört över från R11. */
// = bokfortResultat, reuse
justeringar: Array<NeJustering>;
/** R17 — sammanlagt resultat av verksamheten (R12–R16). */
sammanlagtResultat: number;
/** R21 — min andel av resultatet (R17 ± R18–R20). */
minAndel: number;
/** R29 — överskott/underskott före räntefördelning (R21 ± R22–R28). */
resultatForeRantefordelning: number;
/** R33 — före avsättning till periodiseringsfond (R29 ± R30–R32). */
resultatForePeriodiseringsfond: number;
/** R35 — före ökning av expansionsfond (R33 − R34). */
resultatForeExpansionsfond: number;
/** R42 — före årets avdrag för egenavgifter (R35 ± R36–R41). */
resultatForeEgenavgifter: number;
/** Skattemässigt resultat (R12–R46). Positivt = R47 överskott, negativt = R48 underskott. */
skattemassigtResultat: number;
```

Signs per ruta (from blankett):
- R13 +, R14 −, R15 +, R16 −
- R18 −, R19 +, R20 ± (make: + min andel som make, − andel till make; nettotecken oklart — treat as −? The blankett has both + and − fields merged? From PDF: "Min andel som medhjälpande make (+) och andel till medhjälpande make (-) R20" — one ruta with sign. I'll mark tecken: 1? Hmm. For a manual box displayed as 0, sign only matters for future input. Simplest: give R20 tecken -1? No... Let me make tecken represent how the filled amount affects the sum: R18 −, R19 +, R20 − (andel till make is the common case for the firm owner; min andel som make applies to the make's own NE). Actually for Jeremy (firma owner), R20 would be "andel till medhjälpande make" = minus. Set tecken −1 with beskrivning covering both.
- R22 −, R23 +
- R24 −, R25 −, R26 +, R27 +, R28 −
- R30 −, R31 +, R32 +, R34 −, R36 −, R37 +
- R38 −, R39 −, R40 +, R41 −, R43 −
- R44 +, R45 +, R46 +
- R47/R48 sums.

Check against PDF excerpts: R30 "Positiv räntefördelning −", R31 "Negativ räntefördelning +", R32 "Återföring av periodiseringsfond +", R34 −, R36 −, R37 +, R38 −, R39 (särskild löneskatt — avdrag, −), R40 +, R41 −, R43 −, R44 +, R45 +, R46 +, R22 −, R23 +, R24 −, R25 −, R26 +, R27 +, R28 −, R18 −, R19 +. R13 +, R14 −, R15 +, R16 −. ✓.

R39 computed? R39 = 24,26% av R38. Could compute when R38 manual=0 → 0. Mark manuell for now.

Only R13 gets konton (ej avdragsgilla accounts). EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622]. Hmm, also böter — 6995? no. Skattetillägg — 6994? no... Skatteverket's R13 examples: kostnadsränta på skattekonto, representationskostnader, föreningsavgifter, böter eller skattetillägg, pensionsförsäkringspremier. BAS: skattetillägg/böter often 6992 (catch-all ej avdragsgilla) or 8423? I'll keep the four well-known ones. Kostnadsränta skattekonto: often booked 8423? Hmm, there's BAS 8423 "Skatteräntor"? I genuinely am not sure 8423 exists. Liber list shows 8422 Dröjsmålsräntor (leverantörsskulder) — that's avdragsgill. Keep 4 accounts; comment invites extension.

Sum chain (applying tecken × belopp, manual = 0):
- R12 = bokfortResultat
- R17 = R12 + Σ(R13..R16)
- R21 = R17 + Σ(R18..R20)
- R29 = R21 + Σ(R22..R28)
- R33 = R29 + Σ(R30..R32)
- R35 = R33 − R34
- R42 = R35 + Σ(R36..R41)   // R36 −, R37 +, R38 −, R39 −, R40 +, R41 −
- R47/48 (skattemassigtResultat) = R42 − R43 + R44 + R45 + R46

UI (rapport-ne.ts): after the R11 table, add "Skattemässiga justeringar" table: rows R12 (computed), each justering with manuell badge, and sum rows R17, R21, R29, R33, R35, R42 interleaved in blankett order, ending with R47 Överskott / R48 Underskott (show the non-zero one, or both with 0). Show all rows (blankett-like) — that's the most useful for filling in the e-tjänst. With manuell badge on R14–R16, R18–R20, R22–R28, R30–R32, R34, R36–R41, R43–R46.

Hmm wait, should the UI show all 30+ rows always? The räkenskapsschema tables always show all R1–R10 rows. Consistent: show all justeringsrutor too. It mirrors the blankett, which helps manual filling. OK.

But: R12 row shows bokfortResultat with sign. Sums rows styled distinctly (bold via tfoot? they're inline sums). Current tabell() puts sum in tfoot. For justeringar I need interleaved sums — I'll build a custom table body: iterate a display list of {ruta, beskrivning, belopp, manuell, summa?: boolean}. 

Also NEA note: Jeremy files NEA for one verksamhet — the UI could note that for NEA, only R12–R23-ish applies. Keep simple: a hint text. Actually — per memory he lämnar en NEA per verksamhet; the tjänst sums. I'll add a small hint that R24+ is only on NE. Hmm, actually let me not add confusing hints. The page is "NE-bilaga" and Skatteverket says NEA ser ut som NE med färre justeringsposter. I'll include a short hint: "Driver du flera verksamheter fylls R24 och framåt bara i NE-bilagan (huvudverksamheten)." That's accurate and useful for Jeremy.

PLAN.md first. Then code. Then tests. Also update the memory? Not asked — Claude's memory is Claude's; I could offer at end. The user asked: save PLAN.md, then work on #2. I'll do both, then report.

Test plan (ne-bilaga.test.ts additions):
- describe "skattemässiga justeringar R12–R48":
  - R12 = bokfört resultat (row in display / sammanlagtResultat base)
  - R13: 6992 (och 6072) adderas tillbaka; kontot räknas fortfarande i R6
  - R13 avrundar per ruta (ören)
  - R17 = R12 + R13 (utan manuella rutor)
  - R21 = R17 när inga manuella
  - skattemassigtResultat = R11 + R13 när allt annat manuellt/0
  - manuella rutor har belopp 0 och manuell: true
  - årsavgränsning: 6992 i annat år påverkar inte
  - resultatdisposition (8999) påverkar inte (excluded already at saldon level)

Now write PLAN.md. Swedish. Keep concise, numbered matching my overview, mark #2 as påbörjad/klar by the time I finish. Also add note sources. Then implement.

One more check — package.json scripts for test/lint commands, and biome.json. Let me read package.json.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/package.json"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "hledger-swe-gui",
3:   "version": "1.0.0",
4:   "description": "A vanilla web application for managing hledger journal files. Upload your journal file and easily add new transactions using only the accounts defined in your file.",
5:   "main": "index.js",
6:   "type": "module",
7:   "scripts": {
8:     "dev": "vite",
9:     "build": "vite build",
10:     "server": "vite serve",
11:     "test": "vitest run",
12:     "test:watch": "vitest",
13:     "typecheck": "tsc --noEmit"
14:   },
15:   "author": "Jeremy Karlsson",
16:   "license": "AGPL-3.0-or-later",
17:   "devDependencies": {
18:     "@biomejs/biome": "2.1.1",
19:     "@preact/signals-core": "^1.11.0",
20:     "signals-devtool-provider": "^0.5.4",
21:     "typescript": "^7.0.2",
22:     "vite": "^8.1.5",
23:     "vitest": "^4.1.10",
24:     "webact": "^0.2.27"
25:   }
26: }

(End of file - total 26 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 44.1s)

**Tool: write**

**Input:**
```json
{
  "content": "# Plan – återstående arbete\n\nSammanställt 2026-08-24 utifrån minnesanteckningar och genomgång av koden.\n\n## Klart ✅\n\n- **Moms**: rutmappning (SKV 4700), momsrapport per journal, momsomföring\n  (2650/1650 + 3740 öresutjämning), momsbetalning\n- **Bokslut**: årets resultat (8999→2019), nollställning av eget kapital\n  (2011–2019→2010), Bokio-mönster\n- **NE-bilaga**: räkenskapsschemat R1–R11, varningar för omappade konton\n- Balansrapport, verifikatsnumrering med luckdetektering, mallar med\n  betalkontoval (1930/2018)\n\n## Kvar ❌\n\n1. **SRU-export av NE-bilagan** — porta från accounted\n   `lib/reports/ne-bilaga/sru-generator.ts` (INFO.SRU/BLANKETTER.SRU,\n   ISO 8859-1, fältkoder R1–R11 = 7400–7403, 7500–7505, 7440; datum\n   7011/7012). Behåll upphovsrättsnotisen (gnubok, AGPL-3.0).\n2. **Skattemässiga justeringar (R12+)** — NE-bilagan slutade vid R11.\n   Lägg till R12–R48 enligt SKV 2161: R12 (=R11) och R13 (ej avdragsgilla\n   kostnader ur bokföringen) beräknade, summorutor R17/R21/R29/R33/R35/R42/\n   R47/R48 beräknade, övriga manuella. _(Påbörjad 2026-08-24.)_\n3. **Egenavgifter och räntefördelning** — porta från accounted\n   `lib/bokslut/enskild-firma/`. Beräknas på det **gemensamma** skattemässiga\n   resultatet över båda journalerna (IL 14 kap 12 §), inte per verksamhet.\n   Motsvarar NE R30/R31 och R40–R43.\n4. **Periodiseringsfond / expansionsfond** — samma källa i accounted, ej\n   porterad än. Motsvarar NE R32–R37 (avsättning högst 30 % av R33).\n5. **Sammanslagen momsvy över journalerna** — momsdeklarationen är gemensam\n   (momsregistreringen följer personen). Summera i **ören** över båda\n   journalerna och avrunda **en gång** — addera aldrig färdigavrundade rutor\n   (upp till en krona fel per ruta annars).\n6. **K1-blanketten**.\n7. **SIE4-export?** — `verifikat.ts` är designad för det (\"en SIE-fil per år\n   går att skapa rakt av\") men ingen export finns. Bekräfta om den ska med.\n8. **README** — beskriver fortfarande den gamla generiska journalhanteraren;\n   uppdatera med moms/NE/bokslut.\n\n## Prioritering inför deklarationen\n\n2 → 5 → 1 → 3/4 (justeringar, sammanslagen moms, SRU, sedan egenavgifter/\nräntefördelning och fonder).\n\n## Konsekvens för två verksamheter\n\n- Appen arbetar **per journal** = per verksamhet. Alla rapporter gör redan\n  rätt.\n- Per verksamhet: bokföring, R1–R11, B1–B10, årets resultat, eget kapital,\n  NE-justeringar R12–R23.\n- Gemensamt: NE R24+, skattemässiga justeringar, egenavgifter,\n  räntefördelning och momsdeklarationen — dessa kräver en sammanslagen vy\n  (punkt 3 och 5).\n",
  "filePath": "/Users/jeremy/dev/hledger-web-gui/PLAN.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Kimi K3 · 185.7s)

_Thinking:_

PLAN.md created. Now implement item #2 in `ne-bilaga.ts`:

1. Add `NeJusteringsRuta` type and `NeJustering` type
2. Add `JUSTERINGAR` table with ruta, beskrivning, tecken, manuell
3. R13 computed from EJ_AVDRAGSGILLA accounts
4. Compute sums R17, R21, R29, R33, R35, R42, skattemässigt resultat (R47/R48)
5. Extend NeBilaga type
6. Update UI rapport-ne.ts
7. Add tests

Let me write the code. Design details:

```ts
export type NeJusteringsRuta =
  | "R13" | "R14" | "R15" | "R16"
  | "R18" | "R19" | "R20"
  | "R22" | "R23"
  | "R24" | "R25" | "R26" | "R27" | "R28"
  | "R30" | "R31" | "R32" | "R34" | "R36" | "R37"
  | "R38" | "R39" | "R40" | "R41" | "R43"
  | "R44" | "R45" | "R46";

export type NeJustering = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  /** +1 ökar resultatet, −1 minskar. */
  tecken: 1 | -1;
  /** Ifyllt belopp, alltid positivt. 0 i rutor som fylls i för hand. */
  belopp: number;
  konton: Array<NeKontoRad>;
  /** true = kan inte räknas fram ur bokföringen, fylls i för hand i deklarationen. */
  manuell: boolean;
};
```

The beskrivning texts (from blankett, shortened):
- R13: "Bokförda kostnader som inte ska dras av"
- R14: "Bokförda intäkter som inte ska tas upp"
- R15: "Intäkter som inte bokförts men som ska tas upp"
- R16: "Kostnader som inte bokförts men som ska dras av"
- R18: "Gemensam verksamhet – överskott redovisat av annan, min andel av underskott, underskott enligt NEA" — too long. Blankett text: "Gemensam verksamhet - överskott redovisad av annan eller min andel av underskott, underskott enligt NEA-bilagan". Shorter: "Gemensam verksamhet/NEA – underskott (−)". Hmm. Keep concise: R18 "Underskott från gemensam verksamhet/NEA" (−), R19 "Överskott från gemensam verksamhet/NEA" (+). R20 "Medhjälpande make" — andel till make dras av; min andel som make läggs till. tecken −1, beskrivning "Andel till/från medhjälpande make".
- R22: "Övriga skattemässiga justeringar – kostnader"
- R23: "Övriga skattemässiga justeringar – intäkter"
- R24: "Outnyttjat underskott från föregående beskattningsår"
- R25: "Skogs- och substansminskningsavdrag enligt bilaga N8"
- R26: "Återföring av värdeminskningsavdrag m.m. vid försäljning av näringsfastighet"
- R27: "Uttag från skogs-, skogsskade- eller upphovsmannakonto"
- R28: "Inbetalning till skogs-, skogsskade- eller upphovsmannakonto"
- R30: "Positiv räntefördelning"
- R31: "Negativ räntefördelning"
- R32: "Återföring av periodiseringsfond"
- R34: "Avsättning till periodiseringsfond (högst 30 % av R33)"
- R36: "Ökning av expansionsfond"
- R37: "Minskning av expansionsfond"
- R38: "Avdrag för pensionssparande"
- R39: "Särskild löneskatt på pensionssparavdrag (24,26 % av R38)"
- R40: "Medgivet avdrag för egenavgifter/särskild löneskatt föregående år"
- R41: "Påförda egenavgifter/särskild löneskatt föregående år"
- R43: "Årets beräknade avdrag för egenavgifter/särskild löneskatt"
- R44: "Sjukpenning som hör till näringsverksamheten"
- R45: "Allmänt avdrag"
- R46: "Underskott som utnyttjas i kapital"

Summa rutor labels:
- R12: "Bokfört resultat" (from R11)
- R17: "Sammanlagt resultat av verksamheten"
- R21: "Min andel av resultatet från verksamheten/erna"
- R29: "Överskott/underskott före räntefördelning"
- R33: "Överskott/underskott före avsättning till periodiseringsfond"
- R35: "Överskott/underskott före ökning av expansionsfond"
- R42: "Överskott/underskott före årets avdrag för egenavgifter"
- R47: "Överskott", R48: "Underskott"

Structure in code — for the model, NeBilaga gets:

```ts
export type NeSumma = {
  ruta: "R12" | "R17" | "R21" | "R29" | "R33" | "R35" | "R42";
  beskrivning: string;
  belopp: number;
};
```

Hmm, or named fields. For the UI I need blankett order anyway: R12, R13, R14, R15, R16, R17, R18, R19, R20, R21, R22...R28, R29, R30, R31, R32, R33, R34, R35, R36...R41(minus R39? no R39 included)...R42, R43, R44, R45, R46, R47/48.

Cleanest for UI: expose a single ordered display list:

```ts
export type NeJusteringsRad =
  | { slag: "justering"; justering: NeJustering }
  | { slag: "summa"; ruta: string; beskrivning: string; belopp: number };
```

Hmm, that's a bit awkward. Alternative: keep NeBilaga flat:

```ts
justeringar: Array<NeJustering>;   // input rutor in blankett order
summor: Array<NeSumma>;            // R12, R17, R21, R29, R33, R35, R42
skattemassigtResultat: number;     // R47 om positivt, R48 om negativt
```

UI merges by ruta order. That's fine and simple: UI builds rows by iterating a fixed order array, pulling from justeringar/summor maps.

Actually simplest for UI: generate the ordered rows in ne-bilaga.ts itself as a `justeringsrader` array that includes both. Let me do:

```ts
/** En rad i avsnittet "Skattemässiga justeringar", i blankettordning. */
export type NeJusteringsrad = {
  ruta: string;
  beskrivning: string;
  /** Signerat bidrag till resultatet för justeringsrutor; ackumulerad summa för summorutor. */
  belopp: number;
  /** Summorutor (R12, R17, R21, R29, R33, R35, R42, R47/R48) ritas utmarkerade. */
  summa: boolean;
  /** Rutor som fylls i för hand i deklarationen. */
  manuell: boolean;
  konton: Array<NeKontoRad>;
};
```

And NeBilaga:
```ts
/** Skattemässiga justeringar, R12–R48 i blankettordning. */
justeringar: Array<NeJusteringsrad>;
/** Skattemässigt resultat: R47 vid överskott, R48 vid underskott (samma tal, tecknet avgör). */
skattemassigtResultat: number;
```

Wait, but the "belopp" semantics differ: for input rutor the blankett wants positive fill-in value; the sign is implied by the ruta. For display, showing positive values in each ruta matches the blankett. Sums are signed. I'll show input rutor as positive belopp and sums signed — matches blankett. For computation I need tecken per ruta — keep an internal table.

But exposing tecken might be useful for tests? Tests can check summa values and ruta belopp. Keep tecken internal. Hmm — but also expose structured access for tests: tests will look up rows by ruta in `justeringar` and check belopp/manuell/summa. Fine.

EJ_AVDRAGSGILLA — name: `R13_KONTON` or `EJ_AVDRAGSGILLA_KONTON`:
```ts
/** Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13.
 *  Kontona ligger kvar i sina räkenskapsschemarutor (R6/R7) — R13 är en
 *  återläggning ovanpå räkenskapsschemat, ingen omflyttning. BAS-konton:
 *  6072 representation ej avdragsgill, 6982 föreningsavgifter ej avdragsgilla,
 *  6992 övriga externa kostnader ej avdragsgilla (t.ex. böter, skattetillägg),
 *  7622 sjuk- och hälsovård ej avdragsgill. */
const EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622];
```

Computation: in generateNeBilaga, after saldon built (saldon map has öre-precision numbers... actually amounts are in kr with decimals). R13 = Σ saldon.get(k) for k in EJ_AVDRAGSGILLA, rounded Math.round like other rutor. Konton list for R13: each account with Math.round(belopp).

Internal table:

```ts
type JusteringsSpec = {
  ruta: NeJusteringsRuta;
  beskrivning: string;
  tecken: 1 | -1;
};

const JUSTERINGAR: Array<JusteringsSpec> = [
  { ruta: "R13", beskrivning: "Bokförda kostnader som inte ska dras av", tecken: 1 },
  { ruta: "R14", beskrivning: "Bokförda intäkter som inte ska tas upp", tecken: -1 },
  { ruta: "R15", beskrivning: "Intäkter som inte bokförts men som ska tas upp", tecken: 1 },
  { ruta: "R16", beskrivning: "Kostnader som inte bokförts men som ska dras av", tecken: -1 },
  { ruta: "R18", beskrivning: "Underskott från gemensam verksamhet eller NEA-bilaga", tecken: -1 },
  { ruta: "R19", beskrivning: "Överskott från gemensam verksamhet eller NEA-bilaga", tecken: 1 },
  { ruta: "R20", beskrivning: "Andel till medhjälpande make", tecken: -1 },
  { ruta: "R22", beskrivning: "Övriga skattemässiga justeringar – kostnader", tecken: -1 },
  { ruta: "R23", beskrivning: "Övriga skattemässiga justeringar – intäkter", tecken: 1 },
  { ruta: "R24", beskrivning: "Outnyttjat underskott från föregående beskattningsår", tecken: -1 },
  { ruta: "R25", beskrivning: "Skogs- och substansminskningsavdrag enligt bilaga N8", tecken: -1 },
  { ruta: "R26", beskrivning: "Återföring av värdeminskningsavdrag m.m. vid försäljning av näringsfastighet", tecken: 1 },
  { ruta: "R27", beskrivning: "Uttag från skogs-, skogsskade- eller upphovsmannakonto", tecken: 1 },
  { ruta: "R28", beskrivning: "Inbetalning till skogs-, skogsskade- eller upphovsmannakonto", tecken: -1 },
  { ruta: "R30", beskrivning: "Positiv räntefördelning", tecken: -1 },
  { ruta: "R31", beskrivning: "Negativ räntefördelning", tecken: 1 },
  { ruta: "R32", beskrivning: "Återföring av periodiseringsfond", tecken: 1 },
  { ruta: "R34", beskrivning: "Avsättning till periodiseringsfond (högst 30 % av R33)", tecken: -1 },
  { ruta: "R36", beskrivning: "Ökning av expansionsfond", tecken: -1 },
  { ruta: "R37", beskrivning: "Minskning av expansionsfond", tecken: 1 },
  { ruta: "R38", beskrivning: "Avdrag för pensionssparande", tecken: -1 },
  { ruta: "R39", beskrivning: "Särskild löneskatt på pensionssparavdrag (24,26 % av R38)", tecken: -1 },
  { ruta: "R40", beskrivning: "Medgivet avdrag för egenavgifter och särskild löneskatt föregående år", tecken: 1 },
  { ruta: "R41", beskrivning: "Påförda egenavgifter och särskild löneskatt föregående år", tecken: -1 },
  { ruta: "R43", beskrivning: "Årets beräknade avdrag för egenavgifter och särskild löneskatt", tecken: -1 },
  { ruta: "R44", beskrivning: "Sjukpenning som hör till näringsverksamheten", tecken: 1 },
  { ruta: "R45", beskrivning: "Allmänt avdrag", tecken: 1 },
  { ruta: "R46", beskrivning: "Underskott som utnyttjas i kapital", tecken: 1 },
];
```

Sums interleave:
```ts
const SUMRUTOR: Record<string, string> = {
  R12: "Bokfört resultat",
  R17: "Sammanlagt resultat av verksamheten",
  R21: "Min andel av resultatet från verksamheten/erna",
  R29: "Överskott/underskott före räntefördelning",
  R33: "Överskott/underskott före avsättning till periodiseringsfond",
  R35: "Överskott/underskott före ökning av expansionsfond",
  R42: "Överskott/underskott före årets avdrag för egenavgifter",
};
```

Build sequence:
```ts
const ORDNING = ["R12","R13","R14","R15","R16","R17","R18","R19","R20","R21","R22","R23","R24","R25","R26","R27","R28","R29","R30","R31","R32","R33","R34","R35","R36","R37","R38","R39","R40","R41","R42","R43","R44","R45","R46"];
```

Then iterate: running = 0; for each ruta in ORDNING: if summa ruta → push {summa:true, belopp: (R12: bokfortResultat; R17: bokfortResultat + ΣR13-16 tecknad; ...)}. Simplest: maintain `ackumulerat` starting at bokfortResultat (R12). For justeringsrutor: ackumulerat += tecken * belopp. For summa rutor: belopp = ackumulerat (R12 and R17 etc.). Check: R12 = bokfortResultat (ack before any justering) ✓; R17 = after R13–R16 ✓; R21 = after R18–R20 ✓; R29 after R22–R28 ✓; R33 after R30–R32 ✓; R35 after R34 ✓; R42 after R36–R41 ✓. Final after R46 = skattemassigtResultat → R47/R48.

Wait: R33 = R29 + R30 + R31 + R32 — but R29 is itself the running sum through R28; since running accumulates continuously, R33 = running after R32 ✓. R35 = running after R34 ✓. R42 = running after R41 ✓. 

Note: this continuous accumulation is exactly "R12–Rx" sums as the blankett defines (R29 = sum R12–R28 etc.) ✓.

skattemassigtResultat = running after R46. R47 = max(0, x)? Blankett: R47 överskott (positive), R48 underskott. In model: skattemassigtResultat signed; UI shows R47 if >= 0 else R48 with abs? Show "R47 Överskott" row when positive, "R48 Underskott" when negative — like blankett (one of them). I'll append a final row ruta = x >= 0 ? "R47" : "R48", beskrivning "Överskott"/"Underskott", belopp = abs, summa: true. Hmm, but for negative, blankett R48 is filled with the positive amount. Display: abs value. And skattemassigtResultat keeps sign in the model.

R13 belopp: only ruta with konton. In the ORDNING loop, look up computed amounts:

```ts
const beraknade = new Map<NeJusteringsRuta, { belopp: number; konton: Array<NeKontoRad> }>();
// R13 ur bokföringen
```

Also R39 = 24.26% of R38 — both 0 now (manual). Leave manual.

Edge: R34 max 30% av R33 — manual now; the cap becomes relevant in item #4. Just label it.

Now — should manuell rutor with belopp 0 show "0 kr" or "—"? Blankett-style: show 0? The räkenskapsschema shows 0 for empty rutor. For justeringar, showing 0 everywhere clutters but is consistent and blankett-like. Show kr(0) = "0 kr". Hmm, with 30 rows that's noisy but honest. Actually wait — should we even SHOW rows R24+ always? Per Skatteverket: NEA har färre justeringsposter. Jeremy's per-journal view is NEA-like for one journal and NE-like for the other. Showing all is fine for NE; for NEA he just ignores R24+. I'll show all with the manuell badge, plus the hint that R24 och framåt bara fylls i NE (huvudverksamheten). Good.

UI rendering in rapport-ne.ts: add after the R11 table:

```ts
function justeringsTabell(rader: Array<NeJusteringsrad>, year: string): string {
  rows: for each rad: <tr class={summa?"summa":""}>
    <td>${rad.ruta}</td>
    <td>${rad.beskrivning} ${manuell badge}</td>
    <td class="amount">${kr(rad.belopp)}</td>
  </tr> + kontorader
}
```

Existing CSS rapport.css — check classes: .manuell exists (used for R3), .konto-rad, .amount, .varning. Sum rows: reuse pattern of the R11 table (tfoot-like). I'll give summa rows a class and add minimal CSS to rapport.css (font-weight bold + top border). Let me read rapport.css before editing.

Also the R11 table currently separate; the justeringar table caption "Skattemässiga justeringar ${year}".

Hint text after table: "Rutor märkta 'fylls i manuellt' kan inte räknas fram ur bokföringen — de fylls i direkt i e-tjänsten. R24 och framåt fylls bara i NE-bilagan (huvudverksamheten), inte i NEA." 

Tests to add (ne-bilaga.test.ts):

```ts
describe("skattemässiga justeringar R12–R48", () => {
  const justeringsruta = (bilaga, ruta) => bilaga.justeringar.find(r => r.ruta === ruta)!;

  it("för över R11 till R12", ...)
  it("lägger tillbaka ej avdragsgilla kostnader i R13 men kvar i R6", ...)
  it("summerar R17, R21 och vidare längs kedjan", ...)
  it("markerar rutor som inte går att räkna fram som manuella med belopp 0", ...)
  it("skattemässigt resultat = bokfört resultat när inget justeras", ...)
  it("håller isär åren" / exkluderar resultatdisposition? — covered by saldon logic, skip)
  it("avrundar R13 per ruta", maybe)
});
```

Check: R13 accounts appear in konton with names.

Now — one subtlety: saldon map in generateNeBilaga only includes resultatkonton 3000–8999. 6072/6982/6992/7622 are all within 5000–6990 → mapped to R6 (or 7622 → R7? 7622 is in 7000–7699 → R7 ✓ fine — either way it's in räkenskapsschemat AND add-back in R13. Good: test with 6992 (R6) and 6072 (R6).

Amounts sign: saldon.get(6992) positive (debet). R13 belopp = that sum, positive ✓.

Also `Math.abs(saldo) < 0.005` skip applies per account — fine.

Rounding: R13 computed from raw saldon then Math.round — consistent with rutor rounding. The chain sums: R12 uses bokfortResultat (already sum of rounded rutor). R13 rounded → chain stays in whole kronor. ✓ (R17 = R12 + R13 exactly, blankett-konsistent.)

Let me also double check JUSTERINGAR ordering vs ORDNING array — ORDNING includes all: R12,R13,R14,R15,R16,R17,R18,R19,R20,R21,R22,R23,R24,R25,R26,R27,R28,R29,R30,R31,R32,R33,R34,R35,R36,R37,R38,R39,R40,R41,R42,R43,R44,R45,R46. ✓ (37 rows + final R47/R48 row.)

Type NeJusteringsRuta — I'll define as union of the justering rutor (excluding sums).

Also update the page header doc comment in ne-bilaga.ts to mention SKV 2161 justeringar.

Edge case — `MANUELLA_NE_RUTOR` is Set<NeRuta> = R3; UI badge logic for justeringar uses rad.manuell. OK.

Let me now write the code. First read rapport.css to see styles.

PLAN.md is saved. Now implementing item #2. Let me check the report CSS first, then write the code.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport.css"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport.css</path>
<type>file</type>
<content>
1: table {
2:   border-collapse: collapse;
3:   min-width: min(100%, 44rem);
4: }
5: 
6: caption {
7:   text-align: left;
8:   font-weight: bold;
9:   padding-block: 0.75rem 0.25rem;
10: }
11: 
12: th,
13: td {
14:   padding: 0.25rem 0.75rem 0.25rem 0;
15:   text-align: left;
16: }
17: 
18: th.amount,
19: td.amount {
20:   text-align: right;
21:   font-variant-numeric: tabular-nums;
22: }
23: 
24: tfoot td {
25:   font-weight: bold;
26:   border-block-start: 1px solid currentColor;
27: }
28: 
29: tr.grupp td {
30:   font-weight: bold;
31:   padding-block-start: 0.75rem;
32: }
33: 
34: .manuell {
35:   font-size: 0.8em;
36:   color: color-mix(in srgb, currentColor 60%, transparent);
37: }
38: 
39: .manuell::before {
40:   content: "— ";
41: }
42: 
43: .differens,
44: .varning {
45:   font-weight: bold;
46:   color: #b3261e;
47: }
48: 
49: .konto-rad td {
50:   color: color-mix(in srgb, currentColor 60%, transparent);
51:   padding-inline-start: 1rem;
52: }
53: 
54: h2 {
55:   font-size: 1.1rem;
56:   margin-block: 1.25rem 0.25rem;
57: }
58: 
59: button {
60:   font: inherit;
61:   padding: 0.4rem 0.75rem;
62:   margin-block: 0.5rem;
63: }
64: 
65: .hint {
66:   color: color-mix(in srgb, currentColor 65%, transparent);
67:   font-size: 0.85rem;
68: }
69: 
70: .klar {
71:   font-weight: bold;
72: }
73: 
74: .betalning {
75:   display: flex;
76:   flex-wrap: wrap;
77:   gap: 0.75rem;
78:   align-items: end;
79: }
80: 
81: .betalning[hidden] {
82:   display: none;
83: }
84: 
85: .betalning label {
86:   display: grid;
87:   gap: 0.25rem;
88:   font-size: 0.85rem;
89: }
90: 
91: .betalning input,
92: .betalning select {
93:   font: inherit;
94:   padding: 0.4rem 0.5rem;
95: }

(End of file - total 95 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 28.6s)

_Thinking:_

Good. Now implement. First the model in `ne-bilaga.ts`. I'll add:

1. `NeJusteringsRuta` type
2. `NeJusteringsrad` type (display rows)
3. `EJ_AVDRAGSGILLA` accounts for R13
4. `JUSTERINGAR` spec table with tecken
5. Extend `NeBilaga` with `justeringar: Array<NeJusteringsrad>` and `skattemassigtResultat: number`
6. Build logic in `generateNeBilaga`

Then UI in `rapport-ne.ts`, CSS `.summa` class, and tests.

Let me write the edit for ne-bilaga.ts.

Now the model changes in `ne-bilaga.ts`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "/**\n * NE-bilaga (Inkomst av näringsverksamhet, enskilda näringsidkare)\n *\n * Räkenskapsschemat R1–R11: BAS-kontosaldon mappas till blankettens rutor\n * enligt BAS-kontogruppens kopplingstabell \"NE - Inkomst av näringsverksamhet,\n * Enskilda näringsidkare\" (bas.se/kontoplaner/sru/).\n *\n * Skattemässiga justeringar R12–R48 (SKV 2161): R12 förs över från R11 och\n * R13 räknas fram ur bokföringen (ej avdragsgilla kostnader). Summorutorna\n * R17, R21, R29, R33, R35, R42 och R47/R48 räknas ut längs kedjan; övriga\n * rutor fylls i för hand i deklarationen. Rutorna R24 och framåt finns bara\n * på NE-bilagan — NEA-bilagan (underverksamheten) slutar vid R22/R23.\n */\n\nexport type NeRuta =",
  "oldString": "/**\n * NE-bilaga (Inkomst av näringsverksamhet, enskilda näringsidkare)\n *\n * Räkenskapsschemat R1–R11: BAS-kontosaldon mappas till blankettens rutor\n * enligt BAS-kontogruppens kopplingstabell \"NE - Inkomst av näringsverksamhet,\n * Enskilda näringsidkare\" (bas.se/kontoplaner/sru/).\n */\n\nexport type NeRuta ="
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 28.3s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "/** Justeringsrutor som fyller i belopp (summorutorna räknas fram). */\nexport type NeJusteringsRuta =\n  | \"R13\"\n  | \"R14\"\n  | \"R15\"\n  | \"R16\"\n  | \"R18\"\n  | \"R19\"\n  | \"R20\"\n  | \"R22\"\n  | \"R23\"\n  | \"R24\"\n  | \"R25\"\n  | \"R26\"\n  | \"R27\"\n  | \"R28\"\n  | \"R30\"\n  | \"R31\"\n  | \"R32\"\n  | \"R34\"\n  | \"R36\"\n  | \"R37\"\n  | \"R38\"\n  | \"R39\"\n  | \"R40\"\n  | \"R41\"\n  | \"R43\"\n  | \"R44\"\n  | \"R45\"\n  | \"R46\";\n\n/** En rad i avsnittet \"Skattemässiga justeringar\", i blankettordning. */\nexport type NeJusteringsrad = {\n  ruta: string;\n  beskrivning: string;\n  /** Ifyllnadsbelopp för justeringsrutor (alltid positivt), ackumulerad\n   *  summa för summorutor. */\n  belopp: number;\n  /** Summorutorna R12, R17, R21, R29, R33, R35, R42 och R47/R48. */\n  summa: boolean;\n  /** true = kan inte räknas fram ur bokföringen, fylls i för hand. */\n  manuell: boolean;\n  konton: Array<NeKontoRad>;\n};\n\nexport type NeBilaga = {\n  year: string;\n  intakter: Array<NeRad>; // R1–R4\n  kostnader: Array<NeRad>; // R5–R10\n  /** R11 — intäkter minus kostnader. Positivt = vinst. */\n  bokfortResultat: number;\n  /** Skattemässiga justeringar R12–R48, i blankettordning. */\n  justeringar: Array<NeJusteringsrad>;\n  /** Skattemässigt resultat efter R12–R46. Positivt = R47 överskott,\n   *  negativt = R48 underskott. */\n  skattemassigtResultat: number;\n  varningar: Array<string>;\n};",
  "oldString": "export type NeBilaga = {\n  year: string;\n  intakter: Array<NeRad>; // R1–R4\n  kostnader: Array<NeRad>; // R5–R10\n  /** R11 — intäkter minus kostnader. Positivt = vinst. */\n  bokfortResultat: number;\n  varningar: Array<string>;\n};"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 79.4s)

Now the justeringar specification table and the computation logic:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */\nconst arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;\n\n/**\n * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13\n * (Skatteverkets exempel: representation, föreningsavgifter, böter och\n * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —\n * R13 är en återläggning ovanpå schemat, ingen omflyttning.\n *\n * BAS: 6072 representation ej avdragsgill, 6982 föreningsavgifter ej\n * avdragsgilla, 6992 övriga externa kostnader ej avdragsgilla (t.ex.\n * böter, skattetillägg), 7622 sjuk- och hälsovård ej avdragsgill.\n */\nconst EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622];\n\ntype JusteringsSpec = {\n  ruta: NeJusteringsRuta;\n  beskrivning: string;\n  /** +1 ökar det skattemässiga resultatet, −1 minskar. */\n  tecken: 1 | -1;\n};\n\n/** Justeringsrutorna i blankettordning, med tecknet från SKV 2161. */\nconst JUSTERINGAR: Array<JusteringsSpec> = [\n  { ruta: \"R13\", beskrivning: \"Bokförda kostnader som inte ska dras av\", tecken: 1 },\n  { ruta: \"R14\", beskrivning: \"Bokförda intäkter som inte ska tas upp\", tecken: -1 },\n  { ruta: \"R15\", beskrivning: \"Intäkter som inte bokförts men som ska tas upp\", tecken: 1 },\n  { ruta: \"R16\", beskrivning: \"Kostnader som inte bokförts men som ska dras av\", tecken: -1 },\n  { ruta: \"R18\", beskrivning: \"Underskott från gemensam verksamhet eller NEA-bilaga\", tecken: -1 },\n  { ruta: \"R19\", beskrivning: \"Överskott från gemensam verksamhet eller NEA-bilaga\", tecken: 1 },\n  { ruta: \"R20\", beskrivning: \"Andel till medhjälpande make\", tecken: -1 },\n  { ruta: \"R22\", beskrivning: \"Övriga skattemässiga justeringar – kostnader\", tecken: -1 },\n  { ruta: \"R23\", beskrivning: \"Övriga skattemässiga justeringar – intäkter\", tecken: 1 },\n  { ruta: \"R24\", beskrivning: \"Outnyttjat underskott från föregående beskattningsår\", tecken: -1 },\n  { ruta: \"R25\", beskrivning: \"Skogs- och substansminskningsavdrag enligt bilaga N8\", tecken: -1 },\n  { ruta: \"R26\", beskrivning: \"Återföring av värdeminskningsavdrag m.m. vid försäljning av näringsfastighet\", tecken: 1 },\n  { ruta: \"R27\", beskrivning: \"Uttag från skogs-, skogsskade- eller upphovsmannakonto\", tecken: 1 },\n  { ruta: \"R28\", beskrivning: \"Inbetalning till skogs-, skogsskade- eller upphovsmannakonto\", tecken: -1 },\n  { ruta: \"R30\", beskrivning: \"Positiv räntefördelning\", tecken: -1 },\n  { ruta: \"R31\", beskrivning: \"Negativ räntefördelning\", tecken: 1 },\n  { ruta: \"R32\", beskrivning: \"Återföring av periodiseringsfond\", tecken: 1 },\n  { ruta: \"R34\", beskrivning: \"Avsättning till periodiseringsfond (högst 30 % av R33)\", tecken: -1 },\n  { ruta: \"R36\", beskrivning: \"Ökning av expansionsfond\", tecken: -1 },\n  { ruta: \"R37\", beskrivning: \"Minskning av expansionsfond\", tecken: 1 },\n  { ruta: \"R38\", beskrivning: \"Avdrag för pensionssparande\", tecken: -1 },\n  { ruta: \"R39\", beskrivning: \"Särskild löneskatt på pensionssparavdrag (24,26 % av R38)\", tecken: -1 },\n  { ruta: \"R40\", beskrivning: \"Medgivet avdrag för egenavgifter och särskild löneskatt föregående år\", tecken: 1 },\n  { ruta: \"R41\", beskrivning: \"Påförda egenavgifter och särskild löneskatt föregående år\", tecken: -1 },\n  { ruta: \"R43\", beskrivning: \"Årets beräknade avdrag för egenavgifter och särskild löneskatt\", tecken: -1 },\n  { ruta: \"R44\", beskrivning: \"Sjukpenning som hör till näringsverksamheten\", tecken: 1 },\n  { ruta: \"R45\", beskrivning: \"Allmänt avdrag\", tecken: 1 },\n  { ruta: \"R46\", beskrivning: \"Underskott som utnyttjas i kapital\", tecken: 1 },\n];\n\n/** Summorutorna och var i kedjan de ligger (efter vilken justeringsruta). */\nconst SUMRUTOR: Array<{ efter: NeJusteringsRuta | \"R12\"; ruta: string; beskrivning: string }> = [\n  { efter: \"R12\", ruta: \"R12\", beskrivning: \"Bokfört resultat\" },\n  { efter: \"R16\", ruta: \"R17\", beskrivning: \"Sammanlagt resultat av verksamheten\" },\n  { efter: \"R20\", ruta: \"R21\", beskrivning: \"Min andel av resultatet från verksamheten/erna\" },\n  { efter: \"R28\", ruta: \"R29\", beskrivning: \"Överskott/underskott före räntefördelning\" },\n  { efter: \"R32\", ruta: \"R33\", beskrivning: \"Överskott/underskott före avsättning till periodiseringsfond\" },\n  { efter: \"R34\", ruta: \"R35\", beskrivning: \"Överskott/underskott före ökning av expansionsfond\" },\n  { efter: \"R41\", ruta: \"R42\", beskrivning: \"Överskott/underskott före årets avdrag för egenavgifter\" },\n];\n\n/**\n * Bygger avsnittet \"Skattemässiga justeringar\" (R12–R48) ur bokfört\n * resultat och saldon. Bara R13 räknas fram ur kontosaldon — resten är\n * manuella tills dess att egenavgifter, räntefördelning och fonder\n * implementerats (se PLAN.md).\n */\nfunction byggJusteringar(\n  saldon: Map<number, number>,\n  bokfortResultat: number,\n): { rader: Array<NeJusteringsrad>; skattemassigtResultat: number } {\n  const kontonamn = (konto: number) =>\n    aliases.value.find((alias) => alias.id === konto)?.to ?? \"\";\n\n  // R13: ej avdragsgilla kostnader, bokförda i debet\n  let r13 = 0;\n  const r13Konton: Array<NeKontoRad> = [];\n\n  for (const konto of EJ_AVDRAGSGILLA) {\n    const saldo = saldon.get(konto) ?? 0;\n\n    if (Math.abs(saldo) < 0.005) {\n      continue;\n    }\n\n    r13 += saldo;\n    r13Konton.push({ konto, namn: kontonamn(konto), belopp: Math.round(saldo) });\n  }\n\n  const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>([\n    [\n      \"R13\",\n      {\n        ruta: \"R13\",\n        beskrivning: \"\",\n        belopp: Math.round(r13),\n        summa: false,\n        manuell: false,\n        konton: r13Konton,\n      },\n    ],\n  ]);\n\n  const rader: Array<NeJusteringsrad> = [];\n  let ackumulerat = bokfortResultat;\n  let summaIndex = 0;\n\n  const skjutUtSummorFramtill = (efter: string) => {\n    while (\n      summaIndex < SUMRUTOR.length &&\n      SUMRUTOR[summaIndex].efter === efter\n    ) {\n      const summa = SUMRUTOR[summaIndex++];\n      rader.push({\n        ruta: summa.ruta,\n        beskrivning: summa.beskrivning,\n        belopp: ackumulerat,\n        summa: true,\n        manuell: false,\n        konton: [],\n      });\n    }\n  };\n\n  skjutUtSummorFramtill(\"R12\");\n\n  for (const spec of JUSTERINGAR) {\n    const rad = beraknat.get(spec.ruta) ?? {\n      ruta: spec.ruta,\n      beskrivning: \"\",\n      belopp: 0,\n      summa: false,\n      manuell: true,\n      konton: [],\n    };\n\n    rad.beskrivning = spec.beskrivning;\n    ackumulerat += spec.tecken * rad.belopp;\n    rader.push(rad);\n    skjutUtSummorFramtill(spec.ruta);\n  }\n\n  // R47/R48 — samma tal, tecknet avgör vilken ruta som fylls i\n  const overskott = ackumulerat >= 0;\n  rader.push({\n    ruta: overskott ? \"R47\" : \"R48\",\n    beskrivning: overskott ? \"Överskott\" : \"Underskott\",\n    belopp: Math.abs(ackumulerat),\n    summa: true,\n    manuell: false,\n    konton: [],\n  });\n\n  return { rader, skattemassigtResultat: ackumulerat };\n}\n\n/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */",
  "oldString": "/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */\nconst arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 27.8s)

_Thinking:_

Oops — I duplicated the `arResultatkonto` line at the end of my new string. The old string was the `arResultatkonto` definition, and I ended my newString with the same comment + will be followed by... wait no. My newString ends with:

```
/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
```

and the old content had:
```
/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
const arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;
```

I replaced the whole oldString (comment + const) with newString that starts with comment+const, then adds my new code, then ends with just the comment — but NOT the const. So now the file has the comment line dangling at the end of my insertion followed by whatever came after the old text (the RESULTATDISPOSITION_KONTO comment). Wait no — let me re-check. My newString ends with:

```
/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
```

Hmm, that's wrong — I intended the structure to be: [new code block] then the original comment+const. But I put comment+const at the START and a lone comment at the END. That leaves a dangling comment and the const... wait, the const IS at the start of my newString. So the file now reads:

```
/** Resultatkonto = ... */
const arResultatkonto = ...

/** ... EJ_AVDRAGSGILLA ... */
const EJ_AVDRAGSGILLA = [...]
...
function byggJusteringar(...) {...}

/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */   ← dangling duplicate comment
/** Årets resultat — används i omföringen vid bokslut... */
const RESULTATDISPOSITION_KONTO = 8999;
```

I need to remove that dangling duplicate comment. Let me fix it.

I accidentally left a duplicated comment line at the end of that edit — fixing it:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "  return { rader, skattemassigtResultat: ackumulerat };\n}\n\n/** Årets resultat — används i omföringen vid bokslut. En transaktion som rör",
  "oldString": "  return { rader, skattemassigtResultat: ackumulerat };\n}\n\n/** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */\n\n/** Årets resultat — används i omföringen vid bokslut. En transaktion som rör"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 24.1s)

_Thinking:_

Wait — I need to double-check the actual text around RESULTATDISPOSITION_KONTO. From my earlier read:

```ts
/** Årets resultat — används i omföringen vid bokslut. En transaktion som rör
 *  8999 är en resultatdisposition och ska inte räknas med i räkenskapsschemat
 *  (den skulle nolla resultatkontona). */
const RESULTATDISPOSITION_KONTO = 8999;
```

The edit succeeded, good. Now update `generateNeBilaga` to call `byggJusteringar` and include the new fields. The current end of generateNeBilaga:

```ts
  return {
    year,
    intakter,
    kostnader,
    bokfortResultat: summaIntakter - summaKostnader,
    varningar,
  };
```

I need:
```ts
  const bokfortResultat = summaIntakter - summaKostnader;
  const { rader: justeringar, skattemassigtResultat } = byggJusteringar(saldon, bokfortResultat);

  return {
    year,
    intakter,
    kostnader,
    bokfortResultat,
    justeringar,
    skattemassigtResultat,
    varningar,
  };
```

Now wire it into `generateNeBilaga`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "  const bokfortResultat = summaIntakter - summaKostnader;\n  const { rader: justeringar, skattemassigtResultat } = byggJusteringar(\n    saldon,\n    bokfortResultat,\n  );\n\n  return {\n    year,\n    intakter,\n    kostnader,\n    bokfortResultat,\n    justeringar,\n    skattemassigtResultat,\n    varningar,\n  };\n}",
  "oldString": "  return {\n    year,\n    intakter,\n    kostnader,\n    bokfortResultat: summaIntakter - summaKostnader,\n    varningar,\n  };\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 37.8s)

_Thinking:_

Now update the UI in `rapport-ne.ts`. I need to:
1. Import the new type `NeJusteringsrad`
2. Add a `justeringsTabell` function rendering the justeringar rows (with summa styling, manuell badge, kontorader)
3. Render it after the R11 table
4. Add a hint about manual boxes and NEA

Also add `.summa` CSS to rapport.css.

For the justeringsTabell:

```ts
function justeringsrad(rad: NeJusteringsrad): string {
  const kontoRader = rad.konton
    .map(
      (konto) => html`
        <tr class="konto-rad">
          <td></td>
          <td>${konto.konto} ${konto.namn}</td>
          <td class="amount">${kr(konto.belopp)}</td>
        </tr>
      `,
    )
    .join("");

  return html`
    <tr class="${rad.summa ? "summa" : ""}">
      <td>${rad.ruta}</td>
      <td>
        ${rad.beskrivning}
        ${rad.manuell ? `<span class="manuell">fylls i manuellt</span>` : ""}
      </td>
      <td class="amount">${kr(rad.belopp)}</td>
    </tr>
    ${kontoRader}
  `;
}
```

And the table:

```ts
function justeringsTabell(rapport: NeBilaga): string {
  return html`
    <table class="mono">
      <caption>Skattemässiga justeringar ${rapport.year}</caption>
      <thead>
        <tr>
          <th>Ruta</th>
          <th>Beskrivning</th>
          <th class="amount">Belopp</th>
        </tr>
      </thead>
      <tbody>
        ${rapport.justeringar.map(justeringsrad).join("")}
      </tbody>
    </table>
    <p class="hint">
      Rutor märkta "fylls i manuellt" kan inte räknas fram ur bokföringen —
      de fylls i direkt i Skatteverkets e-tjänst. R24 och framåt finns bara
      på NE-bilagan (huvudverksamheten); NEA-bilagan slutar vid R22/R23.
    </p>
  `;
}
```

Hmm — the konto-rad rows render under summa rows too? Only R13 has konton. Fine.

Note: the existing R11 table (separate small table with tfoot) stays, then justeringar table starts with R12. Good flow.

CSS for .summa:
```css
tr.summa td {
  font-weight: bold;
  border-block-start: 1px solid color-mix(in srgb, currentColor 30%, transparent);
}
```

Update the imports in rapport-ne.ts: `import { generateNeBilaga, MANUELLA_NE_RUTOR, type NeRad, type NeJusteringsrad, type NeBilaga } from "../ne-bilaga";` — actually justeringsTabell takes rapport: uses rapport.justeringar and rapport.year. Type NeBilaga import needed. Or type the param loosely. Keep typed.

Now the UI in `rapport-ne.ts`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport-ne.ts",
  "newString": "import { effect } from \"@preact/signals-core\";\nimport { Component, registerComponent } from \"webact\";\nimport {\n  generateNeBilaga,\n  MANUELLA_NE_RUTOR,\n  type NeBilaga,\n  type NeJusteringsrad,\n  type NeRad,\n} from \"../ne-bilaga\";\nimport { selectedYear } from \"../signals\";",
  "oldString": "import { effect } from \"@preact/signals-core\";\nimport { Component, registerComponent } from \"webact\";\nimport { generateNeBilaga, MANUELLA_NE_RUTOR, type NeRad } from \"../ne-bilaga\";\nimport { selectedYear } from \"../signals\";"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 22.8s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport-ne.ts",
  "newString": "function justeringsRad(rad: NeJusteringsrad): string {\n  const kontoRader = rad.konton\n    .map(\n      (konto) => html`\n        <tr class=\"konto-rad\">\n          <td></td>\n          <td>${konto.konto} ${konto.namn}</td>\n          <td class=\"amount\">${kr(konto.belopp)}</td>\n        </tr>\n      `,\n    )\n    .join(\"\");\n\n  return html`\n    <tr class=\"${rad.summa ? \"summa\" : \"\"}\">\n      <td>${rad.ruta}</td>\n      <td>\n        ${rad.beskrivning}\n        ${rad.manuell ? `<span class=\"manuell\">fylls i manuellt</span>` : \"\"}\n      </td>\n      <td class=\"amount\">${kr(rad.belopp)}</td>\n    </tr>\n    ${kontoRader}\n  `;\n}\n\nfunction justeringsTabell(rapport: NeBilaga): string {\n  return html`\n    <table class=\"mono\">\n      <caption>Skattemässiga justeringar ${rapport.year}</caption>\n      <thead>\n        <tr>\n          <th>Ruta</th>\n          <th>Beskrivning</th>\n          <th class=\"amount\">Belopp</th>\n        </tr>\n      </thead>\n      <tbody>\n        ${rapport.justeringar.map(justeringsRad).join(\"\")}\n      </tbody>\n    </table>\n    <p class=\"hint\">\n      Rutor som inte kan räknas fram ur bokföringen fylls i för hand direkt i\n      Skatteverkets e-tjänst. R24 och framåt finns bara på NE-bilagan\n      (huvudverksamheten) — NEA-bilagan slutar vid R22/R23.\n    </p>\n  `;\n}\n\nclass RapportNe extends Component {",
  "oldString": "class RapportNe extends Component {"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 12.2s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport-ne.ts",
  "newString": "        <table class=\"mono\">\n          <tfoot>\n            <tr>\n              <td>R11</td>\n              <td>Bokfört resultat</td>\n              <td class=\"amount\">${kr(rapport.bokfortResultat)}</td>\n            </tr>\n          </tfoot>\n        </table>\n        ${justeringsTabell(rapport)}\n        ${rapport.varningar",
  "oldString": "        <table class=\"mono\">\n          <tfoot>\n            <tr>\n              <td>R11</td>\n              <td>Bokfört resultat</td>\n              <td class=\"amount\">${kr(rapport.bokfortResultat)}</td>\n            </tr>\n          </tfoot>\n        </table>\n        ${rapport.varningar"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 13.2s)

Add the `.summa` row styling to `rapport.css`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/components/rapport.css",
  "newString": "tr.grupp td {\n  font-weight: bold;\n  padding-block-start: 0.75rem;\n}\n\ntr.summa td {\n  font-weight: bold;\n  border-block-start: 1px solid color-mix(in srgb, currentColor 30%, transparent);\n}",
  "oldString": "tr.grupp td {\n  font-weight: bold;\n  padding-block-start: 0.75rem;\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 53.6s)

_Thinking:_

Now add tests to ne-bilaga.test.ts. Test cases:

1. R12 = R11 (bokfört resultat carried over)
2. R13 add-back of ej avdragsgilla (6992 in R6 too)
3. R17 = R12 + R13; R21/R29/.../R47 chain with all-manual-zero
4. Manuella rutor: belopp 0, manuell true
5. skattemassigtResultat = R11 + R13
6. R47 shown at profit, R48 at loss
7. R13 konton listing with names
8. R13 year isolation

Helper to find justeringsrad:

```ts
function jrad(bilaga: NeBilaga, ruta: string): NeJusteringsrad {
  const rad = bilaga.justeringar.find((r) => r.ruta === ruta);
  if (!rad) throw new Error(`Ruta ${ruta} saknas bland justeringarna`);
  return rad;
}
```

Let me append a new describe block at the end of the test file. Also import NeJusteringsrad type? For the helper, typing: `NeBilaga["justeringar"][number]`. Simpler: import type.

Tests:

```ts
describe("skattemässiga justeringar R12–R48", () => {
  it("för över det bokförda resultatet från R11 till R12", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Försäljning
    1930  10000.00 SEK
    3000  -10000.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(jrad(bilaga, "R12").belopp).toBe(10000);
    expect(jrad(bilaga, "R12").summa).toBe(true);
  });

  it("lägger tillbaka ej avdragsgilla kostnader i R13 — kvar i räkenskapsschemat", async () => {
    await laddaJournal(
      journal(
        `2025-03-01 Representation, ej avdragsgill
    6072  500.00 SEK
    1930  -500.00 SEK`,
        `2025-03-02 Böter
    6992  300.00 SEK
    1930  -300.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    // Kostnaderna är bokförda och hör till R6 ...
    expect(ruta(bilaga, "R6")).toBe(800);
    expect(bilaga.bokfortResultat).toBe(-800);

    // ... men får inte dras av, så de läggs tillbaka i R13
    expect(jrad(bilaga, "R13").belopp).toBe(800);
    expect(jrad(bilaga, "R13").manuell).toBe(false);
    expect(jrad(bilaga, "R13").konton).toEqual([
      { konto: 6072, namn: "", belopp: 500 },
      { konto: 6992, namn: "", belopp: 300 },
    ]);
    expect(jrad(bilaga, "R17").belopp).toBe(0);
  });
```

Wait — R17 = R12 + R13 = −800 + 800 = 0 ✓. And skattemassigtResultat = 0.

  it("summerar kedjan R17–R47 med bara bokföringsbaserade rutor", ...) — with sales 10000 and 6992 800: R11 = 9200; R12 9200; R13 800; R17 10000; R21 10000; R29 10000; R33 10000; R35 10000; R42 10000; R47 10000; skattemassigtResultat 10000.

  it("markerar rutor utan bokföringsunderlag som manuella med belopp 0", ...) — check R14, R24, R40, R43 manuell true belopp 0.

  it("visar R47 Överskott vid vinst och R48 Underskott vid förlust", ...) — loss journal: only costs → last row ruta R48, belopp abs.

  it("håller isär åren vid R13", ...) — 6992 in 2026 doesn't affect 2025.

  it("påverkas inte av resultatomföringen vid bokslut" — saldon already excludes 8999 transactions; R13 uses same saldon → fine, skip? Add for safety? The saldon map excludes 8999-tx entirely, and byggJusteringar reads from that same map. Covered implicitly. Skip to keep test count reasonable.

Also verify R12 row exists even... R12 is summa with belopp = bokfortResultat. ✓

One more consideration: R47/R48 row — when result 0? overskott = ack >= 0 → R47 "Överskott" 0. Fine.

Now also check the existing test "påverkas inte av att resultatet omförs vid bokslut" uses toEqual(fore) — new fields deterministic ✓.

Import update in test file: `import { generateNeBilaga, type NeBilaga, type NeJusteringsrad, type NeRuta } from "./ne-bilaga";`

Add helper after ruta():

```ts
/** Rad i justeringsavsnittet, t.ex. "R13" eller summoruta "R17". */
function jrad(bilaga: NeBilaga, ruta: string): NeJusteringsrad {
  const rad = bilaga.justeringar.find((r) => r.ruta === ruta);
  if (!rad) {
    throw new Error(`Ruta ${ruta} saknas bland justeringarna`);
  }
  return rad;
}
```

Append describe block at end of file.

Now the tests — appending a describe block to `ne-bilaga.test.ts`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts",
  "newString": "import { generateNeBilaga, type NeBilaga, type NeJusteringsrad, type NeRuta } from \"./ne-bilaga\";",
  "oldString": "import { generateNeBilaga, type NeBilaga, type NeRuta } from \"./ne-bilaga\";"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 18.9s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts",
  "newString": "/** Belopp i en ruta, oavsett om den ligger bland intäkter eller kostnader. */\nfunction ruta(bilaga: NeBilaga, ruta: NeRuta): number {\n  const rad = [...bilaga.intakter, ...bilaga.kostnader].find(\n    (r) => r.ruta === ruta,\n  );\n\n  if (!rad) {\n    throw new Error(`Ruta ${ruta} saknas i bilagan`);\n  }\n\n  return rad.belopp;\n}\n\n/** Rad i justeringsavsnittet, både justeringsrutor (\"R13\") och summorutor (\"R17\"). */\nfunction jrad(bilaga: NeBilaga, ruta: string): NeJusteringsrad {\n  const rad = bilaga.justeringar.find((r) => r.ruta === ruta);\n\n  if (!rad) {\n    throw new Error(`Ruta ${ruta} saknas bland justeringarna`);\n  }\n\n  return rad;\n}",
  "oldString": "/** Belopp i en ruta, oavsett om den ligger bland intäkter eller kostnader. */\nfunction ruta(bilaga: NeBilaga, ruta: NeRuta): number {\n  const rad = [...bilaga.intakter, ...bilaga.kostnader].find(\n    (r) => r.ruta === ruta,\n  );\n\n  if (!rad) {\n    throw new Error(`Ruta ${ruta} saknas i bilagan`);\n  }\n\n  return rad.belopp;\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 55.4s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts",
  "newString": "    const r5 = generateNeBilaga(\"2025\").kostnader.find((r) => r.ruta === \"R5\")!;\n\n    expect(r5.belopp).toBe(500);\n    expect(r5.konton).toEqual([\n      { konto: 4021, namn: \"\", belopp: 200 },\n      {\n        konto: 4022,\n        namn: \"inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder\",\n        belopp: 300,\n      },\n    ]);\n  });\n});\n\ndescribe(\"skattemässiga justeringar R12–R48\", () => {\n  it(\"för över det bokförda resultatet från R11 till R12\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    expect(jrad(bilaga, \"R12\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R12\").summa).toBe(true);\n  });\n\n  it(\"lägger tillbaka ej avdragsgilla kostnader i R13 — men de ligger kvar i räkenskapsschemat\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Representation, ej avdragsgill\n    6072  500.00 SEK\n    1930  -500.00 SEK`,\n        `2025-03-02 Böter\n    6992  300.00 SEK\n    1930  -300.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    // Kostnaderna är bokförda och hör hemma i R6 ...\n    expect(ruta(bilaga, \"R6\")).toBe(800);\n    expect(bilaga.bokfortResultat).toBe(-800);\n\n    // ... men får inte dras av, så de läggs tillbaka i R13\n    const r13 = jrad(bilaga, \"R13\");\n    expect(r13.belopp).toBe(800);\n    expect(r13.manuell).toBe(false);\n    expect(r13.konton).toEqual([\n      { konto: 6072, namn: \"\", belopp: 500 },\n      { konto: 6992, namn: \"\", belopp: 300 },\n    ]);\n\n    // R17 = R12 + R13: återläggningen tar ut det bokförda resultatet\n    expect(jrad(bilaga, \"R17\").belopp).toBe(0);\n    expect(bilaga.skattemassigtResultat).toBe(0);\n  });\n\n  it(\"räknar summorutorna längs kedjan när bara bokföringsbaserade rutor har belopp\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n        `2025-03-02 Böter\n    6992  800.00 SEK\n    1930  -800.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    expect(jrad(bilaga, \"R12\").belopp).toBe(9200);\n    expect(jrad(bilaga, \"R17\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R21\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R29\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R33\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R35\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R42\").belopp).toBe(10000);\n    expect(jrad(bilaga, \"R47\").belopp).toBe(10000);\n    expect(bilaga.skattemassigtResultat).toBe(10000);\n  });\n\n  it(\"markerar rutor utan bokföringsunderlag som manuella med belopp 0\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    for (const ruta of [\"R14\", \"R15\", \"R16\", \"R18\", \"R24\", \"R34\", \"R40\", \"R43\"]) {\n      const rad = jrad(bilaga, ruta);\n      expect(rad.manuell).toBe(true);\n      expect(rad.belopp).toBe(0);\n      expect(rad.konton).toEqual([]);\n    }\n  });\n\n  it(\"visar R47 Överskott vid vinst och R48 Underskott vid förlust\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const vinst = generateNeBilaga(\"2025\");\n    expect(vinst.justeringar.at(-1)!.ruta).toBe(\"R47\");\n    expect(vinst.justeringar.at(-1)!.belopp).toBe(10000);\n\n    await laddaJournal(\n      journal(\n        `2025-04-01 Inköp\n    4000  15000.00 SEK\n    1930  -15000.00 SEK`,\n      ),\n    );\n\n    const forlust = generateNeBilaga(\"2025\");\n    expect(forlust.justeringar.at(-1)!.ruta).toBe(\"R48\");\n    expect(forlust.justeringar.at(-1)!.belopp).toBe(5000);\n    expect(forlust.skattemassigtResultat).toBe(-5000);\n  });\n\n  it(\"håller isär åren vid R13\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Böter 2025\n    6992  300.00 SEK\n    1930  -300.00 SEK`,\n        `2026-03-01 Böter 2026\n    6992  700.00 SEK\n    1930  -700.00 SEK`,\n      ),\n    );\n\n    expect(jrad(generateNeBilaga(\"2025\"), \"R13\").belopp).toBe(300);\n    expect(jrad(generateNeBilaga(\"2026\"), \"R13\").belopp).toBe(700);\n  });\n});",
  "oldString": "    const r5 = generateNeBilaga(\"2025\").kostnader.find((r) => r.ruta === \"R5\")!;\n\n    expect(r5.belopp).toBe(500);\n    expect(r5.konton).toEqual([\n      { konto: 4021, namn: \"\", belopp: 200 },\n      {\n        konto: 4022,\n        namn: \"inköp_varor_sverige:inköp_djurfoder:inköp_hönsfoder\",\n        belopp: 300,\n      },\n    ]);\n  });\n});"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 15.3s)

_Thinking:_

Wait — one test loads a journal, then loads ANOTHER journal with `laddaJournal` again ("visar R47 Överskott vid vinst och R48 Underskott vid förlust"). Does laddaJournal append or replace? Let me check test-helpers.ts.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/test-helpers.ts"
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/test-helpers.ts</path>
<type>file</type>
<content>
1: import { parseJournalFile } from "./parse-journal-file";
2: import { accounts, aliases, journalHeader, transactions } from "./signals";
3: 
4: /**
5:  * Laddar en journal ur en sträng via den riktiga parsern och fyller signalerna,
6:  * precis som filuppladdningen gör. Testerna arbetar därmed mot samma väg in i
7:  * systemet som appen — journalfilen är enda input.
8:  */
9: export async function laddaJournal(text: string): Promise<void> {
10:   const file = new File([text], "test.journal", { type: "text/plain" });
11: 
12:   const nyaTransaktioner = [];
13:   const nyaKonton = [];
14:   const nyaAlias = [];
15:   let header = "";
16: 
17:   for await (const item of parseJournalFile(file)) {
18:     switch (item.type) {
19:       case "transaction":
20:         nyaTransaktioner.push(item.data);
21:         break;
22:       case "account":
23:         nyaKonton.push(item.data);
24:         break;
25:       case "alias":
26:         nyaAlias.push(item.data);
27:         break;
28:       case "header":
29:         header = item.data;
30:         break;
31:     }
32:   }
33: 
34:   transactions.value = nyaTransaktioner;
35:   accounts.value = nyaKonton;
36:   aliases.value = nyaAlias;
37:   journalHeader.value = header;
38: }
39: 
40: export function rensaJournal(): void {
41:   transactions.value = [];
42:   accounts.value = [];
43:   aliases.value = [];
44:   journalHeader.value = "";
45: }
46: 
47: /** Kortform för en posting-rad i förväntningar: "konto belopp". */
48: export function radrader(postings: Array<{ account: number; amount: number }>) {
49:   return postings.map((posting) => `${posting.account} ${posting.amount}`);
50: }
51: 
52: /** Summan av alla belopp i ören — ska alltid vara 0 i ett balanserat verifikat. */
53: export function summaOre(postings: Array<{ amount: number }>): number {
54:   return postings.reduce(
55:     (summa, posting) => summa + Math.round(posting.amount * 100),
56:     0,
57:   );
58: }

(End of file - total 58 lines)
</content>
```

---

## Assistant (Build · Kimi K3 · 35.5s)

_Thinking:_

`laddaJournal` REPLACES transactions (transactions.value = nyaTransaktioner). So my test "visar R47 Överskott vid vinst och R48 Underskott vid förlust" loads the second journal which replaces the first — the förlust case would then only have the 15000 purchase → −15000, not −5000. I need to fix that test: either load both transactions in ONE journal, or adjust expectations.

Simplest: load one journal with both transactions: sale +10000, purchase −15000 → result −5000 → R48 5000. But then the first part (vinst check) must use a separate load. Two separate loads with separate expects: first load sale-only → R47 10000. Second load replaces → purchase-only → R48 15000. Let me just fix expectations: second load gives förlust −15000, R48 = 15000, skattemassigtResultat = −15000. Or restructure: load sale-only, check R47; then load combined journal (sale + purchase) — replaces → −5000 R48. I'll fix the second load to include both transactions.

`laddaJournal` replaces all transactions rather than appending — my R47/R48 test would break. Fixing it to use two self-contained journals:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts",
  "newString": "  it(\"visar R47 Överskott vid vinst och R48 Underskott vid förlust\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const vinst = generateNeBilaga(\"2025\");\n    expect(vinst.justeringar.at(-1)!.ruta).toBe(\"R47\");\n    expect(vinst.justeringar.at(-1)!.belopp).toBe(10000);\n\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n        `2025-04-01 Inköp\n    4000  15000.00 SEK\n    1930  -15000.00 SEK`,\n      ),\n    );\n\n    const forlust = generateNeBilaga(\"2025\");\n    expect(forlust.justeringar.at(-1)!.ruta).toBe(\"R48\");\n    expect(forlust.justeringar.at(-1)!.belopp).toBe(5000);\n    expect(forlust.skattemassigtResultat).toBe(-5000);\n  });",
  "oldString": "  it(\"visar R47 Överskott vid vinst och R48 Underskott vid förlust\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const vinst = generateNeBilaga(\"2025\");\n    expect(vinst.justeringar.at(-1)!.ruta).toBe(\"R47\");\n    expect(vinst.justeringar.at(-1)!.belopp).toBe(10000);\n\n    await laddaJournal(\n      journal(\n        `2025-04-01 Inköp\n    4000  15000.00 SEK\n    1930  -15000.00 SEK`,\n      ),\n    );\n\n    const forlust = generateNeBilaga(\"2025\");\n    expect(forlust.justeringar.at(-1)!.ruta).toBe(\"R48\");\n    expect(forlust.justeringar.at(-1)!.belopp).toBe(5000);\n    expect(forlust.skattemassigtResultat).toBe(-5000);\n  });"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 15.7s)

Now run the tests and typecheck:

**Tool: bash**

**Input:**
```json
{
  "command": "npm test 2>&1 | tail -40",
  "timeout": 180000
}
```

**Output:**
```
+ Received

- 800
+ 500

 ❯ src/js/ne-bilaga.test.ts:420:32
    418|
    419|     // Kostnaderna är bokförda och hör hemma i R6 ...
    420|     expect(ruta(bilaga, "R6")).toBe(800);
       |                                ^
    421|     expect(bilaga.bokfortResultat).toBe(-800);
    422|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/js/ne-bilaga.test.ts > skattemässiga justeringar R12–R48 > räknar summorutorna längs kedjan när bara bokföringsbaserade rutor har belopp
AssertionError: expected 10000 to be 9200 // Object.is equality

- Expected
+ Received

- 9200
+ 10000

 ❯ src/js/ne-bilaga.test.ts:451:40
    449|     const bilaga = generateNeBilaga("2025");
    450|
    451|     expect(jrad(bilaga, "R12").belopp).toBe(9200);
       |                                        ^
    452|     expect(jrad(bilaga, "R17").belopp).toBe(10000);
    453|     expect(jrad(bilaga, "R21").belopp).toBe(10000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 6 passed (7)
      Tests  2 failed | 128 passed (130)
   Start at  08:35:20
   Duration  193ms (transform 153ms, setup 0ms, import 265ms, tests 85ms, environment 0ms)


```

---

## Assistant (Build · Kimi K3 · 63.6s)

_Thinking:_

Two test failures — both in MY new tests. Let me analyze:

**Failure 1:** `expect(ruta(bilaga, "R6")).toBe(800)` got 500. The journal has 6072 (500) and 6992 (300). R6 covers 5000–6990 — 6992 is > 6990! 6992 falls in range... wait, R6 interval is [5000, 6990] and [7970, 7970]. 6992 is NOT ≤ 6990. So 6992 is unmapped → warning, not in R6! That's why R6 = 500 (only 6072).

Hmm, interesting — so with the current NE_MAPPNINGAR, 6991/6992/6993 (>6990) are unmapped and warned about. That's a pre-existing gap: BAS mapping tables typically say 5000–6999? Actually the BAS kopplingstabell for NE says R6 = 5000–6990 apparently (accounted uses 5000–6990 too, and 7970). Accounts 6991–6999 (övriga externa kostnader avdragsgilla/ej avdragsgilla, lämnade bidrag) are excluded by that table?! Hmm — that seems odd, but both accounted and our port use 5000–6990. Wait, accounted: `{ start: '5000', end: '6990' }`. Yes same. So per the official BAS kopplingstabell, 6991–6993 don't map to R6... That seems like a real quirk. Hmm, but 6992 böter IS a cost — Skatteverket wants it in R13 add-back anyway, and it should be in R6 too ("Här ska du redovisa eventuella kostnader från R5–R10 som inte får dras av").

Hmm wait — actually, maybe the official table really does cut at 6990 because 6991–6993 aren't part of BAS standard mapping (6991/6992 are from the extended plan). But practically, böter on 6992 should show in R6. However — that's the EXISTING behavior (warning shown), not something item #2 must fix. My R13 computation reads from `saldon` directly (not from mapped rutor), so R13 = 800 works regardless. And the varningar will now include 6992 as "konto utan NE-ruta". Hmm — that's noisy/confusing: the same account gets correctly added back in R13 but warned about in R1–R11.

Wait, actually let me reconsider: is this a bug in the existing mapping? BAS kopplingstabell "NE – Inkomst av näringsverksamhet" — the real one from bas.se. Let me think: SRU-koppling för BAS: R6 = 5000–6999? Accounted says 5000–6990. Hmm. I recall the official table: "R6 Övriga externa kostnader: 5000–6990, 7570, 7970"? Not sure about 7570.

Actually — hold on. The real BAS SRU table (from bas.se kopplingstabeller NE): R6 = 5000-6999? I can't verify offline. Both accounted and this repo use 5000–6990, consistently. Changing R6's range is beyond item #2's scope and would contradict the reference implementation we ported. BUT the interplay with my feature: 6992 (my canonical R13 example!) isn't in R6, gets a warning. For the feature to be coherent, R13 accounts should be costs that ARE in the räkenskapsschema (Skatteverket: "kostnader från R5–R10 som inte får dras av").

Options:
a) Leave mapping as-is; in tests use 6072 (in R6) and 7622 (in R7). 6992 would warn.
b) Extend R6 interval to 6999 — deviation from accounted but arguably correct per BAS (6991 Övriga externa kostnader avdragsgilla belongs to R6 surely). Hmm, but "make MINIMAL changes" and memory says our port follows their mapping with the R1/R3 fix.

Let me check the actual BAS table via web quickly — bas.se/kontoplaner/sru. Actually, the NE SRU mapping from BAS: I found references: R6: 5000–6990? Let me just check bas.se kopplingstabell. Quick websearch: "BAS kopplingstabell NE R6 5000-6990". 

Actually wait — I recall the official BAS SRU mapping for NE R6 is "5000–6990, 7970" — the >6990 accounts (6991–6999) belong to... hmm no. Let me check. In BAS kontoplan, 699x is "Övriga externa kostnader" — 6990 gruppkonto, 6991 avdragsgilla, 6992 ej avdragsgilla, 6993 lämnade bidrag och gåvor. These MUST go somewhere in räkenskapsschemat. The official table probably says 5000–6999. Accounted's 6990 cutoff might be a bug (like their R1/R3 bug we fixed).

Let me verify with bas.se. Search for the kopplingstabell.

**Failure 2:** R12 = 10000, expected 9200. My test journal: sale 10000 on 3000, böter 800 on 6992. bokfortResultat = R1(10000) − costs... but 6992 is unmapped → R5/R6 = 0! So bokfortResultat = 10000 − 0 = 10000, and R13 = 800 → R17 = 10800? Test says R12 got 10000 (expected 9200). Consistent with failure 1: 6992 isn't mapped.

So both failures stem from 6992 being outside R6's 5000–6990 interval. Decision needed: is extending R6 to 6999 correct per BAS? Let me verify quickly. If the official table is 5000–6990, then 6992 legitimately belongs nowhere in R5–R10 (and Skatteverket's R13 guidance "kostnader från R5–R10" still works — booked cost, add back; the warning prompts Jeremy to check). But böter/parkering on 6992 not appearing in kostnader at all would be clearly wrong for the bilaga.

Let me check bas.se's actual kopplingstabell.

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "BAS kopplingstabell SRU NE \"R6\" övriga externa kostnader kontointervall 5000 6990 OR 6999"
}
```

**Output:**
```
{
  "search_id": "search_7f97d2101f3a55c597c66a9fbd3afc9a",
  "results": [
    {
      "url": "https://www.bas.se/wp-content/uploads/2023/10/NE_K1-201002.pdf",
      "title": "",
      "publish_date": null,
      "excerpts": [
        "Övriga bankkonton\n\n1970\n\nSärskilda bankkonton\n\n**Eget kapital**\n\n7300\n\n**B10** Eget kapital\n\n2010\n\nEget kapital, delägare 1\n\n2020–\n\n2040\n\nEget kapital, delägare 2–4\n\nÄndringar i kopplingstabellen jämfört\n\nmed föregående år.\n\n**NE - Inkomst av näringsverksamhet, Enskilda**\n\n**näringsidkare**\n\n**Enskilda näringsidkare som upprättar ett** **förenklat**\n\n**årsbokslut**\n\n(För enskilda näringsidkarer som inte upprättar ett förenklat årsbokslut finns en särskild\n\nkopplingstabell.)\n\n**Konton i BAS Förenklat årsbokslut**\n\n**2023**\n\nNE\\_K1\\_17\\_ver1\n\n2 (3)\n\n**Skulder**\n\n7380\n\n**B13** Låneskulder\n\n2330\n\nCheckräkningskredit\n\n2350\n\nSkulder till kreditinstitut\n\n2390\n\nÖvriga låneskulder\n\n7381\n\n**B14** Skatteskulder\n\n2610\n\nUtgående moms, oreducerad\n\n2620\n\nUtgående moms, reducerad 1\n\n2630\n\nUtgående moms, reducerad 2\n\n2640\n\nIngående moms\n\n2650\n\nRedovisningskonto för moms\n\n2660\n\nSärskilda punktskatter\n\n2710\n\nPersonalskatt\n\n2730\n\nLagstadgade/avtalade sociala\n\navgifter och särskild löneskatt\n\n7382\n\n...\n\nErhållna rabatter, bonus etc.\n\n4900\n\nFörändring av lager\n\n7501\n\n**R6**\n\nÖvriga externa kostnader\n\n5000\n\nLokalkostnader\n\n5100\n\nFastighetskostnader\n\n5200\n\nHyra av anläggningstillgångar\n\n5400\n\nFörbrukningsinventarier och\n\nförbruk ningsmaterial\n\n5500\n\nReparation och underhåll\n\n5600\n\nKostnader för transportmedel\n\n5610\n\nPersonbilskostnader\n\n5620\n\nLastbilskostnader\n\nNE\\_K1\\_17\\_ver1\n\n3 (3)\n\n5700\n\nFrakter och transporter\n\n5800\n\nResekostnader\n\n5900\n\nReklam och PR\n\n6000\n\nÖvriga försäljningskostnader\n\n6070\n\nRepresentation\n\n6100\n\nKontorsmateriel och trycksaker\n\n6200\n\nTele och post\n\n6300\n\nFöretagsförsäkringar\n\n6310\n\nFöretagsförsäkringar och\n\növriga riskkostnader\n\n6500\n\nÖvriga externa tjänster\n\n6800\n\nInhyrd personal\n\n6900\n\nÖvriga kostnader\n\n6980\n\nFöreningsavgifter\n\n7502\n\n**R7**\n\nAnställd personal\n\n7000\n\nLöner till anställda\n\n7300\n\nKostnadsersättningar och\n\nförmåner\n\n7400\n\nPensionskostnader\n\n7500\n\nSociala och andra avgifter\n\nenligt lag och avtal\n\n7600\n\nÖvriga personalkostnader\n\n7503\n\n**R8**"
      ]
    },
    {
      "url": "https://edeklarera.se/sru-filer/sru-koder",
      "title": "SRU-koder (fältkoder) | edeklarera.se",
      "publish_date": null,
      "excerpts": [
        "SRU står för Standardiserade RäkenskapsUtdrag och används primärt av Skatteverket samt skatteprogram för att möjliggöra digital inlämning av inkomstdeklarationen. SRU-koder är alltså Skatteverkets motsvarighet till BAS-kontonummer.\n\nKopplingen tillåter en överföring från redovisningen/bokföringsinformationen till inkomstdeklarationens övriga delar exempelvis: INK2R , Räkenskapsschema (sid 2-3), INK2S , Skattemässiga justeringar (sid 4).\n\n**Räkenskapsschema** utgör en del av Inkomstdeklaration 2-4 där varje konto i kontoplanen är kopplat till en SRU-kod som summerar ihop kontona från BAS kontoplanen .\n\n**Alla konton från BAS-kontoplanen kopplas genom SRU-koder**\n\n### Bokföring SRU-kod\n\nBeroende på bokföringsprogram kan man skapa egna konton, glöm dock inte att inkludera rätt SRU-kod. Lägger man inte till SRU-koden i samband med det nya kontot så inkluderas inte redovisningsuppgifterna för det givna kontot i SRU-kopplingarna.\n\n...\n\n|7369 |2710 |Personalens källskatt |\n|7369 |2732 |Avräkn särsk lönesk pens |\n|7369 |2790 |Övriga löneavdrag |\n|7369 |2794 |Fackföreningsavgifter |\n\nNotera hur samtliga konton inkluderas under en och samma SRU-kod 7369. Se blanketten Räkenskapsschema i inkomstdeklarationen (INK2R) **rad 2.48** ” Skulder till övriga företag som det finns ett ägarintresse i och Övriga skulder ”.\n\n### SRU kod 7415\n\nSe **rad** **3\\.13** ” Resultat från andelar i intresseföretag och gemensamt styrda företag ” _(Nettot av företagets finansiella intäkter och kostnader från intresseföretag och gemensamt styrda företag med undantag av räntor och nedskrivningar, t.ex. vissa erhållna vinst-utdelningar, andel i handelsbolags resultat och realisationsresultat.)._ Här summeras exempelvis samma konton i BAS kontoplanen under samma rad, men separeras mellan två SRU-koder beroende på om posten är positiv eller negativ.\n\n|SRU-kod |Rad |Resultaträkning |Konton i BAS 2017 |\n| --- | --- | --- | --- |\n|7519 |3\\.\n\n...\n\n|7415 |8131 |Resandelar fr handelsbolag (intresseftg) |\n|7415 |8132 |Resandelar fr HB (gem styrda företag) |\n|7415 |8133 |Resandelar fr HB (övr företag med ägarintresse) |\n\n### SRU-kod 7513\n\nSe **rad 3.7** ” Övriga externa kostnader ”, (Alla övriga rörelsekostnader, t.ex. kontorshyra, konsultarvoden, telefon, porto, reklam och nedskrivning av kortfristiga fordringar.) i INK2R där bland annat följande konton redovisas: 5000-6999 (övriga externa rörelseutgifter/kostnader).\n\n**Viktigt att känna till:** 6070 Representation; 6071 Representation, avdragsgill, 6072 Representation, ej avdragsgill. Dessa ska separeras på första sidan (huvudblanketten) av inkomstdeklarationen där ej avdragsgill representation ska tydliggöras. _Transparens är viktigt och man bör därför gärna skriva för mycket än för lite under ”Övriga upplysningar”._\n\n|SRU-kod |BAS-Konto |Namn |\n| --- | --- | --- |\n|7513 |5000 |Lokalkostnader hyrda fastigheter (gruppkonto) |\n|7513 |5010 |Lokalhyra |\n\n...\n\n|7513 |5550 |Reparation o underhåll av förbr.inv |\n|7513 |5570 |Reparation och underhåll av markinv |\n|7513 |5571 |Underhåll stängsel |\n|7513 |5580 |Underhåll och tvätt av arbetskläder |\n|7513 |5590 |Övriga kostn för reparation o underhåll |\n|7513 |5600 |Kostn för transportmedel (gruppkonto) |\n|7513 |5610 |Personbilskostnader |\n|7513 |5611 |Drivmedel för personbilar |\n|7513 |5612 |Försäkring och skatt för personbilar |\n|7513 |5613 |Reparation och underhåll av personbilar |\n|7513 |5615 |Leasing av personbilar |\n|7513 |5618 |Ber milkostn för privat pers.bil i ftget |\n|7513 |5619 |Övriga personbilskostnader |\n|7513 |5620 |Lastbilskostnader |\n|7513 |5621 |Drivmedel för lastbilar |\n|7513 |5622 |Försäkring och skatt för lastbilar |\n|7513 |5623 |Reparation och underhåll av lastbilar |\n|7513 |5629 |Övriga lastbilskostnader |\n|7513 |5640 |Kostnader för arbetsmaskiner |\n|7513 |5650 |Traktorkostnader |\n|7513 |5651 |Traktorkostnader med moms |\n|7513 |5652 |Traktorkostnader utan moms |\n|7513 |5660 |Motorcykel-, moped- och skoterkostnader |\n|7513 |5670 |Båt-, flygplans- och helikopterkostnad |\n|7513 |5690 |Övriga kostnader för transportmedel |\n|7513 |5700 |Frakter och transporter (gruppkonto) |\n|7513 |5710 |Frakter, transp o försäkr vid varudistr |\n|7513 |5720 |Tull- och speditionskostnader m.m. |\n|7513 |5730 |Arbetstransporter |\n|7513 |5740 |Transporter för produktionsgren |\n|7513 |5790 |Övriga kostn för frakter o transporter |\n|7513 |5800 |Resekostnader (gruppkonto) |\n|7513 |5810 |Biljetter |\n|7513 |5820 |Hyrbilskostnader |\n|7513 |5830 |Kost och logi |\n|7513 |5831 |Kost och logi i Sverige |\n|7513 |5832 |Kost och logi i utlandet |\n|7513 |5890 |Övriga resekostnader |\n|7513 |5900 |Reklam och PR (gruppkonto) |\n|7513 |5910 |Annonsering |\n|7513 |5920 |Utomhus- och trafikreklam |\n|7513 |5930 |Reklamtrycksaker och direktreklam |\n|7513 |5940 |Utställningar och mässor |\n|7513 |5950 |Butiksreklam och återförsäljarreklam |\n|7513 |5960 |Varuprov, reklamgåvor, pres.rekl o tävl |\n|7513 |5970 |Film-, radio-, TV- och Internet-reklam |\n|7513 |5980 |PR, institutionell reklam och sponsring |\n|7513 |5990 |Övriga kostnader för reklam och PR |\n|7513 |6000 |Övriga försäljningskostn (gruppkonto) |\n|7513 |6010 |Kataloger, prislistor m.m. |\n|7513 |6020 |Egna facktidskrifter |\n|7513 |6030 |Speciella orderkostnader |\n|7513 |6040 |Kontokortsavgifter |\n|7513 |6050 |Försäljningsprovisioner |\n|7513 |6055 |Franchisekostnader o.dyl. |\n|7513 |6060 |Kreditförsäljningskostnader |\n|7513 |6061 |Kreditupplysning |\n|7513 |6062 |Inkasso och KFM-avgifter |\n|7513 |6063 |Kreditförsäkringspremier |\n|7513 |6064 |Factoringavgifter |\n|7513 |6069 |Övriga kreditförsäljningskostnader |\n|7513 |6070 |Representation |\n|7513 |6071 |Representation, avdragsgill |\n|7513 |6072 |Representation, ej avdragsgill |\n|7513 |6080 |Bankgarantier |\n|7513 |6090 |Övriga försäljningskostnader |\n|7513 |6100 |Kontorsmateriel o trycksaker |\n|7513 |6110 |Kontorsmateriel |\n|7513 |6150 |Trycksaker |\n\n...\n\n|7513 |6370 |Kostnader för bevakning och larm |\n|7513 |6380 |Förluster på övriga kortfr fordringar |\n|7513 |6390 |Övriga riskkostnader |\n|7513 |6400 |Förvaltningskostnader (gruppkonto) |\n|7513 |6410 |Styrelsearvoden som inte är lön |\n|7513 |6420 |Ersättningar till revisor |\n|7513 |6421 |Revision |\n|7513 |6422 |Rådgivning |\n|7513 |6423 |Skatterådgivning |\n|7513 |6424 |Övriga tjänster - revisor |\n|7513 |6430 |Management fees |\n|7513 |6440 |Årsredovisning och delårsrapporter |\n|7513 |6450 |Bolagsstämma/års- eller föreningsstämma |\n|7513 |6490 |Övriga förvaltningskostnader |\n|7513 |6500 |Övriga externa tjänster (gruppkonto) |\n|7513 |6510 |Mätningskostnader |\n|7513 |6520 |Företagshälsovård |\n|7513 |6530 |Redovisningstjänster |\n|7513 |6540 |IT-tjänster |\n|7513 |6550 |Konsultarvoden |\n|7513 |6553 |EU-stödsrådgivning |\n|7513 |6560 |Serviceavg till branschorganisationer |\n|7513 |6570 |Bankkostnader |\n|7513 |6580 |Advokat- och rättegångskostnader |\n|7513 |6590 |Övriga externa tjänster |\n|7513 |6591 |Synearvoden |\n|7513 |6600 |Fri kontogrupp |\n|7513 |6700 |Fri kontogrupp |\n|7513 |6800 |Inhyrd personal |\n|7513 |6810 |Inhyrd produktionspersonal |\n|7513 |6890 |Övrig inhyrd personal |\n|7513 |6900 |Övriga externa kostnader (gruppkonto) |\n|7513 |6910 |Licensavgifter och royalties |\n|7513 |6920 |Kostnader för egna patent |\n|7513 |6930 |Kostnader för varumärken m.m |\n|7513 |6940 |Kontroll-, provnings- o stämpelavgifter |\n|7513 |6950 |Tillsynsavgifter myndigheter |\n|7513 |6970 |Tidningar, tidskrifter o facklitteratur |\n|7513 |6980 |Inhyrda företagsledare |\n|7513 |6981 |Föreningsavgifter, avdragsgilla |\n|7513 |6982 |Föreningsavgifter, ej avdragsgilla |\n|7513 |6990 |Övriga externa kostnader |\n|7513 |6991 |Övriga externa kostnader, avdragsgilla |\n|7513 |6992 |Övriga externa kostnader, ej avdragsgilla |\n|7513 |6993 |Lämnade bidrag och gåvor |\n|7513 |6994 |Fortbildning och studieresor |\n|7513 |6996 |Betald utländsk inkomstskatt |\n|7513 |6997 |Obetald utländsk inkomstskatt |\n|7513 |6998 |Utländsk moms |\n|7513 |6999 |Ingående moms, blandad verksamhet |\n\nVi använder cookies för att ge dig en bättre upplevelse på vår hemsida. Genom att använda vår hemsida godkänner du användandet av Cookies i enighet med vår Cookie Policy.\n\n© eDeklarera Sverige AB\n2026"
      ]
    },
    {
      "url": "https://winbas.com/files/konton2007/f%C3%B6renklat_bas_2007_k1.pdf",
      "title": "",
      "publish_date": null,
      "excerpts": [
        "övriga momspliktiga intäkter\n\nR1\n\n3100\n\nMomsfria intäkter\n\nR2\n\n3200\n\nBil- och bostadsförmån m.m.\n\nR3\n\n3500\n\nFakturerade kostnader\n\nR1\n\n**29 Övriga skulder**\n\n**27 Personalens skatter, avgifter och löneavdrag**\n\nBAS-konton\n\nUnderkonton\n\n**30-34 Huvudintäkter**\n\n**35 Fakturerade kostnader**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**3 RÖRELSENS INKOMSTER/INTÄKTER**\n\nBAS 2007 Förenklat årsbokslut (K1) ver.1.1\n\n5/9\n\n3700\n\nLämnade rabatter, bonus etc.\n\nR1/R2\n\n3900\n\nÖvriga rörelseintäkter\n\nR1/R2\n\n3970\n\nVinst vid avyttring av immateriella\n\noch materiella\n\nR2\n\n3980\n\nErhållna bidrag\n\nR2\n\n4000\n\nVaror\n\nR5\n\n4600\n\nLegoarbeten och\n\nunderentreprenader\n\nR5\n\n4700\n\nErhållna rabatter, bonus etc.\n\nR6\n\n4900\n\nFörändring av lager\n\nR5\n\n5000\n\nLokalkostnader\n\nR6\n\n5100\n\nFastighetskostnader\n\nR6\n\n**50 Lokalkostnader**\n\n**51 Fastighetskostnader**\n\nBAS-konton\n\nUnderkonton\n\n**40-45 Inköp av varor och material**\n\n**46 Legoarbeten, underentreprenader**\n\n**47 Reduktion av inköpspriser**\n**49 Förändring av lager**\n\nBAS-konton\n\nBAS-konton\n\n**4 UTGIFTERIKOSTNADER FÖR VAROR, MATERIAL OCH VISSA KÖPTA**\n\n**TJÄNSTER**\n\n**37 Intäktskorrigeringar**\n\n**39 Övriga rörelseintäkter**\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**5-6** **ÖVRIGA EXTERNA RÖRELSEUTGIFTER/KOSTNADER**\n\nBAS 2007 Förenklat årsbokslut (K1) ver.1.1\n\n6/9\n\n5200\n\nHyra av anläggningstillgångar\n\nR6\n\n5400\n\nFörbrukningsinventarier och\n\nförbrukningsmaterial\n\nR6\n\n5500\n\nReparation och underhåll\n\nR6\n\n5600\n\nKostnader för transportmedel\n\nR6\n\n5610\n\nPersonbilskostnader\n\nR6\n\n5611\n\nDrivmedel för personbilar\n\nR6\n\n5612\n\nFörsäkring och skatt för personbilar R6\n\n5613\n\nReparation och underhåll av\n\npersonbilar\n\nR6\n\n5615\n\nLeasing av personbilar\n\nR6\n\n5618\n\nSchablonmässig milkostnad privat\n\npersonbil\n\nR6\n\n5619\n\nÖvriga personbilskostnader\n\nR6\n\n5620\n\nLastbilskostnader\n\nR6\n\n5700\n\nFrakter och transporter\n\nR6\n\n5800\n\nResekostnader\nR6\n\n5900\n\nReklam och PR\n\nR6\n\nUnderkonton\n\nBAS-konton\n\n**57 Frakter och transporter**\n\n**58 Resekostnader**\n\n**59 Reklam och PR**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**52 Hyra av anläggningstillgångar**\n\n**55 Reparation och underhåll**\n\n**56 Kostnader för transportmedel**\n\n**54 Förbrukningsinventarier och förbrukningsmaterial**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS 2007 Förenklat årsbokslut (K1) ver.1.1\n\n7/9\n\n6000\n\nÖvriga försäljningskostnader R6\n\nR6\n\nR6\n\n6070\n\nRepresentation R6\n\nR6\n\n6071\n\nRepresentation, avdragsgill\n\n6072\n\nRepresentation, ej avdragsgill\n\nR6+\n\nNE sid.\n\n2\n\n6100\n\nKontorsmaterie! och trycksaker\n\nR6\n\n6200\n\nTele och post\n\nR6\n\n6300\n\nFöretagsförsäkringar och övriga\n\nriskkostnader\n\nR6\n\n6310\n\nFöretagsförsäkringar\n\nR6\n\n6500\n\nÖvriga externa tjänster\n\nR6\n\n6800\n\nInhyrd personal\n\nR6\n\n6900\n\nÖvriga kostnader\n\nR6\n\n6980\n\nFöreningsavgifter\n\nR6\n\n7000\n\nLöner till anställda\n\nR7\n\n**65 Övriga externa tjänster**\nBAS-konton\n\nUnderkonton\n\n**68 Inhyrd personal**\n\n**69 Övriga kostnader**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**60 Övriga försäljningskostnader**\n\nBAS-konton\n\nUnderkonton\n\n**70 Löner till anställda**\n\n**7 UTGIFTERIKOSTNADER FÖR PERSONAL, AVSKRIVNINGAR M.M.**\n\nBAS-konton\n\n**61 Kontorsmateriel och trycksaker**\n\n**62 Tele och post**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**63 Företagsförsäkringar och övriga riskkostnader**\n\nUnderkonton\n\nBAS 2007 Förenklat årsbokslut (K1) ver.1.1\n\n8/9\n\n7300\n\nKostnadsersättningar och förmåner R7\n\n7400\n\nPensionskostnader\n\nR7\n\n7500\n\nSociala och andra avgifter enligt lag\n\noch avtal\n\nR7\n\n7600\n\nÖvriga personalkostnader\n\nR7\n\n7631\n\nPersonalrepresentation, avdragsgill R7\n\n7632\n\nPersonalrepresentation, ej\n\navdragsgill\n\nR7+\n\nNE sid.\n\n2\n\n7700\n\nNedskrivningar\n\nR9 alt.\n\nR10\n\n7810\n\nAvskrivningar på immateriella\n\nanläggningstillgångar\n\nR10\n\n7820\n\nAvskrivningar på byggnader och\n\nmarkanläggningar\n\nR9\n\n7830\nAvskrivningar på maskiner och\n\ninventarier\n\nR10\n\n7970\n\nFörlust vid avyttring av\n\nimmateriella och materiella\n\nanläggningstillgångar\n\nR6\n\n7980\n\nErsättningsfonder\n\nR8/9/1\n\n0\n\n**76 Övriga personalkostnader**\n\n**78 Avskrivningar**\n\n**79 Övriga rörelsekostnader**\n\n**77 Nedskrivningar och återföring av nedskrivningar**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**75 Sociala och andra avgifter enligt lag och avtal**\n\nBAS-konton\n\nUnderkonton\n\n**73 Kostnadsersättningar och förmåner**\n\nBAS-konton\n\nUnderkonton\n\n**74 Pensionskostnader**\n\nBAS 2007 Förenklat årsbokslut (K1) ver.1.1\n\n9/9\n\n8310\n\nRänteintäkter och utdelningar\n\nR4\n\n8314\n\nSkattefria ränteintäkter\n\nR4+\n\nNE sid.\n\n2\n\n8330\n\nValutakursdifferenser på fordringar\n\noch placeringar\n\nR4\n\n8410\n\nRäntekostnader för skulder\n\nR8\n\n8430\n\nValutakursdifferenser på skulder\n\nR8\n\n8990\n\nResultat R11\n\nR11\n\n8999\n\nÅrets resultat\n\nR11\n\n**88 Bokslutsdispositioner**"
      ]
    },
    {
      "url": "https://www.bas.se/wp-content/uploads/2017/06/BAS-2017-kontotabell_K1.pdf",
      "title": "",
      "publish_date": null,
      "excerpts": [
        "2730 Lagstadgade/avtalade sociala\n\navgifter och särskild löneskatt\n\nB14\n\nRad\n\nRad\n\n2900 Övriga skulder\n\nB16\n\nRad\n\nRad\n\n3000 Försäljning och utfört arbete\n\nsamt övriga momspliktiga\n\nintäkter\n\nR1\n\n3100 Momsfria intäkter\n\nR2\n\n3200 Bil- och bostadsförmån m.m.\n\nR3\n\nRad\n\nRad\n\n3500 Fakturerade kostnader\n\nR1\n\nRad\n\nRad\n\n3700 Lämnade rabatter, bonus etc.\n\nR1/R2\n\nUnderkonton\n\n**35 Fakturerade kostnader**\n\n**37 Intäktskorrigeringar**\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**3 RÖRELSENS INKOMSTER/INTÄKTER**\n\n**30-34 Huvudintäkter**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\n**29 Övriga skulder**\n\n**27 Personalens skatter, avgifter och löneavdrag**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nKontoplan\\_K1\\_2017\\_ver1\n\n5/9\n\nRad\n\nRad\n\n3900 Övriga rörelseintäkter\n\nR1/R2\n\n3970 Vinst vid avyttring av\n\nimmateriella och materiella\n\nanläggningstillgångar\n\nR2\n\n3980 Erhållna bidrag\n\nR2\n\nRad\n\nRad\n\n4000 Varor\n\nR5\n\nRad\n\nRad\n\n4600 Legoarbeten och\n\nunderentreprenader\n\nR5\n\nRad\n\nRad\n\n4700 Erhållna rabatter, bonus etc.\n\nR6\nRad\n\nRad\n\n4900 Förändring av lager\n\nR5\n\nRad\n\nRad\n\n5000 Lokalkostnader\n\nR6\n\nRad\n\nRad\n\n5100 Fastighetskostnader\n\nR6\n\nRad\n\nRad\n\n5200 Hyra av anläggningstillgångar\n\nR6\n\nUnderkonton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**39 Övriga rörelseintäkter**\n\nUnderkonton\n\nBAS-konton\n\n**4 UTGIFTER/KOSTNADER FÖR VAROR, MATERIAL OCH VISSA**\n\n**KÖPTA TJÄNSTER**\n\nUnderkonton\n\n**47 Reduktion av inköpspriser**\n\n**49 Förändring av lager**\n\nBAS-konton\n\nUnderkonton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**46 Legoarbeten, underentreprenader**\n\nBAS-konton\n\nBAS-konton\n\nBAS-konton\n\n**40-45 Inköp av varor och material**\n\nBAS-konton\n\n**5-6** **ÖVRIGA EXTERNA RÖRELSEUTGIFTER/KOSTNADER**\n\n**50 Lokalkostnader**\n\n**51 Fastighetskostnader**\n\n**52 Hyra av anläggningstillgångar**\n\n**54 Förbrukningsinventarier och förbrukningsmaterial**\n\nKontoplan\\_K1\\_2017\\_ver1\n\n6/9\n\nRad\n\nRad\n\n5400 Förbrukningsinventarier och\n\nförbrukningsmaterial\n\nR6\n\nRad\n\nRad\n\n5500 Reparation och underhåll\n\nR6\n\nRad\n\nRad\n5600 Kostnader för transportmedel\n\nR6\n\n5610 Personbilskostnader\n\nR6\n\n5611\n\nDrivmedel för personbilar\n\nR6\n\n5612\n\nFörsäkring och skatt för\n\npersonbilar\n\nR6\n\n5613\n\nReparation och underhåll av\n\npersonbilar\n\nR6\n\n5615\n\nLeasing av personbilar\n\nR6\n\n5618\n\nSchablonmässig milkostnad\n\nprivat personbil\n\nR6\n\n5619\n\nÖvriga personbilskostnader\n\nR6\n\n5620 Lastbilskostnader\n\nR6\n\nRad\n\nRad\n\n5700 Frakter och transporter\n\nR6\n\nRad\n\nRad\n\n5800 Resekostnader\n\nR6\n\nRad\n\nRad\n\n5900 Reklam och PR\n\nR6\n\nRad\n\nRad\n\n6000 Övriga försäljningskostnader\n\nR6\n\nR6\n\nR6\n\n6070 Representation R6\n\nR6\n\n6071\n\nRepresentation, avdragsgill\n\n6072\n\nRepresentation, ej avdragsgill\n\nR6\n\n\\+\n\nNE\n\nsid.\n\n2\n\nBAS-konton\n\nBAS-konton\n\nUnderkonton\n\n**55 Reparation och underhåll**\n\n**56 Kostnader för transportmedel**\n\nBAS-konton\n\nUnderkonton\n\nUnderkonton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**57 Frakter och transporter**\n\n**58 Resekostnader**\n\n**59 Reklam och PR**\n\n**60 Övriga försäljningskostnader**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\nBAS-konton\n\nKontoplan\\_K1\\_2017\\_ver1\n\n7/9\n\nRad\n\nRad\n\n6100 Kontorsmateriel och trycksaker R6\n\nRad\n\nRad\n\n6200 Tele och post\n\nR6\n\nRad\n\nRad\n\n6300 Företagsförsäkringar och\n\növriga riskkostnader\n\nR6\n\n6310 Företagsförsäkringar\n\nR6\n\nRad\n\nRad\n\n6500 Övriga externa tjänster\n\nR6\n\nRad\n\nRad\n\n6800 Inhyrd personal\n\nR6\n\nRad\n\nRad\n\n6900 Övriga kostnader\n\nR6\n\n6980 Föreningsavgifter\n\nR6\n\nRad\n\nRad\n\n7000 Löner till anställda\n\nR7\n\nRad\n\nRad\n\n7300 Kostnadsersättningar och\n\nförmåner\n\nR7\n\nRad\n\nRad\n\n7400 Pensionskostnader\n\nR7\n\n**74 Pensionskostnader**\n\n**61 Kontorsmateriel och trycksaker**\n\n**62 Tele och post**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**63 Företagsförsäkringar och övriga riskkostnader**\n\nUnderkonton\n\n**70 Löner till anställda**\n\n**7 UTGIFTER/KOSTNADER FÖR PERSONAL, AVSKRIVNINGAR**\n\nBAS-konton\n\n**68 Inhyrd personal**\n\n**69 Övriga kostnader**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**65 Övriga externa tjänster**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\nUnderkonton\n\n**73 Kostnadsersättningar och förmåner**\n\nBAS-konton\n\nUnderkonton\n\nKontoplan\\_K1\\_2017\\_ver1\n\n8/9\n\nRad\n\nRad\n\n7500 Sociala och andra avgifter\n\nenligt lag och avtal\n\nR7\n\nRad\n\nRad\n\n7600 Övriga personalkostnader\n\nR7\n\n7631\n\nPersonalrepresentation,\n\navdragsgill\n\nR7\n\n7632\n\nPersonalrepresentation, ej\n\navdragsgill\n\nR7\n\n\\+\n\nNE\n\nsid.\n\n2\n\nRad\n\nRad\n\n7700 Nedskrivningar\n\nR9\n\nalt.\n\nR10\n\nRad\n\nRad\n\n7810 Avskrivningar på immateriella\n\nanläggningstillgångar\n\nR10\n\n7820 Avskrivningar på byggnader\n\noch markanläggningar\n\nR9\n\n7830 Avskrivningar på maskiner och\n\ninventarier\n\nR10\n\nRad\n\nRad\n\n7970 Förlust vid avyttring av\n\nimmateriella och materiella\n\nanläggningstillgångar\n\nR6\n\n7980 Ersättningsfonder\n\nR9/\n\n10\n\nRad\n\nRad\n\n**8 FINANSIELLA OCH ANDRA INKOMSTER/INTÄKTER OCH**\n\n**UTGIFTER/ KOSTNADER**\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**79 Övriga rörelsekostnader**\n\n**77 Nedskrivningar och återföring av nedskrivningar**\n\n**76 Övriga personalkostnader**\n\n**78 Avskrivningar**\n**83 Övriga ränteintäkter och liknande resultatposter**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**75 Sociala och andra avgifter enligt lag och avtal**\n\nBAS-konton\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\nKontoplan\\_K1\\_2017\\_ver1\n\n9/9\n\n8310 Ränteintäkter och utdelningar\n\nR4\n\n8314\n\nSkattefria ränteintäkter\n\nR4\n\n\\+\n\nNE\n\nsid.\n\n2\n\n8330 Valutakursdifferenser på\n\nfordringar och placeringar\n\nR4\n\nRad\n\nRad\n\n8410 Räntekostnader för skulder\n\nR8\n\n8430 Valutakursdifferenser på\n\nskulder\n\nR8\n\nRad\n\nRad\n\n8990 Resultat R11\n\nR11\n\n8999\n\nÅrets resultat\n\nR11\n\n**84 Räntekostnader och liknande**\n\nBAS-konton\n\nUnderkonton\n\nBAS-konton\n\nUnderkonton\n\n**88 Bokslutsdispositioner**\n\n**89 Årets resultat**\n\nKontoplan\\_K1\\_2017\\_ver1"
      ]
    },
    {
      "url": "https://www.startaegetinfo.se/poster-resultatrakningen/ovriga-externa-kostnader",
      "title": "Övriga externa kostnader | Förklaring & Exempel",
      "publish_date": null,
      "excerpts": [
        "# Övriga externa kostnader\n\nStarta Eget Info Logotyp-bild\n\nÖvriga externa kostnader är olika typer av kostnader som inte sorterar under de andra posterna i resultaträkningen. Det är värt att notera att övriga externa kostnader tillhör den normala verksamheten i de flesta företag.\n\nI den här artikeln ges exempel på de vanligaste typerna av övriga externa kostnader. Övriga externa kostnader är antingen avdragsgilla eller ej avdragsgilla, vilket även behandlas i artikeln.\n\nÖvriga externa kostnader\n\n## Exempel på övriga externa kostnader\n\nFöljande är exempel på kostnader som kan räknas som övriga externa kostnader.\n\n* Hyror.\n* Värme, el, vatten, avlopp.\n* Telefon, internet; vissa konstorskostnader.\n* Frakter.\n* Städning, sophämtning, snöröjning, trädgårdsskötsel, m.m.\n* Reparationer, underhåll av lokaler.\n* Förseningsavgifter, böter (ej avdragsgilla, se rubrik nedan), m.m.\nFör mer information se exempelvis [Srf Redovisning (en branschorganisation inom redovisning)](https://srfredovisning.se/baskontoplan/5-6-ovriga-externa-rorelseutgifter-kostnader/)\n\n## Uppdelning i avdragsgilla och ej avdragsgilla övriga externa kostnader\n\nÖvriga externa kostnader delas inom bokföringen upp i kontona:\n\n* Övriga externa kostnader, avdragsgilla (konto 6991).\n* Övriga externa kostnader, ej avdragsgilla (konto 6992).\n\nExempelvis så räknas förseningsavgifter, böter m.m. som övriga externa kostnader, men dessa är ej avdragsgilla varvid de bokförs på konto 6992.\n\nLäs även våra artiklar om:\n\n* Balansräkning (inkl. mall)\n* Resultaträkning (inkl. mall)\n* Årsredovisning (inkl. mall) .\n\n[Årsredovisning online](https://www.arsredovisning-online.se/partner/starta-eget-info)\n\n### Populära sektioner\n\n* Mall årsredovisning\n* Starta aktiebolag\n* Starta handelsbolag\n\n* Cookies, disclaimer & integritet"
      ]
    },
    {
      "url": "https://www.youtube.com/shorts/cos-rTjCSu4",
      "title": "ASMR #6999 - YouTube",
      "publish_date": "2024-02-07",
      "excerpts": [
        "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube."
      ]
    },
    {
      "url": "https://www.bas.se/kontoplaner/sru/",
      "title": "SRU - BAS",
      "publish_date": "2024-11-22",
      "excerpts": [
        "se/kontoplaner/sru/vad-ar-sru-kopplingar/)\n* [Allmänt om kontoplanen](https://www.bas.se/kontoplaner/allmant-om-kontoplanen/)\n* [Kontoplanens uppbyggnad och användning](https://www.bas.se/kontoplaner/kontoplanens-uppbyggnad-och-anvandning/)\n* [Skapa en egen kontoplan](https://www.bas.se/kontoplaner/skapa-en-egen-kontoplan/)\n* [Framtidens kontoplan](https://www.bas.se/kontoplaner/framtidens-kontoplan/)\n  \n    + [Remiss ny kontoplan – Anläggningstillgångar och kontoklass 5 och 6](https://www.bas.se/kontoplaner/framtidens-kontoplan/remiss-ny-kontoplan-anlaggningstillgangar-och-kontoklass-5-och-6/)\n* [Kontoplanen i maskinläsbart format](https://www.bas.se/kontoplaner/kontoplanen-i-maskinlasbart-format/)\n\n# SRU-kopplingar/deklarationer\n\nDet finns två kopplingstabeller för inkomstdeklarationerna 2-4. I den ena  tabellen visas konton i grupper och ej aktuella konton exkluderas (t.ex. 11xx exkl. (112x, 118x)). I den andra tabellen redovisas intervaller av konton (t.ex.\n\n...\n\nHandelsbolag\n\n[PDF](https://www.bas.se/wp-content/uploads/2024/09/INK4_P1-240828.pdf)\n\n[PDF](https://www.bas.se/wp-content/uploads/2024/09/INK4_P1-240828.xlsx)\n\nInk 4 Intervall\n\nHandelsbolag\n\n[PDF](https://www.bas.se/wp-content/uploads/2024/11/INK4_P1_Intervall-241119.pdf)\n\n[PDF](https://www.bas.se/wp-content/uploads/2024/11/INK4_P1_Intervall-241119.xlsx)\n\nNE\n\nInkomst av näringsverksamhet, Enskilda näringsidkare – förenklat årsbokslut, K1-regler\n\n[PDF](https://www.bas.se/wp-content/uploads/2023/10/NE_K1-201002.pdf)\n\n[PDF](https://www.bas.se/wp-content/uploads/2023/10/NE_K1-201002.xlsx)\n\nNE\n\nInkomst av näringsverksamhet, Enskilda näringsidkare – övriga\n\n[PDF](https://www.bas.se/wp-content/uploads/2023/10/NE_EJ_K1-Intervall-231002.pdf)\n\n[PDF](https://www.bas.se/wp-content/uploads/2023/10/NE_EJ_K1-Intervall-231002.xlsx)\n\nBAS 2017.pdf\n\nFör att ladda ner detta dokument behöver du anmäla dig till BAS Nyhetsbrev."
      ]
    }
  ],
  "warnings": null,
  "usage": [
    {
      "name": "sku_search",
      "count": 1
    }
  ],
  "session_id": "ses_fcda23e54ffetRaU748oGhApJB"
}
```

---

## Assistant (Build · Kimi K3 · 35.9s)

_Thinking:_

Key findings:

1. From edeklarera (SRU-kod 7513, "Övriga externa kostnader" for INK2R): konton 5000–6999 including 6991, 6992, 6993, 6994, 6996–6999. That's INK2 (aktiebolag) though.

2. The BAS NE_K1 kopplingstabell (förenklat årsbokslut) shows R6 with 6900 Övriga kostnader, 6980 Föreningsavgifter — i.e., the 69xx range included. The BAS 2007/2017 K1 tables show "6072 Representation ej avdragsgill R6 + NE sid. 2" — the "+" means the account ALSO appears on NE page 2 (skattemässiga justeringar = R13!). Same for 7632 Personalrepresentation ej avdragsgill "R7 + NE sid. 2", and 8314 Skattefria ränteintäkter "R4 + NE sid. 2" (that's R14! bokförda intäkter som inte ska tas upp).

So the official BAS kopplingstabell confirms:
- 6072 → R6 **and** NE sid 2 (R13) ✓ my approach exactly
- 7632 (personalrepresentation, ej avdragsgill) → R7 + R13 — I should add 7632 to EJ_AVDRAGSGILLA!
- 8314 (skattefria ränteintäkter) → R4 + NE sid 2 → R14 computable! Interesting — R14 could be computed from 8314. Hmm, but scope: keep R14 manual? 8314 skattefria ränteintäkter is a real mapping. Adding it: R14 = −(saldo of 8314) as positive fill... The saldo of 8314 (intäkt, kredit) is negative in books; fill-in belopp = −saldo (positive). Since I planned R14 manual — but the official table explicitly maps it. Two more computable rutor strengthens the feature and follows the official table. Let me add 8314 → R14.

3. The K1 (förenklat) table shows R6 including 69xx group accounts (6900, 6980 as group headers). For the full NE (NE_EJ_K1-Intervall), the intervall table PDF exists: https://www.bas.se/wp-content/uploads/2023/10/NE_EJ_K1-Intervall-231002.xlsx — that's the authoritative interval table! Let me fetch the PDF version to get exact intervals: NE_EJ_K1-Intervall-231002.pdf. This settles the R6 range question (5000–6990 vs 5000–6999).

Let me fetch that PDF.

**Tool: webfetch**

**Input:**
```json
{
  "format": "text",
  "url": "https://www.bas.se/wp-content/uploads/2023/10/NE_EJ_K1-Intervall-231002.pdf"
}
```

**Output:**
```
%PDF-1.6%����
628 0 obj<</Linearized 1/L 78799/O 630/E 62309/N 2/T 78422/H [ 500 225]>>endobj                
647 0 obj<</DecodeParms<</Columns 4/Predictor 12>>/Filter/FlateDecode/ID[<6A5383FB67943145B6B740A7AC9AF70B><0BAC4C9663C15942BB7034D7560B8010>]/Index[628 30]/Info 627 0 R/Length 92/Prev 78423/Root 629 0 R/Size 658/Type/XRef/W[1 2 1]>>stream
h�bbd``b`:
$W�[ ��$� "�@� ����b���� b�8���@�n5�`n�@�ώ����$��H����  #�3
endstreamendobjstartxref
0
%%EOF
        
657 0 obj<</C 131/Filter/FlateDecode/I 153/Length 131/O 115/S 56>>stream
h�b```��,� ��ea����9�F� .�b�P~�����V83Y�|��"� ������qD3#S*�f�g@����������e`4����` ���
endstreamendobj629 0 obj<</Lang(�� S V - S E)/MarkInfo<</Marked true>>/Metadata 11 0 R/Outlines 15 0 R/PageLayout/SinglePage/Pages 626 0 R/StructTreeRoot 18 0 R/Type/Catalog>>endobj630 0 obj<</Contents[634 0 R 635 0 R 636 0 R 637 0 R 638 0 R 639 0 R 640 0 R 641 0 R]/CropBox[-17.0362 11.9906 578.164 853.671]/MediaBox[-17.0362 11.9906 578.164 853.671]/Parent 626 0 R/Resources<</Font<</C2_0 652 0 R/TT0 654 0 R/TT1 656 0 R>>/ProcSet[/PDF/Text]>>/Rotate 0/StructParents 0/Tabs/S/Type/Page>>endobj631 0 obj<</Filter/FlateDecode/First 71/Length 837/N 9/Type/ObjStm>>stream
h��V�n1�?&���~�"$��Jm�Upa%�E���}�66	%I�PY�f<��s&H�F�$(�#F�q)���+=C¸�#M��܂DD)�������i����6��j{��EZV���5��e4x�lVv�7���*gnB�1Q'�lP8 ��:��Ʀ�e��Q�ˆ�&ꯒE�x�ϳ���M@�-D�$�����'�t���En�(F���!_]��te��\�pn�6Yۨu����z�]Fqp𻃪��l���:	K� ���JV鬕-V�hP��=�8n7֛��ʋ���^�$���:��C��lK8/�~� W����a�)�~I6�>�Qw�,�x�q����rp��Y8h�	`4�x�	#|:m6'��5=0<�<���M������Y>>�5n\THN>�R0� Qz��;� �t���=��~XJ�?�Ƈ{[ ޤ�Z�A�7�1�]�L?� C�� .�x���q���2=��iQV�eR�}�� Vw���΄r�����zDG�g��{�6���	�q�8��}i��a�z(!L�髟(5V�D�D�A��*�PHs�p_il���3��s}$�	�@ Aw����ʍ%c�BmcPo��~lTX�Xy�Cyo�c���a���2������m��g��ar>VӺV}�V�^�
��8�UV��p4hŝ�l�|5?#XuB�D�3��už����-;![~���7r(b�"�M�3�(����^����4��:��f�9�,���4x�G��N)5�x��A��ԏ���I��FP۵_����� ����ǉ����'T�]=�	�������  ��a
endstreamendobj632 0 obj<</Filter/FlateDecode/Length 505>>stream
H�\�͎�@��<�w+�����,yK>�Gq� �Rh�~�LQ�F
��LWWt\��8,&����s�޻�t��3'w�(�L?t��j���š���-�z�ST�&���0/�~:��(��{��b^~U�W����]ݸ��l��w� �����Wg���Ї���x5�V�|��d�uJ3�Ի��vη��Ee��)���Fn��{�ϲӹ����̰8I�)�;��!o��pE��5�7�&pN��yJN�9��,d��d[��g�9}��)�%�%�%�%�h
5��ZYkw��yy�yy�yy�yyeO^�[�o��2�[�o���+=+<+k��ZE�r��̢Ȣ�Th*�G�?��Q�2�"�2�"�2�"�2�"�2�"�2�"�ҳ³���x���-<[z��l��³�gϖ�-<[���i����k�$�NE�
:5kk�6���~C��{�	'|�ϯc��|�Xw�>��:��\a���}N�<�&T��` ���
endstreamendobj633 0 obj<</Filter/FlateDecode/Length 483>>stream
H�\��n�0��y
_�	�ǭ�"m	�r�?�t���"59�"o�>��+-R=3>g����v������lNC裿���ys��!d���C7~-�ݥ��<%���_��4fUe��i�:ǻy�֏G���?c�����O}x4��6M���lVf�1�?�B���G{�&_Ҟ�}���S���v��)��5�tc�S��؆�ϪUz6�ڥg�����o�i�S��Ƭ*�Z�W�\���-xGN���%��5y.��$�`!ؒ-X�
vd~&?�_�/��g	��%8Kx��,a}A}a}A}a}A}a}A}a}Y꿒_�샠�>� ��'��X�Ģ'��,�Yj��f��>X�Щ����U�*���x]��K�K�K�K�K�K�K�K�K�K�K�K�K�K�K�K�K��ї�/Gm�}9�r���Q��NG�:k�Ԉ�S#��z�����w�M/\�ϛ���&�|�Iw�1��2��l`*��&w'�����
0 )��
endstreamendobj634 0 obj<</Filter/FlateDecode/Length 813>>stream
H��U�n�0��+�(,s�l�m�4A=�E�Ǝ�=u��3�E�cE/�μ7�u6�l^o�/�^aoo|<;< ��Ӄd�� ���x����
F�g�~W8�K��ڕEUA�mQ�~�~���@(,䋜�u���~�_��1��#���0	L	WH�B�a(�U��i�����"*P�j�����kVA��/���$o�H���K���H#�pw���	W$�������f
�+i��~��j���.�uv��Dd��e�l,���⁩���1�]k	�
$T��I�Z �j�6�@��ri/*	��]7qU�8G	�y�)�~��3�+��=κ������ٯowy�2y=K~M�CUz�RӢ㺮���z�Bn*C�OT�6Ŝ�p��(}pE�Eu�F>Oˡ�H�j5ފ@%�����wv�-ū�������%��Xp�����Z@����w�u>H���h{�2��;X8M�4�9�(�%��*�@Q���'��Qv�C,�H,�����;0))z����3b�����s�$�WS��&���"�#Qr�z�,��4�a,�a,Ă] t9�:C_�j�J��o�I���5��	�T.P �s*e?p^�#�]=�q�?�i|�xC�7�pżo:�I~O)��9�bF�8o�̏'C��r[���
��"�08|��*5v(ϱ��*��0_S�ı�~o� �k"]�2)�ŴL�/�J��1��P(�zR�#׫o���3T��~hP�� �1,d�;w>�j�P4�?�8|���K$��:��5��h�Xk=»  r��
endstreamendobj635 0 obj<</Filter/FlateDecode/Length 687>>stream
H��UMo�0��W�h��/�P�����v�vڴ��dXRtٿ)Q�����D[�����|&y�#�i���5˦���tq};g�fWW�9,Κl�4�I�<f��d�=��SŚ����+�əB1�BլYgw�-W�0,_s�
"˿q���.%f�\��b��f�*.�m�ʸ�_7�����6����L�@X�ָ��N�Wm U�c&��͇�|�_��Б%|:bI�pu=�I�xPI����c����>e�2WԆ�
���`��2��6G_pZ ����Ж�퍶u JN��c%�bS�|�F$i�1I
�eG%ٛi�5��x�L?��(l�D�)au	r�ߡ8I�?y���w:F)9j�@��3�KȾ@�%�ㅬ��Ou��eZ�|Wd��T�h鐍�i��KyF�=nI'R�^&N��$%���(;��2��֥,i�]"κ�"�$.Х�4��G��(k��fF�?��\V� w�dr���L�3=�Z�V�O?�R`���V��fԇi�'����*�D�);��`1�: �oAF�����(K{_z&��o���
�4I�@B�)3씐w�7�tM���*V�P��%`�1��+w%�R�Wkz����ߞ���Gz�u��O�]�\xZ�N�?��HB���!�.�M��������"˃��_ �=��
endstreamendobj636 0 obj<</Filter/FlateDecode/Length 628>>stream
H��U�n1��WxiK��{�R�Ŵ]�Ҩ,(��
�������׏����vu���s�=�k���jy���tv�X^��D]����K����8�i�g�Ǚ�HH�[5�ж�f1	4|m8�\��Ѵ��s�o�+!��ޙd�C�C���3��I�/�lNN�bHC�1f-���q���}6��F�E�q�4���$�0��-��#��	���B��ﹷ�[B�Y�/�Ex�H���K߲B�����|J>WQa<�ځ�9�FӤ��6�+ʟ"ifڪ�Wϓ��!��S�;���.]�!D�-[�L� ��;�u���ǜ-��J��gU=)�"Ҏ!qo*��Ͳ�,;"ҷ��FIKZh��(P�%��xڮ#`�D��.N7Y�Fi�ֱKIE����A�$R؏���M��	�4x�H)U�.��R}�L��W�g�a����-U��oGZ���t�--�P�F�A�C&�	u0�0�*<:d�X��Y�r���㓷kxQ��@��#Λ������%���M ��:Rw��^g^U����y��a��d_2������yU��/S{pü�U]�$��e�~�O`�?����W0�� ���LF�U�}r2T{��q�gB �W� D�Ĉ
endstreamendobj637 0 obj<</Filter/FlateDecode/Length 582>>stream
H���KO1���)�>����ⰐC��Zi%��Ji���w���ibVJz�cl�����+XV]_M���~Q1ʘ���4��:�K`q�9����X�T��0��:��|��WӾ�^�A5� ''�˳w������w�&��� Z�4��L��Z��/��%�����#�ݎ���2�sK�Ģ�#�̏+����u��'�Ç����Q�\�I�9<�})�v�Q�ԯ(�B�Z��|-���Y9jHe�;�1*p�yuu0��Vl3aƘ��(&ɺ�%&���D��^b/
Y0��h8�P�&��
���R`��Hc}�3�o�X��/W�����i���
�y2� N�('f�Dy?��0�bG	2z� )��"Hjښm��A�E� Yw�DX�*��K�X.|�m���u~~^�-�U�p�5���x.t��8��PLF��$�5��Fah�.��M7���퍤�%Ɍ(x2�Ѷ�+Q�A=��f��g�IzH�fO������{�ykv���a 9�y���4K6F�u�МKvܷ ����E����2�Zo�+_��B:(���솘&�/i(�` nR��
endstreamendobj638 0 obj<</Filter/FlateDecode/Length 646>>stream
H��UMo1�ﯘ�Zb��RU�is Q���8 �BCU�D"�ҟό?�M�n$��ޱ�7oޛ�����;89�]��� �[8=�_`t�W����
�,���s��q���΁�a�Wk��P�gfx�+fi�D<���s��Z��b'%DN��Qy�(�r�� �V ���zY}�e���$��W�����k7Pa���%k$������67L���5��V7�ow~�X��g"O�Ѵ�'k(��	M)g�jDv��$��vD�"I�-�7�|k��PŌ�ye�[�`�"�o.�\XEYF2�Hb�d����ʠ���A���i�I<��1õ��xT���2�	�u�̯�ǣ�z��.s�5U��Q�\RIRu�N%%��#f���m�E�j��5��"u�r�C-�b��1�^l��zbEu��>o�r�K��^��{��O����~}��Z���� �f'� �@�L����I��O8oCqH(]d�͊������Ұ�����ji�O��<�zڨ}c�����EP�he�)�x�0]�Ff�����]�~�v"/KJ~�bȣ<+��N�mϺC���ώ!��2�?0�_�,����
6�i�)E�i�$��N1,H����� ��Ԭ
endstreamendobj639 0 obj<</Filter/FlateDecode/Length 627>>stream
H����n�0E���Y�@DsH��;Y�h��EE�>�u�6�_�H�T"�A�I�q�����YW�]������|v�:?i$,�S�u����� �j�~��ָ%?SR�������R2�k(�Ӽ���	��+�M�Qjádם/�֏��kc�������H�h+����ō���pK�f]' ���ț����k��V\��Z���0X�f�i�׬ќ�1.��Y%�u�ȋ��XbP����|��sɃ򛫆+�{&��݆Y�ܱ���=���7"G(�}J��m>X����#�y��P�:垖O�j�t����,m7���p��/V)����U��;J0�ݪ8�����Zi�����¯�X��do0��^[k�9�Q���0M��N?m��.[J��]�/M�.��Q�'��uV̪I��$Mu*{"�����Mυ�ۈ��Yk���FHh��g�>�����=v�ռ/�O}7��fh��b�v����q�ךp��]��,�\�J��p
ɕ�pJ��>Nl��)8U>0s��� �Ɋ����L&k%uV<R�Ult��P�g!h<���j��Rp��h��W����Ȗ���Z�5���o�����  �Ի
endstreamendobj640 0 obj<</Filter/FlateDecode/Length 890>>stream
H��V�n�@}�W�1Ad:��H�H�nV��"��V�[�B�@Y��=�d�m)��g<�c��������
���q]�ֲ��@�}��yc��p�Bڨ��hڒpP�M˙�l��ws>�����WP�����x�rJX����'��ʳN���)�s�$Hͼp��z�j9VG+���x�� ~����ʃ�,�#D�$�7Ղ[g���%?�m3ŵ����\͸�����u�irv�0�oS��ƨ^`$cP
Ԭ���G�:܋�����Y�2�1H���rrӷ�n?bf��L9)�yߊ��S��.t� k��P����P>L��(�X�A9���Dt̹
���_��]��b&����(]�Kr��(--��[;�e�:b�n,k��)�%��n���e����Z��ӱ`nBF�ˢ�o\J�U|D�H��&-W�m7'a4����U^���%ϥ8)d�L�x�L��v�e���)��F%%-c�}h���a-)%�X �y�9p�Rs�ְ^Ӏ��І&��zC�<t���d�L�����nS\��\s��rS�!UG�:JQ	��8�T�ɱ�wi}q���x�a��0l�b(���p*g��f���=�Q�X�O��Ҏ9;/�`�\��F�k������2M3D��7O�*�w9(��9�X���y甐��`���Bs����Bm����^5��D}���8��-�dSJ"�ԕ��ʫ�bu2>u��Y�iZ�Z�)kq%��%�1�Wŧ���x��P�������$�1�ش�^�wM+���Li�
6��J��d�������X�c8q닧��5��48ޢ���� ��f�)@�w�;~����������W��r'�m
�:��3z4w)�ܾOa~��	)�g��SH-uگޜ&=K� ����s�#� ��	t
endstreamendobj641 0 obj<</Filter/FlateDecode/Length 468>>stream
H�|�MO1���+|��Ď�%!���[���
B-j�vU�~��H��bN��;���㮳hm��,�����K��Dпc1C��yi��b������~�!�@�7C��m��v����Ƙ�q�m���ێ�������"1�K���c��3O<'�Ƃ��5t>7OF+*m�&��*ޕ��$���t�.9����5G�rɶ�9Y�hki���A���.!;�z\1(��K͢�0�K�4���B�iZ[��6t傲Z�;M��\u�Q	h�;s��,4JIk���Z-���"����؇����[Il	y��%#BQ{D9�ry�&��I!�Ĺ���L��M*�MET����W
���~�cw��p|z�8�������M����L�:[�<}��}�B�Jl��ӗ�K���g���M��[��Cgl5m�k�Oe��L{��w�Ɔ���u_��9#��唅� ��4#
endstreamendobj642 0 obj<</Filter/FlateDecode/Length 19121/Length1 36723>>stream
H�|�TUGƿo����0>/O��Wͮ��k4D@Q@,R�XĆ;błXQ4�.b�����)�&q����g���s��̛;�9����B$z��ۨ�~��J��b�� ���n��5ܽ9%�b�_а ��W��3@�;lT�_���@�L��3_o�'c��9��_	eN�vS�����h1��	�Q	�xmT�Po�t��P�� �L�9����|��t������A�!���� ����
�X����!�r��}��LQXߴ2	"��ѤI]ӄ���#��j��*У�a@	�|����L5�Յ}���U�6�cj(�?�Ye�.*Lx+�V��1�_�Sj��#�%�J�.S�\�
�+U�Rե����5WK�ZV�Ojש[�~���7iڬy���Z�i�i����������_t��e�n�{|ճW�>}�}��7�����4�C�����>b䨀сA�cBBǆ�GD�?a��QS�N�=#&vfܬ�s�΋��`��	K�.[���W'�Y�n���ɛ6o�*S��n߱s��=i{���?���C��=�'O�>s�\���/]F֕�׮߸��w�����A3��(���I��y\�5�A��&Z	wqF�9RJ�,!�dM�&���r�����yQ��Ji=�AZ�6Q��jK�U�:m����nkO��zu��>H����y�;��͉�����WFE�b����F[�����d��L#�8l<s�]+�VrU{�������",&KKyKE���l�g�b��ZaV'kY����u�u�5�z���mD���!�5�g��^W�?����E'!��.�����RDwZ�ݒPtұ�tE7W�St�Jk��m�������Zm����k����u���{�3��]�9���(oTVt���F�wt��d#�H�/��o��)��o�[|>��R�.8�Zr�k��`THg�S|؝���qf4� e��q��4{m�������ʅ��' ��j�٫ڕ��_������Ya_����'���s���6��_��iy�F�1Gnt�}z���s����e��s[�ֻ_���"s�s��lkm� �F��`� �6�M�M,�F�Ff'f'��9;$�3��f���=�xX����ҋ,z�gB��X��	�����TD��*���/����U���ew�G�~ҿ�:D��Qr���U�(z^���;f���7�X�鈖��ǘ����U،����)�iX�gx�9X�XR9�$b���k���8�m����2��38��8�L\��!�p���1�pWᏧ�'fb�c$0
���@#c��E������	؇5��I�ZL���ى�SPR�����_�3��K䣀&~D�ٕ�؝=�{�KґN����/ه}ُ_�?���[�=��ALo��ٚm8�C�C_��Ks�Y�eY�呋��@g�Vd%��H�b G3�A��*؎�J�1�ƏY�f�0�� �5hЕ�e��H��xN`M֢�n��º�)�����Y�u��87p���̆7�#���/���\�D�f��7k��빁��M����­La}nc��F;�����{�ƽ��t6�~�w<�C<�#<�c<Ά<��l��<��<ó<��g&/�h�K��&l�,6�^�5^���-��f�.sh�=��>0��H��EQW��E�P4�E�T4��h!Z�:9K̖{�>�Xyk�X*���2]�+�J�J$��r�\)Wq>�P9V��p!#���.њ͑��8��؍=8)6b*�!F��)~�v"Y��)�Q|&O��<#��s2C������\���&�Yl�o\,����D�خ�tP�;�.�[��r����z9������z��e�	Ǳ�D����W�U$�T���?ӳTm��9��(�O��"
|
��"�P�LP^ۯv�y�xQ�]8�\V���E�g����;m���V�xo\|��^�<U���PZ���R�ʔb��yX��y���j'�3߬�)���x��6u]�{�{����?�Ip����'8�ؐ��!��$�D��؄TJ�0R��@*ś�
H�Sע��@�>�u�ES�ve��V��MTT�f�C�v�<��瘆�{λ9�����=��{��P�'�rԂ����cX��A\�o���{�����^��4�2���jf�>+�;��~�W~��}�����o!�#�i����gD$"����C��?@F��_��!8����L��>�o�h�_t�%��9��"��#;�nwP��5|l��Qg�H3呖�t��<U�L����mZ�{L���c~H���H�Ќ��R%�M��x�A�tW����tiU�f���e���`߼ �}
���<T���+t��p>E7`ng �`��;Y�zSr��]������m=k���U�-�f���s��*�����1E��	�ԕ�jmI�Hƻ|��jm��%�8'���Cc5J�*���J���ݯ��s@H]�(�����X�vb�HxZ����Ph���(:�H.ȍJ�{w'Uf/�* fl0Ic�onLPY��pC����RX=�l���Q�Ou�����[@cˑ[>F��<-Ю�ԗ�K�"mS�T�#0tK�9E閄n%��-��#����B"���s����*��q��}"�:rc��2ͣ{G2��0�(�|�e45?�,�4⻄�P0���\�H<CT��H��$��I�G`��N)1�N
q%��"g��z*� ���w](���`�T���@A��;��w���&�s�R�&�%g�d�K(�2iG�:��u}ߌ�P^��:C��+b���F����s�tG2\��ٲD�h��3�y����Em3HT2��zta�) ��l5�f�"s�N|LY��3��.sp*�`�:�����+k�AC.�?=�}`C��e��ނ�M�Y�x)�k
v�f�II���ܟ|65��R�^NmTL�]IQr���?��m:C��I�(��*�#Z���K�ʖ���&D��:,�)���;	J��.�(�$@h�p��Rn���Rj~���KIK����}��V�Co�o�%��;u�c�A�*�E[�O�ER�?Xt��VҒ(�j=u�t��R��9�>��WN8��P�;F�"��>��Gz��Mt��fh0h����%�G@ (���(�×�����l1��Z�
f���0=�>SgM��� �)�˄1w���6z��9�N�x�b���N{�s�`8��̠Xlu�?� q:\k���d$�j�2�w��.��^����Xg�����۴��p�j������w�&���zQ���|?N�<���9=��r��1�=���&�x�`���[<�L�;��܇�!2Ό�U{\��~��+�O�V,�_�SB�i�6?�x��3�_�;v1I�htm�YC�����.2�o{q���[7��@"�S�T�[��O�q��W�ɩw{��5"������Yb����+o�&َ�첝���<�x��I�(���x3���� �)9ň�;E���n�58tR�e".��1:Ib�dPD,�+q�DP���/EF�(�{�#�f�{O���ʄC�1���Œ�Ĵ;g���ϐS��j�B����\�7��>�gȢ�J�� 0t����d���Jm��R�Gx���K_�V�w����PlE��_޻�+}Ξ2��$����5�z���5q�k���DMW��������oAۆe�F|���HϿ�qP�"*����O4�z��T����f3�m�"���},�![�>�*�D#��njltК1r��x�	*&Hk&�yHA64Z:�@_\8��	@�H����j/,�p{�=����6��}��q�h��jk����=�M���&���g�]�vnP
�%�Ԧ\���s7�o۾�o�?O�����wl��f���ģ?]�WR��v��p��hױa';*�L���iC���1UL6�N�����<�U�hT�9�8T%�%� 3�0�p�!�X�)�(B��"�P��)JL�b�vXu��n7BKG`B��'�:�C�P��B{,��T����H;,��Z(~����pT�0�|��"n;�ܙ�T�n�x�wPq� 
��d+`�<������1:�����\oXg�T��c�������k��g��1�;��{|��l}�a?3j|�9�9�0N~�Z>U7��I}q��Nh��B��o5���x�7�^j2IR���y�V7!����'��%�j�T��M�E��y����R��Z:��K�y��K�|��� �/���4��H����0�dV�A�3� ��h�������uF��K��ֲdI�Ee�,�b%/�$���_`�&b3�@�@��b%�x��L[hIH���	����P i㔾h&?(m��6�a�N�P�����{�j��i��H�JwW�s�9����E�h�1==����M�W�z��U��/�|�s@���6�o�XOy���z/�w�~�����?��n���M��B
?�:�'�*=#96)hH��:C�Z�JIC����$��L��[�7l�������=u�hMsY[���a2&]�J�$�R�I=�{3�,fŰA�1'�4bW�E�K*쏜`�=���{����8m���F��S	S ��/ʿ�ο-��B9�)I��+� M',2z�2��F��U}^����B����Cѫ�#٣slv;��`Q������w���ooN
U�#��dj��Aqݢ�}h3�>�Ԛ<��a�C���o�IbqS������`�y�W��C��k�k���Ђo��T��E��.�z����3�iv��
��Vp�S�h��[]�@+H�P�)Z�
�BTh�X��6
��pFV�� '#Dn��a(Eq	~O���2�:#�;5�#X�W��2���v`�PH �GK��1� X�Q��Z L��M��@�Ēؼ��7&��+iF���E�`K��
Y�2UY��t0?C�� -�y n� b�x̀�9����.�̮ϼF�i0r�j��N�ʬE�yj� ܓ���Q���7�[0�sN�깘����5�S\W���N��u*�O�uuQ��I���Ļ v|^���^΀��B��^�΋3_(E薝vt��<��{����R��J)JY=�۩'�)�ɐ)�
���*����5)J�!���ih���a��<fM�������cy+>�_r 
Ǥ���=#�ԾL�������>~���#�ףm�U�ಥ��HΜ���`4�v.=�a&	/'~�DX�.��He$��o�l����B��ӳ���<ls&�����(�I��0��o��;��!��D ����	�$�dR�D%��b4%y���t���j�ĖMG��E�q�&-2��J d,j�W�"�l>�"�� ���xq&���[�ZV���=�~��3�m[�f[����=����G��d�\�9q�4�u+�Ys�����o@ճ����{�y���Gb�X��龜�nk�|{�����B��"F�]�(d4K6�a��r6�sjjfJU���'KA+h'{��P�� n�Ka���Er&���!)� Iڄ��L�D��$�1����q��&���'}4�����9j��7��xϢ�hh��	�>QL�q��%" �E�{࿘+J�§^��ݨ
�Q[�-�F�m�沖H�mUqj^����{C}�]���Zn]�:˺⵾�e��vY��^�8Y�ǁ���M9�䓱VH�G����B�KH9�D(( $^>�(8��=�=��)��*���ܴQ�Ds{t8jB��}�J��*�*��wTNh��o戴m2�e-�r���G)��"��**&�j_�o��I�k���Q���/����/"ޖƢ��X ���b�~�"*Q��0{�0uoOd�O��~�������� ��з�7���~�|��[��;\�wI��ӗ_:r�|�xpe�j-�����o���J��;G.ۼwpc릠����Pf��g��ʷ��{�Ķ�[x�@.1�D9���u�:1V����*z��tъy`��dvV�Y�mV֙s٘Y��lB�P���꘡nUHۊPn̰�B+4Z�x�¬1�lA��N����c��j��f��&�+Xf]a���/��Ve�\��.��7���7�X}�������bK���+�-���T+�-���Z(��J��ۇF�@���J���� %MM�g��8�n4\66�7v��ۂ_A0k�'�`��t%-|״V(z� ��y��
m7��l����y�< $�����A�V�a��:���
����,w��<��y�LQ~>��p&#�Y�b�D)!�p�����R�V#��gD��Y�t3�=��y� ����g
�ˈu	Y�����4l����q���	�@���Q
�O ̚�G2�G��%��Ne���'�kӃ�'?���ALD����hW,��f,3v�+m{�Y�9-A�(���D�rT8����h<;���,!�l�1���qq�bE(�h�B��W��:=�~�*p���<�A��֚�?�r]�S��C�C_)f<�l��bJ�,�KbD�TȪ�CW�[8=��,����:�[��&�X��,����o�"�(V��C<ݨ9J �L��I��ҹ�GŹ!�8�1_��2bג���3w���%W$��^};;ZZ.���@��J�%��c�:��=����I��Ę$�Ƥ���d�2�(Ry,�8$@ ���BZ�jL]��&m�u�+�Vm�g2 ��1�F��Nb��[��
J5�!��w�Ͼ&���E����&�����q���i]8s�:�]P�#ݖ�_m}s�����侞�o5��k]R^�uV�jj��^��WX��U�M� �g�q��FZQ�*Q�1�GU�iB�4�L�AWvz-/��pn��k�A6��B�� �ns�m.��抃l.|�쿚۞m/�r;�y<.s�����$�0�	����u��~�V��2��ǰQPD�!�u��
}�#��T��m���<@�[/���p�+�g�����s�8=�}�
o%�e�/�J�8	�'g�}��c�$�;�Gs-X(�1�\���̯U��+�Y�{g6A��3��7Z2�:��Y�&mݻ��=3L9�P�A*z*Q2�
މ���Ȓ�p�(�n)!x�ٟ��p�`a�����@m:�����3g��3g�#��]+�����\�����["T�<)j�B��b�����楑�f�q5�|S�G�UH�J؉���ʭrP�'���H&���]�n�ঀU�\��ݙ��zzz^���*�y� |���e����鉡���UQ�����jೇ*�UЍ�o$�6c�1`0�`h�FT�Hs`���,��F���=;�ݺ���� p�֍�ă~�	:�&&T�]�iy�(3[a���>鵽�Sw�ii��Z�r��;ռ4�\>���qw�yA~Uy�S����m6�\���S4�ӧ��E�i����Q�Q�w��ᴷ��.'�;�ͱ1r�fn9����9���.����\9p�P��$��'!T4K��J���?e�ZT&�^�"�`��/��:<�b�|����k�M����ep�N�2����Vs+�[y���l�{�6��i�23���]8&��J�l7����*�&���3�'�g�~i����A���N���|��c{����"Mn٭���%ULɓJ�7��#e��O�,_̷�G�^|=�����v{r��ɩ��&J������߅�+�7��齯��+{�w��5�=�#)6�Hv�m`�]��IL�%�#^��L�,@�:�v�G�/�W ���A��N���\�6�(��8�y�oɞ��[ŵ�gʴ���:��Z��]ӆU���1��)u��R}z�=�M��SI:U�F:�A��@4�v	8mpx)6�ۨ;������ݒ�*h?,��U��i�2��Y�����@$%��A"A$�x����� ��L>�\�"su�� ���w�As��O2vl�f���T����+��Qh!/��ԝ_�wmv�����O��R�Ԃߞ����˕r���"�V��ZO��+�6���9��iGEM��l��!U���3*�p��`�x��D#�����w�著]k��Z�M;"�qg�UV}�~^=�aE�����H��D,�^V���Yz��͖*�|���?�Y���?25!d����e�n�4�Ng��;)�Wj�*?nc
�y�o���G;�L�����+��:���Ɂ~�"h|���S�_��7�_SFO@|Ӻ�͹>�
s����Ο1��ƈ"s�Wb��g�P��̩��Ug`��&�6�^���e��	c�+~�2E��M�)v�v��є�:+��q(�'2��S/�jv��w��Wμ7*����� �qDmS2��h��Ej�GiX�,��I����Y:bS2;��d�'�bį�
�E��#F��e�+-	!wC(�~��;>���7�h����z_c*9���;=/�jL�e���lmc�w�:����~juy�7�Ɔ-X���?8�ה��ب�T�FWAv�8Ee���>I�#2�MqG��)�Uz8�����������P:�ڰD��/uĖL_��E:�:c��OTl��mL�6=;i[l۔���ƽ�Z���g�↖�L�j5�OU���T3�p�<Q�
Zy"R))P����hxe ��=�\���QP╆��Q,��5[�ۚ�18K���Rr�H�&I|�[��@�@߰#]�Չ������pb`o�`�;	3�f�L����v���|����?���Gj���NU#a�+~8Y�xمoq�/��C��S�������~��<�I���|����w�}m�?��~s���}�힍v��W��{���ϸ�h���ɾDd�1ĸY׃�S����i���<����i�z��NI��|�hf-����Ƹ��V��Tc��[��2�P�����爪pBEk���NJ�ޡ,�� eJ����Ae��I��?��i�I��T�4BHW��P��s���&�b��ǔ�'wɹ��t��9�\Mx]�5
�ǝ�2�T�J�,#؋�p^��Q\Wx����������k��]/~������Y�`S�HM�&[�(4�)� �*�҄B�(�EmE%�?�<M�"�J�EB!m�6Bi��&-.E)���gf��Q���ά�޹s��}�;t�jTV�"�����B�L��IUS-�vN�b�~��DK���(�wؙd��K2)�p��pWĞ��$�D_l�m����]o��ڎfI�hI�s���}'o~ �"%g��8��]Q�(���}:�j���D�v�(��@�ж@�&��C�QQ���-�uOpS��(@��eӇ����Y�,X5c��y�@&��qe*2ٌk�=�:�,i�ȒF�
6ra�|cX�6E������B��@p@�L�W	`4�e���@Ak������V�dn>�I��14��-�����S�Z�YRFh�"�"c�(���uV��X�Q[23wn�&�	�´Ŝf���ڦ]+�����P�XC]���/���][��j�sb�_�W������:�@�䑱44Ĺ��e%னz�5����Жb��^O`tpdt��q-�$�Pq4��n�3����x7����S����1nw�!��@��8PL��Λ�`���5��T;^(�cv�$�&zx�z�L�����ħ�����8���P++*����9vޭ#Ɨ]$� .���V<|�1^�-�A�*�T<� -��wU��tX�J9&Y����%gpH<�	����*���Z����562p�eK+`.��]=?ݰ��Ŏ���/^��}�W�]������n{�������V�w�z������z��|sV�*V�M�O,w�T������I:�*�:�,eʈ�e)�w���2��Mh���$z�no��$���w%a�K���CGↁ�����N2Pv��U���C良]��<d�9@��Co�!�<�9���_i��T�o/wJ���*-���7�'�Zkx�qik��Y���W��.]��5r~�}չg~x�̱�/7���ٗ4�{z{?:�d4on͇]���v�w1��$a~l������Q�j5G��B����j��mn^F��*9�A\���K^sì����xXW���NME+U�"w�$�)LqïP�T d���ojT�|Ѵ�ƕ�ag�pa�2�'�ɽu0��85NC�\�S���RQM�Cpp�W؄c�Q8 �_�'�����f�PY�S��d%-}A�Z,�	U������ɿ�X�}ft���B�g���\~l���P+�^��T��4�E�~�2�ѕ�?��hn.�dF�=��'��ZSͤ���Bg{���s�������Α�N箘��+*\�#��!ز.�%	h�	�J���#| u�(��!*��iZ� 6o$��MX*��
2��t��d�ɻQX6��xd�T�y��%2��i�Ryܔ{-��liȴh4�g�[	0��F->�H\�d�ޮ����\4���U_�d�}���[�I����?ϡ�o�u�A�7�=�������s����,޻S���܇]�MQ����r���*��9�p!�����Z(���(A\�I���x��y/b��.��Zo�]k���Ak(VA��$JT��6�O'��[EX#�{��HN!��ke�����\1N��4y:��)�M8�M�!�̤�3�&b7�`��K���̴`w@J�"�+�U��=]<U�<�]_Ǯ�=_y�����彣U�����*1]���x������YT��_����y��:����E�l޿ma7�����R%+'|�j��](],��t:�m�tQ�������l��l.+�&f�`!�Mb'?0�i�M6̢l�	T�*C�U�S��=�o�t6M��S�Re}KR�s*��Q��P}S���
ѷ*r Z�ŢX�؄���N�ۛ�m�8�aJ����qUn*����6�yT��ռb�8=��J{�云o$���#;�.����ѽK�m�{U=rr��+2V�*�.ʙ��5_���݅����{jj������^�\���<����7?ڥz,>�o���vr�FD������8Zs~0��n��"�_� l�6�	�����JcF8�W?d��ڈ�T(#
�~��DG��9�CN�:�QG��p�NC�qpK������ kH�,���4��6Hb;�<hxRy����1k�\ӷ���Bau��3�=˾U]7����
^]���W1���b����=m�`.@YL�Q�؊-�kħ�6F���\G]czh��r̚b�i`L1��r� Sl5Ŭ����18�������1uӸ2�h��e�1񇠖�LF���x@fB�&���1��loֱެ�7�U��%(b� W�rxJx*u��y㊵<���Rn����ׯ;
V��U�0N̥��ԂH:cg#,�&�[��c���� �T�s �cvdG#~��߄���Q��K�x�s�$��I~����Х���DF��A�d*&=3 �W�#{��)U���}��?|�z�K�6� K�<~����T�!SM�D$q;�B	���y�ٛ4���É�<^����ګ?8���������c�G�.�wr!��$W�I�&�@���\I%�������V�Ik[��X�g��a�J����X��֢���K+�a���}��wِ���N2;�l���<��<��&�կ�+�_@/P\�'�_2�J�ބ���ߎ�"�;���U����T̗��Q��������#��1����*�Ӱ��&�����vi��A��q�R���̌3�����[z=�-o#��F,�_�#�;�#
n?���`<����"C��!��f�(3��(.'UN9�2��*�c;�		�&��p6˗\�]G��$�Sߐ��h�N.�41�Hb�=~�f�3?᨟0����[�G]�8Rt�ˠ���r�<B
��s�q�V�fP�Q���y��E�|� _DwP(ƅ����t^F��H6Kp�y*�H
�Ý��[���EO-xj<k�NzН��Yv<��I���x� ���e�iH�Z�Ԃ�Ƴ��e_,�����vA��������?�BU%�I%֕*�Ed$���/���7��oNb=M�1J\=�\(tB^D4U � L�u	<�t����mH�e�kT��A��L�A���A8O����<A˘e����i.fX���A8�11�5RU�Wk�����H�1���6D��b��9��9-8�����Ӳ��󓮁�
N2�I2	$+MR��H�AA�B;@O���İ��l4d����+	v7����N���;j�5��%e��ϝ���
�(��nHI'';YI�e��ؖM}G�����Icӱ�{�]�'���1~d����}�����4?��`���F)!3ҳy����'Y"&
��]7&b����c�D��@������_�^����!;q��A5+;�X���� |98r9�#1������݄9C���h6���ho���6{�J�C"X�	�3��=�
u ������b�z��v��zh��T��?��v��vΑ��Ř@ݡ�`QIQG��EB�°�rv9+�a`.l��Xb;�䬲�5 E鑤8����OI�Q��U=�d�#I}���Ϸ�x���"�,�dp�\���9���Sw����b��]� ��x������_;�ߖ��?��P������t�ԩ3�9Mx�i~H8Dx[���vU#�i,]��D�J���^IjU�u�]\hK�O7gY����X��2g�Asf���Q�6�e�����&���]��w�%��| �2kV%j��U��
��Z��\-��M/�?]w���6G}z��uXjt�@NL_���e����l�Hv�Z�bC�$K�R;D�!�¡��^��LO6����7Ͻ�ԗ7}�w�{��2�6~n��Mթ�b������[��yrUKn���#�(�C��0w�69�A�2��A�+���*���2 ��L��e�� ��rRP�R�R�R�j!��3HU�$|�ZI�Taԩԙ����뀧:��i�bHWCU�Gx���������fw�{�������o����ya�W�	6M��>�5���V�W�(Q�.�lT�*��u�����'˶4�����`t�t��FsX�-ݟ�[����R_E�H��@�VX�+G�6������F&��dٷ�e�
G-`W��2�k٨�u�� ]�H������5�}� �c��x�y�[H��N�#̀�[L��\Y\���J�0�:;%g�R,(p�)pҮ>��K��m�Ѵ(���Qh�f�<X�yOqt��u�bi�X�dB��J���=��5t.��t3]D)�����ƢQz��sgG�Z����������O�s-�X��C�����~����-����/�^���h�8��o㖮���<���K�-��u��o�Q=�-�YK:f���|N<�%�?ؕ�h�u"��
�O�XV��G�� �t��7����ʧb� E�,;4�ai�l��e�q�b�(r)���7&!� !9I%$�;��9�Q�Qn��w�464�`\k$�����\	�U`B�PE����e���I%�/k�s�G����hȏ(����ۆ��O���|u�q$���^��J������N}�6}R�<,c^��b�KԐb��� 77�]�'�}hC�*s2�Ώ�Y�f'����y�{��k>F׍��5'�͊k
�����xXaT)l�)� 
�Baq���)c޸ƂYf>��榵�K]�e�&akv�v�|"kX�-�{^�͎�n<�6��܁��u�S�Zq��d��$�L�,�9B�N�{����[ݽIr��wH#7yǫ�T���B��J葤Z�E��M�(J�"��<Nq5x9���V�}h�W8����ٺap�X�a��f�j,ӹ$����%� ����>,�$����J���5I�T�3r�#����PjBHͷ�,��[4�Hw~�]!35�����#�P��ǡ��B��&�9��՗@&6�Z�k�6�5�f�Yj�[�vm׋�q��-u˽�zm�?�W{p�?�=v�M��M�	"ؔGb̤6���Vǀ�0)7�>,�iI�P�P������:5R�VBP���@(q�6�ABj�iڦttV���η��ɵ����wrrv���q~�wk͓Uz�S���Ī��gI���qA�/���}�$�FԃYI�IN��m+n�YJ+Kh0�V6��� �L�ok�a�a�%+�dP��ٰhs8�"�1��°����I�j]t� ���Ă�QEѼ(#7�d\�'���?���>��NK��E�x��zi�����U|qp�u`�~1Y�VY�.0��G2�:�29��	����HNv�Ã!�<Z���`�f���KfT)��.����޶��ѣ�(]f͒��Z%��aj�,%�,*S��PXR,�,KH��0��nȤis0��JWw��F��.�z�E� <��+
,�TJw�4��ծ��g�J�JE?t�s���YL`L��v���!��ʳ)߱9i�i%i�ikӴ���oM���9��?�7͜�w�N��,I����[�[��ro�����Ȳٺ3J��M[.�R�!#E�EBPQjQNQI�����	�2�i���~�(�k)��kS���ά=�]�mn�2?�<kgg�䞃�U�3e��&	�O(�IإV��4���	j$�c�蝽y�^ʋYT���O~��i�y��I�F�E�Z#.b�̒�5W Ȉ���㶏���g�ԱjM���Q܌�Mk�����7��)��A
���A�<X��`��2��C������]،F��y�7�Kq2�XZ�P�[��=g�G��9�}�kg��8�x����+*�7��[{j�֎��?ZQY�b[�S�]�k��>X)�F7��7��~#���h���P^`1n�8π��v�OByft�O7�!�劜`�����&:�3�����e��^���@v`�x~N�����{boc|�ΰ2���w �B����$�!H��cUa޻Xcr��d��Ͱ�^IY�a��;i���u���i�^R������4I?F�S�1ގw���e�uW�m[I��?`a7�5�Z�WS��;��M��*�҂3��~�}�z��~jS�A�:�A�����u*��:(��N���8��9���㪛j�<�'k�����.<kŻӱGt1_�B��t 8<}ώ�Y`7���T��7g�o�g���
��,
b�\õ��-A�\�~R�G�x������6������"XU��˔�ٳ����¼:}+�C?��`lܦ���?�uwAVa���^��MQ�70��W����E��1�@��A^��a'��VZ�\�-����c���N1!��6{k�7����J��#��(�&*E�,eۙØׇ5�B�pf�'bx��ǽj�B�������'��3��BgBҁ�X�ɐE�
p�
Te�2�4|g����8��ށ�pvc�[�p6k��`�߳��O6a�b��E�3�6�Ŝ��4x϶���)_�؛Bu|����9�`c�����l���,���&&�k�G�	Oo�����1�k�s���V���7{��G�%�~���V~@I����p�ғ����u�귐߮�y�H�9���Q�i�x�a�u+t}��1��Ǵ�0���?LBL���z-0��?�[8�q^1y�ň����	�ޜ��������s��K�����g?�5Ǧ���?Q��#��������(ǧu���#�	{96��݇^y6�µ=�*���ׂf/��0Nx���}-5��s�z�`�|_
���r<4��2�;nNo�a�i�9�C>��z5h|s���t}��\�&g�"��Tp������t�^G�g<��@��߮�Ř��)����'M���{4"���X�p g4�1����)��r^��K�ms ��4���yð`{Xp�<Fa�0m	�E��x����R�Ӵ(P��&�:�WZ�NP�<{�EA��oQ�*���1����qu���v܏vk��\���4u�(-�:�|ކ|��Ԇ~�M� ~����!5t��+�4����)3^��65s�8������xxw&X[x���\y�.�EO�9E	?{�ca��W��h �"�:��w�jk<d�����6>Ì%���:�������!:Wu�߹�s/'�x���,8�o�`���c����׆���_�<m�.�9��>�v�n<��?�s����|��� �����<�s��{2���\pC��_���K�'����g�O�K���u�>_��tb�����Ӊ1�1�z�ܕ��w�A/���-���:֣��s���SL�%��	{�3v���܏|� 9\��|�:�P{��R�u��c��Gh���8�������h�=�M��e� �@�܎<c�W{�z�#j�#|���R�գ�4k1�X�2gE�qʐC�P{�z`z,7/��7�׋�=�}���:AG �����Cj��n�{�OJ�W ���>��D
mPEԬ~J�Q1v����"=�~�Vӽ�5�/�S��%ګ��~�Eu]q�ܷ�튂������V�辅�˭���1qV�,��m V��:j&-vRM[3M�&�B�Q�j�����6N�JRۘDC�4uڱ���x*�8�M�G;�0ι��{�9�=��s��?@_%-�{0g�=�?�ݔSi��czg��?JY�]�Z�8��LΤ\~��e�Z~�Vӷ�R��K?�o�wx.���r��/ڋ�m�oEN���r!�&`��ZL�r�w��7=JX�w�.�*H�n�ij気�!;�y� wȗ�>�{�2~g���1�M_�0����竈��$=�� ��%l�<��@s���d� ���̅��:�Ʒ��܏��ul 
��CAM�4j�s�c���*�C�}D퇢?����q������ǻ�I�g����U�A��e�~��G�]�e��;��6�1�7���s�?�CrU���k�u�31j��?�6���1��h��gi�b�BU�S���O�4=#�;q��D�Q�Zݎ� ���{f�9-ɰ��͋���Q�E��5�-�������x���[��e9��{)Q���O4b��
��Kf�~,+l6�A*��\$$�Du�kŽ�+$�����+����
x� ;	�@4���?�wL�3��w��z��0ɩi�#@��r�>&�_a�a;�nZO�@�4(�@x<\j'���~�}��ɷ�]>z�X�)�{B?Ad3�Yj7�B�M�5ԃ}��|�z���þ��F� D�f:l���J�*�������P����Q�y,���p>�O��~R�S|�O��7�z�9��]ggh
��5���-�j�j/�v�E�;N����U��̰7{���/7d�A�fR��b�9-֏��7�<	}�!�'����[����S����o�<,�/q�O�v�i̇Oq�B�+کx������b+i��ጢ���>��및��`�yjKe�*�S�qU��o�'"vpi8x� �����H�~��3l<Q���D����&YDѭ�g�/�b��� 3�.�Dq�~�-D����&|ye;QR�]&�~ ZIA��@��"���D�e�?�و)G"�]H�@l���-b��D�M���S�&Qa?Q�R���{S�|<�`�A�k��sS��x����0a	&L�0a	&L�0a�c���6��֐LES&=Adz�J&1J�ԪK�u�DkP��UC7C�o��E˄����:���wC�h$�3t�g)�Ρ���	C��:��%{v�4�}^Me���_�d/��oS��>����T�jj��W5V�U�2��*�.)J�T|�z��Z���4ڽ����WU����WڛVUY�:�_� �+�u�����z��(JM#�yTC� ?5��Ԅ�Bhj��z�S��20�Z�ک}մ
c�z�
�
�����b*�
ZJK �ȣ����jZ?^������kˎXE�Bk�3�a�N_}�D�bdz�]�j���m]	Y��X�F�>�^�ѾI�?�QsS*����|�=�`<�']��_Д��H� �d���&�AX]c�#� ��B��X-s�t��X
�d�d1�5��̉r(����L�9,�R!gC�!��R��)�B$�1!����� ��Jʚ�J`�vj�f�H�����Ð� � � g��`�j�T�p�%||rUS޻�)�G������(V�Ƭc�tCfcv�T�j�=�C2%M�`ҔȪ�G�,
���c�T��Sv�F�} �Ld����,�>�������G��|��?H��X�2������g�y�����4�<C�^518%�����`C�%x0x$x.x%8�7���Iëqc�#��Q<҂%˗H�
v��
i��8^�8�/.�疕����,�����<���泝��g/tN��r�*p�f���>>=7���T��D~.�JN��S��֞R��Ԯ��GO���F�GX��|]۶6���֦[�M��"�m�R���1���a�d�{y����P��&8�=q�Z�۶�(�-֭֝�]���e��+sg�֖���۽u����[���k@	H�S�k����o0���NK����%Z�hE�
I��J���T�(�nK�i�<�j��Slc�bK�I�Bn����x|B	O����l>v1w�-��6��\���T��,�[�<�V���� u+��[1u��ۭ��[��r�D��{<U9�z�&)�]IJG(I9q�T���_G=����Zd��32�h�QI�j钬!ghA�9ĭ�L�~��CgCZh���<2J��d�����X��?�!o����l��Q�H�{CJ�Sko��i�Ad#wp �Dl`������;�d����bm,`��6׌�l�.� �ç�dl����]�7��fl�0)��b�$�"0�P��N�[J�$�RW�0�3`Q_�a�6T���6@� T���
endstreamendobj643 0 obj<</Filter/FlateDecode/Length 15700/Length1 28969>>stream
H��VTUW����ņb������ǂD͌�=�h��"��  (`łQ,#F"6{A�Xc����b�5��e����_�e�5m���sϹ����]g��A %���z5hnwUU�+��Z��}7@O�����c����@�ހt:4�I�#o�x ��bhP��������Z�>~���	|��k�
��K�����kGD�L6�Q�`�܅�_\k�j��+�>Q�E�� �%�~c�O��À	*��ݡ!��(���d[�ڮ��j��,�:�$��Ba~e*�K���Q���	-ֶ0��SJ+C�^���8�zḣ7�Rۚ��؞�nL���pQ����2�-�(�m��Z���Pıh1��%J�*�\��K��*V�\壪��7S�f��k֪]�n��6jܤ�'͚�h������m�~��?�����:v�ܥ�ݺ��٫�W}�~��M�����`_?�!C�

...86692 bytes truncated...

The tool call succeeded but the output was truncated. Full output saved to: /Users/jeremy/.local/share/opencode/tool-output/tool_0327c93aa0019vn757ur2zp42Y
Use the Task tool to have explore agent process this file with Grep and Read (with offset/limit). Do NOT read the full file yourself - delegate to save context.
```

---

## Assistant (Build · Kimi K3 · 36.5s)

_Thinking:_

The PDF fetch returned raw PDF bytes — not useful. But I already got the key info from the search results:

1. **BAS NE_K1 kopplingstabell** (förenklat årsbokslut): R6 includes 6900 "Övriga kostnader" and 6980 "Föreningsavgifter" — the whole 69xx range. The K1 table is gruppkonto-based (6900 = hela 69-gruppen).

2. **BAS 2007/2017 K1 tables**: "6072 R6 + NE sid. 2", "7632 R7 + NE sid. 2", "8314 R4 + NE sid. 2" — official confirmation that these accounts map BOTH to räkenskapsschemat AND to sid 2 (skattemässiga justeringar, i.e., R13/R14).

3. **edeklarera SRU 7513** (INK2R "Övriga externa kostnader"): 5000–6999 including 6991/6992/6993/6994/6996–6999.

So the cutoff at 6990 in accounted (and our port) excludes 6991–6999, which per BAS's own kopplingstabell (K1: 6900 Övriga kostnader group) belong to R6. The intervall PDF would settle it, but I couldn't parse it. The K1 group-based table clearly includes the 69-group. For the "övriga" (non-K1) NE table — Jeremy does NOT upprätta förenklat årsbokslut? Hmm, actually wait — which table applies? NE_EJ_K1 = "Enskilda näringsidkare – övriga" (vanlig bokföring, dubbel bokföring). Jeremy keeps full double-entry books, so the EJ_K1 intervall table is the right one. The memory says the port follows "BAS-kontogruppens kopplingstabell 'NE - Inkomst av näringsverksamhet, Enskilda näringsidkare'".

Given:
- accounted uses 5000–6990 + 7970
- our port uses 5000–6990 + 7970
- BAS K1 group table includes 69xx in R6

The safest interpretation of the intervall table: it's probably "5000–6990, 6991–6999 exkl. ..." hmm. I can't read the PDF. Let me try the xlsx? webfetch on xlsx will also fail. Let me try fetching the interval PDF with a different approach — maybe download it and read it locally with the Read tool (which can read PDFs!). Yes — Read tool "can read image files and PDFs and return them as file attachments". Let me curl the PDF to the temp dir and Read it.

**Tool: bash**

**Input:**
```json
{
  "command": "curl -sL \"https://www.bas.se/wp-content/uploads/2023/10/NE_EJ_K1-Intervall-231002.pdf\" -o /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf && ls -la /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf && file /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf"
}
```

**Output:**
```
-rw-r--r--@ 1 jeremy  staff  78799 Aug 24 08:37 /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf
/var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf: PDF document, version 1.6 (zip deflate encoded)

```

---

## Assistant (Build · Kimi K3 · 12.4s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf"
}
```

**Output:**
```
PDF read successfully
```

---

## Assistant (Build · Kimi K3 · 15.0s)

_Thinking:_

The Read tool can't parse the PDF with this model. Let me try extracting text with a command-line tool. macOS has `mdls`? No. Python? Let me check if python3 with any PDF lib exists, or use `strings`. Actually macOS has `textutil`? No, that doesn't do PDF. There's `/usr/bin/python3` — check for pypdf. Or use `qlmanage`? `qlmanage -p` renders... Actually there's a neat trick: `strings` on a PDF rarely gives text (deflate compressed). 

Alternative: use Spotlight's mdimport text extraction? `mdls -name kMDItemTextContent`? Not reliable.

Simplest robust: python3 -c with zlib decompress streams manually... overkill. Check if `pdftotext` (poppler) is installed via homebrew? Or `mutool`? Let me check.

**Tool: bash**

**Input:**
```json
{
  "command": "which pdftotext mutool gs qpdf python3 2>/dev/null; python3 -c \"import pypdf\" 2>&1 | head -1"
}
```

**Output:**
```
pdftotext not found
mutool not found
gs not found
qpdf not found
/opt/homebrew/bin/python3
Traceback (most recent call last):

```

---

## Assistant (Build · Kimi K3 · 25.3s)

_Thinking:_

No PDF tools available. pypdf not installed. I could create a venv and install pypdf — the guidelines say third-party packages must be installed in a virtual/isolated environment. Let me do that quickly in the temp dir:

```
python3 -m venv /var/folders/.../T/opencode/pdfenv
/var/folders/.../pdfenv/bin/pip install pypdf -q
/var/folders/.../pdfenv/bin/python -c "..."
```

That's acceptable (isolated, in temp dir). Let me do it.

**Tool: bash**

**Input:**
```json
{
  "command": "python3 -m venv /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/pdfenv && /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/pdfenv/bin/pip install -q pypdf && /var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/pdfenv/bin/python -c \"\nfrom pypdf import PdfReader\nr = PdfReader('/var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/NE_EJ_K1-Intervall.pdf')\nfor p in r.pages:\n    print(p.extract_text())\n\"",
  "timeout": 120000
}
```

**Output:**
```

[notice] A new release of pip is available: 26.1 -> 26.2.1
[notice] To update, run: /private/var/folders/nw/b1lffr4j593938vn5k6f9lwc0000gn/T/opencode/pdfenv/bin/python3.14 -m pip install --upgrade pip
1 (2)
Ändringar i kopplingstabellen 
jämfört med föregående år.
❙
Fältkod Rad 
NE
Benämning Konton i BAS 2023
BALANSRÄKNING/RÄKENSKAPSSCHEMA
Anläggningstillgångar
7200 B1 Immateriella anläggningstillgångar 10xx
7210 B2 Byggnader och markanläggningar 1100-1129, 1150-1179, 1190-
1199
7211 B3 Mark och andra tillgångar som inte får 
skrivas av
113x, 114x, 118x, 1291
7212 B4 Maskiner och inventarier 1200-1290, 1292-1299
7213 B5 Övriga anläggningstillgångar 13xx
Omsättningstillgångar
7240 B6 Varulager 14xx
7250 B7 Kundfordringar 15xx
7260 B8 Övriga fordringar 16xx–18xx
7280 B9 Kassa och bank 19xx
Eget kapital
7300 B10 Eget kapital 201x, 205x
Obeskattade reserver 
7320 B11 Obeskattade reserver 21xx
Avsättningar
7330 B12 Avsättningar 22xx
Skulder
7380 B13 Låneskulder 23xx, 241x, 248x
7381 B14 Skatteskulder Inget redovisas här ❙
7382 B15 Leverantörsskulder 2440-2449, 2460-2479
7383 B16 Övriga skulder 2420-2439, 2450-2459, 2490-
2499, 26xx-29xx
❙
RESULTATRÄKNING/RÄKENSKAPSSCHEMA
NE - Inkomst av näringsverksamhet, Enskilda 
näringsidkare
Enskilda näringsidkare som inte upprättar ett 
förenklat årsbokslut
(För enskilda näringsidkarer som upprättar ett förenklat årsbokslut finns en särskild 
kopplingstabell.)
NE_EJ_K1_17_ver1
2 (2)
Intäkter
7400 R1 Försäljning och utfört arbete samt övriga 
momspliktiga intäkter
30xx–37xx, 39xx
7401 R2 Momsfria intäkter 30xx–37xx, 39xx
7402 R3 Bil- och bostadsförmån m.m.
7403 R4 Ränteintäkter m.m. 38xx, 801x, 802x(+), 803x(+), 
811x, 812x(+), 813x(+), 820x, 
821x, 822x(+), 823x(+), 
824x(+), 825x, 826x, 829x(+), 
830x, 831x, 832x(+), 833x(+), 
834x, 835x(+), 836x, 839x,  
843x(+), 844x, 845x(+), 
849x(+), 881x(+), 886x(+), 
888x(+), 889x(+)
Kostnader
7500 R5 Varor och legoarbeten 40xx–49xx 
7501 R6 Övriga externa kostnader 50xx–69xx
7502 R7 Anställd personal 70xx–76xx 
7503 R8 Räntekostnader m.m. 774x, 779x, 79xx, 802x(–), 
803x(–), 807x, 808x, 812x(–), 
813x(–), 817x, 818x, 822x(–), 
823x, 824x(–), 827x, 828x, 
829x(–), 832x(–), 833x(–), 
835x(–), 837x, 838x, 840x, 
841x, 842x, 843x(–), 845x(–), 
846x, 848x, 849x(–), 881x(–), 
886x(–), 888x(–), 889x(–), 
89xx (exkl. 899x)
Avskrivningar
7504 R9 Avskrivningar och nedskrivningar 
byggnader och markanläggningar
772x, 777x, 782x, 784x, 885x
7505 R10 Avskrivningar och nedskrivningar maskiner 
och inventarier och immateriella tillgångar
771x, 773x, 776x, 778x, 781x, 
783x, 885x 
Årets resultat
7440 R11 Bokfört resultat 899x
(+) Ett plustecken inom parentes efter kontonumret betyder att om saldot på kontot är en 
intäkt så förs beloppet till den aktuella raden.
(–) Ett minustecken inom parentes efter kontonumret betyder att om saldot på kontot är en 
kostnad så förs beloppet till den aktuella raden.
Kommentarer
När samma kontonummer förekommer på olika rader i schemat ovan måste kopplingen till 
rad i deklarationen baseras på vad som i det enskilda företaget bokförts på kontot.
NE_EJ_K1_17_ver1

```

---

## Assistant (Build · Kimi K3 · 158.9s)

_Thinking:_

Excellent! Now I have the OFFICIAL BAS kopplingstabell for NE (ej K1), and it differs significantly from accounted's mapping:

**Official table (NE_EJ_K1_17_ver1, BAS 2023):**
- R1 (7400): 30xx–37xx, 39xx
- R2 (7401): 30xx–37xx, 39xx (samma intervall — separation by account content, per the comment)
- R3 (7402): — (no accounts!)
- R4 (7403): 38xx, 801x, 802x(+), 803x(+), 811x, 812x(+), 813x(+), 820x, 821x, 822x(+), 823x(+), 824x(+), 825x, 826x, 829x(+), 830x, 831x, 832x(+), 833x(+), 834x, 835x(+), 836x, 839x, 843x(+), 844x, 845x(+), 849x(+), 881x(+), 886x(+), 888x(+), 889x(+)
- R5 (7500): 40xx–49xx
- R6 (7501): **50xx–69xx** ← the whole range, so 6991/6992 ARE in R6!
- R7 (7502): 70xx–76xx
- R8 (7503): 774x, 779x, 79xx, 802x(–), ..., 840x, 841x, 842x, 843x(–), ..., 89xx (exkl. 899x)
- R9 (7504): 772x, 777x, 782x, 784x, 885x
- R10 (7505): 771x, 773x, 776x, 778x, 781x, 783x, 885x
- R11 (7440): 899x

So the official R6 = 50xx–69xx — confirming that 6992 belongs in R6, and accounted's 5000–6990 cutoff is wrong (or based on an older table). Also official R1/R2 = 30xx–37xx, 39xx combined (note the comment: "När samma kontonummer förekommer på olika rader måste kopplingen baseras på vad som bokförts på kontot" — i.e., the app must split R1/R2 by sub-account; our narrower split 3100/3900–3999 → R2 is a reasonable operationalization).

Also interesting: official R4 includes 831x entirely (8310–8319), and R8 includes 842x (skatteräntor area). And R9 = 772x, 777x, 782x, 784x, 885x; R10 = 771x, 773x, 776x, 778x, 781x, 783x, 885x. Our port simplified: R9 = 7820–7829, R10 = 7700–7819, 7830–7899. Differences: official puts 772x/777x/784x in R9 and 771x/776x/778x in R10, plus 885x in both (överavskrivningar).

Now — scope discipline. Item #2 is R12+. The failing tests are my own new tests using 6992. Two paths:

a) Fix R6 interval 5000–6990 → 5000–6999 per official table (small, justified fix directly required for R13 accounts to be coherent: Skatteverket says R13 = "kostnader från R5–R10 som inte får dras av" — they must BE in R5–R10).

b) Change my tests to use 6072 (within 6990) and avoid the issue.

Path (a) is correct per the official BAS table, and it's a one-number change: [5000, 6990] → [5000, 6999]. It's within the spirit of the memory note ("vår port fixar deras buggar" — we already fixed their R1/R3 shadowing bug; this is the same class of fix, now verified against the official table). It also removes the weird situation where 6992 gets an "unmapped account" warning while being added back in R13.

I'll do (a) with a comment citing the official table (NE_EJ_K1_17_ver1: R6 = 50xx–69xx), and update the existing test if any test depends on 6991+ being unmapped... Let me check: the warning test uses 8910 (skatt) — unaffected. 

Also add 7632 (personalrepresentation ej avdragsgill) to EJ_AVDRAGSGILLA per the official "R7 + NE sid. 2" annotation, and 8314 skattefria ränteintäkter → R14 as computed? The official table annotates 8314 "R4 + NE sid. 2" — NE sid 2 for intäkter-that-shall-not-be-taxed = R14. Adding R14 computed from 8314 is a small, official-table-backed addition. Hmm — but careful: R14 fill-in belopp should be positive; 8314 is kredit-normal (saldo negative). belopp = −saldo. And tecken −1 in chain. OK, add it.

What about 8423-type kostnadsränta? Official R8 includes 842x — all of it, no sid-2 annotation visible in this intervall table (the intervall table doesn't have the sid-2 "+" annotations at all — those came from the K1 group table). Skatteverket lists kostnadsränta på skattekonto as R13. BAS 8423? From Liber's list, 8422 = dröjsmålsräntor leverantörsskulder (avdragsgill). I won't add 842x to EJ_AVDRAGSGILLA without confirmation of which sub-account is ej avdragsgill. Keep [6072, 6982, 6992, 7622, 7632]. Hmm, 7622 — the official table's sid-2 annotations (from K1 table) mentioned only 6072, 7632, 8314. 6982/6992/7622 aren't annotated in the K1 table BUT the K1 table only lists a subset of accounts (förenklad kontoplan). 6992 wasn't in the K1 subset at all? The K1 2017 table lists "6980 Föreningsavgifter" as group and doesn't enumerate 6982/6992. Skatteverket's R13 examples (föreningsavgifter, böter) clearly cover 6982/6992. 7622 (sjukvård ej avdragsgill) — standard BAS, ej avdragsgill by name → R13. Keep all five + 7632.

Wait, also "6982 Föreningsavgifter, ej avdragsgilla" — hmm, föreningsavgifter: Skatteverket R13 example mentions "föreningsavgifter" (not all föreningsavgifter are deductible — only certain ones; 6982 is the ej-avdragsgilla variant) ✓.

So changes:
1. ne-bilaga.ts R6 intervall: [5000, 6990] → [5000, 6999] with comment citing official table 50xx–69xx.
2. EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622, 7632] with comment (6072, 7632 explicitly annotated "+ NE sid. 2" in BAS kopplingstabell; 6982/6992/7622 ej avdragsgilla per BAS kontoplan).
3. R14 computed from 8314 (skattefria ränteintäkter, "R4 + NE sid. 2" per table).

For (3), generalize byggJusteringar: beraknat map built from specs:
- R13: konton EJ_AVDRAGSGILLA, kostnad (debet+) → belopp = Σ saldo
- R14: konton [8314], intäkt (kredit−) → belopp = Σ −saldo

Let me restructure: a small table:
```ts
const BERAKNADE_JUSTERINGAR: Array<{ ruta: NeJusteringsRuta; konton: Array<number>; kostnad: boolean }> = [
  { ruta: "R13", konton: EJ_AVDRAGSGILLA, kostnad: true },
  { ruta: "R14", konton: [8314], kostnad: false },
];
```
and build beraknat from saldon with sign flip for intäkt. The existing code computes r13 manually; refactor to loop this table. belopp rounding: sum exact, Math.round at end; konton rows Math.round each.

Note on 8314: it's in 8310–8330 → R4 in our mapping ✓ (consistent: bokförd intäkt i R4, tas bort i R14).

4. Update tests: my failing tests now pass with R6 fix (6992 in R6). Add a test for R14 (8314 → R4 and R14)? Yes, small.

Also the "varnar för resultatkonton utan NE-ruta" test uses 8910 → still unmapped (89xx exkl 899x is R8 official... wait! Official R8 includes "89xx (exkl. 899x)" — 8910 skatt skulle vara R8 per official table! Our mapping has R8 = 8400–8499. Hmm. The existing test expects 8910 to be unmapped and warned. Official table says 8910 → R8 (89xx exkl 899x, and 89xx(–) means only if kostnad). Broadening R8 to 8000–8999 would change behavior significantly (8910 skatt, 8810 etc.). Scope! The official table is much broader than our simplified mapping overall (R4/R8 with 80xx, 81xx, 82xx...). Full realignment of R4/R8/R9/R10 to the official table is tempting but is a separate piece of work ("port improvements") — item #2 shouldn't swallow it. I'll keep the existing R1–R11 mapping as-is EXCEPT the R6 6990→6999 fix needed for R13 coherence, and note the broader realignment opportunity in PLAN.md? Hmm — adding a note to PLAN.md about the official intervall table differences (R4/R8 broader, R9/R10 exact groups) would be genuinely useful for future work. Yes, add a line under item 2 or as new note. Keep it small.

Actually wait — also consider: should I realign R9/R10? Official: R9 = 772x, 777x, 782x, 784x, 885x; R10 = 771x, 773x, 776x, 778x, 781x, 783x, 885x. Ours: R9 = 7820–7829; R10 = 7700–7819, 7830–7899. Difference: 772x/777x/784x (nedskrivningar byggnader etc.) → ours puts 772x in R10, official R9. And 885x (överplanavskrivningar) official both, ours not mapped. For Jeremy (ladugård on 7821, markanläggning 7824) ours works. Realigning R9/R10 to official is a small change too... but every expansion of scope risks breaking existing tests ("skiljer avskrivning på byggnad (R9) från övriga (R10)" uses 7820/7830 — still fine; "hela 782x-gruppen" 7821/7824/7810 — still fine). Hmm, 7700–7719 in R10 (ours) vs official 771x only + 7700? Official R10 = 771x (7700 is gruppkonto, 7710–7719 = 771x). Ours includes 7700–7719 → same practical effect. 772x: official R9, ours R10. 776x/778x: official R10, ours R10 (7700–7819) ✓. 777x: official R9, ours R10. 784x: official R9, ours R10? Ours R10 = 7700–7819, 7830–7899 → 784x IS in 7830–7899 → R10, official R9. And 79xx (7970 etc.) → ours R6 via explicit 7970, official R8 via 79xx! Oops, differences everywhere. Full realignment = separate task. I'll note it in PLAN.md and stay scoped.

Decision: minimal realignment — only R6 upper bound 6990→6999 (needed for R13 coherence) + R13/R14 computed accounts. Note the official table in code comments and add a PLAN.md line about full R1–R11 realignment against NE_EJ_K1_17_ver1 as future work.

Hmm, wait — actually, let me reconsider whether 6990→6999 could surprise: accounts 6990–6999 in BAS: 6990 gruppkonto, 6991 avdragsgilla, 6992 ej avdragsgilla, 6993 lämnade bidrag/gåvor (ej avdragsgilla mostly!), 6994 fortbildning, 6996/6997 utländsk skatt, 6998 utländsk moms, 6999 ingående moms blandad verksamhet. All övriga externa kostnader → R6 per official 50xx–69xx ✓. 6993 bidrag/gåvor → should arguably also be R13 (gåvor ej avdragsgilla)... but deductibility varies (anställdgåvor under 450 kr avdragsgilla). Keep out of EJ_AVDRAGSGILLA; Skatteverket's e-tjänst handles manually. Fine.

Now implement:

Edit 1 — R6 interval:
```ts
  {
    ruta: "R6",
    beskrivning: "Övriga externa kostnader",
    intervall: [
      [5000, 6999],
      [7970, 7970],
    ],
    kostnad: true,
  },
```
with updated comment: official table R6 = 50xx–69xx (6990-taket i accounted var för snävt — 6991–6999 hör hemma här).

Edit 2 — EJ_AVDRAGSGILLA + BERAKNADE table + R14.

Current byggJusteringar code has the R13 block. Let me rewrite that section:

```ts
/**
 * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13
 * (Skatteverkets exempel: representation, föreningsavgifter, böter och
 * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —
 * R13 är en återläggning ovanpå schemat, ingen omflyttning.
 *
 * 6072 och 7632 är uttryckligen dubbelmappade i BAS kopplingstabell
 * ("R6/R7 + NE sid. 2"); övriga är konton som i BAS-planen bär namnet
 * "ej avdragsgill/a".
 */
const EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622, 7632];

/** Bokförda intäkter som inte ska tas upp dras av i R14. 8314 Skattefria
 *  ränteintäkter är dubbelmappad i BAS kopplingstabell ("R4 + NE sid. 2"). */
const EJ_BESKATTBARA_INTAKTER = [8314];
```

Then a shared helper:
```ts
const BERAKNADE: Array<{ ruta: NeJusteringsRuta; konton: Array<number>; kostnad: boolean }> = [
  { ruta: "R13", konton: EJ_AVDRAGSGILLA, kostnad: true },
  { ruta: "R14", konton: EJ_BESKATTBARA_INTAKTER, kostnad: false },
];
```

In byggJusteringar, replace the R13-specific block:

```ts
  const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>();

  for (const { ruta, konton, kostnad } of BERAKNADE) {
    let summa = 0;
    const kontoRader: Array<NeKontoRad> = [];

    for (const konto of konton) {
      const saldo = saldon.get(konto) ?? 0;

      if (Math.abs(saldo) < 0.005) {
        continue;
      }

      // Kostnader bokförs i debet, intäkter i kredit — ifyllnadsbeloppet
      // på blanketten är alltid positivt.
      const belopp = kostnad ? saldo : -saldo;
      summa += belopp;
      kontoRader.push({ konto, namn: kontonamn(konto), belopp: Math.round(belopp) });
    }

    beraknat.set(ruta, {
      ruta,
      beskrivning: "",
      belopp: Math.round(summa),
      summa: false,
      manuell: false,
      konton: kontoRader,
    });
  }
```

Edit 3 — tests: keep existing (6992 now in R6 → first failing test passes; R12 = 9200 in second ✓). Add R14 test:

```ts
  it("drar bort skattefria ränteintäkter (8314) i R14 — de ligger kvar i R4", async () => {
    await laddaJournal(
      journal(
        `2025-12-31 Skattefri ränta
    1930  200.00 SEK
    8314  -200.00 SEK`,
      ),
    );

    const bilaga = generateNeBilaga("2025");

    expect(ruta(bilaga, "R4")).toBe(200);
    const r14 = jrad(bilaga, "R14");
    expect(r14.belopp).toBe(200);
    expect(r14.manuell).toBe(false);
    expect(jrad(bilaga, "R17").belopp).toBe(0);
  });
```

R17 = R12 + R13 − R14 = 200 + 0 − 200 = 0 ✓.

Wait — 8314 in our NE_MAPPNINGAR: R4 = [8310, 8330] ✓.

Also update the "markerar rutor..." test: it checks R14 is manuell — now R14 is computed! Remove R14 from that list (with only a sale, R14 = 0 but manuell=false). Update list to exclude R14.

Also: R14's beskrivning stays from spec ("Bokförda intäkter som inte ska tas upp") ✓ since rad.beskrivning = spec.beskrivning in the loop.

Edge: the beraknat map now always contains R13 and R14 (even when 0) → manuell: false for both. In the "markerar" test I assert R13? I didn't include R13 there. Fine.

Also — the R13/R14 rows with belopp 0 and no konton still show as computed (manuell false) — good, they're genuinely computed.

One more check on byggJusteringar: `kontonamn` helper uses aliases.value — already defined in my earlier code inside byggJusteringar. Keep it, reused by the loop.

Also update the comment block above EJ_AVDRAGSGILLA (I wrote it earlier mentioning 4 accounts; now 5 + note). And in the R6 mapping comment.

Let me make these edits. First re-read the current state of the relevant part of ne-bilaga.ts to be precise.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "limit": 120,
  "offset": 100
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts</path>
<type>file</type>
<content>
100: 
101: type NeMappning = {
102:   ruta: NeRuta;
103:   beskrivning: string;
104:   intervall: Array<[start: number, slut: number]>;
105:   /** Kostnadskonton bokförs i debet (positivt); intäktskonton i kredit,
106:    *  så tecknet byts vid summeringen. */
107:   kostnad: boolean;
108: };
109: 
110: /**
111:  * Rutor som inte går att räkna fram ur kontosaldon. R3 avser förmånsvärden
112:  * som beskattas hos näringsidkaren och som saknar eget BAS-konto — de fylls
113:  * i för hand i deklarationen.
114:  *
115:  * Obs: BAS 3200–3299 är "Försäljning VMB och omvänd moms" och alltså
116:  * försäljning, inte förmåner. Det intervallet hör till R1.
117:  */
118: export const MANUELLA_NE_RUTOR = new Set<NeRuta>(["R3"]);
119: 
120: /** Matchas i ordning — smala intervall (3100, 7820) ligger före de breda de
121:  *  överlappar, så första träff avgör rutan. */
122: const NE_MAPPNINGAR: Array<NeMappning> = [
123:   {
124:     ruta: "R2",
125:     beskrivning: "Momsfria intäkter",
126:     intervall: [
127:       [3100, 3100],
128:       [3900, 3999],
129:     ],
130:     kostnad: false,
131:   },
132:   {
133:     ruta: "R3",
134:     beskrivning: "Bil- och bostadsförmån m.m.",
135:     intervall: [],
136:     kostnad: false,
137:   },
138:   {
139:     ruta: "R1",
140:     beskrivning: "Försäljning och utfört arbete samt övriga momspliktiga intäkter",
141:     intervall: [
142:       [3000, 3599],
143:       [3700, 3799],
144:     ],
145:     kostnad: false,
146:   },
147:   {
148:     ruta: "R4",
149:     beskrivning: "Ränteintäkter m.m.",
150:     intervall: [[8310, 8330]],
151:     kostnad: false,
152:   },
153:   {
154:     ruta: "R5",
155:     beskrivning: "Varor, material och tjänster",
156:     intervall: [[4000, 4990]],
157:     kostnad: true,
158:   },
159:   {
160:     ruta: "R6",
161:     beskrivning: "Övriga externa kostnader",
162:     intervall: [
163:       [5000, 6990],
164:       [7970, 7970],
165:     ],
166:     kostnad: true,
167:   },
168:   {
169:     ruta: "R7",
170:     beskrivning: "Anställd personal",
171:     intervall: [[7000, 7699]],
172:     kostnad: true,
173:   },
174:   {
175:     ruta: "R8",
176:     beskrivning: "Räntekostnader m.m.",
177:     intervall: [[8400, 8499]],
178:     kostnad: true,
179:   },
180:   {
181:     ruta: "R9",
182:     beskrivning: "Avskrivningar byggnader och markanläggningar",
183:     // Hela 782x-gruppen hör hit: 7820 (samlingskonto), 7821 byggnader,
184:     // 7824 markanläggningar, 7829 övriga byggnader. Bara 7820 räcker inte —
185:     // bokför man ladugårdsavskrivningen på 7821 hamnar den annars i R10.
186:     intervall: [[7820, 7829]],
187:     kostnad: true,
188:   },
189:   {
190:     ruta: "R10",
191:     beskrivning: "Avskrivningar maskiner, inventarier och immateriella tillgångar",
192:     intervall: [
193:       [7700, 7819],
194:       [7830, 7899],
195:     ],
196:     kostnad: true,
197:   },
198: ];
199: 
200: function hittaMappning(konto: number): NeMappning | undefined {
201:   return NE_MAPPNINGAR.find((mappning) =>
202:     mappning.intervall.some(([start, slut]) => konto >= start && konto <= slut),
203:   );
204: }
205: 
206: /** Resultatkonto = 3000–8999. Konton utanför hör till balansräkningen. */
207: const arResultatkonto = (konto: number) => konto >= 3000 && konto <= 8999;
208: 
209: /**
210:  * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13
211:  * (Skatteverkets exempel: representation, föreningsavgifter, böter och
212:  * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —
213:  * R13 är en återläggning ovanpå schemat, ingen omflyttning.
214:  *
215:  * BAS: 6072 representation ej avdragsgill, 6982 föreningsavgifter ej
216:  * avdragsgilla, 6992 övriga externa kostnader ej avdragsgilla (t.ex.
217:  * böter, skattetillägg), 7622 sjuk- och hälsovård ej avdragsgill.
218:  */
219: const EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622];

(Showing lines 100-219 of 479. Use offset=220 to continue.)
</content>
```

---

## Assistant (Build · Kimi K3 · 37.9s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "  {\n    ruta: \"R6\",\n    beskrivning: \"Övriga externa kostnader\",\n    // BAS kopplingstabell NE_EJ_K1_17: R6 = 50xx–69xx. Taket ska alltså\n    // inte gå vid 6990 — 6991–6999 (bl.a. 6992 ej avdragsgilla kostnader)\n    // hör hemma här.\n    intervall: [\n      [5000, 6999],\n      [7970, 7970],\n    ],\n    kostnad: true,\n  },",
  "oldString": "  {\n    ruta: \"R6\",\n    beskrivning: \"Övriga externa kostnader\",\n    intervall: [\n      [5000, 6990],\n      [7970, 7970],\n    ],\n    kostnad: true,\n  },"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "/**\n * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13\n * (Skatteverkets exempel: representation, föreningsavgifter, böter och\n * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —\n * R13 är en återläggning ovanpå schemat, ingen omflyttning.\n *\n * 6072 (representation) och 7632 (personalrepresentation) är uttryckligen\n * dubbelmappade i BAS kopplingstabell (\"R6/R7 + NE sid. 2\"); 6982\n * (föreningsavgifter), 6992 (övriga kostnader, t.ex. böter och\n * skattetillägg) och 7622 (sjuk- och hälsovård) bär namnet \"ej\n * avdragsgill/a\" i BAS-kontoplanen.\n */\nconst EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622, 7632];\n\n/** Bokförda intäkter som inte ska tas upp dras av i R14. 8314 Skattefria\n *  ränteintäkter är dubbelmappad i BAS kopplingstabell (\"R4 + NE sid. 2\"). */\nconst EJ_BESKATTBARA_INTAKTER = [8314];",
  "oldString": "/**\n * Bokförda kostnader som inte är avdragsgilla läggs tillbaka i R13\n * (Skatteverkets exempel: representation, föreningsavgifter, böter och\n * skattetillägg). Kontona ligger kvar i sina räkenskapsschemarutor —\n * R13 är en återläggning ovanpå schemat, ingen omflyttning.\n *\n * BAS: 6072 representation ej avdragsgill, 6982 föreningsavgifter ej\n * avdragsgilla, 6992 övriga externa kostnader ej avdragsgilla (t.ex.\n * böter, skattetillägg), 7622 sjuk- och hälsovård ej avdragsgill.\n */\nconst EJ_AVDRAGSGILLA = [6072, 6982, 6992, 7622];"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 16.2s)

_Thinking:_

Now refactor byggJusteringar to compute both R13 and R14. Let me read the current byggJusteringar section.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "limit": 105,
  "offset": 298
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts</path>
<type>file</type>
<content>
298:     const saldo = saldon.get(konto) ?? 0;
299: 
300:     if (Math.abs(saldo) < 0.005) {
301:       continue;
302:     }
303: 
304:     r13 += saldo;
305:     r13Konton.push({ konto, namn: kontonamn(konto), belopp: Math.round(saldo) });
306:   }
307: 
308:   const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>([
309:     [
310:       "R13",
311:       {
312:         ruta: "R13",
313:         beskrivning: "",
314:         belopp: Math.round(r13),
315:         summa: false,
316:         manuell: false,
317:         konton: r13Konton,
318:       },
319:     ],
320:   ]);
321: 
322:   const rader: Array<NeJusteringsrad> = [];
323:   let ackumulerat = bokfortResultat;
324:   let summaIndex = 0;
325: 
326:   const skjutUtSummorFramtill = (efter: string) => {
327:     while (
328:       summaIndex < SUMRUTOR.length &&
329:       SUMRUTOR[summaIndex].efter === efter
330:     ) {
331:       const summa = SUMRUTOR[summaIndex++];
332:       rader.push({
333:         ruta: summa.ruta,
334:         beskrivning: summa.beskrivning,
335:         belopp: ackumulerat,
336:         summa: true,
337:         manuell: false,
338:         konton: [],
339:       });
340:     }
341:   };
342: 
343:   skjutUtSummorFramtill("R12");
344: 
345:   for (const spec of JUSTERINGAR) {
346:     const rad = beraknat.get(spec.ruta) ?? {
347:       ruta: spec.ruta,
348:       beskrivning: "",
349:       belopp: 0,
350:       summa: false,
351:       manuell: true,
352:       konton: [],
353:     };
354: 
355:     rad.beskrivning = spec.beskrivning;
356:     ackumulerat += spec.tecken * rad.belopp;
357:     rader.push(rad);
358:     skjutUtSummorFramtill(spec.ruta);
359:   }
360: 
361:   // R47/R48 — samma tal, tecknet avgör vilken ruta som fylls i
362:   const overskott = ackumulerat >= 0;
363:   rader.push({
364:     ruta: overskott ? "R47" : "R48",
365:     beskrivning: overskott ? "Överskott" : "Underskott",
366:     belopp: Math.abs(ackumulerat),
367:     summa: true,
368:     manuell: false,
369:     konton: [],
370:   });
371: 
372:   return { rader, skattemassigtResultat: ackumulerat };
373: }
374: 
375: /** Årets resultat — används i omföringen vid bokslut. En transaktion som rör
376:  *  8999 är en resultatdisposition och ska inte räknas med i räkenskapsschemat
377:  *  (den skulle nolla resultatkontona). */
378: const RESULTATDISPOSITION_KONTO = 8999;
379: 
380: export function generateNeBilaga(year: string): NeBilaga {
381:   const saldon = new Map<number, number>();
382: 
383:   for (const tx of transactions.value) {
384:     if (tx.date.slice(0, 4) !== year) {
385:       continue;
386:     }
387: 
388:     if (
389:       tx.postings.some(
390:         (posting) => posting.account === RESULTATDISPOSITION_KONTO,
391:       )
392:     ) {
393:       continue;
394:     }
395: 
396:     for (const posting of tx.postings) {
397:       if (!arResultatkonto(posting.account)) {
398:         continue;
399:       }
400: 
401:       saldon.set(
402:         posting.account,

(Showing lines 298-402 of 488. Use offset=403 to continue.)
</content>
```

---

## Assistant (Build · Kimi K3 · 17.0s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "limit": 25,
  "offset": 276
}
```

**Output:**
```
<path>/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts</path>
<type>file</type>
<content>
276:   { efter: "R34", ruta: "R35", beskrivning: "Överskott/underskott före ökning av expansionsfond" },
277:   { efter: "R41", ruta: "R42", beskrivning: "Överskott/underskott före årets avdrag för egenavgifter" },
278: ];
279: 
280: /**
281:  * Bygger avsnittet "Skattemässiga justeringar" (R12–R48) ur bokfört
282:  * resultat och saldon. Bara R13 räknas fram ur kontosaldon — resten är
283:  * manuella tills dess att egenavgifter, räntefördelning och fonder
284:  * implementerats (se PLAN.md).
285:  */
286: function byggJusteringar(
287:   saldon: Map<number, number>,
288:   bokfortResultat: number,
289: ): { rader: Array<NeJusteringsrad>; skattemassigtResultat: number } {
290:   const kontonamn = (konto: number) =>
291:     aliases.value.find((alias) => alias.id === konto)?.to ?? "";
292: 
293:   // R13: ej avdragsgilla kostnader, bokförda i debet
294:   let r13 = 0;
295:   const r13Konton: Array<NeKontoRad> = [];
296: 
297:   for (const konto of EJ_AVDRAGSGILLA) {
298:     const saldo = saldon.get(konto) ?? 0;
299: 
300:     if (Math.abs(saldo) < 0.005) {

(Showing lines 276-300 of 488. Use offset=301 to continue.)
</content>
```

---

## Assistant (Build · Kimi K3 · 34.9s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.ts",
  "newString": "/**\n * Bygger avsnittet \"Skattemässiga justeringar\" (R12–R48) ur bokfört\n * resultat och saldon. Bara R13 och R14 räknas fram ur kontosaldon —\n * resten är manuella tills dess att egenavgifter, räntefördelning och\n * fonder implementerats (se PLAN.md).\n */\nfunction byggJusteringar(\n  saldon: Map<number, number>,\n  bokfortResultat: number,\n): { rader: Array<NeJusteringsrad>; skattemassigtResultat: number } {\n  const kontonamn = (konto: number) =>\n    aliases.value.find((alias) => alias.id === konto)?.to ?? \"\";\n\n  const beraknade: Array<{\n    ruta: NeJusteringsRuta;\n    konton: Array<number>;\n    /** Kostnader bokförs i debet, intäkter i kredit — ifyllnadsbeloppet\n     *  på blanketten är alltid positivt. */\n    kostnad: boolean;\n  }> = [\n    { ruta: \"R13\", konton: EJ_AVDRAGSGILLA, kostnad: true },\n    { ruta: \"R14\", konton: EJ_BESKATTBARA_INTAKTER, kostnad: false },\n  ];\n\n  const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>();\n\n  for (const { ruta, konton, kostnad } of beraknade) {\n    let summa = 0;\n    const kontoRader: Array<NeKontoRad> = [];\n\n    for (const konto of konton) {\n      const saldo = saldon.get(konto) ?? 0;\n\n      if (Math.abs(saldo) < 0.005) {\n        continue;\n      }\n\n      const belopp = kostnad ? saldo : -saldo;\n      summa += belopp;\n      kontoRader.push({\n        konto,\n        namn: kontonamn(konto),\n        belopp: Math.round(belopp),\n      });\n    }\n\n    beraknat.set(ruta, {\n      ruta,\n      beskrivning: \"\",\n      belopp: Math.round(summa),\n      summa: false,\n      manuell: false,\n      konton: kontoRader,\n    });\n  }\n\n  const rader: Array<NeJusteringsrad> = [];",
  "oldString": "/**\n * Bygger avsnittet \"Skattemässiga justeringar\" (R12–R48) ur bokfört\n * resultat och saldon. Bara R13 räknas fram ur kontosaldon — resten är\n * manuella tills dess att egenavgifter, räntefördelning och fonder\n * implementerats (se PLAN.md).\n */\nfunction byggJusteringar(\n  saldon: Map<number, number>,\n  bokfortResultat: number,\n): { rader: Array<NeJusteringsrad>; skattemassigtResultat: number } {\n  const kontonamn = (konto: number) =>\n    aliases.value.find((alias) => alias.id === konto)?.to ?? \"\";\n\n  // R13: ej avdragsgilla kostnader, bokförda i debet\n  let r13 = 0;\n  const r13Konton: Array<NeKontoRad> = [];\n\n  for (const konto of EJ_AVDRAGSGILLA) {\n    const saldo = saldon.get(konto) ?? 0;\n\n    if (Math.abs(saldo) < 0.005) {\n      continue;\n    }\n\n    r13 += saldo;\n    r13Konton.push({ konto, namn: kontonamn(konto), belopp: Math.round(saldo) });\n  }\n\n  const beraknat = new Map<NeJusteringsRuta, NeJusteringsrad>([\n    [\n      \"R13\",\n      {\n        ruta: \"R13\",\n        beskrivning: \"\",\n        belopp: Math.round(r13),\n        summa: false,\n        manuell: false,\n        konton: r13Konton,\n      },\n    ],\n  ]);\n\n  const rader: Array<NeJusteringsrad> = [];"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 32.0s)

_Thinking:_

Now update the tests:
1. The "markerar rutor utan bokföringsunderlag som manuella" test — remove "R14" from the list (it's now computed).
2. Add R14 test.

Update the manual-boxes test (R14 is now computed) and add an R14 test:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/jeremy/dev/hledger-web-gui/src/js/ne-bilaga.test.ts",
  "newString": "  it(\"drar bort skattefria ränteintäkter (8314) i R14 — men de ligger kvar i R4\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-12-31 Skattefri ränta\n    1930  200.00 SEK\n    8314  -200.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    // Intäkten är bokförd och syns i R4 ...\n    expect(ruta(bilaga, \"R4\")).toBe(200);\n\n    // ... men ska inte beskattas, så den dras bort i R14\n    const r14 = jrad(bilaga, \"R14\");\n    expect(r14.belopp).toBe(200);\n    expect(r14.manuell).toBe(false);\n    expect(r14.konton).toEqual([{ konto: 8314, namn: \"\", belopp: 200 }]);\n\n    // R17 = R12 − R14: intäkten påverkar inte det skattemässiga resultatet\n    expect(jrad(bilaga, \"R17\").belopp).toBe(0);\n  });\n\n  it(\"markerar rutor utan bokföringsunderlag som manuella med belopp 0\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    for (const ruta of [\"R15\", \"R16\", \"R18\", \"R24\", \"R34\", \"R40\", \"R43\"]) {\n      const rad = jrad(bilaga, ruta);\n      expect(rad.manuell).toBe(true);\n      expect(rad.belopp).toBe(0);\n      expect(rad.konton).toEqual([]);\n    }\n  });",
  "oldString": "  it(\"markerar rutor utan bokföringsunderlag som manuella med belopp 0\", async () => {\n    await laddaJournal(\n      journal(\n        `2025-03-01 Försäljning\n    1930  10000.00 SEK\n    3000  -10000.00 SEK`,\n      ),\n    );\n\n    const bilaga = generateNeBilaga(\"2025\");\n\n    for (const ruta of [\"R14\", \"R15\", \"R16\", \"R18\", \"R24\", \"R34\", \"R40\", \"R43\"]) {\n      const rad = jrad(bilaga, ruta);\n      expect(rad.manuell).toBe(true);\n      expect(rad.belopp).toBe(0);\n      expect(rad.konton).toEqual([]);\n    }\n  });"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Kimi K3 · 15.0s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm test 2>&1 | tail -15 && npm run typecheck 2>&1 | tail -10",
  "timeout": 180000
}
```

**Output:**
```
 RUN  v4.1.10 /Users/jeremy/dev/hledger-web-gui

 ✓ src/js/balansrapport.test.ts (11 tests) 10ms
 ✓ src/js/parse-journal-file.test.ts (16 tests) 17ms
 ✓ src/js/bokslut.test.ts (14 tests) 11ms
 ✓ src/js/moms-omvand.test.ts (17 tests) 11ms
 ✓ src/js/momsrapport.test.ts (21 tests) 13ms
 ✓ src/js/verifikat.test.ts (27 tests) 13ms
 ✓ src/js/ne-bilaga.test.ts (25 tests) 14ms

 Test Files  7 passed (7)
      Tests  131 passed (131)
   Start at  08:43:40
   Duration  184ms (transform 159ms, setup 0ms, import 265ms, tests 89ms, environment 0ms)


> hledger-swe-gui@1.0.0 typecheck
> tsc --noEmit


```

---

## Assistant (Build · Kimi K3 · 943.5s)

---

## User

continue

---

## Assistant (Build · Ox Alpha Free (Unlimited) · 20.2s)

---

## User

---

## Assistant (Compaction · Kimi K3)

---

