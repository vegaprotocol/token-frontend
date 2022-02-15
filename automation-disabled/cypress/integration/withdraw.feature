Feature: Withdraw page
  @e2e-test

  Scenario: Go to withdraw page
    Given I navigate to '/withdraw' page

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