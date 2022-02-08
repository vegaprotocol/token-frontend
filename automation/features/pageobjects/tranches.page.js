const Page = require("./page");

class TranchesPage extends Page {
  get trancheTestId() {
    return "tranche-item";
  }

  get firstTrancheUnlockedTokens() {
    return $(
      ".tranche-item__progress-contents:nth-child(3) > span:nth-child(2)"
    );
  }

  get trancheLink() {
    return $("[data-testid='tranche-item'] > .tranche-item__header > a");
  }

  get trancheUserList() {
    return $$(".tranche__user-list--item");
  }
}

module.exports = new TranchesPage();
