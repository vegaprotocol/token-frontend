const { When, Then } = require("@wdio/cucumber-framework");
const TranchesPage = require("../pageobjects/tranches.page");

When(/^I click on the first tranche$/, () => {
  const tranche = TranchesPage.trancheLink;
  tranche.click();
});

Then(/^First tranche contains unlocked tokens$/, () => {
  const unlockedTokens = TranchesPage.firstTrancheUnlockedTokens;

  let unlockedNum = Number(unlockedTokens.getText().replace(/,/g, ""));
  expect(unlockedNum).toBeGreaterThan(0);
});

Then(/^I can see tranches are displayed$/, async () => {
  const displayedTranche = browser.getByTestId(TranchesPage.trancheTestId);
  await expect(displayedTranche).toBeDisplayed();
});

Then(/^I can see the tranche "([^"]*)?" page$/, async (trancheNum) => {
  await expect(browser).toHaveUrlContaining(`tranches/${trancheNum}`);
});

Then(/^I can see the tranches userlist$/, () => {
  const userList = TranchesPage.trancheUserList;
  expect(userList.length).toBeGreaterThan(0);
});
