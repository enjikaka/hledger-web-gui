import { registerFunctionComponent } from "webact";

import "../components/bokfor-momsbetalning.ts";
import "../components/bokfor-momsomforing.ts";
import "../components/rapport-moms.ts";
import type { WebactThis } from "../webact-types.ts";

function MomsrapportPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Momsrapport</h1>
    <rapport-moms></rapport-moms>
    <bokfor-momsomforing></bokfor-momsomforing>
    <bokfor-momsbetalning></bokfor-momsbetalning>
    `;
}

export default registerFunctionComponent(MomsrapportPage, {
  name: "momsrapport-page",
});
