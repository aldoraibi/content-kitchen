# مطبخ المحتوى — Content Kitchen

بواسطة **يحيى الدريبي** — By **Yahya Aldoraibi** · [@ALDoraibi](https://x.com/ALDoraibi)

مهارة تحوّل فكرتك إلى فيديو قصير عمودي خطوة بخطوة: الفكرة ← السكربت ← الصوت ← المسودة ← النهائي ← الغلاف. كل خطوة تنتظر موافقتك قبل اللي بعدها، والمهارة تتعلّم من تعديلاتك وتقترح قواعد ما تنطبق إلا لما تعتمدها.

A skill that turns your idea into a short vertical video, step by step: idea → script → voice → draft → final → cover. Every step waits for your approval, and the skill learns from your edits by proposing rules that apply only after you approve them.

## التثبيت · Install

- **Claude (claude.ai / Desktop):** فعّل «تنفيذ الكود وإنشاء الملفات» من الإعدادات ← القدرات، ثم «تخصيص» ← «المهارات» ← «+» ← «إنشاء مهارة» ← «رفع مهارة»، وارفع `content-kitchen.zip`.
  Enable code execution in Settings → Capabilities, then Customize → Skills → + → Create skill → Upload a skill, and upload `content-kitchen.zip`.
- **Claude Code:** انسخ المجلد إلى `~/.claude/skills/content-kitchen/`.
- **ChatGPT (حسابات العمل: Business و Enterprise و Edu):** «المهارات» ← «+» ← «رفع من جهازك»، وارفع نفس الملف.
  Skills → + → Upload from your computer.

ابدأ بكتابة: «افتح المطبخ» — Start by typing: "open the kitchen".

## اللي تحتاجه للرسم · What rendering needs

- Node.js و Playwright (`npm i playwright && npx playwright install chromium`) و ffmpeg.
- للصوت المسجّل: `pip install faster-whisper`. للصوت المستنسخ: حساب ElevenLabs والمفتاح في متغيّر البيئة `ELEVENLABS_API_KEY` (لا تكتبه في المحادثة).
- إذا بيئة المنصة ما تقدر تشغّل متصفح أو ffmpeg، المهارة تسلّمك مجلد المشروع جاهز وترسمه على جهازك: `node scripts/render.mjs <project> final`.

## الترخيص · License

الكود والتعليمات: MIT. الخط Noto Naskh Arabic: رخصة SIL Open Font License 1.1 (`fonts/OFL.txt`).
Code and instructions: MIT. Font: SIL Open Font License 1.1.
