import BigNumber from "bignumber.js";
import { mock } from "../common/mock";

describe("staking", () => {
  it("loads the staking node page", () => {
    const token = { totalSupply: new BigNumber(20), decimals: 5 };
    mock(cy, {
      token,
    });
    cy.visit("/staking");

    // connect
    cy.get('[data-testid="connect"]').click();
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();

    cy.get('[data-testid="staking-item"]').click();

    cy.url().should("include", "/staking/some-node"); 
    
  });
});
