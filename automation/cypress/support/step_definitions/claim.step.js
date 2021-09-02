import { Then, Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";

Given("I am on the tranches page", () => {
  mock(cy);
  cy.visit("/tranches");
  cy.url().should("include", "tranches");
});

Given("I navigate to not found page", () => {
  mock(cy)
  cy.visit("/foo-bar-baz");
  cy.url("includes", /not-found/);
})

Then("I can see the 404 error page", () => {
  mock(cy);
  cy.contains(
    "This page can not be found, please check the URL and try again."
  );
})


Then("I can see the header title is {string}", (headerTitle) => {
  cy.get(".heading__title").should("have.text", headerTitle);
});

