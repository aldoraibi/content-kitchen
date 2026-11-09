# Step 7 — The cover (role: designer)

The cover is designed on its own; it is never the first frame of the video.

1. Copy `templates/cover.html` into `videos/<id>/cover/` with the `fonts/` folder and write `cover/cover.js`:

```js
window.COVER = {
  size: [1080, 1920],
  dir: "rtl",
  colors: {bg: "#0F172A", accent: "#38BDF8", text: "#F8FAFC"},
  badge: "",                 // optional small label
  title: ["سطر أول", "سطر ثاني"],   // 2–5 words total, the hook, not the full title
  accentWord: "كلمة",        // one word from the title drawn in the accent color
  img: "img.jpg",            // one strong image, or the user's photo (cut-out PNG)
  imgMode: "card",           // "card" (rounded card) or "cutout" (person on the background)
  brand: {name: "", logo: ""}
};
```

2. **The user's own photo.** If the user attaches a photo of themselves (or a frame from their video), it is the main image:
   - for a video file, extract 6 frames with ffmpeg and pick the sharpest (eyes open, no blur);
   - cut the person out with `rembg` (`pip install rembg`, runs locally) and use `imgMode: "cutout"`;
   - never change their face or generate a new face. Do not use a photo that shows private data (messages, numbers).
   - if an image tool is available, you may generate a background that fits the topic (no people, no text) as `bg.jpg`; otherwise use the palette gradient.
3. Render: `node scripts/render_cover.mjs videos/<id>/cover` → `cover.png`, `cover-thumb.png` (width 180, how it looks in a grid) and `cover-grid.png` (4:5 center crop).
4. Open all three. Everything important must sit inside the 4:5 safe area and no text in the bottom 300 px. If the title cannot be read in the thumbnail, make it bigger or shorter and render again.
5. Show the cover and wait for approval. Stage `cover_ready`; on approval `done`. Deliver the final package: `final.mp4`, `cover.png`, caption, sources, credits. Publishing is the user's job.
