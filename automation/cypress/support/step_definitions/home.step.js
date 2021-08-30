import { Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";

Given("I am on the home page", () => {
  mock(cy);
  cy.visit("/");
});
