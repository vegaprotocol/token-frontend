import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the tranches page',()=>{
  cy.visit('/');
  cy.url().should('include','tranches')
})

Then('I can see the header title is {string}',(headerTitle)=>{
  cy.get('.heading__title').should('have.text',headerTitle)
})

