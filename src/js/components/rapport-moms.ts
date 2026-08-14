import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { MANUELLA_RUTOR, RUTGRUPPER } from "../moms-rutor";
import { generateMomsrapport, momsrader } from "../momsrapport";
import { selectedYear } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

// Skatteverket vill ha hela kronor i momsdeklarationen
const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

const kr = (amount: number) =>
  numberFormatter.format(Math.round(amount) === 0 ? 0 : Math.round(amount));

class RapportMoms extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const rapport = generateMomsrapport(selectedYear.value);

      // Avsnitt utan rörelse döljs, utom blankettens kärnrutor som alltid
      // visas så att rapporten ser likadan ut även ett år utan händelser.
      const grupper = RUTGRUPPER.map((grupp) => ({
        ...grupp,
        rader: momsrader(rapport, grupp.rutor).filter(
          (rad) => grupp.alltid || rad.belopp !== 0,
        ),
      })).filter((grupp) => grupp.rader.length > 0);

      $section.innerHTML = html`
        <table class="mono">
          <caption>Momsrapport ${rapport.year}</caption>
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Beskrivning</th>
              <th class="amount">Belopp</th>
            </tr>
          </thead>
          ${grupper
            .map(
              (grupp) => html`
                <tbody>
                  <tr class="grupp">
                    <td colspan="3">${grupp.rubrik}</td>
                  </tr>
                  ${grupp.rader
                    .map(
                      (rad) => html`
                        <tr>
                          <td>${rad.ruta}</td>
                          <td>
                            ${rad.beskrivning}
                            ${
                              MANUELLA_RUTOR.has(rad.ruta)
                                ? `<span class="manuell">fylls i manuellt</span>`
                                : ""
                            }
                          </td>
                          <td class="amount">${kr(rad.belopp)}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              `,
            )
            .join("")}
          <tfoot>
            <tr>
              <td>49</td>
              <td>Moms att betala eller få tillbaka</td>
              <td class="amount">${kr(rapport.nettoMoms)}</td>
            </tr>
          </tfoot>
        </table>
      `;
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

    return `<section></section>`;
  }
}

export default registerComponent(RapportMoms, {
  name: "rapport-moms",
});
