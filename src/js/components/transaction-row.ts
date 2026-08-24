import { Component, registerComponent } from "webact";
import type { Posting } from "../parse-journal-file";
import { aliases, transactions } from '../signals';

import styles from "./transaction-row.css?inline";

const html = String.raw;
const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  month: "long",
  day: "numeric",
  timeZone: "Europe/Stockholm",
});

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
});

const toSEK = (amount: number) => numberFormatter.format(amount);

class TransactionRow extends Component {
  constructor () {
    super(import.meta.url);
  }

  componentDidMount() {
    this.$(".delete")?.addEventListener("click", () => {
      const tsx = transactions.value.find(tsx => tsx.uuid === this.props.tsxUuid);

      if (tsx && window.confirm(`Ta bort "${tsx.date} ${tsx.description}"?`)) {
        transactions.value = transactions.value.filter(t => t.uuid !== tsx.uuid);
      }
    });
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

    const parts = tsx.description.split(',').map(s => s.trim());
    const vendor = parts.length > 1 ? parts[0] : '';
    const title = parts.length > 1 ? parts[1] : parts[0];
    const tags = parts[2] ?? '';
    const isAccount = (accountId: number) => (posting: Posting) => accountId === posting.account;

    return html`
            <details>
                <summary>
                  <div class="summary-wrapper">
                    <div class="col">
                      <div class="row">
                        <div class="date mono" title="${dateFormatter.format(new Date(tsx?.date))}">${tsx?.date.split('-').slice(1).join('-')}</div>
                        ${tsx.code
                          ? `<div class="vernr mono" title="Verifikationsnummer">${tsx.code}</div>`
                          : `<div class="vernr saknas mono" title="Verifikationsnummer saknas">—</div>`}
                        <div class="title">${title}</div>
                      </div>
                      <div class="row">
                        <div class="vendor">${vendor}</div>
                        <div class="tags">${tags}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="row">
                        <div class="mono">${toSEK(tsx?.postings.find(isAccount(1930))?.amount ?? 0)}</div>
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
                        <td class="account">${posting.account} ${aliases.value.find(a => a.id === posting.account)?.to || ''}</td>
                        <td class="amount">${toSEK(posting.amount)}</td>
                      </tr>
                  
                `).join('')}
                </tbody>
                </table>
                <button type="button" class="delete">Ta bort</button>
            </details>
        `;
  }
}

export default registerComponent(TransactionRow, {
  name: "transaction-row",
});
