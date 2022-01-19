import _ from "lodash";

const defaultMockOptions = {
  vegaWallet: {
    commandSync: {},
  },
};

export const mock = (cy, options = {}) => {
  const mergedOptions = _.merge({}, defaultMockOptions, options);
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
};
