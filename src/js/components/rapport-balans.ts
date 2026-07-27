import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { generateBalansrapport, type KontoRad } from "../balansrapport";
import { selectedYear } from "../signals";

import styles from "./rapport-balans.css?inline";

const html = String.raw;

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
});

// `amount === 0 ? 0 : amount` normaliserar -0 så vi slipper "−0,00 kr"
const kr = (amount: number) => numberFormatter.format(amount === 0 ? 0 : amount);

function tabell(
  rubrik: string,
  rader: Array<KontoRad>,
  summa: number,
  extraRad = "",
): string {
  return html`
    <table class="mono">
      <caption>${rubrik}</caption>
      <thead>
        <tr>
          <th>Konto</th>
          <th>Namn</th>
          <th class="amount">Ingående balans</th>
          <th class="amount">Förändring</th>
          <th class="amount">Utgående balans</th>
        </tr>
      </thead>
      <tbody>
        ${rader
          .map(
            (rad) => html`
              <tr>
                <td>${rad.konto}</td>
                <td>${rad.namn}</td>
                <td class="amount">${kr(rad.ib)}</td>
                <td class="amount">${kr(rad.forandring)}</td>
                <td class="amount">${kr(rad.ub)}</td>
              </tr>
            `,
          )
          .join("")}
        ${extraRad}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">Summa</td>
          <td class="amount">${kr(summa)}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

class RapportBalans extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const rapport = generateBalansrapport(selectedYear.value);

      const resultatRad = html`
        <tr>
          <td></td>
          <td>Beräknat resultat</td>
          <td class="amount"></td>
          <td class="amount"></td>
          <td class="amount">${kr(rapport.beraknatResultat)}</td>
        </tr>
      `;

      $section.innerHTML = html`
        ${tabell("Tillgångar", rapport.tillgangar, rapport.summaTillgangar)}
        ${tabell(
          "Eget kapital och skulder",
          rapport.egetKapitalSkulder,
          rapport.summaEgetKapitalSkulder,
          resultatRad,
        )}
        ${
          rapport.differensOre !== 0
            ? `<p class="differens">Obs! Balansen stämmer inte — differens ${kr(rapport.differensOre / 100)}.</p>`
            : ""
        }
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

export default registerComponent(RapportBalans, {
  name: "rapport-balans",
});
