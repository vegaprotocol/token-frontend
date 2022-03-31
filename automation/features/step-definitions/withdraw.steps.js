const { Given, When, Then } = require("@wdio/cucumber-framework");
const withdrawalsPage = require("../pageobjects/withdrawals.page");

Then(/^I can see the wallet address field is showing "([^"]*)?"$/, (walletAddress) => {
    expect(withdrawalsPage.ethWalletAddressField).toHaveValue(walletAddress)
});

Then(/^The wallet address field is disabled$/, () => {
    expect(withdrawalsPage.ethWalletAddressField).toHaveAttribute('disabled')
});

When(/^I click the link to enter a new wallet address$/, () => {
    withdrawalsPage.enableWalletAddressFieldLink.waitForDisplayed({timeout:10000,timeoutMsg:"Enter wallet address manually link not displayed"})
    expect(withdrawalsPage.enableWalletAddressFieldLink).toHaveText('Enter address manually')
    withdrawalsPage.enableWalletAddressFieldLink.click()
});

Then(/^the wallet address field is enabled$/, () => {
    expect(withdrawalsPage.ethWalletAddressField).toBeEnabled()
    expect(withdrawalsPage.ethWalletAddressField).not.toHaveAttribute('disabled')
});

Then(/^I enter a new wallet address "([^"]*)?"$/, (newWalletAddress) => {
    withdrawalsPage.ethWalletAddressField.setValue(newWalletAddress)
});

Then(/^the wallet address link is changed to "([^"]*)?"$/, (walletAddresslinkText) => {
    expect(withdrawalsPage.enableWalletAddressFieldLink).toHaveText(walletAddresslinkText)
});

Then(/^I can see the wallet address in the input field is "([^"]*)?"$/, (newWalletAddress) => {
    console.log(withdrawalsPage.ethWalletAddressField.getValue())
    expect(withdrawalsPage.ethWalletAddressField).toHaveValue(newWalletAddress)
});

Then(/^the error message is shown "([^"]*)?"$/, (walletErrorMsg) => {
    expect($(`.callout--warn=${walletErrorMsg}`)).toBeDisplayed()
});
