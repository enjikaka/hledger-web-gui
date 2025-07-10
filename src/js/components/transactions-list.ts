import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import type { Transaction } from "../parse-journal-file";
import { transactions } from "../signals";

class TransactionsList extends Component {
  componentDidMount() {
    effect(() => {
      this.updateList(transactions.value);
    });
  }

  updateList(transactions: Array<Transaction>) {
    const $tbody = this.$("tbody");
    const $thead = this.$("thead");

    if ($tbody) {
      if (transactions.length === 0) {
        $tbody.innerHTML = `<tr><td colspan="2">Inga transaktioner</td></tr>`;
        $thead.style.display = "none";
      } else {
        $tbody.innerHTML = transactions
          .map(
            (transaction) =>
              `<tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                </tr>`,
          )
          .join("");
        $thead.style.display = "table-header-group";
      }
    } else {
      console.warn("ol element not found in shadow DOM");
    }
  }

  render() {
    return `
        <table>
            <thead>
                <tr>
                    <th>Datum</th>
                    <th>Beskrivning</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    `;
  }
}

export default registerComponent(TransactionsList, {
  name: "transactions-list",
});
