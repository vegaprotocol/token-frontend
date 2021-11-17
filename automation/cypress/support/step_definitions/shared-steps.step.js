import { Then, Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";

Given("I navigate to {string} page", (page) => {
  mock(cy);
  cy.visit(page);
});