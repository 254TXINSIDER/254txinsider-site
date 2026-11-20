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
  var MIN_PAGE = 25, MIN_MONTH = 250;
  var p = location.pathname, key = "v:" + p, hit = "1";
  try { if (sessionStorage.getItem(key)) hit = "0"; sessionStorage.setItem(key, "1"); } catch (e) {}
  fetch("/api/views?hit=" + hit + "&p=" + encodeURIComponent(p)).then(function (r) { return r.json(); }).then(function (d) {
    var f = function (n) { return Number(n).toLocaleString("en-US"); };
    var el = document.querySelector("[data-views]");
    if (el && d.page >= MIN_PAGE) { el.textContent = " · \uD83D\uDC41 " + f(d.page) + " views"; el.hidden = false; }
    var s = document.querySelector("[data-site-views]");
    if (s && d.month >= MIN_MONTH) { s.textContent = f(d.month) + " readers this month"; s.hidden = false; }
  }).catch(function () {});
})();


// Mortgage payment calculator (Real Estate page)
(function () {
  var out = document.getElementById("pc-out"); if (!out) return;
  var g = function (id) { return document.getElementById(id); };
  function calc() {
    var P = (+g("pc-price").value || 0) * (1 - (+g("pc-down").value || 0) / 100), r = (+g("pc-rate").value || 0) / 1200, n = (+g("pc-term").value || 30) * 12;
    var m = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
    out.textContent = "$" + Math.round(m).toLocaleString("en-US");
  }
  ["pc-price", "pc-down", "pc-rate", "pc-term"].forEach(function (id) { g(id).addEventListener("input", calc); });
  calc();
})();
