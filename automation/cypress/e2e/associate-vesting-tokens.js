export const CONFIRMATION_TRANSACTION_MAX_WAIT = 300000;
export const NONCONFIRMATION_TRANSACTION_MAX_WAIT = 60000;

describe("Associate and stake - Wallet tokens", () => {
  it("Renders in progress and completed states", () => {
    const password = Cypress.env("VEGA_WALLET_PASSWORD");
    const userName = Cypress.env("VEGA_WALLET_NAME");
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
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
