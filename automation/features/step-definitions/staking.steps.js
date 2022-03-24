const { Given, When, Then } = require("@wdio/cucumber-framework");
const StakingPage = require("../pageobjects/staking.page");
let currentAmountOfTokensInWallet =''
let validatorName =''

When(/^I associate some tokens from wallet$/,()=>{
    browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
  if (browser.getByTestId('associate-more-tokens-btn').isDisplayed()){
    browser.getByTestId('associate-more-tokens-btn').click()
  } else browser.getByTestId('associate-tokens-btn').click()
  browser.getByTestId('associate-radio-wallet').click({force:true})
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

When(/^I associate some tokens from vesting contract$/,()=>{
    browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
  if (browser.getByTestId('associate-more-tokens-btn').isDisplayed()){
    browser.getByTestId('associate-more-tokens-btn').click()
  } else browser.getByTestId('associate-tokens-btn').click()
  browser.getByTestId('associate-radio-contract').click({force:true})
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

When(/^I disassociate some tokens from wallet$/,()=>{
  browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
  browser.getByTestId("disassociate-tokens-btn").waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "disassociate btn  was not found"})
  browser.getByTestId("disassociate-tokens-btn").click()
  browser.pause(4000)
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

When(/^I disassociate some tokens from vesting contract$/,()=>{
    browser.getByTestId('callout').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "callout was not found"})
  // if (browser.getByTestId('associate-more-tokens-btn').isDisplayed()){
  //   browser.getByTestId('associate-more-tokens-btn').click()
  // } else browser.getByTestId('associate-tokens-btn').click()

  browser.getByTestId("disassociate-tokens-btn").waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "disassociate btn  was not found"})
  browser.getByTestId("disassociate-tokens-btn").click()
  browser.pause(4000)
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

Then(/^I can see the validator node list$/,()=>{
expect(browser.getByTestId('validator-node-list')).toBeDisplayed()
  const nodeList = $(".node-list").$$('[data-testid="node-list-item"]');
  expect(nodeList.length).toBeGreaterThan(0);
})

Then(/^the epoch countdown timer is counting down$/,()=>{
const currentCountdownTimerText = browser.getByTestId('current-epoch-ends-in').getText()
browser.pause(2100) // let some time pass 
expect(browser.getByTestId('current-epoch-ends-in').getText()).not.toEqual(currentCountdownTimerText)
})

Then(/^I pause some seconds$/,()=>{
browser.pause(60000)
})

When(/^I click on a validator$/,()=>{
  browser.pause(2000)

// $$('.node-list__item-name"]').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "Validator list not displayed"})
validatorName = $$('.node-list__item-name')[0].getText()
// $$('.node-list__item-name"]').waitForClickable({timeout:30000,reverse:false,timeoutMsg: "Validator list not clickable"})

$$('.node-list__item-name')[0].click()
})

Then(/^I am taken to the correct validator page$/,()=>{
$('[data-test-id="validator-node-title"]').waitForDisplayed({timeout:30000,reverse:false,timeoutMsg: "Validator name heading not displayed"})
const validatorHeadingNameCurrent = $('[data-test-id="validator-node-title"]').getText()
expect(validatorHeadingNameCurrent).toEqual(`VALIDATOR: ${validatorName}`)

})







