import { registerFunctionComponent } from "webact";

import "../components/bokslut-atgarder.ts";
import type { WebactThis } from "../webact-types.ts";

function BokslutPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Bokslut</h1>
    <bokslut-atgarder></bokslut-atgarder>
    `;
}

export default registerFunctionComponent(BokslutPage, {
  name: "bokslut-page",
});
