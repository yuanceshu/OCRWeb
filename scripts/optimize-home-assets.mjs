import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const assetDirs = {
  resources: path.join(root, "src", "assets", "resources"),
  thumbs: path.join(root, "src", "assets", "thumbs"),
  guides: path.join(root, "src", "assets", "guides", "ocr-activation"),
};

const textureWebpOptions = {
  quality: 92,
  alphaQuality: 100,
  effort: 6,
  smartSubsample: true,
};

const specimenWebpOptions = {
  quality: 95,
  alphaQuality: 100,
  effort: 6,
  smartSubsample: true,
};

const paperAlphaWebpOptions = {
  quality: 91,
  alphaQuality: 100,
  effort: 6,
  smartSubsample: true,
};

const decorAlphaWebpOptions = {
  quality: 93,
  alphaQuality: 100,
  effort: 6,
  smartSubsample: true,
};

const guideWebpOptions = {
  quality: 94,
  effort: 6,
  smartSubsample: true,
};

const runtimeThumbWebpOptions = {
  quality: 84,
  effort: 6,
  smartSubsample: true,
};

const pngCompressionOptions = {
  compressionLevel: 9,
  adaptiveFiltering: true,
  effort: 10,
};

function createTask(config) {
  return {
    removeSource: false,
    ...config,
  };
}

const resourcePaperTasks = [
  createTask({
    group: "resources-paper",
    directory: "resources",
    source: "paper-wide-alpha.png",
    target: "paper-wide-alpha.webp",
    format: "webp",
    options: paperAlphaWebpOptions,
  }),
  createTask({
    group: "resources-paper",
    directory: "resources",
    source: "paper-card-alpha.png",
    target: "paper-card-alpha.webp",
    format: "webp",
    options: paperAlphaWebpOptions,
  }),
  createTask({
    group: "resources-paper",
    directory: "resources",
    source: "home-header-paper-alpha.png",
    target: "home-header-paper-alpha.webp",
    format: "webp",
    options: paperAlphaWebpOptions,
  }),
  createTask({
    group: "resources-paper",
    directory: "resources",
    source: "home-index-paper-clean-alpha.png",
    target: "home-index-paper-clean-alpha.webp",
    format: "webp",
    options: paperAlphaWebpOptions,
  }),
];

const resourceDecorTasks = [
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "decor-compass-seal-alpha.png",
    format: "png",
    options: pngCompressionOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "decor-stamp-collected-alpha.png",
    format: "png",
    options: pngCompressionOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "decor-stamp-ring-alpha.png",
    format: "png",
    options: pngCompressionOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "decor-paperclip-alpha.png",
    target: "decor-paperclip-alpha.webp",
    format: "webp",
    options: decorAlphaWebpOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "home-record-tab-selected.png",
    target: "home-record-tab-selected.webp",
    format: "webp",
    options: decorAlphaWebpOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "home-compass-seal-faint-alpha.png",
    target: "home-compass-seal-faint-alpha.webp",
    format: "webp",
    options: decorAlphaWebpOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "home-hero-binder-top-alpha.png",
    target: "home-hero-binder-top-alpha.webp",
    format: "webp",
    options: decorAlphaWebpOptions,
  }),
  createTask({
    group: "resources-decor",
    directory: "resources",
    source: "home-hero-binder-bottom-alpha.png",
    target: "home-hero-binder-bottom-alpha.webp",
    format: "webp",
    options: decorAlphaWebpOptions,
  }),
];

const runtimeThumbTasks = [
  "account-opening-license-thumb.jpg",
  "bankcard-thumb.jpg",
  "barcode-ocr-thumb.jpg",
  "basic-deposit-account-thumb.jpg",
  "business-license-thumb.jpg",
  "customs-declaration-thumb.jpg",
  "driver-license-thumb.jpg",
  "export-license-thumb.jpg",
  "gat-pass-back-thumb.jpg",
  "gat-pass-front-thumb.jpg",
  "household-register-thumb.jpg",
  "idcard-thumb.jpg",
  "institution-legal-person-certificate-thumb.jpg",
  "itinerary-receipt-thumb.jpg",
  "mainland-travel-permit-for-gat-thumb.jpg",
  "marriage-certificate-thumb.jpg",
  "motor-vehicle-certificate-thumb.jpg",
  "motor-vehicle-invoice-thumb.jpg",
  "motor-vehicle-registration-certificate-thumb.jpg",
  "number-plates-thumb.jpg",
  "organization-code-certificate-thumb.jpg",
  "passport-thumb.jpg",
  "railway-eticket-thumb.jpg",
  "real-estate-certificate-thumb.jpg",
  "real-estate-registration-certificate-thumb.jpg",
  "receipt-ocr-thumb.jpg",
  "seal-ocr-thumb.jpg",
  "social-security-card-thumb.jpg",
  "taxi-invoice-thumb.jpg",
  "trade-in-recycle-voucher-thumb.jpg",
  "train-ticket-thumb.jpg",
  "universal-identification-handwriting-thumb.jpg",
  "universal-identification-text-thumb.jpg",
  "used-car-invoice-thumb.jpg",
  "vat-invoice-thumb.jpg",
  "vehicle-license-thumb.jpg",
  "vin-thumb.jpg",
].map((source) =>
  createTask({
    group: "thumbs-runtime",
    directory: "thumbs",
    source,
    target: source.replace(".jpg", ".webp"),
    format: "webp",
    options: runtimeThumbWebpOptions,
    resize: {
      width: 480,
      withoutEnlargement: true,
    },
  }),
);

const guideImageTasks = [
  "image1.png",
  "image2.png",
  "image3.png",
  "image4.png",
  "image5.png",
].map((source) =>
  createTask({
    group: "guide-images",
    directory: "guides",
    source,
    target: source.replace(".png", ".webp"),
    format: "webp",
    options: guideWebpOptions,
  }),
);

const tasks = [
  ...resourcePaperTasks,
  ...resourceDecorTasks,
  ...runtimeThumbTasks,
  ...guideImageTasks,
];

const availableGroups = [...new Set(tasks.map((task) => task.group))];

function parseArgs(argv) {
  const options = {
    reportOnly: false,
    groups: [],
    help: false,
  };

  for (const arg of argv) {
    if (arg === "--report") {
      options.reportOnly = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg.startsWith("--groups=")) {
      options.groups.push(...arg.slice("--groups=".length).split(",").map((value) => value.trim()).filter(Boolean));
      continue;
    }

    if (arg.startsWith("--group=")) {
      const value = arg.slice("--group=".length).trim();
      if (value) {
        options.groups.push(value);
      }
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function selectTasks(selectedGroups) {
  if (selectedGroups.length === 0) {
    return tasks;
  }

  const invalidGroups = selectedGroups.filter((group) => !availableGroups.includes(group));
  if (invalidGroups.length > 0) {
    throw new Error(`Unknown group(s): ${invalidGroups.join(", ")}`);
  }

  const selectedGroupSet = new Set(selectedGroups);
  return tasks.filter((task) => selectedGroupSet.has(task.group));
}

function resolveAssetPath(task, fileName) {
  return path.join(assetDirs[task.directory], fileName);
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

function formatChange(beforeBytes, afterBytes) {
  const delta = afterBytes - beforeBytes;
  const ratio = beforeBytes === 0 ? 0 : ((delta / beforeBytes) * 100).toFixed(1);
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatBytes(delta)} (${sign}${ratio}%)`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getSize(filePath) {
  return (await fs.stat(filePath)).size;
}

function applyResize(pipeline, resize) {
  if (!resize) {
    return pipeline;
  }

  return pipeline.resize({
    fit: "inside",
    ...resize,
  });
}

async function writeOutput(pipeline, task, outputPath) {
  switch (task.format) {
    case "webp":
      await pipeline.webp(task.options).toFile(outputPath);
      return;
    case "png":
      await pipeline.png(task.options).toFile(outputPath);
      return;
    case "jpeg":
      await pipeline.jpeg(task.options).toFile(outputPath);
      return;
    default:
      throw new Error(`Unsupported format: ${task.format}`);
  }
}

async function optimizeTask(task, reportOnly) {
  const sourcePath = resolveAssetPath(task, task.source);
  const targetName = task.target ?? task.source;
  const targetPath = resolveAssetPath(task, targetName);
  const sourceExists = await exists(sourcePath);
  const targetExists = sourcePath === targetPath ? sourceExists : await exists(targetPath);

  if (!sourceExists) {
    if (sourcePath !== targetPath && targetExists) {
      return {
        group: task.group,
        source: task.source,
        target: targetName,
        status: "already optimized",
        beforeBytes: 0,
        afterBytes: await getSize(targetPath),
      };
    }

    return {
      group: task.group,
      source: task.source,
      target: targetName,
      status: "missing",
      beforeBytes: 0,
      afterBytes: 0,
    };
  }

  const beforeBytes = await getSize(sourcePath);
  const tempPath = `${targetPath}.tmp`;
  let pipeline = sharp(sourcePath);
  pipeline = applyResize(pipeline, task.resize);

  await fs.rm(tempPath, { force: true });
  await writeOutput(pipeline, task, tempPath);

  const afterBytes = await getSize(tempPath);

  if (reportOnly) {
    await fs.rm(tempPath, { force: true });
    return {
      group: task.group,
      source: task.source,
      target: targetName,
      status: "report",
      beforeBytes,
      afterBytes,
    };
  }

  await fs.rename(tempPath, targetPath);

  if (sourcePath !== targetPath && task.removeSource) {
    await fs.unlink(sourcePath);
  }

  return {
    group: task.group,
    source: task.source,
    target: targetName,
    status: targetExists ? "updated" : "optimized",
    beforeBytes,
    afterBytes,
  };
}

function printHelp() {
  console.log("Runtime asset optimization");
  console.log("");
  console.log("Usage:");
  console.log("  node scripts/optimize-home-assets.mjs [--report] [--groups=a,b]");
  console.log("");
  console.log(`Available groups: ${availableGroups.join(", ")}`);
}

function printReport(results, reportOnly, selectedGroups) {
  const actionableStatuses = new Set(reportOnly ? ["report"] : ["optimized", "updated"]);
  const actionable = results.filter((result) => actionableStatuses.has(result.status));
  const skipped = results.filter((result) => !actionableStatuses.has(result.status));
  const totalBefore = actionable.reduce((sum, result) => sum + result.beforeBytes, 0);
  const totalAfter = actionable.reduce((sum, result) => sum + result.afterBytes, 0);
  const groups = selectedGroups.length > 0 ? selectedGroups : availableGroups;

  console.log(reportOnly ? "Runtime asset optimization report (dry run)" : "Runtime asset optimization report");
  console.log(`Groups: ${groups.join(", ")}`);
  console.log("");

  for (const group of groups) {
    const groupResults = results.filter((result) => result.group === group);
    if (groupResults.length === 0) {
      continue;
    }

    console.log(`[${group}]`);
    for (const result of groupResults) {
      if (actionableStatuses.has(result.status)) {
        console.log(
          `${result.source} -> ${result.target}: ${formatBytes(result.beforeBytes)} -> ${formatBytes(
            result.afterBytes,
          )} [${formatChange(result.beforeBytes, result.afterBytes)}]`,
        );
      } else {
        const detail =
          result.status === "missing"
            ? "source and target are both absent"
            : `current size ${formatBytes(result.afterBytes)}`;
        console.log(`${result.source} -> ${result.target}: skipped (${result.status}, ${detail})`);
      }
    }
    console.log("");
  }

  console.log(
    `${reportOnly ? "Projected" : "Processed"} ${actionable.length} assets: ${formatBytes(totalBefore)} -> ${formatBytes(
      totalAfter,
    )} [${formatChange(totalBefore, totalAfter)}]`,
  );

  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} assets.`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const selectedTasks = selectTasks(options.groups);
  const results = [];

  for (const task of selectedTasks) {
    results.push(await optimizeTask(task, options.reportOnly));
  }

  printReport(results, options.reportOnly, options.groups);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
