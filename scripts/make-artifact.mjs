#!/usr/bin/env node
/**
 * Folds the artifact build (dist-artifact/app.js + app.css) into one HTML
 * fragment: <style>, the mount point, and an inline module script.
 *
 * The fragment form matches what the Artifact tool wraps in a document
 * skeleton, so there is no <html>/<head>/<body> here.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "dist-artifact");
const OUT = join(DIR, "artifact.html");

const jsPath = join(DIR, "app.js");
const cssPath = join(DIR, "app.css");
if (!existsSync(jsPath) || !existsSync(cssPath)) {
  console.error("Missing dist-artifact/app.js or app.css — run the artifact vite build first.");
  process.exit(1);
}

const css = readFileSync(cssPath, "utf8");
let js = readFileSync(jsPath, "utf8");

// Inline <script> content must not be able to close its own tag or open an
// HTML comment, whatever strings the bundled content happens to contain.
js = js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");

const html = `<style>\n${css}\n</style>\n<div id="root"></div>\n<script type="module">\n${js}\n</script>\n`;

// Guard rails: a fragment, and nothing that reaches off the page.
const problems = [];
if (/<(html|head|body)\b/i.test(html.replace(js, ""))) problems.push("document tags in fragment");
if (/(src|href)\s*=\s*["']https?:/i.test(html.replace(js, ""))) problems.push("remote reference");
if (/@import/.test(css)) problems.push("@import left in css");
if (problems.length) {
  console.error("Artifact problems:", problems.join("; "));
  process.exit(1);
}

writeFileSync(OUT, html, "utf8");
console.log(`artifact: ${(html.length / 1024).toFixed(0)} KB  ->  ${OUT}`);
