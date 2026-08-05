#!/usr/bin/env python3
"""
Casa Castilla — CAD blueprint generator.

Reads plan.json (the single source of truth, in metres) and emits a real
DXF file with proper CAD layers, plus a rendered PDF/PNG preview.

    python3 build_dxf.py

Output (next to this script):
    casa-castilla.dxf   — open in LibreCAD (free), AutoCAD, QCAD, etc.
    casa-castilla.pdf    — printable blueprint sheet
    casa-castilla.png    — quick raster preview

DXF is drawn in millimetres (architectural convention). Layers:
    A-WALL, A-WALL-PATT (poche), A-DOOR, A-GLAZ (windows),
    A-FLOR-FIXT (fixtures), I-FURN (furniture), A-ROOF,
    A-ANNO-TEXT (labels), A-ANNO-DIMS (dimensions).
"""
import json, math, os
import ezdxf
from ezdxf.enums import TextEntityAlignment

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = json.load(open(os.path.join(HERE, "plan.json"), encoding="utf-8"))

MM = 1000.0            # metres -> millimetres
T_EXT, T_INT = 0.22, 0.13   # wall thickness (m)
GAP = 3.0              # gap between the two floor drawings (m)

# aci colours
LAYERS = {
    "A-WALL":       (7,  "Continuous"),
    "A-WALL-PATT":  (8,  "Continuous"),
    "A-DOOR":       (3,  "Continuous"),
    "A-GLAZ":       (4,  "Continuous"),
    "A-FLOR-FIXT":  (5,  "Continuous"),
    "I-FURN":       (9,  "Continuous"),
    "A-ROOF":       (1,  "Continuous"),
    "A-ANNO-TEXT":  (7,  "Continuous"),
    "A-ANNO-DIMS":  (2,  "Continuous"),
    "A-KITCHEN":    (30, "Continuous"),  # orange-ish
    "A-SITE":       (8,  "DASHED"),      # cochera / site outline
    "M-GAS":        (2,  "Continuous"),  # gas tank (yellow)
    "P-CIST":       (4,  "DASHED"),      # water cistern (buried, dashed)
    "E-PANEL":      (1,  "Continuous"),  # electric panel
}

doc = ezdxf.new("R2010", setup=True)
doc.units = ezdxf.units.MM
msp = doc.modelspace()
for name, (color, lt) in LAYERS.items():
    if name not in doc.layers:
        doc.layers.add(name, color=color, linetype=lt)


def make_tx(floor, ox_m):
    """Return a transform metres(plan, y-down) -> mm(CAD, y-up), offset by ox_m."""
    H = floor["size"]["h"]
    def tx(x, y):
        return ((x + ox_m) * MM, (H - y) * MM)
    return tx


def add_poly(points, layer, closed=True):
    msp.add_lwpolyline(points, close=closed, dxfattribs={"layer": layer})


def wall_rect(w):
    """Poche rectangle corners (in metres, plan coords) for a wall segment."""
    t = T_EXT if w[4] == "e" else T_INT
    if w[0] == "h":
        x1, x2, y = w[1], w[2], w[3]
        xmin, xmax = min(x1, x2) - t / 2, max(x1, x2) + t / 2
        ymin, ymax = y - t / 2, y + t / 2
    else:
        y1, y2, x = w[2], w[3], w[1]
        ymin, ymax = min(y1, y2) - t / 2, max(y1, y2) + t / 2
        xmin, xmax = x - t / 2, x + t / 2
    return [(xmin, ymin), (xmax, ymin), (xmax, ymax), (xmin, ymax)]


def draw_walls(floor, tx):
    for w in floor["walls"]:
        corners = [tx(px, py) for px, py in wall_rect(w)]
        add_poly(corners, "A-WALL", closed=True)
        # poche solid fill
        h = msp.add_hatch(color=8, dxfattribs={"layer": "A-WALL-PATT"})
        h.paths.add_polyline_path(corners, is_closed=True)


def draw_opening(o, tx):
    isH = o["w"] == "h"
    a, b, at = o["a"], o["b"], o["at"]
    if o["t"] == "window":
        # three parallel glazing lines across the cut
        offs = [0.0, T_EXT / 2 * 0.7, -T_EXT / 2 * 0.7]
        for k, off in enumerate(offs):
            if isH:
                p1, p2 = tx(a, at + off), tx(b, at + off)
            else:
                p1, p2 = tx(at + off, a), tx(at + off, b)
            msp.add_line(p1, p2, dxfattribs={"layer": "A-GLAZ"})
    else:
        L = abs(b - a)
        # hinge jamb (hx,hy) and other jamb (ox,oy) in metres
        if isH:
            hy = oy = at
            if o["hinge"] == "a": hx, ox = a, b
            else:                 hx, ox = b, a
        else:
            hx = ox = at
            if o["hinge"] == "a": hy, oy = a, b
            else:                 hy, oy = b, a
        nx, ny = o["n"]
        ex, ey = hx + nx * L, hy + ny * L         # open leaf tip (metres)
        # door leaf
        msp.add_line(tx(hx, hy), tx(ex, ey), dxfattribs={"layer": "A-DOOR"})
        # swing arc: sample from other jamb to leaf tip, centred at hinge
        a0 = math.atan2(oy - hy, ox - hx)
        a1 = math.atan2(ey - hy, ex - hx)
        # choose the +-90deg sweep matching the door normal
        cross = (ox - hx) * (ey - hy) - (oy - hy) * (ex - hx)
        if cross > 0 and a1 < a0: a1 += 2 * math.pi
        if cross < 0 and a1 > a0: a1 -= 2 * math.pi
        pts = []
        N = 14
        for i in range(N + 1):
            ang = a0 + (a1 - a0) * i / N
            pts.append(tx(hx + L * math.cos(ang), hy + L * math.sin(ang)))
        msp.add_lwpolyline(pts, dxfattribs={"layer": "A-DOOR"})


def rect(x, y, w, h, tx, layer):
    add_poly([tx(x, y), tx(x + w, y), tx(x + w, y + h), tx(x, y + h)], layer, True)


def circle(cx, cy, r, tx, layer):
    msp.add_circle(tx(cx, cy), r * MM, dxfattribs={"layer": layer})


def line(x1, y1, x2, y2, tx, layer):
    msp.add_line(tx(x1, y1), tx(x2, y2), dxfattribs={"layer": layer})


def draw_fixture(f, tx):
    x, y, w, h = f["x"], f["y"], f.get("w", 0.4), f.get("h", 0.4)
    L = "A-KITCHEN" if f.get("k") else "I-FURN"
    s = f["s"]
    if s == "bed":
        rect(x, y, w, h, tx, L); rect(x + 0.05, y + 0.05, w - 0.1, h * 0.28, tx, L)
    elif s == "sofa":
        rect(x, y, w, h, tx, L); rect(x, y, w * 0.25, h, tx, L); rect(x + w * 0.75, y, w * 0.25, h, tx, L)
    elif s in ("chair", "bench", "table"):
        rect(x, y, w, h, tx, L)
    elif s == "dining":
        rect(x, y, w, h, tx, L)
        for i in range(3):
            rect(x - 0.42, y + 0.2 + i * 0.72, 0.34, 0.34, tx, L)
            rect(x + w + 0.08, y + 0.2 + i * 0.72, 0.34, 0.34, tx, L)
    elif s == "counter":
        rect(x, y, w, h, tx, L)
    elif s == "island":
        rect(x, y, w, h, tx, L)
        for i in range(3):
            circle(x - 0.25, y + 0.32 + i * 0.58, 0.17, tx, L)
    elif s == "sink":
        rect(x, y, w, h, tx, L); circle(x + w / 2, y + h / 2, min(w, h) * 0.25, tx, L)
    elif s == "range":
        rect(x, y, w, h, tx, L)
        for px, py in ((0.3, 0.3), (0.7, 0.3), (0.3, 0.7), (0.7, 0.7)):
            circle(x + w * px, y + h * py, w * 0.13, tx, L)
    elif s == "fridge":
        rect(x, y, w, h, tx, L); line(x, y + h * 0.55, x + w, y + h * 0.55, tx, L)
    elif s == "appliance":
        rect(x, y, w, h, tx, L); circle(x + w / 2, y + h / 2, min(w, h) * 0.28, tx, L)
    elif s == "toilet":
        # tank + bowl
        rect(x + w * 0.1, y, w * 0.8, h * 0.34, tx, L)
        msp.add_ellipse(tx(x + w / 2, y + h * 0.68), major_axis=(w / 2 * MM, 0),
                        ratio=0.72, dxfattribs={"layer": L})
    elif s == "shower":
        rect(x, y, w, h, tx, L)
        line(x, y, x + w, y + h, tx, L); line(x + w, y, x, y + h, tx, L)
    elif s == "car":
        add_poly([tx(x + w * 0.42, y), tx(x + w * 0.58, y), tx(x + w, y + h * 0.42),
                  tx(x + w, y + h * 0.58), tx(x + w * 0.58, y + h), tx(x + w * 0.42, y + h),
                  tx(x, y + h * 0.58), tx(x, y + h * 0.42)], L, True)
        rect(x + w * 0.14, y + h * 0.30, w * 0.72, h * 0.42, tx, L)
    elif s == "stairs":
        rect(x, y, w, h, tx, L)
        n = 9
        for i in range(1, n):
            line(x, y + h * i / n, x + w, y + h * i / n, tx, L)
        line(x + w / 2, y + h * 0.1, x + w / 2, y + h * 0.9, tx, L)


def poly_area(poly):
    a = 0.0
    for i in range(len(poly)):
        j = (i + 1) % len(poly)
        a += poly[i][0] * poly[j][1] - poly[j][0] * poly[i][1]
    return abs(a) / 2


def draw_rooms(floor, tx):
    for r in floor["rooms"]:
        area = r.get("area", poly_area(r["poly"]) if "poly" in r else 0)
        p = tx(r["cx"], r["cy"])
        layer = "A-KITCHEN" if r["t"] == "k" else "A-ANNO-TEXT"
        msp.add_text(r["n"], height=180, dxfattribs={"layer": layer}).set_placement(
            (p[0], p[1] + 130), align=TextEntityAlignment.MIDDLE_CENTER)
        msp.add_text(f"{area:.1f} m2", height=110,
                     dxfattribs={"layer": "A-ANNO-TEXT", "color": 8}).set_placement(
            (p[0], p[1] - 120), align=TextEntityAlignment.MIDDLE_CENTER)


def draw_roof(floor, tx):
    if "roof" not in floor:
        return
    corners = [tx(px, py) for px, py in floor["roof"]]
    add_poly(corners, "A-ROOF", True)
    h = msp.add_hatch(color=1, dxfattribs={"layer": "A-ROOF"})
    h.set_pattern_fill("ANSI31", scale=40)
    h.paths.add_polyline_path(corners, is_closed=True)


def draw_dims(floor, tx, ox_m):
    """Overall width + height dimensions using real DXF dimension entities."""
    W, H = floor["size"]["w"], floor["size"]["h"]
    dimstyle = "EZDXF"
    try:
        # width along the bottom
        d = msp.add_linear_dim(
            base=tx((W) / 2, H + 1.1),
            p1=tx(0, H), p2=tx(W, H),
            dimstyle=dimstyle,
            override={"dimscl": 40, "dimtxt": 2.5},
            dxfattribs={"layer": "A-ANNO-DIMS"})
        d.render()
        d2 = msp.add_linear_dim(
            base=tx(-1.1, H / 2), angle=90,
            p1=tx(0, 0), p2=tx(0, H),
            dimstyle=dimstyle,
            override={"dimscl": 40, "dimtxt": 2.5},
            dxfattribs={"layer": "A-ANNO-DIMS"})
        d2.render()
    except Exception as e:
        # fallback: plain text
        msp.add_text(f"{W:.1f} m", height=180, dxfattribs={"layer": "A-ANNO-DIMS"}).set_placement(
            tx(W / 2, H + 1.0), align=TextEntityAlignment.MIDDLE_CENTER)


def title(floor_key, floor, ox_m, tx):
    W = floor["size"]["w"]
    label = {"ground": "PRIMERA PLANTA", "upper": "SEGUNDA PLANTA"}[floor_key]
    msp.add_text(label, height=300, dxfattribs={"layer": "A-ANNO-TEXT"}).set_placement(
        ((ox_m) * MM, -0.9 * MM), align=TextEntityAlignment.LEFT)


def draw_exterior(floor, tx):
    ext = floor.get("exterior")
    if not ext:
        return
    # cochera outline + label
    if "cochera" in ext:
        c = ext["cochera"]
        corners = [tx(px, py) for px, py in c["poly"]]
        add_poly(corners, "A-SITE", True)
        bx = [q[0] for q in c["poly"]]; by = [q[1] for q in c["poly"]]
        cx = min(bx) + (max(bx) - min(bx)) * 0.82
        cy = min(by) + (max(by) - min(by)) * 0.82
        p = tx(cx, cy)
        msp.add_text(f"{c['label']}", height=200, dxfattribs={"layer": "A-SITE"}).set_placement(
            (p[0], p[1] + 140), align=TextEntityAlignment.MIDDLE_CENTER)
        msp.add_text(f"{c['area']:.1f} m2", height=130,
                     dxfattribs={"layer": "A-SITE"}).set_placement(
            (p[0], p[1] - 130), align=TextEntityAlignment.MIDDLE_CENTER)
    for u in ext.get("utilities", []):
        if u["kind"] == "gas":
            L = "M-GAS"
            circle(u["x"], u["y"], u["r"], tx, L)
            circle(u["x"], u["y"], u["r"] * 0.6, tx, L)
        elif u["kind"] == "cistern":
            L = "P-CIST"
            corners = [tx(px, py) for px, py in u["poly"]]
            add_poly(corners, L, True)
            # water waves
            xs = [p[0] for p in u["poly"]]; ys = [p[1] for p in u["poly"]]
            x0, x1 = min(xs), max(xs); y0, y1 = min(ys), max(ys)
            for i in range(1, 4):
                yy = y0 + (y1 - y0) * i / 4
                pts = []
                N = 24
                for k in range(N + 1):
                    xx = x0 + (x1 - x0) * k / N
                    pts.append(tx(xx, yy + 0.08 * math.sin(k / N * 6 * math.pi)))
                msp.add_lwpolyline(pts, dxfattribs={"layer": L})
        elif u["kind"] == "panel":
            L = "E-PANEL"
            circle(u["x"], u["y"], 0.16, tx, L)
        # utility label
        lx = u["x"] if "x" in u else (min(p[0] for p in u["poly"]) + max(p[0] for p in u["poly"])) / 2
        ly = (u["y"] + u.get("r", 0.3) + 0.35) if "y" in u else (max(p[1] for p in u["poly"]) + 0.45)
        p = tx(lx, ly)
        msp.add_text(u["label"], height=130, dxfattribs={"layer": L}).set_placement(
            (p[0], p[1]), align=TextEntityAlignment.MIDDLE_CENTER)
    for nn in ext.get("notes", []):
        p = tx(nn["x"], nn["y"])
        msp.add_text(nn["text"], height=150, dxfattribs={"layer": "A-ANNO-TEXT", "color": 30}).set_placement(
            (p[0], p[1]), align=TextEntityAlignment.MIDDLE_CENTER)


def draw_floor(key, floor, ox_m):
    tx = make_tx(floor, ox_m)
    draw_roof(floor, tx)
    draw_exterior(floor, tx)
    draw_walls(floor, tx)
    for o in floor["openings"]:
        draw_opening(o, tx)
    for f in floor["fixtures"]:
        draw_fixture(f, tx)
    draw_rooms(floor, tx)
    draw_dims(floor, tx, ox_m)
    title(key, floor, ox_m, tx)


# --- build both floors side by side ---
gw = PLAN["floors"]["ground"]["size"]["w"]
draw_floor("ground", PLAN["floors"]["ground"], 0.0)
draw_floor("upper", PLAN["floors"]["upper"], gw + GAP)

# sheet title
msp.add_text("CASA CASTILLA  ·  175 m2  ·  3 dorm  ·  4.5 banos  ·  escala 1:100",
             height=340, dxfattribs={"layer": "A-ANNO-TEXT"}).set_placement(
    (0, PLAN["floors"]["ground"]["size"]["h"] * MM + 1.4 * MM),
    align=TextEntityAlignment.LEFT)
msp.add_text(PLAN["meta"]["note"], height=160,
             dxfattribs={"layer": "A-ANNO-TEXT", "color": 8}).set_placement(
    (0, PLAN["floors"]["ground"]["size"]["h"] * MM + 0.9 * MM),
    align=TextEntityAlignment.LEFT)

out_dxf = os.path.join(HERE, "casa-castilla.dxf")
doc.saveas(out_dxf)

# audit
auditor = doc.audit()
print(f"DXF written: {out_dxf}")
print(f"Audit — errors: {len(auditor.errors)}, fixes: {len(auditor.fixes)}")

# render preview PNG + PDF via ezdxf's matplotlib backend
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from ezdxf.addons.drawing import RenderContext, Frontend
    from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
    from ezdxf.addons.drawing.config import Configuration

    fig = plt.figure(figsize=(16, 12))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_axis_off()
    ctx = RenderContext(doc)
    Frontend(ctx, MatplotlibBackend(ax)).draw_layout(msp, finalize=True)
    fig.savefig(os.path.join(HERE, "casa-castilla.png"), dpi=120, facecolor="white")
    fig.savefig(os.path.join(HERE, "casa-castilla.pdf"), facecolor="white")
    print("Preview PNG + PDF written")
except Exception as e:
    print("Render skipped:", e)
