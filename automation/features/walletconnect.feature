Feature: Connect a vega wallet

  Scenario: Go to Vega and connect ethereum wallet
    Given I connect my ethereum wallet
    When I go to 'https://dev.token.vega.xyz/staking'
    Then I can see my ethereum key 0x9804C6E98dA75e3271ccE3aA56728FD8e9376155 is shown

  Scenario: 
    When I nav to 'https://dev.token.vega.xyz/staking'
    When I connect hosted wallet
    And I associate some tokens
  