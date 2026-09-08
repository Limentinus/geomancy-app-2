/**
 * Bundle the app into one self-contained HTML file, for hosts that cannot
 * serve ES modules (a single-file preview, an offline copy, an email
 * attachment). The repo itself needs no build step — this is a convenience.
 *
 *   node build-demo.mjs [outfile]
 */

import { readFile, writeFile } from 'node:fs/promises';

const MODULES = ['figures', 'geomancy', 'i18n', 'render', 'main'];
const out = process.argv[2] ?? 'demo.html';

const css = await readFile('css/style.css', 'utf8');

const scripts = [];
for (const name of MODULES) {
  const source = await readFile(`js/${name}.js`, 'utf8');
  scripts.push(
    `/* ── js/${name}.js ─────────────────────────────────────────── */\n` +
      source
        .replace(/^import\s[^\n]*?;\s*$/gm, '')   // module wiring is unnecessary once inlined
        .replace(/^export\s+/gm, '')
        .trim()
  );
}

const html = `<title>Geomantisches Schildbild</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${css}
</style>

<div class="stars" aria-hidden="true"></div>
<header id="header" class="site-header"></header>
<main id="app" class="site-main"></main>
<footer id="footer" class="site-footer"></footer>

<script>
(() => {
${scripts.join('\n\n')}
})();
</script>
`;

await writeFile(out, html);
console.log(`${out} — ${(Buffer.byteLength(html) / 1024).toFixed(1)} kB`);
