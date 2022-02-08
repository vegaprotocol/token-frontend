const { Given, When, Then } = require("@wdio/cucumber-framework");
const RewardsPage = require("../pageobjects/rewards.page");

Given(/^I have not earned any rewards$/, () => {});

Given(/^I have earned rewards$/, () => {});

Then(/^I can see the rewards epoch timer displayed$/, () => {
  const epochTimer = RewardsPage.epochTimer;
  let epochTimerTxt = epochTimer.getText();
  expect(epochTimerTxt).toContain("Next epoch in");
  expect(epochTimerTxt.length).toBeGreaterThan(12);
});

Then(/^I can see the connected vega wallet key$/, () => {
  const walletKey = RewardsPage.vegaWalletKey;
  expect(walletKey.getText()).toHaveText();
});

Then(/^the rewards table is displayed$/, () => {
  const rewardTables = RewardsPage.rewardTables;
  expect(rewardTables.length).toBeGreaterThan(0);
});

Then(/^the rewards table is not displayed$/, () => {
  const rewardTables = RewardsPage.rewardTables;
  expect(rewardTables.length).toBe(0);
});

Then(/^no reward message is shown$/, () => {
  const displayedMsg = RewardsPage.noRewardMsg;
  console.log(displayedMsg.getText());
  expect(displayedMsg.getText()).toBe(
    "This Vega key has not received any rewards."
  );
});
