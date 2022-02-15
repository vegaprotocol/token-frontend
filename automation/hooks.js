class Hooks {
  connectEthWallet() {
    const baseUrl = browser.options.baseUrl
    
    browser.url(baseUrl);
    browser.switchWindow(baseUrl);
    $('input[name="password"]').waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "password field not displayed in 10 secondss",
    });
    $('input[name="password"]').setValue("hedgehog");
    $(".button").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Button not displayed in 10 seconds",
    });
    $(".button").click();
    browser.switchWindow("MetaMask");
    $(".button").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Button not displayed",
    });
    $(".button").click();
    $(".button").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Button not displayed",
    });
    $(".button").click();
    browser
      .getByTestId("page-container-footer-next")
      .waitForDisplayed({ timeout: 10000, timeoutMsg: "Button not displayed" });
    browser.getByTestId("page-container-footer-next").click();
    $(
      'input[placeholder="Paste Secret Recovery Phrase from clipboard"]'
    ).setValue(
      "unable exercise exact daring steel lend hurt royal hour mountain poverty place"
    );
    $("#password").setValue("Devtest123");
    $("#confirm-password").setValue("Devtest123");
    $$('div[role="checkbox"]')[1].click();
    $('button[type="submit"]').click();
    $("button=All Done").click();
    $('[data-testid="popover-close"]').waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "popover-close Button not displayed",
    });
    $('[data-testid="popover-close"]').click();
    browser.url(
      "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/advanced"
    );
    $(
      '[data-testid="advanced-setting-show-testnet-conversion"]'
    ).scrollIntoView();
    $(
      '//*[@id="app-content"]/div/div[3]/div/div[2]/div[2]/div[2]/div[7]/div[2]/div/div/div[1]/div[1]'
    ).click({ force: true });
    $(".network-display").scrollIntoView();
    $(".network-display").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "etwork-display Button not displayed",
    });
    $(".network-display").click();
    $(".network-name-item=Ropsten Test Network").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Ropsten Test Network Button not displayed",
    });
    $(".network-name-item=Ropsten Test Network").click();
    browser.closeWindow();
    browser.switchWindow(baseUrl);
    $('[data-test-id="connect-to-eth-wallet-button"]').waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Connect Eth Button not displayed",
    });
    $('[data-test-id="connect-to-eth-wallet-button"]').click();
    $(".web3modal-provider-name*=Injected").click();
    browser.pause(1500);
    browser.switchWindow("MetaMask Notification");
    $("button=Next").click();
    $("button=Connect").click();
    browser.switchWindow(baseUrl);
  }
}

module.exports = new Hooks();
