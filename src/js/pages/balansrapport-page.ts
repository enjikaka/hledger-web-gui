import { registerFunctionComponent } from "webact";

import "../components/rapport-balans.ts";
import type { WebactThis } from "../webact-types.ts";

function BalansrapportPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Balansrapport</h1>
    <rapport-balans></rapport-balans>
  `;
}

export default registerFunctionComponent(BalansrapportPage, {
  name: "balansrapport-page",
});
