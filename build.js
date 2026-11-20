// 254 Texas Insider static site builder. Netlify runs `node build.js` and publishes /dist.
// To add a story: edit assets/stories.js (and add assets/art/<id>.webp). Everything else is generated.
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = __dirname, OUT = path.join(ROOT, "dist");
const SITE = "https://254txinsider.com", NAME = "254 Texas Insider", TAG = "The Pulse of the 254";
const DESC = "Central Texas news for Waco, Temple, Killeen and Belton: business, growth, real estate, markets, government, schools, sports and things to do.";
const SOC = { tiktok: "https://www.tiktok.com/@254.texas.insider", instagram: "https://www.instagram.com/254texasinsider", facebook: "https://www.facebook.com/profile.php?id=61594348517050" };
const SECTIONS = [
  ["latest", "Latest", "Latest News", "Everything new across the 254: Waco, Temple, Killeen, Belton and the rest of Central Texas."],
  ["business", "Business", "Business & Economic Development", "The business journal for the 254: openings, expansions, jobs, deals and development across Waco, Temple, Killeen, Belton, Harker Heights, Copperas Cove and all of Central Texas."],
  ["markets", "Markets", "Markets & Rates", "Stocks, interest rates, mortgage rates and the numbers that move Central Texas wallets."],
  ["growth", "Growth", "Growth & Development", "Central Texas growth and development: roads, construction and the projects changing the 254."],
  ["real-estate", "Real Estate", "Real Estate & Housing", "Today's mortgage rates, home prices and inventory for Killeen-Temple, Waco and Austin, what it means for 254 buyers, sellers and homeowners, plus commercial land and development news."],
  ["education", "Education", "Education & Workforce", "Central Texas schools, colleges and the workforce pipeline in Killeen, Temple, Belton and Waco."],
  ["government", "Government", "Government & Politics", "Bell County and McLennan County government: city councils, commissioners courts and elections."],
  ["we-the-people", "We the People", "We the People", "Plain-English explainers on how local government works in Waco, Temple, Killeen and Belton."],
  ["sports", "Sports", "Sports & Community", "High school and college sports across the 254, including Baylor, UMHB and Tarleton State, plus community news and good causes."],
  ["things-to-do", "Things to Do", "Things to Do", "Things to do in Waco, Temple, Killeen and Belton this week: events, festivals and holiday fun."],
  ["podcast", "Podcast", "254 Texas Insider Podcast", "Conversations with the business owners, builders and leaders shaping Central Texas."]
];
const SEC = {}; SECTIONS.forEach(s => SEC[s[0]] = { key: s[0], short: s[1], name: s[2], desc: s[3] });

// ---------- load stories ----------
const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/stories.js"), "utf8"), sandbox);
const ALL = sandbox.window.STORIES.slice().sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const hasArt = id => fs.existsSync(path.join(ROOT, "assets/art", id + ".webp"));
ALL.forEach(s => { s.url = "/news/" + s.id + "/"; s.art = hasArt(s.id) ? "/assets/art/" + s.id + ".webp" : null; });
const BIZ = ["business", "growth", "real-estate"];
const inCat = k => ALL.filter(s => s.cat === k);
const inSec = k => k === "business" ? ALL.filter(s => BIZ.includes(s.cat))
  : k === "real-estate" ? ALL.filter(s => s.cat === "real-estate" || s.cat === "growth" || (s.also || []).includes("real-estate"))
  : inCat(k);
// ---------- housing dashboard ----------
const msb = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/market.js"), "utf8"), msb);
const MK = msb.window.MARKET;
const fmtN = (v, u) => typeof v === "string" ? v : u === "$" ? "$" + Math.round(v).toLocaleString("en-US") : (Number.isInteger(v) ? v.toLocaleString("en-US") : String(v));
const chg = (p, note) => p === null || p === undefined ? (note ? `<small>${esc(note)}</small>` : "") : `<small class="${p < 0 ? "dn" : "up"}">${p > 0 ? "▲" : p < 0 ? "▼" : ""} ${Math.abs(p).toFixed(1)}% vs. last year${note ? " · " + esc(note) : ""}</small>`;
const srcA = s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`;
function rateCards() {
  const R = MK.rates, c = r => `<div class="rcard"><span class="lbl">${esc(r.label)}</span><b>${r.v.toFixed(2)}%</b>${r.prev !== undefined ? `<small class="${r.v > r.prev ? "up" : "dn"}">${r.v > r.prev ? "▲" : "▼"} from ${r.prev.toFixed(2)}% last week · ${r.yearAgo.toFixed(2)}% a year ago</small>` : `<small class="${r.chg > 0 ? "up" : "dn"}">${r.chg > 0 ? "▲" : r.chg < 0 ? "▼" : "•"} ${Math.abs(r.chg).toFixed(2)} from prior day</small>`}<span class="asof">${esc(r.asOf)} · ${srcA(r.src)}</span></div>`;
  return `<div class="rates">${[R.daily, R.weekly, R.daily15, R.weekly15].map(c).join("")}</div>`;
}
function marketDash() {
  const stat = s => `<div class="stat"><span class="lbl">${esc(s[0])}</span><b>${fmtN(s[1], s[2])}</b>${chg(s[3], s[4])}</div>`;
  const area = a => `<div class="area"><h3>${esc(a.name)}</h3><p class="sub">${esc(a.sub)} · ${esc(a.month)}</p><div class="astats">${a.stats.map(stat).join("")}</div><p class="src">Source: ${srcA(a.src)}</p></div>`;
  const T = MK.takeaways;
  return `<div class="dash" id="housing-dashboard"><div class="dash-head"><h2>254 Housing <span>Dashboard</span></h2><span class="upd">Updated ${esc(new Date(MK.updated + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))}</span></div>
<h3 class="dsub">Today's mortgage rates</h3>${rateCards()}
<div class="calc" id="pay-calc"><h3>What would my payment be?</h3><div class="calc-row"><label>Home price <input type="number" id="pc-price" value="${MK.calc.price}" step="5000" min="0"></label><label>Down payment % <input type="number" id="pc-down" value="${MK.calc.downPct}" step="1" min="0" max="100"></label><label>Rate % <input type="number" id="pc-rate" value="${MK.rates.weekly.v}" step="0.01" min="0"></label><label>Term <select id="pc-term"><option value="30">30 years</option><option value="15">15 years</option></select></label><label class="wide">County <select id="pc-county">${MK.counties.list.map((c, i) => `<option value="${c[1]}"${i === 0 ? " selected" : ""}>${esc(c[0])} · ${c[1].toFixed(2)}%</option>`).join("")}</select></label><label>Home insurance ($/yr) <input type="number" id="pc-ins" value="" placeholder="optional" step="100" min="0"></label></div><div class="calc-break"><span>Principal & interest <b id="pc-out">—</b></span><span>+ Property taxes <b id="pc-tax">—</b></span><span>+ Insurance <b id="pc-insm">$0</b></span><span class="tot">= Estimated monthly <b id="pc-total">—</b></span></div><p class="calc-out"><small>Taxes use the county's average effective rate (typical tax bill ÷ typical home value) from <a href="${MK.counties.src[1]}" target="_blank" rel="noopener">${esc(MK.counties.src[0])}</a>. Your actual bill depends on your city, school district and exemptions. A homestead exemption takes $140,000 off your home's value for school taxes. HOA dues and mortgage insurance (with less than 20% down) are extra.</small></p></div>
<h3 class="dsub">Local market</h3><div class="areas">${MK.local.map(area).join("")}</div>
<h3 class="dsub">National market</h3><div class="areas one"><div class="area"><p class="sub">U.S. existing homes · ${esc(MK.national.month)}</p><div class="nat">${MK.national.stats.map(stat).join("")}</div><p class="src">Source: ${srcA(MK.national.src)}</p></div></div>
<h3 class="dsub">What it means for you</h3><div class="takes"><div><b>Buying</b><p>${esc(T.buyers)}</p></div><div><b>Selling</b><p>${esc(T.sellers)}</p></div><div><b>Own a home</b><p>${esc(T.owners)}</p></div></div>
<p class="disc">General information, not financial advice. Rates are national averages for top-tier borrowers; your rate depends on credit, down payment and loan type. Talk with a lender or Realtor about your situation.</p></div>
<h2 class="list-head">Housing, land & development <span>news</span></h2>`;
}

// ---------- helpers ----------
const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const fmt = d => { const [y, m, dd] = d.split("-").map(Number); return new Date(Date.UTC(y, m - 1, dd)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }); };
const iso = d => d + "T06:00:00-06:00";
const catLabel = k => SEC[k] ? SEC[k].short : k;
const secUrl = k => "/" + k + "/";
const abs = u => SITE + u;
const ld = o => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\x5cu003c") + "</script>";
const ORG = { "@type": "NewsMediaOrganization", "@id": SITE + "/#org", name: NAME, url: SITE + "/", logo: { "@type": "ImageObject", url: SITE + "/assets/logo.webp", width: 150, height: 150 }, sameAs: [SOC.tiktok, SOC.instagram], areaServed: ["Waco, TX", "Temple, TX", "Killeen, TX", "Belton, TX", "Bell County, TX", "McLennan County, TX"] };
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">';

function head(o) {
  const img = o.image ? abs(o.image) : SITE + "/assets/logo.webp";
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${abs(o.url)}">
<meta name="robots" content="${o.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<meta name="theme-color" content="#0f2340">
<meta name="geo.region" content="US-TX">
<meta name="geo.placename" content="Temple, Texas">
<meta property="og:site_name" content="${NAME}">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="${o.type || "website"}">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${abs(o.url)}">
<meta property="og:image" content="${img}">
${o.image ? '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="675">\n' : ""}<meta property="og:image:alt" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:card" content="${o.image ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${img}">
${o.extraMeta || ""}<link rel="icon" href="/assets/logo.webp" type="image/webp">
<link rel="apple-touch-icon" href="/assets/logo.webp">
<link rel="alternate" type="application/rss+xml" title="${NAME}" href="${SITE}/rss.xml">
${o.preload ? `<link rel="preload" as="image" href="${o.preload}">\n` : ""}${FONTS}
<link rel="stylesheet" href="/assets/styles.css">
<script src="/assets/main.js" defer></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TK59H04YNZ"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-TK59H04YNZ");</script>
${(o.ld || []).map(ld).join("\n")}
</head>
<body>
`;
}

function header(active) {
  const nav = SECTIONS.map(s => `<a href="${secUrl(s[0])}"${s[0] === active ? ' class="active" aria-current="page"' : ""}>${s[1]}</a>`).join("");
  return `<div class="topbar"><div class="wrap"><span><span id="today">Central Texas</span><span class="tagline"> &nbsp;·&nbsp; Waco · Temple · Killeen · Belton</span></span><span class="socials">${social()}</span></div></div>
<header class="site-header"><div class="wrap"><a class="brand" href="/" aria-label="${NAME} home"><img src="/assets/logo.webp" alt="${NAME} logo" width="64" height="64"><span class="brand-text"><strong>${NAME}</strong><span>${TAG}</span></span></a><a class="btn" href="/#newsletter">Subscribe Free</a></div></header>
<nav class="secnav" aria-label="Sections"><div class="wrap">${nav}</div></nav>
`;
}
function social() { return `<a href="${SOC.tiktok}" target="_blank" rel="noopener">TikTok</a><a href="${SOC.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${SOC.facebook}" target="_blank" rel="noopener">Facebook</a>`; }
function footer() {
  const secs = SECTIONS.map(s => `<a href="${secUrl(s[0])}">${s[2]}</a>`).join("");
  return `<footer class="site-footer"><div class="wrap"><div class="cols">
<div><h4>${NAME}</h4><p>Central Texas is growing. Stay ahead of what's next. Business, growth, government, schools and Friday nights across Waco, Temple, Killeen and Belton.</p><a class="btn" href="/#newsletter" style="display:inline-block;margin-top:8px;color:#fff">Join free</a></div>
<div><h4>Sections</h4>${secs}</div>
<div><h4>Company</h4><a href="/about/">About Us</a><a href="/contact/?topic=advertise">Advertise With Us</a><a href="/contact/">Contact Us / News Tips</a><a href="/contact/?topic=podcast">Be on the Podcast</a><a href="/privacy/">Privacy Policy</a><a href="/rss.xml">RSS Feed</a><a href="/sitemap.xml">Sitemap</a></div>
<div><h4>Follow</h4>${social()}</div>
</div><div class="legal"><span>© ${new Date().getFullYear()} ${NAME}. All rights reserved.</span><span class="site-views" data-site-views hidden></span><span>Our stories credit and link to the original reporting.</span></div></div></footer>
</body>
</html>
`;
}
const art = (s, cls, eager) => s.art ? `<img class="${cls}" src="${s.art}" alt="${esc(s.title)}" width="1200" height="675"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>` : "";
function row(s, noDek, pic) {
  return `<a class="row${pic && s.art ? " pic" : ""}" href="${s.url}">${pic === "top" ? art(s, "row-top") : ""}<span class="row-txt"><span class="cat">${esc(catLabel(s.cat))}</span><h3>${esc(s.title)}</h3>${noDek ? "" : `<p>${esc(s.dek)}</p>`}<time datetime="${s.date}">${fmt(s.date)}${s.city ? " · " + esc(s.city) : ""}</time></span>${pic === "side" ? art(s, "row-side") : ""}</a>`;
}
const TICKER = `<div class="ticker"><div class="tradingview-widget-container"><div class="tradingview-widget-container__widget"></div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
{"symbols":[{"proName":"FOREXCOM:SPXUSD","title":"S&P 500"},{"proName":"FOREXCOM:NSXUSD","title":"Nasdaq 100"},{"proName":"FOREXCOM:DJI","title":"Dow 30"},{"proName":"TVC:USOIL","title":"WTI Crude"},{"proName":"TVC:GOLD","title":"Gold"},{"proName":"TVC:SILVER","title":"Silver"},{"proName":"BITSTAMP:BTCUSD","title":"Bitcoin"}],"showSymbolLogo":true,"colorTheme":"dark","isTransparent":true,"displayMode":"adaptive","locale":"en"}
</script></div></div>
`;
const MARKET_WIDGET = `<div class="tradingview-widget-container market-widget"><div class="tradingview-widget-container__widget"></div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js" async>
{"width":"100%","height":460,"colorTheme":"light","isTransparent":true,"locale":"en","symbolsGroups":[{"name":"Indices","symbols":[{"name":"FOREXCOM:SPXUSD","displayName":"S&P 500"},{"name":"FOREXCOM:NSXUSD","displayName":"Nasdaq 100"},{"name":"FOREXCOM:DJI","displayName":"Dow 30"}]},{"name":"Commodities & Crypto","symbols":[{"name":"TVC:USOIL","displayName":"WTI Crude"},{"name":"TVC:GOLD","displayName":"Gold"},{"name":"TVC:SILVER","displayName":"Silver"},{"name":"BITSTAMP:BTCUSD","displayName":"Bitcoin"}]}]}
</script></div>
`;
const SIGNUP = (h = "h2") => `<section class="block" id="newsletter"><div class="wrap"><div class="signup">
<div><span class="kicker navy">Free weekly newsletter</span><${h}>Get The Pulse of the 254</${h}><p>The week's Central Texas business, growth and government news in one email. No spam. Unsubscribe anytime.</p></div>
<form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/">
<input type="hidden" name="form-name" value="newsletter"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<input type="email" name="email" placeholder="you@email.com" required aria-label="Email address"><button class="btn" type="submit">Subscribe Free</button>
</form></div></div></section>
`;
const WATCH = `<section class="block"><div class="wrap"><div class="media">
<div class="media-card"><span class="kicker">Daily Videos</span><h2>Central Texas news in 60 seconds</h2><p>Quick-hit business and development updates on TikTok, Instagram and Facebook.</p><div class="btn-row"><a class="btn" href="${SOC.tiktok}" target="_blank" rel="noopener">TikTok</a><a class="btn navy" href="${SOC.instagram}" target="_blank" rel="noopener">Instagram</a><a class="btn navy" href="${SOC.facebook}" target="_blank" rel="noopener">Facebook</a></div></div>
<div class="media-card"><span class="kicker navy">Podcast</span><h2>The 254 Texas Insider Podcast</h2><p>Conversations with the business owners, builders and leaders shaping Central Texas.</p><div class="btn-row"><a class="btn" href="/contact/?topic=podcast">Be a guest</a></div></div>
</div></div></section>
`;
const crumbsLd = list => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: abs(c[1]) })) });
const crumbsHtml = list => `<nav class="crumbs" aria-label="Breadcrumb">${list.map((c, i) => i < list.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`).join(" › ")}</nav>`;

// ---------- pages ----------
const pages = {};
// home
{
  const tops = ALL.filter(s => s.top), lead = tops.find(s => s.art) || tops[0], rest = tops.filter(s => s !== lead).slice(0, 4);
  const mods = ["business", "markets", "growth", "government", "we-the-people", "sports", "things-to-do", "education", "real-estate"].map(k => {
    const list = inCat(k).slice(0, 3); if (!list.length) return "";
    return `<div class="module"><h2><a href="${secUrl(k)}">${esc(SEC[k].name)}</a></h2>${list.map((s, i) => row(s, true, i === 0 ? "top" : null)).join("")}<a class="more" href="${secUrl(k)}">More ${esc(SEC[k].short)} →</a></div>`;
  }).join("");
  pages["index.html"] = head({
    title: `${NAME} | Waco, Temple, Killeen & Belton News`, ogTitle: `${NAME}: ${TAG}`, desc: DESC, url: "/", preload: lead.art,
    ld: [{ "@context": "https://schema.org", "@graph": [ORG, { "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: NAME, description: DESC, publisher: { "@id": SITE + "/#org" }, inLanguage: "en-US" },
      { "@type": "ItemList", name: "Top stories", itemListElement: ALL.slice(0, 10).map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(s.url), name: s.title })) }] }]
  }) + header(null) + TICKER + `<main>
<section class="home-hero"><div class="wrap"><h1>Central Texas Is Growing. <span>Stay Ahead of What's Next.</span></h1>
<p>Business, growth, government and Friday nights across the 254: Waco, Temple, Killeen, Belton and everywhere in between.</p>
<div class="top-grid"><a class="lead" href="${lead.url}">${art(lead, "lead-img", true)}<span class="cat">${esc(catLabel(lead.cat))}</span><h2>${esc(lead.title)}</h2><p>${esc(lead.dek)}</p><time datetime="${lead.date}">${fmt(lead.date)} · ${esc(lead.city)}</time></a>
<div class="rows">${rest.map(s => row(s, true, "side")).join("")}</div></div></div></section>
<section class="block"><div class="wrap"><div class="section-head"><h2>Latest <span>News</span></h2><a href="/latest/">All latest →</a></div><div class="rows two">${ALL.slice(0, 8).map(s => row(s, false, "side")).join("")}</div></div></section>
${SIGNUP()}<section class="block"><div class="wrap"><div class="modules">${mods}</div></div></section>
${WATCH}</main>
` + footer();
}
// sections
SECTIONS.forEach(([k]) => {
  const sec = SEC[k], list = k === "latest" ? ALL : inSec(k), url = secUrl(k);
  const body = list.length ? `<div class="rows">${list.map(s => row(s, false, "side")).join("")}</div>` :
    `<p class="empty">${k === "podcast" ? 'New episodes are on the way. Want to be a guest? <a href="/contact/?topic=podcast">Pitch us</a>.' : 'Stories are on the way. Have a tip? <a href="/contact/">Send it in</a>.'}</p>`;
  const crumbs = [["Home", "/"], [sec.name, url]];
  pages[k + "/index.html"] = head({
    title: `${sec.name} | Central Texas News | ${NAME}`, ogTitle: `${sec.name} | ${NAME}`, desc: sec.desc, url, noindex: !list.length,
    ld: [crumbsLd(crumbs), { "@context": "https://schema.org", "@type": "CollectionPage", name: sec.name, description: sec.desc, url: abs(url), isPartOf: { "@id": SITE + "/#website" },
      mainEntity: { "@type": "ItemList", itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(s.url), name: s.title })) } }]
  }) + header(k) + (k === "markets" ? TICKER : "") + `<main><div class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}<h1>${esc(sec.name)}</h1><p>${esc(sec.desc)}</p></div></div>
<section class="block"><div class="wrap narrow">${k === "markets" ? `<h2 class="list-head">Mortgage <span>rates</span></h2>${rateCards()}<p class="src"><a href="/real-estate/#housing-dashboard">Full 254 Housing Dashboard →</a></p>` + MARKET_WIDGET : ""}${k === "real-estate" ? marketDash() : ""}${body}</div></section>
${SIGNUP()}</main>
` + footer();
});
// articles
ALL.forEach(s => {
  const sec = SEC[s.cat], crumbs = [["Home", "/"], [sec.name, secUrl(s.cat)], [s.title, s.url]];
  let more = ALL.filter(x => x.cat === s.cat && x.id !== s.id).slice(0, 3);
  if (more.length < 3) more = more.concat(ALL.filter(x => x.cat !== s.cat && x.id !== s.id).slice(0, 3 - more.length));
  const words = strip(s.body.join(" ")).split(" ").length;
  const tags = [s.city, "Central Texas", sec.name].filter(Boolean);
  const src = (s.sources || []).map(x => `<li><a href="${x[1]}" target="_blank" rel="noopener">${esc(x[0])}</a></li>`).join("");
  pages["news/" + s.id + "/index.html"] = head({
    title: `${s.title} | ${NAME}`, ogTitle: s.title, desc: s.dek, url: s.url, type: "article", image: s.art, preload: s.art,
    extraMeta: `<meta property="article:published_time" content="${iso(s.date)}">\n<meta property="article:modified_time" content="${iso(s.date)}">\n<meta property="article:section" content="${esc(sec.name)}">\n${tags.map(t => `<meta property="article:tag" content="${esc(t)}">`).join("\n")}\n`,
    ld: [crumbsLd(crumbs), { "@context": "https://schema.org", "@type": "NewsArticle", "@id": abs(s.url) + "#article", mainEntityOfPage: abs(s.url), headline: s.title.slice(0, 110), alternativeHeadline: s.dek, description: s.dek,
      image: s.art ? [abs(s.art)] : [SITE + "/assets/logo.webp"], datePublished: iso(s.date), dateModified: iso(s.date), articleSection: sec.name, keywords: tags.join(", "), wordCount: words, inLanguage: "en-US",
      contentLocation: s.city ? { "@type": "Place", name: s.city + ", Texas" } : undefined,
      author: { "@type": "Organization", name: NAME + " Staff", url: SITE + "/about/" }, publisher: ORG, isAccessibleForFree: true,
      citation: (s.sources || []).map(x => ({ "@type": "CreativeWork", name: x[0], url: x[1] })) }]
  }) + header(s.cat) + `<main><article class="article">${crumbsHtml(crumbs.slice(0, 2))}
<h1>${esc(s.title)}</h1><p class="dek">${esc(s.dek)}</p>
<div class="art-meta">By ${NAME} Staff · <time datetime="${iso(s.date)}">${fmt(s.date)}</time>${s.city ? " · " + esc(s.city) : ""}<span class="views" data-views hidden></span></div>
${s.art ? `<figure class="hero-fig">${art(s, "hero-img", true)}</figure>` : ""}
<div class="body">${s.body.map(p => p.indexOf("<ul") === 0 ? p : "<p>" + p + "</p>").join("")}</div>
${src ? `<aside class="sources"><b>Sources</b><ul>${src}</ul><small>${NAME} summarizes reporting and public records. Read the original sources for full details.</small></aside>` : ""}
<div class="share">Share: <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs(s.url))}" target="_blank" rel="noopener">Facebook</a> · <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(abs(s.url))}&text=${encodeURIComponent(s.title)}" target="_blank" rel="noopener">X</a> · <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(abs(s.url))}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:?subject=${encodeURIComponent(s.title)}&body=${encodeURIComponent(abs(s.url))}">Email</a></div>
<div class="module related"><h2>Keep reading</h2>${more.map(x => row(x, true, "side")).join("")}</div>
</article>
${SIGNUP("h2")}</main>
` + footer();
});
// static pages
const simple = (file, url, title, desc, inner, noindex) => pages[file] = head({ title, desc, url, noindex }) + header(null) + "<main>" + inner + "</main>\n" + footer();
simple("about/index.html", "/about/", `About ${NAME} | Central Texas News`, `${NAME} covers business, growth, government and community news across Waco, Temple, Killeen and Belton.`,
  `<div class="page-hero"><div class="wrap"><span class="kicker">About</span><h1>The Pulse of <span>the 254</span></h1><p>Central Texas is growing fast. ${NAME} keeps you ahead of it.</p></div></div>
<section class="block"><div class="wrap prose"><h2>What we cover</h2><p>Business and development news from Waco, Temple, Killeen, Belton and everywhere in between: the new builds, the openings, the land deals and the decisions at City Hall that shape where the 254 is headed. Plus markets and interest rates, schools, high school sports, things to do and plain-English explainers on how local government works.</p>
<h2>How we report</h2><p>We read the city agendas, county filings, school district announcements and local outlets so you don't have to, then explain what it means for you. Every story credits and links to the original reporting and public records it draws on.</p>
<h2>Who we are</h2><p>${NAME} was founded by Jake, a Temple-based business professional who works with facility and business leaders across Central Texas every day. It started as daily videos on TikTok, Instagram and Facebook and has grown into a full news site and podcast.</p>
<h2>Get in touch</h2><p>Have a news tip, want to be on the podcast, or interested in advertising? <a href="/contact/">Contact us</a>.</p></div></section>`);
simple("contact/index.html", "/contact/", `Contact & News Tips | ${NAME}`, `Send a news tip, pitch a podcast guest, or ask about advertising with ${NAME}.`,
  `<div class="page-hero"><div class="wrap"><span class="kicker">Contact</span><h1>Send Us a <span>Tip</span></h1><p>News tips, podcast guests, advertising: it all comes here.</p></div></div>
<section class="block"><div class="wrap" style="max-width:760px"><form class="form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/">
<input type="hidden" name="form-name" value="contact"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<label>Name <input name="name" required></label><label>Email <input type="email" name="email" required></label>
<label>Topic <select name="topic" id="topic"><option value="tip">News tip</option><option value="podcast">Podcast guest</option><option value="advertise">Advertising</option><option value="other">Something else</option></select></label>
<label>Message <textarea name="message" required></textarea></label><div><button class="btn" type="submit">Send</button></div></form></div></section>`);
simple("privacy/index.html", "/privacy/", `Privacy Policy | ${NAME}`, `How ${NAME} handles visitor data, newsletter signups and analytics.`,
  `<div class="page-hero"><div class="wrap"><span class="kicker">Legal</span><h1>Privacy <span>Policy</span></h1><p>Last updated November 19, 2026.</p></div></div>
<section class="block"><div class="wrap prose"><h2>What we collect</h2><p>When you sign up for our newsletter or send us a message, we collect what you enter, such as your name and email address. We use it only to send you ${NAME} updates or to reply to you. We do not sell your information.</p>
<h2>Analytics</h2><p>We use Google Analytics to understand how many people visit the site and which stories they read. Google Analytics uses cookies and collects information such as pages viewed, approximate location and device type. You can learn more at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Google's partner sites policy</a> or opt out with the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out add-on</a>.</p>
<h2>View counts</h2><p>We keep simple, anonymous counts of how many times each page is viewed. These counts do not identify you.</p>
<h2>Advertising</h2><p>We may show ads from local sponsors. If we add third-party ad networks in the future, we will update this page.</p>
<h2>Unsubscribing</h2><p>You can unsubscribe from our emails at any time by replying to any email or <a href="/contact/">contacting us</a>.</p>
<h2>Contact</h2><p>Questions about privacy? Email <a href="mailto:jake.ruse@254txinsider.com">jake.ruse@254txinsider.com</a>.</p></div></section>`);
simple("thanks/index.html", "/thanks/", `Thanks! | ${NAME}`, `Thanks for reaching out to ${NAME}.`,
  `<div class="page-hero"><div class="wrap"><h1>Thank <span>You</span></h1><p>Got it. We'll be in touch. In the meantime, catch the latest on the homepage.</p><div class="btn-row"><a class="btn" href="/">Back to home</a></div></div></div>`, true);
simple("404.html", "/404.html", `Page not found | ${NAME}`, "Page not found.",
  `<div class="page-hero"><div class="wrap"><h1>Page Not <span>Found</span></h1><p>That page took a wrong exit off I-35.</p><div class="btn-row"><a class="btn" href="/">Back to home</a></div></div></div>`, true);

// ---------- feeds, sitemaps, robots, redirects ----------
const latest = ALL[0].date;
const urls = [["/", latest, "daily", "1.0"]].concat(SECTIONS.filter(([k]) => k === "latest" || inCat(k).length).map(([k]) => [secUrl(k), (k === "latest" ? ALL : inCat(k))[0].date, "daily", "0.8"]),
  ALL.map(s => [s.url, s.date, "weekly", "0.9", s]), [["/about/", latest, "monthly", "0.4"], ["/contact/", latest, "monthly", "0.4"]]);
pages["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, d, f, p, s]) => `<url><loc>${abs(u)}</loc><lastmod>${d}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority>${s && s.art ? `<image:image><image:loc>${abs(s.art)}</image:loc></image:image>` : ""}</url>`).join("\n")}
</urlset>
`;
const now = Date.now(), recent = ALL.filter(s => now - Date.parse(iso(s.date)) < 2 * 864e5);
pages["news-sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${(recent.length ? recent : ALL.slice(0, 10)).map(s => `<url><loc>${abs(s.url)}</loc><news:news><news:publication><news:name>${NAME}</news:name><news:language>en</news:language></news:publication><news:publication_date>${iso(s.date)}</news:publication_date><news:title>${esc(s.title)}</news:title></news:news></url>`).join("\n")}
</urlset>
`;
const rfc = d => new Date(Date.parse(iso(d))).toUTCString();
pages["rss.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel><title>${NAME}</title><link>${SITE}/</link><description>${esc(DESC)}</description><language>en-us</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
<image><url>${SITE}/assets/logo.webp</url><title>${NAME}</title><link>${SITE}/</link></image>
${ALL.map(s => `<item><title>${esc(s.title)}</title><link>${abs(s.url)}</link><guid isPermaLink="true">${abs(s.url)}</guid><pubDate>${rfc(s.date)}</pubDate><category>${esc(SEC[s.cat].name)}</category><description>${esc(s.dek)}</description>${s.art ? `<media:content url="${abs(s.art)}" medium="image" width="1200" height="675"/>` : ""}</item>`).join("\n")}
</channel></rss>
`;
pages["robots.txt"] = `User-agent: *
Allow: /
Disallow: /thanks/

Sitemap: ${SITE}/sitemap.xml
Sitemap: ${SITE}/news-sitemap.xml
`;
pages["_redirects"] = [
  "/story.html id=:id /news/:id/ 301!",
  "/section.html s=:s /:s/ 301!",
  "/section.html /latest/ 301!",
  "/we-the-people.html /we-the-people/ 301!",
  "/about.html /about/ 301!",
  "/contact.html /contact/ 301!",
  "/thanks.html /thanks/ 301!"
].join("\n") + "\n";

pages["google87e94f914aca1841.html"] = "google-site-verification: google87e94f914aca1841.html";

// ---------- write ----------
fs.rmSync(OUT, { recursive: true, force: true });
for (const [f, c] of Object.entries(pages)) { const p = path.join(OUT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); }
fs.cpSync(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });
console.log("Built", Object.keys(pages).length, "files,", ALL.length, "stories");
