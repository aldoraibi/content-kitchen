# Step 3 — The script (role: writer)

Before writing, read `settings.json` (dialect, length, style_samples, never) and every approved rule in `rules.json` whose scope is `script` or `all`.

1. Read the sources yourself before writing. Every number or claim comes from a source you opened; otherwise leave it out.
2. Structure:
   - **Hook** (first 3 seconds): a question or a common mistake, in second person.
   - **The idea simply**, in one or two sentences.
   - **One real example** (a real tool, number, or case — with its source).
   - **Takeaway** in one line.
   - **Question to the viewer** to invite comments.
3. Length: about 2.3 spoken words per second for Arabic, 2.6 for English (60 s ≈ 140 Arabic words).
4. Write in the user's dialect and imitate `style_samples` if given. At most one comparison/analogy. Never attribute a personal story to the user that they did not tell you.
5. Write numbers as they will be spoken (e.g. «خمسطعشر» not «١٥») only in the spoken script; keep digits in the caption.
6. Also write: the post caption (2–4 lines + up to 3 hashtags) and the sources list.
7. Save to the item: `script`, `caption`, stage `script_ready`. Show the script and ask the user to edit it, send a note, or approve.
8. When the user edits the text themselves, store before/after in `edits.json` (see `learn.md`). When they send a note, apply it and show a receipt: what you changed, one line per note.
9. On approval: stage `script_ok`. The approved script is spoken word for word from now on. Go to step 4.
