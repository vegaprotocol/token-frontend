import BigNumber from "bignumber.js";
import { mock } from "../common/mock";

describe("Home", () => {
  it("Displays the expected information", () => {
    const token = { totalSupply: new BigNumber(20), decimals: 5 };
    mock(cy, {
      token,
    });
    cy.visit("/");
    cy.contains("Loading");
    cy.contains("The Vega Token");
    cy.get('[data-testid="token-address"]').should(
      "have.text",
      "0xFa521aDcc11925266A518CdE33386FcD9cF2A4A6"
    );
    cy.get('[data-testid="token-contract"]').should(
      "have.text",
      "0xfc9Ad8fE9E0b168999Ee7547797BC39D55d607AA"
    );
    cy.get('[data-testid="total-supply"]').should(
      "have.text",
      token.totalSupply.toString()
    );
    cy.get('[data-testid="total-supply"]').should(
      "have.text",
      token.totalSupply.toString()
    );
    cy.get('[data-testid="staked"]').should("have.text", "0");

    cy.contains("Read about staking on Vega").then((link) => {
      cy.request(link.prop("href"));
    });
  });
});
