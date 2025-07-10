import { registerFunctionComponent } from "webact";

import "../components/accounts-list.ts";

function AccountsPage() {
  const { html } = this;

  html`<h1>Konton</h1><accounts-list></accounts-list>`;
}

export default registerFunctionComponent(AccountsPage, {
  name: "accounts-page",
});
