import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then("I can see {string} is displayed", (trancheNanme) => {
  cy.contains(trancheNanme).should("be.visible");
});

Then("{string} contains unlocked tokens", (tranche) => {
  console.log(tranche);
});

When("I click on the button with {string}", (tranche) => {
  cy.get(".tranche-item__label").contains(tranche).click();
});

Then("I can see the tranche {string} page", (trancheNo) => {
  cy.url().should("include", `tranches/${trancheNo}`);
});

Then("I can see the tranches userlist", (tranche) => {
  cy.get(".tranche__user-list").should("be.visible").and("not.empty");
});
