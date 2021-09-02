import { mock } from "../common/mock";

describe("Restricted", () => {
  it("Renders service unavailable if not allowed in this country", () => {
    // As a user
    mock(cy);
    // Given I have the blocked cookie
    cy.setCookie("restricted", "true");
    // When visiting claim page
    cy.visit("/claim");
    // Then I see a blocked page
    cy.contains("Service unavailable").should("exist");
    cy.contains("This service is not available in your country").should(
      "exist"
    );
  });
  it("Handles other cookies fine", () => {
    // As a user
    mock(cy);
    // Given I have the more than one cookie
    cy.setCookie("random", "true");
    cy.setCookie("restricted", "true");
    // When visiting claim page
    cy.visit("/claim");
    // Then I see a blocked page
    cy.contains("Service unavailable").should("exist");
    cy.contains("This service is not available in your country").should(
      "exist"
    );
  });
});
