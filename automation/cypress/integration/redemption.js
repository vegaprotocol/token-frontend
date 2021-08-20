import { mock } from "../common/mock";

const balances = {
  1: {
    locked: 40,
    vested: 20,
  },
  2: {
    locked: 10,
    vested: 20,
  },
};

const newMock = (balances, overrides = {}) => {
  const lockedHandler = (req) => {
    const trancheId = req.url.match(/tranches\/(\d*)\/balance/)[1];
    req.reply({
      statusCode: 200,
      body: balances[trancheId].locked,
    });
  };
  const vestedHandler = (req) => {
    const trancheId = req.url.match(/tranches\/(\d*)\/balance/)[1];
    req.reply({
      statusCode: 200,
      body: balances[trancheId].vested,
    });
  };
  cy.intercept(
    "/mocks/vesting/tranches/*/balance/locked",
    overrides["/mocks/vesting/tranches/*/balance/locked"] || lockedHandler
  );
  cy.intercept(
    "/mocks/vesting/tranches/*/balance/vested",
    overrides["/mocks/vesting/tranches/*/balance/vested"] || vestedHandler
  );
};

describe("Redemption", () => {
  it("Renders loading state while data is loading", () => {
    // As a user
    newMock(balances, {
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
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // Then I see a loading state
    cy.get("[data-testid='splash-loader']").should("exist");
  });

  it("Renders error state if data loading goes sideways", () => {
    // As a user
    newMock(balances, {
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
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // Then I see a loading state
    cy.get("[data-testid='redemption-error']").should("exist");
    cy.get("[data-testid='redemption-error']").should(
      "contain.text",
      "Something went wrong"
    );
    cy.get("[data-testid='redemption-error']").should(
      "contain.text",
      "We couldn't seem to load your data."
    );
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
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // Then I see an empty state
    cy.get("[data-testid='redemption-no-balance']").should(
      "have.text",
      "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed."
    );
  });

  it("Renders check and redeem page content", () => {
    // As a user with balances:
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();

    // Then I see redemption information
    cy.get("[data-testid='redemption-description']").should(
      "have.text",
      "0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD has 0.00090 VEGA tokens in 2 tranches of the vesting contract."
    );
    cy.get("[data-testid='redemption-unlocked-tokens']").should(
      "have.text",
      "A total of 0.0004 Unlocked Vega tokens."
    );
    cy.get("[data-testid='redemption-locked-tokens']").should(
      "have.text",
      "A total of 0.0005 Locked Vega tokens."
    );
    // TODO needs to be implemented
    cy.get("[data-testid='redemption-staked-tokens']").should(
      "have.text",
      "0.0002 are staked."
    );
    cy.get("[data-testid='redemption-page-description']").should(
      "have.text",
      "Use this page to redeem any unlocked VEGA tokens."
    );
    cy.get("[data-testid='redemption-note']").should(
      "have.text",
      "Note: The redeem function attempts to redeem all unlocked tokens from a tranche. However, it will only work if all the amount you are redeeming would not reduce the amount you have staked while vesting."
    );
  });

  it("Renders callout", () => {
    // As a user with balances:
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get("[data-testid='vega-callout'] h1").should(
      "have.text",
      "Stake your Locked VEGA tokens!"
    );
    cy.get("[data-testid='vega-callout'] p").should(
      "have.text",
      "Find out more about Staking."
    );
  });

  it("Renders table with all vesting information", () => {
    // As a user with balances
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();

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
      "Staked"
    );
    cy.get("[data-testid='vesting-table-staked'] td").should(
      "have.text",
      "0.0002"
    );
    // And renders a bar
    cy.get(".vesting-table__progress-bar")
      .invoke("outerWidth")
      .then((val) => {
        cy.get(".vesting-table__progress-bar--locked")
          .invoke("outerWidth")
          // δ of 1
          .should("gt", Math.floor((val * 0.005) / 0.009))
          .should("lt", Math.ceil((val * 0.005) / 0.009));
        cy.get(".vesting-table__progress-bar--vested")
          .invoke("outerWidth")
          // δ of 1
          .should("gt", Math.floor((val * 0.004) / 0.009))
          .should("lt", Math.ceil((val * 0.004) / 0.009));
        cy.get(".vesting-table__progress-bar--staked")
          .invoke("outerWidth")
          // δ of 1
          .should("gt", Math.floor((val * 0.002) / 0.009))
          .should("lt", Math.ceil((val * 0.002) / 0.009));
      });
  });

  it("Renders correct data for single tranche", () => {
    // As a user with balances
    const balances = {
      1: {
        locked: 40,
        vested: 20,
      },
    };
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
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();

    // Then I see tranche information in the table
    cy.get("[data-testid='tranche-table']").should("exist");

    cy.get("[data-testid='tranche-table-total'] th").should(
      "have.text",
      "Tranche 1"
    );
    cy.get("[data-testid='tranche-table-total'] td").should(
      "have.text",
      "10000"
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
      "0.0004"
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
    newMock(balances);
    mock(cy, {
      provider: {
        accounts: ["0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD"],
      },
      vesting: {
        balance: "90",
      },
    });
    // When visiting redemption
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();

    // Then I see tranche information in the table
    cy.get("[data-testid='tranche-table']").should("have.length", 2);

    cy.get("[data-testid='tranche-table-total'] th")
      .eq(0)
      .should("have.text", "Tranche 1");
    cy.get("[data-testid='tranche-table-total'] td")
      .eq(0)
      .should("have.text", "0.0001");

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
      .should("have.text", "0.00009");

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
    newMock(balances);
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
    cy.visit("/redemption");
    // When I connect to my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get("[data-testid='tranche-table-footer']").should(
      "have.text",
      "All the tokens in this tranche are locked and can not be redeemed yet."
    );
  });
  it("Renders message if suer needs to reduce their stake to redeem", () => {});
  it("Renders redeem button if the user can redeem", () => {});
});
