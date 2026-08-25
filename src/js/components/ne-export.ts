import { effect, signal } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { generateNeBilaga } from "../ne-bilaga";
import {
  genereraNeSru,
  kodatLatin1,
  type SruUppgifter,
  valideraBlanketterSru,
} from "../ne-sru";
import { deklarationVal, selectedYear } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

/** Inmatade uppgifter för SRU-filerna — lever bara i minnet. */
const sruUppgifter = signal<SruUppgifter>({
  personnummer: "",
  namn: "",
  postnr: "",
  postort: "",
});

/** Laddar ner text som ISO 8859-1 — Skatteverkets krav på SRU-filer. */
function laddaNer(filnamn: string, innehall: string): void {
  const blob = new Blob([kodatLatin1(innehall) as BlobPart], {
    type: "text/plain;charset=iso-8859-1",
  });
  const lank = document.createElement("a");

  lank.href = URL.createObjectURL(blob);
  lank.download = filnamn;
  lank.click();
  URL.revokeObjectURL(lank.href);
}

/**
 * Export av NE-bilagan som SRU-filer till Skatteverkets filöverföring:
 * INFO.SRU (uppgiftslämnaren) och BLANKETTER.SRU (blankettblocket). Alla
 * beräknade rutor följer med; summarutorna räknas av Skatteverket själva.
 */
class NeExport extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;
      const u = sruUppgifter.value;

      $section.innerHTML = html`
        <h2>SRU-export</h2>
        <p class="hint">
          Skapar INFO.SRU och BLANKETTER.SRU i ISO 8859-1 för Skatteverkets
          filöverföring. Summarutorna räknas av Skatteverket och skickas inte
          med.
        </p>
        <div class="betalning">
          <label>
            Personnummer
            <input
              type="text"
              data-falt="personnummer"
              value="${u.personnummer}"
              placeholder="ÅÅMMDDNNNN"
            />
          </label>
          <label>
            Namn
            <input type="text" data-falt="namn" value="${u.namn}" />
          </label>
          <label>
            Postnummer
            <input type="text" data-falt="postnr" value="${u.postnr}" />
          </label>
          <label>
            Postort
            <input type="text" data-falt="postort" value="${u.postort}" />
          </label>
        </div>
        <button type="button" data-atgard="info">
          Ladda ner INFO.SRU (${year})
        </button>
        <button type="button" data-atgard="blanketter">
          Ladda ner BLANKETTER.SRU (${year})
        </button>
        <output class="status" role="status"></output>
      `;
    });

    this.on(
      "change",
      "input[data-falt]",
      (event) => {
        const $falt = event.target as HTMLInputElement;
        const falt = $falt.dataset.falt as keyof SruUppgifter;

        if (!falt) {
          return;
        }

        sruUppgifter.value = { ...sruUppgifter.value, [falt]: $falt.value };
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard]",
      (event) => {
        const atgard = (event.target as HTMLButtonElement).dataset.atgard;

        if (atgard !== "info" && atgard !== "blanketter") {
          return;
        }

        const $status = this.$("output.status");
        const year = selectedYear.value;
        const bilaga = generateNeBilaga(year, deklarationVal.value[year]);

        try {
          const filer = genereraNeSru(bilaga, sruUppgifter.value);

          if (atgard === "info") {
            laddaNer("INFO.SRU", filer.infoSru);
            if ($status) $status.textContent = "INFO.SRU nedladdad.";
          } else {
            const kontroll = valideraBlanketterSru(filer.blanketterSru);

            if (!kontroll.giltig) {
              if ($status) {
                $status.textContent = `Kontrollen misslyckades: ${kontroll.fel.join("; ")}`;
              }
              return;
            }

            laddaNer("BLANKETTER.SRU", filer.blanketterSru);
            if ($status) $status.textContent = "BLANKETTER.SRU nedladdad.";
          }
        } catch (e) {
          if ($status) $status.textContent = (e as Error).message;
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

export default registerComponent(NeExport, {
  name: "ne-export",
});
