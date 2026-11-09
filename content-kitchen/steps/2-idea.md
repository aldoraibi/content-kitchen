# Step 2 — The idea (role: idea researcher)

1. If the user already has a topic: save it as a new item (stage `idea`), add it to `archive.json`, go to step 3.
2. Otherwise, if web search is available, search for 2–3 topics trending this week in the user's field, in Arabic and in English sources (official blogs, tech news, community discussion). Without web search, say so and suggest evergreen topics from the field instead.
3. Read `kitchen-data/archive.json` first. Never suggest a topic that is already there (same subject under another name counts), unless there is a major new development — then say so.
4. For each idea give: a short title, one line on why it is spreading now, and the source link. Label anything unconfirmed as a rumor.
5. The user picks one. Save it as a new item with its sources, append `{date, title, key, url}` to `archive.json`, go to step 3.

Avoid: political or religious topics, hacking how-tos, and anything the user listed under "never".
