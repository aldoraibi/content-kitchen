#!/usr/bin/env python3
"""Generate the voice with a cloned voice on ElevenLabs, with word timings.
Usage: python3 tts_elevenlabs.py <script.txt> <out-dir>
Needs environment variables (never paste the key in a chat or a file):
  ELEVENLABS_API_KEY   your key
  ELEVENLABS_VOICE_ID  the voice to use
  ELEVENLABS_MODEL     optional, default eleven_multilingual_v2
Writes <out-dir>/voice.mp3 and <out-dir>/words.json
"""
import base64, json, os, sys, urllib.request
from pathlib import Path

key, voice = os.environ.get("ELEVENLABS_API_KEY"), os.environ.get("ELEVENLABS_VOICE_ID")
if not key or not voice:
    sys.exit("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in the environment first.")
text = Path(sys.argv[1]).read_text(encoding="utf-8").strip()
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
body = json.dumps({"text": text, "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
    data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=300) as r:
    data = json.load(r)
(out / "voice.mp3").write_bytes(base64.b64decode(data["audio_base64"]))
al = data.get("alignment") or data.get("normalized_alignment") or {}
chars, st, en = al.get("characters", []), al.get("character_start_times_seconds", []), al.get("character_end_times_seconds", [])
words, cur, s0, e0 = [], "", None, None
for c, s, e in zip(chars, st, en):
    if c.isspace():
        if cur:
            words.append({"w": cur, "s": round(s0, 3), "e": round(e0, 3)}); cur = ""
        continue
    if not cur:
        s0 = s
    cur += c; e0 = e
if cur:
    words.append({"w": cur, "s": round(s0, 3), "e": round(e0, 3)})
(out / "words.json").write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
print(f"{len(words)} words, {len(text)} characters used -> {out}")
