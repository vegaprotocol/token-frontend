Feature: Governance page

  Scenario Outline: Navigate to governance page via link on homepage body for governance proposals
    Given I am on the home page
    When I click on the governance proposals button
    Then I am taken to the governance page
    And I could see governance proposals list for a '<proposalState>' proposal
    Examples:
      | proposalState |
      | Open          |
      | Passed        |
      | Declined      |
      | Rejected      |

  Scenario: Governance proposals are sorted by Proposed enactment date
    Given I navigate to '/governance' page
    When I view the governance proposals list
    Then Proposals sorted by furthest Proposed enactment date

  @manual
  Scenario: Voting on governance proposal page
    Given I navigate to '/governance' page
    When I click on a Open UpdateNetworkParameter proposal from the list
    # for the first time
    Then I am taken to UpdateNetworkParameter proposal page
    And the proposal details are displayed
    And votes section is displayed
    And Your vote section is displayed
    When I click on Vote for button
    Then Your vote section is updated with You voted For
    When I click on Change Vote
    And click on Vote against button
    Then Your vote section is updated with You voted Against

  @manual
  Scenario: Voting on governance proposal page after changing Vega wallet keys
    Given I navigate to '/governance' page
    When I click on a Open UpdateNetworkParameter proposal from the list
    Then I am taken to UpdateNetworkParameter proposal page
    When I click on change key link on Vega wallet
    And change my key
    And click on Vote for button
    Then Your vote section is updated with You voted For
    When I click on Change Vote
    And click on Vote against button
    Then Your vote section is updated with You voted Against


  # for <minimum vega token required scenario
  @manual
  Scenario: Voting on governance proposal page after changing Vega wallet keys
    Given I navigate to '/governance' page
    When I click on a Open UpdateNetworkParameter proposal from the list
    Then I am taken to UpdateNetworkParameter proposal page
    When I click on change key link on Vega wallet
    And change my key
    And click on Vote for button
    Then Your vote section is updated with You voted For
    When I click on Change Vote
    And click on Vote against button
    Then Your vote section is updated with You voted Against

  @manual
  Scenario: Voting buttons not present on governance proposal page when I have 0 Vega token associated
    Given I navigate to '/governance' page
    When I click on a Open UpdateNetworkParameter proposal from the list
    Then I am taken to UpdateNetworkParameter proposal page
    And the proposal details are displayed
    And votes section is displayed
    And Your vote section is displayed without voting buttons

  @manual
  Scenario: Voting buttons not present on governance proposal page when I have < minimum Vega token associated needed for voting
    # spam.protection.voting.min.tokens could be found from gensis file
    Given I navigate to '/governance' page
    When I click on a Open UpdateNetworkParameter proposal from the list
    Then I am taken to UpdateNetworkParameter proposal page
    And the proposal details are displayed
    And votes section is displayed
    And Your vote section is displayed without voting buttons
