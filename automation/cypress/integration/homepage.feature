Feature: Homepage
  @e2e-test

  Scenario: Homepage displays correct information
    Given I am on the home page
    Then I can see the token address is shown
    And the vesting address is shown
    And the total supply is shown correctly
    And associated token field is showing '0.00'
    And staked token field is showing as '0.00'

  Scenario: Links on the homepage
    Given I am on the home page
    Then the vega wallet link is correct
    And the token address has a link 
    And the vesting address has a link
    And the associate vega tokens link is correct

  Scenario: Check for redeem unlocked tokens from homepage 
    Given I am on the home page
    Then I can see the check for redeemable tokens button
    When I click the check for redeemable tokens button
    Then I am redirected to vesting page

  Scenario: Navigate to staking page via link on homepage body
    Given I am on the home page
     When I click on the associate vega tokens
     Then I am taken to the staking page

  Scenario: Navigate to a not found page will return page error
   Given I navigate to not found page
   Then I can see the url includes "not-found"
   And the error message is displayed "This page can not be found, please check the URL and try again." on page












