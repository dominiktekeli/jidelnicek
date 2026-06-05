#!/usr/bin/env python3
"""Build hero UGC-style video with burned-in Czech captions."""
from __future__ import annotations

import math
from pathlib import Path

import imageio.v3 as iio
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "hero-video.mp4"
POSTER = ROOT / "images" / "hero-video-poster.jpg"

W, H = 1280, 720
FPS = 24

SCENES = [
    {
        "file": "images/mom-stressed.jpg",
        "duration": 4.0,
        "lines": ["Je 17:00.", "Zase nevím, co vařit."],
        "zoom": (1.0, 1.08),
    },
    {
        "file": "images/app-ukazka.png",
        "duration": 4.5,
        "lines": ["4 týdny hotový jídelníček.", "Oběd, večeře i nákup v telefonu."],
        "zoom": (1.02, 1.0),
        "fit": "contain",
    },
    {
        "file": "images/hero-food.jpg",
        "duration": 3.5,
        "lines": ["České rodinné recepty.", "Víš co vaříš — bez paniky."],
        "zoom": (1.0, 1.06),
    },
    {
        "file": "images/mom-calm.jpg",
        "duration": 4.0,
        "lines": ["Klid v kuchyni.", "297 Kč jednou · bez předplatného"],
        "zoom": (1.0, 1.05),
    },
]

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REG
    return ImageFont.truetype(path, size)


def cover_crop(img: Image.Image, tw: int, th: int) -> Image.Image:
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return img.crop((left, top, left + tw, top + th))


def contain_frame(img: Image.Image, tw: int, th: int) -> Image.Image:
    base = Image.new("RGB", (tw, th), (255, 248, 243))
    sw, sh = img.size
    scale = min(tw * 0.72 / sw, th * 0.88 / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (tw - nw) // 2
    y = (th - nh) // 2 - 20
    if img.mode == "RGBA":
        base.paste(resized, (x, y), resized)
    else:
        base.paste(resized, (x, y))
    return base


def draw_caption_bar(frame: Image.Image, lines: list[str]) -> Image.Image:
    draw = ImageDraw.Draw(frame, "RGBA")
    bar_h = 150
    y0 = H - bar_h
    draw.rectangle((0, y0, W, H), fill=(20, 30, 28, 200))
    draw.rectangle((0, y0, W, y0 + 4), fill=(94, 207, 154, 255))

    title_font = load_font(42, bold=True)
    sub_font = load_font(30, bold=False)
    y = y0 + 22
    for i, line in enumerate(lines):
        font = title_font if i == 0 else sub_font
        fill = (255, 255, 255, 255) if i == 0 else (220, 235, 228, 255)
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, y), line, font=font, fill=fill)
        y += (bbox[3] - bbox[1]) + (10 if i == 0 else 6)
    return frame


def ken_burns_frame(base: Image.Image, t: float, z0: float, z1: float) -> Image.Image:
    z = z0 + (z1 - z0) * t
    sw, sh = base.size
    cw, ch = int(W / z), int(H / z)
    left = max(0, min(sw - cw, (sw - cw) // 2))
    top = max(0, min(sh - ch, int((sh - ch) * 0.42)))
    crop = base.crop((left, top, left + cw, top + ch))
    return crop.resize((W, H), Image.Resampling.LANCZOS)


def scene_frames(scene: dict) -> list[np.ndarray]:
    path = ROOT / scene["file"]
    raw = Image.open(path).convert("RGBA" if str(path).endswith(".png") else "RGB")
    if scene.get("fit") == "contain":
        base = contain_frame(raw, W, H)
    else:
        base = cover_crop(raw.convert("RGB"), W, H)

    n = max(1, int(scene["duration"] * FPS))
    z0, z1 = scene.get("zoom", (1.0, 1.04))
    frames: list[np.ndarray] = []
    for i in range(n):
        t = i / max(n - 1, 1)
        frame = ken_burns_frame(base, t, z0, z1)
        frame = draw_caption_bar(frame, scene["lines"])
        frames.append(np.array(frame))
    return frames


def crossfade(a: np.ndarray, b: np.ndarray, steps: int) -> list[np.ndarray]:
    out: list[np.ndarray] = []
    for i in range(steps):
        t = (i + 1) / steps
        blend = (a.astype(np.float32) * (1 - t) + b.astype(np.float32) * t).astype(np.uint8)
        out.append(blend)
    return out


def main() -> None:
    all_frames: list[np.ndarray] = []
    fade_steps = 10

    for idx, scene in enumerate(SCENES):
        frames = scene_frames(scene)
        if idx == 0:
            all_frames.extend(frames)
            continue
        if len(all_frames) >= fade_steps:
            tail = all_frames[-fade_steps:]
            head = frames[:fade_steps]
            merged = crossfade(tail[0], head[0], fade_steps)
            for i in range(fade_steps):
                all_frames[-fade_steps + i] = merged[i]
        all_frames.extend(frames[fade_steps:])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    iio.imwrite(
        OUT,
        all_frames,
        fps=FPS,
        codec="libx264",
        output_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )
    Image.fromarray(all_frames[0]).save(POSTER, quality=92)
    print(f"Wrote {OUT} ({len(all_frames)} frames, {len(all_frames)/FPS:.1f}s)")
    print(f"Wrote {POSTER}")


if __name__ == "__main__":
    main()