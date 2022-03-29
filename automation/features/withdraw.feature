Feature: Withdraw page
  
  Background: 
    Given I navigate to "withdraw" page

@test
  Scenario: Associate tokens through wallet
    Given I connect my ethereum wallet
    When I connect to the vega wallet
    Then I can see the wallet address field is showing "0x9804C6E98dA75e3271ccE3aA56728FD8e9376155"
    And The wallet address field is disabled
    When I click the link to enter a new wallet address
    Then the wallet address field is enabled
    When I enter a new wallet address "new-wallet-address-xxccvvbbb"
    Then the wallet address link is changed to "Use connected wallet"
    Then I can see the wallet address in the input field is "new-wallet-address-xxccvvbbb"

@todo
  Scenario: Cannot withdraw if empty balance
    Given I navigate to '/withdraw' page
    And I have not accumulated any rewards to withdraw
    Then the option to withdraw is disabled
    And the user message is displayed


@todo
  Scenario: Cannot withdraw if empty balance
    Given I navigate to '/withdraw' page
    And I have not accumulated any rewards to withdraw
    Then the option to withdraw is disabled
    And the user message is displayed

@todo
  Scenario: Withdraw all to ethereum key
    Given I navigate to '/withdraw' page
    And I have accumulated rewards to withdraw
    Then the option to withdraw is enabled
    And I choose the option to withdraw all tokens
    Then I confirm the option to withdraw tokens 
    And I am on the finalisation screen
    When I confirm the withdraw 
    Then I can see the withdraw request is processing
    
@todo
  Scenario: Withdraw partial to ethereum key
    And I have accumulated rewards to withdraw
    Then the option to withdraw is enabled
    And I choose the option to withdraw some of my tokens
    Then I confirm the option to withdraw tokens 
    And I am on the finalisation screen
    When I confirm the withdraw
    Then I can see the withdraw request is processing