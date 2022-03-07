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

When(/^I associate some tokens$/,()=>{
// WIP
  //   const associatedamount= $(".wallet-card__price--decimal").getText()
  // console.log(associatedamount)
  //           console.log('11111')
  // if ($('button=Associate more $VEGA tokens with wallet').isDisplayed()){
  //   $('button=Associate more $VEGA tokens with wallet').click()
  // } else $('button=Associate $VEGA tokens with wallet').click()
  // $('[data-testid="associate-radio-wallet"]').click({force:true})
  // $('[data-testid="token-amount-input"]').setValue(0.00001)
  // $('[data-testid="token-input-submit-button"]').click()
  // browser.switchWindow("MetaMask Notification");
  // console.log('switching to metamask window')
  // $('button=Confirm').click()
})

When(/^I connect hosted wallet$/,()=>{
    $('[data-test-id="connect-to-vega-wallet-btn"]').click()
    browser.pause(1000)
    $('[data-testid="wallet-name"]').setValue('UI_TEST_1')
    browser.pause(1000)
    $('[data-testid="wallet-password"]').setValue('dev12345')
    browser.pause(1000)
    $('[data-testid="wallet-login"]').click()
})
