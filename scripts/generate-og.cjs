/**
 * Rasterizes public/og-default.svg to public/og-default.png (1200x630).
 * Run: node scripts/generate-og.cjs
 * LinkedIn/Facebook/X handle PNG more reliably than SVG for og:image.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const root = path.join(__dirname, '..');
  const svgPath = path.join(root, 'public', 'og-default.svg');
  const outPath = path.join(root, 'public', 'og-default.png');

  const svg = fs.readFileSync(svgPath);
  await sharp(svg).resize(1200, 630, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(outPath);
  // eslint-disable-next-line no-console
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
