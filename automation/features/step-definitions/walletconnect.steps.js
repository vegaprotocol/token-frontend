const { Given, When, Then } = require('@wdio/cucumber-framework');
// const Hooks = require('../../Hooks');

// const LoginPage = require('../pageobjects/login.page');
// const SecurePage = require('../pageobjects/secure.page');

// const pages = {
//     login: LoginPage
// }

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


When(/^I connect hosted wallet$/,()=>{
    $('[data-test-id="connect-to-vega-wallet-btn"]').click()
    browser.pause(1000)
    $('[data-testid="wallet-name"]').setValue('UI_TEST_1')
    browser.pause(1000)
    $('[data-testid="wallet-password"]').setValue('dev12345')
    browser.pause(1000)
    $('[data-testid="wallet-login"]').click()
})
