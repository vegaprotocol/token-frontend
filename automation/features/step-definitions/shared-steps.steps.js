const { Given, When, Then } = require("@wdio/cucumber-framework");
const HomePage = require("../pageobjects/home.page");

Given(/^I connect my ethereum wallet$/, () => {
  browser.connectToEthWallet();
});

Given(/^I navigate to "([^"]*)?" page$/, (page) => {
  HomePage.goTo("/" + page);
});

When(/^I connect Vega wallet$/, () => {
  const connectVegaBtn = browser.getByTestId(HomePage.connectVegaWalletTestId);
  connectVegaBtn.click();

  const walletName = browser.getByTestId(HomePage.vegaWalletUserNameTestId);
  walletName.setValue("");

  const walletPassword = browser.getByTestId(HomePage.vegaWalletPasswordTestId);
  walletPassword.setValue("");

  const walletLogin = browser.getByTestId(HomePage.vegaWalletLoginTestId);
  walletLogin.click();
});

Then(/^I am taken to the "([^"]*)?" page$/, (page) => {
  if (page == "home") {
    expect(browser).toHaveUrl(browser.options.baseUrl + "/");
  } else expect(browser).toHaveUrlContaining("/" + page);
});

Then(/^I can see the header title is "([^"]*)?"$/, (headerTitle) => {
  const displayedHeaderTitle = $(".heading__title").getText();
  console.log(headerTitle.toUpperCase());
  expect(displayedHeaderTitle).toHaveText(headerTitle.toUpperCase());
});

Then(/^I disconnect Vega Wallet$/, () => {
  const disconnectBtn = HomePage.disconnectWalletBtn;
  disconnectBtn[1].click();
});
