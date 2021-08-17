import _ from "lodash";

const generateCodeLink = ({ code, amount, tranche, nonce, target, expiry }) => {
  return `/claim/?r=${code}&d=${amount}&t=${tranche}&n=${nonce}&ex=${expiry}${
    target ? `&targ=${target}` : ""
  }`;
};

const defaultMockOptions = {
  provider: {
    accounts: ["0x0000000000000000000000000000000000000000"],
    chain: "0x3",
  },
  vesting: {
    balance: "123",
  },
  claim: {
    committed: false,
    used: false,
    expired: false,
    blockedCountries: ["US"],
  },
};

const mock = (cy, options = {}) => {
  const mergedOptions = _.merge({}, defaultMockOptions, options);
  // PROVIDER
  cy.intercept(
    "GET",
    "mocks/detect-provider/accounts",
    JSON.stringify({ accounts: mergedOptions.provider.accounts })
  );
  cy.intercept(
    "GET",
    "mocks/detect-provider/chain",
    JSON.stringify({ chain: mergedOptions.provider.chain })
  );

  // VESTING
  cy.intercept(
    "GET",
    "mocks/vesting/balance",
    JSON.stringify(mergedOptions.vesting.balance)
  );
  cy.intercept("GET", "mocks/vesting/events", { fixture: "events.json" });

  // CLAIM
  cy.intercept(
    "GET",
    "mocks/claim/committed",
    JSON.stringify(mergedOptions.claim.committed)
  );
  cy.intercept("POST", "mocks/claim/expired", (req) => {
    const { expiry } = JSON.parse(req.body);
    req.reply(
      JSON.stringify(expiry !== 0 && expiry < new Date().getTime() / 1000)
    );
  });
  cy.intercept(
    "GET",
    "mocks/claim/used",
    JSON.stringify(mergedOptions.claim.used)
  );
  cy.intercept("POST", "mocks/claim/blocked", (req) => {
    const country = JSON.parse(req.body);
    const blocked = mergedOptions.claim.blockedCountries.includes(country);
    req.reply(blocked.toString());
  });
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
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // I see the correct error state
    cy.contains(
      "Connected to Ethereum key 0x0000000000000000000000000000000000000000."
    ).should("exist");
    cy.contains(
      "Error: The address you are connected to is not the address the claim is valid for. To claim these tokens please connect with 0x1111111111111111111111111111111111111."
    ).should("exist");
  });

  it("Renders error state if code is expired", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: "0x" + "0".repeat(40),
      expiry: 1,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // I see the correct error state
    cy.contains("codeExpired").should("exist");
    cy.contains(
      "This code (code…code) has expired and cannot be used to claim tokens."
    ).should("exist");
  });

  it("Renders error state state if tranche cannot be found ", () => {
    // As a user
    // Given a code { code, 1, 10000000, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 10000000,
      nonce: "f00",
      target: "0x" + "0".repeat(40),
      expiry: 0,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // I see the correct error state
    cy.contains("Tranche not found").should("exist");
  });

  it("Renders error state state if code has already been used ", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      target: "0x" + "0".repeat(40),
      expiry: 0,
    });
    mock(cy, {
      claim: {
        used: true,
      },
    });
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // I see the correct error state
    cy.contains("codeUsed").should("exist");
    cy.contains("codeUsedText").should("exist");
    cy.contains(
      "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
    ).should("exist");
    cy.contains(
      "The token address is 0x1b7192491bf89d616676032656b2c7a55fd08e4c. Hit the add token button in your ERC20 wallet and enter this address."
    ).should("exist");
  });

  it("Renders error state if the country is blocked", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy, { claim: { blockedCountries: ["US"] } });
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // And I select a blocked country
    cy.get("[data-testid='country-selector']").select(
      "United States of America (the)"
    );
    // When I click continue
    cy.contains("Continue").click();
    // I am redirected to the not permitted page
    cy.contains(
      "You cannot claim VEGA tokens if you reside in that country"
    ).should("exist");
    cy.url().should("include", "not-permitted");
  });

  it("Renders wrong chain state", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy, { provider: { chain: "0x1" } });
    // When I visit the claim page
    cy.visit(link);
    // I see wrong chain
    cy.contains("Looks like you are on Mainnet").should("exist");
    cy.contains("This app is only configured for Ropsten").should("exist");
  });
});

describe("Untargeted code", () => {
  afterEach((done) => {
    return cy.window().then((win) => {
      win.promiManager.clearAllListeners();
      done();
    });
  });

  it("Renders error state if the transaction is rejected in step 1", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // And I select a permitted country
    cy.get("[data-testid='country-selector']").select("Afghanistan");
    // And I click continue
    cy.contains("Continue").click();
    // Then I see the in progress state
    cy.contains("Awaiting action in Ethereum wallet (e.g. metamask)").should(
      "exist"
    );
    // When the transaction errors
    sendChainResponse(cy, "commit", "error", new Error("some error")).then(
      () => {
        // Then I see the error callout state
        cy.contains("Something went wrong").should("exist");
        cy.contains("Try again").should("exist");
        // When I click try again
        cy.contains("Try again").click();
        // Then the form resets
        cy.contains("Continue").should("exist");
      }
    );
  });

  it("Renders error state if the transaction is rejected in step 2", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // And I select a permitted country
    cy.get("[data-testid='country-selector']").select("Afghanistan");
    // And I click continue
    cy.contains("Continue").click();
    // Then I see the in progress state
    cy.contains("Awaiting action in Ethereum wallet (e.g. metamask)").should(
      "exist"
    );
    // When I permit the transaction
    sendChainResponse(cy, "commit", "transactionHash", "hash").then(() => {
      // Then I see transaction in progress and link
      cy.contains("Transaction in progress").should("exist");
      cy.contains("View on Etherscan (opens in a new tab)")
        .should("have.attr", "href")
        .and("match", /ropsten.etherscan.io\/tx\/hash/);
      // When the transaction is complete
      return sendChainResponse(cy, "commit", "receipt").then(() => {
        // When I click the claim button
        cy.contains("Claim 0.00001 Vega").click();
        // When the chain throws an error
        return sendChainResponse(
          cy,
          "claim",
          "error",
          new Error("Some error")
        ).then(() => {
          // Then I see the error callout state
          cy.contains("Something went wrong").should("exist");
          cy.contains("Try again").should("exist");
          // When I click try again
          cy.contains("Try again").click();
          // Then the form resets
          cy.contains("Claim 0.00001 Vega").should("exist");
        });
      });
    });
  });

  it("Allows user to do an untargeted claim", () => {
    // As a user
    // Given a code { code, 1, 1, f00, "0x" + "0".repeat(40), 0}
    const link = generateCodeLink({
      code: "code",
      amount: 1,
      tranche: 1,
      nonce: "f00",
      expiry: 0,
    });
    mock(cy);
    // When I visit the claim page
    cy.visit(link);
    // And I connect my wallet
    cy.contains("Connect to an Ethereum wallet").click();
    // And I select a permitted country
    cy.get("[data-testid='country-selector']").select("Afghanistan");
    // And I click continue
    cy.contains("Continue").click();
    // Then I see the in progress state
    cy.contains("Awaiting action in Ethereum wallet (e.g. metamask)").should(
      "exist"
    );
    // When I permit the transaction
    sendChainResponse(cy, "commit", "transactionHash", "hash").then(() => {
      // Then I see transaction in progress and link
      cy.contains("Transaction in progress").should("exist");
      cy.contains("View on Etherscan (opens in a new tab)")
        .should("have.attr", "href")
        .and("match", /ropsten.etherscan.io\/tx\/hash/);
      // When the transaction is complete
      return sendChainResponse(cy, "commit", "receipt").then(() => {
        // Then the transaction callout shows complete and link
        cy.contains("Complete").should("exist");
        cy.get("[data-testid='claim-step-1']")
          .contains("View on Etherscan (opens in a new tab)")
          .should("have.attr", "href")
          .and("match", /ropsten.etherscan.io\/tx\/hash/);
        // When I click the claim button
        cy.contains("Claim 0.00001 Vega").click();
        // Then I see the in progress state
        cy.contains(
          "Awaiting action in Ethereum wallet (e.g. metamask)"
        ).should("exist");
        // When the chain gives back a transaction hash
        return sendChainResponse(cy, "claim", "transactionHash", "hash2").then(
          () => {
            // Then I see the in progress callout
            cy.contains("Transaction in progress").should("exist");
            cy.get("[data-testid='claim-step-2']")
              .contains("View on Etherscan (opens in a new tab)")
              .should("have.attr", "href")
              .and("match", /ropsten.etherscan.io\/tx\/hash2/);
            // When the chain confirms the transaction
            return sendChainResponse(cy, "claim", "receipt").then(() => {
              // Then i see the complete callout
              cy.contains("Complete").should("exist");
              cy.contains("View on Etherscan (opens in a new tab)");

              // THen the finished state is rendered
              cy.contains("Claim complete").should("exist");
              cy.contains("claimCompleteMessage").should("exist");
              cy.contains("Link transaction:").should("exist");
              cy.contains("Claim transaction:").should("exist");
              cy.contains("hash")
                .should("have.attr", "href")
                .and("match", /ropsten.etherscan.io\/tx\/hash/);
              cy.contains("hash2")
                .should("have.attr", "href")
                .and("match", /ropsten.etherscan.io\/tx\/hash2/);
              cy.contains(
                "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
              ).should("exist");
              cy.contains(
                "The token address is 0x1b7192491bf89d616676032656b2c7a55fd08e4c. Hit the add token button in your ERC20 wallet and enter this address."
              ).should("exist");
            });
          }
        );
      });
    });
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
