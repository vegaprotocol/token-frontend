Feature: Rewards page

  @ignore
  Scenario: Can navigate to rewards page
    Given I connect my ethereum wallet
    And I connect Vega wallet
    And I navigate to "rewards" page
    Then I can see the rewards epoch timer displayed
    And I can see the connected vega wallet key
    And I disconnect Vega Wallet

  @ignore
  Scenario: Rewards page when there is no rewards
    Given I connect Vega wallet
    And I navigate to "rewards" page
    When I have not earned any rewards
    Then no reward message is shown
    And the rewards table is not displayed
    And I disconnect Vega Wallet
  @ignore
  Scenario: Rewards page when there is rewards earned
    Given I connect Vega wallet
    And I navigate to "rewards" page
    And I have earned rewards
    And the rewards table is displayed
    And I disconnect Vega Wallet

  @manual
  # NOTE: Pre-prod environments should have short epochs (5 mins)
  Scenario: New epoch automatically starts when previous finishes
    Given I navigate to '/rewards' page
    And I can see the epoch timer is displayed
    When The current epoch is finished
    Then the next one starts automatically
    And the page is updated automatically