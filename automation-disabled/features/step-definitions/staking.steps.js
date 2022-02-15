const { Given, When, Then } = require("@wdio/cucumber-framework");
const StakingPage = require("../pageobjects/staking.page");

Then(/^I can see the validator node list$/, () => {
  const nodeList = $(".node-list").$$('[data-testid="node-list-item"]');
  expect(nodeList.length).toBeGreaterThan(0);
});
