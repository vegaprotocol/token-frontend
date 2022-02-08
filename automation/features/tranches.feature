Feature: Tranches page

  Background:
    Given I navigate to "tranches" page
    Then I am taken to the "tranches" page

  Scenario: Go to Tranches page
    # Then I can see the header title is "Vesting tranches"
    And I can see tranches are displayed
    And First tranche contains unlocked tokens

  Scenario: Click through to a tranche
    # Then I can see the header title is "Vesting tranches"
    When I click on the first tranche
    Then I can see the tranche "1" page
    And I can see the tranches userlist





