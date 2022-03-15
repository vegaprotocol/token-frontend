const { Given, When, Then } = require("@wdio/cucumber-framework");
const { cy } = require("date-fns/locale");
const StakingPage = require("../pageobjects/staking.page");
let currentAmountOfTokensInWallet =''

Then(/^I can see the validator node list$/, () => {
  const nodeList = $(".node-list").$$('[data-testid="node-list-item"]');
  expect(nodeList.length).toBeGreaterThan(0);
});

When(/^I associate some tokens from wallet$/,()=>{
    browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
  if (browser.getByTestId('associate-more-tokens-btn').isDisplayed()){
    browser.getByTestId('associate-more-tokens-btn').click()
  } else browser.getByTestId('associate-tokens-btn').click()
  $('[data-testid="associate-radio-wallet"]').click({force:true})
    browser.pause(1000)
    browser.getByTestId('token-amount-input').setValue(0.00001)
    browser.pause(1000)
    browser.getByTestId('token-input-submit-button').click()
    browser.waitUntil(() => browser.getWindowHandles().length > 1);
    browser.switchWindow("MetaMask Notification");
    $('button=Confirm').click()
    browser.switchWindow("VEGA");
    browser.pause(2000)
})

When(/^I can see the pending transactions button is shown$/,()=>{
  browser.getByTestId('pending-transactions-btn').waitForDisplayed({timeout:20000,reverse:false,timeoutMsg: "Pending transactions button was not found"})
    console.log(  browser.getByTestId('pending-transactions-btn').getText())
  expect(browser.getByTestId('pending-transactions-btn')).toHaveText('Pending transactions')
})

When(/^I click on use maximum button$/,()=>{
  // currentAmountOfTokensInWallet = $(".wallet-card__asset-balance").getText()
    browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
    if (browser.getByTestId('associate-more-tokens-btn').isDisplayed()){
    browser.getByTestId('associate-more-tokens-btn').click()
  } else browser.getByTestId('associate-tokens-btn').click()
  $('[data-testid="associate-radio-wallet"]').click({force:true})
  currentAmountOfTokensInWallet = $(".wallet-card__asset-balance").getText()
  browser.getByTestId("token-amount-use-maximum").click()
})

When(/^I can see the maximum amount of tokens in my wallet are in the token input box$/,()=>{
  const noZeroes = currentAmountOfTokensInWallet.toString();
  const noZeroesFloat = parseFloat(noZeroes)
  expect(browser.getByTestId('token-amount-input').getValue()).toBe(String(noZeroesFloat))
})



