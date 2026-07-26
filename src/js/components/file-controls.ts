import { effect } from "@preact/signals-core";
import { registerFunctionComponent } from "webact";
import { saveJournal } from "../journal-file.ts";
import { fileName, transactions } from "../signals.ts";
import type { WebactThis } from "../webact-types.ts";

const timeFormatter = new Intl.DateTimeFormat("sv-SE", {
  hour: "2-digit",
  minute: "2-digit",
});

function FileControls(this: WebactThis) {
  const { $, html, css, postRender } = this;

  html`
    <button type="button" hidden>Spara</button>
    <span class="status" role="status"></span>
  `;

  css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    button {
      font: inherit;
      padding: 0.2rem 0.8rem;
    }

    .status {
      font-size: 0.8rem;
    }
  `;

  postRender(() => {
    const button = $("button");
    const status = $(".status");

    effect(() => {
      // Visa Spara så fort det finns något att spara
      button.hidden = transactions.value.length === 0 && !fileName.value;
    });

    button.addEventListener("click", async () => {
      try {
        const result = await saveJournal();

        status.textContent =
          result === "saved"
            ? `Sparad ${timeFormatter.format(new Date())}`
            : "Nedladdad";
      } catch (e) {
        status.textContent = "Kunde inte spara!";
        console.error(e);
      }
    });
  });
}

export default registerFunctionComponent(FileControls, {
  name: "file-controls",
});
