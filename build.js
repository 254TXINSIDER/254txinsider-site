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
  ["things-to-do", "Things to Do", "Things to Do", "The go-to guide for Temple, Belton, Salado and Waco: events this week, things to do with kids, date night ideas and nightlife."],
  ["podcast", "Podcast", "254 Texas Insider Podcast", "Conversations with the business owners, builders and leaders shaping Central Texas."]
];
const SEC = {}; SECTIONS.forEach(s => SEC[s[0]] = { key: s[0], short: s[1], name: s[2], desc: s[3] });

// ---------- load stories ----------
const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/stories.js"), "utf8"), sandbox);
const ALL = sandbox.window.STORIES.slice().sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const hasArt = id => fs.existsSync(path.join(ROOT, "assets/art", id + ".webp"));
// Generated art from art.js (photos with credits and graphic cards) lives in .art-cache
const ACACHE = path.join(ROOT, ".art-cache");
const AMAN = fs.existsSync(path.join(ACACHE, "manifest.json")) ? JSON.parse(fs.readFileSync(path.join(ACACHE, "manifest.json"), "utf8")) : {};
const hasGen = id => AMAN[id] && fs.existsSync(path.join(ACACHE, id + ".webp"));
ALL.forEach(s => { s.url = "/news/" + s.id + "/"; s.art = hasArt(s.id) || hasGen(s.id) ? "/assets/art/" + s.id + ".webp" : null; s.artInfo = hasArt(s.id) ? { kind: "illustration" } : (AMAN[s.id] || null); });
const BIZ = ["business", "growth", "real-estate"];
const inCat = k => ALL.filter(s => s.cat === k);
const inSec = k => k === "business" ? ALL.filter(s => BIZ.includes(s.cat))
  : k === "real-estate" ? ALL.filter(s => s.cat === "real-estate" || s.cat === "growth" || (s.also || []).includes("real-estate"))
  : inCat(k);
// ---------- housing dashboard ----------
const msb = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/market.js"), "utf8"), msb);
const MK = msb.window.MARKET;
const esb = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/events.js"), "utf8"), esb);
const EV = esb.window.EVENTS;
const fmtN = (v, u) => typeof v === "string" ? v : u === "$" ? "$" + Math.round(v).toLocaleString("en-US") : (Number.isInteger(v) ? v.toLocaleString("en-US") : String(v));
const chg = (p, note) => p === null || p === undefined ? (note ? `<small>${esc(note)}</small>` : "") : `<small class="${p < 0 ? "dn" : "up"}">${p > 0 ? "▲" : p < 0 ? "▼" : ""} ${Math.abs(p).toFixed(1)}% vs. last year${note ? " · " + esc(note) : ""}</small>`;
const srcA = s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`;
function rateCards() {
  const R = MK.rates, c = r => `<div class="rcard"><span class="lbl">${esc(r.label)}</span><b>${r.v.toFixed(2)}%</b>${r.prev !== undefined ? `<small class="${r.v > r.prev ? "up" : "dn"}">${r.v > r.prev ? "▲" : "▼"} from ${r.prev.toFixed(2)}% last week · ${r.yearAgo.toFixed(2)}% a year ago</small>` : `<small class="${r.chg > 0 ? "up" : "dn"}">${r.chg > 0 ? "▲" : r.chg < 0 ? "▼" : "•"} ${Math.abs(r.chg).toFixed(2)} from prior day</small>`}<span class="asof">${esc(r.asOf)} · ${srcA(r.src)}</span></div>`;
  return `<div class="rates">${[R.daily, R.weekly, R.daily15, R.weekly15].map(c).join("")}</div>`;
}
// [label, realtor.com slug, zillow slug]
const HS_AREAS = [
  ["All of Bell County", "Bell-County_TX", "bell-county-tx"], ["All of McLennan County", "McLennan-County_TX", "mclennan-county-tx"],
  ["Temple", "Temple_TX", "temple-tx"], ["Killeen", "Killeen_TX", "killeen-tx"], ["Belton", "Belton_TX", "belton-tx"], ["Harker Heights", "Harker-Heights_TX", "harker-heights-tx"],
  ["Nolanville", "Nolanville_TX", "nolanville-tx"], ["Salado", "Salado_TX", "salado-tx"], ["Troy", "Troy_TX", "troy-tx"],
  ["Waco", "Waco_TX", "waco-tx"], ["Hewitt", "Hewitt_TX", "hewitt-tx"], ["Woodway", "Woodway_TX", "woodway-tx"], ["Robinson", "Robinson_TX", "robinson-tx"],
  ["Lorena", "Lorena_TX", "lorena-tx"], ["China Spring", "China-Spring_TX", "china-spring-tx"], ["McGregor", "McGregor_TX", "mcgregor-tx"],
  ["Copperas Cove (Coryell Co.)", "Copperas-Cove_TX", "copperas-cove-tx"]
];
const hsUrl = (site, i, mode) => { const a = HS_AREAS[i];
  return site === "realtor" ? (mode === "rent" ? `https://www.realtor.com/apartments/${a[1]}` : `https://www.realtor.com/realestateandhomes-search/${a[1]}`)
    : (mode === "rent" ? `https://www.zillow.com/${a[2]}/rentals/` : `https://www.zillow.com/${a[2]}/`); };
// Reduced-rate senior housing in the 254. HUD = rent based on income (usually about 30%); TC = tax-credit senior community with reduced rents for income-qualified renters.
// Sources: HUD Multifamily Assisted / Section 202 and LIHTC databases (Jan 2026). Phone numbers from HUD records or the property.
const SENIOR_AFF = [
  ["Bell", "Golden Haven Apartments", "505 N 2nd St, Temple", "254-773-2009", "HUD"],
  ["Bell", "Country Lane Seniors–Temple Community", "2916 Country Lane Dr, Temple", "", "TC"],
  ["Bell", "The Grand Reserve Seniors–Temple Community", "2816 Country Lane Dr, Temple", "", "TC"],
  ["Bell", "Chisholm Trail Senior Village", "1003 W Martin Luther King Jr Ave, Belton", "", "TC"],
  ["McLennan", "North Crest Court", "4200 N 19th St, Waco", "254-757-2242", "HUD"],
  ["McLennan", "North Crest Creekside", "2001 Stewart Dr, Waco", "254-757-2242", "HUD"],
  ["McLennan", "Brook Oaks Senior Residences (62+)", "1725 Colcord Ave, Waco", "254-754-6000", "HUD"],
  ["McLennan", "Dripping Springs Senior Village", "2405 J J Flewellen Rd, Waco", "", "TC"],
  ["McLennan", "McGregor Seniors Apartments", "1007 S Madison St, McGregor", "", "TC"],
  ["Coryell", "Exchange Sunshine Home", "1103 Leonhard St, Copperas Cove", "254-542-6000", "HUD"],
  ["Milam", "Milam Senior Estates", "1100 N Crockett Ave, Cameron", "", "TC"],
  ["Milam", "Hunters Chase Senior Apartments", "1501 E Belton Ave, Rockdale", "", "TC"],
  ["Bosque", "Clifton Housing Authority (senior units)", "607 N Avenue K, Clifton", "254-675-8294", "HUD"],
  ["Erath", "Stephenville Crossing", "1300 W Hyman St, Stephenville", "254-965-6964", "HUD"],
  ["Erath", "Bunker Hill Senior Village", "1801 W Lingleville Rd, Stephenville", "", "TC"]
];
const HELP_LINES = [
  ["Bell, Coryell, Lampasas, Milam, Hamilton", "Area Agency on Aging of Central Texas / Aging & Disability Resource Center", "1-855-937-2372", "https://ctcog.org/aging/"],
  ["McLennan, Bosque, Falls, Hill", "Area Agency on Aging of the Heart of Texas", "254-292-1800", "https://www.hotcogtx.gov/health-and-human-services/area-agency-on-aging"],
  ["Temple & Belton", "Central Texas Housing Consortium (Temple & Belton housing authorities)", "254-773-2009", ""],
  ["Killeen", "Killeen Housing Authority", "254-634-5243", ""],
  ["Waco", "Waco Housing Authority & Affiliates", "254-752-0324", "https://www.wacopha.org"],
  ["Anywhere in Texas", "2-1-1 Texas (free help line for housing, rent and utility help)", "2-1-1", "https://www.211texas.org"]
];
const tel = p => p === "2-1-1" ? "211" : p.replace(/[^0-9]/g, "");
// Fort Cavazos (Fort Hood, TX MHA TX286) 2026 BAH, monthly, effective Jan. 1, 2026. Source: DTMO rates as published by milpaytools.com; confirm at DTMO.
const BAH = { year: 2026, mha: "Fort Hood, TX (TX286)", rows: [["E-4", 1662, 1374], ["E-5", 1695, 1530], ["E-6", 1920, 1626], ["E-7", 2070, 1668], ["E-8", 2238, 1746], ["W-2", 2139, 1743], ["O-2", 1917, 1689], ["O-3", 2340, 1833], ["O-4", 2577, 2076], ["O-5", 2748, 2169]] };
const PRO_SLOTS = [["Realtor · Bell County", "🏡"], ["Realtor · McLennan County", "🏡"], ["Mortgage lender", "🏦"], ["Title company", "📜"], ["Home inspector", "🔍"], ["Home builder", "🏗️"], ["Insurance agent", "🛡️"], ["Property management", "🔑"]];
function localPros() {
  const cats = PRO_SLOTS.map(p => p[0]).concat(["Other home service"]);
  return `<div class="pros" id="local-pros"><div class="pros-head"><h2>Featured Local Pros</h2><span>Founding sponsor spots open</span></div>
<p class="pros-sub">Put your business in front of Central Texas buyers, sellers and homeowners right when they're making a move. One spot per category.</p>
<div class="pros-grid">${PRO_SLOTS.map(p => `<div class="pro-slot"><span class="pro-ico">${p[1]}</span><b>${esc(p[0])}</b><span>Your business here</span><a class="btn" href="#pros-form" data-cat="${esc(p[0])}">Claim this spot</a></div>`).join("")}</div>
<form class="pros-form" id="pros-form" name="sponsor" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="sponsor"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h3>Claim a spot or ask about rates</h3><div class="pf-row"><label>Your name <input name="name" required></label><label>Business name <input name="business" required></label><label>Category <select name="category" id="pf-cat">${cats.map(c => `<option>${esc(c)}</option>`).join("")}</select></label><label>Phone <input name="phone" type="tel"></label><label>Email <input name="email" type="email" required></label><label>Website <input name="website" placeholder="optional"></label></div><label class="pf-msg">Anything we should know? <textarea name="message" rows="3" placeholder="Areas you serve, what you'd like to promote..."></textarea></label><button class="btn" type="submit">Send, we'll call you</button><p class="hs-note">Sponsored listings are marked "Sponsored." ${NAME} does not endorse any business.</p></form></div>`;
}
// ---------- 254 Scoreboard ----------
const ssb = { window: {} }; try { vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/scores.js"), "utf8"), ssb); } catch (e) { console.log("scores.js:", e.message); }
const SC = ssb.window.SCORES || { updated: "", sports: [] };
const sbDate = d => { const x = new Date(d + "T12:00:00"); return x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" }); };
const STATUS = { playoffs: ["Playoffs", "sb-po"], season: ["In season", "sb-in"], off: ["Off season", "sb-off"] };
function sbGame(x) {
  const done = x.s1 !== undefined && x.s1 !== null && x.s1 !== "";
  const w = done && Number(x.s1) > Number(x.s2), l = done && Number(x.s1) < Number(x.s2);
  return `<div class="sb-game${done ? (w ? " win" : l ? " loss" : "") : " up"}" data-lv="${esc(x.lv || "HS")}"><div class="sb-meta"><span>${sbDate(x.d)}</span>${x.lv === "College" ? '<span class="sb-lv">College</span>' : ""}${x.note ? `<span>${esc(x.note)}</span>` : ""}</div>
<div class="sb-line"><b>${schoolFor(x.t1) ? `<a href="${schoolFor(x.t1).url}">${esc(x.t1)}</a>` : esc(x.t1)}</b>${done ? `<span class="sb-s">${esc(x.s1)}</span>` : ""}</div><div class="sb-line"><span>${esc(x.t2)}</span>${done ? `<span class="sb-s">${esc(x.s2)}</span>` : ""}</div>
${done ? `<div class="sb-res">${w ? "W" : l ? "L" : "T"} · Final</div>` : `<div class="sb-res">${esc(x.time || "Time TBA")}${x.where ? " · " + esc(x.where) : ""}</div>`}</div>`;
}
function sbSport(s) {
  const st = STATUS[s.status] || STATUS.off;
  const tr = s.tracker;
  const tracker = tr ? `<div class="sb-tracker"><h4>🏆 Playoff tracker <span>${esc(tr.round || "")}${tr.next ? " · Next: " + esc(tr.next) : ""}</span></h4>
<div class="sb-cols"><div><h5>Still alive (${tr.alive.length})</h5><ul>${tr.alive.map(a => `<li><b>${schoolFor(a.t) ? `<a href="${schoolFor(a.t).url}">${esc(a.t)}</a>` : esc(a.t)}</b>${a.c ? ` <em>${esc(a.c)}</em>` : ""}${a.r ? ` (${esc(a.r)})` : ""}<span>${esc(a.n)}</span></li>`).join("")}</ul></div>
<div><h5>Season over</h5><ul class="sb-out">${tr.out.map(a => `<li><b>${esc(a.t)}</b>${a.r ? ` (${esc(a.r)})` : ""}<span>${esc(a.n)}</span></li>`).join("")}</ul></div></div></div>` : "";
  const games = (s.games || []).slice().sort((a, b) => b.d.localeCompare(a.d)), up = (s.up || []).slice().sort((a, b) => a.d.localeCompare(b.d));
  const body = s.status === "off" ? `<p class="sb-when">${esc(s.when || "Off season.")}</p>` :
    `${s.note ? `<p class="sb-note">${esc(s.note)}</p>` : ""}${tracker}${up.length ? `<h5 class="sb-h">Upcoming</h5><div class="sb-grid">${up.map(sbGame).join("")}</div>` : ""}${games.length ? `<h5 class="sb-h">Latest scores</h5><div class="sb-grid">${games.map(sbGame).join("")}</div>` : ""}${!up.length && !games.length && !tr && !s.note ? '<p class="sb-when">Scores will show up here as they come in.</p>' : ""}`;
  return `<section class="sb-sport ${st[1]}" id="sb-${esc(s.k)}" data-k="${esc(s.k)}" data-g="${esc(s.g)}" data-st="${esc(s.status)}"><div class="sb-head"><h3>${esc(s.n)}</h3><span class="sb-g">${esc(s.g)}</span><span class="sb-badge">${st[0]}</span><span class="sb-season">${esc(s.season)}</span></div>${body}</section>`;
}
function scoreboard(compact) {
  const order = { playoffs: 0, season: 1, off: 2 };
  const list = SC.sports.slice().sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
  if (compact) {
    const live = list.filter(s => s.status !== "off");
    return `<div class="sb sb-compact"><div class="sb-top"><h2 class="list-head">254 <span>Scoreboard</span></h2><a class="btn" href="/scoreboard/">Full scoreboard &amp; playoff tracker →</a></div>${live.filter(s => s.status === "playoffs" && s.tracker).map(s => `<p class="sb-strip"><b>${esc(s.n)} playoffs:</b> ${s.tracker.alive.length} area teams still alive. ${esc(s.tracker.round || "")}</p>`).join("")}<p class="sb-strip">In season now: ${live.map(s => `<a href="/scoreboard/#sb-${esc(s.k)}">${esc(s.n)}</a>`).join(" · ")}</p></div>`;
  }
  return `<div class="sb"><div class="sb-filters"><div class="tdo-chips" id="sb-gender"><button class="chip on" data-v="all">All</button><button class="chip" data-v="Boys">Boys</button><button class="chip" data-v="Girls">Girls</button></div>
<div class="tdo-chips" id="sb-sport"><button class="chip on" data-v="all">All sports</button><button class="chip" data-v="live">In season</button>${list.map(s => `<button class="chip" data-v="${esc(s.k)}">${esc(s.n)}</button>`).join("")}</div></div>
<p class="sb-upd">Updated ${SC.updated ? sbDate(SC.updated) : ""}. Covering Bell, McLennan, Coryell and Lampasas county schools plus Baylor, UMHB, Tarleton, Temple College, McLennan (MCC), Hill College, Ranger College and Cisco College. <a href="/contact/?topic=tip">Send us a score</a>.</p>
${SPORTS_SPONSOR("Central Texas", "254 Scoreboard presented by: your business here")}${list.map(sbSport).join("")}${schoolIndex()}${SPORTS_SPONSOR("Central Texas", "Player of the Week presented by: your business here")}</div>`;
}
// ---------- School pages + sports sponsor spots ----------
// [slug, name, city, level, match regex (team names in scores.js and sports story titles)]
const SCHOOLS = [
  ["temple", "Temple High School", "Temple", "HS", /^Temple( High)?$/, /\bTemple (High|Wildcats)\b/],
  ["belton", "Belton High School", "Belton", "HS", /^Belton( High)?$/, /^Belton\b|(?<!Lake )\bBelton (High|Tigers)\b/],
  ["lake-belton", "Lake Belton High School", "Temple", "HS", /Lake Belton/],
  ["killeen", "Killeen High School", "Killeen", "HS", /^Killeen( High)?$/, /\bKilleen (High|Kangaroos)\b/],
  ["shoemaker", "Shoemaker High School", "Killeen", "HS", /Shoemaker/],
  ["ellison", "Ellison High School", "Killeen", "HS", /Ellison/],
  ["chaparral", "Chaparral High School", "Killeen", "HS", /Chaparral/],
  ["harker-heights", "Harker Heights High School", "Harker Heights", "HS", /Harker Heights/],
  ["copperas-cove", "Copperas Cove High School", "Copperas Cove", "HS", /Copperas Cove/],
  ["salado", "Salado High School", "Salado", "HS", /Salado/],
  ["academy", "Academy High School", "Little River-Academy", "HS", /^Academy$|Little River-Academy/],
  ["holland", "Holland High School", "Holland", "HS", /^Holland$/],
  ["rogers", "Rogers High School", "Rogers", "HS", /^Rogers$/],
  ["troy", "Troy High School", "Troy", "HS", /^Troy$/],
  ["moody", "Moody High School", "Moody", "HS", /^Moody$/],
  ["gatesville", "Gatesville High School", "Gatesville", "HS", /Gatesville/],
  ["lampasas", "Lampasas High School", "Lampasas", "HS", /Lampasas/],
  ["waco", "Waco High School", "Waco", "HS", /^Waco( High)?$/, /\bWaco High\b/],
  ["university", "University High School", "Waco", "HS", /^(Waco )?University$/],
  ["midway", "Midway High School", "Woodway", "HS", /Midway/],
  ["china-spring", "China Spring High School", "China Spring", "HS", /China Spring/],
  ["la-vega", "La Vega High School", "Bellmead", "HS", /La Vega/],
  ["robinson", "Robinson High School", "Robinson", "HS", /^Robinson$/],
  ["lorena", "Lorena High School", "Lorena", "HS", /Lorena/],
  ["mcgregor", "McGregor High School", "McGregor", "HS", /McGregor/],
  ["connally", "Connally High School", "Waco", "HS", /Connally/],
  ["crawford", "Crawford High School", "Crawford", "HS", /^Crawford$/],
  ["axtell", "Axtell High School", "Axtell", "HS", /Axtell/],
  ["bremond", "Bremond High School", "Bremond", "HS", /Bremond/],
  ["rosebud-lott", "Rosebud-Lott High School", "Rosebud", "HS", /Rosebud-Lott/],
  ["cameron-yoe", "Cameron Yoe High School", "Cameron", "HS", /Cameron Yoe/],
  ["aquilla", "Aquilla High School", "Aquilla", "HS", /Aquilla/],
  ["oglesby", "Oglesby High School", "Oglesby", "HS", /Oglesby/],
  ["mount-calm", "Mount Calm High School", "Mount Calm", "HS", /Mount Calm/],
  ["valor-prep", "Valor Prep", "Waco", "HS", /Valor/],
  ["central-texas-christian", "Central Texas Christian School", "Temple", "HS", /Central Texas Christian/],
  ["baylor", "Baylor University", "Waco", "College", /Baylor/],
  ["umhb", "Mary Hardin-Baylor (UMHB)", "Belton", "College", /UMHB|Mary Hardin-Baylor/],
  ["tarleton", "Tarleton State University", "Stephenville", "College", /Tarleton/],
  ["temple-college", "Temple College", "Temple", "College", /Temple College/],
  ["mclennan", "McLennan Community College", "Waco", "College", /McLennan|\bMCC\b/],
  ["hill-college", "Hill College", "Hillsboro", "College", /Hill College/],
  ["ranger-college", "Ranger College", "Ranger", "College", /Ranger College/],
  ["cisco-college", "Cisco College", "Cisco", "College", /Cisco College/]
].map(([slug, name, city, lv, rx, srx]) => ({ slug, name, city, lv, rx, srx: srx || rx, url: "/scoreboard/" + slug + "/" }));
const schoolFor = t => SCHOOLS.find(s => s.rx.test(t || ""));
const SPORTS_SPONSOR = (where, label) => `<div class="sp-spot"><span class="sp-tag">Sponsor spot</span><div><b>${label}</b><span>Put your business in front of every family following ${esc(where)} sports. One sponsor per spot.</span></div><a class="btn" href="/sports/#sports-sponsor">Claim this spot</a></div>`;
const SPORTS_SPONSOR_FORM = `<form class="pros-form" id="sports-sponsor" name="sports-sponsor" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="sports-sponsor"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h3>Sponsor 254 sports</h3><p class="pros-sub">Get your business in front of the parents, grandparents and fans following Central Texas teams every week. Sponsored spots are clearly marked and never affect our coverage.</p>
<div class="pf-row"><label>Your name <input name="name" required></label><label>Business <input name="business" required></label><label>Interested in <select name="spot"><option>254 Scoreboard presenting sponsor</option><option>A school's page (name the school below)</option><option>Player of the Week sponsor</option><option>Sports &amp; Community section sponsor</option></select></label><label>School (if any) <input name="school" placeholder="Belton, Temple, Lorena..."></label><label>Phone <input name="phone" type="tel"></label><label>Email <input name="email" type="email" required></label></div>
<label class="pf-msg">Anything else? <textarea name="message" rows="3"></textarea></label><button class="btn" type="submit">Send, we'll call you</button></form>`;
function schoolData(sc) {
  const out = [];
  for (const sp of SC.sports) {
    const g = (sp.games || []).filter(x => sc.rx.test(x.t1)), u = (sp.up || []).filter(x => sc.rx.test(x.t1));
    const tr = sp.tracker ? { alive: sp.tracker.alive.filter(a => sc.rx.test(a.t)), out: sp.tracker.out.filter(a => sc.rx.test(a.t)) } : null;
    if (g.length || u.length || (tr && (tr.alive.length || tr.out.length))) out.push({ sp, g, u, tr });
  }
  return out;
}
function schoolPage(sc) {
  const data = schoolData(sc);
  const SPORTY = /football|basketball|volleyball|soccer|baseball|softball|track|cross country|band|playoff|area round|regional|state|game|season|tournament|score|wins?\b|beat|rout|title|champion|bowl|senior day|coach|season/i;
  const stories = ALL.filter(s => s.cat === "sports" && sc.srx.test(s.title) && SPORTY.test(s.title + " " + (s.dek || ""))).slice(0, 8);
  const crumbs = [["Home", "/"], ["Sports", "/sports/"], ["254 Scoreboard", "/scoreboard/"], [sc.name, sc.url]];
  const sections = data.map(({ sp, g, u, tr }) => {
    const st = (STATUS[sp.status] || STATUS.off);
    const po = tr && tr.alive.length ? `<p class="sc-po alive">🏆 Still alive: ${tr.alive.map(a => esc(a.n)).join(" · ")}</p>` : tr && tr.out.length ? `<p class="sc-po">Season over: ${tr.out.map(a => esc(a.n)).join(" · ")}</p>` : "";
    return `<section class="sb-sport ${st[1]}"><div class="sb-head"><h3>${esc(sp.n)}</h3><span class="sb-g">${esc(sp.g)}</span><span class="sb-badge">${st[0]}</span></div>${po}${u.length ? `<h5 class="sb-h">Upcoming</h5><div class="sb-grid">${u.map(sbGame).join("")}</div>` : ""}${g.length ? `<h5 class="sb-h">Latest scores</h5><div class="sb-grid">${g.map(sbGame).join("")}</div>` : ""}</section>`;
  }).join("");
  const live = SC.sports.filter(s => s.status !== "off").map(s => s.n).join(", ");
  const empty = `<p class="sb-when">No ${esc(sc.name)} results posted yet this season. Scores show up here as they're reported${live ? ` (in season now: ${esc(live)})` : ""}. Coach or parent? <a href="/contact/?topic=tip">Send us a score</a>.</p>`;
  return { noindex: !data.length && !stories.length, html: `<div class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}<h1>${esc(sc.name)} <span>sports</span></h1><p>${esc(sc.city)}, Texas · ${sc.lv === "College" ? "College athletics" : "High school athletics"}. Scores, schedules and playoff status for boys and girls teams.</p></div></div>
<section class="block"><div class="wrap">${SPORTS_SPONSOR(sc.name, "Proud supporter of " + esc(sc.name) + " athletics: your business here")}${sections || empty}
${stories.length ? `<h2 class="list-head">${esc(sc.name)} <span>stories</span></h2><div class="rows">${stories.map(s => row(s, false, "side")).join("")}</div>` : ""}
<p class="src"><a href="/scoreboard/">← All 254 scores and the playoff tracker</a></p></div></section>`, crumbs };
}
const schoolIndex = () => `<section class="sc-index"><h2 class="list-head">Find your <span>school</span></h2><h5 class="sb-h">High schools</h5><div class="sc-grid">${SCHOOLS.filter(s => s.lv === "HS").map(s => `<a href="${s.url}">${esc(s.name.replace(/ High School$/, ""))}<span>${esc(s.city)}</span></a>`).join("")}</div><h5 class="sb-h">Colleges</h5><div class="sc-grid">${SCHOOLS.filter(s => s.lv === "College").map(s => `<a href="${s.url}">${esc(s.name)}<span>${esc(s.city)}</span></a>`).join("")}</div></section>`;
// ---------- FAQ + service markup helpers (SEO / AEO) ----------
const AREAS = ["Bell County, TX", "McLennan County, TX", "Coryell County, TX", "Lampasas County, TX", "Temple, TX", "Killeen, TX", "Waco, TX", "Belton, TX", "Harker Heights, TX", "Copperas Cove, TX"];
const faqHtml = (title, items) => `<section class="faq"><h2 class="list-head">${title}</h2>${items.map(q => `<details><summary>${esc(q[0])}</summary><p>${q[1]}</p></details>`).join("")}</section>`;
const faqLd = items => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(q => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: strip(q[1]) } })) });
const serviceLd = (name, desc, url, types) => ({ "@context": "https://schema.org", "@type": "Service", name, description: desc, url: abs(url), provider: { "@id": SITE + "/#org" }, areaServed: AREAS.map(a => ({ "@type": "Place", name: a })), serviceType: types });
const TAX_FAQ = [
  ["When is the homestead exemption deadline in Texas?", "File by <b>April 30</b> with your county appraisal district (Bell, McLennan or Coryell). It's free. If you missed it, you can file late, up to two years after the tax bill's delinquency date, and get a refund."],
  ["How much does the Texas homestead exemption save?", "It takes <b>$140,000 off your home's value for school taxes</b>, and some cities and counties take off more. It also caps how fast your taxable value can rise to 10% a year, starting the year after you qualify."],
  ["What is the deadline to protest my property appraisal?", "<b>May 15</b>, or 30 days after your notice of appraised value is mailed, whichever is later. If the deadline falls on a weekend or holiday, it moves to the next business day."],
  ["Do I need to pay a company to file my homestead exemption?", "No. Filing is free with your county appraisal district, online or with the state's Form 50-114. Ignore mailers that charge a fee to do it for you."]
];
const HOME_FAQ = [
  ["Is 254 Home Pros free for homeowners?", "Yes. Requesting a pro is free and there's no obligation."],
  ["How many companies get my request?", "One local partner per trade you pick. We don't sell your request to a list of competing companies."],
  ["How do I check that a Texas contractor is licensed?", "AC and electrical licenses can be checked with the <a href=\"https://www.tdlr.texas.gov/LicenseSearch/\" target=\"_blank\" rel=\"noopener\">TDLR license search</a>. Plumbers are licensed by the <a href=\"https://tsbpe.texas.gov/\" target=\"_blank\" rel=\"noopener\">Texas State Board of Plumbing Examiners</a>. Always ask for proof of insurance too."],
  ["What areas does 254 Home Pros cover?", "Bell, McLennan, Coryell and Lampasas counties, including Temple, Belton, Killeen, Harker Heights, Copperas Cove, Salado, Waco, Hewitt, Woodway, Gatesville and Lampasas."]
];
const BUILD_FAQ = [
  ["How do I find a commercial HVAC, plumbing or roofing contractor in Central Texas?", "Send a free project request through 254 Build &amp; Facilities. Pick the trades you need and we connect you with vetted local commercial partners in Bell, McLennan and Coryell counties."],
  ["Where do Temple, Killeen, Waco and Belton post public bids?", "Each city posts bids on its purchasing page; Killeen uses OpenGov and Killeen ISD uses IonWave. State agency, TxDOT and university bids are on the Texas Electronic State Business Daily. Links are in the 254 Bid Board on this page."],
  ["Do commercial projects in Texas need TDLR accessibility registration?", "Generally, yes, for projects with a total estimated cost of $50,000 or more. See the <a href=\"https://www.tdlr.texas.gov/ab/\" target=\"_blank\" rel=\"noopener\">TDLR Architectural Barriers program</a>."],
  ["Are there utility rebates for commercial HVAC in Central Texas?", "If your building is on Oncor's lines, high-efficiency HVAC can qualify for instant discounts through participating distributors, and rural sites have a separate program. Ask your contractor to include them in the quote."]
];
// ---------- 254 Home Pros (residential lead hub) ----------
const HOME_TRADES = [["AC & Heating", "❄️"], ["Plumbing", "🚰"], ["Electrical", "⚡"], ["Roofing", "🏠"], ["Foundation Repair", "🧱"], ["Pest Control", "🐜"], ["Garage Doors", "🚪"], ["Fencing", "🪵"], ["Landscaping & Lawn", "🌳"], ["Tree Service", "🪓"], ["Pools & Spas", "🏊"], ["Handyman", "🔧"], ["Gutters", "🌧️"], ["Remodeling", "🛠️"], ["Painting", "🎨"], ["Cleaning", "🧽"]];
const HOME_PROMO = `<a class="bld-promo" href="/home-pros/"><b>Need a pro at the house?</b><span>AC, plumbing, roofing, foundation and more. One trusted local pro per trade, not a bidding war. →</span></a>`;
const BUILD_PROMO = `<a class="bld-promo" href="/build/"><b>Commercial project in the 254?</b><span>HVAC, plumbing, electrical, roofing, construction and more. Get connected with local commercial pros. →</span></a>`;
function homeHub() {
  const needs = HOME_TRADES.map(t => t[0]);
  const cities = ["Temple", "Belton", "Killeen", "Harker Heights", "Nolanville", "Copperas Cove", "Salado", "Waco", "Hewitt / Woodway", "Robinson", "Gatesville", "Lampasas", "Other 254"];
  return `<div class="page-hero bld-hero"><div class="wrap"><span class="kicker">Homeowners</span><h1>254 Home <span>Pros</span></h1><p>Need work done at the house? Tell us what's going on and we'll pass it to one trusted local pro in that trade. No bidding war, no sharing your number with five companies.</p><div class="btn-row"><a class="btn" href="#request">Request a pro</a><a class="btn ghost" href="#home-vendors">I'm a local pro</a></div></div></div>
<section class="block"><div class="wrap">
<div class="bld-grid"><div class="bld-main">
<form class="pros-form bld-form" id="request" name="home-request" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="home-request"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h2>Request a home pro</h2><p class="bld-sub">Free for homeowners. Your request goes to one local partner in each trade you pick.</p>
<div class="pf-row"><label>Your name <input name="name" required></label><label>Phone <input name="phone" type="tel" required></label><label>Email <input name="email" type="email" required></label>
<label>City <select name="city">${cities.map(c => `<option>${esc(c)}</option>`).join("")}</select></label><label>How soon? <select name="urgency"><option>Today / urgent</option><option>This week</option><option>This month</option><option>Just getting quotes</option></select></label><label>Own or rent? <select name="own_rent"><option>Own</option><option>Rent (I have the owner's OK)</option><option>Property manager / landlord</option></select></label></div>
<fieldset class="bld-needs"><legend>What do you need? (pick all that apply)</legend>${needs.map(n => `<label><input type="checkbox" name="needs[]" value="${esc(n)}"> ${esc(n)}</label>`).join("")}</fieldset>
<label class="pf-msg">What's going on? <textarea name="details" rows="4" placeholder="Upstairs AC blowing warm, water heater leaking, hail hit the roof, cracks over the doors..."></textarea></label>
<label class="bld-consent"><input type="checkbox" name="consent" value="yes" required> OK to share my request with one local partner per trade I picked so they can contact me.</label>
<button class="btn" type="submit">Send my request</button><p class="hs-note">Smell gas? Leave the house and call 911 or your gas company. Sparks or burning smell? Call 911. ${NAME} is not a contractor; partners are independent businesses. Always check that a pro is licensed and insured for their trade.</p></form>

<div class="pros" id="home-vendors"><div class="pros-head"><h2>Featured Home Pros</h2><span>Founding spots open</span></div>
<p class="pros-sub">One featured pro per trade. Homeowner requests in your trade come to you only, not to a list of competitors, and you're featured next to the local news 254 homeowners read.</p>
<div class="pros-grid">${HOME_TRADES.map(t => `<div class="pro-slot"><span class="pro-ico">${t[1]}</span><b>${esc(t[0])}</b><span>Your company here</span><a class="btn" href="#home-vendor-form" data-htrade="${esc(t[0])}">Claim this spot</a></div>`).join("")}</div>
<form class="pros-form" id="home-vendor-form" name="home-pro" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="home-pro"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h3>Local pros: claim your trade</h3><div class="pf-row"><label>Your name <input name="name" required></label><label>Company <input name="company" required></label><label>Trade <select name="trade" id="hv-trade">${needs.concat(["Other"]).map(c => `<option>${esc(c)}</option>`).join("")}</select></label><label>Phone <input name="phone" type="tel"></label><label>Email <input name="email" type="email" required></label><label>Website <input name="website" placeholder="optional"></label></div>
<div class="pf-row"><label>Cities you serve <input name="cities" placeholder="Temple, Belton, Killeen..."></label><label>Licensed / insured? <select name="licensed"><option>Yes</option><option>In progress</option><option>Not required for my trade</option></select></label><label>Years in business <input name="years" placeholder="optional"></label></div>
<label class="pf-msg">Anything else? <textarea name="message" rows="3" placeholder="Specialties, service area, emergency service..."></textarea></label><button class="btn" type="submit">Send, we'll call you</button><p class="hs-note">Featured listings are marked "Sponsored." ${NAME} does not endorse any business.</p></form></div>
</div>
<aside class="bld-side">
<div class="bld-box"><h3>Season checklist</h3><ul>
<li><b>Before a freeze.</b> Know where your main water shutoff is, wrap outdoor faucets and exposed pipes, and drip faucets on outside walls on the coldest nights.</li>
<li><b>Before summer.</b> Change the air filter, rinse the outdoor AC unit, and get a tune-up in spring before every company is booked.</li>
<li><b>After hail.</b> Photograph the roof, gutters and vents from the ground, call your insurance company, and be wary of storm chasers knocking on doors.</li>
<li><b>Doors sticking, new cracks?</b> Central Texas clay soil shifts with drought and rain. Have foundation movement checked early; it's cheaper.</li></ul></div>
<div class="bld-box"><h3>Hiring tips</h3><ul>
<li>Get two or three quotes for big jobs, in writing.</li>
<li>Ask for proof of insurance, and a license where your trade requires one. Look up AC and electrical licenses on the state's <a href="https://www.tdlr.texas.gov/LicenseSearch/" target="_blank" rel="noopener">TDLR license search</a> and plumbers with the <a href="https://tsbpe.texas.gov/" target="_blank" rel="noopener">Texas State Board of Plumbing Examiners</a>.</li>
<li>Don't pay in full up front. A reasonable deposit is normal; the rest when the work is done.</li></ul></div>
<div class="bld-box"><h3>More for homeowners</h3><ul><li><a href="/real-estate/#property-tax-guide">Lower your property taxes</a></li><li><a href="/real-estate/#housing-dashboard">254 Housing Dashboard</a></li><li><a href="/build/">Commercial building? 254 Build &amp; Facilities</a></li></ul></div>
</aside></div>${faqHtml("Common <span>questions</span>", HOME_FAQ)}</div></section>`;
}
function taxGuide() {
  const cad = [["Bell County", "Tax Appraisal District of Bell County", "https://bellcad.org/", "254-939-5841", "https://portal.bellcad.org/"], ["McLennan County", "McLennan Central Appraisal District", "https://mclennancad.org/", "254-752-9864", "https://mclennancad.org/"], ["Coryell County", "Coryell Central Appraisal District", "https://coryellcad.org/", "", "https://coryellcad.org/"]];
  return `<div class="taxg" id="property-tax-guide"><h2>Lower your property taxes</h2>
<div class="tg-count"><div><span>Homestead exemption deadline</span><b id="tg-hs">April 30</b><small id="tg-hs-d"></small></div><div><span>Appraisal protest deadline</span><b id="tg-pr">May 15</b><small id="tg-pr-d"></small></div></div>
<div class="tg-cols"><div><h3>1. File your homestead exemption (free)</h3><ul><li>If you own and live in your home, file once with your county appraisal district. It's free. Ignore mailers that charge a fee to do it for you.</li><li>It takes <b>$140,000 off your value for school taxes</b>, and some cities and counties take off more. It also caps how fast your taxable value can rise to 10% a year, starting the year after you qualify.</li><li>The deadline is <b>April 30</b>. Bought last year and never filed? You can file late, up to two years after the tax bill's delinquency date, and get a refund.</li><li>Use the appraisal district's online form or the state's <a href="https://comptroller.texas.gov/forms/50-114.pdf" target="_blank" rel="noopener">Form 50-114</a>. Have your Texas ID ready; the address must match the home.</li></ul></div>
<div><h3>2. Protest your value if it's too high</h3><ul><li>Value notices arrive in the spring. You can protest by <b>May 15</b> or 30 days after the notice is mailed, whichever is later.</li><li>Filing online is fastest. Bell County's portal uses the PIN printed on your notice.</li><li>Bring evidence: recent sales of similar homes nearby, photos of needed repairs, or your closing statement if you bought recently.</li><li>Many protests are settled in an informal review with appraisal staff before any formal hearing.</li></ul></div></div>
<div class="tg-cads">${cad.map(c => `<div><b>${esc(c[0])}</b><a href="${c[2]}" target="_blank" rel="noopener">${esc(c[1])} ↗</a>${c[3] ? `<a href="tel:${tel(c[3])}">📞 ${esc(c[3])}</a>` : ""}<a href="${c[4]}" target="_blank" rel="noopener">File a protest online ↗</a></div>`).join("")}</div>
<p class="hs-note">Deadlines from the <a href="https://comptroller.texas.gov/taxes/property-tax/protests/" target="_blank" rel="noopener">Texas Comptroller</a>. If a deadline falls on a weekend or holiday, it moves to the next business day. General information, not legal or tax advice.</p></div>`;
}
function militaryCorner() {
  const r = MK.rates.weekly.v / 1200, n = 360, fac = r / (1 - Math.pow(1 + r, -n)), tax = 2.0351, ins = 2000;
  const price = bah => Math.floor(((bah - ins / 12) / (1.0215 * fac + tax / 1200)) / 5000) * 5000;
  const $ = v => "$" + v.toLocaleString("en-US");
  return `<div class="mil" id="fort-cavazos"><h2>Fort Cavazos housing corner</h2><p class="pros-sub">Moving to Killeen, Harker Heights or Copperas Cove? Here's what your ${BAH.year} housing allowance (BAH) covers.</p>
<div class="mil-wrap"><table class="mil-t"><thead><tr><th>Rank</th><th>BAH with dependents</th><th>Without dependents</th><th>Home it could cover*</th></tr></thead><tbody>${BAH.rows.map(x => `<tr><td>${x[0]}</td><td>${$(x[1])}</td><td>${$(x[2])}</td><td>${$(price(x[1]))}</td></tr>`).join("")}</tbody></table></div>
<p class="hs-note">*Home price where a VA loan with no down payment (funding fee financed), Killeen property taxes and $2,000/yr insurance add up to the with-dependents BAH, at today's ${MK.rates.weekly.v}% average 30-year rate. BAH is monthly and tax-free for the ${esc(BAH.mha)} housing area. ${BAH.year + 1} rates are usually announced in December. <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/" target="_blank" rel="noopener">Confirm your rate with the Defense Travel Management Office ↗</a></p>
<div class="mil-tips"><div><b>VA loan basics</b><p>No down payment and no monthly mortgage insurance. There is a one-time funding fee (2.15% for first use with no down payment) that can be rolled into the loan, and it's waived for veterans with a service-connected disability rating.</p></div><div><b>Buy or rent?</b><p>If you'll be here three years or more, buying with BAH can build equity, and many soldiers rent the home out after they PCS. Shorter tours usually favor renting. Use the payment calculator above with the "VA" loan type to run your numbers.</p></div><div><b>Disabled veterans</b><p>Veterans with a disability rating can get extra property tax exemptions, and a 100% rating can exempt your home entirely. Apply through your county appraisal district.</p></div></div></div>`;
}
function housingFinder() {
  const opts = HS_AREAS.map((a, i) => `<option value="${i}">${esc(a[0])}</option>`).join("");
  const z0 = HS_AREAS[0][2];
  const card = s => `<div class="sl-card" data-county="${esc(s[0])}"><span class="sl-tag ${s[4] === "HUD" ? "hud" : "tc"}">${s[4] === "HUD" ? "Rent based on income" : "Reduced rent, income limits"}</span><b>${esc(s[1])}</b><span>${esc(s[2])} · ${esc(s[0])} Co.</span><span class="sl-links">${s[3] ? `<a href="tel:${tel(s[3])}">📞 ${esc(s[3])}</a>` : ""}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s[1].replace(/ \(.*\)/, "") + ", " + s[2] + ", TX")}" target="_blank" rel="noopener">Map ↗</a></span></div>`;
  const counties = [...new Set(SENIOR_AFF.map(s => s[0]))];
  return `<div class="hsearch" id="apartment-finder"><h3>Apartment finder</h3><div class="hs-row"><label>Area <select id="apt-area">${opts}</select></label></div><div class="hs-btns"><a id="apt-acom" class="btn" href="https://www.apartments.com/${z0}/" target="_blank" rel="noopener">Apartments.com ↗</a><a id="apt-zillow" class="btn alt" href="https://www.zillow.com/${z0}/rentals/" target="_blank" rel="noopener">Zillow rentals ↗</a><a id="apt-realtor" class="btn alt" href="https://www.realtor.com/apartments/${HS_AREAS[0][1]}" target="_blank" rel="noopener">Realtor.com rentals ↗</a></div><p class="hs-note"><b>Need income-based rent?</b> <a href="https://resources.hud.gov/" target="_blank" rel="noopener">HUD's Resource Locator</a> maps subsidized and tax-credit apartments near you, or call your local housing authority (numbers below). ${NAME} is not affiliated with any listing site.</p></div>
${localPros()}
${taxGuide()}
${militaryCorner()}
<div class="senior" id="senior-living"><h2>Senior living in the 254</h2>
<div class="sl-cols"><div class="sl-box"><h3>Senior apartments, assisted living & care</h3><div class="hs-row"><label>Area <select id="sl-area">${opts}</select></label></div><div class="hs-btns"><a id="sl-acom" class="btn" href="https://www.apartments.com/${z0}/senior-housing/" target="_blank" rel="noopener">55+ apartments ↗</a><a class="btn alt" href="https://tulip.hhs.texas.gov/TULIP/s/ltc-provider-search" target="_blank" rel="noopener">Assisted living & nursing homes (Texas HHS) ↗</a><a class="btn alt" href="https://www.medicare.gov/care-compare/" target="_blank" rel="noopener">Nursing home star ratings (Medicare) ↗</a></div><p class="hs-note">The Texas HHS search covers every licensed assisted living, memory care and nursing home, with inspection results and whether it takes Medicaid. Visit in person before you choose.</p></div>
<div class="sl-box"><h3>Can't afford it? Help paying for senior care</h3><p class="sl-p">Texas Medicaid (STAR+PLUS) can pay for assisted living or in-home care for seniors who qualify, and HUD-subsidized senior apartments keep rent to about 30% of income. The free Aging & Disability Resource Center will walk you or your parent through it.</p><ul class="sl-help">${HELP_LINES.map(h => `<li><b>${h[3] ? `<a href="${h[3]}" target="_blank" rel="noopener">${esc(h[1])}</a>` : esc(h[1])}</b><span>${esc(h[0])} · <a href="tel:${tel(h[2])}">${esc(h[2])}</a></span></li>`).join("")}</ul></div></div>
<h3 class="dsub">Reduced-rate senior apartments</h3><div class="hs-row sl-filter"><label>County <select id="sl-county"><option value="">All counties</option>${counties.map(c => `<option>${esc(c)}</option>`).join("")}</select></label></div>
<div class="sl-grid">${SENIOR_AFF.map(card).join("")}</div>
<p class="hs-note">From HUD's subsidized and tax-credit housing databases (January 2026). "Rent based on income" means HUD-assisted units where rent is usually about 30% of income; "reduced rent" means tax-credit communities with lower rents for renters under the income limit. Most have waiting lists, so call ahead and get on several. Know a place we missed? Email us.</p></div>`;
}
const TCATS = [["all", "Everything"], ["kids", "With kids"], ["date", "Date night"], ["night", "Nightlife"], ["free", "Free"]];
const TCITIES = ["Temple", "Belton", "Salado", "Waco"];
const fmtD = d => { const x = new Date(d + "T12:00:00"); return x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const catTag = { kids: "👨‍👩‍👧 Kids", date: "❤️ Date night", night: "🌙 Nightlife", free: "Free" };
function thingsHub() {
  const evs = EV.events.slice().sort((a, b) => a.s.localeCompare(b.s) || a.e.localeCompare(b.e));
  const ev = x => `<div class="ev" data-city="${esc(x.city)}" data-cats="${x.cats.join(" ")}" data-end="${x.e}" data-start="${x.s}"><div class="ev-date"><b>${fmtD(x.s)}</b>${x.e !== x.s ? `<span>through ${fmtD(x.e)}</span>` : ""}</div><div class="ev-body"><span class="ev-city">${esc(x.city)}</span><h3>${x.url ? `<a href="${x.url}" target="_blank" rel="noopener">${esc(x.t)}</a>` : esc(x.t)}</h3><p>${esc(x.d)}</p><p class="ev-meta">🕒 ${esc(x.time)} · 📍 ${esc(x.where)}</p><div class="ev-tags">${x.cats.map(c => `<span class="tag-${c}">${catTag[c]}</span>`).join("")}</div></div></div>`;
  const spot = x => `<div class="spot" data-city="${esc(x.city)}" data-cats="${x.cats.join(" ")}"><b>${esc(x.n)}</b><p>${esc(x.d)}</p><div class="ev-tags">${x.cats.map(c => `<span class="tag-${c}">${catTag[c]}</span>`).join("")}</div><a class="spot-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.n + ", " + x.city + ", TX")}" target="_blank" rel="noopener">Map ↗</a></div>`;
  return `<div class="tdo" id="things-hub"><div class="tdo-head"><h2>The 254 weekend guide</h2><p>Temple, Belton, Salado and Waco. Updated every morning.</p></div>
<div class="tdo-filters"><div class="tdo-chips" id="tdo-cat">${TCATS.map((c, i) => `<button type="button" data-v="${c[0]}"${i ? "" : ' class="on"'}>${c[1]}</button>`).join("")}</div><div class="tdo-chips" id="tdo-city"><button type="button" data-v="all" class="on">All cities</button>${TCITIES.map(c => `<button type="button" data-v="${c}">${c}</button>`).join("")}</div></div>
<h3 class="dsub">Coming up</h3><div class="ev-list" id="ev-list">${evs.map(ev).join("")}</div><p class="tdo-empty" id="ev-empty" hidden>Nothing matches yet. Try another filter, or check back tomorrow.</p>
<h3 class="dsub">Go-to spots any weekend</h3><div class="spot-grid" id="spot-grid">${EV.spots.map(spot).join("")}</div>
<p class="hs-note">Times and prices change, so check with organizers before you go. Hosting an event in the 254? <a href="/contact/?topic=tip">Send it to us</a> and we'll add it.</p></div>`;
}
function marketDash() {
  const stat = s => `<div class="stat"><span class="lbl">${esc(s[0])}</span><b>${fmtN(s[1], s[2])}</b>${chg(s[3], s[4])}</div>`;
  const area = a => `<div class="area"><h3>${esc(a.name)}</h3><p class="sub">${esc(a.sub)} · ${esc(a.month)}</p><div class="astats">${a.stats.map(stat).join("")}</div><p class="src">Source: ${srcA(a.src)}</p></div>`;
  const T = MK.takeaways;
  return `<div class="dash" id="housing-dashboard"><div class="dash-head"><h2>254 Housing <span>Dashboard</span></h2><span class="upd">Updated ${esc(new Date(MK.updated + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))}</span></div>
<h3 class="dsub">Today's mortgage rates</h3>${rateCards()}
<div class="calc" id="pay-calc" data-areas="${esc(JSON.stringify(MK.taxAreas))}" data-loans="${esc(JSON.stringify(MK.loans))}"><h3>What would my payment be?</h3><div class="calc-row"><label>Home price <input type="number" id="pc-price" value="${MK.calc.price}" step="5000" min="0"></label><label>Down payment % <input type="number" id="pc-down" value="${MK.calc.downPct}" step="0.5" min="0" max="100"></label><label>Rate % <input type="number" id="pc-rate" value="${MK.rates.weekly.v}" step="0.01" min="0"></label><label>Term <select id="pc-term"><option value="30">30 years</option><option value="15">15 years</option></select></label><label>Loan type <select id="pc-loan"><option value="conv">Conventional</option><option value="fha">FHA</option><option value="va">VA</option></select></label><label class="wide">City / school district <select id="pc-area">${MK.taxAreas.map((a, i) => `<option value="${i}">${esc(a.name)}</option>`).join("")}</select></label><label>Home insurance ($/yr) <input type="number" id="pc-ins" value="2000" step="100" min="0"></label><label class="chk"><input type="checkbox" id="pc-first"> First year (no homestead exemption yet)</label></div><div class="calc-break"><span>Principal & interest <b id="pc-out">—</b></span><span>+ Mortgage insurance <b id="pc-mi">$0</b></span><span>+ Property taxes <b id="pc-tax">—</b></span><span>+ Insurance <b id="pc-insm">$0</b></span><span class="tot">= Estimated monthly <b id="pc-total">—</b></span></div><p class="calc-out"><small id="pc-note"></small><small>Tax rates are each taxing unit's adopted 2026 rate from the <a href="${MK.taxSrc[0][1]}" target="_blank" rel="noopener">${esc(MK.taxSrc[0][0])}</a> and <a href="${MK.taxSrc[1][1]}" target="_blank" rel="noopener">${esc(MK.taxSrc[1][0])}</a>, plus city and district announcements; Robinson ISD, Copperas Cove ISD, Copperas Cove and Coryell County use their latest available rate. Your homestead exemption ($140,000 off school taxes, 20% off city taxes in Temple and Salado and county and college taxes in McLennan) starts the January after you file, so your first-year escrow uses the full rate. FHA adds a 1.75% upfront fee to the loan plus 0.55% a year; VA adds a funding fee (2.15% with under 5% down, first use) and has no monthly insurance; conventional loans under 20% down add an estimated PMI. HOA dues, MUD/PID taxes and escrow shortage cushions are extra. Estimate only; your lender's Loan Estimate is the real number.</small></p></div>
<div class="hsearch" id="home-search"><h3>Search homes in the 254</h3><div class="hs-row"><label>Area <select id="hs-area">${HS_AREAS.map((a, i) => `<option value="${i}">${esc(a[0])}</option>`).join("")}</select></label><div class="hs-mode" role="group" aria-label="Buy or rent"><button type="button" class="on" data-mode="buy">For sale</button><button type="button" data-mode="rent">For rent</button></div></div><div class="hs-btns"><a id="hs-realtor" class="btn" href="${hsUrl("realtor", 0, "buy")}" target="_blank" rel="noopener">Search on Realtor.com ↗</a><a id="hs-zillow" class="btn alt" href="${hsUrl("zillow", 0, "buy")}" target="_blank" rel="noopener">Search on Zillow ↗</a></div><p class="hs-note">Opens listings on Realtor.com or Zillow in a new tab. ${NAME} is not affiliated with either site.</p><script>window.HS_AREAS=${JSON.stringify(HS_AREAS)};</script></div>
${housingFinder()}
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
const ORG = { "@type": "NewsMediaOrganization", "@id": SITE + "/#org", name: NAME, url: SITE + "/", logo: { "@type": "ImageObject", url: SITE + "/assets/logo.webp", width: 150, height: 150 }, sameAs: [SOC.tiktok, SOC.instagram], areaServed: ["Waco, TX", "Temple, TX", "Killeen, TX", "Belton, TX", "Bell County, TX", "McLennan County, TX", "Coryell County, TX"], foundingLocation: "Temple, TX", publishingPrinciples: SITE + "/about/", correctionsPolicy: SITE + "/about/", email: "jake.ruse@254txinsider.com" };
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
<header class="site-header"><div class="wrap"><a class="brand" href="/" aria-label="${NAME} home"><img src="/assets/logo.webp" alt="${NAME} logo" width="64" height="64"><span class="brand-text"><strong>${NAME}</strong><span>${TAG}</span></span></a><span class="hdr-right"><a class="hdr-lead" href="/home-pros/">Find a Home Pro</a><a class="hdr-lead" href="/build/">Commercial Projects</a><a class="btn" href="/#newsletter">Subscribe Free</a></span></div></header>
<nav class="secnav" aria-label="Sections"><div class="wrap">${nav}<a class="nav-lead${active === "home-pros" ? ' active" aria-current="page' : ""}" href="/home-pros/">Find a Home Pro</a><a class="nav-lead${active === "build" ? ' active" aria-current="page' : ""}" href="/build/">Commercial Projects</a></div></nav>
`;
}
function social() { return `<a href="${SOC.tiktok}" target="_blank" rel="noopener">TikTok</a><a href="${SOC.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${SOC.facebook}" target="_blank" rel="noopener">Facebook</a>`; }
function footer() {
  const secs = SECTIONS.map(s => `<a href="${secUrl(s[0])}">${s[2]}</a>`).join("");
  return `<footer class="site-footer"><div class="wrap"><div class="cols">
<div><h4>${NAME}</h4><p>Central Texas is growing. Stay ahead of what's next. Business, growth, government, schools and Friday nights across Waco, Temple, Killeen and Belton.</p><a class="btn" href="/#newsletter" style="display:inline-block;margin-top:8px;color:#fff">Join free</a></div>
<div><h4>Sections</h4>${secs}</div>
<div><h4>Company</h4><a href="/about/">About Us</a><a href="/scoreboard/">254 Scoreboard</a><a href="/home-pros/">254 Home Pros</a><a href="/build/">Commercial Build &amp; Facilities</a><a href="/contact/?topic=advertise">Advertise With Us</a><a href="/contact/">Contact Us / News Tips</a><a href="/contact/?topic=podcast">Be on the Podcast</a><a href="/privacy/">Privacy Policy</a><a href="/rss.xml">RSS Feed</a><a href="/sitemap.xml">Sitemap</a></div>
<div><h4>Follow</h4>${social()}</div>
</div><div class="legal"><span>© ${new Date().getFullYear()} ${NAME}. All rights reserved.</span><span class="site-views" data-site-views hidden></span><span>Our stories credit and link to the original reporting.</span></div></div></footer>
</body>
</html>
`;
}
const figCap = s => { const a = s.artInfo; if (!a) return "";
  if (a.kind === "illustration") return `<figcaption class="fig-cap"><span class="fig-tag">Illustration</span> ${esc(NAME)}</figcaption>`;
  if (a.kind === "photo") return `<figcaption class="fig-cap">Photo: ${a.page ? `<a href="${a.page}" target="_blank" rel="noopener">${esc(a.by || "file photo")}</a>` : esc(a.by || "file photo")}${a.lic ? ` / ${a.licUrl ? `<a href="${a.licUrl}" target="_blank" rel="noopener">${esc(a.lic)}</a>` : esc(a.lic)}` : ""}${a.via ? ` via ${esc(a.via)}` : ""}. File photo.</figcaption>`;
  return ""; };
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
<section class="block"><div class="wrap"><div class="home-pros-row">${HOME_PROMO}${BUILD_PROMO}</div></div></section>
<section class="block"><div class="wrap"><div class="section-head"><h2>Latest <span>News</span></h2><a href="/latest/">All latest →</a></div><div class="rows two">${ALL.slice(0, 8).map(s => row(s, false, "side")).join("")}</div></div></section>
${SIGNUP()}<section class="block"><div class="wrap"><div class="modules">${mods}</div></div></section>
${WATCH}</main>
` + footer();
}
// ---------- 254 Build & Facilities (commercial lead hub) ----------
const TRADES = [["HVAC & Mechanical", "❄️"], ["Plumbing", "🚰"], ["Electrical", "⚡"], ["Roofing", "🏠"], ["General Contractor", "🏗️"], ["Controls & Building Automation", "🎛️"], ["Fire Protection & Life Safety", "🧯"], ["Concrete & Site Work", "🚧"], ["Paving & Parking Lots", "🅿️"], ["Generators & Backup Power", "🔋"], ["Low Voltage, Security & Access", "🔐"], ["Commercial Cleaning & Janitorial", "🧽"], ["Landscaping & Grounds", "🌳"], ["Architecture & Engineering", "📐"], ["Commercial Real Estate & Leasing", "🏢"], ["Equipment & Supply", "🧰"]];
const BIDS = [
  ["City of Temple", "Purchasing: current bids and how to register", "https://www.templetx.gov/departments/city_departments/purchasing/"],
  ["City of Killeen", "Purchasing (bids posted on OpenGov)", "https://killeentexas.gov/414/Purchasing"],
  ["City of Waco", "Open bid opportunities", "https://www.waco-texas.com/Departments/Purchasing/Open-Bid-Opportunities"],
  ["City of Belton", "Bid postings", "https://www.beltontexas.gov/government/city_clerk/bid_postings/"],
  ["Killeen ISD", "Doing business with KISD (bids on IonWave)", "https://tx02205734.schoolwires.net/Page/17312"],
  ["State of Texas", "Electronic State Business Daily (state agency, TxDOT and university bids)", "https://www.txsmartbuy.com/esbd"],
  ["TDLR (TABS)", "Search commercial projects registered with the state by city, owner or designer", "https://tdlr.texas.gov/TABS/Search"]
];
function buildHub() {
  const needs = TRADES.map(t => t[0]);
  const projects = ALL.filter(s => s.cat === "growth" || (s.also || []).includes("real-estate") || (s.cat === "business" && /build|construct|develop|plant|facility|expan|warehouse|data center|groundbreak/i.test(s.title))).slice(0, 8);
  return `<div class="page-hero bld-hero"><div class="wrap"><span class="kicker">Commercial</span><h1>254 Build <span>&amp; Facilities</span></h1><p>The Central Texas hub for commercial buildings: who's building what, open public bids, and local commercial pros for HVAC, plumbing, electrical, roofing, construction and everything in between.</p><div class="btn-row"><a class="btn" href="#request">Request help with a project</a><a class="btn ghost" href="#vendors">I'm a vendor</a></div></div></div>
<section class="block"><div class="wrap">
<div class="bld-grid"><div class="bld-main">
<form class="pros-form bld-form" id="request" name="project-request" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="project-request"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h2>Get help with a commercial project</h2><p class="bld-sub">Facility managers, owners, developers and property managers: tell us what you need and we'll connect you with vetted local commercial pros. Free, no obligation.</p>
<div class="pf-row"><label>Your name <input name="name" required></label><label>Company / building <input name="company" required></label><label>Your role <select name="role"><option>Facility manager</option><option>Owner</option><option>Developer</option><option>Property manager</option><option>General contractor</option><option>Other</option></select></label>
<label>Building type <select name="building_type"><option>Office</option><option>Retail / restaurant</option><option>Industrial / warehouse</option><option>Healthcare</option><option>School / church</option><option>Multifamily</option><option>Hotel</option><option>Government</option><option>Data center</option><option>Other</option></select></label><label>City <select name="city"><option>Temple</option><option>Belton</option><option>Killeen</option><option>Harker Heights</option><option>Copperas Cove</option><option>Waco</option><option>Hewitt / Woodway</option><option>Salado</option><option>Gatesville</option><option>Lampasas</option><option>Other 254</option></select></label><label>Timeline <select name="timeline"><option>Emergency / ASAP</option><option>Within 30 days</option><option>1-3 months</option><option>3-12 months</option><option>Planning / budgeting</option></select></label></div>
<fieldset class="bld-needs"><legend>What do you need? (pick all that apply)</legend>${needs.map(n => `<label><input type="checkbox" name="needs[]" value="${esc(n)}"> ${esc(n)}</label>`).join("")}</fieldset>
<div class="pf-row"><label>Approx. size <input name="size" placeholder="sq ft or # of units (optional)"></label><label>Phone <input name="phone" type="tel"></label><label>Email <input name="email" type="email" required></label></div>
<label class="pf-msg">Project details <textarea name="details" rows="4" placeholder="Replace two rooftop units, new restaurant buildout, roof leak, preventive maintenance contract..."></textarea></label>
<label class="bld-consent"><input type="checkbox" name="consent" value="yes" required> OK to share my request with up to 3 vetted local partners in the trades I picked so they can contact me.</label>
<button class="btn" type="submit">Send my request</button><p class="hs-note">For a true emergency (gas smell, flooding, no power), call 911 or your utility first. ${NAME} is not a contractor and does not perform work; partners are independent businesses.</p></form>

<div class="pros" id="vendors"><div class="pros-head"><h2>Featured Commercial Pros</h2><span>Founding spots open</span></div>
<p class="pros-sub">One featured spot per trade. Featured partners get first look at project requests in their trade from 254 facility managers, owners and developers, plus placement here and in our business coverage.</p>
<div class="pros-grid">${TRADES.map(t => `<div class="pro-slot"><span class="pro-ico">${t[1]}</span><b>${esc(t[0])}</b><span>Your company here</span><a class="btn" href="#vendor-form" data-trade="${esc(t[0])}">Claim this spot</a></div>`).join("")}</div>
<form class="pros-form" id="vendor-form" name="vendor" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/"><input type="hidden" name="form-name" value="vendor"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>
<h3>Vendors, contractors and suppliers: get in front of 254 buyers</h3><div class="pf-row"><label>Your name <input name="name" required></label><label>Company <input name="company" required></label><label>Trade <select name="trade" id="vf-trade">${needs.concat(["Other"]).map(c => `<option>${esc(c)}</option>`).join("")}</select></label><label>Interested in <select name="interest"><option>Featured trade spot (project requests)</option><option>Sponsoring 254 Build &amp; Facilities</option><option>Advertising in business news</option><option>Just get me on the vendor list</option></select></label><label>Phone <input name="phone" type="tel"></label><label>Email <input name="email" type="email" required></label></div>
<div class="pf-row"><label>Website <input name="website" placeholder="optional"></label><label>Cities you serve <input name="cities" placeholder="Temple, Killeen, Waco..."></label><label>Licensed / insured? <select name="licensed"><option>Yes</option><option>In progress</option><option>Not required for my trade</option></select></label></div>
<label class="pf-msg">Anything else? <textarea name="message" rows="3" placeholder="Specialties, brands you carry, project size you like..."></textarea></label><button class="btn" type="submit">Send, we'll call you</button><p class="hs-note">Featured listings are marked "Sponsored." ${NAME} does not endorse any business.</p></form></div>
</div>
<aside class="bld-side">
<div class="bld-box"><h3>254 Bid Board</h3><p>Where local governments post commercial work. Check these weekly.</p><ul>${BIDS.map(b => `<li><a href="${b[2]}" target="_blank" rel="noopener"><b>${esc(b[0])}</b> ${esc(b[1])} ↗</a></li>`).join("")}</ul></div>
<div class="bld-box"><h3>Facility manager toolkit</h3><ul>
<li><b>Utility rebates.</b> If your building is on Oncor's lines, high-efficiency HVAC can qualify for <a href="https://www.oncor.com/takealoadofftexas/pages/commercial-midstream" target="_blank" rel="noopener">instant discounts through participating distributors</a>, and rural sites have a <a href="https://www.oncor.com/content/oncorwww/talot/en/home/business/rural.html" target="_blank" rel="noopener">separate program</a>. Ask your contractor to price it in.</li>
<li><b>Refrigerant changes.</b> New HVAC equipment has moved to lower-GWP refrigerants (like R-454B and R-32), and EPA updated its rules again in 2026. Existing systems can keep running. Before you replace or repair, ask your contractor which refrigerant and dates apply. <a href="https://www.epa.gov/climate-hfcs-reduction/regulatory-actions-technology-transitions" target="_blank" rel="noopener">EPA rule updates</a></li>
<li><b>Accessibility (TDLR).</b> Commercial projects of $50,000 or more generally must be registered with the state for accessibility review. <a href="https://www.tdlr.texas.gov/ab/" target="_blank" rel="noopener">TDLR program</a></li>
<li><b>Planning a replacement?</b> Get at least two quotes, ask for equipment lead times in writing, and budget for the crane, curb adapters and controls, not just the unit.</li></ul></div>
</aside></div>
${projects.length ? `<h2 class="list-head">What's being <span>built</span></h2><div class="rows two">${projects.map(s => row(s, false, "side")).join("")}</div><p class="src"><a href="/growth/">All growth news →</a></p>` : ""}
${faqHtml("Common <span>questions</span>", BUILD_FAQ)}
</div></section>`;
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
      mainEntity: { "@type": "ItemList", itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(s.url), name: s.title })) } }].concat(k === "real-estate" ? [faqLd(TAX_FAQ)] : [])
  }) + header(k) + (k === "markets" ? TICKER : "") + `<main><div class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}<h1>${esc(sec.name)}</h1><p>${esc(sec.desc)}</p></div></div>
<section class="block"><div class="wrap narrow">${k === "markets" ? `<h2 class="list-head">Mortgage <span>rates</span></h2>${rateCards()}<p class="src"><a href="/real-estate/#housing-dashboard">Full 254 Housing Dashboard →</a></p>` + MARKET_WIDGET : ""}${k === "real-estate" ? marketDash() + faqHtml("Property tax <span>questions</span>", TAX_FAQ) : ""}${k === "things-to-do" ? thingsHub() : ""}${k === "sports" ? scoreboard(true) + SPORTS_SPONSOR("Central Texas", "Sports &amp; Community presented by: your business here") : ""}${k === "business" || k === "growth" ? BUILD_PROMO : ""}${k === "real-estate" || k === "things-to-do" ? HOME_PROMO : ""}${body}${k === "sports" ? SPORTS_SPONSOR_FORM : ""}</div></section>
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
${s.art ? `<figure class="hero-fig">${art(s, "hero-img", true)}${figCap(s)}</figure>` : ""}
<div class="body">${s.body.map(p => p.indexOf("<ul") === 0 ? p : "<p>" + p + "</p>").join("")}</div>
${src ? `<aside class="sources"><b>Sources</b><ul>${src}</ul><small>${NAME} summarizes reporting and public records. Read the original sources for full details.</small></aside>` : ""}
<div class="share">Share: <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs(s.url))}" target="_blank" rel="noopener">Facebook</a> · <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(abs(s.url))}&text=${encodeURIComponent(s.title)}" target="_blank" rel="noopener">X</a> · <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(abs(s.url))}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:?subject=${encodeURIComponent(s.title)}&body=${encodeURIComponent(abs(s.url))}">Email</a></div>
<div class="module related"><h2>Keep reading</h2>${more.map(x => row(x, true, "side")).join("")}</div>
</article>
${SIGNUP("h2")}</main>
` + footer();
});
// static pages
const simple = (file, url, title, desc, inner, noindex, active, ld) => pages[file] = head({ title, desc, url, noindex, ld }) + header(active || null) + "<main>" + inner + "</main>\n" + footer();
simple("about/index.html", "/about/", `About ${NAME} | Central Texas News for Waco, Temple, Killeen and Belton`, `${NAME} is an independent Central Texas news site covering business, growth, government, schools and community news across Bell, McLennan and Coryell counties.`,
  `<div class="page-hero"><div class="wrap"><span class="kicker">About</span><h1>The Pulse of <span>the 254</span></h1><p>Central Texas is growing fast. ${NAME} keeps you ahead of it.</p></div></div>
<section class="block"><div class="wrap prose">
<h2>Who we are</h2><p>${NAME} is an independent, locally owned news site for the 254 area code: Bell, McLennan, Coryell and Lampasas counties. It was founded in Temple by a local business professional who works with facility and business leaders across Central Texas every day. It started as daily videos on TikTok, Instagram and Facebook and has grown into a daily news site and podcast.</p>
<h2>What we cover</h2><ul><li><b>Business and growth:</b> openings, closings, expansions, land deals, data centers, roads and the projects reshaping the region.</li><li><b>Real estate:</b> the 254 Housing Dashboard, mortgage rates, local home prices and property tax guides.</li><li><b>Government and schools:</b> city councils, commissioners courts and school boards in plain English, plus our weekly We the People civic explainers.</li><li><b>Sports and things to do:</b> Baylor, UMHB, Temple College, high school playoffs and a weekend guide for Temple, Belton, Salado and Waco.</li></ul>
<p>Our coverage area includes Temple, Belton, Killeen, Harker Heights, Nolanville, Copperas Cove, Salado, Waco, Woodway, Hewitt, Robinson, McGregor, Lorena, Gatesville, Lampasas and Fort Cavazos.</p>
<h2>How we report</h2><ul><li>We read city and county agendas, public filings, school district announcements, state records and local reporting, then explain what it means for you.</li><li>Every story links to the original reporting and public records it draws on, listed under "Sources."</li><li>We write in our own words and don't copy other outlets' stories.</li><li>Government and election coverage is neutral and factual. We don't endorse candidates or ballot measures.</li><li>We mark unconfirmed reports as unconfirmed.</li></ul>
<h2>Corrections</h2><p>If we get something wrong, we fix it and note the change. Spot an error? <a href="/contact/">Tell us</a>.</p>
<h2>Sponsors and advertising</h2><p>Sponsored listings on 254 Home Pros, 254 Build &amp; Facilities and the Real Estate section are clearly marked "Sponsored." Sponsors don't influence our news coverage or story selection, and a listing isn't an endorsement.</p>
<h2>Get in touch</h2><p>News tips, podcast guests and advertising: <a href="/contact/">contact us</a> or email <a href="mailto:jake.ruse@254txinsider.com">jake.ruse@254txinsider.com</a>.</p></div></section>`, false, null, [crumbsLd([["Home", "/"], ["About", "/about/"]]), { "@context": "https://schema.org", "@type": "AboutPage", url: SITE + "/about/", name: "About " + NAME, about: { "@id": SITE + "/#org" } }]);
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
simple("scoreboard/index.html", "/scoreboard/", `254 Scoreboard: Central Texas High School and College Scores and Playoff Tracker | ${NAME}`, "Scores, schedules and playoff tracker for Temple, Belton, Killeen, Waco and Central Texas high school and college sports: football, basketball, volleyball, soccer, baseball, softball, track, cross country and UIL band.", `<div class="page-hero"><div class="wrap"><span class="kicker">Sports</span><h1>254 <span>Scoreboard</span></h1><p>Boys and girls, high school and college. Scores, schedules and the playoff tracker for every season in Central Texas.</p></div></div><section class="block"><div class="wrap">${scoreboard(false)}</div></section>`, false, "sports", [crumbsLd([["Home", "/"], ["Sports", "/sports/"], ["254 Scoreboard", "/scoreboard/"]])]);
for (const sc of SCHOOLS) { const pg = schoolPage(sc); simple("scoreboard/" + sc.slug + "/index.html", sc.url, `${sc.name} Sports: Scores, Schedule and Playoffs | ${NAME}`, `${sc.name} (${sc.city}, Texas) sports scores, schedules and playoff status for boys and girls teams, updated daily by ${NAME}.`, pg.html, pg.noindex, "sports", [crumbsLd(pg.crumbs)]); }
simple("home-pros/index.html", "/home-pros/", `254 Home Pros: Trusted Local AC, Plumbing, Roofing and Foundation Pros | ${NAME}`, "Find a trusted local pro in Temple, Belton, Killeen, Waco and across Central Texas for AC, plumbing, roofing, foundation repair and more. One pro per trade, no bidding war.", homeHub(), false, "home-pros", [crumbsLd([["Home", "/"], ["254 Home Pros", "/home-pros/"]]), faqLd(HOME_FAQ), serviceLd("254 Home Pros", "Free homeowner requests matched to one local pro per trade: AC and heating, plumbing, electrical, roofing, foundation repair and more.", "/home-pros/", HOME_TRADES.map(t => t[0]))]);
simple("build/index.html", "/build/", `254 Build & Facilities: Commercial Contractors, Bids and Projects in Central Texas | ${NAME}`, "Find commercial HVAC, plumbing, electrical, roofing and construction pros in Temple, Killeen, Waco and Belton, plus open public bids and new projects in the 254.", buildHub(), false, "build", [crumbsLd([["Home", "/"], ["254 Build & Facilities", "/build/"]]), faqLd(BUILD_FAQ), serviceLd("254 Build & Facilities", "Commercial project requests matched to vetted local contractors and suppliers, plus a public bid board for Central Texas.", "/build/", TRADES.map(t => t[0]))]);
simple("thanks/index.html", "/thanks/", `Thanks! | ${NAME}`, `Thanks for reaching out to ${NAME}.`,
  `<div class="page-hero"><div class="wrap"><h1>Thank <span>You</span></h1><p>Got it. We'll be in touch. In the meantime, catch the latest on the homepage.</p><div class="btn-row"><a class="btn" href="/">Back to home</a></div></div></div>`, true);
simple("404.html", "/404.html", `Page not found | ${NAME}`, "Page not found.",
  `<div class="page-hero"><div class="wrap"><h1>Page Not <span>Found</span></h1><p>That page took a wrong exit off I-35.</p><div class="btn-row"><a class="btn" href="/">Back to home</a></div></div></div>`, true);

// ---------- feeds, sitemaps, robots, redirects ----------
const latest = ALL[0].date;
const urls = [["/", latest, "daily", "1.0"]].concat(SECTIONS.filter(([k]) => k === "latest" || inCat(k).length).map(([k]) => [secUrl(k), (k === "latest" ? ALL : inCat(k))[0].date, "daily", "0.8"]),
  ALL.map(s => [s.url, s.date, "weekly", "0.9", s]), [["/scoreboard/", latest, "daily", "0.8"], ...SCHOOLS.filter(sc => !schoolPage(sc).noindex).map(sc => [sc.url, latest, "daily", "0.6"]), ["/home-pros/", latest, "weekly", "0.7"], ["/build/", latest, "weekly", "0.7"], ["/about/", latest, "monthly", "0.4"], ["/contact/", latest, "monthly", "0.4"]]);
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
pages["llms.txt"] = `# ${NAME}

> Independent local news for Central Texas (the 254 area code): Bell, McLennan, Coryell and Lampasas counties, including Temple, Belton, Killeen, Harker Heights, Copperas Cove, Salado, Waco and Fort Cavazos. Updated daily. Every story links to its sources.

## Key pages
- [Latest news](${SITE}/latest/): newest stories across all sections
- [Business](${SITE}/business/) and [Growth](${SITE}/growth/): openings, expansions, development and infrastructure in Central Texas
- [Real Estate](${SITE}/real-estate/): 254 Housing Dashboard (mortgage rates, Killeen-Temple and Waco home prices), payment calculator, property tax and homestead guide
- [Government](${SITE}/government/) and [We the People](${SITE}/we-the-people/): city, county and school board news and plain-English civic explainers
- [Sports](${SITE}/sports/): Baylor, UMHB, Temple College, Tarleton and high school sports
- [254 Scoreboard](${SITE}/scoreboard/): Central Texas high school and college scores, schedules and playoff tracker for boys and girls sports
- [Things to Do](${SITE}/things-to-do/): weekend events and go-to spots in Temple, Belton, Salado and Waco
- [254 Home Pros](${SITE}/home-pros/): request a local home service pro (AC, plumbing, roofing, foundation and more)
- [254 Build & Facilities](${SITE}/build/): commercial project requests, public bid board and facility manager resources
- [About](${SITE}/about/): who we are and how we report

## Recent stories
${ALL.slice(0, 25).map(s => `- [${s.title}](${abs(s.url)}): ${s.dek}`).join("\n")}
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
for (const id of Object.keys(AMAN)) { const f = path.join(ACACHE, id + ".webp"); if (fs.existsSync(f) && !hasArt(id)) fs.copyFileSync(f, path.join(OUT, "assets/art", id + ".webp")); }
console.log("Built", Object.keys(pages).length, "files,", ALL.length, "stories");
