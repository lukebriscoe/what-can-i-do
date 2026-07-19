// Rasterise public/favicon.svg into the PNG icons the manifest + iOS need.
// Run with: npm run icons
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public/favicon.svg'))

const targets = [
  ['public/pwa-192.png', 192],
  ['public/pwa-512.png', 512],
  ['public/apple-touch-icon.png', 180],
]

for (const [out, size] of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(join(root, out))
  console.log('wrote', out, size)
}
