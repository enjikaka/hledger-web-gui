import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import type { Account } from "../parse-journal-file";
import { accounts } from "../signals";

class AccountsList extends Component {
  componentDidMount() {
    effect(() => {
      this.updateAccountsList(accounts.value);
    });
  }

  updateAccountsList(accounts: Array<Account>) {
    const $ol = this.$("ol");

    if ($ol) {
      $ol.innerHTML = accounts
        .map((account) => `<li>${account.name}</li>`)
        .join("");
    } else {
      console.warn("ol element not found in shadow DOM");
    }
  }

  render() {
    return `
        <ol>

        </ol>
    `;
  }
}

export default registerComponent(AccountsList, {
  name: "accounts-list",
});
