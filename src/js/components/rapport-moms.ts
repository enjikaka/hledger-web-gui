import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { formatMomsrapport, generateMomsrapport } from "../momsrapport";
import { selectedYear } from "../signals";

import styles from "./rapport-moms.css?inline";

class RapportMoms extends Component {
  componentDidMount() {
    effect(() => {
      const $pre = this.$("pre");

      if ($pre) {
        $pre.textContent = formatMomsrapport(
          generateMomsrapport(selectedYear.value),
        );
      }
    });
  }

  render() {
    (async () => {
      if (this._sDOM) {
        const sheet = new CSSStyleSheet();
        await sheet.replace(styles);

        this._sDOM.adoptedStyleSheets = [sheet];
      }
    })();

    return `
        <pre></pre>
    `;
  }
}

export default registerComponent(RapportMoms, {
  name: "rapport-moms",
});
