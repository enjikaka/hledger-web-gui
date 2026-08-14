import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { generateNeBilaga, MANUELLA_NE_RUTOR, type NeRad } from "../ne-bilaga";
import { selectedYear } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

// Skatteverket vill ha hela kronor på NE-bilagan
const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

const kr = (amount: number) =>
  numberFormatter.format(Math.round(amount) === 0 ? 0 : Math.round(amount));

function rutaRader(rad: NeRad): string {
  const kontoRader = rad.konton
    .map(
      (konto) => html`
        <tr class="konto-rad">
          <td></td>
          <td>${konto.konto} ${konto.namn}</td>
          <td class="amount">${kr(konto.belopp)}</td>
        </tr>
      `,
    )
    .join("");

  return html`
    <tr>
      <td>${rad.ruta}</td>
      <td>
        ${rad.beskrivning}
        ${
          MANUELLA_NE_RUTOR.has(rad.ruta)
            ? `<span class="manuell">fylls i manuellt</span>`
            : ""
        }
      </td>
      <td class="amount">${kr(rad.belopp)}</td>
    </tr>
    ${kontoRader}
  `;
}

function tabell(rubrik: string, rader: Array<NeRad>): string {
  return html`
    <table class="mono">
      <caption>${rubrik}</caption>
      <thead>
        <tr>
          <th>Ruta</th>
          <th>Beskrivning</th>
          <th class="amount">Belopp</th>
        </tr>
      </thead>
      <tbody>
        ${rader.map(rutaRader).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Summa</td>
          <td class="amount">
            ${kr(rader.reduce((sum, rad) => sum + rad.belopp, 0))}
          </td>
        </tr>
      </tfoot>
    </table>
  `;
}

class RapportNe extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const rapport = generateNeBilaga(selectedYear.value);

      $section.innerHTML = html`
        ${tabell(`Intäkter ${rapport.year}`, rapport.intakter)}
        ${tabell(`Kostnader ${rapport.year}`, rapport.kostnader)}
        <table class="mono">
          <tfoot>
            <tr>
              <td>R11</td>
              <td>Bokfört resultat</td>
              <td class="amount">${kr(rapport.bokfortResultat)}</td>
            </tr>
          </tfoot>
        </table>
        ${rapport.varningar
          .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
          .join("")}
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

export default registerComponent(RapportNe, {
  name: "rapport-ne",
});
