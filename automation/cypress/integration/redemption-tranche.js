import { mock, newMock } from "../common/mock";

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

const sendChainResponse = (cy, chainCommand, eventResponse, data) => {
  return cy.window().then((win) => {
    const commitEvents = win.promiManager.promiEvents.filter(
      ({ name }) => name === chainCommand
    );
    if (commitEvents.length !== 1) {
      throw new Error(
        `Too many or not enough ${chainCommand} promi events found. Found:`,
        commitEvents
      );
    }
    win.dispatchEvent(
      new CustomEvent(`${eventResponse}-mock`, {
        detail: { data, id: commitEvents[0].id },
      })
    );
    return win;
  });
};

describe.only("Redemption through tranche", () => {
  it("Renders tranche table", () => {
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption/1");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
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
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption/1");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
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

    cy.get("[data-testid='tranche-table']").should("exist");
  });
});
