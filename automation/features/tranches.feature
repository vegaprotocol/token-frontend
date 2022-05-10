Feature: Tranches page

@todo
  Scenario: Go to Tranches page
    Given I connect my ethereum wallet
    And I navigate to "tranches" page
    Then I am taken to the "tranches" page
    Then I can see the header title is "Vesting tranches"
    And I can see tranches are displayed
    And First tranche contains unlocked tokens

  @todo
  Scenario: Click through to a tranche
    Given I navigate to "tranches" page
    Then I am taken to the "tranches" page
    Then I can see the header title is "Vesting tranches"
    When I click on the first tranche
    Then I can see the tranche "1" page
    And I can see the tranches userlist





