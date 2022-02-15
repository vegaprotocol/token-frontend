import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then("I can see the validator node list", () => {
  cy.get(".node-list").should("be.visible");
});

When("I click on a validator from the list", () => {
  cy.wait(["@getKeys", "@getToken", "@getVersion"]);
  cy.get('[data-testid="node-list-item"]')
    .first()
    .find("a")
    .click({ force: true });
});

Then("the validator node page is displayed {string}", (name) => {
  cy.get('[data-test-id="validator-node-title"]').should(
    "have.text",
    `VALIDATOR: ${name}`
  );
});

Then("the validator information table is displayed", () => {
  cy.get('[data-testid="validator-table"]')
    .should("exist")
    .and("be.visible")
    .and("not.be.empty");
});

Then("the epoch counter is displayed", () => {
  cy.get('[data-testid="epoch-countdown"]')
    .should("exist")
    .and("be.visible")
    .and("not.be.empty");
});

Then("your stake information is displayed", () => {
  cy.get('[data-testid="your-stake"]')
    .should("exist")
    .and("be.visible")
    .and("not.be.empty");
});

When("I click on the remove radio button", () => {
  cy.get('[data-testid="remove-stake-radio"]').click({ force: true });
});

Then("the token amount field is shown", () => {
  cy.get('[data-testid="token-amount-input"]')
    .should("be.visible")
    .and("be.empty");
});

When("I attempt to remove {string} vega from stake", (amountOfvega) => {
  cy.get('[data-testid="token-amount-input"]').type(amountOfvega);
});

Then("the remove button is disabled", () => {
  cy.get('[data-testid="token-input-submit-button"]')
    .should("be.disabled")
    .and("have.attr", "disabled");
});

When("I click the use maximum button on the field", () => {
  cy.get('[data-testid="token-amount-use-maximum"]').click();
});

Then(
  "I can see the number in the field is {string}",
  (amountOfStakeToRemove) => {
    cy.get('[data-testid="token-amount-input"]').should(
      "have.value",
      amountOfStakeToRemove
    );
  }
);

Then(
  "the remove button is now enabled again with message {string}",
  (submitBtnText) => {
    cy.get('[data-testid="token-input-submit-button"]')
      .should("be.enabled")
      .and("have.text", submitBtnText);
  }
);

When("I click to confirm removal of tokens from stake", () => {
  cy.get('[data-testid="token-input-submit-button"]').click();
});

Then("I can see the remove message is displayed {string}", (name) => {
  cy.get(".callout__title").should(
    "have.text",
    `Removing 100 $VEGA from validator ${name}`
  );
});

Then(
  "next epoch credit message is displayed with message {string}",
  (nextEpochCreditMsg) => {
    cy.get(".callout__title")
      .siblings("p")
      .should("have.text", nextEpochCreditMsg);
  }
);
