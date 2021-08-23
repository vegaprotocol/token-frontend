Feature: Homepage
  @e2e-test

  Scenario: Go to home page
    Given I am on the home page
    Then I can see the header title is 'Vega Tokens'
