import { mock, mockVesting, sendChainResponse } from "../common/mock";

const balances = {
  1: {
    locked: 60,
    vested: 20,
  },
  2: {
    locked: 30,
    vested: 20,
  },
  lien: 5,
};

describe("Redemption through tranche", () => {
  afterEach(() => {
    cy.window().then((win) => {
      if (win.promiManager && win.promiManager.clearAllListeners) {
        win.promiManager.clearAllListeners();
      }
    });
  });

  it("Renders tranche table", () => {
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting/1");
    // Then I see the tranches table
    cy.get("[data-testid='tranche-table-total'] th")
      .eq(0)
      .should("have.text", "Tranche 1");
    cy.get("[data-testid='tranche-table-total'] td")
      .eq(0)
      .should("have.text", "0.0006");

    cy.get("[data-testid='tranche-table-start'] th")
      .eq(0)
      .should("have.text", "Unlocking starts");
    cy.get("[data-testid='tranche-table-start'] td")
      .eq(0)
      .should("have.text", "12/08/2021");

    cy.get("[data-testid='tranche-table-finish'] th")
      .eq(0)
      .should("have.text", "Fully unlocked");
    cy.get("[data-testid='tranche-table-finish'] td")
      .eq(0)
      .should("have.text", "12/08/2021");

    cy.get("[data-testid='tranche-table-locked'] th")
      .eq(0)
      .should("have.text", "Locked");
    cy.get("[data-testid='tranche-table-locked'] td")
      .eq(0)
      .should("have.text", "0.0004");

    cy.get("[data-testid='tranche-table-unlocked'] th")
      .eq(0)
      .should("have.text", "Unlocked");
    cy.get("[data-testid='tranche-table-unlocked'] td")
      .eq(0)
      .should("have.text", "0.0002");
  });

  it("Renders error state is the transaction is rejected", () => {
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting/1");

    // When I redeem the value
    cy.contains("Redeem unlocked VEGA from tranche 1").click();

    sendChainResponse(cy, "withdraw-from-tranche", "error", new Error("test"));
    cy.get("[data-testid='callout'] p").should(
      "have.text",
      "Something went wrong"
    );
    cy.get("[data-testid='callout'] button").should("have.text", "Try again");

    // When click try again
    cy.contains("Try again").click();

    // Then the form is reset
    cy.get("[data-testid='tranche-table']").should("exist");
  });

  it("Renders in progress and completed states", () => {
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting/1");

    // When I redeem the value
    cy.contains("Redeem unlocked VEGA from tranche 1").click();

    sendChainResponse(cy, "withdraw-from-tranche", "transactionHash", "hash");
    cy.get("[data-testid='callout'] p:first").should(
      "have.text",
      "Transaction in progress"
    );
    cy.get("[data-testid='callout'] a")
      .should("have.text", "View on Etherscan (opens in a new tab)")
      .should("have.attr", "href")
      .and("match", /ropsten.etherscan.io\/tx\/hash/);

    sendChainResponse(cy, "withdraw-from-tranche", "receipt", "hash");
    cy.get("[data-testid='callout'] p:first").should(
      "have.text",
      "Tokens from this Tranche have been redeemed"
    );
    cy.get("[data-testid='callout'] a:first")
      .should("have.text", "View on Etherscan (opens in a new tab)")
      .should("have.attr", "href")
      .and("match", /ropsten.etherscan.io\/tx\/hash/);
  });
});
