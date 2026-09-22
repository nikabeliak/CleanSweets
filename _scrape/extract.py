#!/usr/bin/env python3
"""Extract readable content + images from scraped Wix HTML pages.

Uses only the Python standard library (html.parser). Outputs a JSON file with
per-page sections (in document order) so the static site can be built from it.
"""
import json
import os
import re
from html.parser import HTMLParser

RAW = os.path.join(os.path.dirname(__file__), "raw")
OUT = os.path.join(os.path.dirname(__file__), "content.json")

# Tags whose text we capture.
TEXT_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "span", "div"}
SKIP_TAGS = {"script", "style", "noscript", "head", "svg"}


class Extractor(HTMLParser):
    """Walks HTML, collecting text blocks and images in document order."""

    def __init__(self, line_starts=None):
        super().__init__(convert_charrefs=True)
        self.items = []          # list of dicts: {type, ...}
        self.stack = []          # tag stack
        self._skip_depth = 0
        self._cur_text = []      # buffer for current text block
        self._cur_tag = None
        self._line_starts = line_starts or [0]
        self._buf_off = None

    def _abs_pos(self):
        line, col = self.getpos()
        if 0 < line <= len(self._line_starts):
            return self._line_starts[line - 1] + col
        return 0

    # -- helpers ---------------------------------------------------------
    def _flush_text(self):
        raw = "".join(self._cur_text)
        text = re.sub(r"\s+", " ", raw).strip()
        if text and len(text) > 1 and re.search(r"[0-9A-Za-zא-ת]", text):
            self.items.append({
                "type": "text",
                "tag": self._cur_tag,
                "text": text,
                "off": self._buf_off or 0,
            })
        self._cur_text = []
        self._buf_off = None

    # -- parser callbacks ------------------------------------------------
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in SKIP_TAGS:
            self._skip_depth += 1
            return
        if self._skip_depth:
            return
        cls = attrs.get("class", "")
        # capture images
        if tag == "img":
            src = attrs.get("src", "")
            if "wixstatic.com/media" in src:
                self.items.append({
                    "type": "image",
                    "src": src,
                    "alt": attrs.get("alt", ""),
                })
            return
        if tag in ("wbr", "br"):
            self._cur_text.append(" ")
            return
        if tag in TEXT_TAGS and "wixui-rich-text" in cls:
            self._cur_text.append(" ")
            if self._cur_tag is None:
                self._cur_tag = tag
        elif tag in TEXT_TAGS:
            self._cur_text.append(" ")

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS:
            if self._skip_depth:
                self._skip_depth -= 1
            return
        if self._skip_depth:
            return
        if tag in TEXT_TAGS and self._cur_text:
            self._flush_text()
            self._cur_tag = None

    def handle_data(self, data):
        if self._skip_depth:
            return
        if self._buf_off is None and data.strip():
            self._buf_off = self._abs_pos()
        self._cur_text.append(data)


def parse(path):
    with open(path, "rb") as fh:
        raw = fh.read().decode("utf-8", "replace")
    starts = [0]
    for ln in raw.split("\n"):
        starts.append(starts[-1] + len(ln) + 1)
    ex = Extractor(starts)
    ex.feed(raw)
    ex._flush_text()
    return ex.items


def main():
    result = {}
    for fn in sorted(os.listdir(RAW)):
        if not fn.endswith(".html"):
            continue
        key = fn[:-5]
        items = parse(os.path.join(RAW, fn))
        texts = [i for i in items if i["type"] == "text"]
        images = [i for i in items if i["type"] == "image"]
        result[key] = {"items": items, "text_count": len(texts), "image_count": len(images)}
        print("%-28s texts=%3d images=%3d" % (key, len(texts), len(images)))
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=1)
    print("\nWrote", OUT)


if __name__ == "__main__":
    main()