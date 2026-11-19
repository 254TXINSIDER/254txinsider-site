// Small enhancements for the static pages
document.addEventListener("DOMContentLoaded", function () {
  var d = document.getElementById("today");
  if (d) d.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
  var a = document.querySelector(".secnav a.active");
  if (a) { var nav = a.parentNode; nav.scrollLeft = a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2; }
  var t = new URLSearchParams(location.search).get("topic"), sel = document.getElementById("topic");
  if (t && sel) sel.value = t;
});
