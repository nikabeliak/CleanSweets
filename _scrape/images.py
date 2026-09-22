#!/usr/bin/env python3
"""Collect every wixstatic image referenced across all pages, download a
reasonably-sized version of each into ../images, and emit image_map.json
mapping the original URL -> local filename."""
import json
import os
import re
import ssl
import urllib.parse
import urllib.request

HERE = os.path.dirname(__file__)
CONTENT = os.path.join(HERE, "content.json")
IMGDIR = os.path.abspath(os.path.join(HERE, "..", "images"))
os.makedirs(IMGDIR, exist_ok=True)

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"}


def base_id(url):
    """Extract the stable media id like 49aa8c_xxx~mv2.jpg from a wix url."""
    m = re.search(r"/media/([^/]+)", url)
    return m.group(1) if m else None


def large_url(url):
    """Rewrite the /v1/... transform to a larger, high-quality render."""
    m = re.match(r"(https://static\.wixstatic\.com/media/[^/]+)(/v1/.*)?$", url)
    if not m:
        return url
    base = m.group(1)
    return base + "/v1/fill/w_1200,h_1200,al_c,q_85,enc_auto/file.jpg"


def collect():
    data = json.load(open(CONTENT, encoding="utf-8"))
    urls = set()
    for page in data.values():
        for it in page["items"]:
            if it["type"] == "image":
                urls.add(it["src"])
    return sorted(urls)


def main():
    urls = collect()
    mapping = {}
    seen_ids = {}
    ok = 0
    for url in urls:
        bid = base_id(url)
        if not bid:
            continue
        if bid in seen_ids:
            mapping[url] = seen_ids[bid]
            continue
        ext = os.path.splitext(bid)[1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
            ext = ".jpg"
        fname = re.sub(r"[^a-zA-Z0-9._-]", "_", bid)
        fname = os.path.splitext(fname)[0] + ext
        dest = os.path.join(IMGDIR, fname)
        mapping[url] = fname
        seen_ids[bid] = fname
        try:
            req = urllib.request.Request(large_url(url), headers=HEADERS)
            with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
                data = resp.read()
            with open(dest, "wb") as fh:
                fh.write(data)
            ok += 1
            print("OK  %-55s %8d" % (fname, len(data)))
        except Exception as exc:  # noqa: BLE001
            print("ERR %-55s %s" % (fname, exc))

    with open(os.path.join(HERE, "image_map.json"), "w", encoding="utf-8") as fh:
        json.dump(mapping, fh, ensure_ascii=False, indent=1)
    print("\nDownloaded %d unique images, mapped %d urls" % (ok, len(mapping)))


if __name__ == "__main__":
    main()