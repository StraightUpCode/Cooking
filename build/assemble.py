#!/usr/bin/env python3
"""Assemble the single-page Kitchen Lab Manual from parts + lesson fragments.
Outputs:
  ../index.html          full standalone document (opens locally / lives in repo)
  artifact_body.html     body-only variant for publishing as an Artifact
Also validates fragments for forbidden external resources.
"""
import os, re, sys

BUILD = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.dirname(BUILD)

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

parts   = os.path.join(BUILD, "parts")
lessons = os.path.join(BUILD, "lessons")

LESSON_ORDER = ["lesson_p0","lesson_m1","lesson_m2","lesson_m3","lesson_m4",
                "lesson_m5","lesson_m6","lesson_m7","lesson_m8"]
TOOL_ORDER = ["tool_doneness","tool_dough","tool_brine","tool_grain"]
tools_dir = os.path.join(BUILD, "tools")

# ---- validation ----
FORBIDDEN = [
    (r'src\s*=\s*["\']https?://', "remote src"),
    (r'href\s*=\s*["\']https?://', "remote href (non-anchor link)"),
    (r'<link\b', "<link> tag"),
    (r'@import', "@import"),
    (r'url\(\s*["\']?https?://', "remote url() in CSS"),
    (r'<script[^>]*\bsrc=', "remote <script src>"),
]
problems = []
missing = []
checklist = [(lessons, LESSON_ORDER), (tools_dir, TOOL_ORDER)]
for base, order in checklist:
    for name in order:
        fp = os.path.join(base, name + ".html")
        if not os.path.exists(fp):
            missing.append(name); continue
        txt = read(fp)
        for pat, label in FORBIDDEN:
            for m in re.finditer(pat, txt, re.I):
                problems.append(f"{name}: {label} -> ...{txt[max(0,m.start()-30):m.start()+40]}...")

if missing:
    print("MISSING FRAGMENTS:", ", ".join(missing))
if problems:
    print("VALIDATION ISSUES:")
    for p in problems:
        print("  -", p)
if missing:
    print("Aborting assembly until all fragments exist.")
    sys.exit(1)

style  = read(os.path.join(parts, "style.html")).strip()
nav    = read(os.path.join(parts, "nav.html")).rstrip()
hub    = read(os.path.join(parts, "hub.html")).rstrip()
script = read(os.path.join(parts, "script.html")).rstrip()
frags  = [read(os.path.join(lessons, n + ".html")).rstrip() for n in LESSON_ORDER]

tools_head = read(os.path.join(parts, "tools_head.html")).rstrip()
tools_tail = read(os.path.join(parts, "tools_tail.html")).rstrip()
widgets    = [read(os.path.join(tools_dir, n + ".html")).rstrip() for n in TOOL_ORDER]
tools_section = tools_head + "\n" + "\n".join(widgets) + "\n" + tools_tail

body_inner = (
    nav + "\n"
    + '    <main class="stage" id="stage">\n'
    + '      <div class="wrap">\n'
    + hub + "\n"
    + tools_section + "\n"
    + "\n".join(frags) + "\n"
    + "      </div>\n"
    + "    </main>\n"
)
app = '  <div class="app">\n' + body_inner + "  </div>\n"

# ---- full standalone document (repo) ----
full = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n"
    "<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
    "<title>The Kitchen Lab Manual — Home Cooking, Engineered</title>\n"
    "<meta name=\"description\" content=\"A home-cooking curriculum that treats the kitchen as a control system: mental models, controlled experiments, and deliberate practice across nine modules.\">\n"
    + style + "\n</head>\n<body>\n"
    + app
    + script + "\n"
    "</body>\n</html>\n"
)
with open(os.path.join(REPO, "index.html"), "w", encoding="utf-8") as f:
    f.write(full)

# ---- artifact body-only variant ----
artifact = style + "\n" + app + script + "\n"
with open(os.path.join(BUILD, "artifact_body.html"), "w", encoding="utf-8") as f:
    f.write(artifact)

kb = len(full)//1024
print(f"OK  index.html written ({kb} KB, {len(frags)} lessons)")
print(f"OK  artifact_body.html written ({len(artifact)//1024} KB)")
