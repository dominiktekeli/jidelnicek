#!/usr/bin/env python3
"""Hero UGC: 3 shots, titulky, voiceover, fade přechody, závěrečná karta."""
from __future__ import annotations

import asyncio
import math
import subprocess
from pathlib import Path

import edge_tts
import imageio
import imageio.v3 as iio
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_VIDEO = ROOT / "images" / "hero-video.mp4"
OUT_POSTER = ROOT / "images" / "hero-video-poster.jpg"
TMP = ROOT / "scripts" / ".ugc-tmp"

W, H = 1280, 720
FPS = 24
FADE_FRAMES = 14
VOICE = "cs-CZ-VlastaNeural"
RATE = "+4%"

# Fotky od uživatele — titulky už jsou v obraze (burned-in).
SHOTS = [
    {
        "img": "images/shot-1-fridge.jpg",
        "voiceover": "Už zase nevím, co budu vařit… Pořád to samý.",
        "pause_after": 1.5,
        "min_duration": 5.0,
        "burned_subtitles": True,
    },
    {
        "img": "images/shot-2-phone.jpg",
        "voiceover": "Našla jsem tohle… 4 týdny hotových jídel s nákupními seznamy.",
        "pause_after": 1.0,
        "min_duration": 5.0,
        "burned_subtitles": True,
    },
    {
        "img": "images/shot-3-coffee.jpg",
        "voiceover": "Teď už mám konečně klid v kuchyni.",
        "min_duration": 6.0,
        "burned_subtitles": True,
        "price_at": 2.0,
        "price_subtitle": "297 Kč",
    },
]

END_CARD_DURATION = 2.8

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def mp3_duration(path: Path) -> float:
    ffmpeg = imageio.plugins.ffmpeg.get_exe()
    proc = subprocess.run(
        [ffmpeg, "-i", str(path), "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    for line in proc.stderr.splitlines():
        if "Duration:" in line:
            part = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = part.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"Cannot read duration: {path}")


def make_silence(seconds: float, out: Path) -> None:
    ffmpeg = imageio.plugins.ffmpeg.get_exe()
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            str(seconds),
            "-q:a",
            "9",
            str(out),
        ],
        check=True,
        capture_output=True,
    )


async def synth_voice(text: str, out: Path) -> None:
    await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(out))


def cover_crop(img: Image.Image) -> Image.Image:
    sw, sh = img.size
    scale = max(W / sw, H / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - W) // 2
    top = (nh - H) // 2
    return img.crop((left, top, left + W, top + H))


def contain_frame(img: Image.Image) -> Image.Image:
    base = Image.new("RGB", (W, H), (255, 248, 243))
    sw, sh = img.size
    scale = min(W * 0.8 / sw, H * 0.84 / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x, y = (W - nw) // 2, (H - nh) // 2 - 12
    base.paste(resized, (x, y))
    return base


def draw_subtitle_bar(
    frame: Image.Image,
    lines: list[str],
    *,
    accent: str | None = None,
) -> Image.Image:
    draw = ImageDraw.Draw(frame, "RGBA")
    font_main = load_font(32, bold=True)
    font_price = load_font(40, bold=True) if accent else font_main

    line_heights = []
    line_widths = []
    for i, line in enumerate(lines):
        font = font_price if accent and i == len(lines) - 1 and line == accent else font_main
        bbox = draw.textbbox((0, 0), line, font=font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])

    pad_y = 16
    gap = 10
    bar_h = pad_y * 2 + sum(line_heights) + gap * max(0, len(lines) - 1)
    y0 = H - bar_h - 28

    draw.rounded_rectangle(
        (56, y0, W - 56, H - 28),
        radius=16,
        fill=(18, 24, 22, 215),
    )

    y = y0 + pad_y
    for i, line in enumerate(lines):
        font = font_price if accent and line == accent else font_main
        fill = (94, 207, 154, 255) if accent and line == accent else (255, 255, 255, 255)
        tw = line_widths[i]
        draw.text(((W - tw) // 2, y), line, font=font, fill=fill)
        y += line_heights[i] + gap

    return frame


def load_base(rel: str, fit: str | None) -> Image.Image:
    raw = Image.open(ROOT / rel).convert("RGB")
    return contain_frame(raw) if fit == "contain" else cover_crop(raw)


def ken_burns_frames(
    base: Image.Image,
    duration: float,
    subtitle_lines: list[str] | None = None,
    *,
    zoom_in: bool = True,
) -> list[np.ndarray]:
    n = max(1, int(math.ceil(duration * FPS)))
    frames: list[np.ndarray] = []
    z0, z1 = (1.0, 1.04) if zoom_in else (1.04, 1.0)
    lines = subtitle_lines or []
    for i in range(n):
        t = i / max(n - 1, 1)
        z = z0 + (z1 - z0) * t
        sw, sh = base.size
        cw, ch = int(W / z), int(H / z)
        left = max(0, min(sw - cw, (sw - cw) // 2))
        top = max(0, min(sh - ch, int((sh - ch) * 0.42)))
        crop = base.crop((left, top, left + cw, top + ch))
        frame = crop.resize((W, H), Image.Resampling.LANCZOS)
        if lines:
            frame = draw_subtitle_bar(
                frame,
                lines,
                accent=lines[-1] if lines and "Kč" in lines[-1] else None,
            )
        frames.append(np.array(frame))
    return frames


def shot_frames(shot: dict, vo_duration: float) -> list[np.ndarray]:
    base = load_base(shot["img"], shot.get("fit"))
    duration = max(shot.get("min_duration", 5.0), vo_duration + shot.get("pause_after", 0))
    burned = shot.get("burned_subtitles", False)
    price = shot.get("price_subtitle")
    price_at = shot.get("price_at", 0)

    if burned and not price:
        return ken_burns_frames(base, duration, None)

    if burned and price:
        split = max(0.0, duration - price_at)
        part_a = ken_burns_frames(base, split, None)
        part_b = ken_burns_frames(base, price_at, [price])
        return part_a + part_b

    sub = shot.get("subtitle", "")
    if not price:
        return ken_burns_frames(base, duration, [sub] if sub else None)
    split = max(0.0, duration - price_at)
    part_a = ken_burns_frames(base, split, [sub])
    part_b = ken_burns_frames(base, price_at, [sub, price])
    return part_a + part_b


def end_card_frames() -> list[np.ndarray]:
    n = max(1, int(END_CARD_DURATION * FPS))
    frames: list[np.ndarray] = []
    for _ in range(n):
        img = Image.new("RGB", (W, H), (255, 248, 243))
        draw = ImageDraw.Draw(img)
        draw.rectangle((0, 0, W, H), fill=(232, 247, 240))
        draw.ellipse((W // 2 - 280, 80, W // 2 + 280, 640), fill=(212, 245, 230))

        title_font = load_font(52, bold=True)
        sub_font = load_font(28, bold=False)
        price_font = load_font(64, bold=True)

        title = "🌿 Klid v kuchyni"
        sub = "4 týdny jídla · nákup v telefonu"
        price = "297 Kč"

        for text, font, y, color in [
            (title, title_font, 220, (45, 154, 106)),
            (sub, sub_font, 300, (92, 92, 106)),
            (price, price_font, 380, (45, 154, 106)),
        ]:
            bbox = draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
            draw.text(((W - tw) // 2, y), text, font=font, fill=color)

        frames.append(np.array(img))
    return frames


def crossfade_merge(all_parts: list[list[np.ndarray]]) -> list[np.ndarray]:
    if not all_parts:
        return []
    out = list(all_parts[0])
    for part in all_parts[1:]:
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


def concat_audio(paths: list[Path], out: Path) -> None:
    ffmpeg = imageio.plugins.ffmpeg.get_exe()
    list_file = TMP / "audio-list.txt"
    list_file.write_text(
        "\n".join(f"file '{p.resolve()}'" for p in paths),
        encoding="utf-8",
    )
    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(out)],
        check=True,
        capture_output=True,
    )


def mux(video: Path, audio: Path, out: Path) -> None:
    ffmpeg = imageio.plugins.ffmpeg.get_exe()
    subprocess.run(
        [
            ffmpeg,
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
            "128k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out),
        ],
        check=True,
        capture_output=True,
    )


async def main_async() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    audio_parts: list[Path] = []
    frame_parts: list[list[np.ndarray]] = []

    for idx, shot in enumerate(SHOTS):
        vo_path = TMP / f"vo-{idx:02d}.mp3"
        await synth_voice(shot["voiceover"], vo_path)
        vo_dur = mp3_duration(vo_path)
        audio_parts.append(vo_path)

        pause = shot.get("pause_after", 0)
        if pause > 0:
            sil = TMP / f"silence-{idx:02d}.mp3"
            make_silence(pause, sil)
            audio_parts.append(sil)

        frames = shot_frames(shot, vo_dur)
        frame_parts.append(frames)
        label = shot.get("subtitle") or Path(shot["img"]).name
        print(f"Shot {idx + 1}: {len(frames)/FPS:.1f}s — {label}")

    frame_parts.append(end_card_frames())
    end_sil = TMP / "silence-end.mp3"
    make_silence(END_CARD_DURATION, end_sil)
    audio_parts.append(end_sil)

    all_frames = crossfade_merge(frame_parts)
    silent = TMP / "silent.mp4"
    iio.imwrite(silent, all_frames, fps=FPS, codec="libx264", output_params=["-pix_fmt", "yuv420p"])

    full_audio = TMP / "full-audio.mp3"
    concat_audio(audio_parts, full_audio)
    mux(silent, full_audio, OUT_VIDEO)

    Image.fromarray(all_frames[0]).save(OUT_POSTER, quality=92)
    total = len(all_frames) / FPS
    print(f"Done: {OUT_VIDEO} ({total:.1f}s, {OUT_VIDEO.stat().st_size/1024/1024:.1f} MB)")


def main() -> None:
    asyncio.run(main_async())


if __name__ == "__main__":
    main()