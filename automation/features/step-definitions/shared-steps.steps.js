const { Given, When, Then } = require("@wdio/cucumber-framework");
const HomePage = require("../pageobjects/home.page");

Given(/^I connect my ethereum wallet$/, () => {
  const baseUrl = browser.options.baseUrl;
  browser.url(baseUrl);
  browser.switchWindow(baseUrl);
  // $('input[name="password"]').waitForDisplayed({
  //   timeout: 10000,
  //   timeoutMsg: "password field not displayed in 10 seconds",
  // });
  // $('input[name="password"]').setValue("hedgehog");
  // $(".button").waitForDisplayed({
  //   timeout: 10000,
  //   timeoutMsg: "Button not displayed",
  // });
  // $(".button").click();
  browser.switchWindow("MetaMask");
  $(".button").waitForDisplayed({timeout: 10000,timeoutMsg: "Button not displayed"});
  $(".button").click();
  $(".button").waitForDisplayed({timeout: 10000,timeoutMsg: "Button not displayed"});
  $(".button").click();
  browser.getByTestId("page-container-footer-next").waitForDisplayed({ timeout: 10000, timeoutMsg: "Button not displayed" });
  browser.getByTestId("page-container-footer-next").click();
  $('input[placeholder="Paste Secret Recovery Phrase from clipboard"]').setValue("unable exercise exact daring steel lend hurt royal hour mountain poverty place");
  $("#password").setValue("Devtest123");
  $("#confirm-password").setValue("Devtest123");
  $$('div[role="checkbox"]')[1].click();
  $('button[type="submit"]').click();
  $("button=All Done").click();
  $('button=Next').click()
  $('button=Connect').waitForDisplayed({timeout: 10000,timeoutMsg: "connect Button not displayed"});
  $('button=Connect').click()
  $('[data-testid="popover-close"]').waitForDisplayed({timeout: 10000,timeoutMsg: "pop over close not display"});
  $('[data-testid="popover-close"]').click();
  browser.url("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/advanced");
  $('[data-testid="advanced-setting-show-testnet-conversion"]').scrollIntoView();
  $('//*[@id="app-content"]/div/div[3]/div/div[2]/div[2]/div[2]/div[7]/div[2]/div/div/div[1]/div[1]').click({ force: true });
  $(".network-display").scrollIntoView();
  $(".network-display").waitForDisplayed({timeout: 10000,timeoutMsg: "Network-display Button not displayed"});
  $(".network-display").click();
  $(".network-name-item=Ropsten Test Network").waitForDisplayed({timeout: 10000,timeoutMsg: "Ropsten Test Network Button not displayed"});
  $(".network-name-item=Ropsten Test Network").click();
  browser.closeWindow();
  browser.switchWindow(baseUrl);
  $('[data-test-id="connect-to-eth-wallet-button"]').waitForDisplayed({timeout: 10000,timeoutMsg: "Connect Eth Button not displayed"});
  $('[data-test-id="connect-to-eth-wallet-button"]').click();
  $(".button*=Injected").click();
  // browser.switchWindow("MetaMask Notification");
  // $("button=Next").click();
  // $("button=Connect").click();
  // browser.switchWindow(baseUrl);
});

Given(/^I navigate to "([^"]*)?" page$/, (page) => {
  HomePage.goTo("/" + page);
});

When(/^I connect Vega wallet$/, () => {
  const connectVegaBtn = browser.getByTestId(HomePage.connectVegaWalletTestId);
  connectVegaBtn.click();

  // const hostedWallet = HomePage.hostedWalletInput
  // hostedWallet.click({force:true})

  // Add wallet details when received
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
