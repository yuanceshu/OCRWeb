import { spawn } from "node:child_process";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, firefox, webkit } from "playwright";

const root = process.cwd();
const port = Number(process.env.PC_COMPAT_PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;
const finalOutputRoot = path.resolve(
  root,
  process.env.PC_COMPAT_OUTPUT_DIR || ".codex-screens/pc-compat/latest",
);
const outputRoot = `${finalOutputRoot}.tmp`;

const allBrowsers = [
  { name: "chromium", type: chromium },
  { name: "webkit", type: webkit },
  { name: "firefox", type: firefox },
];
const requestedBrowsers = (
  process.env.PC_COMPAT_BROWSERS || allBrowsers.map((browser) => browser.name).join(",")
)
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);
const browsers = requestedBrowsers.map((browserName) => {
  const browser = allBrowsers.find((candidate) => candidate.name === browserName);
  if (!browser) {
    throw new Error(
      `Unknown browser "${browserName}". Use one or more of: ${allBrowsers
        .map((candidate) => candidate.name)
        .join(", ")}`,
    );
  }

  return browser;
});

const viewports = [
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1536x864", width: 1536, height: 864 },
  { name: "1600x900", width: 1600, height: 900 },
  { name: "1728x1117", width: 1728, height: 1117 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
];

const routes = [
  { name: "home", path: "/" },
  { name: "activation-guide", path: "/activation-guide" },
  { name: "detail-idcard", path: "/interfaces/idcard" },
  { name: "detail-vat-invoice", path: "/interfaces/vat-invoice" },
  { name: "detail-business-license", path: "/interfaces/business-license" },
];

const viteBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vite.cmd" : "vite",
);

function startPreview() {
  const child = spawn(viteBin, ["preview", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  return child;
}

async function waitForPreview() {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < 30_000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Unexpected preview status ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Vite preview did not start at ${baseUrl}: ${lastError?.message || "timeout"}`);
}

function normalizeIssue(result, message) {
  result.issues.push(message);
  console.warn(`  ! ${message}`);
}

async function inspectLayout(page, routePath, result) {
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const horizontalOverflow = Math.max(body.scrollWidth, doc.scrollWidth) - doc.clientWidth;
    const heroRail = document.querySelector(
      ".home-hero > .home-specimen-rail:not(.home-specimen-rail-mobile)",
    );
    const cards = Array.from(heroRail?.querySelectorAll(".home-specimen-card") ?? []).map(
      (card) => {
        const rect = card.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          display: window.getComputedStyle(card).display,
        };
      },
    );
    const specimens = Array.from(heroRail?.querySelectorAll(".home-doc-specimen.hero") ?? []).map(
      (specimen) => {
        const rect = specimen.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          display: window.getComputedStyle(specimen).display,
        };
      },
    );

    return {
      horizontalOverflow,
      cards,
      specimens,
    };
  });

  result.metrics = metrics;

  if (metrics.horizontalOverflow > 2) {
    normalizeIssue(result, `horizontal overflow ${Math.round(metrics.horizontalOverflow)}px`);
  }

  if (routePath === "/") {
    if (metrics.cards.length !== 4) {
      normalizeIssue(result, `expected 4 home specimen cards, found ${metrics.cards.length}`);
    }

    metrics.cards.forEach((card, index) => {
      const ratio = card.height / Math.max(card.width, 1);
      if (card.display === "none") {
        normalizeIssue(result, `home specimen card ${index + 1} is hidden on a PC viewport`);
      }
      if (card.width < 112 || card.height < 190 || ratio < 1.05 || ratio > 2.45) {
        normalizeIssue(
          result,
          `home specimen card ${index + 1} unstable size ${Math.round(card.width)}x${Math.round(
            card.height,
          )}`,
        );
      }
    });

    metrics.specimens.forEach((specimen, index) => {
      if (specimen.width < 48 || specimen.height < 40) {
        normalizeIssue(
          result,
          `home document specimen ${index + 1} collapsed to ${Math.round(
            specimen.width,
          )}x${Math.round(specimen.height)}`,
        );
      }
    });
  }
}

async function captureBrowser(browserSpec, results) {
  console.log(`\n${browserSpec.name}`);
  const browser = await browserSpec.type.launch(
    browserSpec.name === "chromium" && process.env.PC_COMPAT_USE_SYSTEM_CHROME === "1"
      ? { channel: "chrome" }
      : undefined,
  );

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });

      try {
        const page = await context.newPage();

        for (const route of routes) {
          const result = {
            browser: browserSpec.name,
            viewport: viewport.name,
            route: route.path,
            screenshot: path.join(browserSpec.name, route.name, `${viewport.name}.png`),
            issues: [],
          };
          const targetUrl = new URL(route.path, baseUrl).toString();
          const screenshotPath = path.join(outputRoot, result.screenshot);

          console.log(`  ${viewport.name} ${route.path}`);
          await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
          await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
          await page.addStyleTag({
            content:
              "*,*::before,*::after{transition-duration:0s!important;animation-duration:0s!important;animation-delay:0s!important;}",
          });
          await inspectLayout(page, route.path, result);
          await mkdir(path.dirname(screenshotPath), { recursive: true });
          await page.screenshot({ path: screenshotPath, fullPage: true });
          results.push(result);
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const preview = startPreview();
  const stopPreview = () => {
    if (!preview.killed) {
      preview.kill("SIGTERM");
    }
  };

  process.on("exit", stopPreview);
  process.on("SIGINT", () => {
    stopPreview();
    process.exit(130);
  });

  const results = [];

  try {
    await waitForPreview();

    for (const browser of browsers) {
      await captureBrowser(browser, results);
    }
  } finally {
    stopPreview();
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    outputRoot: finalOutputRoot,
    routes,
    viewports,
    browsers: browsers.map((browser) => browser.name),
    results,
  };

  await writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2));

  const issueCount = results.reduce((count, result) => count + result.issues.length, 0);

  if (issueCount > 0) {
    throw new Error(`PC compatibility capture finished with ${issueCount} layout issue(s)`);
  }

  await rm(finalOutputRoot, { recursive: true, force: true });
  await rename(outputRoot, finalOutputRoot);
  console.log(`\nPC compatibility screenshots written to ${finalOutputRoot}`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  if (/Executable doesn't exist|browserType.launch/.test(error.message)) {
    console.error("Run: npx playwright install chromium firefox webkit");
  }
  process.exit(1);
});
