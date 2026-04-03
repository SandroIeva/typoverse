// Typoverse render worker — runs entirely off the main thread
// Receives params via postMessage, renders to OffscreenCanvas, transfers bitmap back

const TWO_PI  = Math.PI * 2;
const HALF_PI = Math.PI / 2;

let canvas = null;
let ctx    = null;

// Pre-computed sin/cos lookup table for performance (4096 steps = ~0.088° resolution)
const LUT_SIZE  = 4096;
const sinLUT    = new Float32Array(LUT_SIZE);
const cosLUT    = new Float32Array(LUT_SIZE);
for (let i = 0; i < LUT_SIZE; i++) {
  const a   = (i / LUT_SIZE) * TWO_PI;
  sinLUT[i] = Math.sin(a);
  cosLUT[i] = Math.cos(a);
}

function lutSin(a) {
  // Normalize angle to [0, 2π) then index into LUT
  const norm = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  return sinLUT[(norm / TWO_PI * LUT_SIZE) | 0];
}
function lutCos(a) {
  const norm = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  return cosLUT[(norm / TWO_PI * LUT_SIZE) | 0];
}

self.onmessage = function(e) {
  const { type, data } = e.data;

  if (type === 'init') {
    canvas = data.canvas;
    ctx    = canvas.getContext('2d');
    return;
  }

  if (type === 'draw') {
    const {
      width, height, dpr,
      numRings, ringGap, startRadius,
      baseFontSize, fadeStr, fadeWidth, fadePosFrac, shrinkStr, lsMult,
      fontFamily, bg, tr, tg, tb,
      textChars
    } = data;

    canvas.width  = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Fixed state
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = `rgb(${tr},${tg},${tb})`;

    const fadeWClamped = Math.max(0.001, fadeWidth);
    const svgLetters   = [];
    let   lastAlpha    = -1;
    let   lastFont     = '';

    for (let ring = 0; ring < numRings; ring++) {
      const radius   = startRadius + ring * ringGap;
      const circ     = TWO_PI * radius;
      const avgW     = baseFontSize * 0.52 * lsMult;
      const numChars = Math.max(3, Math.floor(circ / avgW));
      const ringT    = numRings > 1 ? ring / (numRings - 1) : 0;
      const rScale   = 0.75 + 0.25 * (1 - ringT);
      const cx0      = width  / 2 / dpr;
      const cy0      = height / 2 / dpr;

      for (let i = 0; i < numChars; i++) {
        const cf    = i / numChars;
        const angle = cf * TWO_PI - HALF_PI;

        const d1 = Math.abs(((cf - fadePosFrac + 1.5) % 1) - 0.5) * 2;
        const d2 = Math.abs(((cf - (fadePosFrac + 0.5) + 1.5) % 1) - 0.5) * 2;
        const ff  = Math.max(
          Math.max(0, 1 - d1 / fadeWClamped),
          Math.max(0, 1 - d2 / fadeWClamped)
        );

        const alpha = 1 - fadeStr * ff;
        if (alpha < 0.005) continue;

        const fontSize = baseFontSize * rScale * (1 - shrinkStr * ff);
        const ch       = textChars[(ring * 13 + i) % textChars.length];
        const wx       = cx0 + lutCos(angle) * radius;
        const wy       = cy0 + lutSin(angle) * radius;
        const rot      = angle + HALF_PI;
        const cosR     = lutCos(rot);
        const sinR     = lutSin(rot);

        const fontStr = `${fontSize.toFixed(1)}px ${fontFamily}`;
        if (fontStr !== lastFont) { ctx.font = fontStr; lastFont = fontStr; }

        const alphaR = (alpha * 1000 | 0) / 1000;
        if (alphaR !== lastAlpha) { ctx.globalAlpha = alphaR; lastAlpha = alphaR; }

        ctx.setTransform(cosR * dpr, sinR * dpr, -sinR * dpr, cosR * dpr, wx * dpr, wy * dpr);
        ctx.fillText(ch, 0, 0);

        svgLetters.push({ x: wx, y: wy, angle, fontSize, alpha: alphaR, ch });
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

    // Transfer bitmap back to main thread (zero-copy)
    const bitmap = canvas.transferToImageBitmap();
    self.postMessage({ type: 'frame', bitmap, svgLetters, fontFamily }, [bitmap]);
  }
};
