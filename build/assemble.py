#!/usr/bin/env python3
"""Assemble the bilingual (EN/ES) single-page Kitchen Lab Manual.
Outputs:
  ../index.html          full standalone document
  artifact_body.html     body-only variant for publishing as an Artifact
Each lesson/hub exists as an EN section and (when available) an ES twin, keyed by
data-page + data-lang. The Lab Instruments page is one section (data-page=tools,
no data-lang) with bilingual chrome; its calculators are shared.
Missing ES translations are simply skipped — the runtime router falls back to EN.
"""
import os, re, sys

BUILD = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.dirname(BUILD)
parts    = os.path.join(BUILD, "parts")
lessons  = os.path.join(BUILD, "lessons")
lessons_es = os.path.join(BUILD, "lessons_es")
tools    = os.path.join(BUILD, "tools")

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

# page order and file mapping
LESSONS = [("lesson_p0","p0"),("lesson_m1","m1"),("lesson_m2","m2"),("lesson_m3","m3"),
           ("lesson_m4","m4"),("lesson_m5","m5"),("lesson_m6","m6"),("lesson_m7","m7"),
           ("lesson_m8","m8")]
TOOLS = ["tool_doneness","tool_dough","tool_brine","tool_grain"]

SEC_OPEN = re.compile(r'<section class="lesson[^"]*"[^>]*>')
def normalize(text, page, lang):
    """Rewrite the first lesson-section opening tag with data-page/data-lang, dropping id/show."""
    lang_attr = f' data-lang="{lang}"' if lang else ''
    return SEC_OPEN.sub(f'<section class="lesson" data-page="{page}"{lang_attr}>', text, count=1)

# ---- validation (forbid external resources) ----
FORBIDDEN = [
    (r'src\s*=\s*["\']https?://', "remote src"),
    (r'<link\b', "<link> tag"),
    (r'@import', "@import"),
    (r'url\(\s*["\']?https?://', "remote url() in CSS"),
    (r'<script[^>]*\bsrc=', "remote <script src>"),
]
problems, missing_en, missing_es = [], [], []
def scan(fp, label):
    txt = read(fp)
    for pat, lab in FORBIDDEN:
        if re.search(pat, txt, re.I):
            problems.append(f"{label}: {lab}")
    return txt

for name, page in LESSONS:
    fp = os.path.join(lessons, name + ".html")
    if not os.path.exists(fp): missing_en.append(name); continue
    scan(fp, name)
    esp = os.path.join(lessons_es, name + ".html")
    if not os.path.exists(esp): missing_es.append(name)
    else: scan(esp, name+"[es]")
for t in TOOLS:
    fp = os.path.join(tools, t + ".html")
    if not os.path.exists(fp): missing_en.append(t); continue
    scan(fp, t)

if missing_en:
    print("MISSING (EN, required):", ", ".join(missing_en)); sys.exit(1)
if problems:
    print("VALIDATION ISSUES:"); [print("  -", p) for p in problems]
if missing_es:
    print("ES translations pending (will fall back to EN at runtime):", ", ".join(missing_es))

# ---- read parts ----
style  = read(os.path.join(parts, "style.html")).strip()
nav    = read(os.path.join(parts, "nav.html")).rstrip()
script = read(os.path.join(parts, "script.html")).rstrip()

# hub (EN + ES twin)
sections = []
sections.append(normalize(read(os.path.join(parts,"hub.html")), "home", "en").rstrip())
hub_es = os.path.join(parts, "hub_es.html")
if os.path.exists(hub_es):
    sections.append(normalize(read(hub_es), "home", "es").rstrip())

# tools (single bilingual section; EN calculators shared for now)
tools_head = normalize(read(os.path.join(parts,"tools_head.html")), "tools", None).rstrip()
tools_tail = read(os.path.join(parts,"tools_tail.html")).rstrip()
widgets = "\n".join(read(os.path.join(tools, t + ".html")).rstrip() for t in TOOLS)
sections.append(tools_head + "\n" + widgets + "\n" + tools_tail)

# lessons (EN + ES twins)
for name, page in LESSONS:
    sections.append(normalize(read(os.path.join(lessons, name + ".html")), page, "en").rstrip())
    esp = os.path.join(lessons_es, name + ".html")
    if os.path.exists(esp):
        sections.append(normalize(read(esp), page, "es").rstrip())

body_inner = (
    nav + "\n"
    + '    <main class="stage" id="stage">\n'
    + '      <div class="wrap">\n'
    + "\n".join(sections) + "\n"
    + "      </div>\n    </main>\n"
)
app = '  <div class="app">\n' + body_inner + "  </div>\n"

full = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
    "<title>The Kitchen Lab Manual — Home Cooking, Engineered</title>\n"
    "<meta name=\"description\" content=\"A bilingual (EN/ES) home-cooking curriculum that treats the kitchen as a control system.\">\n"
    + style + "\n</head>\n<body>\n" + app + script + "\n</body>\n</html>\n"
)
open(os.path.join(REPO, "index.html"), "w", encoding="utf-8").write(full)
open(os.path.join(BUILD, "artifact_body.html"), "w", encoding="utf-8").write(style + "\n" + app + script + "\n")
print(f"OK  index.html written ({len(full)//1024} KB) · {len(sections)} sections")
