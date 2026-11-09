# Learning from the user's edits (always on)

1. **Record.** Every time the user edits a script, caption or other text themselves, or sends a note, append to `kitchen-data/edits.json`:
   `{"at": "<ISO>", "item": "<id>", "kind": "script|caption|video|cover", "before": "...", "after": "...", "note": "..."}`
2. **Find patterns.** After every 3 new edits, compare them. When the same kind of change repeats at least twice (a word they always replace, sentences they always shorten, a type of image they always reject), write a proposed rule:
   `{"id": "r<n>", "scope": "script|video|cover|all", "text": "<the rule in one line>", "example": {"before": "...", "after": "..."}, "seen": <times>, "at": "<ISO>"}`
   and add it to `rules.json.proposed`. Never propose a rule that is already in `approved` or `rejected`.
3. **Never apply a proposed rule** until the user approves it. Show proposed rules in "Waiting for you" with two choices: Approve / Remove.
4. **The counter** = the number of rules in `proposed`. Each approval or removal lowers it by one; at 0 the line disappears.
5. Approved → move to `approved` (applies from now on, in its scope). Removed → move to `rejected` (never proposed again).
6. The user can add a rule directly at any time ("save a rule: …" / «احفظ قاعدة: …») — it goes straight to `approved`.
7. Every role reads `approved` rules in its scope before starting.
