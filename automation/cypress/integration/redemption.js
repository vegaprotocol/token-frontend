import { mock } from "../common/mock";

describe("Redemption", () => {
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
  });

  it("Renders check and redeem page content", () => {
    // As a user
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

    // Then I see redemption information
    cy.get("[data-testid='redemption-description']").should(
      "have.text",
      "0xBD8530F1AB4485405D50E27d13b6AfD6e3eFd9BD has 0.00050 VEGA tokens in 2 tranches of the vesting contract."
    );
    cy.get("[data-testid='redemption-unlocked-tokens']").should(
      "have.text",
      "A total of 0.0005 Unlocked Vega tokens."
    );
    cy.get("[data-testid='redemption-locked-tokens']").should(
      "have.text",
      "A total of 0.0005 Locked Vega tokens."
    );
    cy.get("[data-testid='redemption-staked-tokens']").should(
      "have.text",
      "0.0005 are staked."
    );
    cy.get("[data-testid='redemption-page-description']").should(
      "have.text",
      "Use this page to redeem any unlocked VEGA tokens"
    );
    cy.get("[data-testid='redemption-note']").should(
      "have.text",
      "Note: The redeem function attempts to redeem all unlocked tokens from a tranche. However, it will only work if all the amount you are redeeming would not reduce the amount you have staked while vesting."
    );
  });

  it("If the user has no tokens it renders an empty state", () => {
    // TODO
  });
});
