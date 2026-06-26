# OCR Interface Atlas

OCR Interface Atlas is a Vite + React + TypeScript single-page site for displaying OCR interface capabilities, field definitions, sample visual references, request parameters, response structures, and related interface documentation.

The site is designed as a front-end documentation and atlas experience. It does not provide upload, online debugging, API invocation, real sample data, or credential storage.

## Project Structure

- `src/`: application source, data model, styles, and visual assets.
- `docs-source/ocr-interfaces/latest/`: canonical latest OCR interface PDFs and manifest used as source material.
- `scripts/sync-ocr-docs.mjs`: checks the latest OCR document source directory and manifest alignment.
- `src/data/generated/`: generated catalog/source maps consumed by the frontend.
- `.agents/`: project-level Codex skills and agent guidance that should travel with the repository.
- `PROJECT_VISION.md`: distilled product positioning and experience principles for future design/product work.
- `DESIGN.md`: global design direction and implementation rules.
- `交付/`: handoff deliverables such as the Word design document; generated preview screenshots are ignored by Git.

## Commands

```bash
npm install
npm run build
npm run sync:ocr-docs
npm run validate:ocr-catalog
npm run dev
```

For a simple static preview after build:

```bash
npm run serve:static
```

## First Run On macOS

If this folder was copied from Windows, do not reuse the copied `node_modules/`
folder. Install macOS dependencies from the lockfile instead:

```bash
rm -rf node_modules
npm ci
npm run build
```

This project currently needs Node.js `20.19+` or `22.12+` because
`@vitejs/plugin-react` declares that range. Install Xcode Command Line Tools as
well so Git and the system Python tools work normally on a new Mac.

This workspace can also use a project-local Node installation at `.tools/node`.
On a new Mac before system `npm` is available, run commands like this:

```bash
export PATH="$PWD/.tools/node/bin:$PATH"
npm ci
npm run build
npm run dev
```

## Versioning Notes

The repository intentionally ignores local drop-zones, historical reference folders, generated screenshots, build output, logs, and dependencies. Add new official OCR interface PDFs to `docs-source/ocr-interfaces/latest/pdf/` and update the manifest before committing a new documentation version.

Runtime image references should prefer WebP assets. The paired `src/assets/thumbs/*.jpg` files are kept as the current approved thumbnail baselines, while the application imports the corresponding `*.webp` files. Some checked-in runtime textures and specimen images are WebP-only; `npm run optimize:home-assets` only regenerates assets whose PNG/JPG source masters remain in the repository.
