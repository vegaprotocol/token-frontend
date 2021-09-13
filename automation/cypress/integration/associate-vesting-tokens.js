import { mock, mockVesting, sendChainResponse } from "../common/mock";

describe("Associate - vesting tokens", () => {
  it("Disabled the button if amount is empty", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    // Then the button is disabled by default
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Disabled the button if amount is 0", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("0");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Disabled the button if amount is less than 0", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("-1");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Disabled the button if amount is greater than maximum", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("123");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Calculates maximum correctly if some tokens are staked", () => {
    // As a user
    mockVesting({ lien: 5 });
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();

    // 0.00001 over maximum should be disabled
    cy.get('[data-testid="token-amount-input"]').type("0.00119");
    cy.get('[data-testid="associate-button"]').should("be.disabled");

    // maximum should be enabled
    cy.get('[data-testid="token-amount-input"]').clear().type("0.00118");
    cy.get('[data-testid="associate-button"]').should("not.be.disabled");
  });

  it("Renders in progress and completed states", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    cy.get('[data-testid="token-amount-input"]').type("0.001");
    cy.get('[data-testid="token-amount-input"]').type("0.001");
    cy.get('[data-testid="associate-button"]').click();
    sendChainResponse(cy, "add-stake", "transactionHash", "hash");
    cy.get('[data-testid="transaction-pending-heading"]').should(
      "have.text",
      "Associating Tokens"
    );
    cy.get('[data-testid="transaction-pending-body"]').should(
      "have.text",
      "Associating 0.0010 VEGA tokens with Vega key pub"
    );
    cy.get('[data-testid="transaction-pending-footer"]').should(
      "have.text",
      "The Vega network requires 30 Confirmations (approx 5 minutes) on Ethereum before crediting your Vega key with your tokens. This page will update once complete or you can come back and check your Vega wallet to see if it is ready to use."
    );

    sendChainResponse(cy, "add-stake", "receipt");
    cy.get('[data-testid="transaction-complete-heading"]').should(
      "have.text",
      "Done"
    );
    cy.get('[data-testid="transaction-complete-body"]').should(
      "have.text",
      "Vega key pub can now participate in governance and Nominate a validator with it’s stake."
    );
    cy.get('[data-testid="transaction-complete-footer"]').should(
      "have.text",
      "Nominate Stake to Validator Node"
    );

    cy.get('[data-testid="transaction-complete-footer"] button').click();
    cy.url().should("include", "staking");
  });
});
