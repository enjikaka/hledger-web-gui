import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import { transactions } from "../signals";

class JournalPreview extends Component {
  componentDidMount() {
    effect(() => {
      this.updateJournalPreview(JSON.stringify(transactions.value, null, 2));
    });
  }

  updateJournalPreview(content: string) {
    const pre = this.$("pre");

    if (pre) {
      console.log("pre", pre);
      pre.textContent = content;
    } else {
      console.warn("pre element not found in shadow DOM");
    }
  }

  render() {
    return `<pre></pre>`;
  }
}

export default registerComponent(JournalPreview, {
  name: "journal-preview",
});
