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
    cy.get('[data-testid="connect-overlay"]').click();
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();

    cy.get('[data-testid="staking-item"]').click();

    cy.url().should("include", "/staking/some-node");

    // high level, all components should be rendered
    cy.get('[data-testid="validator-table"]').should("exist");
    cy.get('[data-testid="epoch-countdown"]').should("exist");
    cy.get('[data-testid="your-stake"]').should("exist");

    // low level - test validator table
    cy.get('[data-testid="validator-table"]').contains(
      "VEGA ADDRESS / PUBLIC KEY"
    );
    cy.get('[data-testid="validator-table"]').contains("ABOUT THIS VALIDATOR");
    cy.get('[data-testid="validator-table"]').contains("IP ADDRESS");
    cy.get('[data-testid="validator-table"]').contains("TOTAL STAKE");
    cy.get('[data-testid="validator-table"]').contains("STAKE SHARE");
    cy.get('[data-testid="validator-table"]').contains(
      "OWN STAKE (THIS EPOCH)"
    );
    cy.get('[data-testid="validator-table"]').contains(
      "NOMINATED (THIS EPOCH)"
    );

    // test epoch countdown
    cy.get('[data-testid="epoch-countdown"]').contains("Epoch");
    cy.get('[data-testid="epoch-countdown"]').contains("Started");
    cy.get('[data-testid="epoch-countdown"]').contains("Ends in");

    // test Your stake
    cy.get('[data-testid="your-stake"]').contains("Your Stake");
    cy.get('[data-testid="your-stake"]').contains(
      "Your Stake On Node (This Epoch)"
    );
    cy.get('[data-testid="your-stake"]').contains(
      "Your Stake On Node (Next Epoch)"
    );
    cy.get('[data-testid="your-stake"]').contains("Manage your stake");
    cy.get('[data-testid="your-stake-radio-add"]')
      .parent()
      .find("input")
      .should("be.checked");
    cy.get('[data-testid="your-stake-radio-remove"]')
      .parent()
      .find("input")
      .should("be.not.checked");

    cy.get('[data-testid="your-stake-radio-remove"]').click({ force: true });
    cy.get('[data-testid="your-stake-radio-add"]')
      .parent()
      .find("input")
      .should("be.not.checked");
    cy.get('[data-testid="your-stake-radio-remove"]')
      .parent()
      .find("input")
      .should("be.checked");
  });
});
