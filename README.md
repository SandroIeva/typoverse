# Typoverse

**A radial text generator that arranges any text into concentric rings with a cinematic fade effect.**

Open `index.html` in any modern browser — no build step, no dependencies, no server required.

---

## What you can do

### Text
- **Type any text** into the input field — letters are distributed automatically across all rings
- **Choose from 8 fonts**: Futura, Garamond, Georgia, Times New Roman, Palatino, Baskerville, Didot, Courier New
- **Adjust font size** from 6px to 40px
- **Control letter spacing** — spread characters tightly or loosely around each ring
- **Toggle Uppercase** — instantly convert all text to capital letters

### Rings
- **Set the number of rings** — from 1 to 16 concentric circles
- **Control ring gap** — the pixel distance between each ring
- **Set the start radius** — how far out from the center the first ring begins

### Fade Effect
The fade creates two opposite "gaps" on each ring where text fades out and shrinks — mimicking the look of depth and mystery in typographic art.

- **Intensity** — how strongly letters fade out in the fade zones (0 = no fade, 1 = fully invisible)
- **Width** — how wide the fade zones are relative to the ring circumference
- **Position** — rotate the fade zones around the ring (0 = top/bottom, 0.5 = left/right)
- **Size Shrink** — how much letters scale down as they approach the fade zones

### Colors
- **Background color** — any color via color picker
- **Text color** — any color via color picker

### Export
Export your creation in three formats:

| Format | Best for |
|--------|----------|
| **PNG** | Web, presentations, social media |
| **JPG** | Photography workflows, smaller file size |
| **SVG** | Print, Illustrator, Figma, scalable at any size |

The SVG export contains every letter as an individual `<text>` element with its exact position, rotation, font size, and opacity — fully editable in any vector tool.

---

## Tips & Ideas

- **Dense rings + tight spacing + uppercase Futura** → bold geometric poster
- **Few rings + wide gap + high fade intensity** → meditative, almost invisible lettering
- **Black background + white text + fade position 0** → classic dark typographic art (like the reference image)
- **White background + dark text** → clean editorial look
- **Export as SVG, open in Figma** → adjust individual letters, add gradients, overlay images

---

## Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge.

---

## File Structure

```
typoverse/
├── index.html   — the entire app, self-contained
└── README.md    — this file
```

---

## License

MIT — free to use, modify, and distribute.
