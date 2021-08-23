import { mock } from "../common/mock";

describe.only("Associate", () => {
  it("Renders switcher, header and description", () => {
    // As a user
    mock(cy);
    // When visiting a fake page
    cy.visit("/associate");

    cy.get("[data-testid='associate-information']").should(
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
    mock(cy);
    // When visiting a fake page
    cy.visit("/associate?method=Wallet");
    // Then I see contract associate flow
    cy.get('[data-testid="wallet-associate"]').should("exist");

    cy.get('[data-testid="associate-radio-wallet"]').should("be.checked");
  });

  it("Allows query param from method (Contract)", () => {
    // As a user
    mock(cy);
    // When visiting a fake page
    cy.visit("/associate?method=Contract");
    // Then I see contract associate flow
    cy.get('[data-testid="contract-associate"]').should("exist");

    cy.get('[data-testid="associate-radio-contract"]').should("be.checked");
  });
});
