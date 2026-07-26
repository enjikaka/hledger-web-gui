import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import type { Transaction } from "../parse-journal-file";
import { selectedYear, transactions } from "../signals";

import './transaction-row';

const html = String.raw;

class TransactionsList extends Component {
  componentDidMount() {
    effect(() => {
      this.updateList(
        transactions.value.filter((transaction) =>
          transaction.date.startsWith(selectedYear.value),
        ),
      );
    });
  }

  updateList(transactions: Array<Transaction>) {
    const $section = this.$("section");

    if ($section) {
      if (transactions.length === 0) {
        $section.innerHTML = `Inga transaktioner ${selectedYear.value}`;
      } else {
        $section.innerHTML = transactions
          .map(
            (transaction) => {
              return html`
                <transaction-row
                  tsx-uuid="${transaction.uuid}"
                >
                </transaction-row>
              `;
            },
          )
          .join("");
      }
    } else {
      console.warn("section element not found in shadow DOM");
    }
  }

  render() {
    return `
        <section>
        
        </section>
    `;
  }
}

export default registerComponent(TransactionsList, {
  name: "transactions-list",
});
