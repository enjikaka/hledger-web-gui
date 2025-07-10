import { registerFunctionComponent } from "webact";

import { parseJournalFile } from "../parse-journal-file.ts";
import * as Signals from "../signals.ts";

function IndexPage() {
  const { $, html, postRender } = this;

  html`
    <h1>Bokföringsprogram</h1>
    <p>Öppna din journal-fil för att börja hantera dina transaktioner och konton.</p>
    <input type="file" id="journalFile" accept=".journal" />
    <output id="output"></output>
  `;

  postRender(() => {
    const fileInput = $("#journalFile");
    const output = $("#output");

    fileInput?.addEventListener("change", async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];

      if (file) {
        for await (const item of parseJournalFile(file)) {
          switch (item.type) {
            case "account":
              Signals.accounts.value = [...Signals.accounts.value, item.data];
              break;
            case "alias":
              Signals.aliases.value = [...Signals.aliases.value, item.data];
              break;
            case "transaction":
              Signals.transactions.value = [
                ...Signals.transactions.value,
                item.data,
              ];
              break;
          }
        }

        document.dispatchEvent(
          new CustomEvent("router:navigate", {
            detail: {
              pathname: "/transactions",
            },
          }),
        );
      } else {
        output.textContent = "Ingen fil vald.";
      }
    });
  });
}

export default registerFunctionComponent(IndexPage, {
  name: "index-page",
});
