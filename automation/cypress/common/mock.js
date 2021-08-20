import _ from "lodash";

const defaultMockOptions = {
  provider: {
    accounts: ["0x0000000000000000000000000000000000000000"],
    chain: "0x3",
  },
  vesting: {
    balance: "123",
    tranches: { fixture: "events.json" },
  },
  claim: {
    committed: false,
    used: false,
    expired: false,
    blockedCountries: ["US"],
  },
};

export const mock = (cy, options = {}) => {
  const mergedOptions = _.merge({}, defaultMockOptions, options);
  // PROVIDER
  cy.intercept(
    "GET",
    "/mocks/detect-provider/accounts",
    JSON.stringify({ accounts: mergedOptions.provider.accounts })
  );
  cy.intercept(
    "GET",
    "/mocks/detect-provider/chain",
    JSON.stringify({ chain: mergedOptions.provider.chain })
  );

  // VESTING
  cy.intercept(
    "GET",
    "/mocks/vesting/balance",
    JSON.stringify(mergedOptions.vesting.balance)
  );
  cy.intercept("GET", "/mocks/vesting/events", mergedOptions.vesting.tranches);

  // CLAIM
  cy.intercept(
    "GET",
    "/mocks/claim/committed",
    JSON.stringify(mergedOptions.claim.committed)
  );
  cy.intercept("POST", "/mocks/claim/expired", (req) => {
    const { expiry } = JSON.parse(req.body);
    req.reply(
      JSON.stringify(expiry !== 0 && expiry < new Date().getTime() / 1000)
    );
  });
  cy.intercept(
    "GET",
    "/mocks/claim/used",
    JSON.stringify(mergedOptions.claim.used)
  );
  cy.intercept("POST", "/mocks/claim/blocked", (req) => {
    const country = JSON.parse(req.body);
    const blocked = mergedOptions.claim.blockedCountries.includes(country);
    req.reply(blocked.toString());
  });
};

export const newMock = (balances, overrides = {}) => {
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
  const lienHandler = (req) => {
    req.reply({
      statusCode: 200,
      body: JSON.stringify(balances.lien),
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
  cy.intercept(
    "/mocks/vesting/balance/lien",
    overrides["/mocks/vesting/balance/lien"] || lienHandler
  );
};
