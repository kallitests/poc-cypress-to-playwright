Feature: Regression API coverage

  Scenario: Products list API response includes required fields (id, name, price, brand)
    When I request the products list API
    Then every product includes id name price and brand

  Scenario: Search product API returns matching results for a keyword
    When I search the product API for "dress"
    Then the product API returns matching results

  Scenario: Invalid login API returns an appropriate error response
    When I verify login with invalid credentials
    Then the login API rejects the credentials

  Scenario: Brands list API returns a non-empty list of brands
    When I request the brands list API
    Then the brands API response is non-empty
