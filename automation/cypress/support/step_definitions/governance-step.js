import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then("I am taken to the governance page", () => {
  cy.url().should("equal", Cypress.config().baseUrl + "governance");
});

Then(
  "I could see governance proposals list for a {string} proposal",
  (expectedProposalState) => {
    // let expectedStateFound = false;
    cy.get("table.proposal-table").each(($table) => {
      cy.wrap($table).within(() => {
        cy.get("td")
          .eq(0)
          .then(($expectedState) => {
            if ($expectedState.text().includes(expectedProposalState)) {
              // expectedStateFound = true;
              cy.log(`Found ${expectedProposalState} proposal`);
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
        // expect(expectedStateFound).to.be.true;
      });
    });
  }
);
