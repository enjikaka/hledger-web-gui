import { computed, effect, signal } from "@preact/signals-core";
import signalsDevtool from "signals-devtool-provider";
import type { Account, Alias, Transaction } from "./parse-journal-file";

export const transactions = signal<Array<Transaction>>([]);
export const accounts = signal<Array<Account>>([]);
export const aliases = signal<Array<Alias>>([]);

/** Råtexten före första transaktionen — bevaras ordagrant vid spara
 *  så att kommentarer och kontodefinitioner inte går förlorade. */
export const journalHeader = signal<string>("");

/** Filhandtag till öppnad journal (File System Access API). null = ingen fil
 *  eller webbläsare utan stöd (då används nedladdning som fallback). */
export const fileHandle = signal<FileSystemFileHandle | null>(null);

/** Namnet på öppnad fil, för visning och som nedladdningsnamn. */
export const fileName = signal<string>("");

/** Globalt valt år — styr transaktionslistan, momsrapporten m.fl. vyer. */
export const selectedYear = signal<string>(String(new Date().getFullYear()));

/** Alla år som förekommer i journalen, plus innevarande år. Senaste först. */
export const availableYears = computed(() => {
  const years = new Set(
    transactions.value.map((transaction) => transaction.date.slice(0, 4)),
  );
  years.add(String(new Date().getFullYear()));
  return [...years].sort().reverse();
});
export const hledgerOutput = computed(() => {
  const TWO_SPACES = "  ";
  const FOUR_SPACES = "    ";

  // Header från inläst fil bevaras ordagrant; utan fil genereras
  // konto-/aliasrader från signalerna.
  const header = journalHeader.value.trimEnd()
    ? journalHeader.value.trimEnd()
    : [
        accounts.value.map((account) => `account ${account.name}`).join("\n"),
        aliases.value.map((alias) => `alias ${alias.id} = ${alias.to}`).join("\n"),
      ]
        .filter(Boolean)
        .join("\n\n");

  const transactionsHledger = transactions.value
    .map((transaction) => {
      const postings = transaction.postings.map((posting) => {
        const amount = `${posting.amount.toFixed(2)} ${posting.currency}`.trimEnd();
        return `${FOUR_SPACES}${posting.account}${TWO_SPACES}${amount}`;
      });

      // Verifikationsnumret skrivs i hledgers kodfält, direkt efter datumet
      const kod = transaction.code ? `(${transaction.code}) ` : "";

      return `${transaction.date} ${kod}${transaction.description}\n${postings.join("\n")}`;
    })
    .join("\n\n");

  return `${[header, transactionsHledger].filter(Boolean).join("\n\n")}\n`;
});

const signals = {
  transactions,
  accounts,
  aliases,
  hledgerOutput,
  selectedYear,
  availableYears,
  journalHeader,
  fileName,
};

// Devtool-providern kopplar upp sig mot Chrome-tilläggets port via den globala
// `chrome`. Den saknas i Firefox, Safari och Node (testerna), och providerns
// `chrome?.runtime` skyddar bara mot att `runtime` fattas — inte mot att hela
// identifieraren är odeklarerad. Utan vakten kastar modulen redan vid import
// och tar hela appen med sig.
if ("chrome" in globalThis) {
  signalsDevtool.init({ signals, effect });
}
