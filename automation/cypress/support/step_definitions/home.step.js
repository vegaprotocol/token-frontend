import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";

import { mock } from "../../common/mock";

Given("I am on the home page", () => {
  mock(cy);
  cy.visit("/");
});

Given("I navigate to not found page", () => {
  mock(cy);
  cy.visit("not-found");
});

Then("I can see the 404 error page", () => {
  mock(cy);
  cy.contains(
    "This page can not be found, please check the URL and try again."
  );
});

Then("I can see the url contains {string}", (url) => {
  cy.url().should("include", `${url}`);
});

Then("I can see the header title is {string}", (headerTitle) => {
  cy.get(".heading__title").should("have.text", headerTitle);
});

Then("I can see the token address is shown", () => {
  cy.get('[data-testid="token-address"]').should(
    "have.text",
    Cypress.config().environmentKeys.vegaTokenAddress
  );
});

Then("the vesting address is shown", () => {
  cy.get('[data-testid="token-contract"]').should(
    "have.text",
    Cypress.config().environmentKeys.vestingAddress
  );
});

Then("the total supply is shown correctly", () => {
  cy.get('[data-testid="total-supply"]').then(($supply) => {
    const supplyNum = Number($supply.text().replace(/,/g, ""));
    expect(supplyNum).to.be.above(64999723);
  });
});

Then("associated token field is showing {string}", (amount) => {
  cy.get('[data-testid="associated"]').should("have.text", amount);
});

Then("staked token field is showing as {string}", (amount) => {
  cy.get('[data-testid="staked"]').should("have.text", amount);
});

Then("the vega wallet link is correct", () => {
  cy.get('[data-test-id="get-vega-wallet-link"]').should(
    "have.attr",
    "href",
    "https://docs.vega.xyz/docs/tools/vega-wallet/cli-wallet/create-wallet"
  );
});

Then("the token address has a link", () => {
  cy.get('[data-testid="token-address"] > span > span > a').should(
    "have.attr",
    "href",
    `https://ropsten.etherscan.io/address/${
      Cypress.config().environmentKeys.vegaTokenAddress
    }`
  );
});

Then("the vesting address has a link", () => {
  cy.get('[data-testid="token-contract"] > span > span > a').should(
    "have.attr",
    "href",
    `https://ropsten.etherscan.io/address/${
      Cypress.config().environmentKeys.vestingAddress
    }`
  );
});

Then("the associate vega tokens link is correct", () => {
  cy.get('[data-test-id="associate-vega-tokens-link-on-homepage"] > a').should(
    "have.attr",
    "href",
    "/staking/associate"
  );
});

Then("I can see the check for redeemable tokens button", () => {
  cy.get('[data-test-id="check-vesting-page-btn"]').should("be.visible");
});

When("I click the check for redeemable tokens button", () => {
  cy.get('[data-test-id="check-vesting-page-btn"]').click();
});
Then("I am redirected to vesting page", () => {
  cy.url().should("include", "/vesting");
});

When("I click on the associate vega tokens", () => {
  cy.get('[data-test-id="associate-vega-tokens-link-on-homepage"] > a').click();
});
Then("I am taken to the staking page", () => {
  cy.url().should("include", "/staking/associate");
});

Then("I can see the url includes {string}", (urlContains) => {
  cy.url().should("include", `${urlContains}`);
});
Then("the error message is displayed {string} on page", (errMsg) => {
  cy.contains(errMsg).should("be.visible");
});

When("I click on {string} on main nav", (pageTab) => {
  cy.get(".nav-links > a").contains(pageTab).click();
});

When(
  "I can see {string} button is clearly highlighted after click",
  (buttonHighlighted) => {
    cy.get(".active").should("have.text", buttonHighlighted);
  }
);

Then("I am taken to the {string} page", (pageVisited) => {
  switch (pageVisited) {
    case "vesting":
      cy.url().should("include", "/vesting");
      cy.get(".heading__title-container").should("have.text", "Vesting");
      break;
    case "staking":
      cy.url().should("include", "/staking");
      cy.get(".heading__title-container").should(
        "have.text",
        "Staking on Vega"
      );
      break;
    case "governance":
      cy.url().should("include", "/governance");
      cy.get(".heading__title-container").should("have.text", "Governance");
      break;
    case "dex liquidity":
      cy.url().should("include", "/liquidity");
      cy.get(".heading__title-container").should(
        "have.text",
        "Incentivised Liquidity Programme"
      );
      break;
    case "home":
      cy.url().should("equal", Cypress.config().baseUrl);
      break;
    case "rewards":
      cy.url().should("include", "/rewards");
      cy.get(".heading__title-container").should("have.text", "Rewards");
      break;
    case "withdraw":
      cy.url().should("include", "/withdraw");
      cy.get(".heading__title-container").should("have.text", "Withdraw");
      break;
    default:
      throw new Error("no page specified in list");
  }
});
Then("I can see the vega wallet disconnected with disconnect message", () => {
  cy.get('[data-testid="connect-vega"]')
    .should("be.visible")
    .and("have.text", "Connect Vega wallet to use associated $VEGA");
});

When("I have not connected my eth wallet", () => {
  cy.log(
    "This step does not need to be filled in as connecting wallets is not yet supported with mocks/cypress"
  );
});
Then(
  "I can see the eth wallet disconnected with message {string}",
  (ethWalletDisconnectedMsg) => {
    cy.get('[data-test-id="connect-to-eth-wallet-button"]')
      .should("be.visible")
      .and("have.text", ethWalletDisconnectedMsg);
  }
);

When("I have not connected my vega wallet", () => {
  cy.log(
    "This step does not need to be filled in as connecting wallets is not yet supported with mocks/cypress"
  );
});

When("I click on the governance proposals button", () => {
  cy.get("button").contains("View proposals").click();
});

Then("I can see proposals", () => {
  cy.log("Pending");
});
