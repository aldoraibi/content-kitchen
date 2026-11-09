# Step 4 — The voice

The output of this step is always the same, whatever the method: `videos/<id>/voice.mp3` and `videos/<id>/words.json` — a list of `{"w": "<word>", "s": <start seconds>, "e": <end seconds>}` in order. The draft is timed from `words.json`.

**No draft before the user approves the voice.**

## A. The user records it (settings.voice = "record")

1. Give the user a reading copy: the approved script in large text, one sentence per line.
2. They upload the recording in any format (wav, m4a, mp3, or a video).
3. Run `python3 scripts/transcribe.py <file> videos/<id>` — transcribes with word times (faster-whisper, runs locally). Install with `pip install faster-whisper` if missing.
4. Retakes: compare the transcript to the script sentence by sentence. If a sentence (or its start) was said more than once, keep the LAST complete take and cut the earlier ones and any false starts or off-script words between them ("wait", "again"). Never cut a sentence that was said once. Never cut inside a word. Write the cut list as `cuts.json` (`[[start, end], ...]` in seconds to REMOVE).
5. Run `bash scripts/clean_voice.sh <file> videos/<id> [cuts.json]` — removes the cuts with short fades, shortens pauses longer than 0.8 s, reduces noise, normalises loudness. It does not change the voice itself.
6. Run `transcribe.py` again on the cleaned `voice.mp3` to get final `words.json`. Fix spelling of each word to match the script when it is the same word.
7. Report: length before/after, how many retakes you removed and where.

## B. Cloned voice (settings.voice = "clone")

1. The user needs an account with a voice tool that returns word timings. The bundled script supports ElevenLabs: `python3 scripts/tts_elevenlabs.py <script.txt> videos/<id>` with the key in the environment variable `ELEVENLABS_API_KEY` and the voice in `ELEVENLABS_VOICE_ID`. Never ask for the key in the chat.
2. Spoken text = the approved script exactly. Allowed changes only: numbers to words, and replacing words the voice mispronounces with an unambiguous synonym from `kitchen-data/pronunciation.json` (create it when the user complains about a word). List every change.
3. For a small edit later (one word or sentence), regenerate only the changed sentence if the tool supports it; otherwise regenerate all and say so.

## C. No voice (settings.voice = "none")

Run `python3 scripts/silent_words.py <script.txt> videos/<id>` — writes reading-pace timings (`words.json`) and no `voice.mp3`. Skip the approval.

## Approval

Give the user the audio to listen to. Stage `voice_ready`. On approval: `voice_ok`, go to step 5. If they want changes, apply them to the recording itself (never generate words in a synthetic voice for a recorded track — ask them to re-record the sentence instead).
