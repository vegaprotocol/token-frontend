const { Given, When, Then } = require("@wdio/cucumber-framework");
const HomePage = require("../pageobjects/home.page");

Given(/^I am on the home page$/, () => {
  HomePage.goTo("/");
});

Given(/^I have not connected my vega wallet$/, () => {
  //No need to disconnect Vega wallet yet
});

Given(/^I have not connected my eth wallet$/, () => {
  $('button=Disconnect').waitForDisplayed({timeout: 10000,timeoutMsg: "Disconnect Ethereum wallet Button not displayed",})
  $('button=Disconnect').click()
});  

Given(/^I navigate to not found page$/, () => {
  browser.url("not-found");
});

Then(/^I can see the url includes "([^"]*)?"$/, (expectedUrl) => {
  expect(browser).toHaveUrlContaining(expectedUrl);
});

Then(/^the error message is displayed "([^"]*)?" on page$/, (expectedError) => {
  expect($("p*=" + expectedError)).toExist();
});

Then(/^I can see the token address is shown$/, () => {
  const tokenAddress = browser.getByTestId(HomePage.tokenAddressTestId);
  expect(tokenAddress).toExist();
  // expect(tokenAddress).toBe(
  //   "0x547cbA83a7eb82b546ee5C7ff0527F258Ba4546D"
  // );
});

Then(/^the vesting address is shown$/, () => {
  const vestingAddress = browser.getByTestId(HomePage.vestingAddressTestId);
  expect(vestingAddress).toExist();
  // expect(vestingAddress.getText()).toBe(
  //   "0xfCe6eB272D3d4146A96bC28de71212b327F575fa"
  // );
});

Then(/^the total supply is shown correctly$/, () => {
  const totalSupply = browser.getByTestId(HomePage.totalSupplyTestId);
  let totalSupplyNum = Number(totalSupply.getText().replace(/,/g, ""));
  expect(totalSupplyNum).toBeGreaterThan(64999723);
});

Then(/^staked token field is showing as "([^"]*)?"$/, (amount) => {
  const stakedToken = browser.getByTestId(HomePage.stakedTokensTestId);
  expect(stakedToken.getText()).toBe(amount);
});

Then(/^the vega wallet link is correct$/, () => {
  expect(HomePage.vegaWalletLink).toHaveAttribute(
    "href",
    "https://docs.vega.xyz/docs/tools/vega-wallet/cli-wallet/create-wallet"
  );
});

Then(/^the token address has a link$/, () => {
  expect(HomePage.tokenAddressLink).toHaveAttrContaining(
    "href",
    "https://ropsten.etherscan.io/address/"
  );
});

Then(/^the vesting address has a link$/, () => {
  expect(HomePage.vestingLink).toHaveAttrContaining(
    "href",
    "https://ropsten.etherscan.io/address/"
  );
});

Then(/^the associate vega tokens link is correct$/, () => {
  expect(HomePage.associatedTokensLink).toHaveAttribute(
    "href",
    "/staking/associate"
  );
});

Then(/^I can see the check for redeemable tokens button$/, () => {
  expect(HomePage.checkVestingBtn).toBeDisplayed();
});

When(/^I click the check for redeemable tokens button$/, () => {
  HomePage.checkVestingBtn.click();
});

When(/^I click on the associate vega tokens$/, () => {
  HomePage.associatedTokensLink.click();
});

When(/^I click on the governance proposals button$/, () => {
  const governanceLink = $("=View proposals"); //add test id in the future
  governanceLink.click();
});

When(/^I click on "([^"]*)?" on main nav$/, (pageTab) => {
  const navbarElement = HomePage.getNavBarElement(pageTab);
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
    const ConnectVegaTxt = browser
      .getByTestId(HomePage.connectVegaWalletTestId)
      .getText();
    expect(ConnectVegaTxt).toBe(disconnectedMsg);
  }
);

Then(
  /^I can see the eth wallet disconnected with message "([^"]*)?"$/,
  (disconnectedMsg) => {
    const ConnectEthWalletTxt = HomePage.connectEthWallet.getText();
    expect(ConnectEthWalletTxt).toBe(disconnectedMsg);
    // HomePage.connectToEthWallet();
  }
);

Then(
  /^I can see the 404 error page$/, ()=>{
    expect($('.heading__title')).toHaveText('PAGE NOT FOUND')
  }  
);

Then(
  /^I wait for some time$/, ()=>{
  browser.pause(2000)  
  }
  // expect($('.heading__title')).getText().toBe('Page not found') 
);


