import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then("I am taken to the governance page", () => {
  cy.url().should("equal", Cypress.config().baseUrl + "governance");
});

Then(
  "I could see governance proposals list for a {string} proposal",
  (expectedProposalState) => {
    cy.get("[data-test-id='governance-proposal-state']").should(
      "include.text",
      expectedProposalState
    ); // Check proposal state is displayed
    cy.get("[data-test-id='governance-proposal-table']").each(($table) => {
      cy.wrap($table).within(() => {
        cy.get("td")
          .eq(0)
          .then(($expectedState) => {
            if ($expectedState.text().includes(expectedProposalState)) {
              // If table containing proposal state found, check fields are all displayed
              cy.get("th").should("have.length", 3);
              cy.get("td").should("have.length", 3);
              cy.get("th").eq(0).should("have.text", "State");
              cy.get("td")
                .eq(0)
                .then(($displayedState) => {
                  if (
                    $displayedState.text().includes("Open") ||
                    $displayedState.text().includes("WaitingForNodeVote")
                  ) {
                    cy.get("th").eq(1).should("have.text", "Closes on");
                    cy.get("th")
                      .eq(2)
                      .should("have.text", "Proposed enactment");
                  } else {
                    cy.get("th").eq(1).should("have.text", "Closed on");
                    cy.get("th").eq(2).should("have.text", "Enacted on");
                  }
                });
              cy.get("td").eq(0).should("not.be.empty");
              cy.get("td").eq(1).should("not.be.empty");
              cy.get("td").eq(2).should("not.be.empty");
            }
          });
      });
    });
  }
);
