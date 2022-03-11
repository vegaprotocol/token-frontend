module.exports = {
    getByTestId: function (testId) {
        return $(`[data-testid="${testId}"]`)
    },

    connectToEthWallet: function() {
         const baseUrl = browser.options.baseUrl;
      browser.waitUntil(() => browser.getWindowHandles().length > 1);
      browser.switchWindow("MetaMask");
      $('.first-time-flow__button').waitForDisplayed({timeout: 20000,timeoutMsg: "Get started Button not displayed"});
      $('.first-time-flow__button').click();
      $('button=Import wallet').waitForDisplayed({timeout: 20000,timeoutMsg: "import wallet button not displayed"});
      $('button=Import wallet').click()
      browser.getByTestId("page-container-footer-next").waitForDisplayed({ timeout: 10000, timeoutMsg: "Button not displayed" });
      browser.getByTestId("page-container-footer-next").click();
      $('input[placeholder="Paste Secret Recovery Phrase from clipboard"]').setValue("unable exercise exact daring steel lend hurt royal hour mountain poverty place");
      $("#password").setValue("Devtest123");
      $("#confirm-password").setValue("Devtest123");
      $$('div[role="checkbox"]')[1].click();
      $('button[type="submit"]').click();
      $("button=All Done").click();
      $('[data-testid="popover-close"]').waitForDisplayed({timeout: 10000,timeoutMsg: "pop over close not display"});
      $('[data-testid="popover-close"]').click();
      browser.url("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/advanced");
      $('[data-testid="advanced-setting-show-testnet-conversion"]').scrollIntoView();
      $('//*[@id="app-content"]/div/div[3]/div/div[2]/div[2]/div[2]/div[7]/div[2]/div/div/div[1]/div[1]').click({ force: true });
      $(".network-display").scrollIntoView();
      $(".network-display").waitForDisplayed({timeout: 10000,timeoutMsg: "Network-display Button not displayed"});
      $(".network-display").click();
      $(".network-name-item=Ropsten Test Network").waitForDisplayed({timeout: 10000,timeoutMsg: "Ropsten Test Network Button not displayed"});
      $(".network-name-item=Ropsten Test Network").click();
      browser.closeWindow();
      browser.switchWindow(baseUrl);
      console.log('is connect to eth wallet displayed ?',$('[data-test-id="connect-to-eth-wallet-button"]').isDisplayed())
      if ($('[data-test-id="connect-to-eth-wallet-button"]').isDisplayed() === true){
      $('[data-test-id="connect-to-eth-wallet-button"]').click();
      $(".button*=Injected").click();
      browser.pause(2000)
      browser.switchWindow("MetaMask Notification");
      $("button=Next").click();
      $("button=Connect").click();
      browser.switchWindow(baseUrl);
    }
  }
    
}