#!/usr/bin/env python3
"""Assemble blueprint.html from plan.json + template + vendored SVG.js + CAD files.

    python3 build_dxf.py    # first: regenerate casa-castilla.dxf/.pdf from plan.json
    python3 build_html.py   # then:  embed everything into blueprint.html
"""
import base64, os
HERE = os.path.dirname(os.path.abspath(__file__))
r = lambda *p: open(os.path.join(HERE, *p), encoding="utf-8").read()
b64 = lambda *p: base64.b64encode(open(os.path.join(HERE, *p), "rb").read()).decode()

plan = r("plan.json")
svg = r("src", "svg.min.js")
tpl = r("src", "template.html")
dxf_b64 = b64("casa-castilla.dxf")
pdf_b64 = b64("casa-castilla.pdf")

inject = (
    "<script>\n"
    f"window.PLAN = {plan};\n"
    f'window.__DXF_B64__ = "{dxf_b64}";\n'
    f'window.__PDF_B64__ = "{pdf_b64}";\n'
    "</script>\n"
    f"<script>{svg}</script>"
)
out = tpl.replace("<!--SVGJS-->", inject)
open(os.path.join(HERE, "blueprint.html"), "w", encoding="utf-8").write(out)
print(f"blueprint.html written: {len(out)} bytes "
      f"(dxf {len(dxf_b64)//1024} KB b64, pdf {len(pdf_b64)//1024} KB b64)")
