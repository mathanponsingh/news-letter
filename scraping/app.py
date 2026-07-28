import os
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType


def scroll_down(driver, scrolls=4, pause_time=1.5, post_scroll_wait=3.0):
    """Scrolls down incrementally to trigger dynamic content loading and waits for content to render."""
    for _ in range(scrolls):
        driver.execute_script("window.scrollBy(0, 1000);")
        time.sleep(pause_time)
    print(f"Waiting {post_scroll_wait}s for scrolled content to settle and load...")
    time.sleep(post_scroll_wait)


def handler(event=None, context=None):
    """Main scraping handler function."""
    display = None
    try:
        from pyvirtualdisplay import Display
        display = Display(backend="xvfb", visible=0, size=(1920, 1080))
        display.start()
    except Exception:
        pass

    options = Options()

    # Dynamic binary location lookup (Container /usr/bin vs Host Snap)
    if os.path.exists("/usr/bin/chromium"):
        options.binary_location = "/usr/bin/chromium"
    elif os.path.exists("/usr/bin/chromium-browser"):
        options.binary_location = "/usr/bin/chromium-browser"
    elif os.path.exists("/snap/bin/chromium"):
        options.binary_location = "/snap/bin/chromium"

    # Linux & Docker Chrome options
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    # Driver service initialization with fallback
    try:
        if os.path.exists("/usr/bin/chromedriver"):
            service = Service("/usr/bin/chromedriver")
        else:
            service = Service(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())
    except Exception:
        service = Service(ChromeDriverManager().install())

    driver = webdriver.Chrome(service=service, options=options)

    # Mask navigator.webdriver via CDP script injection
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    })

    try:
        print("Opening Reuters Technology...")
        driver.get("https://www.reuters.com/technology/")

        # Wait until the main content block loads
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "main[data-testid='SlicesLayout']"))
        )

        # Scroll down to trigger lazy loading for lower grid sections
        print("Scrolling to load lower section story cards...")
        scroll_down(driver, scrolls=4, pause_time=1.5, post_scroll_wait=3.0)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Match top-hero cards, lower single-section block cards, and feed list items
        story_cards = soup.find_all(
            attrs={"data-testid": lambda v: v in ["StoryCard", "common/single-section-blockStoryCard", "FeedListItem"]}
        )

        print(f"\n--- Extracted {len(story_cards)} Story Cards ---\n")

        for index, card in enumerate(story_cards, start=1):
            title_tag = card.find("a", attrs={"data-testid": "TitleLink"}) or card.find("a", href=True)
            if not title_tag or title_tag.get("href", "#") == "#":
                parent = card.parent
                if parent:
                    title_tag = parent.find("a", href=True) or title_tag

            headline = title_tag.text.strip() if title_tag else "N/A"

            link = title_tag.get("href", "") if title_tag else "N/A"
            if link and link.startswith("/"):
                link = f"https://www.reuters.com{link}"

            time_tag = card.find("time", attrs={"data-testid": "DateLineText"}) or card.find("time") or card.find("span", attrs={"data-testid": "Label"})
            if not time_tag and card.parent:
                time_tag = card.parent.find("time") or card.parent.find("span", attrs={"data-testid": "Label"})

            timestamp = time_tag.text.strip() if time_tag else "N/A"

            desc_tag = card.find("p", attrs={"data-testid": "Description"}) or card.find("p")
            description = desc_tag.text.strip() if desc_tag else "None"

            print(f"[{index}] {headline}")
            print(f"    Time: {timestamp}")
            print(f"    Link: {link}")
            if description != "None":
                print(f"    Summary: {description}")
            print("-" * 60)

    finally:
        driver.quit()
        if display:
            display.stop()


if __name__ == "__main__":
    handler()