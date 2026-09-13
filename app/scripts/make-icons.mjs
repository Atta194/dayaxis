/* Builds DayAxis PNG app icons (192/512/180) in pure Node - ring + check brand mark. */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(width, height, rgba) {
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const di = y * (1 + width * 4) + 1 + x * 4;
      raw[di] = rgba[si];
      raw[di + 1] = rgba[si + 1];
      raw[di + 2] = rgba[si + 2];
      raw[di + 3] = rgba[si + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const TEAL1 = [30, 122, 107];
const TEAL2 = [46, 150, 134];
const CREAM = [246, 243, 234];
const CORAL = [232, 112, 95];

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function drawIcon(size) {
  const rgba = new Uint8Array(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const R1 = size * 0.46, R2 = size * 0.375, rad = size * 0.22;
  const th = size * 0.075;
  const A = [size * 0.335, size * 0.52], Bp = [size * 0.46, size * 0.655], Cp = [size * 0.685, size * 0.39];
  const rrect = (x, y) => {
    const qx = Math.max(Math.abs(x - cx) - (cx - rad), 0);
    const qy = Math.max(Math.abs(y - cy) - (cy - rad), 0);
    return qx * qx + qy * qy <= rad * rad;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!rrect(x, y)) {
        rgba[i + 3] = 0;
        continue;
      }
      const t = y / size;
      let col = [TEAL1[0] + (TEAL2[0] - TEAL1[0]) * t, TEAL1[1] + (TEAL2[1] - TEAL1[1]) * t, TEAL1[2] + (TEAL2[2] - TEAL1[2]) * t];
      const dx = x - cx, dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist >= R2 && dist <= R1) {
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const f = ((ang + 90 + 360) % 360) / 360;
        col = f <= 0.68 ? CREAM : [CREAM[0] * 0.55 + col[0] * 0.45, CREAM[1] * 0.55 + col[1] * 0.45, CREAM[2] * 0.55 + col[2] * 0.45];
      }
      const d1 = segDist(x, y, A[0], A[1], Bp[0], Bp[1]);
      const d2 = segDist(x, y, Bp[0], Bp[1], Cp[0], Cp[1]);
      if (Math.min(d1, d2) <= th) col = CORAL;
      rgba[i] = col[0];
      rgba[i + 1] = col[1];
      rgba[i + 2] = col[2];
      rgba[i + 3] = 255;
    }
  }
  return rgba;
}

mkdirSync(ROOT, { recursive: true });
for (const s of [512, 192, 180]) {
  writeFileSync(join(ROOT, `icon-${s}.png`), png(s, s, drawIcon(s)));
  console.log(`icon-${s}.png written`);
}