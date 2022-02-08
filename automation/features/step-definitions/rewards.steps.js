const { Given, When, Then } = require("@wdio/cucumber-framework");
const RewardsPage = require("../pageobjects/rewards.page");

Then(/^I can see the rewards epoch timer displayed$/,  () => {
    const epochTimer =  RewardsPage.epochTimer
    let epochTimerTxt =  epochTimer.getText()
     expect(epochTimerTxt).toContain('Next epoch in')
     expect(epochTimerTxt.length).toBeGreaterThan(12)
  });

Then(/^I can see the connected vega wallet key$/,  () => {
    const walletKey =  RewardsPage.vegaWalletKey
    expect( walletKey.getText()).toHaveText()

});