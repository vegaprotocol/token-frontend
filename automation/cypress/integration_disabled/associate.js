import { mock, mockVesting } from "../common/mock";

describe("Associate", () => {
  it("Renders switcher, header and description", () => {
    // As a user
    mockVesting();
    mock(cy);

    // When visiting the associate page
    cy.visit("/staking/associate");
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    cy.get("[data-testid='associate-information1']").should(
      "have.text",
      "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
    );
    cy.get("[data-testid='associate-subheader']").should(
      "have.text",
      "Where would you like to stake from?"
    );
    cy.get("[data-testid='associate-radio-contract']").should("exist");
    cy.get("[data-testid='associate-radio-wallet']").should("exist");
  });

  it("Allows query param from method (Wallet)", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Wallet");
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    // Then I see contract associate flow
    cy.get('[data-testid="wallet-associate"]').should("exist");

    cy.get('[data-testid="associate-radio-wallet"]').should("be.checked");
  });

  it("Allows query param from method (Contract)", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate?method=Contract");
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    // Then I see contract associate flow
    cy.get('[data-testid="contract-associate"]').should("exist");

    cy.get('[data-testid="associate-radio-contract"]').should("be.checked");
  });

  it("Allows the user to click to select", () => {
    // As a user
    mockVesting();
    mock(cy);
    // When visiting the associate page
    cy.visit("/staking/associate");
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
    // Then I see contract associate flow
    cy.get('[data-testid="associate-radio-contract"]').click({ force: true });
    cy.get('[data-testid="associate-radio-contract"]').should("be.checked");
  });
});
