const { Given, Then } = require("@wdio/cucumber-framework");
const rewardsPage = require("../pageobjects/rewards.page");

Given(/^I have not earned any rewards$/, () => {});

Given(/^I have earned rewards$/, () => {});

Then(/^I can see the rewards epoch timer displayed$/, () => {
  const epochTimer = rewardsPage.epochTimer;
  let epochTimerTxt = epochTimer.getText();
  expect(epochTimerTxt).toContain("Next epoch in");
  expect(epochTimerTxt.length).toBeGreaterThan(12);
});

Then(/^I can see the connected vega wallet key$/, () => {
  const walletKey = rewardsPage.vegaWalletKey;
  expect(walletKey.getText()).toHaveText();
});

Then(/^the rewards table is displayed$/, () => {
  const rewardTables = rewardsPage.rewardTables;
  expect(rewardTables.length).toBeGreaterThan(0);
});

Then(/^the rewards table is not displayed$/, () => {
  const rewardTables = rewardsPage.rewardTables;
  expect(rewardTables.length).toBe(0);
});

Then(/^no reward message is shown$/, () => {
  const displayedMsg = rewardsPage.noRewardMsg;
  console.log(displayedMsg.getText());
  expect(displayedMsg.getText()).toBe(
    "This Vega key has not received any rewards."
  );
});
Then(/^the connect to vega wallet is shown$/, () => {
  rewardsPage.vegaWalletConnectBtn.waitForDisplayed({
    timeoutMsg: "connect to vega wallet button not displayed",
  });
  expect(rewardsPage.vegaWalletConnectBtn).toHaveText("Connect Vega wallet");
});

Then(/^the rewards epoch countdown is not displayed$/, () => {
  expect(rewardsPage.epochRewardsCountdownTimer).not.toBeDisplayed();
});
