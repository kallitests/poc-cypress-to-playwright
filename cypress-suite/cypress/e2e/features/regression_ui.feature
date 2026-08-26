Feature: Regression UI coverage

  Scenario: User cannot log in with invalid credentials
    Given I open the login page
    When I log in with invalid credentials
    Then I see a login error

  Scenario: Search returns relevant products for a valid keyword
    Given I open the products page
    When I search for "dress"
    Then search results contain "dress"

  Scenario: Search returns an empty state for a nonsense keyword
    Given I open the products page
    When I search for "zzzz-no-such-product"
    Then no matching products are shown

  Scenario: Cart quantity updates correctly when increasing/decreasing items
    Given I add a product to the cart
    When I increase and decrease its quantity
    Then the cart quantity is updated

  Scenario: Checkout blocks submission when required fields are empty
    Given I open the cart
    When I continue checkout without required fields
    Then checkout requires account details
