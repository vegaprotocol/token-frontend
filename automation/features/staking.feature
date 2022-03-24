Feature: Staking and Association tests 

Background:
    Given I navigate to "staking" page

  Scenario: Go to staking and connect ethereum wallet
    Given I connect my ethereum wallet
    Then I can see my ethereum key 0x9804C6E98dA75e3271ccE3aA56728FD8e9376155 is shown

  Scenario: Associate tokens through wallet
    When I connect to the vega wallet
    And I associate some tokens from wallet
    Then I can see the pending transactions button is shown

  Scenario: Associate tokens through vesting contract
    And I associate some tokens from vesting contract
    Then I can see the pending transactions button is shown 

  Scenario: Use maximum button on associate from wallet enters correct amount
    When I click on use maximum button
    Then I can see the maximum amount of tokens in my wallet are in the token input box

  Scenario: Disassociate tokens through wallet
    And I disassociate some tokens from wallet
    Then I can see the pending transactions button is shown

  Scenario: Disassociate tokens through vesting contract
    And I disassociate some tokens from vesting contract
    Then I can see the pending transactions button is shown

  Scenario: Staking validator list and nodes is displayed
    Then I can see the validator node list
    And the epoch countdown timer is counting down

  Scenario: add stake from vesting contract
    When I click on a validator
    Then I am taken to the correct validator page

  @todo
  Scenario: add stake from wallet 
    When I click on a validator
    Then I am taken to the correct validator page

  @todo
  Scenario: add stake from vesting contract
    When I click on a validator
    Then I am taken to the correct validator page

  @todo
Scenario: remove stake now 
    When I click on a validator
    Then I am taken to the correct validator page

  @todo
  Scenario: remove stake at next epoch 
    When I click on a validator
    Then I am taken to the correct validator page

  @todo
   Scenario: Remove stake at next epoch
    Given I navigate to '/staking' page
    And I connect to the vega wallet
    And I click on a validator from the list
    When I click on the remove radio button
    Then the token amount field is shown
    When I attempt to remove "10000000000" vega from stake
    Then the remove button is disabled
    When I click the use maximum button on the field
    Then I can see the number in the field is '100'
    And the remove button is now enabled again with message "Remove 100 $VEGA tokens at the end of epoch"
    When I click to confirm removal of tokens from stake
    Then I can see the remove message is displayed "node-1-name"
    And next epoch credit message is displayed with message "Waiting for confirmation that your change in nomination has been received"

# # ignoring this as it seems the same flow as remove stake at next epoch with the mocks
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
