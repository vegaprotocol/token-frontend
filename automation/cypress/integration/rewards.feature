Feature: Rewards page
  @e2e-test

  @todo
  Scenario: Can navigate to rewards page
    Given I navigate to '/rewards' page
    Then I can see the rewards epoch timer displayed
    And I can see that the connected vega wallet key

 @todo
  Scenario: Rewards page when there is no rewards
    Given I navigate to '/rewards' page
    And I have not earned any rewards
    Then I can see the placeholder message 'This Vega key has not received any rewards.' is shown
    And the rewards table is not displayed

  @todo
  Scenario: Rewards page when there is rewards earned
    Given I navigate to '/rewards' page
    And I have earned rewards
    And the rewards table is not displayed

@manual
# NOTE: Pre-prod environments should have short epochs (5 mins)
  Scenario: New epoch automatically starts when previous finishes
    Given I navigate to '/rewards' page
    And I can see the epoch timer is displayed
    When The current epoch is finished
    Then the next one starts automatically
    And the page is updated automatically
    

