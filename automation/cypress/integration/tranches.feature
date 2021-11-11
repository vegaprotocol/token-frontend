Feature: Tranches
  @e2e-test

  Scenario: Go to Tranches page
    Given I am on the tranches page
    Then I can see the url contains "tranches"
    Then I can see the header title is 'Vesting tranches'



