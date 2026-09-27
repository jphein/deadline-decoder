#!/usr/bin/env python3
"""Build the ≤3-minute demo: Azure Dragon HD narration + app screenshots (Chrome on familiar) → mp4.
Run on katana; heavy work (Chrome, ffmpeg) happens on familiar over ssh."""
import subprocess, sys, wave, pathlib, json
sys.path.insert(0, str(pathlib.Path.home() / "Projects/speech-to-cli"))
import json, requests
CFG = json.load(open(pathlib.Path.home() / ".config/speech-to-cli/config.json"))
VOICE = "en-US-Andrew:DragonHDLatestNeural"   # JP 2026-09-26: Azure Dragon HD voices for videos


def azure_wav(text):
    """Azure Dragon HD TTS → (rate, width, channels, pcm). No Piper fallback: JP asked for Dragon HD."""
    import os
    # TTS uses its own region in the speech config (tts_region=eastus); the STT region (westus) returns 400 for Dragon HD.
    key = CFG.get("tts_key") or CFG.get("key")
    region = CFG.get("tts_region") or CFG.get("region", "westus2")
    safe = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    ssml = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">'
            f'<voice name="{VOICE}">{safe}</voice></speak>')
    r = requests.post(f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1", timeout=60,
                      headers={"Ocp-Apim-Subscription-Key": key, "Content-Type": "application/ssml+xml",
                               "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm"}, data=ssml.encode())
    r.raise_for_status()
    b = r.content
    i = b.find(b"data"); pcm = b[i + 8:]
    return 24000, 2, 1, pcm
HERE = pathlib.Path(__file__).parent; OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
APP = "http://10.0.6.129:7822/index.html"
REMOTE = "/var/tmp/fwork/money/dd-video"
# scene id -> (url hash, window height, crop top, crop height)
SCENES = {
 "01": ("", 1000, 0, 720), "02": ("", 1000, 0, 720), "03": ("#sample", 2600, 480, 720),
 "04": ("#ssa-recon/2026-09-13!", 1400, 50, 720), "05": ("#ssa-recon/2026-09-13!", 1400, 560, 720),
 "06": ("#ca-3day/2026-11-25!", 1400, 50, 720), "07": ("#ca-ud/2026-10-01!", 1400, 50, 720),
 "08": ("#ca-noa/2026-09-01!", 1400, 50, 720), "09": ("#ssa-recon/2026-09-13+src", 1600, 760, 720),
 "10": ("", 1000, 0, 720),
}
lines = dict(l.split("|", 1) for l in (HERE / "narration.txt").read_text().splitlines() if "|" in l)
total = 0.0
for k, text in lines.items():
    rate, width, ch, pcm = azure_wav(text)
    with wave.open(str(OUT / f"{k}.wav"), "wb") as w:
        w.setnchannels(ch); w.setsampwidth(width); w.setframerate(rate); w.writeframes(pcm)
    dur = len(pcm) / (rate * width * ch); total += dur + 0.6
    print(k, round(dur, 1), "s")
print("narration total", round(total, 1), "s")
if total > 175: sys.exit("too long for the 3-minute limit")
subprocess.run(["ssh", "-o", "BatchMode=yes", "familiar", f"mkdir -p {REMOTE}"], check=True)
subprocess.run(["scp", "-q", *[str(OUT / f"{k}.wav") for k in lines], f"familiar:{REMOTE}/"], check=True)
script = ["set -e", f"cd {REMOTE}"]
for k, (h, H, top, hgt) in SCENES.items():
    script.append(f'timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=5000 --window-size=1280,{H} --screenshot=full{k}.png "{APP}{h}" </dev/null >/dev/null 2>&1')
    script.append(f'ffmpeg -nostdin -y -loglevel error -i full{k}.png -vf "crop=1280:{hgt}:0:{top},pad=1280:720:0:0:color=0xf7f3ea" s{k}.png')
    script.append(f'ffmpeg -nostdin -y -loglevel error -loop 1 -i s{k}.png -i {k}.wav -af apad=pad_dur=0.6 -c:v libx264 -tune stillimage -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -shortest seg{k}.mp4')
script.append("printf \"file 'seg%s.mp4'\\n\" " + " ".join(SCENES) + " > list.txt")
script.append("ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy deadline-decoder-demo.mp4")
script.append("ffprobe -v error -show_entries format=duration -of csv=p=0 deadline-decoder-demo.mp4")
r = subprocess.run(["ssh", "-o", "BatchMode=yes", "familiar", "bash -s"], input="\n".join(script), text=True, capture_output=True)
print(r.stdout, r.stderr[-800:])
subprocess.run(["scp", "-q", f"familiar:{REMOTE}/deadline-decoder-demo.mp4", str(OUT)], check=True)
for k in SCENES:
    subprocess.run(["scp", "-q", f"familiar:{REMOTE}/s{k}.png", str(OUT)], check=False)
print("done", OUT / "deadline-decoder-demo.mp4")
