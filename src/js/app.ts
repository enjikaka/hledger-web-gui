import "./app-router.ts";

import { parseJournalFile } from "./parse-journal-file.ts";
import * as Signals from "./signals.ts";

// File upload handling
document
  .getElementById("journalFile")
  ?.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      for await (const item of parseJournalFile(file)) {
        switch (item.type) {
          case "account":
            Signals.accounts.value = [...Signals.accounts.value, item.data];
            break;
          case "alias":
            Signals.aliases.value = [...Signals.aliases.value, item.data];
            break;
          case "transaction":
            Signals.transactions.value = [
              ...Signals.transactions.value,
              item.data,
            ];
            break;
        }
      }
    }
  });
