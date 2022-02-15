import { Given } from "cypress-cucumber-preprocessor/steps";

import { mock } from "../../common/mock";

Given("I navigate to {string} page", (page) => {
  mock(cy);
  cy.visit(page);
});

Given("I connect to wallet vega", () => {
  cy.get('[data-test-id="connect-to-vega-wallet-btn"]').click();
  cy.get('[data-testid="wallet-name"]').type("wallet");
  cy.get('[data-testid="wallet-password"]').type("wallet");
  cy.get('[data-testid="wallet-login"]').click();
});
