# SHARED SPEC — "The Kitchen Lab Manual"

You are writing ONE lesson page for a home-cooking curriculum built for a learner
whose motto is **"Engineer first, craftsman second."** He came from precision coffee.
He wants to understand the *system* (mechanisms, variables, trade-offs), see what good
looks like, then build skill through repetition. He hates rote recipes and rote theory.

Your output is a single **HTML fragment** that slots into a shared single-page app.
The shell already provides the `<style>`, the sidebar nav, and a JS router. You ONLY
write the `<section class="lesson" id="LESSON_ID">…</section>` block.

## HARD RULES (do not break)
1. Output ONLY the `<section class="lesson" id="…">…</section>` fragment. No `<html>`,
   `<head>`, `<body>`, no `<style>` block, no markdown fences. Just the section markup.
2. Use ONLY the CSS classes listed below + occasional inline `style="…"` for one-offs.
   Do NOT invent new class names that need CSS you can't provide.
3. NO external resources of any kind: no `<img src>` to the web, no web fonts, no CDN,
   no `<link>`, no remote `<script>`. Diagrams must be inline **SVG** you hand-author,
   or CSS/HTML. (SVG should use `currentColor` or the palette hex values so it themes.)
4. NEVER fabricate URLs. For videos/books/images, give **real creator/book names +
   search terms**, not links. (See resource classes.)
5. If you include a `<script>`, it must be a single self-contained IIFE using IDs
   prefixed with your lesson id (e.g. `id="m3-calc"`), touching only its own elements,
   with no globals and no external deps. Keep interactive demos small and optional.
6. Every heading uses the provided classes. Keep prose in `<p>` (serif body).
7. Reading column is ~68ch — write real, specific, mechanism-rich content. No lorem,
   no filler, no "in this lesson we will." Get straight to substance.

## PALETTE (for inline SVG / style only)
ink #191c1d · ember (heat) #c2481d · probe (temperature) #1f7982 · good #2f7d57 ·
warn #b6851f · crit #bb3a2c · line #cdc9be · panel #faf9f5. Prefer `currentColor` in SVG.

## VOICE
Explain WHY it works, WHAT variables matter, WHAT beginners get wrong, and WHAT
separates mediocre from excellent. Use analogies (esp. coffee/engineering ones).
Treat mistakes as data. Concrete numbers (temps in °C **and** °F, %, ratios, minutes).
Confident, dry, precise. British-neutral spelling is fine. No emoji.

## CLASS VOCABULARY (all styled by the shell)

### Page skeleton
```
<section class="lesson" id="LESSON_ID">
  <header class="lesson-head">
    <p class="eyebrow">MODULE 0 · PHASE 0</p>
    <h1>Lesson Title</h1>
    <p class="lede">One-sentence thesis of the whole lesson.</p>
    <div class="kicker-row">
      <span class="tag ember">~2 weeks</span>
      <span class="tag">4 core skills</span>
      <span class="tag probe">Precision: high</span>
    </div>
  </header>
  … sections …
  <nav class="pager">
    <a class="prev" href="#PREV_ID"><span class="d">Previous</span>Prev title</a>
    <a class="next" href="#NEXT_ID"><span class="d">Next</span>Next title</a>
  </nav>
</section>
```
(Leave the pager links to the ids you're told are prev/next. If none, omit that link.)

### Section header (datasheet divider)
```
<section class="section">
  <div class="h-sec"><span class="idx">01</span><h2>Why this matters</h2></div>
  <p>…</p>
</section>
```

### Callouts (use for the mechanism "aha" moments)
```
<div class="callout callout--why"><span class="lbl">Why it works</span><p>…</p></div>
<div class="callout callout--heat"><span class="lbl">Variable that matters</span><p>…</p></div>
<div class="callout callout--mistake"><span class="lbl">What beginners get wrong</span><p>…</p></div>
<div class="callout callout--pro"><span class="lbl">Mediocre → Excellent</span><p>…</p></div>
```

### Spec / datasheet panel (tools, target numbers, "at a glance")
```
<div class="spec">
  <div class="spec-h">Target parameters</div>
  <div class="spec-row"><span class="spec-key">Internal temp</span><span class="spec-val">74 °C / 165 °F breast · 88 °C / 190 °F thigh</span></div>
  <div class="spec-row"><span class="spec-key">Rest</span><span class="spec-val">5–10 min, tented</span></div>
</div>
```

### Level bands (organise content into the 4 levels where natural)
```
<div class="level-band"><span class="tag level--1"><b>L1</b> Functional</span><span class="ln"></span></div>
```
Level tags: `level--1` Functional · `level--2` Consistent · `level--3` Optimization · `level--4` Mastery.
You can also show all four up front:
```
<div class="levels">
  <span class="level level--1"><b>L1</b> — I can do it without failing</span>
  <span class="level level--2"><b>L2</b> — I reproduce good results</span>
  <span class="level level--3"><b>L3</b> — I tune the variables</span>
  <span class="level level--4"><b>L4</b> — I improvise & teach</span>
</div>
```

### Key-concept cards
```
<div class="grid cols-2">
  <div class="card"><h4>Maillard reaction</h4><p><b>What:</b> … <b>Why it matters:</b> … <b>Common mistake:</b> …</p></div>
</div>
```

### Tables (always wrap for horizontal scroll)
```
<div class="table-wrap"><table>
  <thead><tr><th>Cut</th><th class="num">Target °C</th><th>Behaviour</th></tr></thead>
  <tbody><tr><td>Breast</td><td class="num">74</td><td>Lean, dries fast</td></tr></tbody>
</table></div>
```

### Controlled experiment (the signature device — change ONE variable)
```
<div class="exp">
  <div class="exp-h">Controlled experiment · E1</div>
  <dl>
    <dt>Goal</dt><dd>…</dd>
    <dt>Keep constant</dt><dd>…</dd>
    <dt>Change</dt><dd>…</dd>
    <dt>Expected</dt><dd>…</dd>
    <dt>Observe</dt><dd>…</dd>
  </dl>
</div>
```

### Troubleshooting (collapsible; problem→causes→diagnose→fix)
```
<details class="trouble"><summary>Chicken is dry <span class="sig">Fault</span></summary>
  <div class="trouble-body"><dl>
    <dt>Causes</dt><dd>…</dd>
    <dt>Diagnose</dt><dd>…</dd>
    <dt>Fix</dt><dd>…</dd>
  </dl></div>
</details>
```

### Steps (technique breakdown: prep → execution → evaluation → correction)
```
<ol class="steps">
  <li><b>Prep.</b> … (reasoning)</li>
  <li><b>Execute.</b> …</li>
</ol>
```

### Practice drills & projects
```
<div class="drill">
  <div class="drill-h">Practice drill</div>
  <h4>Uniform onion dice</h4>
  <dl>
    <dt>Goal</dt><dd>…</dd><dt>Difficulty</dt><dd>Beginner</dd>
    <dt>Materials</dt><dd>…</dd><dt>Steps</dt><dd>…</dd>
    <dt>Success</dt><dd>…</dd><dt>Failure modes</dt><dd>…</dd><dt>Improve</dt><dd>…</dd>
  </dl>
</div>
<div class="drill drill--project">
  <div class="drill-h">Project · Intermediate</div>
  <h4>Chicken with pan sauce</h4>
  <dl><dt>Objective</dt><dd>…</dd><dt>Skills trained</dt><dd>…</dd>
      <dt>Expected result</dt><dd>…</dd><dt>Evaluation</dt><dd>…</dd></dl>
</div>
```

### Visual-learning / image search
```
<div class="imgsearch"><span class="ic">Search image</span>
  <div><code>perfectly sharpened knife edge microscope</code>
  <p style="margin:.4em 0 0">Look for: consistent bevel, clean apex, no reflective flat.</p></div>
</div>
```

### External resources (NO fake URLs — names + what to search)
```
<div class="resource"><span class="rm">Video · Ethan Chlebowski</span>
  <span class="rt">Search: "how to cook chicken breast juicy"</span>
  <p>Why: shows the temperature-vs-texture relationship with data.</p></div>
<div class="resource"><span class="rm">Book · Intermediate</span>
  <span class="rt">The Food Lab — J. Kenji López-Alt</span>
  <p>Use the poultry chapter for the mechanism behind brining.</p></div>
```

### Inline SVG diagrams
Hand-author simple, legible diagrams (flowcharts, temperature curves, heat maps,
cross-sections, decision trees, timelines). Use `stroke="currentColor"`,
`fill="none"`, palette hexes for accents, and a `<figure><svg …></svg>
<figcaption>…</figcaption></figure>` wrapper. Keep viewBox tidy; text via `<text>`
with `font-family="var(--f-mono)"` or a mono fallback and small font-size.

## REQUIRED CONTENT STRUCTURE (adapt section numbering to fit)
01 Why this matters
02 Mental model (system) — include at least one inline SVG diagram AND one table/visual comparison
03 Key concepts (concept cards: What / Why it matters / Example / Common mistake)
04 Tools & equipment (necessary / optional / waste of money — buying guidance; use a spec panel)
05 Technique breakdown (steps: Preparation → Execution → Evaluation → Correction, with reasoning)
06 Beginner mistakes (troubleshooting: problem → causes → diagnose → fix)
07 Controlled experiments (≥3, change one variable each)
08 Practice system (several repeatable drills with success + failure modes + how to improve)
09 Projects (Beginner / Intermediate / Advanced)
10 Visual learning (image-search blocks; note what to observe)
11 External resources (videos + books; real names, search terms, no fake links)
12 Assessment (Knowledge check = understanding not recall · Practical challenge · Reflection)

Organise 05–09 across the four Levels where it clarifies the progression.
Be generous and specific. This is a reference manual he'll return to for weeks.
