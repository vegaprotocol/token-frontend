describe("Associate - vesting tokens", () => {
  // it("Disabled the button if amount is empty", () => {
  //   // When visiting the associate page
  //   cy.visit("/staking/associate?method=Contract");
  //   cy.get('[data-testid="connect-vega"]').click();
  //   cy.get('[data-testid="wallet-name"]').type("wallet");
  //   cy.get('[data-testid="wallet-password"]').type("wallet");
  //   cy.get('[data-testid="wallet-login"]').click();
  //   // Then the button is disabled by default
  //   cy.get('[data-testid="associate-button"]').should("be.disabled");
  // });

  // it("Disabled the button if amount is 0", () => {
  //   // When visiting the associate page
  //   cy.visit("/staking/associate?method=Contract");
  //   // Then the button is disabled by default
  //   cy.get('[data-testid="connect-vega"]').click();
  //   cy.get('[data-testid="wallet-name"]').type("wallet");
  //   cy.get('[data-testid="wallet-password"]').type("wallet");
  //   cy.get('[data-testid="wallet-login"]').click();
  //   cy.get('[data-testid="token-amount-input"]').type("0");
  //   cy.get('[data-testid="associate-button"]').should("be.disabled");
  // });

  // it("Disabled the button if amount is less than 0", () => {
  //   // When visiting the associate page
  //   cy.visit("/staking/associate?method=Contract");
  //   // Then the button is disabled by default
  //   cy.get('[data-testid="connect-vega"]').click();
  //   cy.get('[data-testid="wallet-name"]').type("wallet");
  //   cy.get('[data-testid="wallet-password"]').type("wallet");
  //   cy.get('[data-testid="wallet-login"]').click();
  //   cy.get('[data-testid="token-amount-input"]').type("-1");
  //   cy.get('[data-testid="associate-button"]').should("be.disabled");
  // });

  // it("Disabled the button if amount is greater than maximum", () => {
  //   // When visiting the associate page
  //   cy.visit("/staking/associate?method=Contract");
  //   // Then the button is disabled by default
  //   cy.get('[data-testid="connect-vega"]').click();
  //   cy.get('[data-testid="wallet-name"]').type("wallet");
  //   cy.get('[data-testid="wallet-password"]').type("wallet");
  //   cy.get('[data-testid="wallet-login"]').click();
  //   cy.get('[data-testid="token-amount-input"]').type("123");
  //   cy.get('[data-testid="associate-button"]').should("be.disabled");
  // });

  // it("Calculates maximum correctly if some tokens are staked", () => {
  //   // When visiting the associate page
  //   cy.visit("/staking/associate?method=Contract");
  //   // Then the button is disabled by default
  //   cy.get('[data-testid="connect-vega"]').click();
  //   cy.get('[data-testid="wallet-name"]').type("wallet");
  //   cy.get('[data-testid="wallet-password"]').type("wallet");
  //   cy.get('[data-testid="wallet-login"]').click();

  //   // 0.00001 over maximum should be disabled
  //   cy.get('[data-testid="token-amount-input"]').type("0.00119");
  //   cy.get('[data-testid="associate-button"]').should("be.disabled");

  //   // maximum should be enabled
  //   cy.get('[data-testid="token-amount-input"]').clear().type("0.00118");
  //   cy.get('[data-testid="associate-button"]').should("not.be.disabled");
  // });

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
