
import { Then, Given } from "cypress-cucumber-preprocessor/steps";
import { mock } from "../../common/mock";
let nodeName = ''

Then("I can see the validator node list", () => {
    cy.get(".node-list").should('be.visible')
});

When("I click on a validator from the list", () => {
    cy.get('.node-list__item-name').eq(0).then(($btn) => {
        nodeName = $btn.text()
    }).click()
});

Then("the validator node page is displayed", () => {
    cy.log(`this is the text ${nodeName}`)
    cy.get('[data-test-id="validator-node-title"]').should('have.text',`VALIDATOR: ${nodeName}`)
});

