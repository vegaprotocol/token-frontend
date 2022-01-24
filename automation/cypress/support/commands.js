import { createBridge, signerlessBridge } from "./eip1193-bridge";

Cypress.Commands.add("ethereumUnconnected", () => {
  cy.on("window:before:load", (win) => {
    win.ethereum = signerlessBridge();
  });
});

Cypress.Commands.add("ethereumConnect", (account) => {
  cy.on("window:before:load", (win) => {
    win.ethereum = createBridge(account);
  });
});

// Cypress.Commands.add("ethereumChangeAccount", () => {
//   cy.window().then((win) => {
//     win.ethereum.emit("accountsChanged", [
//       "0x50EcdF8977a98CeF52AAC035326740d25A47a342",
//     ]);
//   });
// });

Cypress.Commands.add("ethereumDisconnect", () => {
  cy.window().then((win) => {
    win.ethereum.emit("accountsChanged", []);
    win.ethereum.emit("disconnect");
  });
});
