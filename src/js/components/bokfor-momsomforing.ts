import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import {
  harMomsomforing,
  skapaMomsomforing,
} from "../momsrapport";
import type { Posting } from "../parse-journal-file";
import { aliases, selectedYear, transactions } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
});

const kr = (amount: number) => numberFormatter.format(amount === 0 ? 0 : amount);

function previewTabell(postings: Array<Posting>): string {
  const kontonamn = (konto: number) =>
    aliases.value.find((alias) => alias.id === konto)?.to ?? "";

  return html`
    <table class="mono">
      <tbody>
        ${postings
          .map(
            (posting) => html`
              <tr>
                <td>${posting.account} ${kontonamn(posting.account)}</td>
                <td class="amount">${kr(posting.amount)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function aliasTips(postings: Array<Posting>): string {
  const saknas = postings
    .map((posting) => posting.account)
    .filter((konto) => !aliases.value.some((alias) => alias.id === konto));

  return saknas.length > 0
    ? html`<p class="hint">
        Tips: lägg till alias för konto ${saknas.join(", ")} i journalens
        header så visas kontonamnen.
      </p>`
    : "";
}

class BokforMomsomforing extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;

      if (harMomsomforing(year)) {
        $section.innerHTML = html`<p class="klar">
          ✓ Momsomföring bokförd för ${year}.
        </p>`;
        return;
      }

      const forslag = skapaMomsomforing(year);

      if (!forslag) {
        $section.innerHTML = html`<p class="hint">
          Ingen moms att omföra för ${year}.
        </p>`;
        return;
      }

      $section.innerHTML = html`
        <h2>Bokför momsdeklarationen</h2>
        <p>
          Nollar momskontona per 31 december och bokför nettot i hela kronor
          mot redovisningskontot — samma verifikat som Bokio skapar
          automatiskt.
        </p>
        ${previewTabell(forslag.postings)}
        ${aliasTips(forslag.postings)}
        <button type="button" class="bokfor">
          Bokför momsomföring (31 dec ${year})
        </button>
      `;
    });

    this.on(
      "click",
      "button.bokfor",
      () => {
        const transaktion = skapaMomsomforing(selectedYear.value);

        if (transaktion) {
          transactions.value = [...transactions.value, transaktion];
        }
      },
      {},
    );
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

export default registerComponent(BokforMomsomforing, {
  name: "bokfor-momsomforing",
});
