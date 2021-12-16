Feature: Staking page 
  @e2e-test

  Scenario: Go to staking page
    Given I navigate to '/staking' page
    And I connect to wallet vega
    Then I can see the validator node list
  
    Scenario: Click through to a staking node page
    Given I navigate to '/staking' page
    And I connect to wallet vega
    Then I can see the validator node list
    And I click on a validator from the list
    Then the validator node page is displayed
    And the validator information table is displayed
    And the epoch counter is displayed
    And your stake information is displayed

   Scenario: Remove stake at next epoch
    Given I navigate to '/staking' page
    # And I connect to wallet vega
    And I click on a validator from the list
    When I click on the remove radio button
    Then the token amount field is shown
    When I enter "10000000000" into the token input field
    Then the submit button is disabled
    When I click the use maximum button on the field
    Then I can see the number in the field is '100'
    And the remove button is now enabled again with message "Remove 100 $VEGA tokens at the end of epoch"
    When I click to confirm removal of tokens from stake
    Then I can see the remove message is displayed
    And next epoch credit message is displayed with message "This will take a few seconds to confirm, and then will be credited at the beginning of the next epoch"

  #  Scenario: Add stake at next epoch
  #   Given I navigate to '/staking' page
  #   # And I connect to wallet vega
  #   And I click on a validator from the list
  #   When I click on the add radio button
  #   Then the token amount field is shown
  #   When I enter "10000000000" into the token input field
  #   Then the submit button is disabled
  #   When I click the use maximum button on the field
  #   Then I can see the number in the field is '100'
  #   And the remove button is now enabled again with message "Remove 100 $VEGA tokens at the end of epoch"
  #   When I click to confirm removal of tokens from stake
  #   Then I can see the remove message is displayed
  #   And next epoch credit message is displayed with message "This will take a few seconds to confirm, and then will be credited at the beginning of the next epoch"

# ignoring this as it seems the same flow as remove stake at next epoch with the mocks
# @ignore
#    Scenario: Remove stake now
#     Given I navigate to '/staking' page
#     And I connect to wallet vega
#     And I click on a validator from the list
#     When I click on the remove radio button
#     Then the remove field is shown
#     When I attempt to remove more than i have staked 
#     Then the remove button is disabled
#     When I click the use maximum button on the field
#     And I click on the remove now switch
#     Then I can see the number in the field is '100'
#     And the remove button is now enabled again with message "Remove 100 $VEGA tokens at the end of epoch"
#     When I click to confirm removal of tokens from stake
#     Then I can see the remove message is displayed
