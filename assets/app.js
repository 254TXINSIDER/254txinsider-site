(function () {
  var SECTIONS = [
    ["latest", "Latest", "Latest News", "Everything new across the 254."],
    ["business", "Business", "Business & Economic Development", "Companies, jobs and deals shaping Central Texas."],
    ["markets", "Markets", "Markets & Rates", "Stocks, interest rates and the numbers that move your wallet."],
    ["growth", "Growth", "Growth & Development", "Roads, construction and the projects changing the map."],
    ["real-estate", "Real Estate", "Real Estate & Housing", "What homes cost and where the building is happening."],
    ["education", "Education", "Education & Workforce", "Schools, colleges and the talent pipeline."],
    ["government", "Government", "Government & Politics", "City halls, commissioners courts and the ballot."],
    ["we-the-people", "We the People", "We the People", "Plain-English explainers on how local government works in the 254."],
    ["sports", "Sports & Community", "Sports & Community", "Friday nights, neighbors and good causes."],
    ["things-to-do", "Things to Do", "Things to Do", "Where to go and what to see this week."],
    ["podcast", "Podcast", "254 Texas Insider Podcast", "Conversations with the people building Central Texas."]
  ];
  var SOC = {
    tiktok: "https://www.tiktok.com/@254.texas.insider",
    instagram: "https://www.instagram.com/254texasinsider",
    facebook: "https://www.facebook.com/search/top?q=254%20Texas%20Insider"
  };
  var SEC = {};
  SECTIONS.forEach(function (s) { SEC[s[0]] = { key: s[0], short: s[1], name: s[2], desc: s[3] }; });

  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fmt(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  function q(name) { return new URLSearchParams(location.search).get(name); }
  var ALL = (window.STORIES || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  function inCat(k) { return ALL.filter(function (s) { return s.cat === k; }); }
  function link(s) { return "story.html?id=" + encodeURIComponent(s.id); }
  function secLink(k) { return "section.html?s=" + k; }
  function catLabel(k) { return SEC[k] ? SEC[k].short : k; }
  function social(cls) {
    return '<a href="' + SOC.tiktok + '" target="_blank" rel="noopener">TikTok</a><a href="' + SOC.instagram + '" target="_blank" rel="noopener">Instagram</a><a href="' + SOC.facebook + '" target="_blank" rel="noopener">Facebook</a>';
  }

  function row(s, noDek) {
    return '<a class="row" href="' + link(s) + '"><span class="cat">' + esc(catLabel(s.cat)) + '</span>' +
      '<h3>' + esc(s.title) + '</h3>' + (noDek ? '' : '<p>' + esc(s.dek) + '</p>') +
      '<time>' + fmt(s.date) + (s.city ? ' · ' + esc(s.city) : '') + '</time></a>';
  }

  function header(active) {
    var nav = SECTIONS.map(function (s) {
      return '<a href="' + secLink(s[0]) + '"' + (s[0] === active ? ' class="active"' : '') + '>' + s[1] + '</a>';
    }).join("");
    return '<div class="topbar"><div class="wrap"><span><span id="today">Central Texas</span><span class="tagline"> &nbsp;·&nbsp; Waco · Temple · Killeen · Belton</span></span>' +
      '<span class="socials">' + social() + '</span></div></div>' +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="254 Texas Insider home"><img src="assets/logo.webp" alt="254 Texas Insider logo" width="64" height="64">' +
      '<span class="brand-text"><strong>254 Texas Insider</strong><span>The Pulse of the 254</span></span></a>' +
      '<a class="btn" href="index.html#newsletter">Subscribe Free</a></div></header>' +
      '<nav class="secnav" aria-label="Sections"><div class="wrap">' + nav + '</div></nav>';
  }

  function footer() {
    var secs = SECTIONS.map(function (s) { return '<a href="' + secLink(s[0]) + '">' + s[2] + '</a>'; }).join("");
    return '<footer class="site-footer"><div class="wrap"><div class="cols">' +
      '<div><h4>254 Texas Insider</h4><p>Central Texas is growing. Stay ahead of what\'s next. Business, growth, government, schools and Friday nights across Waco, Temple, Killeen and Belton.</p><a class="btn" href="index.html#newsletter" style="display:inline-block;margin-top:8px;color:#fff">Join free</a></div>' +
      '<div><h4>Sections</h4>' + secs + '</div>' +
      '<div><h4>Company</h4><a href="about.html">About Us</a><a href="contact.html?topic=advertise">Advertise With Us</a><a href="contact.html">Contact Us / News Tips</a><a href="contact.html?topic=podcast">Be on the Podcast</a></div>' +
      '<div><h4>Follow</h4>' + social() + '</div>' +
      '</div><div class="legal"><span>© ' + new Date().getFullYear() + ' 254 Texas Insider. All rights reserved.</span><span>Our stories credit and link to the original reporting.</span></div></div></footer>';
  }

  function home() {
    var top = ALL.filter(function (s) { return s.top; }).slice(0, 5);
    var lead = top[0], rest = top.slice(1);
    var h = '<section class="home-hero"><div class="wrap"><h1>Central Texas Is Growing. <span>Stay Ahead of What\'s Next.</span></h1>' +
      '<p>Business, growth, government and Friday nights across the 254.</p>' +
      '<div class="top-grid"><a class="lead" href="' + link(lead) + '"><span class="cat">' + esc(catLabel(lead.cat)) + '</span><h2>' + esc(lead.title) + '</h2><p>' + esc(lead.dek) + '</p><time>' + fmt(lead.date) + ' · ' + esc(lead.city) + '</time></a>' +
      '<div class="rows">' + rest.map(function (s) { return row(s, true); }).join("") + '</div></div></div></section>';
    var latest = '<section class="block"><div class="wrap"><div class="section-head"><h2>Latest <span>News</span></h2><a href="' + secLink("latest") + '">All latest →</a></div><div class="rows two">' +
      ALL.slice(0, 8).map(function (s) { return row(s); }).join("") + '</div></div></section>';
    var mods = ["business", "markets", "growth", "government", "we-the-people", "sports", "things-to-do", "education", "real-estate"].map(function (k) {
      var list = inCat(k).slice(0, 3);
      if (!list.length) return "";
      return '<div class="module"><h2><a href="' + secLink(k) + '">' + esc(SEC[k].name) + '</a></h2>' + list.map(function (s) { return row(s, true); }).join("") +
        '<a class="more" href="' + secLink(k) + '">More ' + esc(SEC[k].short) + ' →</a></div>';
    }).join("");
    document.getElementById("home-top").innerHTML = h + latest;
    document.getElementById("home-modules").innerHTML = '<section class="block"><div class="wrap"><div class="modules">' + mods + '</div></div></section>';
  }

  function marketWidget(target) {
    if (!target) return;
    var w = document.createElement("div");
    w.className = "tradingview-widget-container market-widget";
    w.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    var sc = document.createElement("script");
    sc.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    sc.async = true;
    sc.text = JSON.stringify({ width: "100%", height: 460, colorTheme: "light", isTransparent: true, locale: "en",
      symbolsGroups: [
        { name: "Indices", symbols: [{ name: "FOREXCOM:SPXUSD", displayName: "S&P 500" }, { name: "FOREXCOM:NSXUSD", displayName: "Nasdaq 100" }, { name: "FOREXCOM:DJI", displayName: "Dow 30" }] },
        { name: "Rates & Commodities", symbols: [{ name: "TVC:US10Y", displayName: "10-Yr Treasury" }, { name: "TVC:US02Y", displayName: "2-Yr Treasury" }, { name: "TVC:USOIL", displayName: "WTI Crude" }, { name: "TVC:GOLD", displayName: "Gold" }] }
      ] });
    w.appendChild(sc);
    target.insertBefore(w, target.firstChild);
  }

  function section() {
    var k = q("s") || "latest";
    var sec = SEC[k] || SEC.latest;
    var list = sec.key === "latest" ? ALL : inCat(sec.key);
    document.title = sec.name + " | 254 Texas Insider";
    var body = list.length ? '<div class="rows">' + list.map(function (s) { return row(s); }).join("") + '</div>' :
      '<p class="empty">' + (sec.key === "podcast" ? 'New episodes are on the way. Want to be a guest? <a href="contact.html?topic=podcast">Pitch us</a>.' : 'Stories are on the way. Have a tip? <a href="contact.html">Send it in</a>.') + '</p>';
    document.getElementById("app").innerHTML = '<div class="page-hero"><div class="wrap"><span class="kicker">Section</span><h1>' + esc(sec.name) + '</h1><p>' + esc(sec.desc) + '</p></div></div>' +
      '<section class="block"><div class="wrap narrow">' + body + '</div></section>';
    if (sec.key === "markets") marketWidget(document.querySelector("#app .block .wrap"));
    return sec.key;
  }

  function story() {
    var id = q("id");
    var s = ALL.filter(function (x) { return x.id === id; })[0];
    var el = document.getElementById("app");
    if (!s) { el.innerHTML = '<div class="article"><h1>Story not found</h1><p><a href="index.html">Back to home</a></p></div>'; return null; }
    document.title = s.title + " | 254 Texas Insider";
    var m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute("content", s.dek);
    var src = (s.sources || []).map(function (x) { return '<li><a href="' + x[1] + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a></li>'; }).join("");
    var more = ALL.filter(function (x) { return x.cat === s.cat && x.id !== s.id; }).slice(0, 3);
    if (more.length < 3) more = more.concat(ALL.filter(function (x) { return x.cat !== s.cat && x.id !== s.id; }).slice(0, 3 - more.length));
    el.innerHTML = '<article class="article"><a class="cat" href="' + secLink(s.cat) + '">' + esc(SEC[s.cat] ? SEC[s.cat].name : s.cat) + '</a>' +
      '<h1>' + esc(s.title) + '</h1><p class="dek">' + esc(s.dek) + '</p>' +
      '<div class="art-meta">By 254 Texas Insider Staff · ' + fmt(s.date) + (s.city ? ' · ' + esc(s.city) : '') + '</div>' +
      '<div class="body">' + s.body.map(function (p) { return p.indexOf("<ul") === 0 ? p : '<p>' + p + '</p>'; }).join("") + '</div>' +
      (src ? '<div class="sources"><b>Sources</b><ul>' + src + '</ul><small>254 Texas Insider summarizes reporting and public records. Read the original sources for full details.</small></div>' : '') +
      '<div class="share"><a class="btn" href="index.html#newsletter">Get stories like this free</a></div>' +
      '<div class="module related"><h2>Keep reading</h2>' + more.map(function (x) { return row(x, true); }).join("") + '</div></article>';
    return s.cat;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    var active = null;
    if (page === "home") home();
    if (page === "section") active = section();
    if (page === "story") active = story();
    var hd = document.getElementById("site-header"); if (hd) hd.innerHTML = header(active);
    var ft = document.getElementById("site-footer"); if (ft) ft.innerHTML = footer();
    var d = document.getElementById("today");
    if (d) d.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
    var a = document.querySelector(".secnav a.active"); if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest", inline: "center" });
    var t = q("topic"); var sel = document.getElementById("topic"); if (t && sel) sel.value = t;
  });
})();
