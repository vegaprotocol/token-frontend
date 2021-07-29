Feature: go to workspace
  @e2e-test

  Scenario: Add a workspace item
    Given I am on the workspace page
    When I click to add a new workspace
    When I can see the workspace modal is visible
    Then I add a workspace by name with name "workspace one"
    

  Scenario: Remove a workspace item
    When I click to remove workspace "workspace one"
    Then Workspace "workspace one" should no longer exist

