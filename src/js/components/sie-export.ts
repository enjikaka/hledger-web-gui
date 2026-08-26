import { effect, signal } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { genereraSieFor, kodatCp437 } from "../sie-export";
import {
  availableYears,
  fileName,
  selectedYear,
  transactions,
} from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

/** Företagsnamn för #FNAMN — default är journalfilens namn utan ändelse. */
const fnamn = signal<string>("");

function standardFnamn(): string {
  return fileName.value.replace(/\.journal$/i, "").trim();
}

/** Laddar ner text som CP437 — SIE-specens teckenuppsättning. Returnerar
 *  antalet tecken som fick ersättas med '?'. */
function laddaNer(filnamn: string, innehall: string): number {
  const { bytes, ersatta } = kodatCp437(innehall);
  const blob = new Blob([bytes as BlobPart], {
    type: "text/plain;charset=ibm437",
  });
  const lank = document.createElement("a");

  lank.href = URL.createObjectURL(blob);
  lank.download = filnamn;
  lank.click();
  URL.revokeObjectURL(lank.href);

  return ersatta;
}

/**
 * Export av bokföringen som SIE4-fil (typ 4) — svensk standard som kan
 * importeras i de flesta bokföringsprogram. En fil per räkenskapsår med
 * saldon och alla verifikationer.
 */
class SieExport extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;
      const namn = fnamn.value || standardFnamn();

      $section.innerHTML = html`
        <div class="betalning">
          <label>
            År
            <select data-falt="ar">
              ${availableYears.value
                .map(
                  (ar) =>
                    html`<option value="${ar}" ${ar === year ? "selected" : ""}>
                      ${ar}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            Företagets namn (#FNAMN)
            <input type="text" data-falt="fnamn" value="${namn}" />
          </label>
          <button type="button" data-atgard="exportera">
            Ladda ner SIE4 (${year})
          </button>
        </div>
        <output class="status" role="status"></output>
      `;
    });

    this.on(
      "change",
      "select[data-falt=ar]",
      (event) => {
        selectedYear.value = (event.target as HTMLSelectElement).value;
      },
      {},
    );

    this.on(
      "change",
      "input[data-falt=fnamn]",
      (event) => {
        fnamn.value = (event.target as HTMLInputElement).value;
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard=exportera]",
      () => {
        const $status = this.$("output.status");
        const year = selectedYear.value;
        const filnamn = fnamn.value || standardFnamn() || "journal";
        const { sie, varningar } = genereraSieFor(year, transactions.value, {
          fnamn: filnamn,
        });
        const larmor: Array<string> = [];

        if (varningar.onumrerade > 0) {
          larmor.push(
            `${varningar.onumrerade} verifikat saknar verifikationsnummer och tas inte med.`,
          );
        }

        if (varningar.dubbletter.length > 0) {
          larmor.push(`Dubblettnummer: ${varningar.dubbletter.join(", ")}.`);
        }

        if (varningar.luckor.length > 0) {
          larmor.push(`Luckor i serien: ${varningar.luckor.join(", ")}.`);
        }

        const ersatta = laddaNer(`${filnamn}_${year}.se`, sie);

        if (ersatta > 0) {
          larmor.push(`${ersatta} tecken saknas i CP437 och ersattes med '?'.`);
        }

        if ($status) {
          $status.textContent =
            larmor.length > 0
              ? `${filnamn}_${year}.se nedladdad. Obs! ${larmor.join(" ")}`
              : `${filnamn}_${year}.se nedladdad.`;
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

export default registerComponent(SieExport, {
  name: "sie-export",
});
