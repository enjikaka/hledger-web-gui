import { registerFunctionComponent } from "webact";

function DateSquare() {
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