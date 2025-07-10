import { registerFunctionComponent } from "webact";

import "../components/transactions-list.ts";

function TransactionsPage() {
  const { html } = this;

  html`
    <h1>Transaktioner</h1>
    <transactions-list></transactions-list>
  `;
}

export default registerFunctionComponent(TransactionsPage, {
  name: "transactions-page",
});
