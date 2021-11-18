Feature: Tranches
  @e2e-test

  Scenario: Go to Tranches page
    Given I am on the tranches page
    Then I can see the url contains "tranches"
    Then I can see the header title is 'Vesting tranches'
    And I can see "Tranche 1" is displayed 
    And "Tranche 1" contains unlocked tokens

  Scenario: Click through to a tranche
    Given I am on the tranches page
    Then I can see the url contains "tranches"
    Then I can see the header title is 'Vesting tranches'
    When I click on the button with 'Tranche 1'
    Then I can see the tranche "1" page
    And I can see the tranches userlist





