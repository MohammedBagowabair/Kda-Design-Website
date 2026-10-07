// node scripts/img.mjs -> src-images/*.jpg -> public/images/<name>-<w>.webp
import sharp from 'sharp'
import fs from 'node:fs'
const src = 'src-images', out = 'public/images'
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true })
const jobs = [
  ['hero', 'hero-m', { left: 330, top: 0, width: 1100, height: 1467 }, [[640, 50]]],
  ['hero', 'hero', null, [[1400, 52], [2000, 48]]],
  ['living', 'living', null, [[560, 62], [960, 60]]],
  ['dining', 'dining', null, [[560, 62], [900, 60]]],
  ['lounge', 'lounge', null, [[560, 62], [960, 60]]],
  ['nook', 'nook', null, [[560, 62], [900, 60]]],
  ['calm', 'calm', null, [[560, 62], [960, 60]]],
  ['walnut', 'walnut', null, [[560, 62], [960, 60]]],
]
for (const [file, name, crop, sizes] of jobs) {
  for (const [w, q] of sizes) {
    let s = sharp(`${src}/${file}.jpg`); if (crop) s = s.extract(crop)
    await s.resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
  }
}
for (const f of fs.readdirSync(out)) { const m = await sharp(`${out}/${f}`).metadata(); console.log(f, m.width + 'x' + m.height, (fs.statSync(`${out}/${f}`).size / 1024).toFixed(0) + 'KB') }
