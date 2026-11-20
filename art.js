// Builds story images before build.js runs (Netlify: "node art.js; node build.js").
// For each story without hand-made art in assets/art/<id>.webp:
//   1. If assets/art-sources.js lists a photo (src), download it and crop to 1200x675 WebP, with a credit line.
//   2. Otherwise make a branded graphic card (big number or headline) in the site's colors.
// Output: .art-cache/<id>.webp plus .art-cache/manifest.json ({id: {kind, credit}}). Never fails the build.
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = __dirname, OUT = path.join(ROOT, ".art-cache");
const load = (f, key) => { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb); return sb.window[key]; };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  let sharp, opentype, FB, FR;
  try {
    sharp = require("sharp"); opentype = require("opentype.js");
    const fdir = path.join(ROOT, "node_modules/@expo-google-fonts/oswald");
    FB = opentype.loadSync(path.join(fdir, "700Bold/Oswald_700Bold.ttf"));
    FR = opentype.loadSync(path.join(fdir, "500Medium/Oswald_500Medium.ttf"));
  } catch (e) { console.log("art: image tools unavailable, skipping:", e.message); fs.writeFileSync(path.join(OUT, "manifest.json"), "{}"); return; }

  const STORIES = load("assets/stories.js", "STORIES");
  const ART = fs.existsSync(path.join(ROOT, "assets/art-sources.js")) ? load("assets/art-sources.js", "ART") : {};
  const SEC = { business: "Business", markets: "Markets", growth: "Growth", "real-estate": "Real Estate", education: "Education", government: "Government", "we-the-people": "We the People", sports: "Sports", "things-to-do": "Things to Do" };
  const logo = fs.readFileSync(path.join(ROOT, "assets/logo.webp"));
  const W = 1200, H = 675;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  const textPath = (font, str, x, y, size, fill) => `<path d="${font.getPath(str, x, y, size).toPathData(1)}" fill="${fill}"/>`;
  const width = (font, str, size) => font.getAdvanceWidth(str, size);
  const wrap = (font, str, size, maxW) => {
    const words = str.split(/\s+/), lines = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (width(font, t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  };

  async function card(s, a) {
    const cat = (SEC[s.cat] || s.cat).toUpperCase(), city = (s.city || "Central Texas").toUpperCase();
    let body = "";
    // halftone dots
    let dots = "";
    for (let y = 0; y < H; y += 18) for (let x = 0; x < W; x += 18) { const r = Math.max(0, 5.5 - (x + y * 0.6) / 260); if (r > 0.4) dots += `<circle cx="${x + (y / 18 % 2 ? 9 : 0)}" cy="${y}" r="${r.toFixed(1)}"/>`; }
    // label pill
    const lw = width(FB, cat, 30) + 40;
    body += `<rect x="70" y="70" width="${lw}" height="52" rx="6" fill="#c75b26"/>` + textPath(FB, cat, 90, 108, 30, "#fff5e8");
    body += textPath(FR, city, 70 + lw + 22, 108, 28, "#f0a36f");
    if (a && a.big) {
      let size = 230; while (width(FB, a.big, size) > 1000 && size > 120) size -= 10;
      body += textPath(FB, a.big, 66, 400, size, "#fff5e8");
      const ll = wrap(FR, a.label || "", 46, 900).slice(0, 2);
      ll.forEach((l, i) => body += textPath(FR, l, 72, 470 + i * 56, 46, "#f0a36f"));
    } else {
      let size = 78, lines = wrap(FB, s.title, size, 1000);
      while (lines.length > 4 && size > 52) { size -= 4; lines = wrap(FB, s.title, size, 1000); }
      lines = lines.slice(0, 5);
      const top = 210 + Math.max(0, (4 - lines.length)) * size * 0.45;
      lines.forEach((l, i) => body += textPath(FB, l, 70, top + i * size * 1.12, size, "#fff5e8"));
    }
    body += `<rect x="70" y="${H - 92}" width="120" height="8" fill="#c75b26"/>` + textPath(FR, "254TXINSIDER.COM", 70, H - 50, 30, "#b9c0cf");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#13213c"/><g fill="#1f3460">${dots}</g><rect x="0" y="0" width="22" height="${H}" fill="#c75b26"/>${body}</svg>`;
    const lg = await sharp(logo).resize(150, 150).toBuffer();
    return sharp(Buffer.from(svg)).composite([{ input: lg, left: W - 200, top: H - 200 }]).webp({ quality: 82 }).toBuffer();
  }

  async function photo(a) {
    const r = await fetch(a.src, { headers: { "User-Agent": "254TexasInsiderBuild/1.0 (https://254txinsider.com; news site)" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    return sharp(buf).rotate().resize(W, H, { fit: "cover", position: a.pos || "attention" }).webp({ quality: 80 }).toBuffer();
  }

  let made = 0, photos = 0;
  for (const s of STORIES) {
    if (fs.existsSync(path.join(ROOT, "assets/art", s.id + ".webp"))) continue;
    const a = ART[s.id], file = path.join(OUT, s.id + ".webp");
    try {
      if (a && a.src) {
        fs.writeFileSync(file, await photo(a));
        manifest[s.id] = { kind: "photo", by: a.by || "", lic: a.lic || "", licUrl: a.licUrl || "", page: a.page || "", via: a.via || "Wikimedia Commons" };
        photos++; continue;
      }
    } catch (e) { console.log("art: photo failed for", s.id, e.message, "- using a card"); }
    try { fs.writeFileSync(file, await card(s, a)); manifest[s.id] = { kind: "graphic" }; made++; }
    catch (e) { console.log("art: card failed for", s.id, e.message); }
  }
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest));
  console.log(`art: ${photos} photos, ${made} cards`);
})().catch(e => { console.log("art: error", e.message); try { fs.writeFileSync(path.join(OUT, "manifest.json"), "{}"); } catch (_) {} });
