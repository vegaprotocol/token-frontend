Feature: Governance page 

@ignore 
Scenario: Navigate to governance page via link on homepage body
Given I am on the home page
When I click on the View proposals
Then I am taken to the governance page
And I could see governance proposals list
And the list has following <fields>
 Examples:
       | fields |
       | Change             |
       | to                 |
       | State              |
       | Closes on          |
       | Proposed enactment |

@ignore 
Scenario: Governance proposal list page 
Given I navigate to '/governance' page
When I view the governance proposals list
And I can view <proposalState> proposal states
And sorted by furthest Proposed enactment date

 Examples:
       | proposalState |
       | Passed        |
       | Declined      |
       | Enacted       |
       | Open          |
       | Rejected      |

@ignore 
Scenario: View governance proposal page
Given I navigate to '/governance' page
When I click on a UpdateNetworkParameter proposal from the list
Then I am taken to UpdateNetworkParameter proposal page
And the proposal details are displayed
And votes section is displayed
And Your vote section is displayed

@ignore 
Scenario: Voting on governance proposal page
Given I navigate to '/governance' page
When I click on a Open UpdateNetworkParameter proposal from the list 
# for the first time
Then I am taken to UpdateNetworkParameter proposal page
And click on Vote for button
Then Your vote section is updated with You voted For
When I click on Change Vote
And click on Vote against button
Then Your vote section is updated with You voted Against

@ignore 
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

