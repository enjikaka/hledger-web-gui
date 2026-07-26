import { effect } from "@preact/signals-core";
import { registerFunctionComponent } from "webact";
import { availableYears, selectedYear } from "../signals.ts";
import type { WebactThis } from "../webact-types.ts";

function YearPicker(this: WebactThis) {
  const { $, html, css, postRender } = this;

  html`
    <label>
      År
      <select></select>
    </label>
  `;

  css`
    label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    select {
      font: inherit;
      padding: 0.2rem 0.4rem;
    }
  `;

  postRender(() => {
    const select = $("select");

    effect(() => {
      const years = availableYears.value;
      const current = selectedYear.value;

      select.innerHTML = years
        .map((year) => `<option value="${year}">${year}</option>`)
        .join("");

      // Behåll valt år om det finns kvar, annars senaste året
      if (years.includes(current)) {
        select.value = current;
      } else {
        select.value = years[0];
        selectedYear.value = years[0];
      }
    });

    select.addEventListener("change", () => {
      selectedYear.value = select.value;
    });
  });
}

export default registerFunctionComponent(YearPicker, {
  name: "year-picker",
});
