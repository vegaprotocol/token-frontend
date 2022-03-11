const { Given, When, Then } = require('@wdio/cucumber-framework');
// const Hooks = require('../../Hooks');

// const LoginPage = require('../pageobjects/login.page');
// const SecurePage = require('../pageobjects/secure.page');

// const pages = {
//     login: LoginPage
// }

Then(/^I can see my ethereum key (.*) is shown$/,  (ethKey) => {
    console.log($('.callout__title').getText())
    expect($('.callout__title').getText()).toContain(`Ethereum wallet connected: ${ethKey.replace("'", "")}`)
    
});

When(/^I connect hosted wallet$/,()=>{
  $('[data-test-id="connect-to-vega-wallet-btn"]').waitForDisplayed({timeout:10000,timeoutMsg:"connect to vega wallet did not display"})
  $('[data-test-id="connect-to-vega-wallet-btn"]').click()
  browser.getByTestId('wallet-name').waitForDisplayed({timeout:10000,timeoutMsg:"wallet name field not displayed"})
  browser.getByTestId('wallet-name').setValue('UI_TEST_1')
  browser.getByTestId('wallet-password').waitForDisplayed({timeout:10000,timeoutMsg:"wallet password field not displayed"})
  browser.getByTestId('wallet-password').setValue('dev12345')
  browser.getByTestId('wallet-login').waitForClickable({ timeout:1000, timeoutMsg:"wallet login button not clickable after 10 seconds" })
  browser.getByTestId('wallet-login').click()
})
