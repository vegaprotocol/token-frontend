const { Given, When, Then } = require("@wdio/cucumber-framework");
const stakingPage = require("../pageobjects/staking.page");
let currentAmountOfTokensInWallet =''
let validatorName =''

When(/^I associate some tokens from wallet$/,()=>{
stakingPage.associateTokensThroughWallet()
})

When(/^I associate some tokens from vesting contract$/,()=>{
  stakingPage.associateTokensThroughVestingContract()
})

When(/^I disassociate some tokens from wallet$/,()=>{
stakingPage.disassociateTokensThroughWallet()
})

When(/^I disassociate some tokens from vesting contract$/,()=>{
stakingPage.disassociateTokensThroughVestingContract()
})

When(/^I can see the pending transactions button is shown$/,()=>{
  browser.getByTestId('pending-transactions-btn').waitForDisplayed({timeout:20000,reverse:false,timeoutMsg: "Pending transactions button was not found"})
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

When(/^I click the button to disassociate$/,()=>{
  browser.getByTestId('disassociate-tokens-btn').waitForDisplayed({timeout:30000, timeoutMsg:"disassociate button not displayed"})
  browser.getByTestId('disassociate-tokens-btn').click()
})

When(/^I click on the "([^"]*)?" radio button$/, (radioButton) => {
switch(radioButton) {
  case "wallet":
    $('label=Wallet').waitForDisplayed({timeoutMsg:"Wallet radio btn not displayed"})
    browser.getByTestId('associate-radio-wallet').click({force:true})
  break;
  case "vesting contract":
    $('label=Vesting contract').waitForDisplayed({timeoutMsg:"Vesting contract radio btn not displayed"})
    browser.getByTestId('associate-radio-contract').click({force:true})
    break;
  default:
    console.info(`${radioButton} Option not on list`)
  }
});

When(/^I enter "([^"]*)?" tokens in the input field$/, (tokenAmount) => {
  browser.getByTestId('token-amount-input').setValue(tokenAmount)
  expect(browser.getByTestId('token-amount-input')).toHaveValueContaining(tokenAmount)
});

Then(/^the token submit button is disabled$/, () => {
  expect(browser.getByTestId('token-input-submit-button')).toBeDisabled()
});

When(/^I select to "([^"]*)?" stake$/, (stakeAction) => {
  switch(stakeAction) {
  case "Add":
    $('label=Add').waitForDisplayed({timeoutMsg:"Add stake radio button not displayed"})
    browser.getByTestId('add-stake-radio').click({force:true})
  break;
  case "Remove":
    $('label=Remove').waitForDisplayed({timeoutMsg:"Remove stake radio button not displayed"})
    browser.getByTestId('remove-stake-radio').click({force:true})
    break;
  default:
    console.info(`${stakeAction} stake Not an option`)
  }
});

Then(/^I can submit the stake successfully$/, () => {
    expect(browser.getByTestId('token-input-submit-button')).toBeEnabled()
    browser.getByTestId('token-input-submit-button').click()
});




