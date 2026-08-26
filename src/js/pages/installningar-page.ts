import { registerFunctionComponent } from "webact";

import "../components/sie-export.ts";
import type { WebactThis } from "../webact-types.ts";

function InstallningarPage(this: WebactThis) {
  const { html } = this;

  html`
    <h1>Inställningar</h1>
    <h2>Export</h2>
    <sie-export></sie-export>
    `;
}

export default registerFunctionComponent(InstallningarPage, {
  name: "installningar-page",
});
