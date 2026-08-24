import { registerFunctionComponent } from "webact";

import "../components/new-transaction.ts";
import "../components/transactions-list.ts";
import "../components/verifikat-serie.ts";
import type { WebactThis } from "../webact-types.ts";

function TransactionsPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Transaktioner</h1>
    <details>
      <summary>Ny transaktion</summary>
      <new-transaction></new-transaction>
    </details>
    <verifikat-serie></verifikat-serie>
    <transactions-list></transactions-list>
  `;
}

export default registerFunctionComponent(TransactionsPage, {
  name: "transactions-page",
});
