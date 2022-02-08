import { mock } from "../common/mock";

describe("staking", () => {
  function connectToWallets() {
    cy.get('[data-testid="connect-vega"]').click();
    cy.get('[data-testid="wallet-name"]').type("wallet");
    cy.get('[data-testid="wallet-password"]').type("wallet");
    cy.get('[data-testid="wallet-login"]').click();
  }

  it("staking page renders nodes", () => {
    mock(cy);
    cy.visit("/staking");

    // connect
    connectToWallets();

    // Expect the two mocked nodes to be displayed
    cy.get('[data-testid="node-list-item"]').should("have.length", 2);
    cy.get('[data-testid="node-list-item"]')
      .first()
      .find("a")
      .should("have.text", "node-id-1");
    cy.get('[data-testid="node-list-item"]')
      .last()
      .find("a")
      .should("have.text", "node-id-2");

    cy.get('[data-testid="node-list-item"]').first().find("a").click();
    cy.url().should("include", "/staking/node-id-1");
  });

  it("staking/:node page can add stake to given node", () => {
    mock(cy);

    const nodeId = "node-id-1";
    cy.visit(`/staking/${nodeId}`);

    // connect
    connectToWallets();

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
    cy.get('[data-testid="epoch-countdown"]').contains("Ends in 24 hours");

    // test Your stake
    cy.get('[data-testid="your-stake"]').contains("Your Stake");
    cy.get('[data-testid="your-stake"]').contains(
      "Your Stake On Node (This Epoch)"
    );
    cy.get('[data-testid="your-stake"]').contains(
      "Your Stake On Node (Next Epoch)"
    );

    // assert that we are correctly summing the delegation amounts to show how
    // much stake you have on the current and next epoch
    cy.get('[data-testid="stake-this-epoch"]').contains("200");
    cy.get('[data-testid="stake-next-epoch"]').contains("400");

    // FORM INTERACTION

    cy.get('[data-testid="add-stake-radio"]').should("not.be.checked");
    cy.get('[data-testid="remove-stake-radio"]').should("not.be.checked");

    // ADD STAKE FLOW
    cy.get('[data-testid="add-stake-radio"]').click({ force: true });

    cy.get('[data-testid="stake-form"]')
      .find("h2")
      .should("have.text", "How much to Add in next epoch?");

    cy.get('[data-testid="stake-form"]')
      .find('button[type="submit"]')
      .should("have.text", "Add VEGA tokens");

    const amount = "100";
    cy.get('[data-testid="token-amount-input"]').type(amount);

    cy.get('[data-testid="stake-form"]')
      .find('button[type="submit"]')
      .should("have.text", `Add ${amount} VEGA tokens`);

    cy.get('[data-testid="stake-form"]').find('button[type="submit"]').click();

    cy.get('[data-testid="callout"] h3').should(
      "have.text",
      `Adding ${amount} VEGA to node ${nodeId}`
    );
    cy.get('[data-testid="callout"]').contains(
      "This should take a few seconds to confirm"
    );

    cy.get('[data-testid="callout"] h3').should(
      "have.text",
      `${amount} VEGA has been added to node ${nodeId}`
    );
  });

  it("staking/:node page can remove stake to given node", () => {
    mock(cy, { vegaWallet: { commandSync: { success: true } } });

    const nodeId = "node-id-1";
    cy.visit(`/staking/${nodeId}`);

    // connect
    connectToWallets();

    // REMOVE STAKE FLOW
    cy.get('[data-testid="remove-stake-radio"]').click({ force: true });

    cy.get('[data-testid="stake-form"]')
      .find("h2")
      .should("have.text", "How much to Remove in next epoch?");

    cy.get('[data-testid="stake-form"]')
      .find('button[type="submit"]')
      .should("have.text", "Remove VEGA tokens");

    const amount = "100";
    cy.get('[data-testid="token-amount-input"]').type(amount);

    cy.get('[data-testid="stake-form"]')
      .find('button[type="submit"]')
      .should("have.text", `Remove ${amount} VEGA tokens`);

    cy.get('[data-testid="stake-form"]').find('button[type="submit"]').click();

    cy.get('[data-testid="callout"] h3').should(
      "have.text",
      `Removing ${amount} VEGA from node ${nodeId}`
    );
    cy.get('[data-testid="callout"]').contains(
      "This should take a few seconds to confirm"
    );

    cy.get('[data-testid="callout"] h3').should(
      "have.text",
      `${amount} VEGA has been removed from node ${nodeId}`
    );
  });

  it("Shows error message if stake command fails", () => {
    mock(cy, {
      vegaWallet: {
        commandSync: { errors: "oops an error!" },
      },
    });

    const nodeId = "node-id-1";
    cy.visit(`/staking/${nodeId}`);

    // connect
    connectToWallets();

    cy.get('[data-testid="add-stake-radio"]').click({ force: true });

    const amount = "100";
    cy.get('[data-testid="token-amount-input"]').type(amount);

    cy.get('[data-testid="stake-form"]').find('button[type="submit"]').click();

    // TODO: Dom changes to fast to detect for pending state
    //
    // cy.get('[data-testid="callout"] h3').should(
    //   "have.text",
    //   `Adding ${amount} VEGA to node ${nodeId}`
    // );
    // cy.get('[data-testid="callout"]').contains(
    //   "This should take approximately 3 minutes to confirm"
    // );

    cy.get('[data-testid="callout"] h3').should(
      "have.text",
      "Something went wrong"
    );
  });
});
