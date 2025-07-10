import { registerFunctionComponent } from "webact";
import AccountsPage from "./pages/accounts-page.ts";
import IndexPage from "./pages/index-page.ts";
import MomsrapportPage from "./pages/momsrapport-page.ts";
import TransactionsPage from "./pages/transactions-page.ts";

function AppRouter() {
  const { postRender, $, html } = this;

  let currentAbortController: AbortController | null = null;

  html`<slot></slot>`;

  async function renderRoute(pathname: string) {
    try {
      // Abort any ongoing request
      if (currentAbortController) {
        currentAbortController.abort();
      }
      currentAbortController = new AbortController();

      const timerId = `[renderRoute] ${pathname}`;
      console.time(timerId);
      const hostElement = $(":host");

      switch (pathname) {
        case "/":
          hostElement.innerHTML = `<${IndexPage}></${IndexPage}>`;
          break;
        case "/transactions":
          hostElement.innerHTML = `<${TransactionsPage}></${TransactionsPage}>`;
          break;
        case "/accounts":
          hostElement.innerHTML = `<${AccountsPage}></${AccountsPage}>`;
          break;
        case "/momsrapport":
          hostElement.innerHTML = `<${MomsrapportPage}></${MomsrapportPage}>`;
          break;
        default:
          hostElement.innerHTML = "Sidan finns ej.";
      }

      hostElement.dispatchEvent(
        new CustomEvent("navigated", {
          detail: pathname,
        }),
      );

      console.timeEnd(timerId);
    } catch (e) {
      // Only log errors that aren't from aborting
      if (e.name !== "AbortError") {
        console.error("Could not render route");
        console.error(e);
      }
    }
  }

  postRender(async () => {
    renderRoute(document.location.pathname + document.location.search);

    document.addEventListener("router:navigate", (event) => {
      if (event instanceof CustomEvent) {
        renderRoute(event.detail.pathname);
        history.pushState(null, null, event.detail.pathname);
      }
    });

    window.addEventListener(
      "popstate",
      () => renderRoute(document.location.pathname + document.location.search),
      false,
    );
  });
}

function RouterLink() {
  const { $, css, html, postRender } = this;

  html`<slot></slot>`;

  css`
  :host {
    cursor: pointer;
    color: currentColor;
  }
  `;

  postRender(() => {
    /** @type {HTMLElement} */
    const routerLink = $(":host");

    routerLink.addEventListener("click", () => {
      const url = new URL($().getAttribute("href"), document.location.href);
      const pathname = url.pathname + url.search;

      document.dispatchEvent(
        new CustomEvent("router:navigate", {
          detail: {
            pathname,
          },
        }),
      );
    });
  });
}

registerFunctionComponent(RouterLink, {
  name: "router-link",
  shadowRootMode: "open",
});

export default registerFunctionComponent(AppRouter, {
  name: "app-router",
  shadowRootMode: "open",
});
