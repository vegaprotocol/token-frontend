import { mock } from "../common/mock";

describe("Home", () => {
  it("Displays the expected information", () => {
    mock(cy);
    cy.visit("/");
    cy.get('[data-testid="token-address"]').should(
      "have.text",
      Cypress.config().environmentKeys.vegaTokenAddress
    );
    cy.get('[data-testid="token-contract"]').should(
      "have.text",
      Cypress.config().environmentKeys.vestingAddress
    );
    cy.get('[data-testid="total-supply"]').should(
      "have.text",
      "1,000,000,000.00"
    );
    cy.get('[data-testid="staked"]').should("have.text", "0.00");

    // cy.contains("Read about staking on Vega").then((link) => {
    //   cy.request(link.prop("href"));
    // });
  });
});
