import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import {
  harMomsomforing,
  momsMotkonton,
  momsSkuld,
  skapaMomsbetalning,
} from "../momsrapport";
import { aliases, selectedYear, transactions } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
});

const kr = (amount: number) => numberFormatter.format(amount === 0 ? 0 : amount);

/** Helårsmoms deklareras och betalas i februari året efter beskattningsåret. */
const standardDatum = (year: string) => `${parseInt(year, 10) + 1}-02-12`;

class BokforMomsbetalning extends Component {
  /** Sätts när användaren själv ändrat datumet, så att årsbytet inte
   *  skriver över ett medvetet val. */
  private datumRort = false;

  componentDidMount() {
    const $datum = this.$("#betaldatum") as HTMLInputElement | null;
    const $motkonto = this.$("#motkonto") as HTMLSelectElement | null;

    $datum?.addEventListener("input", () => {
      this.datumRort = true;
    });

    effect(() => {
      const $section = this.$("section");
      const $form = this.$(".betalning") as HTMLElement | null;

      if (!$section || !$form) {
        return;
      }

      const year = selectedYear.value;

      // Läs transactions så att effekten kör om när något bokförs
      transactions.value;

      const skuld = momsSkuld();

      if ($datum && !this.datumRort) {
        $datum.value = standardDatum(skuld?.omforingsAr ?? year);
      }

      if (!skuld) {
        $form.hidden = true;
        $section.innerHTML = harMomsomforing(year)
          ? html`<p class="klar">✓ Momsen är reglerad mot Skatteverket.</p>`
          : html`<p class="hint">
              Bokför momsomföringen först — den skapar skulden eller fordran
              som betalningen reglerar.
            </p>`;
        return;
      }

      const alias = aliases.value.find((a) => a.id === skuld.konto)?.to;
      const konto = alias ? `${skuld.konto} ${alias}` : String(skuld.konto);
      const belopp = skuld.beloppOre / 100;

      // Motkontona beror på riktningen, så listan byggs om här. Ett redan
      // gjort val behålls om det finns kvar bland alternativen.
      if ($motkonto) {
        const valt = $motkonto.value;
        const alternativ = momsMotkonton(skuld.attBetala);

        $motkonto.innerHTML = alternativ
          .map((m) => `<option value="${m.konto}">${m.namn}</option>`)
          .join("");

        $motkonto.value = alternativ.some((m) => String(m.konto) === valt)
          ? valt
          : String(alternativ[0].konto);
      }

      $form.hidden = false;
      $section.innerHTML = html`
        <p>
          ${
            skuld.attBetala
              ? html`Att betala in till Skatteverket:
                  <strong>${kr(belopp)}</strong>.`
              : html`Att få tillbaka från Skatteverket:
                  <strong>${kr(belopp)}</strong>.`
          }
          Betalningen nollar ${konto}.
        </p>
      `;
    });

    this.on(
      "click",
      "button.bokfor-betalning",
      () => {
        const datum =
          ($datum?.value || "").trim() ||
          standardDatum(momsSkuld()?.omforingsAr ?? selectedYear.value);
        const motkonto = parseInt($motkonto?.value ?? "1930", 10);
        const transaktion = skapaMomsbetalning(datum, motkonto);

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

    return html`
      <h2>Betalning till Skatteverket</h2>
      <section></section>
      <div class="betalning" hidden>
        <label>
          Betaldatum
          <input type="date" id="betaldatum" />
        </label>
        <label>
          Motkonto
          <select id="motkonto"></select>
        </label>
        <button type="button" class="bokfor-betalning">Bokför betalning</button>
      </div>
    `;
  }
}

export default registerComponent(BokforMomsbetalning, {
  name: "bokfor-momsbetalning",
});
