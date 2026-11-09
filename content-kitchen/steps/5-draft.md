# Step 5 — The draft (role: editor)

Read `settings.json` and approved rules with scope `video` or `all` first.

1. **Plan the scenes from `words.json`.** One scene per sentence or idea. Write the plan as lines `start–end s — what appears` and show it to the user. No scene stays still longer than 2 seconds.
2. **Images.** By `settings.images`:
   - free-license: Wikimedia Commons, Openverse (commercial-use licenses), NASA images. Never Google Images, never non-commercial (NC) or unclear licenses.
   - AI-generated: only if an image tool is available; no text inside, no real people.
   - the user's own clips: use them first, muted unless they say otherwise.
   Write each image's source, author and license in `videos/<id>/credits.txt`. Look at every image before using it.
3. **Build the project folder** `videos/<id>/project/`:
   - copy `templates/video.html` and the `fonts/` folder into it, and the images into `project/img/`;
   - write `project/data.js` (format below).
4. **Draft render:** `node scripts/render.mjs videos/<id>/project draft <n>` → `draft-<n>.mp4` (half size, 15 fps).
5. **Look before delivering:** `python3 scripts/frames.py draft-<n>.mp4` → `contact.png` (12 frames). Open it. Fix any empty screen, text outside the frame, or caption not in sync, and render again.
6. Give the user the draft. Stage `draft_ready`. Go to step 6 for notes.

## data.js format

```js
window.KITCHEN = {
  size: [1080, 1920],               // from settings.size: 9:16 = 1080x1920, 4:5 = 1080x1350, 16:9 = 1920x1080
  dur: 58.4,                        // length of voice.mp3 (or last word end + 1.5)
  dir: "rtl",                       // "ltr" for English
  colors: {bg: "#FFFFFF", accent: "#E4572E", text: "#1B1B1B"},
  brand: {name: "", logo: ""},      // logo = "img/logo.png" or ""
  badge: "",                        // small label at the top, optional
  words: [{w: "", s: 0, e: 0}],     // copy of words.json
  scenes: [
    {s: 0, e: 3.2, type: "hook", text: "سؤال الخطّاف"},
    {s: 3.2, e: 9, type: "image", img: "img/1.jpg", text: "", focus: [0.5, 0.4]},
    {s: 9, e: 15, type: "point", text: "الفكرة ببساطة", sub: "سطر شرح"},
    {s: 15, e: 22, type: "steps", items: ["أولاً", "ثانياً", "ثالثاً"]},
    {s: 50, e: 55, type: "card", title: "الخلاصة", text: "سطر الخلاصة"},
    {s: 55, e: 58.4, type: "end"}
  ]
};
```

Scene types: `hook` (big text), `image` (full-screen photo with slow push-in; `focus` = point to zoom toward), `point` (title + sub line building in), `steps` (numbered items appearing one by one), `card` (summary card to save), `end` (name/logo end screen). Scenes cross-fade into each other. The caption at the bottom is drawn automatically from `words`, with the spoken word highlighted in the accent color.
