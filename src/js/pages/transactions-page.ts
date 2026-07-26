import { registerFunctionComponent } from "webact";

import "../components/transactions-list.ts";
import type { WebactThis } from "../webact-types.ts";

function TransactionsPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Transaktioner</h1>
    <transactions-list></transactions-list>
  `;
}

export default registerFunctionComponent(TransactionsPage, {
  name: "transactions-page",
});
