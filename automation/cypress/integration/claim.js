const generateCodeLink = ({ code, amount, tranche, nonce, target, expiry }) => {
  return `/claim/?r=${code}&d=${amount}&t=${tranche}&n=${nonce}&ex=${expiry}${
    target ? `&targ=${target}` : ""
  }`;
};

const mock = (cy) => {
  const blockedCountries = ["US"];
  cy.intercept("GET", "mocks/vesting/balance", "123");
  cy.intercept("GET", "mocks/claim/committed", "false");
  cy.intercept("GET", "mocks/claim/expired", "false");
  cy.intercept("GET", "mocks/claim/used", "false");
  cy.intercept("POST", "mocks/claim/blocked", (req) => {
    const country = JSON.parse(req.body);
    const blocked = blockedCountries.includes(country);
    req.reply(blocked.toString());
  });
};

describe("Claim", () => {
  it("Renders error heading and error subheading", () => {
    cy.visit("/claim");
    cy.contains("Something doesn't look right");
    cy.contains(
      "If you have been given a link please double check and try again"
    );
  });

  it("Renders connect button if code looks reasonable", () => {
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: "0x" + "0".repeat(0),
      expiry: 0,
    });
    cy.visit(link);
    cy.contains(
      "You will need to connect to an ethereum wallet to pay the gas and claim tokens"
    );
    cy.contains("Connect to an Ethereum wallet");
  });
});

describe("Targeted code", () => {
  it("After connecting it renders form if the code is valid", () => {
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: "0x" + "0".repeat(0),
      expiry: 0,
    });
    mock(cy);
    cy.visit(link);
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get("[data-testid='targeted-claim']").should("exist");
  });
});

describe("Untargeted code", () => {
  it("After connecting it renders form", () => {
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy);
    cy.visit(link);
    cy.contains("Connect to an Ethereum wallet").click();
    cy.get("[data-testid='claim-step-1']").should("exist");
    cy.get("[data-testid='claim-step-2']").should("exist");
  });
});
