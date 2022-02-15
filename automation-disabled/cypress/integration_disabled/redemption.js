import { mock, mockVesting } from "../common/mock";

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

describe("Redemption", () => {
  afterEach(() => {
    cy.window().then((win) => {
      if (win.promiManager && win.promiManager.clearAllListeners) {
        win.promiManager.clearAllListeners();
      }
    });
  });

  it("Renders loading state while data is loading", () => {
    // As a user
    mockVesting(balances, {
      "/mocks/vesting/tranches/*/balance/locked": (req) => {
        req.reply({
          statusCode: 200,
          delay: 100, // Add delay to ensure loading state
          body: "1",
        });
      },
    });
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "50",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");
    // Then I see a loading state
    cy.get("[data-testid='splash-loader']").should("exist");
  });

  it("Renders error state if data loading goes sideways", () => {
    // As a user
    mockVesting(balances, {
      "/mocks/vesting/tranches/*/balance/locked": (req) => {
        req.reply({
          statusCode: 500,
        });
      },
    });
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "50",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    cy.contains("You have no VEGA tokens currently vesting.");
  });

  it("Renders empty state if the user has no tokens in no tranches", () => {
    // As a user
    mock(cy, {
      provider: {
        accounts: ["0x" + "0".repeat(40)],
      },
      vesting: {
        balance: "50",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see an empty state
    cy.get("[data-testid='callout']").should(
      "have.text",
      "You have no VEGA tokens currently vesting."
    );
  });

  it("Renders check and redeem page content", () => {
    // As a user with balances:
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see redemption information
    cy.get("[data-testid='redemption-description']").should(
      "have.text",
      "The connected Ethereum wallet (0xBD85…d9BD) has 0.0009 VEGA tokens in 2 tranche(s) of the vesting contract."
    );
    // cy.get("[data-testid='redemption-unlocked-tokens']").should(
    //   "have.text",
    //   "A total of 0.0004 Unlocked Vega tokens."
    // );
    // cy.get("[data-testid='redemption-locked-tokens']").should(
    //   "have.text",
    //   "A total of 0.0005 Locked Vega tokens."
    // );
    // // TODO needs to be implemented
    // cy.get("[data-testid='redemption-staked-tokens']").should(
    //   "have.text",
    //   "0.00005 are staked."
    // );
    // cy.get("[data-testid='redemption-page-description']").should(
    //   "have.text",
    //   "Use this page to redeem any unlocked VEGA tokens."
    // );
    // cy.get("[data-testid='redemption-note']").should(
    //   "have.text",
    //   "Note: The redeem function attempts to redeem all unlocked tokens from a tranche. However, it will only work if all the amount you are redeeming would not reduce the amount you have staked while vesting."
    // );
  });

  it("Renders callout", () => {
    // As a user with balances:
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    cy.get("[data-testid='callout'] h3").should(
      "have.text",
      "You can stake your VEGA tokens even while locked."
    );
    cy.get("[data-testid='callout'] p").should(
      "have.text",
      "Use your Vega tokens to stake a validator, earn rewards and participate in governance of the Vega network."
    );
  });

  it("Renders table with all vesting information", () => {
    // As a user with balances
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see staked information in the table
    cy.get("[data-testid='vesting-table']").should("exist");
    cy.get("[data-testid='vesting-table-total'] th").should(
      "have.text",
      "Vesting VEGA"
    );
    cy.get("[data-testid='vesting-table-total'] td").should(
      "have.text",
      "0.0009"
    );

    cy.get("[data-testid='vesting-table-locked'] th").should(
      "have.text",
      "Locked"
    );
    cy.get("[data-testid='vesting-table-locked'] td").should(
      "have.text",
      "0.0005"
    );

    cy.get("[data-testid='vesting-table-unlocked'] th").should(
      "have.text",
      "Unlocked"
    );
    cy.get("[data-testid='vesting-table-unlocked'] td").should(
      "have.text",
      "0.0004"
    );

    cy.get("[data-testid='vesting-table-staked'] th").should(
      "have.text",
      "Associated"
    );
    cy.get("[data-testid='vesting-table-staked'] td").should(
      "have.text",
      "0.00005"
    );
    // And renders a bar
    cy.get(".vesting-table__progress-bar")
      .invoke("outerWidth")
      .then((val) => {
        cy.get(".vesting-table__progress-bar--locked")
          .invoke("outerWidth")
          // δ of 1
          .should("gte", Math.floor((val * 0.005) / 0.009))
          .should("lte", Math.ceil((val * 0.005) / 0.009));
        cy.get(".vesting-table__progress-bar--vested")
          .invoke("outerWidth")
          // δ of 1
          .should("gte", Math.floor((val * 0.004) / 0.009))
          .should("lte", Math.ceil((val * 0.004) / 0.009));
        cy.get(".vesting-table__progress-bar--staked")
          .invoke("outerWidth")
          // δ of 1
          .should("gte", Math.floor((val * 0.0005) / 0.009))
          .should("lte", Math.ceil((val * 0.0005) / 0.009));
      });
  });

  it("Renders correct data for single tranche", () => {
    // As a user with balances
    const balances = {
      1: {
        locked: 90,
        vested: 20,
      },
      lien: 5,
    };
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
    cy.visit("/vesting");

    // Then I see tranche information in the table
    cy.get("[data-testid='tranche-table']").should("exist");

    cy.get("[data-testid='tranche-table-total'] th").should(
      "have.text",
      "Tranche 1"
    );
    cy.get("[data-testid='tranche-table-total'] td").should(
      "have.text",
      "0.0009"
    );

    cy.get("[data-testid='tranche-table-start'] th").should(
      "have.text",
      "Unlocking starts"
    );
    cy.get("[data-testid='tranche-table-start'] td").should(
      "have.text",
      "12/08/2021"
    );

    cy.get("[data-testid='tranche-table-finish'] th").should(
      "have.text",
      "Fully unlocked"
    );
    cy.get("[data-testid='tranche-table-finish'] td").should(
      "have.text",
      "12/08/2021"
    );

    cy.get("[data-testid='tranche-table-locked'] th").should(
      "have.text",
      "Locked"
    );
    cy.get("[data-testid='tranche-table-locked'] td").should(
      "have.text",
      "0.0007"
    );

    cy.get("[data-testid='tranche-table-unlocked'] th").should(
      "have.text",
      "Unlocked"
    );
    cy.get("[data-testid='tranche-table-unlocked'] td").should(
      "have.text",
      "0.0002"
    );
  });

  it("Renders correct data for multiple tranche", () => {
    // As a user with balances
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see tranche information in the table
    cy.get("[data-testid='tranche-table']").should("have.length", 2);

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

    cy.get("[data-testid='tranche-table-total'] th")
      .eq(1)
      .should("have.text", "Tranche 2");
    cy.get("[data-testid='tranche-table-total'] td")
      .eq(1)
      .should("have.text", "0.0003");

    cy.get("[data-testid='tranche-table-start'] th")
      .eq(1)
      .should("have.text", "Unlocking starts");
    cy.get("[data-testid='tranche-table-start'] td")
      .eq(1)
      .should("have.text", "12/08/2021");

    cy.get("[data-testid='tranche-table-finish'] th")
      .eq(1)
      .should("have.text", "Fully unlocked");
    cy.get("[data-testid='tranche-table-finish'] td")
      .eq(1)
      .should("have.text", "19/08/2021");

    cy.get("[data-testid='tranche-table-locked'] th")
      .eq(1)
      .should("have.text", "Locked");
    cy.get("[data-testid='tranche-table-locked'] td")
      .eq(1)
      .should("have.text", "0.0001");

    cy.get("[data-testid='tranche-table-unlocked'] th")
      .eq(1)
      .should("have.text", "Unlocked");
    cy.get("[data-testid='tranche-table-unlocked'] td")
      .eq(1)
      .should("have.text", "0.0002");
  });

  it("Renders message if tranche has not started vesting", () => {
    mockVesting(balances);
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
        tranches: { fixture: "future-tranche.json" },
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    cy.get("[data-testid='tranche-table-footer']").should(
      "have.text",
      "All the tokens in this tranche are locked and can not be redeemed yet."
    );
  });

  it("Renders redeem button if the user can redeem", () => {
    // As a user with balances
    mockVesting({
      1: {
        locked: 90,
        vested: 20,
      },
      lien: 0,
    });
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see a message saying
    cy.get("[data-testid='tranche-table-footer']").should(
      "have.text",
      "Redeem unlocked VEGA from tranche 1"
    );
  });

  it("Renders message if user needs to reduce their stake to redeem", () => {
    mockVesting({
      1: {
        locked: 90,
        vested: 20,
      },
      lien: 80,
    });
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // Then I see a message saying
    cy.get("[data-testid='tranche-table-footer']").should(
      "have.text",
      "You must reduce your associated vesting tokens by at least 0.0001 to redeem from this tranche. Manage your stake or just dissociate your tokens."
    );
  });

  it("Prompts user to go to staking page", () => {
    mockVesting({
      1: {
        locked: 90,
        vested: 20,
      },
      lien: 0,
    });
    mock(cy, {
      provider: {
        accounts: ["0xb89A165EA8b619c14312dB316BaAa80D2a98B493"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/vesting");

    // When I redeem the value
    cy.contains("Redeem unlocked VEGA from tranche 1").click();
    // Then I am redirected to a new page
    cy.url().should("include", "vesting/1");
  });
});
