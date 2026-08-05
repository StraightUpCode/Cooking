# Casa Castilla — floor plan

An editable, to-scale plan of the **Casa Castilla** house (Hogares a tu Medida,
km 13 carretera a Masaya): 175 m², 3 bedrooms, 4½ baths, 2 floors. Traced from
the developer brochure — dimensions are approximate until the official
blueprints are available.

## One source, two outputs

```
plan.json ──┬── build_dxf.py  ──► casa-castilla.dxf   (real CAD blueprint)
            │                      casa-castilla.pdf   (printable sheet)
            │                      casa-castilla.png   (raster preview)
            └── build_html.py ──► blueprint.html       (live web viewer)
```

- **`plan.json`** is the single source of truth. Every room, wall, door,
  window and fixture is data, in **metres**. Change a number here and both
  outputs regenerate — which is what makes AI-assisted edits a one-line change
  (e.g. *"make the kitchen island 2.4 m"*).
- **`casa-castilla.dxf`** is a genuine CAD file (built with the
  [`ezdxf`](https://ezdxf.mozman.at) library). Open it in **LibreCAD** (free),
  AutoCAD, QCAD, etc. Layers follow AIA-ish names (`A-WALL`, `A-DOOR`,
  `A-GLAZ`, `A-KITCHEN`, `A-ANNO-TEXT`, …).
- **`blueprint.html`** is a self-contained viewer (drafting-vellum / blueprint
  themes, room inspector, DXF + PDF download buttons). It uses SVG.js only as
  the on-screen drawing engine — the *blueprint* is the DXF.

## Rebuild

```bash
pip install ezdxf matplotlib
python3 build_dxf.py     # plan.json -> dxf / pdf / png
python3 build_html.py    # plan.json + dxf + pdf -> blueprint.html
```

## Data model (`plan.json`)

```
floors.<ground|upper>:
  size      {w, h}                       building envelope (m)
  outline   [[x,y], …]                   footprint polygon
  walls     [orient, a, b, c, kind]      'h'|'v', coords, 'e'(xterior)|'i'(nterior)
  openings  {w, at, a, b, t, hinge, n}   doors (swing) & windows, cut into walls
  rooms     {n, cx, cy, poly|area, t}    label + area; t = open|room|wet|k|stair|out|roof
  fixtures  {s, x, y, w, h, k}           furniture/plumbing symbol; k=1 → kitchen
```

> This is a 2D architectural plan, not full construction documents (no
> structural / electrical / plumbing engineering). Take the DXF to a draftsman
> or architect to develop further.
