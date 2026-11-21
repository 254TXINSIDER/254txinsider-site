// Breaking-news banner. 254-impact only (local news, or state/national news that directly hits the 254).
// on: true to show. text: one short line (under ~110 characters). url: our story (/news/<id>/) or the official source.
// label: "Breaking" or "Developing" or "Alert". until: ISO time when it disappears on its own (usually 4-12 hours later).
window.BREAKING = { on: false, label: "Breaking", text: "", url: "", until: "2026-11-21T00:00:00-06:00" };
