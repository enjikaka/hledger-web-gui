import { registerFunctionComponent } from "webact";

import "../components/accounts-list.ts";
import type { WebactThis } from "../webact-types.ts";

function AccountsPage(this: WebactThis) {
  const { html } = this;

  html`<h1>Konton</h1><accounts-list></accounts-list>`;
}

export default registerFunctionComponent(AccountsPage, {
  name: "accounts-page",
});
