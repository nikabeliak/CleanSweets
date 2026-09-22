#!/usr/bin/env python3
"""Download the webfonts used by the site into ../fonts."""
import os
import ssl
import urllib.request

HERE = os.path.dirname(__file__)
FONTDIR = os.path.abspath(os.path.join(HERE, "..", "fonts"))
os.makedirs(FONTDIR, exist_ok=True)

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"}

FONTS = {
    "asimon-hebrew.woff2": "https://static.parastorage.com/fonts/v2/b85856c2-b164-46eb-9262-462e10a4bb27/v1/asimon-aaa-400.hebrew.woff2",
    "asimon-other.woff2": "https://static.parastorage.com/fonts/v2/b85856c2-b164-46eb-9262-462e10a4bb27/v1/asimon-aaa-400.other.woff2",
    "asimon-math.woff2": "https://static.parastorage.com/fonts/v2/b85856c2-b164-46eb-9262-462e10a4bb27/v1/asimon-aaa-400.math.woff2",
    "asimon-symbols.woff2": "https://static.parastorage.com/fonts/v2/b85856c2-b164-46eb-9262-462e10a4bb27/v1/asimon-aaa-400.symbols.woff2",
    "brand.woff2": "https://static.wixstatic.com/ufonts/8d1e41_c211e68ccfe6443282506e579af085aa/woff2/file.woff2",
    "assistant-hebrew.woff2": "https://static.parastorage.com/tag-bundler/api/v1/fonts-cache/googlefont/woff2/s/assistant/v22/2sDcZGJYnIjSi6H75xkzZmW5Kb8VZBHR.woff2",
    "assistant-latin.woff2": "https://static.parastorage.com/tag-bundler/api/v1/fonts-cache/googlefont/woff2/s/assistant/v22/2sDcZGJYnIjSi6H75xkzaGW5Kb8VZA.woff2",
}


def main():
    for name, url in FONTS.items():
        dest = os.path.join(FONTDIR, name)
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
                data = resp.read()
            with open(dest, "wb") as fh:
                fh.write(data)
            print("OK  %-28s %8d" % (name, len(data)))
        except Exception as exc:  # noqa: BLE001
            print("ERR %-28s %s" % (name, exc))


if __name__ == "__main__":
    main()