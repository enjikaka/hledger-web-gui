import { Component, registerComponent } from "webact";
import { transactions } from '../signals';
import styles from "./transaction-row.css?inline";

const html = String.raw;
const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  month: "long",
  day: "numeric",
  timeZone: "Europe/Stockholm",
});

class TransactionRow extends Component {
  render() {
    (async () => {
      if (this._sDOM) {
        const sheet = new CSSStyleSheet();
        await sheet.replace(styles);

        this._sDOM.adoptedStyleSheets = [sheet];
      }
    })();

    const tsx = transactions.value.find(tsx => tsx.uuid === this.props.tsxUuid);

    if (!tsx) {
      return;
    }

    const [vendor, title, tags] = tsx?.description.split(',').map(s => s.trim()) || [];

    return html`
            <details>
                <summary>
                  <div class="summary-wrapper">
                  <div class="row">
                    <div class="date monotext" title="${dateFormatter.format(new Date(tsx?.date))}">${tsx?.date.split('-').slice(1).join('-')}</div>
                    <div class="title">${title}</div>
                  </div>
                  <div class="row">
                    <div class="vendor">${vendor}</div>
                    <div class="tags">${tags}</div>
                  </div>
                  </div>
                </summary>
                <table class="posting monotext">
                    <thead>
                      <tr>
                        <th>Konto</th>
                        <th>Belopp</th>
                      </tr>
                    </thead>
                    <tbody>
                ${tsx?.postings.map(posting => html`
                  
                      <tr>
                        <td class="account">${posting.account}</td>
                        <td class="amount">${posting.amount}</td>
                      </tr>
                  
                `).join('')}  
                </tbody>
                </table>
            </details>
        `;
  }
}

export default registerComponent(TransactionRow, {
  name: "transaction-row",
});
