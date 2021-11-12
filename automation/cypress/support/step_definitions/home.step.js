import { Then, Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";

Given("I am on the home page", () => {
  mock(cy);
  cy.visit("/");
});

Given("I navigate to not found page", () => {
  mock(cy);
  cy.visit("/not-found");
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
    cy.get('[data-testid="total-supply"]').should(
        "have.text",
        "1,000,000,000.00"
    );
});

Then("associated token field is showing {string}", (amount) => {
    cy.get('[data-testid="associated"]').should("have.text", amount);
});

Then("staked token field is showing as {string}", (amount) => {
    cy.get('[data-testid="staked"]').should("have.text", amount);
});

Then("the vega wallet link is correct", () => {
    cy.get('[data-test-id="get-vega-wallet-link"]').should('have.attr','href',"https://github.com/vegaprotocol/go-wallet/releases")
});

Then("the token address has a link", () => {
    cy.get('[data-testid="token-address"] > span > span > a').should(
        "have.attr",'href',
        `https://ropsten.etherscan.io/address/${Cypress.config().environmentKeys.vegaTokenAddress}`);
});

Then("the vesting address has a link", () => {
    cy.get('[data-testid="token-contract"] > span > span > a').should(
        "have.attr",'href',
        `https://ropsten.etherscan.io/address/${Cypress.config().environmentKeys.vestingAddress}`);
});

Then("the associate vega tokens link is correct", () => {
    cy.get('[data-test-id="associate-vega-tokens-link-on-homepage"] > a').should(
        "have.attr",'href',
        '/staking/associate');
})

Then("I can see the check for redeemable tokens button", () => {
    cy.get('[data-test-id="check-vesting-page-btn"]').should('be.visible')
})

When("I click the check for redeemable tokens button", () => {
    cy.get('[data-test-id="check-vesting-page-btn"]').click()

})
Then("I am redirected to vesting page", () => {
    cy.url().should('include','/vesting')
})

When("I click on the associate vega tokens", () => {
    cy.get('[data-test-id="associate-vega-tokens-link-on-homepage"] > a').click()
})
Then("I am taken to the staking page", () => {
    cy.url().should('include','/staking/associate')
})

Then("I can see the url includes {string}", (urlContains) => {
    cy.url().should('include',`${urlContains}`)
})
Then("the error message is displayed {string} on page", (errMsg) => {
    cy.contains(errMsg).should('be.visible')
})

