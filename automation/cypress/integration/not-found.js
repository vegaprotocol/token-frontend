import { mock } from "../common/mock";

describe("Not found", () => {
  it("Renders error heading and error subheading if code is not enough", () => {
    // Given a link with no information
    mock(cy);
    // When visiting a fake page
    cy.visit("/foo-bar-baz");
    cy.url("includes", /not-found/);
    cy.contains(
      "This page can not be found, please check the URL and try again."
    );
  });
});
