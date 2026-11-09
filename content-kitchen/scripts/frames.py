#!/usr/bin/env python3
"""Make a contact sheet of evenly spaced frames from a video so you can check it by eye.
Usage: python3 frames.py <video.mp4> [count=12]  ->  <video>-contact.png next to the video
"""
import json, subprocess, sys
from pathlib import Path

video = Path(sys.argv[1])
count = int(sys.argv[2]) if len(sys.argv) > 2 else 12
dur = float(json.loads(subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(video)],
    capture_output=True, text=True, check=True).stdout)["format"]["duration"])
cols = 4 if count > 8 else count if count <= 4 else 4
rows = -(-count // cols)
fps = count / max(dur, 0.1)
out = video.with_name(video.stem + "-contact.png")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vf",
                f"fps={fps:.5f},scale=270:-2,tile={cols}x{rows}:padding=6:color=white",
                "-frames:v", "1", str(out)], check=True)
print(out)
