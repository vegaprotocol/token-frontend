const { Given, When, Then } = require("@wdio/cucumber-framework");

Then(/^I can see the error message when not connected to eth wallet on claims page "([^"]*)?"$/, (msg) => {
  expect(browser.getByTestId("eth-connect-prompt")).toHaveText(msg)
});

Then(/^the connect to ethereum button is visible$/, () => {
  expect(browser.getByTestId("connect-to-eth-btn").isDisplayed()).toBeTruthy()
});

Then(/^I can see the heading title is "([^"]*)?"$/, (headingTitle) => {
  expect($('.heading__title')).toHaveText(headingTitle)
});

Then(/^I can see the invalid claim code error "([^"]*)?"$/, (errorMsg) => {
  expect(browser.getByTestId('invalid-claim-code-error-msg')).toHaveText(errorMsg)
});
