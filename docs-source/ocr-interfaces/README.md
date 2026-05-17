# OCR Interface Document Source

This folder is the source area for official OCR interface PDFs.

## Structure

- `latest/pdf/`: latest PDF documents provided by the business or platform team.
- `latest/manifest.json`: mapping between PDF files, interface slugs, categories, and source status.
- `archive/YYYY-MM-DD/pdf/`: date-stamped snapshots of PDFs before future replacement.
- `extracted/`: reserved output folder for parsed PDF data, such as field tables and endpoint metadata.

## Update Flow

1. Put new official PDFs into `latest/pdf/`.
2. Update `latest/manifest.json` if filenames, interface names, or category mappings change.
3. Run the future sync script to parse PDFs and regenerate frontend data.
4. Review generated data before publishing the website.

The frontend should treat files in `latest/pdf/` as the current source of truth. Files in `archive/` are historical snapshots only.
