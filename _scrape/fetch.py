#!/usr/bin/env python3
"""Download all Clean Sweets pages/posts HTML into _scrape/raw/ for extraction."""
import os
import ssl
import urllib.parse
import urllib.request

BASE = "https://www.clean-sweets.com"
OUT = os.path.join(os.path.dirname(__file__), "raw")
os.makedirs(OUT, exist_ok=True)

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    ),
    "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
}

PAGES = {
    "home": "/",
    "blog": "/blog",
    "articles": "/articles",
    "categories": "/categories",
    "portfolio": "/portfolio",
    "search": "/search",
    "contact": "/צור-קשר",
    "privacy": "/מדיניות-הגנת-הפרטיות",
    "terms": "/תנאי-שימוש",
    "promo": "/הנחה-ניצת-הדובדבן",
}

POSTS = [
    "מיני-עוגיות-אוראו-דלות-בקלוריות",
    "בלינצסים-קלים-ודלים-בקלוריות",
    "עוגת-בננות-משגעת",
    "פנקייקים-אווריריים-בסגנון-יפני",
    "קינוח-קוקוס-קיטו",
    "ריבת-פירות-יער-דלת-פחמימה-בפחות-מ-30-דקות",
    "עוגיות-קוקוס-רכות-ומושלמות",
    "עוגת-גבינה-קרה",
    "גלי-קפה-בריא",
    "עוגת-שקדים-קינמון-וחמאה-חומה",
    "עוגת-שוקולד-בריאה",
    "עוגת-שוקולד-אישית-במיקרו",
    "קערת-מוס-שוקולד-אישי-ב-5-דקות-עבודה",
    "עוגיות-אגוזים-בריאות",
    "עוגת-יוגורט-פשוטה",
    "חיתוכיות-קוקוס-ולימון-רכות",
    "רולדה-עננים",
    "לביבות-גבינה-מתוקות-בריאות",
    "עוגיות-שוקולד-קפה-בריאות",
    "כדורי-שוקולד-מהילדות",
]


def fetch(url, path):
    url = urllib.parse.quote(url, safe=":/?&=")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
        data = resp.read()
    with open(path, "wb") as fh:
        fh.write(data)
    return len(data)


def main():
    for name, route in PAGES.items():
        url = BASE + route
        dest = os.path.join(OUT, "page_" + name + ".html")
        try:
            size = fetch(url, dest)
            print("OK  page_%-12s %9d bytes  <- %s" % (name, size, url))
        except Exception as exc:  # noqa: BLE001
            print("ERR page_%-12s %s" % (name, exc))

    for idx, slug in enumerate(POSTS, 1):
        url = BASE + "/post/" + slug
        dest = os.path.join(OUT, "post_%02d.html" % idx)
        try:
            size = fetch(url, dest)
            print("OK  post %02d %-30s %9d bytes" % (idx, slug[:30], size))
        except Exception as exc:  # noqa: BLE001
            print("ERR post %02d %-30s %s" % (idx, slug[:30], exc))
    # write slug index for later content mapping
    with open(os.path.join(OUT, "post_slugs.txt"), "w", encoding="utf-8") as fh:
        for idx, slug in enumerate(POSTS, 1):
            fh.write("%02d\t%s\n" % (idx, slug))


if __name__ == "__main__":
    main()