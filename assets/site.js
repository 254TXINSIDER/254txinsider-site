// Mobile menu toggle + today's date in the top bar
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  var d = document.getElementById("today");
  if (d) {
    d.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
      timeZone: "America/Chicago"
    });
  }
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
