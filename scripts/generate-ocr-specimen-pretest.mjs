import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("output/ocr-specimen-pretest");

const commonDefs = `
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#3b2c1c" flood-opacity="0.18"/>
    </filter>
    <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="13"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.52 0 0 0 0 0.46 0 0 0 0 0.34 0 0 0 0.11 0"/>
    </filter>
    <pattern id="idFineLines" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M0 17 C 9 10, 25 10, 34 17 M0 29 C 11 22, 23 22, 34 29" fill="none" stroke="#7aa7c5" stroke-width="0.7" opacity="0.2"/>
      <path d="M17 0 C 10 9, 10 25, 17 34 M29 0 C 22 11, 22 23, 29 34" fill="none" stroke="#e19499" stroke-width="0.55" opacity="0.12"/>
    </pattern>
    <pattern id="licenseGuilloche" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M0 26 C13 6,39 6,52 26 C39 46,13 46,0 26Z" fill="none" stroke="#b98655" stroke-width="0.7" opacity="0.16"/>
      <path d="M26 0 C46 13,46 39,26 52 C6 39,6 13,26 0Z" fill="none" stroke="#b98655" stroke-width="0.7" opacity="0.1"/>
    </pattern>
    <pattern id="blueLedger" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M0 28H28V0" fill="none" stroke="#3e6f9a" stroke-width="0.55" opacity="0.13"/>
    </pattern>
    <radialGradient id="idGlow" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#e8f3fb" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#d9e7f0" stop-opacity="0.95"/>
    </radialGradient>
    <linearGradient id="licensePaper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff6df"/>
      <stop offset="54%" stop-color="#f8e8bd"/>
      <stop offset="100%" stop-color="#efdbab"/>
    </linearGradient>
    <linearGradient id="ledgerPaper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fbf5e8"/>
      <stop offset="58%" stop-color="#f3ead7"/>
      <stop offset="100%" stop-color="#e8dcc5"/>
    </linearGradient>
  </defs>
`;

const commonStyle = `
  <style>
    svg { background: transparent; }
    .hei { font-family: "PingFang SC", "Heiti SC", "Noto Sans CJK SC", sans-serif; }
    .song { font-family: "Songti SC", "STSong", "SimSun", serif; }
    .label { fill: #3b4b5b; font-size: 24px; font-weight: 700; letter-spacing: 0.08em; }
    .value { fill: #141d26; font-size: 30px; font-weight: 600; }
    .small { fill: #4f5c66; font-size: 20px; }
    .micro { fill: #5f6870; font-size: 16px; letter-spacing: 0.05em; }
    .tableLabel { fill: #29465f; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; }
    .tableValue { fill: #121820; font-size: 23px; font-weight: 600; }
    .id-title { fill: #182433; font-size: 42px; font-weight: 800; letter-spacing: 0.2em; }
    .license-title { fill: #7b1f18; font-size: 64px; font-weight: 900; letter-spacing: 0.28em; }
    .ledger-title { fill: #143b58; font-size: 48px; font-weight: 900; letter-spacing: 0.18em; }
    .stampText { fill: #b0191e; font-size: 58px; font-weight: 900; letter-spacing: 0.1em; opacity: 0.62; }
    .stampTextBlue { fill: #17588a; font-size: 46px; font-weight: 900; letter-spacing: 0.08em; opacity: 0.62; }
    .watermark { fill: #b0191e; font-size: 76px; font-weight: 900; letter-spacing: 0.13em; opacity: 0.18; }
    .watermarkBlue { fill: #17588a; font-size: 64px; font-weight: 900; letter-spacing: 0.12em; opacity: 0.16; }
  </style>
`;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svg(width, height, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${commonDefs}
${commonStyle}
${body}
</svg>
`;
}

function rect(x, y, width, height, attrs = "") {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${attrs}/>`;
}

function line(x1, y1, x2, y2, attrs = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`;
}

function text(x, y, value, className = "hei value", attrs = "") {
  const lines = Array.isArray(value) ? value : [value];
  if (lines.length === 1) {
    return `<text x="${x}" y="${y}" class="${className}" ${attrs}>${escapeXml(lines[0])}</text>`;
  }

  const tspans = lines
    .map((lineValue, index) => {
      const dy = index === 0 ? 0 : 34;
      return `<tspan x="${x}" dy="${dy}">${escapeXml(lineValue)}</tspan>`;
    })
    .join("");
  return `<text x="${x}" y="${y}" class="${className}" ${attrs}>${tspans}</text>`;
}

function labelValue(x, y, label, value, valueClass = "hei value") {
  return `
    ${text(x, y, label, "hei label")}
    ${text(x + 112, y, value, valueClass)}
  `;
}

function invalidQr(x, y, size, cells = 9) {
  const cell = size / cells;
  const blocks = [];
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const marker =
        row < 3 && col < 3
          ? row === 0 || col === 0 || row === 2 || col === 2
          : (row * 7 + col * 11) % 5 < 2;
      if (marker) {
        blocks.push(
          rect(x + col * cell, y + row * cell, cell * 0.78, cell * 0.78, 'fill="#26313a" opacity="0.78"'),
        );
      }
    }
  }

  return `
    ${rect(x - 8, y - 8, size + 16, size + 16, 'fill="#fff8e9" stroke="#8a6a40" stroke-width="2"')}
    ${blocks.join("\n")}
    ${text(x + size / 2, y + size + 34, "不可扫描示意码", "hei micro", 'text-anchor="middle"')}
  `;
}

function circleStamp(cx, cy, radius, label = "SAMPLE 示例章") {
  return `
    <g opacity="0.72">
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#b0191e" stroke-width="7" stroke-dasharray="18 10"/>
      <circle cx="${cx}" cy="${cy}" r="${radius - 18}" fill="none" stroke="#b0191e" stroke-width="3" opacity="0.62"/>
      ${text(cx, cy + 12, label, "hei stampTextBlue", 'text-anchor="middle" font-size="34" fill="#b0191e"')}
    </g>
  `;
}

function generateIdcardSvg() {
  const frontX = 82;
  const backX = 818;
  const y = 138;
  const cardW = 660;
  const cardH = 420;

  const cardBase = (x) => `
    <g filter="url(#softShadow)">
      ${rect(x, y, cardW, cardH, 'rx="34" fill="url(#idGlow)" stroke="#b5c9d8" stroke-width="2.4"')}
      ${rect(x + 10, y + 10, cardW - 20, cardH - 20, 'rx="28" fill="url(#idFineLines)" opacity="0.82"')}
      ${rect(x + 18, y + 18, cardW - 36, cardH - 36, 'rx="22" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"')}
      ${rect(x, y, cardW, cardH, 'rx="34" filter="url(#paperGrain)" opacity="0.58"')}
    </g>
  `;

  const portrait = `
    <g>
      ${rect(frontX + 458, y + 92, 142, 184, 'rx="12" fill="#d8e3ea" stroke="#6f8ca3" stroke-width="2" opacity="0.96"')}
      <circle cx="${frontX + 529}" cy="${y + 152}" r="34" fill="#8ea9bb" opacity="0.82"/>
      <path d="M${frontX + 471} ${y + 254} C${frontX + 485} ${y + 205}, ${frontX + 574} ${y + 205}, ${frontX + 588} ${y + 254}Z" fill="#7896aa" opacity="0.8"/>
      ${text(frontX + 529, y + 306, "虚构头像", "hei micro", 'text-anchor="middle"')}
    </g>
  `;

  const abstractEmblem = `
    <g transform="translate(${backX + 330} ${y + 88})" opacity="0.72">
      <circle r="50" fill="none" stroke="#bd2a25" stroke-width="7"/>
      <circle r="31" fill="none" stroke="#bd2a25" stroke-width="3"/>
      <path d="M0 -42 L10 -11 L42 -11 L16 7 L26 38 L0 20 L-26 38 L-16 7 L-42 -11 L-10 -11Z" fill="#bd2a25" opacity="0.22"/>
      <path d="M-55 56H55" stroke="#bd2a25" stroke-width="6" stroke-linecap="round"/>
    </g>
  `;

  return svg(
    1520,
    720,
    `
    ${cardBase(frontX)}
    ${cardBase(backX)}

    ${portrait}
    ${labelValue(frontX + 54, y + 84, "姓名", "示例样本")}
    ${labelValue(frontX + 54, y + 136, "性别", "X")}
    ${labelValue(frontX + 254, y + 136, "民族", "XX")}
    ${labelValue(frontX + 54, y + 188, "出生", "19XX年XX月XX日")}
    ${text(frontX + 54, y + 240, "住址", "hei label")}
    ${text(frontX + 166, y + 240, ["XX省XX市XX区XX路XX号", "XX小区X栋X单元XXX室"], "hei value")}
    ${text(frontX + 54, y + 358, "公民身份号码", "hei label")}
    ${text(frontX + 250, y + 360, "000000000000000000", "hei value")}
    ${text(frontX + 330, y + 226, "SAMPLE 示例", "hei watermark", 'text-anchor="middle" transform="rotate(-19 412 364)"')}

    ${abstractEmblem}
    ${text(backX + 330, y + 206, "中华人民共和国居民身份证", "song id-title", 'text-anchor="middle"')}
    ${labelValue(backX + 92, y + 292, "签发机关", "示例公安机关")}
    ${labelValue(backX + 92, y + 350, "有效期限", "1900.00.00-长期")}
    ${text(backX + 330, y + 270, "非真实证件", "hei stampTextBlue", 'text-anchor="middle" opacity="0.24"')}
    ${text(backX + 330, y + 408, "仅供字段来源示意", "hei stampTextBlue", 'text-anchor="middle"')}

    ${text(760, 660, "身份证双面 OCR 样张：字段清晰、号码全 0、纹章抽象化、不可作为真实证件", "hei small", 'text-anchor="middle"')}
  `,
  );
}

function generateBusinessLicenseSvg() {
  const x = 96;
  const y = 70;
  const w = 850;
  const h = 1180;
  const fieldX = x + 92;
  const valueX = x + 308;

  const field = (rowY, label, value, size = 27) => `
    ${text(fieldX, rowY, label, "song label")}
    ${text(valueX, rowY, value, "song value", `font-size="${size}"`)}
    ${line(fieldX, rowY + 15, x + w - 86, rowY + 15, 'stroke="#9b7a4c" stroke-width="1.2" opacity="0.36"')}
  `;

  return svg(
    1040,
    1340,
    `
    <g filter="url(#softShadow)">
      ${rect(x, y, w, h, 'rx="12" fill="url(#licensePaper)" stroke="#8d5f32" stroke-width="3"')}
      ${rect(x + 22, y + 22, w - 44, h - 44, 'rx="6" fill="url(#licenseGuilloche)" opacity="0.88"')}
      ${rect(x + 30, y + 30, w - 60, h - 60, 'rx="4" fill="none" stroke="#8f552a" stroke-width="4"')}
      ${rect(x + 48, y + 48, w - 96, h - 96, 'fill="none" stroke="#b78950" stroke-width="1.6" stroke-dasharray="10 8" opacity="0.7"')}
      ${rect(x, y, w, h, 'rx="12" filter="url(#paperGrain)" opacity="0.5"')}
    </g>

    ${text(x + 70, y + 96, "统一社会信用代码：91500000MA0EXAMPLE1X", "hei small")}
    ${invalidQr(x + 684, y + 78, 112, 9)}
    ${text(x + w / 2, y + 198, "营业执照", "song license-title", 'text-anchor="middle"')}
    ${text(x + w / 2, y + 246, "仅供 OCR 字段来源示意 · 非真实登记材料", "hei small", 'text-anchor="middle"')}

    ${field(y + 334, "名称", "示例科技有限公司", 31)}
    ${field(y + 400, "类型", "有限责任公司（示例）")}
    ${field(y + 466, "法定代表人", "张示例")}
    ${field(y + 532, "注册资本", "壹佰万元整")}
    ${field(y + 598, "成立日期", "2023年01月01日")}
    ${field(y + 664, "营业期限", "2023年01月01日至长期")}
    ${field(y + 730, "住所", "示例市示例区示例路88号A座101室", 24)}
    ${text(fieldX, y + 800, "经营范围", "song label")}
    ${text(valueX, y + 800, ["一般项目：技术服务、技术开发；", "技术咨询等示例文本，非真实经营许可。"], "song value")}
    ${line(fieldX, y + 866, x + w - 86, y + 866, 'stroke="#9b7a4c" stroke-width="1.2" opacity="0.36"')}
    ${field(y + 930, "登记机关", "示例市市场监督管理局")}
    ${field(y + 996, "登记日期", "2023年01月01日")}

    ${circleStamp(x + 628, y + 965, 106, "SAMPLE 示例章")}
    ${text(x + w / 2, y + 690, "SAMPLE 示例", "hei watermark", 'text-anchor="middle" transform="rotate(-18 520 740)"')}
    ${text(x + w / 2, y + h - 70, "二维码不可扫描 · 代码包含 EXAMPLE · 机构和地址均为示例", "hei micro", 'text-anchor="middle"')}
  `,
  );
}

function tableRows(x, startY, rowHeight, rows, widths) {
  let y = startY;
  const body = [];
  for (const row of rows) {
    let cursor = x;
    row.forEach((cell, index) => {
      const isLabel = index % 2 === 0;
      const fontSize = isLabel ? (cell.length > 5 ? 19 : 21) : cell.length > 14 ? 16 : cell.length > 8 ? 19 : 23;
      body.push(rect(cursor, y, widths[index], rowHeight, 'fill="rgba(255,255,255,0.18)" stroke="#315f83" stroke-width="1.5"'));
      body.push(
        text(
          cursor + 14,
          y + rowHeight / 2 + 9,
          cell,
          isLabel ? "song tableLabel" : "song tableValue",
          `style="font-size:${fontSize}px"`,
        ),
      );
      cursor += widths[index];
    });
    y += rowHeight;
  }
  return body.join("\n");
}

function generateHouseholdSvg() {
  const x = 105;
  const y = 70;
  const w = 800;
  const h = 1160;
  const widths = [130, 224, 130, 196];

  const rows = [
    ["户别", "示例户别", "户主姓名", "示例户主"],
    ["住址", "XX省XX市XX区", "登记页", "第 00 页"],
    ["姓名", "示例成员", "与户主关系", "示例关系"],
    ["性别", "X", "民族", "XX"],
    ["出生日期", "19XX年XX月XX日", "出生地", "XX省XX市"],
    ["身份号码", "000000000000000000", "身高", "000 cm"],
    ["服务处所", "示例单位", "文化程度", "示例"],
    ["婚姻状况", "示例", "兵役状况", "示例"],
    ["迁入日期", "1900年00月00日", "登记日期", "1900年00月00日"],
  ];

  return svg(
    1010,
    1320,
    `
    <g filter="url(#softShadow)">
      ${rect(x, y, w, h, 'rx="8" fill="url(#ledgerPaper)" stroke="#315f83" stroke-width="3"')}
      ${rect(x + 18, y + 18, w - 36, h - 36, 'fill="url(#blueLedger)" opacity="0.72"')}
      ${rect(x + 34, y + 34, w - 68, h - 68, 'fill="none" stroke="#315f83" stroke-width="2"')}
      ${rect(x, y, w, h, 'rx="8" filter="url(#paperGrain)" opacity="0.42"')}
    </g>

    ${text(x + w / 2, y + 104, "居民户口簿登记页", "song ledger-title", 'text-anchor="middle"')}
    ${text(x + w / 2, y + 148, "示例样张 · 仅供字段来源示意", "hei small", 'text-anchor="middle"')}
    ${line(x + 80, y + 184, x + w - 80, y + 184, 'stroke="#315f83" stroke-width="2" opacity="0.65"')}

    ${tableRows(x + 60, y + 230, 76, rows, widths)}

    ${rect(x + 60, y + 954, w - 120, 128, 'fill="rgba(255,255,255,0.14)" stroke="#315f83" stroke-width="1.5"')}
    ${text(x + 82, y + 1000, "备注", "song label")}
    ${text(x + 190, y + 988, ["姓名、地址、号码、日期均为无效示例。", "不得作为真实户籍材料、身份材料", "或证明文件使用。"], "song tableValue", 'style="font-size:23px"')}

    ${text(x + w / 2, y + 705, "仅供字段来源示意", "hei watermarkBlue", 'text-anchor="middle" transform="rotate(-22 505 775)"')}
    ${circleStamp(x + 658, y + 1042, 82, "SAMPLE")}
    ${text(x + w / 2, y + h - 58, "身份证号码全 0 · 地址使用 XX 占位 · 无真实签发信息", "hei micro", 'text-anchor="middle"')}
  `,
  );
}

async function writeAsset(name, svgSource) {
  const svgPath = path.join(outDir, `${name}.svg`);
  const pngPath = path.join(outDir, `${name}.png`);
  const webpPath = path.join(outDir, `${name}.webp`);
  const input = Buffer.from(svgSource);

  await fs.writeFile(svgPath, svgSource, "utf8");
  await sharp(input)
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  await sharp(input)
    .webp({ quality: 92, lossless: false })
    .toFile(webpPath);

  return { name, svgPath, pngPath, webpPath };
}

await fs.mkdir(outDir, { recursive: true });

const assets = await Promise.all([
  writeAsset("idcard-specimen-pretest", generateIdcardSvg()),
  writeAsset("business-license-specimen-pretest", generateBusinessLicenseSvg()),
  writeAsset("household-register-specimen-pretest", generateHouseholdSvg()),
]);

const manifest = {
  generatedAt: new Date().toISOString(),
  sourcePromptPlan: "docs/ocr-specimen-prompt.md",
  mode: "local-safety-fallback-svg",
  assets,
};

await fs.writeFile(path.join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

for (const asset of assets) {
  console.log(`${asset.name}`);
  console.log(`  svg:  ${asset.svgPath}`);
  console.log(`  png:  ${asset.pngPath}`);
  console.log(`  webp: ${asset.webpPath}`);
}
