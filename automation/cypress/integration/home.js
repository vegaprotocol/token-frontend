import { mock } from "../common/mock";

describe.only("Home", () => {
  it("Displays the expected information", () => {
    mock(cy);
    cy.visit("/");
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get('[data-testid="token-address"]').should("have.text", "0xFa52…A4A6");
    cy.get('[data-testid="token-contract"]').should("have.text", "0xfc9A…07AA");
    cy.get('[data-testid="total-supply"]').should("have.text", "1000000000");
    cy.get('[data-testid="staked"]').should("have.text", "0.0004");

    cy.contains("Read about staking on Vega").then((link) => {
      cy.request(link.prop("href"));
    });
  });
});
