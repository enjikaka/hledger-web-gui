import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import type { Transaction } from "../parse-journal-file";
import { transactions } from "../signals";

import './transaction-row';

const html = String.raw;

class TransactionsList extends Component {
  componentDidMount() {
    effect(() => {
      this.updateList(transactions.value);
    });
  }

  updateList(transactions: Array<Transaction>) {
    const $section = this.$("section");

    if ($section) {
      if (transactions.length === 0) {
        $section.innerHTML = `Inga transaktioner`;
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
