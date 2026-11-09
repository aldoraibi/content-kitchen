// Render a cover folder (cover.html + cover.js) → cover.png, cover-thumb.png (width 180), cover-grid.png (4:5 center crop)
// Usage: node render_cover.mjs <cover-dir>
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let pw;
for (const n of ["playwright", "playwright-core"]) {
  for (const base of ["", process.env.KITCHEN_NODE_MODULES].filter(x => x !== undefined)) {
    try { pw = require(base ? path.join(base, n) : n); break; } catch {}
  }
  if (pw) break;
}
if (!pw) { console.error("Playwright not found. Run: npm i playwright && npx playwright install chromium"); process.exit(2); }

const D = path.resolve(process.argv[2] || ".");
const opts = { args: ["--no-sandbox"] };
if (process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
else if (fs.existsSync("/usr/bin/google-chrome")) opts.executablePath = "/usr/bin/google-chrome";
const b = await pw.chromium.launch(opts);
const pg = await b.newPage();
await pg.goto(pathToFileURL(path.join(D, "cover.html")).href);
const [W, H] = await pg.evaluate(() => window.COVER.size);
await pg.setViewportSize({ width: W, height: H });
await pg.evaluate(() => window.__ready);
const out = path.join(D, "cover.png");
await (await pg.$("#root")).screenshot({ path: out });
await b.close();
const ff = a => { const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...a]); if (r.status) console.error(String(r.stderr)); };
ff(["-i", out, "-vf", "scale=180:-2", path.join(D, "cover-thumb.png")]);
const gh = Math.round(W * 5 / 4);
ff(["-i", out, "-vf", `crop=${W}:${Math.min(gh, H)}:0:${Math.max(0, Math.round((H - gh) / 2))}`, path.join(D, "cover-grid.png")]);
console.log("DONE " + out);
