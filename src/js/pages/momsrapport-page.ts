import { registerFunctionComponent } from "webact";

import "../components/rapport-moms.ts";

function MomsrapportPage() {
  const { html } = this;

  html`
    <h1>Momsrapport</h1>
    <rapport-moms></rapport-moms>
    `;
}

export default registerFunctionComponent(MomsrapportPage, {
  name: "momsrapport-page",
});
