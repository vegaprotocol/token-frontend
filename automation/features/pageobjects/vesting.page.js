import Page from "./page";

class VestingPage extends Page {
  get trancheItemTestId() {
    return "tranche-item";
  }
  get validatorNodeTitle() {
    return $('data-test-id="validator-node-title"]');
  }
  get validatorTableTestId() {
    return "validator-table";
  }
  get epochCountDownTestId() {
    return "epoch-countdown";
  }
  get stakeInfoTestId() {
    return "your-stake";
  }
  get removeStakeBtnTestId() {
    return "remove-stake-radio";
  }
  get tokenAmountInputTestId() {
    return "token-amount-input";
  }
  get tokenSubmitBtnTestId() {
    return "token-input-submit-button";
  }
  get tokenMaxAmountBtnTestId() {
    return "token-amount-use-maximum";
  }
}

module.exports = new VestingPage();
