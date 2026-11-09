#!/usr/bin/env bash
# Clean a recording without changing the voice: remove retake cuts, shorten long pauses,
# reduce noise, normalise loudness, trim silence at both ends.
# Usage: bash clean_voice.sh <input-audio-or-video> <out-dir> [cuts.json]
#   cuts.json = [[start, end], ...] seconds to REMOVE (retakes, false starts)
set -euo pipefail
IN="$1"; OUT="$2"; CUTS="${3:-}"
mkdir -p "$OUT"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
ffmpeg -y -loglevel error -i "$IN" -vn -ac 1 -ar 48000 "$TMP/a.wav"
if [ -n "$CUTS" ] && [ -s "$CUTS" ]; then
  # keep everything except the cut ranges, with 10 ms fades at each join to avoid clicks
  python3 - "$TMP/a.wav" "$CUTS" "$TMP/b.wav" <<'PY'
import json, subprocess, sys
src, cuts_f, dst = sys.argv[1:]
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True).stdout)
cuts = sorted([max(0,a), min(dur,b)] for a, b in json.load(open(cuts_f)) if b > a)
keep, t = [], 0.0
for a, b in cuts:
    if a > t: keep.append((t, a))
    t = max(t, b)
if t < dur: keep.append((t, dur))
parts = []
for i, (a, b) in enumerate(keep):
    d = b - a
    parts.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(0,d-0.01):.3f}:d=0.01[p{i}]")
fc = ";".join(parts) + ";" + "".join(f"[p{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1[o]"
subprocess.run(["ffmpeg","-y","-loglevel","error","-i",src,"-filter_complex",fc,"-map","[o]",dst],check=True)
PY
else
  cp "$TMP/a.wav" "$TMP/b.wav"
fi
ffmpeg -y -loglevel error -i "$TMP/b.wav" -af \
"silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.8:stop_threshold=-45dB:stop_silence=0.4,highpass=f=70,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" \
-ar 48000 -ac 2 -b:a 192k "$OUT/voice.mp3"
echo "$OUT/voice.mp3"
