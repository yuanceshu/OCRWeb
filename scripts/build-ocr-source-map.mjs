import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "docs-source", "ocr-interfaces", "latest");
const manifestPath = path.join(sourceRoot, "manifest.json");
const pdfRoot = path.join(sourceRoot, "pdf");
const extractedRoot = path.join(sourceRoot, "extracted");
const outputPath = path.join(extractedRoot, "interface-source-map.json");
const generatedTsPath = path.join(root, "src", "data", "generated", "interfaceSourceMap.generated.ts");
const catalogPath = path.join(root, "src", "data", "ocrDocs.ts");

const testHost = "https://test-api-open.chinaums.com";
const prodHost = "https://api-lob.open.chinaums.com";

const endpoints = (urlPath, options = {}) => [
  { environment: "test", url: `${testHost}${urlPath}` },
  { environment: "production", url: `${options.prodHost ?? prodHost}${urlPath}` },
];

const prodOnly = (urlPath) => [{ environment: "production", url: `${prodHost}${urlPath}` }];

const interfaces = [
  {
    slug: "idcard",
    title: "二代证（人像页+国徽页）",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/idcard"),
  },
  {
    slug: "bankcard",
    title: "银行卡",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/bankcard"),
  },
  {
    slug: "social-security-card",
    title: "社保卡",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/sbk"),
  },
  {
    slug: "vat-invoice",
    title: "增值税发票",
    category: "发票票据类",
    primarySourceId: "vat-invoice",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/vatinvoice"),
  },
  {
    slug: "train-ticket",
    title: "火车票",
    category: "发票票据类",
    primarySourceId: "railway-eticket",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/electrain"),
  },
  {
    slug: "taxi-invoice",
    title: "出租车票",
    category: "发票票据类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/taxi-invoice"),
  },
  {
    slug: "receipt-ocr",
    title: "小票识别",
    category: "发票票据类",
    primarySourceId: "receipt-and-registration",
    endpoints: endpoints("/v1/brain/ocr/customized-ocr/receipt"),
  },
  {
    slug: "itinerary-receipt",
    title: "航空电子行程单",
    category: "发票票据类",
    primarySourceId: "itinerary-receipt",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/elec-air-common"),
  },
  {
    slug: "railway-eticket",
    title: "铁路电子客票识别服务",
    category: "发票票据类",
    primarySourceId: "railway-eticket",
    endpoints: endpoints("/v1/brain/ocr/electrain"),
  },
  {
    slug: "financial-ticket-mixed",
    title: "财务票据混合识别",
    category: "发票票据类",
    primarySourceId: "financial-ticket-mixed",
    endpoints: prodOnly("/v1/brain/ocr/passable-bill/identify"),
  },
  {
    slug: "handwritten-signature",
    title: "手写签名识别",
    category: "发票票据类",
    primarySourceId: "financial-ticket-mixed",
    endpoints: prodOnly("/v1/brain/ocr/handwritten-signature/identify"),
  },
  {
    slug: "business-license",
    title: "营业执照",
    category: "商户经营类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/license"),
  },
  {
    slug: "account-opening-license",
    title: "开户许可",
    category: "商户经营类",
    primarySourceId: "basic-deposit-account",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/basicdepositaccount"),
  },
  {
    slug: "basic-deposit-account",
    title: "基本存款账户信息",
    category: "商户经营类",
    primarySourceId: "basic-deposit-account",
    endpoints: endpoints("/v1/brain/ocr/basicdepositaccount"),
  },
  {
    slug: "institution-legal-person-certificate",
    title: "事业单位法人证书",
    category: "商户经营类",
    primarySourceId: "business-institution-certificate",
    endpoints: endpoints("/v1/brain/ocr/legalpersoncert"),
  },
  {
    slug: "seal-ocr",
    title: "印章识别",
    category: "商户经营类",
    primarySourceId: "seal-ocr",
    endpoints: endpoints("/v1/brain/ocr/stamprec"),
  },
  {
    slug: "number-plates",
    title: "车牌识别",
    category: "车辆交通类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/number-plates"),
  },
  {
    slug: "driver-license",
    title: "驾驶证识别",
    category: "车辆交通类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/driver-license"),
  },
  {
    slug: "vehicle-license",
    title: "行驶证识别",
    category: "车辆交通类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/vehicle-license"),
  },
  {
    slug: "vin",
    title: "VIN",
    category: "车辆交通类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/vin"),
  },
  {
    slug: "motor-vehicle-certificate",
    title: "机动车合格证",
    category: "车辆交通类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/motor-vehicle-certificate"),
  },
  {
    slug: "motor-vehicle-registration-certificate",
    title: "机动车登记证识别",
    category: "车辆交通类",
    primarySourceId: "receipt-and-registration",
    endpoints: endpoints("/v1/brain/ocr/customized-ocr/vichle-reg-cert"),
  },
  {
    slug: "trade-in-recycle-voucher",
    title: "以旧换新回收凭单识别",
    category: "车辆交通类",
    primarySourceId: "receipt-and-registration",
    endpoints: endpoints("/v1/brain/ocr/customized-ocr/recycle-voucher"),
  },
  {
    slug: "motor-vehicle-invoice",
    title: "机动车发票",
    category: "车辆交通类",
    primarySourceId: "motor-vehicle-invoice",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/elecvehicleinvoice"),
  },
  {
    slug: "used-car-invoice",
    title: "二手车发票",
    category: "车辆交通类",
    primarySourceId: "used-car-invoice",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/elecusedcarinvoice", {
      prodHost: "https://api-lob-wh.open.chinaums.com",
    }),
  },
  {
    slug: "electric-bicycle-certificate",
    title: "电动自行车合格证",
    category: "车辆交通类",
    primarySourceId: "ebike-motorcycle-certificate",
    endpoints: endpoints("/v1/brain/ocr/elecbicyclecert"),
  },
  {
    slug: "motorcycle-certificate",
    title: "摩托车合格证",
    category: "车辆交通类",
    primarySourceId: "ebike-motorcycle-certificate",
    endpoints: endpoints("/v1/brain/ocr/elecmotorcert"),
  },
  {
    slug: "passport",
    title: "护照",
    category: "证照身份类",
    primarySourceId: "passport-permits-organization-export",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/passport-v2"),
  },
  {
    slug: "household-register",
    title: "户口本",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/household-register"),
  },
  {
    slug: "marriage-certificate",
    title: "结婚证",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/marriage-certificate"),
  },
  {
    slug: "mainland-travel-permit-for-gat",
    title: "港澳台居民来往大陆通行证",
    category: "证照身份类",
    primarySourceId: "passport-permits-organization-export",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/mainland-travel-permit"),
  },
  {
    slug: "organization-code-certificate",
    title: "组织机构代码证",
    category: "证照身份类",
    primarySourceId: "passport-permits-organization-export",
    endpoints: endpoints("/v1/brain/ocr/organization-code"),
  },
  {
    slug: "export-license",
    title: "中国出口许可证",
    category: "证照身份类",
    primarySourceId: "passport-permits-organization-export",
    endpoints: endpoints("/v1/brain/ocr/export-license"),
  },
  {
    slug: "gat-pass-front",
    title: "往来港澳通行证正面",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/gat-pass-front"),
  },
  {
    slug: "gat-pass-back",
    title: "往来港澳通行证背面",
    category: "证照身份类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/gat-pass-back"),
  },
  {
    slug: "universal-identification-text",
    title: "通用识别-文本",
    category: "通用文本类",
    primarySourceId: "general-text-simple",
    additionalSourceIds: ["ocr-26-products-v2-1", "paddleocr-general"],
    endpoints: endpoints("/v1/brain/ocr/universal-text"),
  },
  {
    slug: "universal-identification-handwriting",
    title: "通用识别-手写",
    category: "通用文本类",
    primarySourceId: "ocr-26-products-v2-1",
    endpoints: endpoints("/v1/brain/ocr/universal-identification-handwriting"),
  },
  {
    slug: "paddleocr-general",
    title: "PaddleOCR通用识别",
    category: "通用文本类",
    primarySourceId: "paddleocr-general",
    endpoints: endpoints("/v1/brain/ocr/general-rec"),
  },
  {
    slug: "barcode-ocr",
    title: "条形码识别",
    category: "通用文本类",
    primarySourceId: "barcode-ocr",
    endpoints: endpoints("/v1/brain/ocr/qr-code"),
  },
  {
    slug: "real-estate-certificate",
    title: "不动产权证",
    category: "地产凭证类",
    primarySourceId: "real-estate-certificate",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/house-ownership"),
  },
  {
    slug: "real-estate-registration-certificate",
    title: "不动产登记证",
    category: "地产凭证类",
    primarySourceId: "real-estate-certificate",
    additionalSourceIds: ["ocr-26-products-v2-1"],
    endpoints: endpoints("/v1/brain/ocr/house-ownership"),
  },
  {
    slug: "tax-payment-certificate",
    title: "完税证明",
    category: "发票票据类",
    primarySourceId: "tax-payment-certificate",
    endpoints: endpoints("/v1/brain/ocr/payment-certificate"),
  },
  {
    slug: "departure-tax-refund",
    title: "离境退税申请单",
    category: "发票票据类",
    primarySourceId: "departure-tax-refund",
    endpoints: endpoints("/v1/brain/ocr/taxrefundform"),
  },
  {
    slug: "customs-declaration",
    title: "海关报关单",
    category: "发票票据类",
    primarySourceId: "customs-declaration",
    endpoints: endpoints("/v1/brain/ocr/commercial-invoice"),
  },
];

const sourceFor = (sourceMap, sourceId) => {
  const source = sourceMap.get(sourceId);
  if (!source) {
    throw new Error(`Unknown sourceId: ${sourceId}`);
  }
  return source;
};

const compactSource = (source) => ({
  sourceId: source.sourceId,
  title: source.title,
  file: source.file,
  status: source.status,
});

const parseCatalog = async () => {
  const source = await fs.readFile(catalogPath, "utf8");
  const match = source.match(
    /const interfaceCatalogSeed: InterfaceCardSeed\[\] = \[([\s\S]*?)\];\s*\n\nexport const interfaceCatalog:/,
  );
  if (!match) {
    throw new Error("Could not locate interfaceCatalogSeed in src/data/ocrDocs.ts");
  }

  const catalog = [];
  const objectPattern =
    /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"[\s\S]*?status:\s*"([^"]+)"[\s\S]*?\}/g;
  let item;
  while ((item = objectPattern.exec(match[1]))) {
    catalog.push({
      slug: item[1],
      title: item[2],
      status: item[3],
    });
  }
  return catalog;
};

const main = async () => {
  const shouldValidateCatalog = process.argv.includes("--check-catalog");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const sourceMap = new Map(manifest.documents.map((source) => [source.sourceId, source]));

  await fs.mkdir(extractedRoot, { recursive: true });

  const missingPdfs = [];
  for (const source of manifest.documents) {
    try {
      await fs.access(path.join(pdfRoot, source.file));
    } catch {
      missingPdfs.push(source.file);
    }
  }
  if (missingPdfs.length) {
    throw new Error(`Missing source PDFs:\n${missingPdfs.map((file) => `- ${file}`).join("\n")}`);
  }

  const duplicateSlugs = interfaces
    .map((item) => item.slug)
    .filter((slug, index, all) => all.indexOf(slug) !== index);
  if (duplicateSlugs.length) {
    throw new Error(`Duplicate interface slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
  }

  const extracted = {
    version: manifest.version,
    sourceDirectory: manifest.sourceDirectory,
    generatedBy: "scripts/build-ocr-source-map.mjs",
    interfaceCount: interfaces.length,
    interfaces: interfaces.map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      primarySource: compactSource(sourceFor(sourceMap, item.primarySourceId)),
      additionalSources: (item.additionalSourceIds ?? []).map((sourceId) =>
        compactSource(sourceFor(sourceMap, sourceId)),
      ),
      endpoints: item.endpoints,
    })),
  };

  await fs.writeFile(outputPath, `${JSON.stringify(extracted, null, 2)}\n`, "utf8");
  const generatedTs = `/* eslint-disable */
// AUTO-GENERATED by scripts/build-ocr-source-map.mjs
// Source: docs-source/ocr-interfaces/latest/manifest.json

export type InterfaceSourceEnvironment = "test" | "production";

export interface GeneratedEndpointRecord {
  environment: InterfaceSourceEnvironment;
  url: string;
}

export interface GeneratedSourceDocument {
  sourceId: string;
  title: string;
  file: string;
  status: string;
}

export interface GeneratedInterfaceSourceRecord {
  slug: string;
  title: string;
  category: string;
  primarySource: GeneratedSourceDocument;
  additionalSources: GeneratedSourceDocument[];
  endpoints: GeneratedEndpointRecord[];
}

export const interfaceSourceMapVersion = ${JSON.stringify(manifest.version)};

export const interfaceSources = ${JSON.stringify(extracted.interfaces, null, 2)} as const satisfies readonly GeneratedInterfaceSourceRecord[];

export const interfaceSourceBySlug = Object.fromEntries(
  interfaceSources.map((item) => [item.slug, item]),
) as Record<string, GeneratedInterfaceSourceRecord>;
`;
  await fs.mkdir(path.dirname(generatedTsPath), { recursive: true });
  await fs.writeFile(generatedTsPath, generatedTs, "utf8");
  console.log(`Wrote ${path.relative(root, outputPath)}`);
  console.log(`Wrote ${path.relative(root, generatedTsPath)}`);
  console.log(`Interface sources: ${extracted.interfaceCount}`);

  if (shouldValidateCatalog) {
    const catalog = await parseCatalog();
    const expected = new Map(extracted.interfaces.map((item) => [item.slug, item]));
    const actual = new Map(catalog.map((item) => [item.slug, item]));

    const missing = [...expected.keys()].filter((slug) => !actual.has(slug));
    const extra = [...actual.keys()].filter((slug) => !expected.has(slug));
    const titleMismatches = [...expected.values()]
      .filter((item) => actual.has(item.slug) && actual.get(item.slug).title !== item.title)
      .map((item) => ({
        slug: item.slug,
        expected: item.title,
        actual: actual.get(item.slug).title,
      }));

    if (missing.length || extra.length || titleMismatches.length) {
      console.log("\nCatalog validation failed.");
      if (missing.length) console.log(`Missing in catalog: ${missing.join(", ")}`);
      if (extra.length) console.log(`Extra in catalog: ${extra.join(", ")}`);
      if (titleMismatches.length) {
        console.log(
          `Title mismatches: ${titleMismatches
            .map((item) => `${item.slug} expected ${item.expected}, got ${item.actual}`)
            .join("; ")}`,
        );
      }
      process.exitCode = 1;
      return;
    }

    console.log("Catalog validation passed.");
    console.log(`Catalog interfaces: ${catalog.length}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
