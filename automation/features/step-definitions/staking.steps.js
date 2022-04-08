const { When, Then } = require("@wdio/cucumber-framework");
const stakingPage = require("../pageobjects/staking.page");
let currentAmountOfTokensInWallet = "";
let validatorName = "";

When(/^I associate some tokens from wallet$/, () => {
  stakingPage.associateTokensThroughWallet();
});

When(/^I associate some tokens from vesting contract$/, () => {
  stakingPage.associateTokensThroughVestingContract();
});

When(/^I disassociate some tokens from wallet$/, () => {
  stakingPage.disassociateTokensThroughWallet();
});

When(/^I disassociate some tokens from vesting contract$/, () => {
  stakingPage.disassociateTokensThroughVestingContract();
});

When(/^I can see the pending transactions button is shown$/, () => {
  stakingPage.pendingTransactionsBtn.waitForDisplayed({
    timeout: 20000,
    reverse: false,
    timeoutMsg: "Pending transactions button was not found",
  });
  expect(stakingPage.pendingTransactionsBtn).toHaveText("Pending transactions");
});

When(/^I click on use maximum button$/, () => {
  browser.getByTestId("callout").waitForDisplayed({
    timeout: 30000,
    reverse: false,
    timeoutMsg: "callout was not found",
  });
  if (stakingPage.associateMoreTokensBtn.isDisplayed()) {
    stakingPage.associateMoreTokensBtn.click();
  } else stakingPage.associateTokensBtn.click();
  $('[data-testid="associate-radio-wallet"]').click({ force: true });
  currentAmountOfTokensInWallet = browser
    .getByTestId("eth-wallet-balance")
    .getText();
  browser.getByTestId("token-amount-use-maximum").click();
});

When(
  /^I can see the maximum amount of tokens in my wallet are in the token input box$/,
  () => {
    const noZeroes = currentAmountOfTokensInWallet.toString();
    const noZeroesFloat = parseFloat(noZeroes.replace(",", ""));
    expect(browser.getByTestId("token-amount-input").getValue()).toBe(
      String(noZeroesFloat)
    );
  }
);

Then(/^I can see the validator node list$/, () => {
  expect(browser.getByTestId("validator-node-list")).toBeDisplayed();
  const nodeList = $(".node-list").$$('[data-testid="node-list-item"]');
  expect(nodeList.length).toBeGreaterThan(0);
});

Then(/^the epoch countdown timer is counting down$/, () => {
  const currentCountdownTimerText = browser
    .getByTestId("current-epoch-ends-in")
    .getText();
  /* eslint-disable wdio/no-pause */
  browser.pause(2100); // let some time pass
  expect(browser.getByTestId("current-epoch-ends-in").getText()).not.toEqual(
    currentCountdownTimerText
  );
});

When(/^I click on a validator$/, () => {
  $$('.node-list__item-name"]').waitForDisplayed({
    timeout: 30000,
    reverse: false,
    timeoutMsg: "Validator list not displayed",
  });
  validatorName = $$(".node-list__item-name")[0].getText();
  $$(".node-list__item-name")[0].click();
});

Then(/^I am taken to the correct validator page$/, () => {
  $('[data-test-id="validator-node-title"]').waitForDisplayed({
    timeout: 30000,
    reverse: false,
    timeoutMsg: "Validator name heading not displayed",
  });
  const validatorHeadingNameCurrent = $(
    '[data-test-id="validator-node-title"]'
  ).getText();
  expect(validatorHeadingNameCurrent).toEqual(`VALIDATOR: ${validatorName}`);
});

When(/^I click the button to disassociate$/, () => {
  browser.getByTestId("disassociate-tokens-btn").waitForDisplayed({
    timeout: 30000,
    timeoutMsg: "disassociate button not displayed",
  });
  browser.getByTestId("disassociate-tokens-btn").click();
});

When(/^I click on the "([^"]*)?" radio button$/, (radioButton) => {
  switch (radioButton) {
    case "wallet":
      $("label=Wallet").waitForDisplayed({
        timeoutMsg: "Wallet radio btn not displayed",
      });
      browser.getByTestId("associate-radio-wallet").click({ force: true });
      break;
    case "vesting contract":
      $("label=Vesting contract").waitForDisplayed({
        timeoutMsg: "Vesting contract radio btn not displayed",
      });
      browser.getByTestId("associate-radio-contract").click({ force: true });
      break;
    default:
      throw new Error(`${radioButton} Option not on list`);
  }
});

When(/^I enter "([^"]*)?" tokens in the input field$/, (tokenAmount) => {
  stakingPage.tokenAmountInputField.setValue(tokenAmount);
  expect(stakingPage.tokenAmountInputField).toHaveValueContaining(tokenAmount);
});

Then(/^the token submit button is disabled$/, () => {
  expect(browser.getByTestId("token-input-submit-button")).toBeDisabled();
});

When(/^I select to "([^"]*)?" stake$/, (stakeAction) => {
  switch (stakeAction) {
    case "Add":
      $("label=Add").waitForDisplayed({
        timeoutMsg: "Add stake radio button not displayed",
      });
      browser.getByTestId("add-stake-radio").click({ force: true });
      break;
    case "Remove":
      $("label=Remove").waitForDisplayed({
        timeoutMsg: "Remove stake radio button not displayed",
      });
      browser.getByTestId("remove-stake-radio").click({ force: true });
      break;
    default:
      throw new Error(`${stakeAction} stake Not an option`);
  }
});

Then(/^I can submit successfully$/, () => {
  expect(stakingPage.tokenAmountSubmitBtn).toBeEnabled();
  stakingPage.tokenAmountSubmitBtn.click();
});

Then(/^the pending transaction is displayed$/, () => {
  $(
    "p=Waiting for confirmation that your change in nomination has been received"
  ).waitForDisplayed({
    timeout: 15000,
    timeoutMsg: "pending stake mconfirmation not displayed",
  });
});

Then(/^the stake is successful$/, () => {
  $(".callout--success").waitForDisplayed({
    timeout: 60000,
    timeoutMsg:
      "stake success message container not displayed after 60 seconds",
  });
  expect(
    $(
      ".callout__title=At the beginning of the next epoch your $VEGA will be nominated to the validator"
    )
  ).toBeDisplayed();
});

Then(/^I click on the back to staking button$/, () => {
  stakingPage.backToStakingPageBtn.click();
});

Then(/^I am back on the staking main page$/, () => {
  expect(browser.getUrl()).toEqual(`${browser.options.baseUrl}/staking`);
});

When(/^I click the pending transactions button$/, () => {
  browser.getByTestId("pending-transactions-btn").click();
});

Then(/^I can see the pending transactions modal is shown$/, () => {
  browser.getByTestId("pending-transactions-modal").waitForDisplayed({
    timeout: 20000,
    timeoutMsg: "pending transactions modal did not display",
  });
  expect(stakingPage.etherscanLink).toBeDisplayed();
  expect(stakingPage.etherscanLink).toHaveAttr("href");
  expect(stakingPage.pendingTransactionsModalStatus).toHaveText("Pending");
});

When(
  /^I can see "([^"]*)?" vega has been removed from staking$/,
  (tokenAmount) => {
    $(".callout--success").waitForDisplayed({
      timeout: 60000,
      timeoutMsg:
        "remove stake success message container not displayed after 60 seconds",
    });
    expect(
      $(`.callout__title*=${tokenAmount} $VEGA has been removed from validator`)
    ).toBeDisplayed();
    expect($("p=It will be applied in the next epoch")).toBeDisplayed();
  }
);

When(/^I click on the option to remove stake now$/, () => {
  stakingPage.removeStakeNowBtn.waitForDisplayed({
    timeout: 20000,
    timeoutMsg: "remove stake now button not displayed",
  });
  stakingPage.removeStakeNowBtn.click();
});

When(
  /^I can see the remove now disclaimer with text "([^"]*)?"$/,
  (disclaimerText) => {
    stakingPage.removeStakeNowDisclaimerText.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "remove stake disclaimer text not displayed",
    });
    expect(stakingPage.removeStakeNowDisclaimerText.getText()).toEqual(
      disclaimerText
    );
  }
);

Then(/^the submit button text is "([^"]*)?"$/, (btnText) => {
  stakingPage.tokenAmountSubmitBtn.waitForEnabled();
  expect(stakingPage.tokenAmountSubmitBtn).toHaveText(btnText);
});

Then(/^I can see the stake is removed immediately$/, () => {
  $(".callout--success").waitForDisplayed({
    timeout: 60000,
    timeoutMsg:
      "remove stake now success message container not displayed after 60 seconds",
  });
  expect($("p=It will be applied immediately")).toBeDisplayed();
});

Then(
  /^I can see the button to switch to remove at the end of epoch is showing$/,
  () => {
    $(".button-link=Switch to remove at end of epoch").waitForDisplayed({
      timeout: 15000,
      interval: 50,
      timeoutMsg:
        "Switch to remove at end of epoch still not displayed after 15 seconds",
    });
  }
);
