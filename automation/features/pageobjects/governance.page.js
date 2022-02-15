import Page from "./page";

class GovernancePage extends Page {
  get proposalStatesTestId() {
    return "governance-proposal-state";
  }
  get proposalTableTestId() {
    return "governance-proposal-table";
  }
  get propsalClosingDateTestId() {
    return "governance-proposal-closingDate";
  }
  get proposalEnactmentDateTestId() {
    return "governance-proposal-enactmentDate";
  }
}

module.exports = new GovernancePage();
