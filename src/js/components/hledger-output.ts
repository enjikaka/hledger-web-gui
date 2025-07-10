import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { hledgerOutput } from "../signals";

class HledgerOutput extends Component {
  componentDidMount() {
    effect(() => {
      this.updatePreview(hledgerOutput.value);
    });
  }

  updatePreview(content: string) {
    const pre = this.$("pre");

    if (pre) {
      console.log("pre", pre);
      pre.textContent = content;
    } else {
      console.warn("pre element not found in shadow DOM");
    }
  }

  render() {
    return `<output><pre></pre></output>`;
  }
}

export default registerComponent(HledgerOutput, {
  name: "hledger-output",
});
