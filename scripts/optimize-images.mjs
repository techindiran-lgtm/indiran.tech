import sharp from 'sharp';
import { copyFile, rm } from 'node:fs/promises';

const iconSource = 'public/icon.png';
const backgroundSource = 'public/background.png';

await sharp(iconSource)
  .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile('public/icon.webp');

await sharp(iconSource)
  .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
  .toFile('public/icon.optimized.png');

// Replace only after Sharp has finished reading the original source image.
await copyFile('public/icon.optimized.png', iconSource);
await rm('public/icon.optimized.png');

await sharp(backgroundSource)
  .webp({ quality: 75, effort: 6, smartSubsample: true })
  .toFile('public/background.webp');

console.log('Created optimized icon.png, icon.webp, and background.webp');
