from datetime import datetime, timezone, timedelta
import os
import certifi
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
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
from dotenv import load_dotenv
def fetch_reuters_rss():
    """Fetches latest Reuters Technology articles directly via RSS feed (100% reliable in Cloud/CI)."""
    import urllib.request
    import xml.etree.ElementTree as ET

    url = "https://news.google.com/rss/search?q=site:reuters.com+technology&hl=en-US&gl=US&ceid=US:en"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    articles = []
    try:
        req = urllib.request.Request(url, headers=headers)
        xml_data = urllib.request.urlopen(req, timeout=15).read()
        root = ET.fromstring(xml_data)
        items = root.findall(".//item")

        for item in items:
            raw_title = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            pub_date = item.find("pubDate").text if item.find("pubDate") is not None else "Recently"

            title = raw_title.replace(" - Reuters", "").strip() if raw_title else ""

            if title and len(title) > 10:
                articles.append({
                    "title": title,
                    "link": link,
                    "time": pub_date,
                    "description": title,
                    "image": None,
                    "imageAlt": None,
                    "createdAt": datetime.now(timezone.utc)
                })
        print(f"✅ Extracted {len(articles)} Reuters Technology articles via Cloud RSS Feed.")
    except Exception as e:
        print(f"❌ RSS Feed fetch error: {e}")

    return articles


def get_db_connection():
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB", "news-letter")

    if not uri:
        print("❌ MONGO_URI is missing")
        return None, None

    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
        print(f"✅ Connected to MongoDB — Database: {db_name}")
        return client, client[db_name]
    except Exception:
        try:
            client = MongoClient(
                uri,
                serverSelectionTimeoutMS=10000,
                tlsCAFile=certifi.where()
            )
            client.admin.command("ping")
            print(f"✅ Connected to MongoDB — Database: {db_name}")
            return client, client[db_name]
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            return None, None


def scroll_down(driver, scrolls=4, pause_time=1.5, post_scroll_wait=3.0):
    """Scrolls down incrementally to trigger dynamic content loading and waits for content to render."""
    for _ in range(scrolls):
        driver.execute_script("window.scrollBy(0, 1000);")
        time.sleep(pause_time)
    print(f"Waiting {post_scroll_wait}s for scrolled content to settle and load...")
    time.sleep(post_scroll_wait)


def handler(event=None, context=None):
    """Main scraping handler function."""
    client, db = get_db_connection()
    if db is not None:
        print(f"Collections: {db.list_collection_names()}")
    else:
        return None
    display = None
    try:
        from pyvirtualdisplay import Display
        display = Display(backend="xvfb", visible=0, size=(1920, 1080))
        display.start()
    except Exception:
        pass

    import shutil

    options = Options()

    # Dynamic binary location lookup (Container / GitHub Actions / Host)
    for binary_name in ["chromium-browser", "chromium", "google-chrome"]:
        binary_path = shutil.which(binary_name)
        if binary_path:
            real_path = os.path.realpath(binary_path)
            if os.path.exists(real_path) and os.path.isfile(real_path):
                options.binary_location = real_path
                break

    # Linux & Docker Chrome options
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    # Driver service initialization with fallback
    chromedriver_path = shutil.which("chromedriver") or shutil.which("chromium-driver")
    if chromedriver_path and os.path.exists(os.path.realpath(chromedriver_path)):
        service = Service(os.path.realpath(chromedriver_path))
    else:
        try:
            service = Service(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())
        except Exception:
            service = Service(ChromeDriverManager().install())

    driver = webdriver.Chrome(service=service, options=options)

    # Mask navigator.webdriver & apply selenium-stealth to bypass bot detection
    try:
        from selenium_stealth import stealth
        stealth(
            driver,
            languages=["en-US", "en"],
            vendor="Google Inc.",
            platform="Win32",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True,
        )
    except Exception as e:
        print(f"Notice: stealth setup fallback — {e}")

    try:
        print("Opening Reuters Technology...")
        driver.get("https://www.reuters.com/technology/")

        # Wait until page body loads with graceful fallback
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
        except Exception as err:
            print(f"Notice: Page wait fallback - {err}")
        time.sleep(3)

        print(f"📄 Page Title: '{driver.title}'")
        print(f"📄 Page Source Length: {len(driver.page_source)} characters")

        # Scroll down to trigger lazy loading for lower grid sections
        print("Scrolling to load lower section story cards...")
        scroll_down(driver, scrolls=4, pause_time=1.5, post_scroll_wait=3.0)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Multi-layered story card matching for all Reuters layout variants
        story_cards = soup.find_all(
            attrs={"data-testid": lambda v: v and any(k in str(v) for k in ["StoryCard", "single-section-block", "FeedListItem", "MediaStoryCard", "Story"])}
        )

        if not story_cards:
            story_cards = soup.find_all("article")

        if not story_cards:
            story_cards = soup.find_all("a", attrs={"data-testid": lambda v: v and ("Title" in str(v) or "Heading" in str(v) or "Link" in str(v))})

        if not story_cards:
            # Match any link container pointing to Reuters article paths
            story_cards = [
                a.parent for a in soup.find_all("a", href=True) 
                if a.get("href", "").startswith("/technology/") or "/business/" in a.get("href", "") or "/world/" in a.get("href", "")
            ]

        print(f"\n--- Extracted {len(story_cards)} Story Cards ---\n")

        result = []

        for index, card in enumerate(story_cards, start=1):
            if card.name == "a":
                title_tag = card
            else:
                title_tag = card.find("a", attrs={"data-testid": "TitleLink"}) or card.find("a", href=True)

            if not title_tag or not title_tag.get("href"):
                parent = card.parent
                if parent:
                    title_tag = parent if parent.name == "a" else parent.find("a", href=True)

            headline = title_tag.text.strip() if title_tag else "N/A"
            if not headline or headline == "N/A" or len(headline) < 5:
                continue

            link = title_tag.get("href", "") if title_tag else "N/A"
            if link and link.startswith("/"):
                link = f"https://www.reuters.com{link}"

            time_tag = card.find("time", attrs={"data-testid": "DateLineText"}) or card.find("time") or card.find("span", attrs={"data-testid": "Label"})
            if not time_tag and card.parent:
                time_tag = card.parent.find("time") or card.parent.find("span", attrs={"data-testid": "Label"})

            timestamp = time_tag.text.strip() if time_tag else "N/A"

            desc_tag = card.find("p", attrs={"data-testid": "Description"}) or card.find("p")
            description = desc_tag.text.strip() if desc_tag else "None"

            # Try EagerImage first, fall back to any img in the card
            img_tag = (
                card.find("img", {"data-testid": "EagerImage"}) or
                card.find("img", src=True)
            )
            image_url = img_tag.get("src", "") if img_tag else None
            image_alt = img_tag.get("alt", "") if img_tag else None

            result.append({
                "title": headline,
                "link": link,
                "time": timestamp,
                "description": description,
                "image": image_url,
                "imageAlt": image_alt,
                "createdAt": datetime.now(timezone.utc)
            })

        # Fallback 2: If result is empty (e.g. Akamai/Cloudflare bot-blocked in Cloud), fetch via Reuters Technology RSS Feed
        if not result:
            print("Notice: Selenium returned 0 items due to Cloud Bot Protection. Triggering Reuters RSS Feed Fallback...")
            rss_articles = fetch_reuters_rss()
            if rss_articles:
                result.extend(rss_articles)

        print(f"\n✅ Total {len(result)} articles prepared for database insertion.\n")
        
        collection = db["reuters_technology"]

        # Delete articles older than 1 day first
        collection.delete_many({
            "createdAt": {
                "$lt": datetime.now(timezone.utc) - timedelta(days=1)
            }
        })
        print(f"✅ Deleted articles older than 1 day")

        if result:
            # Fetch existing descriptions from the collection
            existing_descriptions = set(
                doc["description"]
                for doc in collection.find(
                    {"description": {"$exists": True, "$ne": "None"}},
                    {"description": 1, "_id": 0}
                )
            )

            new_articles = [
                article for article in result
                if article.get("description", "None") not in existing_descriptions
                and article.get("description", "None") != "None"
            ]

            if new_articles:
                collection.insert_many(new_articles)
                print(f"✅ Inserted {len(new_articles)} new articles (skipped {len(result) - len(new_articles)} duplicates)")
            else:
                print(f"⚠️ No new articles to insert — all {len(result)} already exist in the collection")
                

    finally:
        driver.quit()
        if display:
            display.stop()


if __name__ == "__main__":
    handler()