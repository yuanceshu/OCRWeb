# OCR Interface Atlas

OCR Interface Atlas is a Vite + React + TypeScript single-page site for displaying OCR interface capabilities, field definitions, sample visual references, request parameters, response structures, and related interface documentation.

The site is designed as a front-end documentation and atlas experience. It does not provide upload, online debugging, API invocation, real sample data, or credential storage.

## Project Structure

- `src/`: application source, data model, styles, and visual assets.
- `docs-source/ocr-interfaces/latest/`: canonical latest OCR interface PDFs and manifest used as source material.
- `scripts/sync-ocr-docs.mjs`: checks the latest OCR document source directory and manifest alignment.
- `DESIGN.md`: global design direction and implementation rules.
- `交付/`: handoff deliverables such as the Word design document; generated preview screenshots are ignored by Git.

## Commands

```bash
npm install
npm run build
npm run sync:ocr-docs
npm run dev
```

For a simple static preview after build:

```bash
npm run serve:static
```

## Versioning Notes

The repository intentionally ignores local drop-zones, historical reference folders, generated screenshots, build output, logs, and dependencies. Add new official OCR interface PDFs to `docs-source/ocr-interfaces/latest/pdf/` and update the manifest before committing a new documentation version.
