import { registerFunctionComponent } from "webact";

import "../components/rapport-ne.ts";
import type { WebactThis } from "../webact-types.ts";

function NebilagaPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>NE-bilaga</h1>
    <rapport-ne></rapport-ne>
    `;
}

export default registerFunctionComponent(NebilagaPage, {
  name: "nebilaga-page",
});
