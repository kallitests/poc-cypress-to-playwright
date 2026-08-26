Feature: Smoke API coverage

  Scenario: Products list API returns 200 and a non-empty list
    When I request the products list API
    Then the API response is successful and non-empty

  Scenario: Login API returns a valid response for correct credentials
    When I verify login with valid credentials
    Then the login API response is valid
