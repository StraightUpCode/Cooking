#!/usr/bin/env node
/**
 * Content migration: legacy HTML fragments -> structured curriculum content.
 *
 * Reads the v1 lesson fragments (build/lessons for English, build/lessons_es for
 * Spanish) and emits one JSON document per module per language, plus a search
 * index and a manifest.
 *
 * The important invariants:
 *
 *  - Stable IDs come from the ENGLISH structure and are reused for Spanish by
 *    positional pairing, so progress is shared between languages.
 *  - Nothing is summarised or rewritten. Prose is carried across verbatim as
 *    HTML; only the surrounding structure is lifted into typed blocks.
 *  - The script verifies text volume against the source and fails loudly if a
 *    module loses content or if the two languages disagree structurally.
 *
 * Usage: node scripts/migrate.mjs [--check]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_EN = join(ROOT, "build", "lessons");
const SRC_ES = join(ROOT, "build", "lessons_es");
const OUT = join(ROOT, "src", "content", "modules");

const CHECK_ONLY = process.argv.includes("--check");

/** Module order and metadata. Language-independent by design. */
const MODULES = [
  { file: "lesson_p0", id: "p0", slug: "kitchen-foundation", phase: 0, order: 0, level: "foundation" },
  { file: "lesson_m1", id: "m1", slug: "proteins", phase: 1, order: 1, level: "core" },
  { file: "lesson_m2", id: "m2", slug: "rice-beans-grains", phase: 1, order: 2, level: "core" },
  { file: "lesson_m3", id: "m3", slug: "sauces-flavour", phase: 2, order: 3, level: "core" },
  { file: "lesson_m4", id: "m4", slug: "vegetables", phase: 2, order: 4, level: "core" },
  { file: "lesson_m5", id: "m5", slug: "bread-dough", phase: 3, order: 5, level: "applied" },
  { file: "lesson_m6", id: "m6", slug: "fermentation", phase: 3, order: 6, level: "applied" },
  { file: "lesson_m7", id: "m7", slug: "meat-fire", phase: 4, order: 7, level: "applied" },
  { file: "lesson_m8", id: "m8", slug: "restaurant-projects", phase: 4, order: 8, level: "capstone" },
];

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const txt = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
const inner = (el) => (el ? el.innerHTML.trim() : "");

/**
 * Visible text of an HTML string, with a space forced at every tag boundary so
 * adjacent elements (`<dt>Goal</dt><dd>A bowl…`) don't fuse into "GoalA".
 */
function visibleText(html) {
  return String(html ?? "")
    .replace(/</g, " <")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The search index is fetched on demand over a phone connection, so each
 * document carries a bounded slice of its text. Titles and opening prose are
 * where matches overwhelmingly land; indexing every word of every lesson
 * quadruples the payload for a marginal recall gain.
 */
const INDEX_CHARS = 600;
function indexText(s) {
  const clean = String(s ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  return clean.length > INDEX_CHARS ? clean.slice(0, INDEX_CHARS) : clean;
}

/**
 * Word tokens, punctuation-insensitive. Captured strings come from
 * `textContent` (where `<em>x</em>.` is one token) while source HTML is split at
 * tag boundaries (two tokens), so punctuation must not participate.
 */
function tokens(html) {
  return visibleText(html)
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}°%]+/gu, ""))
    .filter(Boolean);
}

function wordCount(html) {
  return tokens(html).length;
}

/** Every string carried into the structured output, for integrity checking. */
function capturedStrings(content) {
  const out = [content.eyebrow, content.title, content.lede, ...content.tags];
  for (const s of content.sections) {
    out.push(s.index, s.title);
    for (const b of s.blocks) {
      switch (b.kind) {
        case "prose":
        case "raw":
          out.push(b.html);
          break;
        case "callout":
          out.push(b.label, b.html);
          break;
        case "spec":
          out.push(b.title, ...b.rows.flatMap((r) => [r.key, r.value]));
          break;
        case "table":
          out.push(...b.head, ...b.rows.flat());
          break;
        case "figure":
          out.push(b.caption, b.svg);
          break;
        case "cards":
          out.push(...b.items.flatMap((i) => [i.title, i.html]));
          break;
        case "experiment":
          out.push(b.title, ...b.fields.flatMap((f) => [f.term, f.detail]));
          break;
        case "drill":
          out.push(b.eyebrow, b.title, ...b.fields.flatMap((f) => [f.term, f.detail]));
          break;
        case "troubleshoot":
          out.push(b.problem, b.signal, ...b.fields.flatMap((f) => [f.term, f.detail]));
          break;
        case "knowledgeCheck":
          out.push(...b.questions);
          break;
        case "imageSearch":
          out.push(b.query, b.look);
          break;
        case "resource":
          out.push(b.meta, b.title, b.why);
          break;
        case "levelBand":
          out.push(b.label);
          break;
        case "levels":
          out.push(...b.items.map((i) => i.label));
          break;
        default:
          break;
      }
    }
  }
  return out.join(" ");
}

/**
 * Chrome that lives in the legacy markup but is deliberately not carried into
 * the content layer — the app re-renders it from the UI/i18n layer.
 * The pager is stripped structurally below; this covers inline labels.
 */
const CHROME_TOKENS = new Set(["search", "image", "buscar", "imagen"]);

/**
 * Compare source tokens against captured tokens as multisets and return the
 * tokens that genuinely went missing.
 */
function missingTokens(sourceHtml, content) {
  // Prev/next navigation is regenerated from the module manifest, so its link
  // text (sibling module titles) is not expected in the content layer.
  const body = sourceHtml.replace(/<nav class="pager"[\s\S]*?<\/nav>/gi, " ");

  const have = new Map();
  for (const t of tokens(capturedStrings(content))) have.set(t, (have.get(t) ?? 0) + 1);
  const missing = [];
  for (const t of tokens(body)) {
    const n = have.get(t) ?? 0;
    if (n > 0) have.set(t, n - 1);
    else if (!CHROME_TOKENS.has(t)) missing.push(t);
  }
  return missing;
}

/** Read a `<dl>` into ordered term/detail pairs. */
function readDefinitionList(dl) {
  if (!dl) return [];
  const out = [];
  let term = null;
  for (const child of dl.childNodes) {
    if (child.nodeType !== 1) continue;
    const tag = child.rawTagName?.toLowerCase();
    if (tag === "dt") term = txt(child);
    else if (tag === "dd") {
      out.push({ term: term ?? "", detail: inner(child) });
      term = null;
    }
  }
  return out;
}

function calloutVariant(classList) {
  for (const v of ["why", "heat", "mistake", "pro"]) {
    if (classList.includes(`callout--${v}`)) return v;
  }
  return "plain";
}

function levelFromClass(classList) {
  const m = classList.match(/level--(\d)/);
  return m ? Number(m[1]) : 1;
}

/* ------------------------------------------------------------------ *
 * Block extraction
 * ------------------------------------------------------------------ */

/**
 * Convert one direct child element of a section into a typed block.
 * Anything unrecognised is preserved verbatim as a `raw` block, so no authored
 * markup can ever be silently dropped.
 */
function toBlock(el, ids) {
  const tag = el.rawTagName?.toLowerCase();
  const cls = el.getAttribute("class") ?? "";

  if (tag === "p" || tag === "ul" || tag === "ol" || tag === "h3" || tag === "h4") {
    if (!txt(el)) return null;
    return { kind: "prose", html: el.outerHTML.trim() };
  }

  if (cls.includes("callout")) {
    const label = txt(el.querySelector(".lbl"));
    const clone = parse(el.innerHTML);
    clone.querySelectorAll(".lbl").forEach((n) => n.remove());
    return { kind: "callout", variant: calloutVariant(cls), label, html: clone.innerHTML.trim() };
  }

  if (cls.includes("spec")) {
    const rows = el.querySelectorAll(".spec-row").map((r) => ({
      key: txt(r.querySelector(".spec-key")),
      value: inner(r.querySelector(".spec-val")),
    }));
    return { kind: "spec", title: txt(el.querySelector(".spec-h")), rows };
  }

  if (cls.includes("table-wrap")) {
    const table = el.querySelector("table");
    if (!table) return { kind: "raw", html: el.outerHTML.trim() };
    const head = table.querySelectorAll("thead th").map((th) => inner(th));
    const rows = table
      .querySelectorAll("tbody tr")
      .map((tr) => tr.querySelectorAll("td, th").map((td) => inner(td)));
    return { kind: "table", head, rows };
  }

  if (tag === "figure") {
    const svg = el.querySelector("svg");
    return {
      kind: "figure",
      svg: svg ? svg.outerHTML.trim() : "",
      caption: txt(el.querySelector("figcaption")),
    };
  }

  if (cls.includes("grid")) {
    const cards = el.querySelectorAll(".card");
    if (cards.length) {
      return {
        kind: "cards",
        items: cards.map((c) => {
          const clone = parse(c.innerHTML);
          const h = clone.querySelector("h4") ?? clone.querySelector("h3");
          const title = txt(h);
          h?.remove();
          return { title, html: clone.innerHTML.trim() };
        }),
      };
    }
    return { kind: "raw", html: el.outerHTML.trim() };
  }

  if (cls.includes("exp")) {
    const title = txt(el.querySelector(".exp-h"));
    return {
      kind: "experiment",
      id: ids.next("e"),
      title,
      fields: readDefinitionList(el.querySelector("dl")),
    };
  }

  if (cls.includes("drill")) {
    const isProject = cls.includes("drill--project");
    return {
      kind: "drill",
      id: ids.next(isProject ? "p" : "d"),
      variant: isProject ? "project" : "drill",
      eyebrow: txt(el.querySelector(".drill-h")),
      title: txt(el.querySelector("h4")),
      fields: readDefinitionList(el.querySelector("dl")),
    };
  }

  if (cls.includes("trouble")) {
    const summary = el.querySelector("summary");
    const sig = summary?.querySelector(".sig");
    const sigText = txt(sig);
    sig?.remove();
    return {
      kind: "troubleshoot",
      id: ids.next("t"),
      problem: txt(summary),
      signal: sigText,
      fields: readDefinitionList(el.querySelector("dl")),
    };
  }

  if (cls.includes("check")) {
    return {
      kind: "knowledgeCheck",
      id: ids.next("k"),
      questions: el.querySelectorAll(".q").map((q) => inner(q.querySelector("p") ?? q)),
    };
  }

  if (cls.includes("imgsearch")) {
    const code = el.querySelector("code");
    const look = el.querySelector("p");
    return { kind: "imageSearch", query: txt(code), look: txt(look) };
  }

  if (cls.includes("resource")) {
    return {
      kind: "resource",
      meta: txt(el.querySelector(".rm")),
      title: txt(el.querySelector(".rt")),
      why: txt(el.querySelector("p")),
    };
  }

  if (cls.includes("level-band")) {
    const tag2 = el.querySelector(".tag, .level");
    return {
      kind: "levelBand",
      level: levelFromClass(tag2?.getAttribute("class") ?? ""),
      label: txt(tag2),
    };
  }

  if (cls.includes("levels")) {
    return {
      kind: "levels",
      items: el.querySelectorAll(".level").map((l) => ({
        level: levelFromClass(l.getAttribute("class") ?? ""),
        label: txt(l),
      })),
    };
  }

  if (tag === "hr") return null;

  return { kind: "raw", html: el.outerHTML.trim() };
}

/** Sequential, deterministic ID generator scoped to a module. */
function makeIds(moduleId) {
  const counters = {};
  return {
    next(prefix) {
      counters[prefix] = (counters[prefix] ?? 0) + 1;
      return `${moduleId}.${prefix}${String(counters[prefix]).padStart(2, "0")}`;
    },
  };
}

/** Parse one lesson fragment into a ModuleContent-shaped object. */
function parseLesson(html, moduleId) {
  const root = parse(html);
  const lesson = root.querySelector("section.lesson") ?? root;
  const head = lesson.querySelector(".lesson-head");

  const content = {
    eyebrow: txt(head?.querySelector(".eyebrow")),
    title: txt(head?.querySelector("h1")),
    lede: txt(head?.querySelector(".lede")),
    tags: (head?.querySelectorAll(".kicker-row .tag") ?? []).map((t) => txt(t)),
    sections: [],
  };

  const ids = makeIds(moduleId);
  const sections = lesson.querySelectorAll("section.section");

  sections.forEach((sec, i) => {
    const hsec = sec.querySelector(".h-sec");
    const index = txt(hsec?.querySelector(".idx"));
    const title = txt(hsec?.querySelector("h2"));
    const blocks = [];

    for (const child of sec.childNodes) {
      if (child.nodeType !== 1) continue;
      const cls = child.getAttribute?.("class") ?? "";
      if (cls.includes("h-sec")) continue; // becomes the section heading
      const block = toBlock(child, ids);
      if (block) blocks.push(block);
    }

    content.sections.push({
      id: `${moduleId}.s${String(i + 1).padStart(2, "0")}`,
      index,
      title,
      blocks,
    });
  });

  return content;
}

/**
 * Re-key a Spanish parse so it shares the English IDs.
 * Pairing is positional: same section order, same block order.
 */
function alignIds(en, es, moduleId) {
  const problems = [];
  if (en.sections.length !== es.sections.length) {
    problems.push(
      `${moduleId}: section count differs (en=${en.sections.length} es=${es.sections.length})`,
    );
  }
  es.sections.forEach((sec, i) => {
    const enSec = en.sections[i];
    if (!enSec) return;
    sec.id = enSec.id;
    if (sec.blocks.length !== enSec.blocks.length) {
      problems.push(
        `${moduleId}/${enSec.id}: block count differs (en=${enSec.blocks.length} es=${sec.blocks.length})`,
      );
      return;
    }
    sec.blocks.forEach((b, j) => {
      const enB = enSec.blocks[j];
      if (!enB) return;
      if (enB.kind !== b.kind) {
        problems.push(`${moduleId}/${enSec.id}[${j}]: kind differs (${enB.kind} vs ${b.kind})`);
        return;
      }
      if ("id" in enB && "id" in b) b.id = enB.id;
    });
  });
  return problems;
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const problems = [];
const manifest = [];
const searchDocs = [];

if (!CHECK_ONLY) mkdirSync(OUT, { recursive: true });

for (const mod of MODULES) {
  const enPath = join(SRC_EN, `${mod.file}.html`);
  const esPath = join(SRC_ES, `${mod.file}.html`);
  if (!existsSync(enPath)) {
    problems.push(`missing English source: ${enPath}`);
    continue;
  }

  const enHtml = readFileSync(enPath, "utf8");
  const en = parseLesson(enHtml, mod.id);

  let es = null;
  if (existsSync(esPath)) {
    es = parseLesson(readFileSync(esPath, "utf8"), mod.id);
    problems.push(...alignIds(en, es, mod.id));
  } else {
    problems.push(`missing Spanish source: ${esPath}`);
  }

  // Content-integrity check: every source token must survive into the content
  // layer (modulo UI chrome that the app re-renders itself).
  const sourceWords = wordCount(enHtml);
  const capturedWords = wordCount(capturedStrings(en));
  const missingEn = missingTokens(enHtml, en);
  if (missingEn.length) {
    problems.push(
      `${mod.id}: ${missingEn.length} source token(s) missing from EN content — e.g. ${missingEn.slice(0, 12).join(" ")}`,
    );
  }
  if (es) {
    const missingEs = missingTokens(readFileSync(esPath, "utf8"), es);
    if (missingEs.length) {
      problems.push(
        `${mod.id}: ${missingEs.length} source token(s) missing from ES content — e.g. ${missingEs.slice(0, 12).join(" ")}`,
      );
    }
  }

  const blockCount = en.sections.reduce((n, s) => n + s.blocks.length, 0);
  const counts = {};
  for (const s of en.sections) for (const b of s.blocks) counts[b.kind] = (counts[b.kind] ?? 0) + 1;

  manifest.push({
    ...mod,
    sections: en.sections.length,
    blocks: blockCount,
    words: capturedWords,
    counts,
    title: { en: en.title, es: es?.title ?? en.title },
  });

  // Search documents: module + each section, both languages.
  searchDocs.push({
    id: mod.id,
    category: "module",
    href: `/module/${mod.slug}`,
    title: { en: en.title, es: es?.title ?? en.title },
    context: { en: "Module", es: "Módulo" },
    text: {
      en: indexText(`${en.title} ${en.lede} ${en.tags.join(" ")}`),
      es: indexText(`${es?.title ?? ""} ${es?.lede ?? ""}`),
    },
  });
  en.sections.forEach((s, i) => {
    const esSec = es?.sections[i];
    searchDocs.push({
      id: s.id,
      category: "section",
      href: `/module/${mod.slug}#${s.id}`,
      title: { en: s.title, es: esSec?.title ?? s.title },
      context: { en: `${en.title} → Section`, es: `${es?.title ?? en.title} → Sección` },
      text: {
        en: indexText(`${s.title} ${s.blocks.map((b) => wordsOf(b)).join(" ")}`),
        es: esSec ? indexText(`${esSec.title} ${esSec.blocks.map((b) => wordsOf(b)).join(" ")}`) : "",
      },
    });
    for (const b of s.blocks) {
      if (b.kind !== "experiment" && b.kind !== "drill") continue;
      const j = s.blocks.indexOf(b);
      const esB = esSec?.blocks[j];
      const category = b.kind === "experiment" ? "experiment" : b.variant;
      searchDocs.push({
        id: b.id,
        category,
        href: `/module/${mod.slug}#${b.id}`,
        title: { en: b.title, es: esB?.title ?? b.title },
        context: { en: `${en.title} → ${label(category, "en")}`, es: `${es?.title ?? en.title} → ${label(category, "es")}` },
        text: {
          en: indexText(`${b.title} ${wordsOf(b)}`),
          es: esB ? indexText(`${esB.title} ${wordsOf(esB)}`) : "",
        },
      });
    }
  });

  if (!CHECK_ONLY) {
    writeFileSync(join(OUT, `${mod.id}.en.json`), JSON.stringify(en), "utf8");
    if (es) writeFileSync(join(OUT, `${mod.id}.es.json`), JSON.stringify(es), "utf8");
  }
}

function wordsOf(block) {
  switch (block.kind) {
    case "prose":
    case "raw":
      return stripTags(block.html);
    case "callout":
      return `${block.label} ${stripTags(block.html)}`;
    case "spec":
      return `${block.title} ${block.rows.map((r) => `${r.key} ${stripTags(r.value)}`).join(" ")}`;
    case "table":
      return `${block.head.join(" ")} ${block.rows.flat().map(stripTags).join(" ")}`;
    case "figure":
      return block.caption;
    case "cards":
      return block.items.map((i) => `${i.title} ${stripTags(i.html)}`).join(" ");
    case "experiment":
      return `${block.title} ${block.fields.map((f) => `${f.term} ${stripTags(f.detail)}`).join(" ")}`;
    case "drill":
      return `${block.eyebrow} ${block.title} ${block.fields.map((f) => `${f.term} ${stripTags(f.detail)}`).join(" ")}`;
    case "troubleshoot":
      return `${block.problem} ${block.fields.map((f) => `${f.term} ${stripTags(f.detail)}`).join(" ")}`;
    case "knowledgeCheck":
      return block.questions.map(stripTags).join(" ");
    case "imageSearch":
      return `${block.query} ${block.look}`;
    case "resource":
      return `${block.meta} ${block.title} ${block.why}`;
    case "levelBand":
      return block.label;
    case "levels":
      return block.items.map((i) => i.label).join(" ");
    default:
      return "";
  }
}

function stripTags(html) {
  return String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function label(category, lang) {
  const map = {
    experiment: { en: "Experiment", es: "Experimento" },
    drill: { en: "Drill", es: "Práctica" },
    project: { en: "Project", es: "Proyecto" },
  };
  return map[category]?.[lang] ?? category;
}

if (!CHECK_ONLY) {
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  writeFileSync(
    join(ROOT, "src", "content", "search-curriculum.json"),
    JSON.stringify(searchDocs),
    "utf8",
  );
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const totalBlocks = manifest.reduce((n, m) => n + m.blocks, 0);
const totalWords = manifest.reduce((n, m) => n + m.words, 0);

console.log("\nModule                     sections  blocks   words");
console.log("---------------------------------------------------");
for (const m of manifest) {
  console.log(
    `${m.id.padEnd(4)} ${m.slug.padEnd(21)} ${String(m.sections).padStart(5)} ${String(m.blocks).padStart(7)} ${String(m.words).padStart(7)}`,
  );
}
console.log("---------------------------------------------------");
console.log(`${"TOTAL".padEnd(26)} ${String(totalBlocks).padStart(7)} ${String(totalWords).padStart(7)}`);

const kinds = {};
for (const m of manifest) for (const [k, v] of Object.entries(m.counts)) kinds[k] = (kinds[k] ?? 0) + v;
console.log("\nBlock kinds:", Object.entries(kinds).map(([k, v]) => `${k}=${v}`).join("  "));
console.log(`Search documents: ${searchDocs.length}`);

if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("\nOK — all modules migrated, both languages aligned, no content loss detected.\n");
