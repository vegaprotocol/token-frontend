export const CONFIRMATION_TRANSACTION_MAX_WAIT = 10000;
export const NONCONFIRMATION_TRANSACTION_MAX_WAIT = 60000;

it("Start with different accounts", () => {
  cy.ethereumConnect(1);
  // When visiting the associate page
  cy.visit("/staking/associate?method=Contract");
  cy.get(".calloutasd", {
    timeout: CONFIRMATION_TRANSACTION_MAX_WAIT,
  }).should("exist");
});

it("Disconnect", () => {
  cy.ethereumConnect(1);
  // When visiting the associate page
  cy.visit("/staking/associate?method=Contract");
  cy.get('[data-testid="connect-vega"]').should("exist");
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.ethereumDisconnect();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(10000);
});

describe("Associate and stake - Wallet tokens", () => {
  it("Renders in progress and completed states", () => {
    cy.ethereumConnect();
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();

    const password = Cypress.env("VEGA_WALLET_PASSWORD");
    const userName = Cypress.env("VEGA_WALLET_NAME");
    cy.get('[data-testid="wallet-name"]').type(userName);
    cy.get('[data-testid="wallet-password"]').type(password);
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("1");
    cy.get('[data-testid="token-input-submit-button"]').click();

    cy.get(".callout--success", {
      timeout: CONFIRMATION_TRANSACTION_MAX_WAIT,
    }).should("exist");

    cy.get('[data-testid="transaction-complete-footer"] button', {
      timeout: CONFIRMATION_TRANSACTION_MAX_WAIT,
    }).click();
    cy.url().should("include", "staking");

    cy.get('[data-testid="node-list-item"] a').first().click();
    cy.get(".bp3-radio").first().click();
    cy.get("[data-testid='token-amount-input']").type("1");
    cy.get('[data-testid="token-input-submit-button"]').click();
  });
});
