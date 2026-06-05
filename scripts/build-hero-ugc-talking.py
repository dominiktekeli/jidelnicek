#!/usr/bin/env python3
"""
UGC hero: český VO (ElevenLabs) + obraz bez falešného lip-syncu.

Problém staré verze: Grok prompty „speaks to camera / lip movement“ animují ústa
podle anglického promptu, ne podle českého ElevenLabs — scénář a video nesedí.

Režimy (env HERO_MOTION):
  ken-burns   — výchozí, jemný zoom na fotkách, VO = jediný hlas (doporučeno)
  grok-ambient — jemný pohyb z Groku, ústa zavřená / neutrální, žádné mluvení
"""
from __future__ import annotations

import base64
import json
import math
import os
import subprocess
import time
from pathlib import Path

import imageio
import imageio.v3 as iio
import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "hero-video.mp4"
POSTER = ROOT / "images" / "hero-video-poster.jpg"
TMP = ROOT / "scripts" / ".ugc-tmp"
API = "https://api.x.ai/v1"

W, H = 1280, 720
FPS = 24
FADE_FRAMES = 14
MOTION = os.environ.get("HERO_MOTION", "ken-burns").strip().lower()

ELEVEN_VOICE = os.environ.get("ELEVEN_VOICE_ID", "ULC9TU2vv6WOHN6tKxNv")
ELEVEN_MODEL = os.environ.get("ELEVEN_MODEL_ID", "eleven_turbo_v2_5")

# Přesný scénář — titulky už jsou vypálené ve fotkách.
SHOTS = [
    {
        "image": ROOT / "images" / "shot-1-fridge.jpg",
        "voiceover": "Už zase nevím, co budu vařit… Pořád to samý.",
        "pause_after": 1.5,
        "min_duration": 5.0,
        "grok_prompt": (
            "Subtle UGC handheld video: tired Czech mom at open fridge, looks at fridge "
            "not camera, mouth closed neutral lips, NOT speaking, no lip sync, gentle "
            "camera drift, natural blink, kitchen selfie lighting, authentic"
        ),
        "vo": {"stability": 0.34, "style": 0.12},
    },
    {
        "image": ROOT / "images" / "shot-2-phone.jpg",
        "voiceover": "Našla jsem tohle… 4 týdny hotových jídel s nákupními seznamy.",
        "pause_after": 1.0,
        "min_duration": 5.0,
        "grok_prompt": (
            "Subtle UGC handheld: woman holds phone showing meal app, glances at screen, "
            "mouth closed not talking, no lip movement, slight hand sway, kitchen, "
            "authentic selfie, calm discovery mood"
        ),
        "vo": {"stability": 0.42, "style": 0.22},
    },
    {
        "image": ROOT / "images" / "shot-3-coffee.jpg",
        "voiceover": "Teď už mám konečně klid v kuchyni.",
        "pause_after": 0.0,
        "min_duration": 6.0,
        "price_hold": 1.6,
        "grok_prompt": (
            "Subtle UGC handheld: woman with coffee mug, relaxed soft smile, mouth closed "
            "not speaking, no lip sync, gentle camera drift, warm kitchen, relieved calm"
        ),
        "vo": {"stability": 0.48, "style": 0.32},
    },
]

END_CARD = 2.8
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def load_env() -> None:
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"'))


def ffmpeg() -> str:
    return imageio.plugins.ffmpeg.get_exe()


def eleven_key() -> str:
    k = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not k:
        raise RuntimeError("Chybí ELEVENLABS_API_KEY v .env.local")
    return k


def xai_key() -> str:
    k = os.environ.get("XAI_API_KEY", "").strip()
    if k:
        return k
    data = json.loads((Path.home() / ".grok" / "auth.json").read_text())
    for v in data.values():
        if isinstance(v, dict) and v.get("key"):
            return str(v["key"])
    raise RuntimeError("Chybí XAI_API_KEY / grok login")


def probe_duration(path: Path) -> float:
    p = subprocess.run([ffmpeg(), "-i", str(path)], capture_output=True, text=True)
    for line in p.stderr.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = t.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return 0.0


def elevenlabs_tts(text: str, out: Path, vo: dict) -> None:
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE}",
        headers={
            "xi-api-key": eleven_key(),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": text,
            "model_id": ELEVEN_MODEL,
            "language_code": "cs",
            "voice_settings": {
                "stability": vo.get("stability", 0.4),
                "similarity_boost": 0.85,
                "style": vo.get("style", 0.2),
                "use_speaker_boost": True,
            },
        },
        timeout=120,
    )
    r.raise_for_status()
    out.write_bytes(r.content)


def cover_crop(img: Image.Image) -> Image.Image:
    sw, sh = img.size
    scale = max(W / sw, H / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - W) // 2
    top = (nh - H) // 2
    return img.crop((left, top, left + W, top + H))


def ken_burns_frames(base: Image.Image, duration: float, *, zoom_in: bool = True) -> list[np.ndarray]:
    n = max(1, int(math.ceil(duration * FPS)))
    frames: list[np.ndarray] = []
    z0, z1 = (1.0, 1.035) if zoom_in else (1.035, 1.0)
    for i in range(n):
        t = i / max(n - 1, 1)
        z = z0 + (z1 - z0) * t
        sw, sh = base.size
        cw, ch = int(W / z), int(H / z)
        left = max(0, min(sw - cw, (sw - cw) // 2))
        top = max(0, min(sh - ch, int((sh - ch) * 0.42)))
        crop = base.crop((left, top, left + cw, top + ch))
        frame = crop.resize((W, H), Image.Resampling.LANCZOS)
        frames.append(np.array(frame))
    return frames


def load_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD, size)


def end_card_frames() -> list[np.ndarray]:
    n = max(1, int(END_CARD * FPS))
    frames = []
    for _ in range(n):
        img = Image.new("RGB", (W, H), (232, 247, 240))
        draw = ImageDraw.Draw(img)
        for text, size, y, color in [
            ("🌿 Klid v kuchyni", 50, 240, (45, 154, 106)),
            ("4 týdny jídla · nákup v telefonu", 26, 308, (92, 92, 106)),
            ("297 Kč", 62, 388, (45, 154, 106)),
        ]:
            f = load_font(size)
            b = draw.textbbox((0, 0), text, font=f)
            draw.text(((W - b[2] + b[0]) // 2, y), text, font=f, fill=color)
        frames.append(np.array(img))
    return frames


def crossfade_merge(parts: list[list[np.ndarray]]) -> list[np.ndarray]:
    if not parts:
        return []
    out = list(parts[0])
    for part in parts[1:]:
        if len(out) >= FADE_FRAMES and len(part) >= FADE_FRAMES:
            tail = out[-FADE_FRAMES:]
            head = part[:FADE_FRAMES]
            for i in range(FADE_FRAMES):
                t = (i + 1) / FADE_FRAMES
                blend = (
                    tail[i].astype(np.float32) * (1 - t) + head[i].astype(np.float32) * t
                ).astype(np.uint8)
                out[-FADE_FRAMES + i] = blend
            out.extend(part[FADE_FRAMES:])
        else:
            out.extend(part)
    return out


def silence(sec: float, path: Path) -> None:
    subprocess.run(
        [ffmpeg(), "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(sec), str(path)],
        check=True,
        capture_output=True,
    )


def concat_audio(files: list[Path], out: Path) -> None:
    lst = TMP / "a.txt"
    lst.write_text("\n".join(f"file '{f.resolve()}'" for f in files), encoding="utf-8")
    subprocess.run(
        [ffmpeg(), "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)],
        check=True,
        capture_output=True,
    )


def mux(video: Path, audio: Path, out: Path) -> None:
    subprocess.run(
        [
            ffmpeg(),
            "-y",
            "-i",
            str(video),
            "-i",
            str(audio),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out),
        ],
        check=True,
        capture_output=True,
    )


# --- Grok ambient (optional) ---


def data_uri(path: Path) -> str:
    b64 = base64.b64encode(path.read_bytes()).decode()
    return f"data:image/jpeg;base64,{b64}"


def start_video(key: str, prompt: str, image: Path) -> str:
    r = requests.post(
        f"{API}/videos/generations",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": "grok-imagine-video",
            "prompt": prompt,
            "image": {"url": data_uri(image)},
            "duration": 6,
            "aspect_ratio": "16:9",
            "resolution": "720p",
        },
        timeout=120,
    )
    r.raise_for_status()
    return r.json()["request_id"]


def poll_video(key: str, request_id: str) -> str:
    for _ in range(150):
        r = requests.get(
            f"{API}/videos/{request_id}",
            headers={"Authorization": f"Bearer {key}"},
            timeout=60,
        )
        r.raise_for_status()
        d = r.json()
        if d.get("status") == "done":
            return d["video"]["url"]
        if d.get("status") in ("failed", "expired"):
            raise RuntimeError(d)
        time.sleep(5)
    raise TimeoutError(request_id)


def download(url: str, dest: Path) -> None:
    dest.write_bytes(requests.get(url, timeout=300).content)


def trim_grok_clip(src: Path, dest: Path, duration: float) -> None:
    subprocess.run(
        [
            ffmpeg(),
            "-y",
            "-i",
            str(src),
            "-an",
            "-vf",
            f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}",
            "-t",
            str(duration),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            str(dest),
        ],
        check=True,
        capture_output=True,
    )


def grok_frames(shot: dict, index: int, duration: float, xai: str) -> list[np.ndarray]:
    raw = TMP / f"grok-raw-{index:02d}.mp4"
    if not (raw.exists() and raw.stat().st_size > 10_000):
        print(f"  Grok ambient {index}/3…")
        rid = start_video(xai, shot["grok_prompt"], shot["image"])
        download(poll_video(xai, rid), raw)
    trim = TMP / f"grok-trim-{index:02d}.mp4"
    trim_grok_clip(raw, trim, duration)
    reader = iio.imiter(str(trim), plugin="pyav")
    return [np.array(Image.fromarray(fr).convert("RGB").resize((W, H))) for fr in reader]


def shot_duration(shot: dict, vo_d: float) -> float:
    return max(shot.get("min_duration", 5.0), vo_d + shot.get("pause_after", 0))


def build_shot_frames(shot: dict, index: int, vo_d: float, xai: str | None) -> list[np.ndarray]:
    duration = shot_duration(shot, vo_d)
    if MOTION == "grok-ambient" and xai:
        return grok_frames(shot, index, duration, xai)
    base = cover_crop(Image.open(shot["image"]).convert("RGB"))
    return ken_burns_frames(base, duration, zoom_in=(index % 2 == 1))


def main() -> None:
    load_env()
    TMP.mkdir(parents=True, exist_ok=True)

    if MOTION not in ("ken-burns", "grok-ambient"):
        raise SystemExit(f"Neznámý HERO_MOTION={MOTION!r} — použij ken-burns nebo grok-ambient")

    xai = xai_key() if MOTION == "grok-ambient" else None
    print(f"Režim: {MOTION} (VO = ElevenLabs, bez falešného lip-syncu)")

    frame_parts: list[list[np.ndarray]] = []
    audio_parts: list[Path] = []

    for i, shot in enumerate(SHOTS, 1):
        vo_path = TMP / f"vo-{i:02d}.mp3"
        elevenlabs_tts(shot["voiceover"], vo_path, shot.get("vo", {}))
        vo_d = probe_duration(vo_path)
        audio_parts.append(vo_path)

        pause = shot.get("pause_after", 0)
        if pause > 0:
            sil = TMP / f"sil-{i:02d}.mp3"
            silence(pause, sil)
            audio_parts.append(sil)

        frames = build_shot_frames(shot, i, vo_d, xai)
        frame_parts.append(frames)
        print(f"  Shot {i}: VO {vo_d:.1f}s → video {len(frames)/FPS:.1f}s — {shot['voiceover'][:40]}…")

    frame_parts.append(end_card_frames())
    silence(END_CARD, TMP / "sil-end.mp3")
    audio_parts.append(TMP / "sil-end.mp3")

    all_frames = crossfade_merge(frame_parts)
    silent = TMP / "silent.mp4"
    iio.imwrite(silent, all_frames, fps=FPS, codec="libx264", output_params=["-pix_fmt", "yuv420p"])

    full_a = TMP / "audio-full.mp3"
    concat_audio(audio_parts, full_a)
    mux(silent, full_a, OUT)

    cover_crop(Image.open(SHOTS[0]["image"]).convert("RGB")).save(POSTER, quality=90)
    print(f"Hotovo {OUT} — {probe_duration(OUT):.1f}s, {OUT.stat().st_size/1024/1024:.1f} MB")


if __name__ == "__main__":
    main()