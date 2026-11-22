// Small enhancements for the static pages
document.addEventListener("DOMContentLoaded", function () {
  var d = document.getElementById("today");
  if (d) d.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
  var a = document.querySelector(".secnav a.active");
  if (a) { var nav = a.parentNode; nav.scrollLeft = a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2; }
  var t = new URLSearchParams(location.search).get("topic"), sel = document.getElementById("topic");
  if (t && sel) sel.value = t;
});

// Public view counts (shown once numbers are meaningful)
(function () {
  var MIN_PAGE = 500, MIN_MONTH = 10000;
  var p = location.pathname, key = "v:" + p, hit = "1";
  try { if (sessionStorage.getItem(key)) hit = "0"; sessionStorage.setItem(key, "1"); } catch (e) {}
  fetch("/api/views?hit=" + hit + "&p=" + encodeURIComponent(p)).then(function (r) { return r.json(); }).then(function (d) {
    var f = function (n) { return Number(n).toLocaleString("en-US"); };
    var el = document.querySelector("[data-views]");
    if (el && d.page >= MIN_PAGE) { el.textContent = " · \uD83D\uDC41 " + f(d.page) + " views"; el.hidden = false; }
    var s = document.querySelector("[data-site-views]");
    if (s && d.month >= MIN_MONTH) { s.textContent = f(d.month) + " page views this month"; s.hidden = false; }
  }).catch(function () {});
})();


// Mortgage payment calculator (Real Estate page)
(function () {
  var box = document.getElementById("pay-calc"); if (!box) return;
  var g = function (id) { return document.getElementById(id); };
  var A = JSON.parse(box.getAttribute("data-areas")), L = JSON.parse(box.getAttribute("data-loans"));
  var f = function (v) { return "$" + Math.round(v).toLocaleString("en-US"); };
  var tier = function (t, d) { var v = t[0][1]; for (var i = 0; i < t.length; i++) if (d >= t[i][0]) v = t[i][1]; return v; };
  function calc() {
    var price = +g("pc-price").value || 0, down = +g("pc-down").value || 0, loan = g("pc-loan").value, note = [];
    if (loan === "fha" && down < 3.5) { down = 3.5; note.push("FHA needs at least 3.5% down, so we used 3.5%."); }
    if (loan === "conv" && down < 3) { down = 3; note.push("Conventional loans need at least 3% down, so we used 3%."); }
    var base = price * (1 - down / 100), P = base, mi = 0;
    if (loan === "fha") { P = base * (1 + L.fhaUpfront / 100); mi = base * (down >= 5 ? L.fhaAnnualLow : L.fhaAnnual) / 100 / 12; note.push("Loan includes the " + L.fhaUpfront + "% FHA upfront fee (" + f(P - base) + ")."); }
    else if (loan === "va") { var fee = tier(L.vaFee, down); P = base * (1 + fee / 100); note.push("Loan includes the " + fee + "% VA funding fee (" + f(P - base) + "); exempt if you have a VA disability rating."); }
    else if (down < 20) { mi = base * tier(L.pmi, down) / 100 / 12; note.push("PMI is an estimate and drops off once you reach 20% equity."); }
    var r = (+g("pc-rate").value || 0) / 1200, n = (+g("pc-term").value || 30) * 12;
    var m = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
    var a = A[+g("pc-area").value] || A[0], first = g("pc-first").checked, taxYr = 0, rate = 0;
    if (a.units) {
      a.units.forEach(function (u) {
        var v = price; rate += u[1];
        if (!first && u[2] === "school") v = Math.max(0, price - 140000);
        if (!first && u[2] === "pct20") v = Math.max(0, price - Math.max(price * 0.2, 5000));
        taxYr += v * u[1] / 100;
      });
      note.push("Tax rate: " + rate.toFixed(2) + "% across " + a.units.length + " taxing units" + (first ? ", no exemptions (first year)." : ", with the homestead exemption (" + (price ? (taxYr / price * 100).toFixed(2) : "0") + "% effective)."));
    } else { taxYr = price * a.avg / 100; note.push("Uses the county's average effective rate (" + a.avg + "%), which already reflects typical exemptions."); }
    var tax = taxYr / 12, ins = (+g("pc-ins").value || 0) / 12;
    g("pc-out").textContent = f(m); g("pc-mi").textContent = f(mi); g("pc-tax").textContent = f(tax); g("pc-insm").textContent = f(ins); g("pc-total").textContent = f(m + mi + tax + ins);
    g("pc-note").textContent = note.join(" ");
  }
  ["pc-price", "pc-down", "pc-rate", "pc-term", "pc-loan", "pc-area", "pc-ins", "pc-first"].forEach(function (id) { g(id).addEventListener("input", calc); g(id).addEventListener("change", calc); });
  calc();
})();

// Home search links (Real Estate page)
(function () {
  var sel = document.getElementById("hs-area"); if (!sel || !window.HS_AREAS) return;
  var mode = "buy", r = document.getElementById("hs-realtor"), z = document.getElementById("hs-zillow");
  function upd() {
    var a = window.HS_AREAS[+sel.value];
    r.href = mode === "rent" ? "https://www.realtor.com/apartments/" + a[1] : "https://www.realtor.com/realestateandhomes-search/" + a[1];
    z.href = mode === "rent" ? "https://www.zillow.com/" + a[2] + "/rentals/" : "https://www.zillow.com/" + a[2] + "/";
    r.textContent = (mode === "rent" ? "Rentals" : "Homes for sale") + " on Realtor.com ↗";
    z.textContent = (mode === "rent" ? "Rentals" : "Homes for sale") + " on Zillow ↗";
  }
  sel.addEventListener("change", upd);
  [].forEach.call(document.querySelectorAll(".hs-mode button"), function (btn) {
    btn.addEventListener("click", function () {
      mode = btn.getAttribute("data-mode");
      [].forEach.call(document.querySelectorAll(".hs-mode button"), function (x) { x.classList.toggle("on", x === btn); });
      upd();
    });
  });
  upd();
})();

// Apartment finder + senior living (Real Estate page)
(function () {
  var A = window.HS_AREAS; if (!A) return;
  var g = function (id) { return document.getElementById(id); };
  var apt = g("apt-area");
  if (apt) apt.addEventListener("change", function () { var a = A[+apt.value];
    g("apt-acom").href = "https://www.apartments.com/" + a[2] + "/"; g("apt-zillow").href = "https://www.zillow.com/" + a[2] + "/rentals/"; g("apt-realtor").href = "https://www.realtor.com/apartments/" + a[1]; });
  var sl = g("sl-area");
  if (sl) sl.addEventListener("change", function () { g("sl-acom").href = "https://www.apartments.com/" + A[+sl.value][2] + "/senior-housing/"; });
  var c = g("sl-county");
  if (c) c.addEventListener("change", function () { [].forEach.call(document.querySelectorAll(".sl-card"), function (el) { el.style.display = !c.value || el.getAttribute("data-county") === c.value ? "" : "none"; }); });
})();

// Sponsor spots, tax deadline countdown (Real Estate page)
(function () {
  var hvt = document.getElementById("hv-trade");
  [].forEach.call(document.querySelectorAll("[data-htrade]"), function (a) {
    a.addEventListener("click", function () { if (hvt) hvt.value = a.getAttribute("data-htrade"); });
  });
  var vft = document.getElementById("vf-trade");
  [].forEach.call(document.querySelectorAll("[data-trade]"), function (a) {
    a.addEventListener("click", function () { if (vft) vft.value = a.getAttribute("data-trade"); });
  });
  var cat = document.getElementById("pf-cat");
  [].forEach.call(document.querySelectorAll("[data-cat]"), function (a) {
    a.addEventListener("click", function () { if (cat) cat.value = a.getAttribute("data-cat"); });
  });
  function cd(id, mo, day) {
    var el = document.getElementById(id); if (!el) return;
    var now = new Date(), t = new Date(now.getFullYear(), mo, day, 23, 59);
    if (t < now) t = new Date(now.getFullYear() + 1, mo, day, 23, 59);
    var d = Math.ceil((t - now) / 864e5);
    el.textContent = t.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    var s = document.getElementById(id + "-d"); if (s) s.textContent = d + " days away";
  }
  cd("tg-hs", 3, 30); cd("tg-pr", 4, 15);
})();

// Things to Do filters (Things to Do page)
(function () {
  var hub = document.getElementById("things-hub"); if (!hub) return;
  var cat = "all", city = "all", today = new Date(); today.setHours(0, 0, 0, 0);
  var iso = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
  function apply() {
    var shown = 0;
    [].forEach.call(hub.querySelectorAll(".ev"), function (el) {
      var ok = el.getAttribute("data-end") >= iso && (cat === "all" || el.getAttribute("data-cats").split(" ").indexOf(cat) > -1) && (city === "all" || el.getAttribute("data-city") === city);
      el.hidden = !ok; if (ok) { shown++; var lb = el.querySelector(".ev-now"); if (!lb && el.getAttribute("data-start") <= iso) { var s = document.createElement("span"); s.className = "ev-now"; s.textContent = "Happening now"; el.querySelector(".ev-date").appendChild(s); } }
    });
    document.getElementById("ev-empty").hidden = shown > 0;
    [].forEach.call(hub.querySelectorAll(".spot"), function (el) {
      el.hidden = !((cat === "all" || el.getAttribute("data-cats").split(" ").indexOf(cat) > -1) && (city === "all" || el.getAttribute("data-city") === city));
    });
  }
  function chips(id, set) {
    var box = document.getElementById(id);
    box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return;
      [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === b); }); set(b.getAttribute("data-v")); apply(); });
  }
  chips("tdo-cat", function (v) { cat = v; }); chips("tdo-city", function (v) { city = v; });
  var h = (location.hash || "").replace("#", ""); if (["kids", "date", "night", "free"].indexOf(h) > -1) { var b = hub.querySelector('#tdo-cat [data-v="' + h + '"]'); if (b) b.click(); }
  apply();
})();

// 254 Scoreboard filters
(function () {
  var g = document.getElementById("sb-gender"), sp = document.getElementById("sb-sport"); if (!g || !sp) return;
  var gv = "all", sv = "all";
  function apply() {
    [].forEach.call(document.querySelectorAll(".sb-sport"), function (el) {
      var okG = gv === "all" || el.getAttribute("data-g").indexOf(gv) > -1;
      var okS = sv === "all" || (sv === "live" ? el.getAttribute("data-st") !== "off" : el.getAttribute("data-k") === sv);
      el.style.display = okG && okS ? "" : "none";
    });
  }
  function wire(box, set) {
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.remove("on"); });
      b.classList.add("on"); set(b.getAttribute("data-v")); apply();
    });
  }
  wire(g, function (v) { gv = v; }); wire(sp, function (v) { sv = v; });
})();

// Coming to the 254 filters
(function () {
  var q = document.getElementById("cm-q"), cb = document.getElementById("cm-city"), tb = document.getElementById("cm-type"), fb = document.getElementById("cm-feat"); if (!q || !cb || !tb) return;
  var city = "all", type = "all", feat = "all";
  function apply() {
    var term = q.value.trim().toLowerCase(), shown = 0;
    [].forEach.call(document.querySelectorAll(".cm-card"), function (el) {
      var ok = (city === "all" || el.getAttribute("data-city") === city) && (type === "all" || el.getAttribute("data-type") === type) && (feat === "all" || (" " + (el.getAttribute("data-feat") || "") + " ").indexOf(" " + feat + " ") > -1) && (!term || el.getAttribute("data-q").indexOf(term) > -1);
      el.style.display = ok ? "" : "none"; if (ok) shown++;
    });
    document.getElementById("cm-none").hidden = shown > 0;
  }
  function wire(box, set) { box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.remove("on"); }); b.classList.add("on"); set(b.getAttribute("data-v")); apply(); }); }
  wire(cb, function (v) { city = v; }); wire(tb, function (v) { type = v; }); if (fb) wire(fb, function (v) { feat = v; }); q.addEventListener("input", apply);
  var h = decodeURIComponent(location.hash.slice(1)); if (h) { var b = [].find.call(cb.querySelectorAll("button"), function (x) { return x.getAttribute("data-v").toLowerCase().replace(/\s+/g, "-") === h; }); if (b) b.click(); }
})();

// Copy link / native share
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest(".share-copy"); if (!b) return;
  var u = b.getAttribute("data-url"), t = b.getAttribute("data-title");
  if (navigator.share) { navigator.share({ title: t, url: u }).catch(function () {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { b.textContent = "Link copied"; });
});

// Site search
(function () {
  var q = document.getElementById("srch-q"), out = document.getElementById("srch-out"), n = document.getElementById("srch-n"); if (!q || !out) return;
  var idx = null, esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function run() {
    var term = q.value.trim().toLowerCase(); if (!idx) return;
    if (!term) { out.innerHTML = ""; n.textContent = ""; return; }
    var words = term.split(/\s+/);
    var hits = idx.map(function (x) { var h = (x.t + " " + x.d + " " + x.c + " " + x.k).toLowerCase(), t = x.t.toLowerCase(), s = 0;
      for (var i = 0; i < words.length; i++) { if (h.indexOf(words[i]) < 0) return null; s += t.indexOf(words[i]) > -1 ? 3 : 1; }
      return [s, x]; }).filter(Boolean).sort(function (a, b) { return b[0] - a[0] || (a[1].dt < b[1].dt ? 1 : -1); }).slice(0, 40);
    n.textContent = hits.length ? hits.length + " result" + (hits.length > 1 ? "s" : "") : "No results. Try a city, business or school name.";
    out.innerHTML = hits.map(function (h) { var x = h[1]; return '<a class="row" href="' + x.u + '"><span class="row-txt"><span class="cat">' + esc(x.k) + '</span><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p>' + (x.c ? '<time>' + esc(x.c) + '</time>' : '') + '</span></a>'; }).join("");
  }
  var p = new URLSearchParams(location.search).get("q"); if (p) q.value = p;
  fetch("/search-index.json").then(function (r) { return r.json(); }).then(function (d) { idx = d; run(); });
  q.addEventListener("input", run);
  q.form && q.form.addEventListener("submit", function (e) { e.preventDefault(); history.replaceState(null, "", "?q=" + encodeURIComponent(q.value)); run(); });
})();

// ---------- Weather (National Weather Service, api.weather.gov) ----------
(function () {
  var NWS = "https://api.weather.gov", H = { headers: { Accept: "application/geo+json" } };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function cache(key, ttl, fn) {
    try { var c = JSON.parse(sessionStorage.getItem(key) || "null"); if (c && Date.now() - c.t < ttl) return Promise.resolve(c.v); } catch (e) {}
    return fn().then(function (v) { try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {} return v; });
  }
  function j(u) { return fetch(u, H).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  var cToF = function (c) { return c == null ? null : Math.round(c * 9 / 5 + 32); };
  // Sitewide banner: warnings for Bell, McLennan, Coryell and Lampasas counties
  var banner = document.getElementById("wx-banner");
  if (banner) cache("wx-zones", 5 * 60e3, function () { return j(NWS + "/alerts/active?zone=TXC027,TXC309,TXC099,TXC281").then(function (d) { return d.features.map(function (f) { return [f.properties.event, f.properties.areaDesc, f.properties.severity]; }); }); }).then(function (a) {
    var big = a.filter(function (x) { return /Warning/.test(x[0]) || x[2] === "Extreme" || x[2] === "Severe"; });
    if (!big.length) return;
    var names = []; big.forEach(function (x) { if (names.indexOf(x[0]) < 0) names.push(x[0]); });
    banner.innerHTML = "⚠️ National Weather Service: " + esc(names.join(", ")) + " in effect for parts of the 254. <a href=\"/weather/\">Details →</a>";
    banner.hidden = false;
  }).catch(function () {});
  // Topbar mini: Temple temp
  var tw = document.getElementById("top-wx");
  function pointData(lat, lon) { return cache("wx-pt-" + lat + "," + lon, 24 * 3600e3, function () { return j(NWS + "/points/" + lat + "," + lon).then(function (d) { return { f: d.properties.forecast, h: d.properties.forecastHourly, s: d.properties.observationStations }; }); }); }
  if (tw) pointData(31.0982, -97.3428).then(function (p) { return cache("wx-hr-temple", 20 * 60e3, function () { return j(p.h).then(function (d) { var x = d.properties.periods[0]; return [x.temperature, x.shortForecast]; }); }); }).then(function (x) { tw.textContent = "🌤 Temple " + x[0] + "°"; tw.title = x[1]; }).catch(function () {});
  // Weather page
  var box = document.getElementById("wx-city"); if (!box) return;
  var nowEl = document.getElementById("wx-now"), hrEl = document.getElementById("wx-hourly"), wkEl = document.getElementById("wx-week"), alEl = document.getElementById("wx-alerts");
  function load(b) {
    var lat = b.getAttribute("data-lat"), lon = b.getAttribute("data-lon"), city = b.getAttribute("data-city");
    nowEl.innerHTML = '<p class="sb-when" style="color:#fff">Loading ' + esc(city) + '…</p>'; hrEl.innerHTML = ""; wkEl.innerHTML = ""; alEl.innerHTML = "";
    j(NWS + "/alerts/active?point=" + lat + "," + lon).then(function (d) {
      if (!d.features.length) { alEl.innerHTML = '<div class="wx-ok">✓ No active National Weather Service alerts for ' + esc(city) + ' right now.</div>'; return; }
      alEl.innerHTML = d.features.map(function (f) { var p = f.properties; var minor = !/Warning/.test(p.event) && p.severity !== "Extreme" && p.severity !== "Severe";
        return '<div class="wx-alert' + (minor ? " minor" : "") + '"><h3>⚠️ ' + esc(p.event) + '</h3><p>' + esc(p.headline || "") + '</p><details><summary>Full NWS text</summary><p>' + esc(p.description || "") + (p.instruction ? "\n\n" + esc(p.instruction) : "") + '</p></details></div>'; }).join("");
    }).catch(function () { alEl.innerHTML = '<div class="wx-ok" style="background:#f6f1e8;color:#555">Couldn\'t reach the NWS alert feed. Check <a href="https://www.weather.gov/fwd/" target="_blank" rel="noopener">weather.gov</a>.</div>'; });
    pointData(lat, lon).then(function (p) {
      j(p.h).then(function (d) {
        var per = d.properties.periods;
        hrEl.innerHTML = per.slice(0, 12).map(function (x) { var t = new Date(x.startTime); return '<div>' + t.toLocaleTimeString("en-US", { hour: "numeric", timeZone: "America/Chicago" }) + '<img src="' + esc(x.icon) + '" alt="" loading="lazy"><b>' + x.temperature + '°</b>' + (x.probabilityOfPrecipitation && x.probabilityOfPrecipitation.value ? "💧" + x.probabilityOfPrecipitation.value + "%" : "") + '</div>'; }).join("");
        var x = per[0];
        nowEl.innerHTML = '<img src="' + esc(x.icon) + '" alt=""><div><span class="t">' + x.temperature + '°</span></div><div><span class="c">' + esc(city) + ': ' + esc(x.shortForecast) + '</span><small>Wind ' + esc(x.windSpeed) + ' ' + esc(x.windDirection) + (x.relativeHumidity && x.relativeHumidity.value != null ? ' · Humidity ' + x.relativeHumidity.value + '%' : "") + '</small><small id="wx-obs"></small></div>';
        j(p.s).then(function (st) { var id = st.features[0] && st.features[0].properties.stationIdentifier; if (!id) return; return j(NWS + "/stations/" + id + "/observations/latest").then(function (o) { var q = o.properties, f = cToF(q.temperature && q.temperature.value); var el = document.getElementById("wx-obs"); if (el && f != null) el.textContent = "Observed " + f + "° at " + (st.features[0].properties.name || id) + ", " + new Date(q.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }); }); }).catch(function () {});
      }).catch(function () { nowEl.innerHTML = '<p style="color:#fff">Forecast unavailable right now. Try <a style="color:#fff" href="https://www.weather.gov/fwd/" target="_blank" rel="noopener">weather.gov</a>.</p>'; });
      j(p.f).then(function (d) {
        wkEl.innerHTML = d.properties.periods.slice(0, 14).map(function (x) { return '<div class="wx-day"><img src="' + esc(x.icon) + '" alt="" loading="lazy"><div><b>' + esc(x.name) + '</b><br>' + (x.isDaytime ? "High " : "Low ") + x.temperature + '°</div><p>' + esc(x.detailedForecast) + '</p></div>'; }).join("");
      }).catch(function () {});
    }).catch(function () { nowEl.innerHTML = '<p style="color:#fff">Forecast unavailable right now.</p>'; });
  }
  box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.remove("on"); }); b.classList.add("on"); try { localStorage.setItem("wx-city", b.getAttribute("data-city")); } catch (er) {} load(b); });
  var saved = null; try { saved = localStorage.getItem("wx-city"); } catch (e) {}
  var start = (saved && [].find.call(box.querySelectorAll("button"), function (x) { return x.getAttribute("data-city") === saved; })) || box.querySelector("button");
  [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === start); }); load(start);
  setInterval(function () { var b = box.querySelector("button.on"); if (b && !document.hidden) load(b); }, 10 * 60e3);
})();

// Traffic map city switch
(function () {
  var box = document.getElementById("tr-city"), map = document.getElementById("tr-map"); if (!box || !map) return;
  box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.remove("on"); }); b.classList.add("on"); map.src = "https://embed.waze.com/iframe?zoom=12&lat=" + b.getAttribute("data-lat") + "&lon=" + b.getAttribute("data-lon") + "&ct=livemap"; });
})();

// Tracker map (Leaflet + OpenStreetMap), follows the tracker filters
(function () {
  var el = document.getElementById("cm-map"); if (!el) return;
  var COL = { "Opening soon": "#2e7d32", "Under construction": "#c75b26", "Permit filed": "#6b5b95", "Announced": "#13213c", "Proposed": "#8a8a8a", "Now open": "#1b7f8c", "Closing": "#b23b2e", "Closed": "#b23b2e", "Municipal": "#2e7d32", "Daily fee": "#1b7f8c", "Semi-private": "#6b5b95", "Private": "#5c5c5c", "Military": "#4b5320", "Indoor golf": "#b54c17", "Easy": "#2e7d32", "Moderate": "#b8860b", "Hard": "#b23b2e", "Tournament complex": "#b8541c", "City complex": "#13213c", "Soccer complex": "#2e7d32" };
  var css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(css);
  var js = document.createElement("script"); js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; js.onload = init; document.head.appendChild(js);
  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function init() {
    var L = window.L, map = L.map(el, { scrollWheelZoom: false }).setView([31.25, -97.45], 9);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
    var layer = L.layerGroup().addTo(map), seen = {};
    function draw(fit) {
      layer.clearLayers(); var pts = []; seen = {};
      [].forEach.call(document.querySelectorAll(".cm-card[data-ll]"), function (c) {
        if (c.style.display === "none") return; var id = c.getAttribute("data-id"); if (seen[id]) return; seen[id] = 1;
        var ll = c.getAttribute("data-ll").split(",").map(Number), st = c.getAttribute("data-st"), ap = c.getAttribute("data-approx");
        var icon = L.divIcon({ className: "", html: '<div class="cm-pin' + (ap ? " approx" : "") + '" style="background:' + (COL[st] || "#13213c") + ';color:' + (COL[st] || "#13213c") + '"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
        L.marker(ll, { icon: icon, title: c.getAttribute("data-n") }).bindPopup('<a href="' + esc(c.getAttribute("data-url")) + '">' + esc(c.getAttribute("data-n")) + '</a><br>' + esc(st) + ' · ' + esc(c.getAttribute("data-city")) + (ap ? '<br><small>Approximate location</small>' : "")).addTo(layer);
        pts.push(ll);
      });
      if (fit && pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: 13 });
    }
    draw(true);
    ["cm-city", "cm-type", "cm-feat"].forEach(function (id) { var b = document.getElementById(id); if (b) b.addEventListener("click", function () { setTimeout(function () { draw(true); }, 0); }); });
    var q = document.getElementById("cm-q"); if (q) q.addEventListener("input", function () { setTimeout(function () { draw(false); }, 0); });
  }
})();

// Golf weather check (NWS daytime forecast -> plain rating)
(function () {
  var box = document.getElementById("gw-city"), out = document.getElementById("gw-out"); if (!box || !out) return;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var H = { headers: { Accept: "application/geo+json" } };
  function j(u) { return fetch(u, H).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function cache(key, ttl, fn) { try { var c = JSON.parse(sessionStorage.getItem(key) || "null"); if (c && Date.now() - c.t < ttl) return Promise.resolve(c.v); } catch (e) {} return fn().then(function (v) { try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {} return v; }); }
  var WK = out.getAttribute("data-mode") === "weekend";
  function rate(p) {
    var t = p.temperature, w = 0, m = String(p.windSpeed || "").match(/\d+/g); if (m) w = Math.max.apply(null, m.map(Number));
    var r = p.probabilityOfPrecipitation && p.probabilityOfPrecipitation.value || 0, why = [];
    if (r >= 60) return [WK ? "Rainout risk" : "Stay home", "gw-bad", ["Rain chance " + r + "%"]];
    if (w >= 20) why.push("windy, up to " + w + " mph"); if (t >= (WK ? 95 : 100)) why.push("hot, " + t + "°"); if (t < 45) why.push("cold, " + t + "°"); if (r >= 30) why.push("rain chance " + r + "%");
    if (why.length) return ["Tough", "gw-meh", why];
    if (t >= 60 && t <= 90 && w < 12 && r < 20) return ["Great", "gw-great", [t + "°, wind " + (w || "calm") + (w ? " mph" : "") + (r ? ", rain " + r + "%" : "")]];
    return ["Good", "gw-good", [t + "°, wind up to " + w + " mph" + (r ? ", rain " + r + "%" : "")]];
  }
  function load(b) {
    var lat = b.getAttribute("data-lat"), lon = b.getAttribute("data-lon"), city = b.getAttribute("data-city");
    out.innerHTML = '<p class="sb-when">Loading ' + esc(city) + '…</p>';
    cache("wx-pt-" + lat + "," + lon, 24 * 3600e3, function () { return j("https://api.weather.gov/points/" + lat + "," + lon).then(function (d) { return { f: d.properties.forecast, h: d.properties.forecastHourly, s: d.properties.observationStations }; }); })
      .then(function (p) { return cache((WK ? "gw-w-" : "gw-f-") + city, 30 * 60e3, function () { return j(p.f).then(function (d) { var ds = d.properties.periods.filter(function (x) { return x.isDaytime; }); if (WK) { var wk = ds.filter(function (x) { var g = new Date(x.startTime).getDay(); return g === 6 || g === 0; }); ds = wk.length > 1 && new Date(wk[0].startTime).getDay() === 6 ? wk.slice(0, 2) : wk.slice(0, 1); } else ds = ds.slice(0, 4); return ds.map(function (x) { return { name: x.name, temperature: x.temperature, windSpeed: x.windSpeed, probabilityOfPrecipitation: x.probabilityOfPrecipitation, shortForecast: x.shortForecast, icon: x.icon }; }); }); }); })
      .then(function (days) {
        function pack(x) { var t = x.temperature, r = x.probabilityOfPrecipitation && x.probabilityOfPrecipitation.value || 0, k = []; if (t >= 85) k.push("sunscreen, canopy, extra water"); if (t < 55) k.push("layers, blankets, hand warmers"); if (r >= 30) k.push("rain gear, towels, dry socks"); if (!k.length) k.push("water, sunscreen, chairs"); return "Pack: " + k.join("; "); }
        out.innerHTML = (days.length ? '<div class="gw-days">' + days.map(function (x) { var r = rate(x); return '<div class="gw-day ' + r[1] + '"><b>' + esc(x.name) + '</b><span class="gw-r">' + r[0] + '</span><img src="' + esc(x.icon) + '" alt="" loading="lazy"><small>' + esc(x.shortForecast) + '</small><small>' + esc(r[2].join(", ")) + '</small>' + (WK ? '<small class="gw-pack">' + esc(pack(x)) + '</small>' : '') + '</div>'; }).join("") + '</div>' : '<p class="sb-when">The weekend forecast isn\'t out yet. Check back closer to Saturday.</p>');
        if (WK) j("https://api.weather.gov/alerts/active?point=" + lat + "," + lon).then(function (a) { var f = (a.features || []).map(function (x) { return x.properties; }); if (f.length) out.insertAdjacentHTML("afterbegin", f.slice(0, 3).map(function (x) { return '<p class="gw-alert">⚠️ <b>' + esc(x.event) + '</b> ' + esc(x.headline || "") + '</p>'; }).join("")); }).catch(function () {});
      }).catch(function () { out.innerHTML = '<p class="sb-when">Forecast unavailable right now. Try <a href="https://www.weather.gov/fwd/" target="_blank" rel="noopener">weather.gov</a>.</p>'; });
  }
  box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === b); }); try { localStorage.setItem("gw-city", b.getAttribute("data-city")); } catch (er) {} load(b); });
  var saved = null; try { saved = localStorage.getItem("gw-city"); } catch (e) {}
  var start = (saved && [].find.call(box.querySelectorAll("button"), function (x) { return x.getAttribute("data-city") === saved; })) || box.querySelector("button");
  [].forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === start); }); load(start);
})();

// Advertise page: pre-select the spot
document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-adspot]"); if (!b) return; var s = document.getElementById("ad-spot"); if (s) s.value = b.getAttribute("data-adspot"); });

// Breaking banner hides itself once it expires
(function () { var b = document.querySelector(".br-bar"); if (b && Date.parse(b.getAttribute("data-until")) < Date.now()) b.remove(); })();
