Feature: Claim codes
  Scenario: Prompt to connect to eth wallet to claim if not connected 
    Given I navigate to "claim?r=odiuhfn" page
    Then I can see the error message when not connected to eth wallet on claims page "Connect to the Ethereum wallet that holds your $VEGA tokens to see what can be redeemed from vesting tranches. To redeem tokens you will need some ETH to pay gas fees."
    And the connect to ethereum button is visible

  Scenario: Invalid claims code will show error
    Given I navigate to "claim?r=odiuhfn" page
    And I connect my ethereum wallet
    And I can see the heading title is "CLAIM $VEGA TOKENS"
    Then I can see the invalid claim code error "Something doesn't look right. Please check the link again or the Vesting page to see if you have already claimed"

@test
  Scenario: Valid claim code with no specified key 
    Given I navigate to "claim?r=o0x0d9b23d1e9f352a5f48abcaace301c249a770c6588864eb6ade8aa472f41ab1b20cff73862997eb3eff90bf255fbbe2833b05fc0e0a71f89c5b287f6493dc49a1c" page

@todo
  Scenario: Valid claim code but incorrect key cannot be claimed
    Given I navigate to "claim?r=odiuhfn" page

@todo 
Scenario: Expired claim code

