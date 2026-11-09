// Render a Content Kitchen project to MP4.
// Usage: node render.mjs <project-dir> draft <n>   → ../draft-<n>.mp4  (half size, 15 fps)
//        node render.mjs <project-dir> final       → ../final.mp4      (full size, 30 fps, resumable 10 s parts)
// Needs: ffmpeg on PATH, and Playwright (npm i playwright, or set KITCHEN_NODE_MODULES to a folder that has it).
// Browser: Playwright's own Chromium, or set CHROME_PATH to an installed Chrome/Chromium.
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  const tries = [process.env.KITCHEN_NODE_MODULES, process.cwd() + "/node_modules"].filter(Boolean);
  for (const name of ["playwright", "playwright-core"]) {
    try { return require(name); } catch {}
    for (const dir of tries) { try { return require(path.join(dir, name)); } catch {} }
  }
  console.error("Playwright not found. Run: npm i playwright && npx playwright install chromium");
  process.exit(2);
}
const { chromium } = loadPlaywright();

const [proj, mode = "draft", nArg = "1"] = process.argv.slice(2);
if (!proj || !["draft", "final"].includes(mode)) { console.error("usage: render.mjs <project-dir> draft <n> | final"); process.exit(1); }
const P = path.resolve(proj), OUT = path.dirname(P);
const html = path.join(P, "video.html");
if (!fs.existsSync(html) || !fs.existsSync(path.join(P, "data.js"))) { console.error("project needs video.html and data.js"); process.exit(1); }
const voice = [path.join(P, "voice.mp3"), path.join(OUT, "voice.mp3")].find(f => fs.existsSync(f));

const fps = mode === "final" ? 30 : 15, scale = mode === "final" ? 1 : 0.5, PART = 10;
const run = (cmd, args, input) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: [input ? "pipe" : "ignore", "ignore", "pipe"] });
  let err = ""; p.stderr.on("data", d => err += d);
  p.on("close", c => c === 0 ? res() : rej(new Error(cmd + " failed: " + err.slice(-600))));
  if (input) input(p.stdin);
});

const opts = { args: ["--no-sandbox", "--force-color-profile=srgb"] };
if (process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
else if (fs.existsSync("/usr/bin/google-chrome")) opts.executablePath = "/usr/bin/google-chrome";
const browser = await chromium.launch(opts);
const meta0 = await (async () => {
  const pg = await browser.newPage(); await pg.goto(pathToFileURL(html).href);
  const m = await pg.evaluate(() => window.__meta); await pg.close(); return m;
})();
const [W, H] = meta0.size, dur = meta0.dur;
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale });
await page.goto(pathToFileURL(html).href);
await page.evaluate(() => window.__ready);
const root = await page.$("#root");

async function renderRange(t0, t1, file) {
  const frames = Math.round((t1 - t0) * fps);
  await run("ffmpeg", ["-y", "-f", "image2pipe", "-c:v", "mjpeg", "-r", String(fps), "-i", "-",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", mode === "final" ? "18" : "26", "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", file], async stdin => {
    for (let i = 0; i < frames; i++) {
      const t = t0 + i / fps;
      await page.evaluate(x => window.__seek(x), t);
      const buf = await root.screenshot({ type: "jpeg", quality: 92 });
      if (!stdin.write(buf)) await new Promise(r => stdin.once("drain", r));
    }
    stdin.end();
  });
}

async function mux(video, out) {
  const a = voice ? ["-i", voice, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "160k", "-shortest"] : [];
  await run("ffmpeg", ["-y", "-i", video, ...a, "-c:v", "copy", "-movflags", "+faststart", out]);
}

if (mode === "draft") {
  const tmp = path.join(OUT, `.draft-${nArg}.video.mp4`), out = path.join(OUT, `draft-${nArg}.mp4`);
  await renderRange(0, dur, tmp); await mux(tmp, out); fs.rmSync(tmp);
  console.log("DONE " + out);
} else {
  const sig = crypto.createHash("sha1").update(fs.readFileSync(html)).update(fs.readFileSync(path.join(P, "data.js")))
    .update(voice ? String(fs.statSync(voice).size) : "").digest("hex").slice(0, 10);
  const dir = path.join(P, "_parts", sig); fs.mkdirSync(dir, { recursive: true });
  const n = Math.ceil(dur / PART), list = [];
  for (let k = 0; k < n; k++) {
    const f = path.join(dir, `part-${String(k).padStart(3, "0")}.mp4`); list.push(f);
    if (fs.existsSync(f) && fs.statSync(f).size > 1000) { console.log(`PART ${k + 1}/${n} (kept)`); continue; }
    const t0 = k * PART, t1 = Math.min(dur, t0 + PART);
    await renderRange(t0, t1, f + ".tmp.mp4"); fs.renameSync(f + ".tmp.mp4", f);
    console.log(`PART ${k + 1}/${n}`);
  }
  const lst = path.join(dir, "list.txt");
  fs.writeFileSync(lst, list.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join("\n"));
  const tmp = path.join(dir, "joined.mp4");
  await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", tmp]);
  const out = path.join(OUT, "final.mp4"); await mux(tmp, out);
  console.log("DONE " + out);
}
await browser.close();
