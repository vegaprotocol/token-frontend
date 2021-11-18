Feature: Staking page 
  @e2e-test

  Scenario: Go to staking page
    Given I navigate to '/staking' page
    And I connect to wallet vega
    Then I can see the validator node list
  
    Scenario: Click through to a staking node
    Given I navigate to '/staking' page
    And I connect to wallet vega
    Then I can see the validator node list
    And I click on a validator from the list
    Then the validator node page is displayed