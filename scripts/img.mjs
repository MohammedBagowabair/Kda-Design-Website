// node scripts/img.mjs -> src-images/*.jpg -> public/images/<name>-<size>.webp
import sharp from 'sharp'
import fs from 'node:fs'
const src = 'src-images', out = 'public/images'
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true })
// [source, output name, crop | null, [[width, quality]] | {h: [[height, quality]]}]
const jobs = [
  ['living', 'hero-m', { left: 440, top: 0, width: 1220, height: 1467 }, [[560, 48], [720, 44]]],
  ['living', 'hero', null, [[1400, 56], [2000, 50]]],
  ['hero', 'sky', { left: 0, top: 200, width: 2200, height: 1100 }, [[900, 45], [1600, 42]]],
]
const gallery = ['dining', 'lounge', 'nook', 'calm', 'walnut']
for (const [file, name, crop, sizes] of jobs) for (const [w, q] of sizes) {
  let s = sharp(`${src}/${file}.jpg`); if (crop) s = s.extract(crop)
  await s.resize({ width: w }).webp({ quality: q, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
}
for (const g of gallery) for (const [h, q] of [[420, 62], [760, 58]])
  await sharp(`${src}/${g}.jpg`).resize({ height: h }).webp({ quality: q, effort: 6 }).toFile(`${out}/${g}-h${h}.webp`)
for (const f of fs.readdirSync(out)) { const m = await sharp(`${out}/${f}`).metadata(); console.log(f, m.width + 'x' + m.height, (fs.statSync(`${out}/${f}`).size / 1024).toFixed(0) + 'KB') }
