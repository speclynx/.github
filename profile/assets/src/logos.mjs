// Builds the logo variants in profile/assets/logos from the SpecLynx branding and the logos
// published on speclynx.com.
//
// usage: node profile/assets/src/logos.mjs   (needs `gh` with access to speclynx/speclynx)
//
// - speclynx-logo-{light,dark}.png: branding/logo1.png from speclynx/speclynx with its white
//   background removed; the dark variant renders the navy wordmark light and the navy inner
//   mark a lighter navy, so it stays the logo's dark accent.
// - speclynx-mark-{light,dark}.png: the same logos without the wordmark, for READMEs whose
//   heading already names the project.
// - <spec>-logo-dark.{svg,png}: spec logos with their dark wordmark rendered light,
//   for GitHub dark mode. Light mode keeps using the originals from speclynx.com.
// - ../testimonials/<name>.svg: testimonial photos cropped to a circle, as on speclynx.com
//   (GitHub strips the CSS the website uses for that).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://speclynx.com/assets/images/logos';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'logos');
const LIGHT = [0xf0, 0xf6, 0xfc]; // GitHub dark mode heading color

const prefix = mkdtempSync(join(tmpdir(), 'speclynx-logos-'));
execFileSync('npm', ['install', '--silent', '--prefix', prefix, 'pngjs@7.0.0'], { stdio: 'inherit' });
const { PNG } = createRequire(join(prefix, 'noop.js'))('pngjs');

const fetchBuffer = async (name) => {
  const res = await fetch(`${BASE}/${name}`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
};

// SVG wordmarks: swap the dark text colors for LIGHT
const SVG_DARK_COLORS = {
  'asyncapi-logo.svg': ['#1B1130'],
  'overlay-logo.svg': ['#252525', '#222222'],
  'json-schema-logo.svg': ['#1c1e21'],
};

// recolor pixels to the color `pick` returns for them (none: unchanged), keeping alpha
// so antialiasing survives
function recolor(png, pick) {
  const d = png.data;
  for (let i = 0; i < d.length; i += 4) {
    const color = d[i + 3] && pick(d[i], d[i + 1], d[i + 2], Math.floor(i / 4 / png.width));
    if (color) [d[i], d[i + 1], d[i + 2]] = color;
  }
  return png;
}

// remove the white background: pixels at least SOLID away from white stay opaque, the
// antialiased edges in between are un-blended from white so they stay smooth on any background
function whiteToAlpha(png, SOLID = 100) {
  const d = png.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = Math.min(1, Math.max(255 - d[i], 255 - d[i + 1], 255 - d[i + 2]) / SOLID);
    for (let c = 0; c < 3; c++) d[i + c] = a ? Math.round(255 - (255 - d[i + c]) / a) : 0;
    d[i + 3] = Math.round(a * 255);
  }
  return png;
}

// make every row from `y` down transparent
function cutBelow(png, y) {
  png.data.fill(0, y * png.width * 4);
  return png;
}

function crop(png, pad = 4) {
  let [x0, y0, x1, y1] = [png.width, png.height, 0, 0];
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (png.data[(y * png.width + x) * 4 + 3] > 8) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
  }
  [x0, y0] = [Math.max(0, x0 - pad), Math.max(0, y0 - pad)];
  [x1, y1] = [Math.min(png.width - 1, x1 + pad), Math.min(png.height - 1, y1 + pad)];
  const out = new PNG({ width: x1 - x0 + 1, height: y1 - y0 + 1 });
  PNG.bitblt(png, out, x0, y0, out.width, out.height, 0, 0);
  return out;
}

// halve the size with a 2x2 box filter, averaging color weighted by alpha
function half(png) {
  const out = new PNG({ width: png.width >> 1, height: png.height >> 1 });
  for (let y = 0; y < out.height; y++) {
    for (let x = 0; x < out.width; x++) {
      const acc = [0, 0, 0, 0];
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
        const i = ((2 * y + dy) * png.width + 2 * x + dx) * 4;
        const a = png.data[i + 3];
        for (let c = 0; c < 3; c++) acc[c] += png.data[i + c] * a;
        acc[3] += a;
      }
      const o = (y * out.width + x) * 4;
      for (let c = 0; c < 3; c++) out.data[o + c] = acc[3] ? Math.round(acc[c] / acc[3]) : 0;
      out.data[o + 3] = Math.round(acc[3] / 4);
    }
  }
  return out;
}

const neutralDark = (r, g, b) => Math.max(r, g, b) < 150 && Math.max(r, g, b) - Math.min(r, g, b) < 48;
const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

mkdirSync(OUT, { recursive: true });
const write = (name, data) => {
  writeFileSync(join(OUT, name), data);
  console.log(name);
};

for (const [name, colors] of Object.entries(SVG_DARK_COLORS)) {
  let svg = (await fetchBuffer(name)).toString('utf8');
  for (const c of colors) svg = svg.replaceAll(new RegExp(c, 'gi'), '#F0F6FC');
  write(name.replace('.svg', '-dark.svg'), svg);
}

for (const name of ['openapi-logo.png', 'arazzo-logo.png']) {
  write(name.replace('.png', '-dark.png'), PNG.sync.write(recolor(PNG.sync.read(await fetchBuffer(name)), (r, g, b) => neutralDark(r, g, b) && LIGHT)));
}

const TESTIMONIALS = join(OUT, '..', 'testimonials');
mkdirSync(TESTIMONIALS, { recursive: true });
for (const name of ['emmanuel-paraskakis', 'fran-mendez']) {
  const res = await fetch(`https://speclynx.com/assets/images/testimonials/${name}.webp`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const photo = Buffer.from(await res.arrayBuffer()).toString('base64');
  writeFileSync(join(TESTIMONIALS, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath>
  <image width="100" height="100" clip-path="url(#c)" href="data:image/webp;base64,${photo}"/>
</svg>
`);
  console.log(`testimonials/${name}.svg`);
}

// 2048px original; the inner mark sits above SPLIT_Y, the wordmark below it
const full = execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw',
  'repos/speclynx/speclynx/contents/branding/logo1.png'], { maxBuffer: 64 * 1024 * 1024 });
const SPLIT_Y = 1134;
const MARK_DARK = [0x1e, 0x5a, 0x8c];
// blank rows 1158-1244 separate the mark from the wordmark; cut in the middle of them
const MARK_BOTTOM = 1200;
write('speclynx-logo-light.png', PNG.sync.write(half(crop(whiteToAlpha(PNG.sync.read(full)), 12))));
write('speclynx-logo-dark.png', PNG.sync.write(half(crop(recolor(whiteToAlpha(PNG.sync.read(full)),
  (r, g, b, y) => luma(r, g, b) < 90 && (y < SPLIT_Y ? MARK_DARK : LIGHT)), 12))));
write('speclynx-mark-light.png', PNG.sync.write(half(crop(cutBelow(whiteToAlpha(PNG.sync.read(full)), MARK_BOTTOM), 12))));
write('speclynx-mark-dark.png', PNG.sync.write(half(crop(cutBelow(recolor(whiteToAlpha(PNG.sync.read(full)),
  (r, g, b) => luma(r, g, b) < 90 && MARK_DARK), MARK_BOTTOM), 12))));
