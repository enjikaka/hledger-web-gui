import { registerFunctionComponent } from "webact";
import { betalkonton, mallar, skapaPostings, skapaTransaktion } from "../mallar.ts";
import { aliases, transactions } from "../signals.ts";
import type { WebactThis } from "../webact-types.ts";

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
});

function NewTransaction(this: WebactThis) {
  const { $, html, css, postRender } = this;

  html`
    <form>
      <label>
        Mall
        <select id="mall" required>
          ${mallar.map((mall, i) => `<option value="${i}">${mall.namn}</option>`).join("")}
        </select>
      </label>
      <label>
        Datum
        <input type="date" id="datum" required />
      </label>
      <label>
        Beskrivning
        <input type="text" id="beskrivning" />
      </label>
      <label>
        Belopp inkl. moms
        <input type="number" id="belopp" step="0.01" min="0.01" required inputmode="decimal" />
      </label>
      <label id="betalkonto-label">
        Betalkonto
        <select id="betalkonto">
          ${betalkonton.map((b) => `<option value="${b.konto}">${b.namn}</option>`).join("")}
        </select>
      </label>
      <button type="submit">Lägg till</button>
    </form>
    <output>
      <table class="preview mono" hidden>
        <tbody></tbody>
      </table>
      <p class="status" role="status"></p>
    </output>
  `;

  css`
    form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: 0.75rem;
      align-items: end;
      margin-block-end: 0.75rem;
    }

    label {
      display: grid;
      gap: 0.25rem;
      font-size: 0.85rem;
    }

    label[hidden] {
      display: none;
    }

    input, select, button {
      font: inherit;
      padding: 0.4rem 0.5rem;
    }

    .preview td {
      padding-inline-end: 1rem;
    }

    .preview .amount {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .status {
      margin: 0.25rem 0;
      font-size: 0.85rem;
    }
  `;

  postRender(() => {
    const form = $("form");
    const mallInput = $("#mall");
    const datumInput = $("#datum");
    const beskrivningInput = $("#beskrivning");
    const beloppInput = $("#belopp");
    const betalkontoInput = $("#betalkonto");
    const betalkontoLabel = $("#betalkonto-label");
    const previewTable = $(".preview");
    const previewBody = $(".preview tbody");
    const status = $(".status");

    const valdMall = () => mallar[parseInt(mallInput.value, 10)];
    const valtBetalkonto = () => parseInt(betalkontoInput.value, 10);

    // Insättning/uttag är redan överföringar mellan bank och eget kapital —
    // där är betalkontovalet inte relevant och döljs.
    const uppdateraBetalkonto = () => {
      const mall = valdMall();
      betalkontoLabel.hidden = mall.typ === "insättning" || mall.typ === "uttag";
      betalkontoInput.value = String(mall.betalkonto);
    };

    const kontonamn = (id: number) =>
      aliases.value.find((alias) => alias.id === id)?.to || "";

    const uppdateraPreview = () => {
      const belopp = beloppInput.valueAsNumber;

      if (!Number.isFinite(belopp) || belopp <= 0) {
        previewTable.hidden = true;
        return;
      }

      const postings = skapaPostings(valdMall(), belopp, valtBetalkonto());

      previewBody.innerHTML = postings
        .map(
          (posting) => `
            <tr>
              <td>${posting.account} ${kontonamn(posting.account)}</td>
              <td class="amount">${numberFormatter.format(posting.amount)}</td>
            </tr>
          `,
        )
        .join("");
      previewTable.hidden = false;
    };

    datumInput.value = new Date().toISOString().slice(0, 10);
    beskrivningInput.value = valdMall().beskrivning;
    uppdateraBetalkonto();

    mallInput.addEventListener("change", () => {
      beskrivningInput.value = valdMall().beskrivning;
      uppdateraBetalkonto();
      uppdateraPreview();
    });

    beloppInput.addEventListener("input", uppdateraPreview);
    betalkontoInput.addEventListener("change", uppdateraPreview);

    form.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const mall = valdMall();
      const belopp = beloppInput.valueAsNumber;

      if (!Number.isFinite(belopp) || belopp <= 0) {
        return;
      }

      const transaktion = skapaTransaktion(
        mall,
        datumInput.value,
        belopp,
        beskrivningInput.value.trim(),
        valtBetalkonto(),
      );

      transactions.value = [...transactions.value, transaktion];

      status.textContent = `✓ ${transaktion.date} ${transaktion.description} tillagd`;
      beloppInput.value = "";
      previewTable.hidden = true;
    });
  });
}

export default registerFunctionComponent(NewTransaction, {
  name: "new-transaction",
});
