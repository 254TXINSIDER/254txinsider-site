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
