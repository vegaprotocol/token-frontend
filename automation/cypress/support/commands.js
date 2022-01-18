// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//

// Cypress.Commands.overwrite("contains", (originalFn, selector, str, ...rest) => {
//   // if (!en[str]) {
//   //   throw Error("Could not find translations for string:", str);
//   // }
//   return originalFn(selector, en[str] || str, ...rest);
// });

import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

// todo: figure out how env vars actually work in CI
// const TEST_PRIVATE_KEY = Cypress.env('INTEGRATION_TEST_PRIVATE_KEY')
const TEST_PRIVATE_KEY =
  "0xe580410d7c37d26c6ad1a837bbae46bc27f9066a466fb3a66e770523b4666d19";

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address;

// export const TEST_ADDRESS_NEVER_USE_SHORTENED = `${TEST_ADDRESS_NEVER_USE.substr(
//   0,
//   6
// )}...${TEST_ADDRESS_NEVER_USE.substr(-4, 4)}`;

class CustomizedBridge extends Eip1193Bridge {
  chainId = 3;

  async sendAsync(...args) {
    console.debug("sendAsync called", ...args);
    return this.send(...args);
  }
  async send(...args) {
    console.debug("send called", ...args);
    const isCallbackForm =
      typeof args[0] === "object" && typeof args[1] === "function";
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    if (method === "eth_requestAccounts" || method === "eth_accounts") {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] });
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE]);
      }
    }
    if (method === "eth_chainId") {
      if (isCallbackForm) {
        callback(null, { result: "0x3" });
      } else {
        return Promise.resolve("0x3");
      }
    }
    try {
      delete params[0].from;
      const result = await super.send(method, params);
      console.debug("result received", method, params, result);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  }
}

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
// eslint-disable-next-line no-undef
Cypress.Commands.overwrite("visit", (original, url, options) => {
  return original(url, {
    ...options,
    onBeforeLoad(win) {
      options && options.onBeforeLoad && options.onBeforeLoad(win);
      win.localStorage.clear();
      const provider = new JsonRpcProvider(
        `https://ropsten.infura.io/v3/4f846e79e13f44d1b51bbd7ed9edefb8`,
        3
      );
      const signer = new Wallet(TEST_PRIVATE_KEY, provider);
      win.ethereum = new CustomizedBridge(signer, provider);
      console.log(win.ethereum);
    },
  });
});
