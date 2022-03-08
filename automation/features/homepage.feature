Feature: Homepage

  Background:
    Given I am on the home page

  Scenario: Homepage displays correct information
    And I connect my ethereum wallet
    Then I can see the token address is shown
    And the vesting address is shown
    And the total supply is shown correctly
    # And associated token field is showing '0.00'
    # And staked token field is showing as "12.22"

  Scenario: Links on the homepage
    Then the vega wallet link is correct
    And the token address has a link
    And the vesting address has a link
    And the associate vega tokens link is correct

  Scenario: Check for redeem unlocked tokens from homepage
    Then I can see the check for redeemable tokens button
    When I click the check for redeemable tokens button
    Then I am taken to the "vesting" page

  Scenario: Navigate to staking page via link on homepage body
    When I click on the associate vega tokens
    Then I am taken to the "staking" page

  Scenario: Navigate to governance proposals page via button link on homepage body
    When I click on the governance proposals button
    Then I am taken to the "governance" page
  # And I can see proposals   //proposals not showing /mock

  Scenario: Navigate to a not found page will return page error
    Given I navigate to not found page
    Then I can see the url includes "not-found"
    And the error message is displayed "This page can not be found, please check the URL and try again." on page

  Scenario Outline: Can navigate to <navItem> page using main nav tab
    When I click on "<navItem>" on main nav
    And I can see "<navItem>" button is clearly highlighted after click
    Then I am taken to the "<page>" page

    Examples:
      | navItem    | page       |
      | Vesting    | vesting    |
      | Staking    | staking    |
      | Governance | governance |
      # | DEX Liquidity | dex liquidity|
      | Home       | home       |
      | Rewards    | rewards    |
      | Withdraw   | withdraw   |

@ignore
  Scenario: Eth wallet not connected placeholder
    And I have not connected my eth wallet
    Then I can see the eth wallet disconnected with message "Connect Ethereum wallet to associate $VEGA"

  Scenario: Vega wallet not connected placeholder
    And I have not connected my vega wallet
    Then I can see the vega wallet disconnected with message "Connect Vega wallet to use associated $VEGA"
