#!/usr/bin/env python3
"""Build browser-ready 4004 mask textures from the public analyzer archive.

Usage:
  python3 scripts/prepare-4004-mask-assets.py /path/to/i400x_analyzer_20210324.zip

Requires Pillow. The source archive is not covered by this repository's MIT license.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


EXPECTED_ARCHIVE_SHA256 = "ddd22144d497ba24732b9d316fc499e7bea0b244b77c76f5cbd97cd48cf319bf"
SOURCE_SIZE = (1968, 2706)
OUTPUT_SIZE = (984, 1353)

LAYER_SPECS = (
    ("diffusion", "i4004-diffusion.bmp", (132, 184, 139), 190),
    ("buried-contact", "i4004-contacts.bmp", (232, 195, 105), 225),
    ("polysilicon", "i4004-poly.bmp", (227, 109, 85), 215),
    ("contact-vias", "i4004-vias.bmp", (202, 189, 255), 245),
    ("metal", "i4004-metal.bmp", (119, 167, 217), 235),
)

# Openings are aligned to the bond-pad shapes in i4004-metal.bmp. The two G
# pads are intentionally both retained; the die artwork contains 17 pads even
# though the package exposes 16 pins.
PASSIVATION_OPENINGS = (
    (150, 15, 320, 145),
    (555, 15, 705, 145),
    (960, 15, 1110, 145),
    (1195, 15, 1320, 145),
    (1545, 15, 1690, 145),
    (1810, 280, 1968, 420),
    (1810, 545, 1968, 710),
    (1835, 1860, 1968, 2035),
    (1835, 2330, 1968, 2505),
    (1190, 2585, 1350, 2706),
    (735, 2585, 885, 2706),
    (465, 2585, 630, 2706),
    (125, 2585, 285, 2706),
    (0, 2045, 130, 2225),
    (0, 1720, 130, 1900),
    (0, 1365, 130, 1540),
    (0, 340, 130, 515),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def layer_image(source: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    grayscale = source.convert("L")
    if grayscale.size != SOURCE_SIZE:
        raise ValueError(f"Unexpected mask dimensions: {grayscale.size}")
    alpha = ImageOps.invert(grayscale).resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
    result = Image.new("RGBA", OUTPUT_SIZE, (*color, 0))
    result.putalpha(alpha)
    return result


def passivation_image() -> Image.Image:
    result = Image.new("RGBA", OUTPUT_SIZE, (158, 216, 192, 58))
    draw = ImageDraw.Draw(result)
    scale_x = OUTPUT_SIZE[0] / SOURCE_SIZE[0]
    scale_y = OUTPUT_SIZE[1] / SOURCE_SIZE[1]
    for left, top, right, bottom in PASSIVATION_OPENINGS:
        draw.rectangle(
            (
                round(left * scale_x),
                round(top * scale_y),
                round(right * scale_x),
                round(bottom * scale_y),
            ),
            fill=(0, 0, 0, 0),
        )
    return result


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Pass the path to i400x_analyzer_20210324.zip")

    archive_path = Path(sys.argv[1]).resolve()
    if sha256(archive_path) != EXPECTED_ARCHIVE_SHA256:
        raise SystemExit("Source archive checksum does not match the reviewed 2021-03-24 package")

    project_root = Path(__file__).resolve().parents[1]
    output_root = project_root / "public" / "historical" / "4004"
    layers_root = output_root / "layers"
    layers_root.mkdir(parents=True, exist_ok=True)

    generated: dict[str, str] = {}
    composite = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))

    with zipfile.ZipFile(archive_path) as archive:
        for layer_id, source_name, color, composite_alpha in LAYER_SPECS:
            with archive.open(source_name) as source_handle:
                with Image.open(source_handle) as source_image:
                    rendered = layer_image(source_image, color)
            target = layers_root / f"{layer_id}.png"
            rendered.save(target, optimize=True)
            generated[target.name] = sha256(target)

            overlay = rendered.copy()
            alpha = overlay.getchannel("A").point(lambda value: value * composite_alpha // 255)
            overlay.putalpha(alpha)
            composite.alpha_composite(overlay)

        passivation = passivation_image()
        passivation_target = layers_root / "passivation-reconstruction.png"
        passivation.save(passivation_target, optimize=True)
        generated[passivation_target.name] = sha256(passivation_target)
        composite.alpha_composite(passivation)

        composite_target = layers_root / "composite.png"
        composite.save(composite_target, optimize=True)
        generated[composite_target.name] = sha256(composite_target)

        with archive.open("license.txt") as license_handle:
            with (output_root / "Intel-IPNC-License.txt").open("wb") as target_handle:
                shutil.copyfileobj(license_handle, target_handle)

    manifest = {
        "source": "https://www.4004.com/assets/i400x_analyzer_20210324.zip",
        "sourceSha256": EXPECTED_ARCHIVE_SHA256,
        "sourceDimensions": list(SOURCE_SIZE),
        "renderDimensions": list(OUTPUT_SIZE),
        "geometryChanges": "Uniform 50% raster resampling only; no crop, rotation, or per-layer translation.",
        "archiveCorrectedLayers": [spec[0] for spec in LAYER_SPECS],
        "teachingReconstruction": "passivation-reconstruction.png uses openings aligned to metal-layer bond pads.",
        "generatedSha256": generated,
    }
    (output_root / "SOURCE.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

