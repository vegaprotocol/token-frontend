import { mock } from "../common/mock";

describe("Restricted", () => {
  it("Renders service unavailable if not allowed in this country", () => {
    // Given a link with no information
    mock(cy);
    cy.setCookie("restricted", "true");
    // When visiting claim page
    cy.visit("/claim");
    cy.contains("Service unavailable").should("exist");
    cy.contains("This service is not available in your country").should(
      "exist"
    );
  });
});
