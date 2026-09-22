#!/usr/bin/env python3
"""Explore the wix-warmup-data JSON structure to plan extraction."""
import json
import re
import os

RAW = os.path.join(os.path.dirname(__file__), "raw")


def load_json_script(html, script_id):
    pattern = re.compile(
        r'<script type="application/json" id="' + re.escape(script_id) + r'">(.*?)</script>',
        re.DOTALL,
    )
    m = pattern.search(html)
    if not m:
        return None
    return json.loads(m.group(1))


def walk(obj, prefix="", depth=0, max_depth=3, out=None):
    if out is None:
        out = []
    if depth > max_depth:
        return out
    if isinstance(obj, dict):
        for k, v in obj.items():
            path = prefix + "/" + str(k)
            if isinstance(v, (dict, list)):
                walk(v, path, depth + 1, max_depth, out)
            else:
                out.append((path, type(v).__name__, str(v)[:60]))
    elif isinstance(obj, list):
        for i, v in enumerate(obj[:3]):
            path = prefix + "[" + str(i) + "]"
            if isinstance(v, (dict, list)):
                walk(v, path, depth + 1, max_depth, out)
            else:
                out.append((path, type(v).__name__, str(v)[:60]))
    return out


def main():
    html = open(os.path.join(RAW, "page_home.html"), encoding="utf-8").read()
    data = load_json_script(html, "wix-warmup-data")
    print("TOP-LEVEL KEYS:", list(data.keys()) if data else None)
    if data:
        for k, v in data.items():
            print("  ", k, "->", type(v).__name__,
                  (list(v.keys()) if isinstance(v, dict) else len(v) if isinstance(v, list) else ""))


if __name__ == "__main__":
    main()