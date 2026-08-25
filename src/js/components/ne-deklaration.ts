import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { beraknaEgenavgifter } from "../egenavgifter";
import { generateNeBilaga, type NeDeklarationsVal } from "../ne-bilaga";
import { proposeraPfondAterforing } from "../periodiseringsfond";
import { beraknaRantefordelning, slrForAr } from "../rantefordelning";
import { deklarationVal, selectedYear } from "../signals";

import styles from "./rapport.css?inline";

const html = String.raw;

const krFormaterare = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

const procentFormaterare = new Intl.NumberFormat("sv-SE", {
  style: "percent",
  minimumFractionDigits: 2,
});

const kr = (belopp: number) => krFormaterare.format(Math.round(belopp));

/** Läser ett tal ur ett inmatningsfält — undefined vid tomt eller ogiltigt. */
function talUrFalt(
  $falt: HTMLInputElement | HTMLSelectElement | null,
): number | undefined {
  const rattad = ($falt?.value ?? "").trim().replace(/\s/g, "");

  if (rattad === "") {
    return undefined;
  }

  const tal = Number(rattad.replace(",", "."));
  return Number.isFinite(tal) ? tal : undefined;
}

/**
 * Deklarationsuppgifter som inte går att läsa ur bokföringen: räntefördelning,
 * egenavgifter och periodiseringsfond. Uppgifterna lever i minnet per år och
 * nollas vid omladdning; resultatet visas i NE-rapportens justeringstabell.
 */
class NeDeklaration extends Component {
  componentDidMount() {
    effect(() => {
      const $section = this.$("section");

      if (!$section) {
        return;
      }

      const year = selectedYear.value;
      const val = deklarationVal.value[year] ?? {};
      const bilaga = generateNeBilaga(year, val);

      const rutaRad = (ruta: string, text: string): string =>
        html`<p>
          ${text} <strong>${ruta}</strong>.
        </p>`;

      // --- Räntefördelning ---
      let rfDel = html`<p class="hint">
        Fyll i kapitalunderlaget för att se ett förslag.
      </p>`;

      if (val.rantefordelning) {
        const forslag = beraknaRantefordelning({
          kapitalunderlag: val.rantefordelning.kapitalunderlag,
          slrSats:
            val.rantefordelning.slrOverskrivning ?? slrForAr(Number(year)),
        });

        if (!forslag) {
          rfDel = html`<p class="hint">
            Ingen räntefördelning — kapitalunderlaget ligger mellan 0 och
            −500 000 kr.
          </p>`;
        } else {
          // Beloppet läses från bilagan så att R29-taket (positiv räntefördelning
          // får inte skapa underskott) speglas här.
          const rad = bilaga.justeringar.find((r) => r.ruta === forslag.ruta);
          const belopp = rad && !rad.manuell ? rad.belopp : forslag.belopp;
          const satsText = procentFormaterare.format(
            forslag.rantefordelningsSats,
          );
          const riktning =
            forslag.riktning === "positiv"
              ? "Positiv räntefördelning:"
              : "Negativ räntefördelning:";

          rfDel = html`
            ${rutaRad(
              forslag.ruta,
              `${riktning} ${satsText} × ${kr(forslag.kapitalunderlag)} = ${kr(belopp)}`,
            )}
            ${
              forslag.riktning === "positiv"
                ? html`<p class="hint">
                  Avdraget får inte överstiga resultatet före räntefördelning
                  (R29); överskjutande belopp sparas som sparat
                  fördelningsbelopp. Beloppet ska även redovisas som
                  kapitalinkomst på Inkomstdeklaration 1 (T4).
                </p>`
                : ""
            }
            ${forslag.varningar
              .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
              .join("")}
            ${bilaga.varningar
              .filter((v) => v.includes("sparat fördelningsbelopp"))
              .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
              .join("")}
          `;
        }
      }

      // --- Egenavgifter ---
      let eaDel = html`<p class="hint">
        Välj kategori för att räkna fram årets schablonavdrag.
      </p>`;

      if (val.egenavgifter) {
        const r42 = bilaga.justeringar.find((r) => r.ruta === "R42");
        const r40 = val.egenavgifter.foregaendeArsSchablonavdrag ?? 0;
        const r41 = val.egenavgifter.foregaendeArsPafort ?? 0;

        // Samma underlag som motorn använder: R42 minus föregående års
        // poster ger basen före R40/R41.
        const bas = (r42?.belopp ?? bilaga.bokfortResultat) - r40 + r41;

        const forslag = beraknaEgenavgifter({
          overskottForeEgenavgifter: bas,
          kategori: val.egenavgifter.kategori,
          foregaendeArsSchablonavdrag: r40,
          foregaendeArsPafort: r41,
        });

        eaDel = html`
          ${rutaRad(
            "R43",
            `Schablonavdrag: ${procentFormaterare.format(forslag.schablonSats)} × ${kr(forslag.nettoOverskott)} = ${kr(forslag.schablonavdrag)}`,
          )}
          <p class="hint">
            Uppskattade egenavgifter: ${kr(forslag.uppskattadeEgenavgifter)}.
            Skatteverket fastställer det faktiska beloppet.
          </p>
          ${forslag.varningar
            .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
            .join("")}
        `;
      }

      // --- Periodiseringsfond ---
      const fonder = val.periodiseringsfond?.fonder ?? [];
      const aterforingar = proposeraPfondAterforing({
        fonder,
        ar: Number(year),
      });

      let pfondAvsattningDel = html`<p class="hint">
        Ange tidigare års fonder nedan för att kunna välja återföring och
        avsättning.
      </p>`;

      if (val.periodiseringsfond) {
        const r34 = bilaga.justeringar.find((r) => r.ruta === "R34");

        pfondAvsattningDel =
          r34 && !r34.manuell
            ? rutaRad(
                "R34",
                `Avsättning till periodiseringsfond: ${kr(r34.belopp)}`,
              )
            : html`<p class="hint">
                Ingen avsättning — varken önskat belopp eller utrymme enligt
                R33.
              </p>`;
      }

      const pfondDel = html`
        ${aterforingar
          .map((rad) =>
            rutaRad(
              "R32",
              `${rad.obligatorisk ? "Obligatorisk återföring" : "Återföring"} av fond ${rad.kohortAr}: ${kr(rad.belopp)}`,
            ),
          )
          .join("")}
        ${pfondAvsattningDel}
        ${aterforingar
          .flatMap((rad) => rad.varningar)
          .map((varning) => html`<p class="varning">Obs! ${varning}</p>`)
          .join("")}
      `;

      const kohortRader = fonder
        .map(
          (fond, index) => html`
            <tr>
              <td>
                <input
                  type="number"
                  aria-label="Kohortår"
                  data-kohort="${index}"
                  data-del="ar"
                  value="${fond.ar}"
                />
              </td>
              <td>
                <input
                  type="number"
                  aria-label="Saldo i kronor"
                  data-kohort="${index}"
                  data-del="saldo"
                  value="${fond.saldo}"
                />
              </td>
              <td>
                <button
                  type="button"
                  data-atgard="ta-bort-kohort"
                  data-index="${index}"
                >
                  Ta bort
                </button>
              </td>
            </tr>
          `,
        )
        .join("");

      $section.innerHTML = html`
        <h2>Räntefördelning</h2>
        <div class="betalning">
          <label>
            Kapitalunderlag (föregående års utgång), kr
            <input
              type="number"
              data-falt="rf.kapitalunderlag"
              value="${val.rantefordelning?.kapitalunderlag ?? ""}"
            />
          </label>
          <label>
            Statslåneräntan (%)
            <input
              type="number"
              step="0.01"
              data-falt="rf.slr"
              value="${val.rantefordelning?.slrOverskrivning ?? slrForAr(Number(year)) * 100}"
            />
          </label>
        </div>
        ${rfDel}
        <h2>Egenavgifter</h2>
        <div class="betalning">
          <label>
            Kategori
            <select data-falt="ea.kategori">
              <option value="">— välj kategori —</option>
              <option
                value="full"
                ${val.egenavgifter?.kategori === "full" ? "selected" : ""}
              >
                Full (aktiv verksamhet)
              </option>
              <option
                value="pensionar"
                ${val.egenavgifter?.kategori === "pensionar" ? "selected" : ""}
              >
                Pensionär
              </option>
              <option
                value="passiv"
                ${val.egenavgifter?.kategori === "passiv" ? "selected" : ""}
              >
                Passiv (särskild löneskatt)
              </option>
            </select>
          </label>
          <label>
            Föregående års medgivna avdrag, kr (R40)
            <input
              type="number"
              data-falt="ea.r40"
              value="${val.egenavgifter?.foregaendeArsSchablonavdrag ?? ""}"
            />
          </label>
          <label>
            Föregående års påförda egenavgifter, kr (R41)
            <input
              type="number"
              data-falt="ea.r41"
              value="${val.egenavgifter?.foregaendeArsPafort ?? ""}"
            />
          </label>
        </div>
        ${eaDel}
        <h2>Periodiseringsfond</h2>
        <table class="mono">
          <thead>
            <tr>
              <th>Kohortår</th>
              <th class="amount">Saldo, kr</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${
              kohortRader ||
              html`<tr><td colspan="3" class="hint">Inga fonder registrerade.</td></tr>`
            }
          </tbody>
        </table>
        <button type="button" data-atgard="lagg-till-kohort">
          Lägg till kohort
        </button>
        <div class="betalning">
          <label>
            Önskad avsättning i år, kr — lämnas tomt sätts maximalt (30 % av
            R33)
            <input
              type="number"
              data-falt="pf.avsattning"
              value="${val.periodiseringsfond?.onskadAvsattning ?? ""}"
            />
          </label>
        </div>
        ${pfondDel}
      `;
    });

    this.on(
      "change",
      "[data-falt]",
      (event) => {
        const $falt = event.target as HTMLInputElement;
        const falt = $falt.dataset.falt;

        this.uppdatera(selectedYear.value, (nytt) => {
          switch (falt) {
            case "rf.kapitalunderlag": {
              const tal = talUrFalt($falt);

              if (tal === undefined) {
                delete nytt.rantefordelning;
              } else {
                nytt.rantefordelning = {
                  ...nytt.rantefordelning,
                  kapitalunderlag: tal,
                };
              }
              break;
            }
            case "rf.slr": {
              const befintlig = nytt.rantefordelning;

              // Överskrivningen ensam räcker inte — grenen finns bara när
              // kapitalunderlaget är satt.
              if (!befintlig) {
                break;
              }

              const tal = talUrFalt($falt);

              nytt.rantefordelning =
                tal === undefined
                  ? { kapitalunderlag: befintlig.kapitalunderlag }
                  : { ...befintlig, slrOverskrivning: tal / 100 };
              break;
            }
            case "ea.kategori": {
              if (!$falt.value) {
                delete nytt.egenavgifter;
              } else {
                nytt.egenavgifter = {
                  ...nytt.egenavgifter,
                  kategori: $falt.value as NonNullable<
                    NeDeklarationsVal["egenavgifter"]
                  >["kategori"],
                };
              }
              break;
            }
            case "ea.r40":
            case "ea.r41": {
              const tal = talUrFalt($falt);

              nytt.egenavgifter = {
                ...nytt.egenavgifter,
                kategori: nytt.egenavgifter?.kategori ?? "full",
                ...(falt === "ea.r40"
                  ? { foregaendeArsSchablonavdrag: tal }
                  : { foregaendeArsPafort: tal }),
              };
              break;
            }
            case "pf.avsattning": {
              const tal = talUrFalt($falt);
              const befintlig = nytt.periodiseringsfond;

              if (!befintlig && tal === undefined) {
                break;
              }

              nytt.periodiseringsfond = {
                fonder: befintlig?.fonder ?? [],
                onskadAvsattning: tal,
              };
              break;
            }
          }
        });
      },
      {},
    );

    this.on(
      "change",
      "input[data-kohort]",
      (event) => {
        const $falt = event.target as HTMLInputElement;
        const index = Number($falt.dataset.kohort);
        const del = $falt.dataset.del === "saldo" ? "saldo" : "ar";

        this.uppdatera(selectedYear.value, (nytt) => {
          const fonder = [...(nytt.periodiseringsfond?.fonder ?? [])];
          const gammal = fonder[index];

          if (!gammal) {
            return;
          }

          const tal = talUrFalt($falt);
          fonder[index] =
            del === "ar"
              ? { ...gammal, ar: tal ?? gammal.ar }
              : { ...gammal, saldo: tal ?? gammal.saldo };
          nytt.periodiseringsfond = { ...nytt.periodiseringsfond, fonder };
        });
      },
      {},
    );

    this.on(
      "click",
      "button[data-atgard]",
      (event) => {
        const $knapp = event.target as HTMLButtonElement;
        const atgard = $knapp.dataset.atgard;

        if (atgard === "lagg-till-kohort") {
          this.uppdatera(selectedYear.value, (nytt) => {
            nytt.periodiseringsfond = {
              ...nytt.periodiseringsfond,
              fonder: [
                ...(nytt.periodiseringsfond?.fonder ?? []),
                { ar: Number(selectedYear.value) - 1, saldo: 0 },
              ],
            };
          });
        }

        if (atgard === "ta-bort-kohort") {
          const index = Number($knapp.dataset.index);

          this.uppdatera(selectedYear.value, (nytt) => {
            nytt.periodiseringsfond = {
              ...nytt.periodiseringsfond,
              fonder: (nytt.periodiseringsfond?.fonder ?? []).filter(
                (_, i) => i !== index,
              ),
            };
          });
        }
      },
      {},
    );
  }

  /** Tillämpar en ändring på årets deklarationsvärden i signalen. */
  private uppdatera(
    year: string,
    andring: (nytt: NeDeklarationsVal) => void,
  ): void {
    const allaAr = { ...deklarationVal.value };
    const nytt: NeDeklarationsVal = { ...allaAr[year] };
    andring(nytt);
    allaAr[year] = nytt;
    deklarationVal.value = allaAr;
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

export default registerComponent(NeDeklaration, {
  name: "ne-deklaration",
});
