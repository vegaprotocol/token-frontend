import { Then, Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";

Given("I am on the tranches page", () => {
  mock(cy);
  cy.visit("/tranches");
  cy.url().should("include", "tranches");
});

Then("I can see the url contains {string}", (url) => {
  cy.url().should("include", `${url}`);
});

Then("I can see the header title is {string}", (headerTitle) => {
  cy.get(".heading__title").should("have.text", headerTitle);
});
