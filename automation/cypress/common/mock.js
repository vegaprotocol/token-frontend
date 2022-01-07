import BigNumber from "bignumber.js";
import _ from "lodash";

const defaultBalances = {
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

const defaultMockOptions = {
  provider: {
    accounts: ["0x0000000000000000000000000000000000000000"],
    chain: "0x3",
  },
  vesting: {
    balance: "123",
    tranches: { fixture: "events.json" },
    stakedBalance: "10",
    stakedTotal: "20",
  },
  claim: {
    committed: false,
    used: false,
    expired: false,
    blockedCountries: ["US"],
  },
  staking: {
    stakedTotal: "20",
    balance: "30",
  },
  token: {
    balance: new BigNumber(100),
    totalSupply: "20",
    allowance: Number.MAX_SAFE_INTEGER - 1,
  },
  vegaWallet: {
    commandSync: {},
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
    "/mocks/vesting/balance/staked",
    mergedOptions.vesting.stakedBalance
  );
  cy.intercept(
    "GET",
    "/mocks/vesting/balance",
    JSON.stringify(mergedOptions.vesting.balance)
  );
  cy.intercept(
    "GET",
    "/mocks/vesting/staked/total",
    JSON.stringify(mergedOptions.vesting.stakedTotal)
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

  // VEGA WALLET
  cy.intercept(
    "http://localhost:1789/api/v1/status",
    JSON.stringify({ success: true })
  );
  cy.intercept(
    "http://localhost:1789/api/v1/auth/token",
    JSON.stringify({ token: "token" })
  ).as("getToken");
  cy.intercept(
    "http://localhost:1789/api/v1/keys",
    JSON.stringify({
      keys: [
        {
          algo: "vega/ed25519",
          meta: [{ key: "alias", value: "Test wallet" }],
          pub: "pub",
          tainted: false,
        },
      ],
    })
  ).as("getKeys");
  cy.intercept(
    "http://localhost:1789/api/v1/command/sync",
    JSON.stringify(mergedOptions.vegaWallet.commandSync)
  );
  cy.intercept(
    "http://localhost:1789/api/v1/version",
    JSON.stringify({ version: "10.0.0" })
  ).as("getVersion");

  // VEGA TOKEN
  cy.intercept(
    "GET",
    "/mocks/vega-token/data",
    JSON.stringify(mergedOptions.token.totalSupply)
  );
  cy.intercept(
    "GET",
    "/mocks/vega-token/balance",
    JSON.stringify(mergedOptions.token.balance)
  );
  cy.intercept(
    "GET",
    "/mocks/vega-token/allowance",
    JSON.stringify(mergedOptions.token.allowance)
  );

  // VEGA STAKING
  cy.intercept(
    "GET",
    "/mocks/staking/balance/total",
    mergedOptions.staking.stakedTotal
  );
  cy.intercept("GET", "/mocks/staking/balance", mergedOptions.staking.balance);
};

export const mockVesting = (balances, overrides = {}) => {
  balances = _.merge({}, defaultBalances, balances);
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

export const sendChainResponse = (cy, chainCommand, eventResponse, data) => {
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
