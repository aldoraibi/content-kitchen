# Step 1 — Waiting for you (ينتظرك)

Show this first, every time the kitchen opens.

1. Read `kitchen-data/items.json`. List every item whose stage needs the user, oldest first, one line each:
   `<title> — <stage> — <what you need from them>`
   Stages that need the user: `script_ready` (approve the script), `voice_ready` (listen and approve), `draft_ready` (watch and send notes or approve), `cover_ready` (approve the cover).
2. Add one line for rules: "<n> rules learned from your edits are waiting for your approval" — n = number of items in `rules.json.proposed`. Hide the line when n = 0. (See `learn.md`.)
3. If nothing waits: ask "Start a new idea? / نبدأ فكرة جديدة؟" and offer: Find me ideas · I have a topic.
4. When the user picks an item, jump to the step for its stage.

Item format in `items.json`:

```json
{
  "id": "2026-11-09_01",
  "title": "",
  "stage": "idea|script_ready|script_ok|voice_ready|voice_ok|draft_ready|final_ready|cover_ready|done",
  "topic": "", "sources": [{"title": "", "url": ""}],
  "script": "", "caption": "",
  "draft_n": 0, "notes": [], "receipts": [],
  "updated_at": ""
}
```
