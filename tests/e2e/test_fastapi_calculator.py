# tests/e2e/test_fastapi_calculator.py

from uuid import uuid4
import pytest


BASE_URL = "http://localhost:8000"


def register_and_login(page):
    unique = uuid4().hex[:8]
    username = f"e2euser_{unique}"
    email = f"e2euser_{unique}@example.com"
    password = "GoodPass123!"

    page.goto(f"{BASE_URL}/register")

    page.fill("#registerUsername", username)
    page.fill("#registerEmail", email)
    page.fill("#registerFirstName", "E2E")
    page.fill("#registerLastName", "User")
    page.fill("#registerPassword", password)
    page.fill("#registerConfirmPassword", password)
    page.click('button:has-text("Create Account")')

    page.wait_for_url(f"{BASE_URL}/login", timeout=5000)

    page.fill("#loginUsername", username)
    page.fill("#loginPassword", password)
    page.click('button:has-text("Sign In")')

    page.wait_for_url(f"{BASE_URL}/dashboard", timeout=5000)


@pytest.mark.e2e
def test_calculation_bread_flow(page, fastapi_server):
    register_and_login(page)

    page.fill("#calcA", "10")
    page.fill("#calcB", "5")
    page.click('button[data-value="addition"]')
    page.click('button:has-text("Calculate")')

    page.locator("#dashboardSuccess").wait_for(state="visible")
    assert "Result: 15" in page.inner_text("#dashboardSuccess")

    page.click('a:has-text("View")')
    page.wait_for_url("**/dashboard/view/**")
    assert "Calculation Details" in page.inner_text("body")
    assert "15" in page.inner_text("body")

    page.click('a:has-text("Edit")')
    page.wait_for_url("**/dashboard/edit/**")
    page.fill("#a", "20")
    page.fill("#b", "4")
    page.select_option("#type", "division")
    page.click('button:has-text("Save Changes")')

    # Verify the updated values are displayed on the view page
    assert page.input_value("#a") == "20"
    assert page.input_value("#b") == "4"

    
    page.goto(page.url.replace("/dashboard/edit/", "/dashboard/view/"))
    page.on("dialog", lambda dialog: dialog.accept())
    page.click('button:has-text("Delete")')
    page.wait_for_url(f"{BASE_URL}/dashboard", timeout=5000)


@pytest.mark.e2e
def test_invalid_calculation_input(page, fastapi_server):
    register_and_login(page)

    page.fill("#calcA", "10")
    page.fill("#calcB", "0")
    page.click('button[data-value="division"]')
    page.click('button:has-text("Calculate")')

    page.locator("#dashboardError").wait_for(state="visible")
    assert "Failed" in page.inner_text("#dashboardError")


@pytest.mark.e2e
def test_unauthorized_dashboard_redirect(page, fastapi_server):
    page.goto(f"{BASE_URL}/dashboard")
    page.wait_for_url(f"{BASE_URL}/login", timeout=5000)
    assert "Sign in" in page.inner_text("body")