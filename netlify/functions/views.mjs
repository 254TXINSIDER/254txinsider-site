// Public view counter for 254txinsider.com.
// GET /api/views?p=/news/some-story/&hit=1  -> counts a view (if hit=1) and returns totals.
import { getStore } from "@netlify/blobs";

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|headless|lighthouse|curl|wget|python|axios/i;
const clean = p => (typeof p === "string" && /^\/[a-z0-9\-\/]*$/i.test(p) && p.length < 200) ? p : null;

export default async (req) => {
  const url = new URL(req.url);
  const path = clean(url.searchParams.get("p"));
  const hit = url.searchParams.get("hit") === "1" && !BOT.test(req.headers.get("user-agent") || "");
  const month = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" }).slice(0, 7);
  const store = getStore({ name: "views", consistency: "strong" });
  const read = async k => Number((await store.get(k)) || 0);
  const keys = { site: "site-all", month: "site-" + month, page: path ? "page" + path.replace(/\//g, "_") : null };
  const out = { site: await read(keys.site), month: await read(keys.month), page: keys.page ? await read(keys.page) : 0 };
  if (hit) {
    out.site++; out.month++; if (keys.page) out.page++;
    await Promise.all([store.set(keys.site, String(out.site)), store.set(keys.month, String(out.month)), keys.page ? store.set(keys.page, String(out.page)) : null]);
  }
  return new Response(JSON.stringify(out), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
};

export const config = { path: "/api/views" };
