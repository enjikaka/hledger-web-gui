import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { generateMomsrapport } from "../momsrapport";
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

      const rader: Array<[string, string, number]> = [
        ["05", "Momspliktig försäljning", rapport.momspliktigForsaljning],
        ["10", "Utgående moms 25 %", rapport.utgaendeMoms25],
        ["11", "Utgående moms 12 %", rapport.utgaendeMoms12],
        ["12", "Utgående moms 6 %", rapport.utgaendeMoms6],
        ["48", "Ingående moms att dra av", rapport.ingaendeMoms],
      ];

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
          <tbody>
            ${rader
              .map(
                ([ruta, beskrivning, belopp]) => html`
                  <tr>
                    <td>${ruta}</td>
                    <td>${beskrivning}</td>
                    <td class="amount">${kr(belopp)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
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
