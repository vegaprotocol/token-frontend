const generateCodeLink = ({ code, amount, tranche, nonce, target, expiry }) => {
  return `/claim/?r=${code}&d=${amount}&t=${tranche}&n=${nonce}&ex=${expiry}${
    target ? `&targ=${target}` : ""
  }`;
};

const mock = (cy) => {
  // PROVIDER
  cy.intercept(
    "GET",
    "mocks/detect-provider/accounts",
    JSON.stringify({ accounts: ["0x0000000000000000000000000000000000000000"] })
  );
  cy.intercept(
    "GET",
    "mocks/detect-provider/chain",
    JSON.stringify({ chain: "0x3" })
  );

  // VESTING
  cy.intercept("GET", "mocks/vesting/balance", "123");

  // CLAIM
  const blockedCountries = ["US"];
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
  it("Renders error heading and error subheading if code is not enough", () => {
    // As a user
    mock(cy);
    // Given a link with no information
    // When visiting the claim page
    cy.visit("/claim");
    // When I try to connect
    cy.contains("Connect to an Ethereum wallet").click();
    // I see an error state
    cy.contains("Something doesn't look right");
    cy.contains(
      "If you have been given a link please double check and try again"
    );
  });

  it("Renders connect button if code looks reasonable", () => {
    // As a user
    // Given a code with { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: "0x" + "0".repeat(40),
      expiry: 0,
    });
    mock(cy);
    // When visiting the claim page
    cy.visit(link);
    // I see the connect button
    cy.contains("Connect to an Ethereum wallet");
    // And I see information relating to the
    cy.contains(
      "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
    );
  });

  it("Renders error state if connected wallet is not the target wallet", () => {
    // As a user
    // Given my address is "0x" + "0".repeat(40)
    // Given a code { code, 1, 1, f00, "0x" + "1".repeat(40), 0}
    const address = "0x1111111111111111111111111111111111111";
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: address,
      expiry: 0,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    cy.contains("Connect to an Ethereum wallet").click();
    // I see the correct error state
    cy.contains(
      "Connected to Ethereum key 0x0000000000000000000000000000000000000000."
    ).should("exist");
    cy.contains(
      "Error: The address you are connected to is not the address the claim is valid for. To claim these tokens please connect with 0x1111111111111111111111111111111111111."
    ).should("exist");
  });
});

// describe("Targeted code", () => {
//   it("After connecting it renders form if the code is valid", () => {
//     const address = "0x0000000000000000000000000000000000000000";
//     const link = generateCodeLink({
//       code: "code",
//       amount: 1,
//       tranche: 1,
//       nonce: "f00",
//       target: address,
//       expiry: 0,
//     });
//     console.log(link);
//     mock(cy);
//     cy.visit(link);
//     cy.contains("Connect to an Ethereum wallet").click();
//     cy.get("[data-testid='targeted-claim']").should("exist");
//     cy.get("button").should("be.disabled");
//   });

//   it("Enables button once the user has selected a permitted country", () => {
//     const address = "0x" + "0".repeat(0);
//     const link = generateCodeLink({
//       code: "code",
//       amount: 1,
//       tranche: 1,
//       nonce: "f00",
//       target: address,
//       expiry: 0,
//     });
//     mock(cy);
//     cy.visit(link);
//     cy.contains("Connect to an Ethereum wallet").click();
//     cy.get("[data-testid='targeted-claim']").should("exist");
//     cy.get("[data-testid='country-selector']").select("United Kingdom");
//     cy.contains("Continue").click();
//     cy.get("[data-testid='transaction-in-progress'").should("exist");
//   });
// });

// describe("Untargeted code", () => {
//   it("After connecting it renders form", () => {
//     const link = generateCodeLink({
//       code: "code",
//       amount: 1,
//       tranche: 1,
//       nonce: "f00",
//       expiry: 0,
//     });
//     mock(cy);
//     cy.visit(link);
//     cy.contains("Connect to an Ethereum wallet").click();
//     cy.get("[data-testid='claim-step-1']").should("exist");
//     cy.get("[data-testid='claim-step-2']").should("exist");
//   });
// });
