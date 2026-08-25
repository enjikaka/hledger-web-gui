import { laddaExtraJournal } from "./journal-file";
import { parseJournalFile } from "./parse-journal-file";
import {
  accounts,
  aliases,
  deklarationVal,
  extraJournal,
  journalHeader,
  momsVy,
  transactions,
} from "./signals";

/**
 * Laddar en journal ur en sträng via den riktiga parsern och fyller signalerna,
 * precis som filuppladdningen gör. Testerna arbetar därmed mot samma väg in i
 * systemet som appen — journalfilen är enda input.
 */
export async function laddaJournal(text: string): Promise<void> {
  const file = new File([text], "test.journal", { type: "text/plain" });

  const nyaTransaktioner = [];
  const nyaKonton = [];
  const nyaAlias = [];
  let header = "";

  for await (const item of parseJournalFile(file)) {
    switch (item.type) {
      case "transaction":
        nyaTransaktioner.push(item.data);
        break;
      case "account":
        nyaKonton.push(item.data);
        break;
      case "alias":
        nyaAlias.push(item.data);
        break;
      case "header":
        header = item.data;
        break;
    }
  }

  transactions.value = nyaTransaktioner;
  accounts.value = nyaKonton;
  aliases.value = nyaAlias;
  journalHeader.value = header;
}

/** Laddar extrajournalen (andra verksamheten) via den riktiga inladdaren. */
export async function laddaExtraJournalFranText(
  text: string,
  namn = "extra.journal",
): Promise<void> {
  await laddaExtraJournal(new File([text], namn, { type: "text/plain" }));
}

export function rensaJournal(): void {
  transactions.value = [];
  accounts.value = [];
  aliases.value = [];
  journalHeader.value = "";
  deklarationVal.value = {};
  extraJournal.value = null;
  momsVy.value = "journal";
}

/** Kortform för en posting-rad i förväntningar: "konto belopp". */
export function radrader(postings: Array<{ account: number; amount: number }>) {
  return postings.map((posting) => `${posting.account} ${posting.amount}`);
}

/** Summan av alla belopp i ören — ska alltid vara 0 i ett balanserat verifikat. */
export function summaOre(postings: Array<{ amount: number }>): number {
  return postings.reduce(
    (summa, posting) => summa + Math.round(posting.amount * 100),
    0,
  );
}
