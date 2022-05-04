Feature: Staking and Association tests

  Background:
    Given I navigate to "staking" page

  Scenario: Go to staking and connect ethereum wallet
    Given I connect my ethereum wallet
    Then I can see my ethereum key 0x9804C6E98dA75e3271ccE3aA56728FD8e9376155 is shown

  Scenario: Associate tokens through wallet
    When I connect to the vega wallet
    And I associate "0.10" tokens from "wallet"
    Then I can see the pending transactions button is shown
    When I click the pending transactions button
    Then I can see the pending transactions modal is shown
    And the pending transactions modal can be closed
    # COMMENTED OUT FOLLOWING STEPS - CONFIRMATION TIME TOO LONG
    # And the association of tokens has been successful

  Scenario: Associate tokens through vesting contract
    And I associate "0.10" tokens from "vesting contract"
    Then I can see the pending transactions button is shown
    # COMMENTED OUT FOLLOWING STEPS - CONFIRMATION TIME TOO LONG
    # And the association of tokens has been successful

  Scenario: Use maximum button on associate from wallet enters correct amount
    When I click on use maximum button
    Then I can see the maximum amount of tokens in my wallet are in the token input box

  Scenario: Disassociate tokens through wallet
    And I disassociate "0.10" tokens from "wallet"
    Then I can see the pending transactions button is shown
    When I click the pending transactions button
    Then I can see the pending transactions modal is shown
    # COMMENTED OUT FOLLOWING STEPS - CONFIRMATION TIME TOO LONG
    # And the disassociation of tokens has been successful

  Scenario: Cannot disassociate more tokens through wallet than available
    When I click the button to disassociate
    When I click on the "wallet" radio button
    And I enter "2000000" tokens in the input field
    Then the token submit button is disabled

  Scenario: Cannot disassociate more tokens through vesting contract than available
    And I click the button to disassociate
    When I click on the "vesting contract" radio button
    And I enter "2000000" tokens in the input field
    Then the token submit button is disabled

  Scenario: Disassociate tokens through vesting contract
    And I disassociate "0.10" tokens from "vesting contract"
    Then I can see the pending transactions button is shown
    # COMMENTED OUT FOLLOWING STEPS - CONFIRMATION TIME TOO LONG
    # And the disassociation of tokens has been successful

@manual
  Scenario: Staking validator list and epoch timer countdown
    Then I can see the validator node list
    And the epoch countdown timer is counting down

  Scenario: add stake from wallet
    When I click on a validator
    Then I am taken to the correct validator page
    And I select to "Add" stake
    And I enter "10" tokens in the input field
    Then I can submit successfully
    And the pending transaction is displayed
    # COMMENTED OUT FOLLOWING STEPS - CONFIRMATION TIME TOO LONG
    # And the stake is successful
    # When I click on the back to staking button
    # Then I am back on the staking main page

  Scenario: Cannot stake more than what is associated
    When I click on a validator
    And I select to "Add" stake
    And I enter "2000000" tokens in the input field
    Then the token submit button is disabled

@manual
  Scenario: Remove stake now
    When I click on a validator
    Then I am taken to the correct validator page
    And I select to "Remove" stake
    And I click on the option to remove stake now
    And I can see the remove now disclaimer with text "Removing stake mid epoch will forsake any staking rewards from that epoch"
    And I can see the button to switch to remove at the end of epoch is showing
    And I enter "1" tokens in the input field
    And the submit button text is "Remove 1 $VEGA tokens now"
    Then I can submit successfully
    And I can see the stake is removed immediately

@manual
  Scenario: Remove stake at next epoch
    When I click on a validator
    Then I am taken to the correct validator page
    And I select to "Remove" stake
    And I enter "1" tokens in the input field
    Then I can submit successfully
    And I can see "1" vega has been removed from staking
