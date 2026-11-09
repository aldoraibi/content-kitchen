# Step 0 — Setup questions (first run only)

Ask ONE question at a time, as multiple choice (2–4 options + "something else"). Use the platform's choice widget if it has one; otherwise numbered options. Do not move on until the user answers. Show the Arabic text to Arabic users and the English text to English users.

1. **Content type / نوع المحتوى** — Educational · News commentary · Quick tips · Stories
   تعليمي · تعليق على أخبار · نصائح سريعة · قصص
2. **Field / المجال** — Tech · AI · Coffee & food · Other (they type it)
   تقنية · ذكاء اصطناعي · قهوة وأكل · غيره
3. **Language & dialect / اللغة واللهجة** — Simple standard Arabic · Saudi · Gulf · English · Other
   Then ask (optional): "Paste two scripts or posts you wrote yourself so I write like you." Save them as `style_samples`.
4. **Video length / طول الفيديو** — 30 seconds · 1 minute · 2 minutes
5. **Colors / الألوان** — offer the palettes in `templates/palettes.json` by name, or "my own colors" (ask for background, accent, text as hex or plain words).
6. **Images / مصدر الصور** — Free-license photos · AI-generated images · My own clips · Mix
7. **Voice / الصوت** — I record it myself · A cloned voice (needs an account with a voice tool) · No voice (text only)
8. **Size / المقاس** — Vertical 9:16 · Portrait 4:5 · Landscape 16:9
9. **Things you never want / ممنوعات** — multi-select: No music · No emoji · No faces · No jokes · Something else (they type it)
10. **Your name or logo / اسمك أو شعارك** (optional) — shown in a fixed corner and on the end screen. They can attach a logo file.

## Save

Write `kitchen-data/settings.json`:

```json
{
  "lang": "ar",
  "dialect": "سعودي",
  "content_type": "تعليمي",
  "field": "تقنية",
  "length_s": 60,
  "palette": {"name": "paper", "bg": "#FFFFFF", "accent": "#E4572E", "text": "#1B1B1B"},
  "images": "mix",
  "voice": "record",
  "size": "9:16",
  "never": ["music", "emoji"],
  "brand": {"name": "", "logo": ""},
  "style_samples": [],
  "created_at": "<ISO time>"
}
```

Also create empty `items.json` (`[]`), `archive.json` (`[]`), `rules.json` (`{"approved":[],"proposed":[],"rejected":[]}`) and `edits.json` (`[]`).

Show a two-line summary of the answers and ask "Is this right? / كذا تمام؟". On yes, go to step 1. The user can change any answer later with "change my settings / غيّر إعداداتي".
