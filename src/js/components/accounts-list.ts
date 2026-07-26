import { effect } from "@preact/signals-core";
import { Component, registerComponent } from "webact";
import type { Account } from "../parse-journal-file";
import { accounts, aliases } from "../signals";

class AccountsList extends Component {
  componentDidMount() {
    this.updateAccountsList(accounts.value);

    effect(() => this.updateAccountsList(accounts.value));
  }

  updateAccountsList(accounts: Array<Account>) {
    const $ol = this.$("ol");

    if ($ol) {
      if (accounts.length === 0) {
        $ol.innerHTML = `Inga konton`;
      } else {

        $ol.innerHTML = accounts
          .map((account) => {
            const alias = aliases.value.find(a => a.to === account.name);

            return `<li>${alias?.id} ${account.name}</li>`;
          })
          .join("");
      }
    } else {
      console.warn("ol element not found in shadow DOM");
    }
  }

  render() {
    return `
        <ol></ol>
    `;
  }
}

export default registerComponent(AccountsList, {
  name: "accounts-list",
});
