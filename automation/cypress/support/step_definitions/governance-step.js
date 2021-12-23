import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then("I am taken to the governance page", () => {
  cy.url().should("equal", Cypress.config().baseUrl + "governance");
});

Then(
  "I could see governance proposals list wth the following fields for an open proposal",
  () => {
    verifyProposalFields();
    verifyProposalFieldValues();
  }
);

function verifyProposalFields() {
  cy.get("table.proposal-table").each(($table) => {
    cy.wrap($table).within(() => {
      cy.get("th").should("have.length", 3);
      cy.get("th").eq(0).should("have.text", "State");
      cy.get("th").eq(1).should("have.text", "Closes on");
      cy.get("th").eq(2).should("have.text", "Proposed enactment");
    });
  });
}

function verifyProposalFieldValues() {
  cy.get("table.proposal-table").each(($table) => {
    cy.wrap($table).within(() => {
      cy.get("td").should("have.length", 3);
      cy.get("td").eq(0).should("have.text");
      cy.get("td").eq(1).should("have.text");
      cy.get("td").eq(2).should("have.text");
    });
  });
}
