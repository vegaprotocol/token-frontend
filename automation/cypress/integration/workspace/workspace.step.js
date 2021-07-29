import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';
import Workspace from '../../pages/workspace.page';
let WorkspacesPage = new Workspace();


Given('I am on the workspace page', () => {
  WorkspacesPage.visit();
  WorkspacesPage.workspaceTabItem().should('be.visible').and('not.be.empty').and('have.length', '1')
  });

When('I click to add a new workspace',()=>{
  WorkspacesPage.createWorkspaceBtn().click()
});

When('I can see the workspace modal is visible',()=>{
  WorkspacesPage.createWorkspaceModal().should('be.visible')
});

Then('I add a workspace by name with name {string}',(workspaceName)=>{
  cy.get('input[id="title"]').clear().type(workspaceName)
  cy.get('button[type="submit"]').last().contains('Add').click()
  cy.wait(2000)
})

When('I click to remove workspace {string}',()=>{
  cy.wait(2000)
  cy.get('svg[data-icon="chevron-down"]').eq(0).click()
  cy.get('.bp3-menu-item').contains('Delete').click()
})

Then('Workspace {string} should no longer exist',(workspaceName)=>{
  cy.get('[data-testid="workspace-item"]')
  .contains(workspaceName)
  .should('not.exist')
})

