#!/usr/bin/env python3
"""Build the Clean Sweets static site from scraped content.

Reads content.json + image_map.json, produces HTML pages + data/posts.json
at the CleanSweets project root.
"""
import html
import json
import os
import re
from html.parser import HTMLParser

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, ".."))
CONTENT = json.load(open(os.path.join(HERE, "content.json"), encoding="utf-8"))
IMGMAP = json.load(open(os.path.join(HERE, "image_map.json"), encoding="utf-8"))

ESC = lambda s: html.escape(s, quote=True)  # noqa: E731


def img(url):
    """Map a wix url to a local relative path."""
    name = IMGMAP.get(url)
    if not name:
        return ""
    return "images/" + name


def blocks(page_key):
    return CONTENT[page_key]["items"]


def texts(page_key):
    return [b["text"] for b in blocks(page_key) if b["type"] == "text"]


def imgs(page_key):
    return [b["src"] for b in blocks(page_key) if b["type"] == "image"]


# --------------------------------------------------------------------------
# Data extraction
# --------------------------------------------------------------------------
class TableParser(HTMLParser):
    """Extract Ricos table-plugin tables using data-visual-row/col attributes."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables = []
        self._in = False
        self._cells = {}
        self._cur = None
        self._row = 0
        self._col = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "table":
            self._in = True
            self._cells = {}
            return
        if not self._in:
            return
        if tag in ("td", "th"):
            if "data-visual-col" in a or a.get("data-hook") == "table-plugin-cell":
                self._row = int(a.get("data-visual-row", 0) or 0)
                self._col = int(a.get("data-visual-col", 0) or 0)
                self._cur = []
            else:
                self._cur = None
        elif self._cur is not None and tag in (
            "p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "br", "li",
        ):
            self._cur.append(" ")

    def handle_endtag(self, tag):
        if tag == "table" and self._in:
            self._in = False
            if self._cells:
                maxcol = max(max(d) for d in self._cells.values()) + 1
                rows = []
                for r in sorted(self._cells):
                    d = self._cells[r]
                    rows.append([d.get(c, "") for c in range(maxcol)])
                self.tables.append(rows)
            self._cells = {}
            return
        if tag in ("td", "th") and self._cur is not None:
            txt = re.sub(r"\s+", " ", "".join(self._cur)).strip()
            self._cells.setdefault(self._row, {})[self._col] = txt
            self._cur = None

    def handle_data(self, data):
        if self._cur is not None:
            self._cur.append(data)


def parse_tables(path):
    with open(path, "rb") as fh:
        h = fh.read().decode("utf-8", "replace")
    p = TableParser()
    p.feed(h)
    return p.tables


def parse_nutrition(rest, i, tables):
    """Build a nutrition block at rest[i] (heading 'טבלת ערכים...')."""
    heading = rest[i]["text"]
    j = i + 1
    caption = ""
    if j < len(rest) and rest[j]["type"] == "text" and len(rest[j]["text"]) > 40:
        caption = rest[j]["text"]
        j += 1
    labels = []
    while j < len(rest) and rest[j]["type"] == "text" and _is_tableish(rest[j]["text"]):
        t = rest[j]["text"].strip()
        if t.endswith(":") and len(t) <= 30 and t not in NUTRIENT_LABELS:
            labels.append(t)
        j += 1
    n = max(1, len(labels))
    use = tables[:n]
    out = []
    for k, rows in enumerate(use):
        out.append({"label": labels[k] if k < len(labels) else "", "rows": rows})
    return {
        "type": "nutrition",
        "heading": heading,
        "caption": caption,
        "tables": out,
    }, j


def build_posts():
    slugs = {}
    with open(os.path.join(HERE, "raw", "post_slugs.txt"), encoding="utf-8") as fh:
        for line in fh:
            idx, slug = line.rstrip("\n").split("\t")
            slugs[int(idx)] = slug

    posts = []
    for n in range(1, 21):
        key = "post_%02d" % n
        items = blocks(key)
        # metadata: title=17, date=18, readtime=19
        title = items[17]["text"]
        date = items[18]["text"]
        readtime = items[19]["text"]
        body = []
        rest = items[20:]
        tables = parse_tables(os.path.join(HERE, "raw", "post_%02d.html" % n))
        i = 0
        while i < len(rest):
            it = rest[i]
            if it["type"] == "image":
                body.append({"type": "image", "src": img(it["src"]), "alt": it.get("alt", "")})
                i += 1
                continue
            txt = it["text"]
            if txt.startswith("פוסטים אחרונים"):
                break
            if "טבלת ערכים" in txt:
                block, i = parse_nutrition(rest, i, tables)
                body.append(block)
                continue
            body.append({"type": "text", "text": txt})
            i += 1
        hero = next((b["src"] for b in body if b["type"] == "image"), "")
        posts.append({
            "n": n,
            "slug": slugs.get(n, "post-%d" % n),
            "title": title,
            "date": date,
            "readtime": readtime,
            "hero": hero,
            "body": body,
        })
    return posts


def post_title_map():
    """Map a recipe title to its generated post file (e.g. post-07.html)."""
    m = {}
    for n in range(1, 21):
        m[blocks("post_%02d" % n)[17]["text"]] = "post-%02d.html" % n
    return m


def build_home_recipes():
    items = blocks("page_home")
    title_map = post_title_map()
    # recipe cards: image followed by title, indices 25..64
    recipes = []
    for i in range(25, 65, 2):
        if items[i]["type"] == "image" and items[i + 1]["type"] == "text":
            title = items[i + 1]["text"]
            recipes.append({
                "img": img(items[i]["src"]),
                "title": title,
                "href": "post/" + title_map[title] if title in title_map else "blog.html",
            })
    return recipes


def build_articles():
    key = "page_articles"
    items = blocks(key)
    arts = []
    for i in range(13, 37, 4):
        if items[i]["type"] == "image":
            arts.append({
                "img": img(items[i]["src"]),
                "title": items[i + 1]["text"],
                "excerpt": items[i + 2]["text"],
            })
    return arts


def build_home_articles():
    items = blocks("page_home")
    arts = []
    for i in range(76, 88, 2):
        if i + 1 < len(items) and items[i]["type"] == "image" and items[i + 1]["type"] == "text":
            arts.append({"img": img(items[i]["src"]), "title": items[i + 1]["text"]})
    return arts


def build_home_story():
    t = texts("page_home")
    # find 'הסיפור שלי'
    out = {}
    for i, s in enumerate(t):
        if s == "הסיפור שלי" and i + 2 < len(t):
            out["heading"] = s
            out["title"] = t[i + 2].lstrip("< ").strip()
            out["body"] = t[i + 3]
            break
    items = blocks("page_home")
    for it in items:
        if it["type"] == "image" and "04addcbb" in it["src"]:
            out["img"] = img(it["src"])
    return out


# --------------------------------------------------------------------------
# Layout
# --------------------------------------------------------------------------
NAV = [
    ("בית", "index.html"),
    ("עליי", "portfolio.html"),
    ("מתכונים", "blog.html"),
    ("כתבות", "articles.html"),
    ("קטגוריות", "categories.html"),
    ("חיפוש", "search.html"),
]

FOOTER_LINKS = [
    ("תנאי שימוש", "terms.html"),
    ("צור קשר", "contact.html"),
    ("מדיניות פרטיות", "privacy.html"),
]


LOGO = "images/logo.jpg"


def header(active, base=""):
    links = []
    for label, href in NAV:
        cur = ' aria-current="page"' if href == active else ""
        links.append('<a href="%s%s"%s>%s</a>' % (base, href, cur, ESC(label)))
    return """<header class="site-header">
  <div class="wrap site-header__bar">
    <a class="brand" href="%sindex.html">
      <img class="brand__mark" src="%s%s" alt="Clean Sweets">
      <span class="brand__name">clean sweets</span>
    </a>
    <button class="nav-toggle" aria-label="פתח תפריט" onclick="document.getElementById('nav').classList.toggle('open')">&#9776;</button>
    <nav class="nav" id="nav">%s</nav>
  </div>
</header>""" % (base, base, LOGO, "".join(links))


def footer(base=""):
    links = "".join('<a href="%s%s">%s</a>' % (base, h, ESC(l)) for l, h in FOOTER_LINKS)
    return """<footer class="site-footer">
  <div class="wrap">
    <div class="footer-links">%s</div>
    <p class="copy">כל הזכויות שמורות לניקה בליאק 2026</p>
  </div>
</footer>""" % links


def page(title, active, body, extra_head="", base=""):
    return """<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%s</title>
  <link rel="icon" href="%s%s">
  <link rel="stylesheet" href="%scss/style.css">%s
</head>
<body>
%s
<main>
%s
</main>
%s
<script src="%sjs/site.js"></script>
</body>
</html>
""" % (ESC(title), base, LOGO, base, extra_head, header(active, base), body, footer(base), base)


def write(path, content):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8") as fh:
        fh.write(content)
    print("wrote", path)


# --------------------------------------------------------------------------
# Pages
# --------------------------------------------------------------------------
def recipe_card(r):
    return """<a class="card" href="%s">
  <img class="card__img" loading="lazy" src="%s" alt="%s">
  <div class="card__body"><h3 class="card__title">%s</h3></div>
</a>""" % (r.get("href", "blog.html"), r["img"], ESC(r["title"]), ESC(r["title"]))


def render_index(recipes, home_arts, story, posts):
    promo = """<section class="wrap">
  <div class="promo">
    <h2>קוד מועדון לניצת הדובדבן</h2>
    <div class="code">600161</div>
    <p>5%% הנחה על כל המוצרים &middot; כולל כפל מבצעים</p>
    <p>הקוד תקף לכולם וניתן למימוש בכל סניפי ניצת הדובדבן ובאונליין.</p>
    <p>כל מה שעליכם לעשות זה לתת את קוד המועדון בקופה בסיום הרכישה או להקליד אותו בהערות להזמנה בהזמנות באונליין.</p>
    <a class="btn" href="promo.html">פרטים נוספים</a>
  </div>
</section>"""

    grid = "".join(recipe_card(r) for r in recipes)
    arts = "".join(
        '<a class="card" href="articles.html"><img class="card__img" loading="lazy" src="%s" alt="%s"><div class="card__body"><h3 class="card__title">%s</h3></div></a>'
        % (a["img"], ESC(a["title"]), ESC(a["title"]))
        for a in home_arts
    )

    body = """<section class="hero wrap">
  <h1 class="hero__title">ברוכים הבאים</h1>
  <p class="hero__sub">clean sweets</p>
  <p>קינוחים בריאים מהירים ופשוטים שמתאימים לכולם. כל הקינוחים ללא גלוטן וללא סוכר.</p>
</section>
%s
<section class="section wrap">
  <h2 class="center">המתכונים האחרונים שלנו</h2>
  <div class="grid">%s</div>
  <p class="center" style="margin-top:32px"><a class="btn btn--solid" href="blog.html">מתכונים נוספים</a></p>
</section>
<section class="section wrap">
  <div class="split">
    <div>
      <h2>%s</h2>
      <p>%s</p>
      <p><a class="btn btn--ghost" href="portfolio.html">קרא עוד</a></p>
    </div>
    <img loading="lazy" src="%s" alt="הסיפור שלי">
  </div>
</section>
<section class="section wrap">
  <h2>פוסטים נוספים</h2>
  <div class="grid">%s</div>
</section>""" % (
        promo,
        grid,
        ESC(story.get("title", "הסיפור שלי")),
        ESC(story.get("body", "")),
        story.get("img", ""),
        arts,
    )
    write("index.html", page("קינוחים בריאים | Clean Sweets", "index.html", body))


def post_file(p):
    return "post-%02d.html" % p["n"]


def render_blog(recipes, posts):
    cards = "".join(recipe_card(r) for r in recipes)
    body = """<section class="hero wrap"><h1>מגוון המתכונים</h1></section>
<section class="section wrap"><div class="grid">%s</div></section>""" % cards
    write("blog.html", page("מתכונים | Clean Sweets", "blog.html", body))


def render_articles(arts):
    rows = "".join(
        """<article class="article">
  <img loading="lazy" src="%s" alt="%s">
  <div><h3>%s</h3><p>%s</p></div>
</article>""" % (a["img"], ESC(a["title"]), ESC(a["title"]), ESC(a["excerpt"]))
        for a in arts
    )
    body = """<section class="hero wrap">
  <h1>המדריך לחיים פשוטים ובריאים</h1>
  <p class="hero__sub">כתבות, המלצות ותובנות יומיומיות</p>
</section>
<section class="section wrap">%s</section>""" % rows
    write("articles.html", page("כתבות | Clean Sweets", "articles.html", body))


def render_categories():
    cats = [
        ("דל בקלוריות", "דל-בקלוריות"),
        ("לסכרתיים וקטוגנים", "לקטוגנים-לסכרתיים"),
        ("ללא לקטוז", "ללא-לקטוז"),
        ("עשיר בחלבון", "עשיר-בחלבון"),
    ]
    cards = "".join('<a class="cat" href="blog.html">%s<small>%s</small></a>' % (ESC(n), ESC(s)) for n, s in cats)
    body = """<section class="hero wrap"><h1>Categories List</h1></section>
<section class="section wrap"><div class="cat-grid">%s</div></section>""" % cards
    write("categories.html", page("קטגוריות | Clean Sweets", "categories.html", body))


def render_portfolio():
    imgs_list = imgs("page_portfolio")
    a = img(imgs_list[0]) if imgs_list else ""
    b = img(imgs_list[1]) if len(imgs_list) > 1 else ""
    t = texts("page_portfolio")
    body = """<section class="hero wrap"><h1>%s</h1></section>
<section class="section wrap">
  <p>%s</p>
  <p>%s</p>
  <div class="split section--tight">
    <img loading="lazy" src="%s" alt="">
    <img loading="lazy" src="%s" alt="">
  </div>
  <h2>%s</h2>
  <p>%s</p>
</section>""" % (ESC(t[11]), ESC(t[12]), ESC(t[13]), a, b, ESC(t[16]), ESC(t[17]))
    write("portfolio.html", page("עליי | Clean Sweets", "portfolio.html", body))


def render_promo():
    t = texts("page_promo")
    imgs_list = imgs("page_promo")
    gallery = "".join('<img loading="lazy" src="%s" alt="">' % img(u) for u in imgs_list[:4])
    paras = "".join("<p>%s</p>" % ESC(s) for s in t[23:32])
    body = """<section class="hero wrap">
  <h1>%s</h1>
  <div class="promo"><div class="code">%s</div><p>%s</p><p>%s</p><p>%s</p><p>%s</p></div>
</section>
<section class="section wrap">
  <div class="split section--tight">%s</div>
  %s
</section>""" % (ESC(t[11]), ESC(t[13]), ESC(t[14]), ESC(t[15]), ESC(t[16]), ESC(t[17]), gallery, paras)
    write("promo.html", page("הנחה ניצת הדובדבן | Clean Sweets", "promo.html", body))


def render_contact():
    t = texts("page_contact")
    body = """<section class="hero wrap"><h1>%s</h1></section>
<section class="section wrap" style="max-width:900px">
  <p>%s</p>
  <h2>%s</h2>
  <p>%s</p>
  <h2>%s</h2>
  <p>%s</p>
  <p>%s</p>
  <p>%s</p>
  <p>אינסטגרם: <strong>%s</strong><br>אימייל: <strong>%s</strong></p>
</section>
<section class="newsletter">
  <div class="wrap">
    <h2>פה כדי להקשיב לכם</h2>
    <p>מוזמנים לשתף אותי פה בשאלות, הצעות ובקשות לתכנים</p>
    <form class="form" onsubmit="return window.__csSubmit(event)">
      <label for="c-name">שם מלא *</label>
      <input id="c-name" name="name" required>
      <label for="c-email">כתובת מייל *</label>
      <input id="c-email" type="email" name="email" required>
      <label for="c-msg">הודעה</label>
      <textarea id="c-msg" name="message"></textarea>
      <button class="btn" type="submit">שלח</button>
    </form>
  </div>
</section>""" % (ESC(t[11]), ESC(t[12]), ESC(t[13]), ESC(t[14]), ESC(t[15]), ESC(t[16]), ESC(t[17]), ESC(t[18]), ESC(t[19]), ESC(t[20]))
    write("contact.html", page("צור קשר | Clean Sweets", "contact.html", body))


def render_legal(active, title, pairs):
    secs = "".join("<h2>%s</h2><p>%s</p>" % (ESC(h), ESC(b)) for h, b in pairs)
    body = '<section class="hero wrap"><h1>%s</h1></section>\n<section class="section wrap legal">%s</section>' % (ESC(title), secs)
    write(active, page(title, active, body))


def render_privacy():
    t = texts("page_privacy")
    pairs = [(t[i], t[i + 1]) for i in range(12, 29, 2)]
    render_legal("privacy.html", t[11], pairs)


def render_terms():
    t = texts("page_terms")
    pairs = [(t[i], t[i + 1]) for i in range(12, 31, 2)]
    render_legal("terms.html", t[11], pairs)


def render_search(posts, recipes):
    entries = [{"t": p["title"], "u": "post/" + post_file(p)} for p in posts]
    seen = set(e["t"] for e in entries)
    for r in recipes:
        href = r.get("href", "")
        if href and href != "blog.html" and r["title"] not in seen:
            entries.append({"t": r["title"], "u": href})
            seen.add(r["title"])
    with open(os.path.join(ROOT, "data", "search-index.json"), "w", encoding="utf-8") as fh:
        json.dump(entries, fh, ensure_ascii=False, indent=1)
    body = """<section class="hero wrap"><h1>חיפוש</h1>
  <input id="q" class="search-input" placeholder="חפשו מתכון או כתבה...">
</section>
<section class="section wrap" style="max-width:760px"><div id="results"></div></section>"""
    write("search.html", page("חיפוש | Clean Sweets", "search.html", body))


def heading_like(s):
    if s.endswith(":") and len(s) < 40:
        return True
    return s in ("מתכון", "מרכיבים", "הוראות הכנה", "הערות")


def render_posts(posts):
    os.makedirs(os.path.join(ROOT, "post"), exist_ok=True)
    base = "../"
    for p in posts:
        fname = post_file(p)
        parts = []
        for b in p["body"]:
            if b["type"] == "image":
                parts.append('<figure><img loading="lazy" src="%s%s" alt=""></figure>' % (base, b["src"]))
            elif b["type"] == "nutrition":
                cap = ('<p class="nutrition-note">%s</p>' % ESC(b["caption"])) if b["caption"] else ""
                chunks = [
                    '<div class="nutrition-block"><h3 class="nutrition-title">%s</h3>%s'
                    % (ESC(b["heading"]), cap)
                ]
                for t in b.get("tables", []):
                    rows = t.get("rows") or []
                    if not rows:
                        continue
                    if t.get("label"):
                        chunks.append('<p class="nutrition-sub">%s</p>' % ESC(t["label"]))
                    head = "".join("<th>%s</th>" % ESC(c) for c in rows[0])
                    bodyrows = "".join(
                        "<tr>%s</tr>" % "".join("<td>%s</td>" % ESC(c) for c in row)
                        for row in rows[1:]
                    )
                    chunks.append(
                        '<table class="nutrition"><thead><tr>%s</tr></thead><tbody>%s</tbody></table>'
                        % (head, bodyrows)
                    )
                chunks.append("</div>")
                parts.append("".join(chunks))
            else:
                txt = b["text"]
                if heading_like(txt):
                    parts.append("<h3>%s</h3>" % ESC(txt))
                else:
                    parts.append("<p>%s</p>" % ESC(txt))
        body = """<article>
  <header class="post__header wrap">
    <h1>%s</h1>
    <div class="post__meta"><span>%s</span><span>%s</span></div>
  </header>
  <div class="post__body wrap">%s</div>
</article>""" % (ESC(p["title"]), ESC(p["date"]), ESC(p["readtime"]), "".join(parts))
        write(os.path.join("post", fname), page(p["title"] + " | Clean Sweets", "", body, base=base))


def main():
    posts = build_posts()
    recipes = build_home_recipes()
    arts = build_articles()
    home_arts = build_home_articles()
    story = build_home_story()

    os.makedirs(os.path.join(ROOT, "post"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)

    render_index(recipes, home_arts, story, posts)
    render_blog(recipes, posts)
    render_articles(arts)
    render_categories()
    render_portfolio()
    render_promo()
    render_contact()
    render_privacy()
    render_terms()
    render_search(posts, recipes)
    render_posts(posts)

    with open(os.path.join(ROOT, "data", "posts.json"), "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False, indent=1)
    print("\nDONE: %d posts, %d recipes, %d articles" % (len(posts), len(recipes), len(arts)))


if __name__ == "__main__":
    main()