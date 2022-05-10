const { Given, When, Then } = require("@wdio/cucumber-framework");
const homePage = require("../pageobjects/home.page");

Given(/^I am on the home page$/, () => {
  homePage.goTo("/");
});

Given(/^I have not connected my vega wallet$/, () => {
  //No need to disconnect Vega wallet yet
});

Given(/^I have not connected my eth wallet$/, () => {
  $("button=Disconnect").waitForDisplayed({
    timeout: 10000,
    timeoutMsg: "Disconnect Ethereum wallet Button not displayed",
  });
  $("button=Disconnect").click();
});

Given(/^I navigate to not found page$/, () => {
  browser.url("not-found");
});

Then(/^I can see the url includes "([^"]*)?"$/, async (expectedUrl) => {
  await expect(browser).toHaveUrlContaining(expectedUrl);
});

Then(/^the error message is displayed "([^"]*)?" on page$/, (expectedError) => {
  expect($("p*=" + expectedError)).toExist();
});

Then(/^I can see the token address is shown$/, () => {
  const tokenAddress = browser.getByTestId(homePage.tokenAddressTestId);
  expect(tokenAddress).toExist();
});

Then(/^the vesting address is shown$/, () => {
  const vestingAddress = browser.getByTestId(homePage.vestingAddressTestId);
  expect(vestingAddress).toExist();
});

Then(/^the total supply is shown correctly$/, () => {
  const totalSupply = browser.getByTestId(homePage.totalSupplyTestId);
  let totalSupplyNum = Number(totalSupply.getText().replace(/,/g, ""));
  expect(totalSupplyNum).toBeGreaterThan(64999723);
});

Then(/^staked token field is showing as "([^"]*)?"$/, (amount) => {
  const stakedToken = browser.getByTestId(homePage.stakedTokensTestId);
  expect(stakedToken.getText()).toBe(amount);
});

Then(/^the vega wallet link is correct$/, () => {
  homePage.vegaWalletLink.waitForDisplayed({
    timeout: 10000,
    timeoutMsg: "vega wallet link did not display within 10 seconds",
  });
  expect(homePage.vegaWalletLink).toHaveAttribute(
    "href",
    "https://docs.vega.xyz/docs/mainnet/tools/vega-wallet"
  );
});

Then(/^the token address has a link$/, () => {
  expect(homePage.tokenAddressLink).toHaveAttrContaining(
    "href",
    "https://ropsten.etherscan.io/address/"
  );
});

Then(/^the vesting address has a link$/, () => {
  expect(homePage.vestingLink).toHaveAttrContaining(
    "href",
    "https://ropsten.etherscan.io/address/"
  );
});

Then(/^the associate vega tokens link is correct$/, async () => {
  await expect(homePage.associatedTokensLink).toHaveAttribute(
    "href",
    "/staking/associate"
  );
});

Then(/^I can see the check for redeemable tokens button$/, async () => {
  await expect(homePage.checkVestingBtn).toBeDisplayed();
});

When(/^I click the check for redeemable tokens button$/, () => {
  homePage.checkVestingBtn.click();
});

When(/^I click on the associate vega tokens$/, () => {
  homePage.associatedTokensLink.click();
});

When(/^I click on the governance proposals button$/, () => {
  const governanceLink = $("=View proposals"); //add test id in the future
  governanceLink.click();
});

When(/^I click on "([^"]*)?" on main nav$/, (pageTab) => {
  const navbarElement = homePage.getNavBarElement(pageTab);
  navbarElement.click();
});

When(
  /^I can see "([^"]*)?" button is clearly highlighted after click$/,
  (buttonHighlighted) => {
    const activeButton = $(".active");
    expect(activeButton.getText()).toBe(buttonHighlighted.toUpperCase());
  }
);

Then(
  /^I can see the vega wallet disconnected with message "([^"]*)?"$/,
  (disconnectedMsg) => {
    browser.getByTestId(homePage.connectVegaWalletTestId).waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Connect to vega wallet message did not appear in 10 seconds",
    });
    const ConnectVegaTxt = browser
      .getByTestId(homePage.connectVegaWalletTestId)
      .getText();
    expect(ConnectVegaTxt).toBe(disconnectedMsg);
  }
);

Then(
  /^I can see the eth wallet disconnected with message "([^"]*)?"$/,
  (disconnectedMsg) => {
    const ConnectEthWalletTxt = homePage.connectEthWallet.getText();
    expect(ConnectEthWalletTxt).toBe(disconnectedMsg);
  }
);

Then(/^I can see the 404 error page$/, async () => {
  await expect($(".heading__title")).toHaveText("PAGE NOT FOUND");
});
