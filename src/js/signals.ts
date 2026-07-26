import { computed, effect, signal } from "@preact/signals-core";
import signalsDevtool from "signals-devtool-provider";
import type { Account, Alias, Transaction } from "./parse-journal-file";

export const transactions = signal<Array<Transaction>>([]);
export const accounts = signal<Array<Account>>([]);
export const aliases = signal<Array<Alias>>([]);

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

  const accountsHledger = accounts.value
    .map((account) => {
      return `account ${account.name}`;
    })
    .join("\n");

  const aliasesHledger = aliases.value
    .map((alias) => {
      return `alias ${alias.id} = ${alias.to}`;
    })
    .join("\n");

  const transactionsHledger = transactions.value
    .map((transaction) => {
      const postings = transaction.postings.map((posting) => {
        const amount = `${posting.amount.toFixed(2)} ${posting.currency}`.trimEnd();
        return `${FOUR_SPACES}${posting.account}${TWO_SPACES}${amount}`;
      });

      return `${transaction.date} ${transaction.description}\n${postings.join("\n")}`;
    })
    .join("\n\n");

  return `${accountsHledger}\n\n${aliasesHledger}\n\n${transactionsHledger}`;
});

const signals = {
  transactions,
  accounts,
  aliases,
  hledgerOutput,
  selectedYear,
  availableYears,
};

signalsDevtool.init({ signals, effect });
