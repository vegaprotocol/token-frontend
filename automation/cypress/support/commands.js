import { createBridge, createNotLoggedInBridge } from "./eip1193-bridge";

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
// eslint-disable-next-line no-undef
Cypress.Commands.overwrite("visit", (original, url, options) => {
  return original(url, {
    ...options,
    onBeforeLoad(win) {
      options && options.onBeforeLoad && options.onBeforeLoad(win);
      win.localStorage.clear();
      win.ethereum = createBridge();
    },
  });
});
