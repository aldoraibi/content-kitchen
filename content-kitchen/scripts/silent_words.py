#!/usr/bin/env python3
"""No-voice mode: give every word a reading-pace time so the video can be timed without audio.
Usage: python3 silent_words.py <script.txt> <out-dir> [words-per-second=2.3]
Writes <out-dir>/words.json
"""
import json, re, sys
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
wps = float(sys.argv[3]) if len(sys.argv) > 3 else 2.3
t, words = 0.4, []
for tok in text.split():
    d = (1 / wps) * (1 + max(0, len(tok) - 5) * 0.08)
    words.append({"w": tok, "s": round(t, 3), "e": round(t + d * 0.9, 3)})
    t += d + (0.45 if re.search(r"[.!؟?،,]$", tok) else 0)
(out / "words.json").write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
print(f"{len(words)} words, about {t:.1f} s -> {out/'words.json'}")
