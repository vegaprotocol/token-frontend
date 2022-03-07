const Page = require("./page");

class HomePage extends Page {
  get tokenAddressTestId() {
    return "token-address";
  }
  get vestingAddressTestId() {
    return "token-contract";
  }
  get totalSupplyTestId() {
    return "total-supply";
  }
  get associatedTokensTestId() {
    return "associated";
  }
  get stakedTokensTestId() {
    return "staked";
  }
  get vegaWalletLink() {
    return $('[data-test-id="get-vega-wallet-link"]');
  }
  get tokenAddressLink() {
    return $('[data-testid="token-address"] > span > span > a');
  }
  get vestingLink() {
    return $('[data-testid="token-contract"] > span > span > a');
  }
  get associatedTokensLink() {
    return $("[data-test-id='associate-vega-tokens-link-on-homepage'] > a");
  }
  get checkVestingBtn() {
    return $("[data-test-id='check-vesting-page-btn']");
  }
  getNavBarElement(tab) {
    return $(".nav-links").$("a=" + tab);
  }
}

module.exports = new HomePage();
