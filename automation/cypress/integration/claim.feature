Feature: Claim codes
  @e2e-test

  Scenario: Error message if claim code not found
    Given I navigate to not found page
    Then I can see the 404 error page
