import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import sharp from 'sharp';
const check = process.argv.includes('--check');
execFileSync('python3', ['scripts/extract-ticket-capabilities.py', ...(check ? ['--check'] : [])], { stdio: 'inherit' });
const tickets = JSON.parse(fs.readFileSync('src/data/ticketCapabilities.json', 'utf8'));
for (const ticket of tickets) for (const sample of ticket.samples) {
  const bytes = await sharp(`public${sample.src}`).resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  const target = `public${sample.thumbnail}`;
  if (check) {
    if (!fs.existsSync(target) || !bytes.equals(fs.readFileSync(target))) throw new Error(`缩略图不一致: ${target}`);
  } else fs.writeFileSync(target, bytes);
}
console.log('25 张缩略图校验完成');
