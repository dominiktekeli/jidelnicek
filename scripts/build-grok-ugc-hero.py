#!/usr/bin/env python3
"""Hero UGC via xAI Grok Imagine Video (image-to-video), multi-shot concat."""
from __future__ import annotations

import base64
import json
import subprocess
import time
from pathlib import Path

import imageio
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "hero-video.mp4"
POSTER = ROOT / "images" / "hero-video-poster.jpg"
TMP = ROOT / "scripts" / ".ugc-tmp"
API = "https://api.x.ai/v1"

SHOTS = [
    {
        "image": ROOT / "images" / "hero-ugc-mom-talk.jpg",
        "prompt": (
            "Authentic Czech mom UGC selfie in home kitchen at 5pm, she talks to the phone camera "
            "with worried expression about dinner, subtle natural head movement and lip motion, "
            "handheld front camera, warm light, casual, not commercial"
        ),
    },
    {
        "image": ROOT / "images" / "hero-ugc-phone.jpg",
        "prompt": (
            "Hand holds smartphone closer to camera, thumb scrolls meal plan app slowly, "
            "kitchen background softly blurred, authentic UGC social video style"
        ),
    },
    {
        "image": ROOT / "images" / "hero-food.jpg",
        "prompt": (
            "Slow camera push-in on family dinner table with Czech home cooking, "
            "steam rising gently, warm cozy kitchen atmosphere, documentary UGC feel"
        ),
    },
    {
        "image": ROOT / "images" / "hero-ugc-mom-talk.jpg",
        "prompt": (
            "Same Czech mom smiles with relief, relaxed shoulders, small nod to camera, "
            "UGC selfie in kitchen, hopeful calm mood, natural lip movement"
        ),
    },
]


def load_api_key() -> str:
    import os

    key = os.environ.get("XAI_API_KEY", "").strip()
    if key:
        return key
    auth = Path.home() / ".grok" / "auth.json"
    data = json.loads(auth.read_text(encoding="utf-8"))
    for entry in data.values():
        if isinstance(entry, dict) and entry.get("key"):
            return str(entry["key"])
    raise RuntimeError("Set XAI_API_KEY or run `grok login` first.")


def image_data_uri(path: Path) -> str:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def start_video(key: str, prompt: str, image_path: Path) -> str:
    r = requests.post(
        f"{API}/videos/generations",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": "grok-imagine-video",
            "prompt": prompt,
            "image": {"url": image_data_uri(image_path)},
            "duration": 6,
            "aspect_ratio": "16:9",
            "resolution": "720p",
        },
        timeout=120,
    )
    r.raise_for_status()
    body = r.json()
    request_id = body.get("request_id")
    if not request_id:
        raise RuntimeError(f"No request_id: {body}")
    return request_id


def poll_video(key: str, request_id: str) -> str:
    for _ in range(120):
        r = requests.get(
            f"{API}/videos/{request_id}",
            headers={"Authorization": f"Bearer {key}"},
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        status = data.get("status")
        if status == "done":
            url = (data.get("video") or {}).get("url")
            if not url:
                raise RuntimeError(f"Missing video url: {data}")
            return url
        if status in ("failed", "expired"):
            raise RuntimeError(f"Video {status}: {data}")
        time.sleep(5)
    raise TimeoutError(request_id)


def download(url: str, dest: Path) -> None:
    r = requests.get(url, timeout=300)
    r.raise_for_status()
    dest.write_bytes(r.content)


def concat_clips(clips: list[Path], out: Path) -> None:
    ffmpeg = imageio.plugins.ffmpeg.get_exe()
    list_file = TMP / "clips.txt"
    list_file.write_text(
        "\n".join(f"file '{p.resolve()}'" for p in clips),
        encoding="utf-8",
    )
    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(out)],
        check=True,
        capture_output=True,
    )


def main() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    key = load_api_key()
    clips: list[Path] = []

    for i, shot in enumerate(SHOTS, 1):
        if not shot["image"].exists():
            raise FileNotFoundError(shot["image"])
        print(f"Shot {i}/{len(SHOTS)}: generating…")
        req_id = start_video(key, shot["prompt"], shot["image"])
        print(f"  request {req_id}")
        url = poll_video(key, req_id)
        clip = TMP / f"shot-{i:02d}.mp4"
        download(url, clip)
        clips.append(clip)
        print(f"  saved {clip.name} ({clip.stat().st_size // 1024} KB)")

    print("Concatenating…")
    concat_clips(clips, OUT)
    from PIL import Image

    Image.open(SHOTS[0]["image"]).save(POSTER, quality=92)
    mb = OUT.stat().st_size / (1024 * 1024)
    print(f"Done: {OUT} ({mb:.1f} MB)")
    print(f"Poster: {POSTER}")


if __name__ == "__main__":
    main()