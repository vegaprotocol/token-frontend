describe("Associate and stake - Wallet tokens", () => {
  it("Renders in progress and completed states", () => {
    const password = Cypress.env("VEGA_WALLET_PASSWORD");
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("test");
    cy.get('[data-testid="wallet-password"]').type(password);
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("1");
    cy.get('[data-testid="token-input-submit-button"]').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300000);
    cy.get(".callout--success").should("exist");

    cy.get('[data-testid="transaction-complete-footer"] button').click();
    cy.url().should("include", "staking");

    cy.get('[data-testid="node-list-item"] a').first().click();
    cy.get(".bp3-radio").first().click();
    cy.get("[data-testid='token-amount-input']").type("1");
    cy.get('[data-testid="token-input-submit-button"]').click();
  });
});
