import { Component, registerComponent } from "webact";
import { aliases, transactions } from '../signals';
import styles from "./transaction-row.css?inline";

const html = String.raw;
const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  month: "long",
  day: "numeric",
  timeZone: "Europe/Stockholm",
});

class TransactionRow extends Component {
  constructor () {
    super(import.meta.url);
  }

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
                    <div class="col">
                      <div class="row">
                        <div class="date mono" title="${dateFormatter.format(new Date(tsx?.date))}">${tsx?.date.split('-').slice(1).join('-')}</div>
                        <div class="title">${title}</div>
                      </div>
                      <div class="row">
                        <div class="vendor">${vendor}</div>
                        <div class="tags">${tags}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="row">
                        <div class="mono">${tsx?.postings.find(p => p.account === '1930')?.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </summary>
                <table class="posting mono">
                    <thead>
                      <tr>
                        <th>Konto</th>
                        <th>Belopp</th>
                      </tr>
                    </thead>
                    <tbody>
                ${tsx?.postings.map(posting => html`
                  
                      <tr>
                        <td class="account">${posting.account} ${aliases.value.find(a => a.id === Number.parseInt(posting.account, 10))?.to || ''}</td>
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
