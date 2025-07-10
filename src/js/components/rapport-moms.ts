import { Component, registerComponent } from "webact";
import { formatMomsrapport, generateMomsrapport } from "../momsrapport";

class RapportMoms extends Component {
  render() {
    return `
        ${formatMomsrapport(generateMomsrapport("2025"))}
    `;
  }
}

export default registerComponent(RapportMoms, {
  name: "rapport-moms",
});
