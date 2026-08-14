import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import {
  beraknaArsresultatOre,
  harArsresultat,
  harNollning,
  skapaArsresultatTransaktion,
  skapaNollningTransaktion,
} from "../bokslut";
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

class BokslutAtgarder extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;
      const resultatOre = beraknaArsresultatOre(year);
      const resultatKlart = harArsresultat(year);
      const nollningKlar = harNollning(year);

      const resultatDel = () => {
        if (resultatKlart) {
          return html`<p class="klar">✓ Årets resultat bokfört för ${year}.</p>`;
        }

        const forslag = skapaArsresultatTransaktion(year);

        if (!forslag) {
          return html`<p class="hint">
            Inget resultat att bokföra för ${year}.
          </p>`;
        }

        return html`
          <p>
            ${resultatOre > 0 ? "Vinst" : "Förlust"}:
            <strong>${kr(resultatOre / 100)}</strong>. Resultatet omförs från
            8999 till 2019 (Årets resultat under eget kapital) per 31 december.
          </p>
          ${previewTabell(forslag.postings)}
          ${aliasTips(forslag.postings)}
          <button type="button" class="bokfor-resultat">
            Bokför årets resultat (31 dec ${year})
          </button>
        `;
      };

      const nollningDel = () => {
        if (nollningKlar) {
          return html`<p class="klar">
            ✓ Eget kapital nollställt (1 jan ${parseInt(year, 10) + 1}).
          </p>`;
        }

        if (!resultatKlart && resultatOre !== 0) {
          return html`<p class="hint">
            Bokför årets resultat först — 2019 ska ha fått sitt saldo innan
            underkontona nollas.
          </p>`;
        }

        const forslag = skapaNollningTransaktion(year);

        if (!forslag) {
          return html`<p class="hint">
            Inga saldon på eget kapitals underkonton att nolla för ${year}.
          </p>`;
        }

        return html`
          <p>
            Underkontona 2011–2019 (egna uttag, egna insättningar, årets
            resultat) nollas mot 2010 Eget kapital per 1 januari
            ${parseInt(year, 10) + 1}.
          </p>
          ${previewTabell(forslag.postings)}
          ${aliasTips(forslag.postings)}
          <button type="button" class="bokfor-nollning">
            Nolla eget kapital (1 jan ${parseInt(year, 10) + 1})
          </button>
        `;
      };

      $section.innerHTML = html`
        <h2>Årets resultat ${year}</h2>
        ${resultatDel()}
        <h2>Nollställning av eget kapital</h2>
        ${nollningDel()}
      `;
    });

    this.on(
      "click",
      "button.bokfor-resultat",
      () => {
        const transaktion = skapaArsresultatTransaktion(selectedYear.value);

        if (transaktion) {
          transactions.value = [...transactions.value, transaktion];
        }
      },
      {},
    );

    this.on(
      "click",
      "button.bokfor-nollning",
      () => {
        const transaktion = skapaNollningTransaktion(selectedYear.value);

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

export default registerComponent(BokslutAtgarder, {
  name: "bokslut-atgarder",
});
