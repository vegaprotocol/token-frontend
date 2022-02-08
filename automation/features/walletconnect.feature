Feature: Connect a vega wallet

  Scenario: Go to Vega
    Given I connect my ethereum wallet
    Given I navigate to "staking" page
    Then I can see my ethereum key 0x9804C6E98dA75e3271ccE3aA56728FD8e9376155 is shown

  Scenario: Do a staking thing
    Given I navigate to "staking" page
    When I connect hosted wallet
    And I associate some tokens
  