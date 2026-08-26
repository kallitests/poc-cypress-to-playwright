Feature: Smoke UI coverage

  Scenario: Homepage loads successfully
    Given I open the homepage
    Then I see the site title

  Scenario: User can log in with valid credentials
    Given I open the login page
    When I log in with valid credentials
    Then I should see the logged in indicator

  Scenario: User can add a product to the cart
    Given I open the products page
    When I add the first product to the cart
    Then the cart contains one item
