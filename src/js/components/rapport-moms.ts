import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import {
  laddaExtraJournal,
  oppnaExtraJournal,
  supportsFileSystemAccess,
} from "../journal-file";
import { MANUELLA_RUTOR, RUTGRUPPER } from "../moms-rutor";
import {
  generateMomsrapport,
  generateMomsrapportFor,
  momsrader,
} from "../momsrapport";
import {
  extraJournal,
  fileName,
  momsVy,
  selectedYear,
  transactions,
} from "../signals";

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

      const year = selectedYear.value;
      const vy = momsVy.value;
      const extra = extraJournal.value;

      const rapport =
        vy === "sammanslagen" && extra
          ? // Journalerna summeras i ören i samma pass — varje ruta avrundas
            // exakt en gång, så deklarationen inte tappar ören per journal.
            generateMomsrapportFor(year, [
              ...transactions.value,
              ...extra.transactions,
            ])
          : generateMomsrapport(year);

      // Avsnitt utan rörelse döljs, utom blankettens kärnrutor som alltid
      // visas så att rapporten ser likadan ut även ett år utan händelser.
      const grupper = RUTGRUPPER.map((grupp) => ({
        ...grupp,
        rader: momsrader(rapport, grupp.rutor).filter(
          (rad) => grupp.alltid || rad.belopp !== 0,
        ),
      })).filter((grupp) => grupp.rader.length > 0);

      const vaxel = html`
        <fieldset class="vy-val">
          <legend>Momsdeklarationen är gemensam per person</legend>
          <label>
            <input
              type="radio"
              name="momsvy"
              value="journal"
              ${vy === "journal" ? "checked" : ""}
            />
            Endast denna journal (${fileName.value || "ingen fil öppnad"})
          </label>
          <label>
            <input
              type="radio"
              name="momsvy"
              value="sammanslagen"
              ${vy === "sammanslagen" ? "checked" : ""}
            />
            Sammanslagen över alla journaler
          </label>
        </fieldset>
      `;

      let extraDel = "";

      if (vy === "sammanslagen") {
        extraDel = extra
          ? html`
              <p>
                Med i underlaget: <strong>${extra.namn}</strong>
                (${extra.transactions.length} transaktioner)
                <button type="button" data-atgard="byt-extra">Byt fil…</button>
                <button type="button" data-atgard="ta-bort-extra">
                  Ta bort
                </button>
              </p>
              ${
                extra.namn === fileName.value
                  ? html`<p class="varning">
                      Obs! Samma fil som den aktiva journalen är inläst —
                      ladda den andra verksamhetens journal i stället, annars
                      räknas transaktionerna dubbelt.
                    </p>`
                  : ""
              }
              <p class="hint">
                Rutorna summeras i ören över båda journalerna och avrundas en
                gång. Momsomföring och betalning bokförs fortfarande per
                journal i vyerna nedanför.
              </p>
            `
          : html`
              <p>
                Ladda den andra verksamhetens journal för att se den
                sammanslagna deklarationen. Filen används bara som underlag
                här — den kan inte redigeras eller skrivas.
              </p>
              <button type="button" data-atgard="ladda-extra">
                Lägg till journal-fil…
              </button>
            `;
      }

      $section.innerHTML = html`
        ${vaxel} ${extraDel}
        <input
          type="file"
          id="extra-fallback"
          accept=".journal,.hledger,.j"
          hidden
        />
        <table class="mono">
          <caption>Momsrapport ${rapport.year}${
            vy === "sammanslagen" && extra
              ? ` — sammanslagen: ${fileName.value} + ${extra.namn}`
              : ""
          }</caption>
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

    this.on(
      "change",
      "input[name=momsvy]",
      (event) => {
        momsVy.value = (event.target as HTMLInputElement).value as
          | "journal"
          | "sammanslagen";
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard=ladda-extra], button[data-atgard=byt-extra]",
      () => {
        if (supportsFileSystemAccess()) {
          oppnaExtraJournal().catch((e: unknown) => {
            // Avbruten filväljare är inget fel
            if (!(e instanceof DOMException && e.name === "AbortError")) {
              console.error(e);
            }
          });
        } else {
          (this.$("#extra-fallback") as HTMLInputElement | null)?.click();
        }
      },
      {},
    );

    this.on(
      "change",
      "#extra-fallback",
      (event) => {
        const $falt = event.target as HTMLInputElement;
        const file = $falt.files?.[0];

        // Nolla fältet så att samma fil kan väljas igen (change kräver nytt värde)
        $falt.value = "";

        if (file) {
          laddaExtraJournal(file).catch(console.error);
        }
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard=ta-bort-extra]",
      () => {
        extraJournal.value = null;
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

export default registerComponent(RapportMoms, {
  name: "rapport-moms",
});
