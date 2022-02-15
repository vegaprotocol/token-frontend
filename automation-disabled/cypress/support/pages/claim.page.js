class WorkspacesPage {

  // Selectors
workspaceTabItem() {
  return cy.get('[data-testid="workspace-item"]')
}

createWorkspaceBtn() {
  return cy.get('[data-testid="create-workspace"]')
}

createWorkspaceModal() {
  return cy.get('.workspace-create-modal')
}

// Functions
  visit() {
    cy.visit('/');
    cy.url().should('include','trading')
  }
}

export default WorkspacesPage;
