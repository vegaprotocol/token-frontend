const { Given, When, Then } = require("@wdio/cucumber-framework");
const WithdrawalsPage = require("../pageobjects/withdrawals.page");

Then(/^I can see the wallet address field is showing "([^"]*)?"$/, (walletAddress) => {
  expect(WithdrawalsPage.ethWalletAddressField).toHaveValue(walletAddress)
});

Then(/^The wallet address field is disabled$/, () => {
    expect(WithdrawalsPage.ethWalletAddressField).toHaveAttribute('disabled')
});

Then(/^I click the link to enter a new wallet address$/, () => {
  WithdrawalsPage.enableWalletAddressFieldLink.waitForDisplayed({timeout:10000,timeoutMsg:"Enter wallet address manually link not displayed"})
  expect(WithdrawalsPage.enableWalletAddressFieldLink).toHaveText('Enter address manually')
  WithdrawalsPage.enableWalletAddressFieldLink.click()
});

Then(/^the wallet address field is enabled$/, () => {
    expect(WithdrawalsPage.ethWalletAddressField).toBeEnabled()
    expect(WithdrawalsPage.ethWalletAddressField).not.toHaveAttribute('disabled')
});

Then(/^I enter a new wallet address "([^"]*)?"$/, (newWalletAddress) => {
    WithdrawalsPage.ethWalletAddressField.setValue(newWalletAddress)
});

Then(/^the wallet address link is changed to "([^"]*)?"$/, (walletAddresslinkText) => {
    expect(WithdrawalsPage.enableWalletAddressFieldLink).toHaveText(walletAddresslinkText)
});

Then(/^I can see the wallet address in the input field is "([^"]*)?"$/, (newWalletAddress) => {
  console.log(WithdrawalsPage.ethWalletAddressField.getValue())
    expect(WithdrawalsPage.ethWalletAddressField).toHaveValue(newWalletAddress)
});

Then(/^the error message is shown "([^"]*)?"$/, (walletErrorMsg) => {
    expect($(`.callout--warn=${walletErrorMsg}`)).toBeDisplayed()
});
