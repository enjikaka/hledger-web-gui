import { registerFunctionComponent } from "webact";

import {
  openJournal,
  parseFileIntoSignals,
  reopenLastJournal,
  storedFileName,
  supportsFileSystemAccess,
} from "../journal-file.ts";
import type { WebactThis } from "../webact-types.ts";

function IndexPage(this: WebactThis) {
  const { $, html, css, postRender } = this;

  html`
    <h1>Bokföringsprogram</h1>
    <p>Öppna din journal-fil för att börja hantera dina transaktioner och konton.</p>
    <button id="open" type="button">Öppna journal-fil…</button>
    <button id="reopen" type="button" hidden></button>
    <input type="file" id="fallback" accept=".journal,.hledger,.j" hidden />
    <output id="output"></output>
  `;

  css`
    button {
      font: inherit;
      padding: 0.5rem 1rem;
    }

    output {
      display: block;
      margin-block-start: 0.75rem;
    }
  `;

  const goToTransactions = () => {
    document.dispatchEvent(
      new CustomEvent("router:navigate", {
        detail: { pathname: "/transactions" },
      }),
    );
  };

  postRender(() => {
    const openButton = $("#open");
    const reopenButton = $("#reopen");
    const fallbackInput = $("#fallback");
    const output = $("#output");

    if (supportsFileSystemAccess()) {
      openButton.addEventListener("click", async () => {
        try {
          await openJournal();
          goToTransactions();
        } catch (e) {
          // Avbruten filväljare är inget fel
          if (!(e instanceof DOMException && e.name === "AbortError")) {
            output.textContent = "Kunde inte öppna filen.";
            console.error(e);
          }
        }
      });

      // Visa "fortsätt med senaste filen" om ett handtag finns sparat
      storedFileName().then((name) => {
        if (name) {
          reopenButton.textContent = `Fortsätt med ${name}`;
          reopenButton.hidden = false;
        }
      });

      reopenButton.addEventListener("click", async () => {
        if (await reopenLastJournal()) {
          goToTransactions();
        } else {
          output.textContent = "Kunde inte återöppna filen — välj den manuellt.";
        }
      });
    } else {
      // Safari/Firefox: vanlig filväljare, spara sker via nedladdning
      openButton.addEventListener("click", () => fallbackInput.click());

      fallbackInput.addEventListener("change", async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (file) {
          await parseFileIntoSignals(file);
          goToTransactions();
        }
      });
    }
  });
}

export default registerFunctionComponent(IndexPage, {
  name: "index-page",
});
