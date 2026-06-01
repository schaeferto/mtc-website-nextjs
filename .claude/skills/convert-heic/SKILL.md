# Convert HEIC images to JPEG

Convert one or more HEIC files to JPEG using sips (conversion) and ffmpeg (resize + quality).

Usage: /convert-heic [path or glob, default: *.HEIC in current directory]

## Steps

1. Check if the user provided a path argument (`$ARGUMENTS`). If not, default to `*.HEIC` in the current working directory.

2. For each HEIC file, run a two-step pipeline:

**Step 1 — Convert with sips** (handles tile grids and EXIF rotation correctly):
```bash
sips -s format jpeg "$f" --out "${f%.*}.jpg"
```

**Step 2 — Resize and compress with ffmpeg** (caps longest edge at 2000px, ~95% quality):
```bash
ffmpeg -y -i "${f%.*}.jpg" \
  -vf "scale='if(gt(iw,ih),min(2000,iw),-2)':'if(gt(iw,ih),-2,min(2000,ih))'" \
  -q:v 2 "${f%.*}_out.jpg" \
  && mv "${f%.*}_out.jpg" "${f%.*}.jpg"
```
- The scale filter caps the **longest** edge at 2000px and calculates the other dimension proportionally
- `-q:v 2` — JPEG quality ~95% (scale 1–31, lower is better)
- The temp `_out` file avoids reading and writing the same file simultaneously

Full loop:
```bash
for f in <pattern>; do
  sips -s format jpeg "$f" --out "${f%.*}.jpg" \
    && ffmpeg -y -i "${f%.*}.jpg" \
         -vf "scale='if(gt(iw,ih),min(2000,iw),-2)':'if(gt(iw,ih),-2,min(2000,ih))'" \
         -q:v 2 "${f%.*}_out.jpg" \
    && mv "${f%.*}_out.jpg" "${f%.*}.jpg" \
    && echo "✓ $f → ${f%.*}.jpg"
done
```

3. Report how many files were converted and their output sizes (`du -sh`).
