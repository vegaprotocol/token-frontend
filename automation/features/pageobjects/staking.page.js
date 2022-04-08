const Page = require("./page");

class StakingPage extends Page {
  get validatorListTestId() {
    return "node-list-item";
  }

  get etherscanLink() {
    return browser.getByTestId("etherscan-link");
  }

  get pendingTransactionsBtn() {
    return browser.getByTestId("pending-transactions-btn");
  }

  get pendingTransactionsModalStatus() {
    return $(".transactions-modal__status");
  }

  get associateMoreTokensBtn() {
    return browser.getByTestId("associate-more-tokens-btn");
  }

  get associateTokensBtn() {
    return browser.getByTestId("associate-tokens-btn");
  }

  get disassociateTokensBtn() {
    return browser.getByTestId("disassociate-tokens-btn");
  }

  get calloutContainer() {
    return browser.getByTestId("callout");
  }

  get walletRadioBtn() {
    return browser.getByTestId("associate-radio-wallet");
  }

  get vestingContractRadioBtn() {
    return browser.getByTestId("associate-radio-contract");
  }

  get tokenAmountInputField() {
    return browser.getByTestId("token-amount-input");
  }

  get tokenAmountSubmitBtn() {
    return browser.getByTestId("token-input-submit-button");
  }

  get backToStakingPageBtn() {
    return browser.getByTestId("back-to-staking-link");
  }

  get removeStakeNowBtn() {
    return browser.getByTestId("remove-stake-now-btn");
  }

  get removeStakeNowDisclaimerText() {
    return browser.getByTestId("remove-stake-now-disclaimer");
  }

  associateTokens(tokenAmount, source) {
    this.calloutContainer.waitForDisplayed({
      timeout: 30000,
      reverse: false,
      timeoutMsg: "callout was not found",
    });
    browser.pause(1000);
    if (this.associateMoreTokensBtn.isDisplayed()) {
      this.associateMoreTokensBtn.click();
    } else this.associateTokensBtn.click();
    switch (source.toLowerCase()) {
      case "wallet":
        this.walletRadioBtn.click({ force: true });
        break;
      case "vesting contract":
        this.vestingContractRadioBtn.click({ force: true });
        break;
      default:
        throw new Error("Options available : [wallet , vesting contract]");
    }
    this.tokenAmountInputField.setValue(tokenAmount);
    this.tokenAmountSubmitBtn.click();
    this.confirmTransactionSpeedUp();
  }

  disassociateTokens(tokenAmount, source) {
    this.calloutContainer.waitForDisplayed({
      timeout: 30000,
      reverse: false,
      timeoutMsg: "callout was not found",
    });
    this.disassociateTokensBtn.waitForDisplayed({
      timeout: 30000,
      reverse: false,
      timeoutMsg: "disassociate btn  was not found",
    });
    this.disassociateTokensBtn.click();
    switch (source.toLowerCase()) {
      case "wallet":
        this.walletRadioBtn.click({ force: true });
        break;
      case "vesting contract":
        this.vestingContractRadioBtn.click({ force: true });
        break;
      default:
        throw new Error("Options available : [wallet , vesting contract]");
    }
    this.tokenAmountInputField.setValue(tokenAmount);
    this.tokenAmountSubmitBtn.click();
    this.confirmTransactionSpeedUp();
  }
}

module.exports = new StakingPage();
