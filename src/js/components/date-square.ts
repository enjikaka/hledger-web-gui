import { registerFunctionComponent } from "webact";
import type { WebactThis } from "../webact-types.ts";

function DateSquare(this: WebactThis) {
    const { html, css } = this;

    css``;

    html`
        <span></span>
        <span></span>
    `;
}

export default registerFunctionComponent(DateSquare, {
    name: 'date-square'
});