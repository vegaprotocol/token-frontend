import { mock } from "../common/mock";

describe("Not found", () => {
  it("Renders error heading and error subheading if code is not enough", () => {
    // As a user
    mock(cy);
    // When visiting a fake page
    cy.visit("/foo-bar-baz");
    cy.url("includes", /not-found/);
    // THen I see a 404 page
    cy.contains(
      "This page can not be found, please check the URL and try again."
    );
  });
});
