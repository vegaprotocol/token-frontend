import { mock } from "../common/mock";

describe("Home", () => {
  it("Displays the expected information", () => {
    mock(cy);
    cy.visit("/");
    cy.get('[data-testid="token-address"]').should("have.text", "0x5b63…93eb");
    cy.get('[data-testid="token-contract"]').should("have.text", "0xfc9A…07AA");
    cy.get('[data-testid="total-supply"]').should(
      "have.text",
      "1,000,000,000.00"
    );
    cy.get('[data-testid="associated"]').should("have.text", "0.0004");
    cy.get('[data-testid="staked"]').should("have.text", "0.00");

    // cy.contains("Read about staking on Vega").then((link) => {
    //   cy.request(link.prop("href"));
    // });
  });
});
