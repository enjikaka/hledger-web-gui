import { effect, signal } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { decodaCp437, sieTillJournal, tolkaSie } from "../sie-import";
import {
  accounts,
  aliases,
  fileHandle,
  fileName,
  journalHeader,
  transactions,
} from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

type Importerad = ReturnType<typeof sieTillJournal> & { fnamn: string };

/** Tolkad fil som väntar på att läggas in — lever bara i minnet. */
const forhandsvisning = signal<Importerad | null>(null);

function arFor(transaktioner: Array<{ date: string }>): Array<string> {
  return [...new Set(transaktioner.map((tx) => tx.date.slice(0, 4)))].sort();
}

/**
 * Import av SIE4-filer (t.ex. från Bokio): filen förhandsvisas och läggs
 * sedan in i appen — ersätt aktuell journal eller lägg till i den. Efteråt
 * sparas allt som vanlig .journal-fil med Spara-knappen.
 */
class SieImport extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const importerad = forhandsvisning.value;
      const harData = transactions.value.length > 0;
      const nyaAr = importerad?.ar ?? [];
      const befintligaAr = arFor(transactions.value);
      const overlapp = nyaAr.filter((ar) => befintligaAr.includes(ar));

      $section.innerHTML = html`
        <p class="hint">
          Läs in en SIE4-fil (t.ex. årsexporten från Bokio). Filen tolkas
          först — inget ändras förrän du väljer Lägg in.
        </p>
        <input
          type="file"
          accept=".se,.si,.sie,.txt"
          data-atgard="valj-fil"
        />
        ${
          importerad
            ? html`
                <table class="mono">
                  <caption>Förhandsvisning</caption>
                  <tbody>
                    <tr>
                      <td>Företag</td>
                      <td>${importerad.fnamn || "(namn saknas i filen)"}</td>
                    </tr>
                    <tr>
                      <td>År</td>
                      <td>${nyaAr.join(", ")}</td>
                    </tr>
                    <tr>
                      <td>Verifikationer</td>
                      <td>${importerad.transaktioner.length}</td>
                    </tr>
                    <tr>
                      <td>Konton</td>
                      <td>${importerad.konton.length}</td>
                    </tr>
                  </tbody>
                </table>
                ${
                  harData
                    ? html`<fieldset class="vy-val">
                        <legend>
                          Appen har redan ${transactions.value.length}
                          transaktioner — hur ska importen läggas in?
                        </legend>
                        <label>
                          <input
                            type="radio"
                            name="import-lage"
                            value="ersatt"
                            checked
                          />
                          Ersätt aktuell journal
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="import-lage"
                            value="lagg-till"
                          />
                          Lägg till i aktuell journal
                        </label>
                        ${
                          overlapp.length > 0
                            ? html`<p class="varning">
                                Obs! Åren ${overlapp.join(", ")} finns i båda
                                underlagen — vid Lägg till räknas de
                                transaktionerna dubbelt.
                              </p>`
                            : ""
                        }
                      </fieldset>`
                    : ""
                }
                <button type="button" data-atgard="lagg-in">
                  Lägg in i appen
                </button>
              `
            : ""
        }
        <output class="status" role="status"></output>
      `;
    });

    this.on(
      "change",
      "input[data-atgard=valj-fil]",
      async (event) => {
        const $falt = event.target as HTMLInputElement;
        const fil = $falt.files?.[0];

        if (!fil) {
          return;
        }

        const bytes = new Uint8Array(await fil.arrayBuffer());
        const text = decodaCp437(bytes);

        try {
          const data = tolkaSie(text);
          const journal = sieTillJournal(data);

          forhandsvisning.value = { ...journal, fnamn: data.fnamn };
        } catch (e) {
          forhandsvisning.value = null;

          const $status = this.$("output.status");
          if ($status) $status.textContent = (e as Error).message;
        }
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard=lagg-in]",
      () => {
        const importerad = forhandsvisning.value;

        if (!importerad) {
          return;
        }

        const lage =
          (
            this.$(
              'input[name="import-lage"]:checked',
            ) as HTMLInputElement | null
          )?.value ?? "ersatt";

        if (lage === "lagg-till") {
          const gamlaKonton = new Set(accounts.value.map((k) => k.name));
          const gamlaAlias = new Set(aliases.value.map((a) => a.id));
          const konton = [
            ...accounts.value,
            ...importerad.konton.filter((k) => !gamlaKonton.has(k.name)),
          ];
          const aliaser = [
            ...aliases.value,
            ...importerad.aliaser.filter((a) => !gamlaAlias.has(a.id)),
          ];

          accounts.value = konton;
          aliases.value = aliaser;
          transactions.value = [
            ...transactions.value,
            ...importerad.transaktioner,
          ];
        } else {
          accounts.value = importerad.konton;
          aliases.value = importerad.aliaser;
          transactions.value = importerad.transaktioner;
        }

        // Ingen filhandel ännu — Spara-knappen skapar .journal-filen via
        // nedladdning tills journalen sparats till disk.
        journalHeader.value = "";
        fileName.value = "importerad.journal";
        fileHandle.value = null;
        forhandsvisning.value = null;

        const $status = this.$("output.status");
        if ($status) {
          $status.textContent =
            "Importen är inläst. Granska under Transaktioner och spara med Spara-knappen.";
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

export default registerComponent(SieImport, {
  name: "sie-import",
});
