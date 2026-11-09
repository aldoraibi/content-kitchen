#!/usr/bin/env python3
"""Transcribe a recording with word timings (runs locally with faster-whisper).
Usage: python3 transcribe.py <audio-or-video> <out-dir> [lang=ar] [model=small]
Writes <out-dir>/words.json = [{"w": word, "s": start, "e": end}, ...] and <out-dir>/transcript.txt
Install: pip install faster-whisper
"""
import json, sys
from pathlib import Path

try:
    from faster_whisper import WhisperModel
except ImportError:
    sys.exit("faster-whisper is not installed. Run: pip install faster-whisper")

src, out = sys.argv[1], Path(sys.argv[2])
lang = sys.argv[3] if len(sys.argv) > 3 else "ar"
size = sys.argv[4] if len(sys.argv) > 4 else "small"
out.mkdir(parents=True, exist_ok=True)
model = WhisperModel(size, device="auto", compute_type="int8")
segments, _ = model.transcribe(src, language=lang, word_timestamps=True, vad_filter=True)
words = []
for seg in segments:
    for w in seg.words or []:
        t = w.word.strip()
        if t:
            words.append({"w": t, "s": round(w.start, 3), "e": round(w.end, 3)})
(out / "words.json").write_text(json.dumps(words, ensure_ascii=False, indent=0), encoding="utf-8")
(out / "transcript.txt").write_text(" ".join(x["w"] for x in words), encoding="utf-8")
print(f"{len(words)} words -> {out/'words.json'}")
