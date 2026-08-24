import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { selectedYear, transactions } from "../signals";
import { granskaSerie, harSerieproblem } from "../verifikat";

import styles from "./rapport.css?inline";

const html = String.raw;

/**
 * Visar problem i verifikationsserien. Det är hela poängen med löpande
 * numrering: en obruten serie visar att inget verifikat fattas, och en lucka
 * ska därför synas i stället för att tyst passera.
 */
class VerifikatSerie extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;

      // Läs transaktionerna så att effekten kör om när något bokförs
      transactions.value;

      const problem = granskaSerie(year);

      if (!harSerieproblem(problem)) {
        // Serien är hel. Börjar den på annat än 1 är det värt att nämna,
        // men det är ett val och inget fel.
        $section.innerHTML = problem.borjarPa
          ? html`<p class="hint">
              Verifikationsserien för ${year} börjar på ${problem.borjarPa}.
              Numreringen brukar starta om på 1 varje räkenskapsår.
            </p>`
          : "";
        return;
      }

      const rader: Array<string> = [];

      if (problem.onumrerade > 0) {
        rader.push(
          `${problem.onumrerade} verifikat saknar nummer. Bokföringslagen ` +
            "kräver ett identifieringstecken på varje verifikation.",
        );
      }

      if (problem.luckor.length > 0) {
        rader.push(
          `Luckor i serien: ${problem.luckor.join(", ")}. ` +
            "Kontrollera om något verifikat tagits bort.",
        );
      }

      if (problem.dubbletter.length > 0) {
        rader.push(
          `Numret används mer än en gång: ${problem.dubbletter.join(", ")}.`,
        );
      }

      $section.innerHTML = rader
        .map((rad) => html`<p class="differens">Obs! ${rad}</p>`)
        .join("");
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

export default registerComponent(VerifikatSerie, {
  name: "verifikat-serie",
});
