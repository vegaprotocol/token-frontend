import { mock } from "../common/mock";

describe("Associate - vesting tokens", () => {
  it("Disabled the button if amount is empty", () => {
    // As a user
    mock(cy);
    // When visiting the associate page
    cy.visit("/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Disabled the button if amount is 0", () => {
    // As a user
    mock(cy);
    // When visiting the associate page
    cy.visit("/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="associate-amount-input"]').type("0");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  it("Disabled the button if amount is less than 0", () => {
    // As a user
    mock(cy);
    // When visiting the associate page
    cy.visit("/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="associate-amount-input"]').type("-1");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });

  // TODO needs wallet mocking

  it.skip("Disabled the button if amount is greater than maximum", () => {
    // As a user
    mock(cy);
    // When visiting the associate page
    cy.visit("/associate?method=Contract");
    // Then the button is disabled by default
    cy.get('[data-testid="associate-amount-input"]').type("123");
    cy.get('[data-testid="associate-button"]').should("be.disabled");
  });
  it.skip("Calculates maximum correctly if some tokens are staked", () => {});
  it.skip("Renders in progress and completed states", () => {});
});
