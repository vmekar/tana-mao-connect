from playwright.sync_api import sync_playwright

def verify_resolution():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Visiting Home...")
        page.goto("http://localhost:8080/")
        page.wait_for_timeout(3000)

        # Locate listing cards specifically.
        # Assuming listing cards have text like "R$" and contain a button with a heart icon (or just a button)

        # Strategy: Find all elements that look like cards and check for the button
        cards = page.locator(".group") # This selector is broad, but we can filter

        valid_cards_found = 0

        count = cards.count()
        print(f"Scanning {count} '.group' elements...")

        for i in range(count):
            card = cards.nth(i)
            # Check if it has a price (strong indicator it's a listing card)
            if "R$" in card.inner_text():
                # Check for button
                if card.locator("button").count() > 0:
                    valid_cards_found += 1
                    print(f"Found valid listing card at index {i} with Favorite button.")

        if valid_cards_found > 0:
            print(f"SUCCESS: Verified {valid_cards_found} listing cards with Favorite buttons.")
        else:
            print("FAILURE: No listing cards with Favorite buttons found.")
            exit(1)

        browser.close()

if __name__ == "__main__":
    verify_resolution()
