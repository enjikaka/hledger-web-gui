import { computed, effect, signal } from "@preact/signals-core";
import signalsDevtool from "signals-devtool-provider";
import type { Account, Alias, Transaction } from "./parse-journal-file";

export const transactions = signal<Array<Transaction>>([]);
export const accounts = signal<Array<Account>>([]);
export const aliases = signal<Array<Alias>>([]);
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
        return `${FOUR_SPACES}${posting.account}${TWO_SPACES}${posting.amount}`;
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
};

signalsDevtool.init({ signals, effect });
