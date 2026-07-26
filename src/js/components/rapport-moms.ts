import { Component, registerComponent } from "webact";
import { formatMomsrapport, generateMomsrapport } from "../momsrapport";

import styles from "./rapport-moms.css?inline";

class RapportMoms extends Component {
  render() {
    (async () => {
          if (this._sDOM) {
            const sheet = new CSSStyleSheet();
            await sheet.replace(styles);
    
            this._sDOM.adoptedStyleSheets = [sheet];
          }
        })();

    return `
        <pre>
        ${formatMomsrapport(generateMomsrapport("2025"))}
        </pre>
    `;
  }
}

export default registerComponent(RapportMoms, {
  name: "rapport-moms",
});
