class Page {
  get vestingLink() {
    return $("Vesting");
  }
  get stakingLink() {
    return $("Staking");
  }
  get rewardsLink() {
    return $("Rewards");
  }
  get withdrawLink() {
    return $("Withdraw");
  }
  get governanceLink() {
    return $("Governance");
  }
  get liquidityLink() {
    return $("DEX Liquidity");
  }
  get notFoundUrl() {
    return "not-found";
  }
  get notFoundText() {
    return "This page can not be found, please check the URL and try again.";
  }
  get connectVegaWalletTestId() {
    return "connect-to-vega-wallet-btn";
  }
  get hostedWalletInput() {
    return $('Input[name="hostedWallet"]');
  }
  get vegaWalletUserNameTestId() {
    return "wallet-name";
  }
  get vegaWalletPasswordTestId() {
    return "wallet-password";
  }
  get vegaWalletLoginTestId() {
    return "wallet-login";
  }
  get connectEthWallet() {
    return $("[data-test-id='connect-to-eth-wallet-button']");
  }
  get disconnectWalletBtn() {
    return browser.getByTestId("disconnect-vega-wallet-btn-link");
  }
  get connectMetaMask() {
    return $(".web3modal-provider-name*=Injected");
  }

  goTo(path) {
    browser.url(path);
  }

  connectToEthWallet() {
    this.connectEthWallet.click();
    this.connectMetaMask.click();
  }

  confirmTransactionSpeedUp() {
    browser.waitUntil(() => browser.getWindowHandles().length > 1);
    browser.switchWindow("MetaMask Notification");
    $(".transaction-detail-edit").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Edit gas fee link did not display in 10 seconds",
    });
    $("button=Edit").click();
    $(".edit-gas-display__content").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Edit gas fee modal did not display in 10 seconds",
    });
    $('input[value="high"]').click();
    $("button=Save").waitForClickable({
      timeout: 10000,
      timeoutMsg: "save button not clickable after 10 seconds",
    });
    $("button=Save").click();
    $(".edit-gas-display__content").waitForDisplayed({
      timeout: 10000,
      reverse: true,
      timeoutMsg: "Edit gas fee modal did not disappear in 10 seconds",
    });
    $("button=Confirm").click();
    browser.switchWindow("VEGA");
  }
}

module.exports = Page;
