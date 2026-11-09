# Step 6 — Notes and the final video

1. **Notes.** The user can send:
   - a general note ("make the images bigger");
   - a timed note starting with `[m:ss]`, e.g. `[0:12] change this image` — find the scene covering that second in `data.js` and change only that scene;
   - a note with a photo attached — use it in the scene the note names (or the timed second), after checking it against the image rules.
2. **Receipts.** For every note write one line: `<first words of the note> → what you did (done / not done + why)`. Save them in the item's `receipts`. Store before/after of anything the user changed in `edits.json`.
3. If a note needs a new spoken word or sentence, do not change the video: send them back to step 4 for that sentence.
4. Render a new draft with the next number after each round of notes (`draft-<n+1>.mp4`) and repeat until the user approves.
5. **Final:** `node scripts/render.mjs videos/<id>/project final` → `final.mp4` (full size, 30 fps). The renderer works in 10-second parts and skips parts that already exist, so if it stops, run the same command again to continue.
6. Check `python3 scripts/frames.py final.mp4 8` — open the frames, confirm images, captions and end screen. Fix and re-render if needed.
7. Deliver `final.mp4` plus the caption and `credits.txt`. Stage `final_ready`. Go to step 7.
