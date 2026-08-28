#!/usr/bin/env python3
"""Compose Oliver QHVH 1200×630 share card from the real logo + exact Vietnamese copy."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace")
LOGO_SRC = ROOT / "public" / "oliver-logo.png"
FONT_DIR = ROOT / ".grok" / "fonts"
OUT_PNG = ROOT / ".grok" / "og-card-raw.png"

W, H = 2400, 1260  # 2× 1200×630 — ffmpeg cover-crops to exact size
NAVY = (14, 42, 71)
NAVY_2 = (22, 56, 95)
NAVY_DEEP = (8, 26, 46)
GOLD = (196, 162, 101)
GOLD_2 = (168, 132, 61)
PAPER = (246, 244, 239)
TEAL = (27, 107, 99)
WHITE = (255, 255, 255)

TITLE = "Bộ tiêu chuẩn quản lý vận hành"
SUBTITLE = "Oliver Vietnam  ·  OLV-QHXH-TCQT-01"


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def gradient_bg() -> Image.Image:
    img = Image.new("RGB", (W, H), NAVY)
    px = img.load()
    for y in range(H):
        ty = y / (H - 1)
        row_a = lerp(NAVY_DEEP, NAVY, ty)
        row_b = lerp(NAVY, NAVY_2, ty)
        for x in range(W):
            tx = x / (W - 1)
            r, g, b = lerp(row_a, row_b, tx)
            cx = x / W - 0.5
            cy = y / H - 0.5
            vig = 1.0 - 0.22 * ((cx * cx * 1.4 + cy * cy) ** 0.5)
            px[x, y] = (
                max(0, min(255, int(r * vig))),
                max(0, min(255, int(g * vig))),
                max(0, min(255, int(b * vig))),
            )
    return img


def gold_logo(max_width: int) -> Image.Image:
    src = Image.open(LOGO_SRC).convert("RGBA")
    alpha = src.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        src = src.crop(bbox)
    pixels = src.load()
    for y in range(src.height):
        for x in range(src.width):
            _r, _g, _b, a = pixels[x, y]
            if a:
                pixels[x, y] = (*GOLD, a)
    ratio = max_width / src.width
    size = (max_width, max(1, int(src.height * ratio)))
    return src.resize(size, Image.Resampling.LANCZOS)


def rounded_frame(overlay: Image.Image, margin: int, radius: int, width: int, fill: tuple) -> None:
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        [margin, margin, W - margin, H - margin],
        radius=radius,
        outline=fill,
        width=width,
    )


def ornament_rings(overlay: Image.Image) -> None:
    draw = ImageDraw.Draw(overlay)
    # Cover-card rings (app chrome language): top-right + bottom-left.
    draw.ellipse([W - 360, -220, W + 200, 340], outline=(*GOLD, 46), width=36)
    draw.ellipse([W - 300, -160, W + 140, 280], outline=(*GOLD, 28), width=18)
    draw.ellipse([-220, H - 340, 280, H + 160], outline=(*TEAL, 38), width=28)
    draw.ellipse([-160, H - 280, 220, H + 100], outline=(*GOLD, 22), width=14)


def hairline(draw: ImageDraw.ImageDraw, cx: int, y: int, half: int, color: tuple) -> None:
    draw.line([(cx - half, y), (cx + half, y)], fill=color, width=2)
    # Small gold diamond at the center of the rule.
    d = 8
    draw.polygon(
        [(cx, y - d), (cx + d, y), (cx, y + d), (cx - d, y)],
        fill=GOLD,
    )


def text_size(font: ImageFont.FreeTypeFont, text: str) -> tuple[int, int]:
    bb = font.getbbox(text)
    return bb[2] - bb[0], bb[3] - bb[1]


def draw_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    cy: int,
    font: ImageFont.FreeTypeFont,
    fill: tuple,
    tracking: int = 0,
) -> int:
    """Draw text centered at (W/2, cy). Returns the rendered height."""
    if tracking == 0:
        draw.text((W // 2, cy), text, font=font, fill=fill, anchor="mm")
        _w, h = text_size(font, text)
        return h
    widths = []
    for ch in text:
        if ch == " ":
            widths.append(max(8, font.getlength(" ") or 12))
        else:
            widths.append(font.getlength(ch))
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for ch, tw in zip(text, widths):
        draw.text((x, cy), ch, font=font, fill=fill, anchor="lm")
        x += tw + tracking
    _w, h = text_size(font, text)
    return h


def main() -> None:
    img = gradient_bg().convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ornament_rings(overlay)
    rounded_frame(overlay, 48, 28, 3, (*GOLD, 150))
    rounded_frame(overlay, 60, 22, 1, (*GOLD, 70))
    img = Image.alpha_composite(img, overlay)

    logo = gold_logo(820)
    # Soft gold glow behind the mark so it lifts off navy.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gx = (W - logo.width) // 2
    # Lockup is vertically centered as a block.
    title_font = ImageFont.truetype(str(FONT_DIR / "BeVietnamPro-ExtraBold.ttf"), 88)
    sub_font = ImageFont.truetype(str(FONT_DIR / "BeVietnamPro-SemiBold.ttf"), 36)

    title_w, title_h = text_size(title_font, TITLE)
    sub_h = text_size(sub_font, SUBTITLE)[1]

    gap_logo_rule = 44
    rule_h = 16
    gap_rule_title = 40
    gap_title_sub = 28
    lockup_h = logo.height + gap_logo_rule + rule_h + gap_rule_title + title_h + gap_title_sub + sub_h
    y0 = (H - lockup_h) // 2

    # Glow blob behind logo
    blob = Image.new("RGBA", (logo.width + 160, logo.height + 120), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blob)
    bd.ellipse([0, 0, blob.width, blob.height], fill=(*GOLD, 28))
    blob = blob.filter(ImageFilter.GaussianBlur(40))
    glow.alpha_composite(blob, (gx - 80, y0 - 60))
    img = Image.alpha_composite(img, glow)

    img.alpha_composite(logo, (gx, y0))

    draw = ImageDraw.Draw(img)
    rule_y = y0 + logo.height + gap_logo_rule + rule_h // 2
    hairline(draw, W // 2, rule_y, 160, (*GOLD, 220))

    title_cy = rule_y + rule_h // 2 + gap_rule_title + title_h // 2
    draw_centered(draw, TITLE, title_cy, title_font, PAPER)

    sub_cy = title_cy + title_h // 2 + gap_title_sub + sub_h // 2
    draw_centered(draw, SUBTITLE, sub_cy, sub_font, GOLD, tracking=3)

    rgb = img.convert("RGB")
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(OUT_PNG, "PNG")
    print(f"wrote {OUT_PNG} {rgb.size}")


if __name__ == "__main__":
    main()
