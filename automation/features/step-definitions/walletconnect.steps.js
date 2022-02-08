const { Given, When, Then } = require('@wdio/cucumber-framework');
// const Hooks = require('../../Hooks');

// const LoginPage = require('../pageobjects/login.page');
// const SecurePage = require('../pageobjects/secure.page');

// const pages = {
//     login: LoginPage
// }
Given(/^I connect my ethereum wallet$/, () => {
    //  Hooks.connectEthWallet()
    browser.url("https://staging.token.vega.xyz/");
    browser.switchWindow("https://staging.token.vega.xyz/");
    $('input[name="password"]').waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "password field not displayed in 10 seconds",
    });
    $('input[name="password"]').setValue("hedgehog");
    $(".button").waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Button not displayed",
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
    browser.switchWindow("https://staging.token.vega.xyz/");
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
    browser.switchWindow("https://staging.token.vega.xyz/");
  

});

When(/^I wait$/,  () => {
     browser.pause(1)
});

When(/^I go to (.*)$/,  (site) => {
    //  browser.url(site)
     $('a=Staking').click()
     browser.pause(500)
});

Then(/^I can see my ethereum key (.*) is shown$/,  (ethKey) => {
    console.log($('.callout__title').getText())
    expect($('.callout__title').getText()).toContain(`Ethereum wallet connected: ${ethKey.replace("'", "")}`)
    
});

When(/^I nav to (.*)$/,  (site) => {
    browser.url('https://staging.token.vega.xyz/staking')
     browser.pause(5000)
});

When(/^I associate some tokens$/,()=>{

})

When(/^I connect hosted wallet$/,()=>{
    $('[data-test-id="connect-to-vega-wallet-btn"]').click()
    browser.pause(1000)
    // $('Input[name="hostedWallet"]').click({force:true})
    // browser.pause(1000)
    $('[data-testid="wallet-name"]').setValue('UI_TEST_1')
    browser.pause(1000)
    $('[data-testid="wallet-password"]').setValue('dev12345')
    browser.pause(1000)
    $('[data-testid="wallet-login"]').click()

    browser.pause(1000)

    
    
  
    
})






// When I navigate to 'https://dev.token.vega.xyz/staking'
// Then I can see my ethereum key '0x9804C6E98dA75e3271ccE3aA56728FD8e9376155' is shown