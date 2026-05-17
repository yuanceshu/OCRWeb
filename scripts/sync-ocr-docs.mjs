import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "docs-source", "ocr-interfaces");
const manifestPath = path.join(sourceRoot, "latest", "manifest.json");
const pdfRoot = path.join(sourceRoot, "latest", "pdf");

async function main() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const files = await fs.readdir(pdfRoot);
  const pdfFiles = new Set(files.filter((file) => file.toLowerCase().endsWith(".pdf")));
  const missing = manifest.documents.filter((document) => !pdfFiles.has(document.file));
  const unmapped = [...pdfFiles].filter(
    (file) => !manifest.documents.some((document) => document.file === file),
  );

  console.log(`OCR source version: ${manifest.version}`);
  console.log(`Manifest documents: ${manifest.documents.length}`);
  console.log(`PDF files: ${pdfFiles.size}`);

  if (missing.length) {
    console.log("\nMissing PDFs:");
    for (const document of missing) {
      console.log(`- ${document.file}`);
    }
  }

  if (unmapped.length) {
    console.log("\nUnmapped PDFs:");
    for (const file of unmapped) {
      console.log(`- ${file}`);
    }
  }

  if (!missing.length && !unmapped.length) {
    console.log("\nSource manifest is aligned with latest/pdf.");
  }

  console.log("\nPDF parsing and frontend data generation are intentionally not implemented yet.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
