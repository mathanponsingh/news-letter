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
import random
load_dotenv()

# User-Agent pool for rotation across requests
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
]

IMPERSONATE_TARGETS = [
    "chrome",
    "chrome120",
    "chrome119",
    "safari",
    "edge",
]


def get_random_user_agent():
    """Returns a random User-Agent string from the pool."""
    return random.choice(USER_AGENTS)


def get_random_impersonate():
    """Returns a random browser impersonation target for curl_cffi."""
    return random.choice(IMPERSONATE_TARGETS)


def get_random_headers():
    """Generates realistic HTTP request headers with a rotated User-Agent."""
    return {
        "User-Agent": get_random_user_agent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
    }


def clean_image_url(url, base_url="https://www.reuters.com"):
    """Validates and formats image URLs, discarding data URIs and invalid strings."""
    if not url or not isinstance(url, str):
        return ""
    url = url.strip()
    if url.startswith("data:"):
        return ""
    if url.startswith("//"):
        return f"https:{url}"
    if url.startswith("/"):
        return f"{base_url.rstrip('/')}{url}"
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return ""


def extract_card_image(card):
    """Extracts a valid http(s) image URL from a story card element, properly parsing lazy-loading & picture elements."""
    possible_urls = []

    # 1. Check parent or nested <picture> element sources first
    picture = card if card.name == "picture" else card.find("picture")
    if picture:
        for source in picture.find_all("source"):
            for attr in ["srcset", "data-srcset", "src"]:
                val = source.get(attr)
                if val:
                    candidates = [item.strip().split(" ")[0] for item in val.split(",") if item.strip()]
                    possible_urls.extend(reversed(candidates))

    # 2. Check <img> elements in card
    imgs = card.find_all("img") if card.name != "img" else [card]
    for img in imgs:
        for attr in ["srcset", "data-srcset"]:
            val = img.get(attr)
            if val:
                candidates = [item.strip().split(" ")[0] for item in val.split(",") if item.strip()]
                possible_urls.extend(reversed(candidates))

        for attr in ["src", "data-src", "data-lazy-src", "data-original"]:
            val = img.get(attr)
            if val:
                possible_urls.append(val)

    # Return the first clean http(s) URL found
    for candidate in possible_urls:
        cleaned = clean_image_url(candidate)
        if cleaned:
            return cleaned

    return ""


def extract_article_page_image(soup):
    """Extracts og:image, twitter:image, ld+json image, or main eager image from article page HTML."""
    if not soup:
        return ""

    # 1. Check meta tags
    meta_attrs = [
        {"property": "og:image"},
        {"name": "og:image"},
        {"name": "twitter:image"},
        {"property": "twitter:image"},
        {"name": "image"},
        {"rel": "image_src"},
    ]
    for attrs in meta_attrs:
        tag = soup.find("meta", attrs=attrs) or soup.find("link", attrs=attrs)
        if tag:
            content = tag.get("content") or tag.get("href")
            cleaned = clean_image_url(content)
            if cleaned:
                return cleaned

    # 2. Check JSON-LD structured data
    import json
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
            if isinstance(data, dict):
                img = data.get("image") or data.get("thumbnailUrl")
                if isinstance(img, dict):
                    img = img.get("url")
                if isinstance(img, list) and img:
                    img = img[0]
                cleaned = clean_image_url(img)
                if cleaned:
                    return cleaned
        except Exception:
            pass

    # 3. Check eager or main images in article body
    img_tag = (
        soup.find("img", {"data-testid": "EagerImage"}) or
        soup.find("img", attrs={"srcset": True}) or
        soup.find("img", attrs={"src": True})
    )
    if img_tag:
        for attr in ["srcset", "data-srcset"]:
            val = img_tag.get(attr)
            if val:
                candidates = [item.strip().split(" ")[0] for item in val.split(",") if item.strip()]
                if candidates:
                    cleaned = clean_image_url(candidates[-1])
                    if cleaned:
                        return cleaned
        for attr in ["src", "data-src", "data-lazy-src"]:
            cleaned = clean_image_url(img_tag.get(attr))
            if cleaned:
                return cleaned

    return ""


def extract_rss_image_url(item, link, title):
    """Extracts image URL from RSS XML elements (media, enclosure, description) or fetches real article HTML element images via curl_cffi."""
    # 1. Check XML elements for media/enclosure/description image tags
    media_tags = [
        ".//{http://search.yahoo.com/mrss/}content",
        ".//{http://search.yahoo.com/mrss/}thumbnail",
        ".//{http://video.search.yahoo.com/mrss}content",
        ".//enclosure"
    ]
    for tag in media_tags:
        elem = item.find(tag)
        if elem is not None and elem.attrib.get("url"):
            url = elem.attrib.get("url")
            elem_type = elem.attrib.get("type", "").lower()
            if not elem_type or "image" in elem_type or any(url.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp", ".gif"]):
                cleaned = clean_image_url(url)
                if cleaned:
                    return cleaned

    # Check description or content HTML for <img> tag
    desc = item.find("description")
    desc_text = desc.text if desc is not None and desc.text else ""
    content_encoded = item.find(".//{http://purl.org/rss/1.0/modules/content/}encoded")
    if content_encoded is not None and content_encoded.text:
        desc_text += " " + content_encoded.text

    if desc_text:
        soup = BeautifulSoup(desc_text, "html.parser")
        img = soup.find("img")
        if img:
            for attr in ["src", "data-src", "srcset"]:
                val = img.get(attr)
                if val:
                    candidates = [item.strip().split(" ")[0] for item in val.split(",") if item.strip()]
                    for candidate in candidates:
                        cleaned = clean_image_url(candidate)
                        if cleaned:
                            return cleaned

    # 2. Scrape article page directly via curl_cffi for real image
    if link and link.startswith("https://www.reuters.com"):
        try:
            from curl_cffi import requests as cffi_requests
            time.sleep(random.uniform(0.5, 1.5))
            r = cffi_requests.get(
                link,
                impersonate=get_random_impersonate(),
                headers=get_random_headers(),
                timeout=10
            )
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                cleaned = extract_article_page_image(soup)
                if cleaned:
                    return cleaned
        except Exception:
            pass

    # Leave image empty string if no original image is found
    return ""


def fetch_reuters_rss():
    """Fetches latest Reuters Technology articles published strictly within Yesterday & Today (last 24 hours), including decoded links and unique image URLs."""
    import urllib.request
    import xml.etree.ElementTree as ET
    from email.utils import parsedate_to_datetime
    from concurrent.futures import ThreadPoolExecutor
    try:
        from googlenewsdecoder import new_decoderv1
    except ImportError:
        new_decoderv1 = None

    url = "https://news.google.com/rss/search?q=site:reuters.com+technology&hl=en-US&gl=US&ceid=US:en"
    headers = get_random_headers()

    cutoff_time = datetime.now(timezone.utc) - timedelta(days=1)

    try:
        req = urllib.request.Request(url, headers=headers)
        xml_data = urllib.request.urlopen(req, timeout=15).read()
        root = ET.fromstring(xml_data)
        items = root.findall(".//item")

        filtered_items = []
        for item in items:
            raw_title = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            pub_date_str = item.find("pubDate").text if item.find("pubDate") is not None else ""

            dt_pub = None
            if pub_date_str:
                try:
                    dt_pub = parsedate_to_datetime(pub_date_str)
                except Exception:
                    dt_pub = None

            # Skip older articles (only keep Yesterday & Today)
            if dt_pub and dt_pub < cutoff_time:
                continue

            title = raw_title.replace(" - Reuters", "").strip() if raw_title else ""

            if title and len(title) > 10:
                filtered_items.append((item, title, link, pub_date_str, dt_pub))

        def process_entry(entry):
            item, title, raw_link, pub_date_str, dt_pub = entry
            
            # Decode Google News RSS link to actual Reuters article link
            final_link = raw_link
            if new_decoderv1 and "news.google.com" in raw_link:
                try:
                    res = new_decoderv1(raw_link)
                    if res and res.get("status") and res.get("decoded_url"):
                        final_link = res.get("decoded_url")
                except Exception:
                    final_link = raw_link

            image_url = extract_rss_image_url(item, final_link, title)
            print(image_url)

            return {
                "title": title,
                "link": final_link,
                "time": pub_date_str or "Recently",
                "description": title,
                "image": image_url,
                "imageAlt": title,
                "createdAt": dt_pub or datetime.now(timezone.utc)
            }

        with ThreadPoolExecutor(max_workers=10) as executor:
            articles = list(executor.map(process_entry, filtered_items))

        print(f"✅ Extracted {len(articles)} fresh Reuters Technology articles with decoded links and unique images.")
        return articles
    except Exception as e:
        print(f"❌ RSS Feed fetch error: {e}")

    return []


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


def fetch_reuters_direct():
    """Fetches articles directly from https://www.reuters.com/technology/ using curl_cffi to bypass DataDome bot detection."""
    try:
        from curl_cffi import requests as cffi_requests
        from concurrent.futures import ThreadPoolExecutor
        
        url = "https://www.reuters.com/technology/"
        r = cffi_requests.get(
            url,
            impersonate=get_random_impersonate(),
            headers=get_random_headers(),
            timeout=10
        )
        if r.status_code != 200 or len(r.text) < 5000:
            return []

        soup = BeautifulSoup(r.text, "html.parser")
        story_cards = soup.find_all(
            attrs={"data-testid": lambda v: v and any(k in str(v) for k in ["StoryCard", "single-section-block", "FeedListItem", "MediaStoryCard", "Story"])}
        )
        if not story_cards:
            story_cards = soup.find_all("article")

        if not story_cards:
            return []

        def process_card(card):
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
                return None

            link = title_tag.get("href", "") if title_tag else "N/A"
            if link and link.startswith("/"):
                link = f"https://www.reuters.com{link}"

            time_tag = card.find("time", attrs={"data-testid": "DateLineText"}) or card.find("time") or card.find("span", attrs={"data-testid": "Label"})
            if not time_tag and card.parent:
                time_tag = card.parent.find("time") or card.parent.find("span", attrs={"data-testid": "Label"})

            timestamp = time_tag.text.strip() if time_tag else "N/A"

            desc_tag = card.find("p", attrs={"data-testid": "Description"}) or card.find("p")
            description = desc_tag.text.strip() if desc_tag else "None"

            # Extract clean HTTP(S) image URL from card (handles srcset, data-src, picture elements)
            image_url = extract_card_image(card)

            # If image URL missing or invalid on index page, fetch from article page
            if not image_url and link and link.startswith("https://www.reuters.com"):
                try:
                    time.sleep(random.uniform(1.0, 2.5))

                    art_resp = cffi_requests.get(
                        link,
                        impersonate=get_random_impersonate(),
                        headers=get_random_headers(),
                        timeout=10
                    )
                    if art_resp.status_code == 200:
                        art_soup = BeautifulSoup(art_resp.text, "html.parser")
                        image_url = extract_article_page_image(art_soup)
                except Exception:
                    pass

            if not image_url:
                image_url = ""

            print(headline+"\n"+image_url+"\n")
            return {
                "title": headline,
                "link": link,
                "time": timestamp,
                "description": description,
                "image": image_url,
                "imageAlt": headline,
                "createdAt": datetime.now(timezone.utc)
            }

        with ThreadPoolExecutor(max_workers=2) as executor:
            raw_articles = [r for r in executor.map(process_card, story_cards) if r is not None]

        # Filter out duplicate headlines/links from main page layout
        seen_keys = set()
        unique_articles = []
        for art in raw_articles:
            key = (art["title"].strip().lower(), art["link"])
            if key not in seen_keys:
                seen_keys.add(key)
                unique_articles.append(art)

        return unique_articles
    except Exception as e:
        print(f"Notice: Direct scraping fallback - {e}")
        return []


def handler(event=None, context=None):
    """Main scraping handler function."""
    client, db = get_db_connection()
    if db is not None:
        print(f"Collections: {db.list_collection_names()}")
    else:
        return None

    # Step 1: Try direct scraping reuters.com/technology via curl_cffi (Fast & Bypasses DataDome)
    print("Fetching live articles directly from reuters.com/technology/...")
    result = fetch_reuters_direct()

    if result:
        print(f"✅ Extracted {len(result)} live articles directly from reuters.com/technology/")
    else:
        print("Notice: Direct scraping returned 0 items. Triggering Reuters RSS Feed Fallback...")
        result = fetch_reuters_rss()

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
        # Deduplicate based on link or title against existing DB documents
        existing_links = set(
            doc["link"]
            for doc in collection.find(
                {"link": {"$exists": True}},
                {"link": 1, "_id": 0}
            )
        )
        existing_titles = set(
            doc["title"].strip().lower()
            for doc in collection.find(
                {"title": {"$exists": True}},
                {"title": 1, "_id": 0}
            )
        )

        new_articles = [
            article for article in result
            if article.get("link") not in existing_links
            and article.get("title", "").strip().lower() not in existing_titles
        ]

        if new_articles:
            collection.insert_many(new_articles)
            print(f"✅ Inserted {len(new_articles)} new articles (skipped {len(result) - len(new_articles)} duplicates)")
        else:
            print(f"⚠️ No new articles to insert — all {len(result)} already exist in the collection")


if __name__ == "__main__":
    handler()