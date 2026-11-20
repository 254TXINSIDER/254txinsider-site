// 254 Housing Dashboard data. Updated by the daily news run.
// Rates: Mortgage News Daily (daily index, weekdays) and Freddie Mac PMMS (weekly, Thursdays).
// Local: Realtor.com metro data via FRED (monthly). Austin: Unlock MLS / Austin Board of REALTORS (monthly). National: NAR (monthly).
window.MARKET = {
  updated: "2026-11-20",
  rates: {
    daily: { label: "Daily 30-yr fixed", v: 7.45, chg: -0.01, asOf: "Nov 19, 2026", src: ["Mortgage News Daily", "https://www.mortgagenewsdaily.com/mortgage-rates/mnd"] },
    daily15: { label: "Daily 15-yr fixed", v: 6.99, chg: 0.01, asOf: "Nov 19, 2026", src: ["Mortgage News Daily", "https://www.mortgagenewsdaily.com/mortgage-rates/mnd"] },
    weekly: { label: "Freddie Mac 30-yr avg", v: 7.28, prev: 7.11, yearAgo: 6.26, asOf: "Nov 19, 2026", src: ["Freddie Mac PMMS", "https://www.freddiemac.com/pmms"] },
    weekly15: { label: "Freddie Mac 15-yr avg", v: 6.66, prev: 6.45, yearAgo: 5.54, asOf: "Nov 19, 2026", src: ["Freddie Mac PMMS", "https://www.freddiemac.com/pmms"] }
  },
  local: [
    { name: "Killeen-Temple metro", sub: "Bell, Coryell & Lampasas counties", month: "Oct 2026",
      stats: [["Median list price", 275000, "$", -7.4], ["Active listings", 2448, "", -3.0], ["Median days on market", 77, "", null, "80 a year ago"]],
      src: ["Realtor.com via FRED", "https://fred.stlouisfed.org/series/MEDLISPRI28660"] },
    { name: "Waco metro", sub: "McLennan & Falls counties", month: "Oct 2026",
      stats: [["Median list price", 303495, "$", -3.7], ["Active listings", 1659, "", 3.2], ["Median days on market", 79, "", null, "100 a year ago"]],
      src: ["Realtor.com via FRED", "https://fred.stlouisfed.org/series/MEDLISPRI47380"] },
    { name: "Austin metro (next door)", sub: "Incl. Williamson County", month: "Oct 2026",
      stats: [["Median sold price", 404802, "$", -6.9], ["Closed sales", 2114, "", -11.4], ["Months of inventory", 6.2, "", null, "up 0.4 from a year ago"]],
      src: ["Unlock MLS / Austin Board of REALTORS", "https://www.unlockmls.com/news/october-2026-central-texas-housing-report"] }
  ],
  national: { month: "Oct 2026",
    stats: [["Median existing-home price", 416700, "$", 0.4], ["Annual sales pace", "3.75M", "", -8.8, "lowest since 2010"], ["Months of supply", 5.1, "", null, "1.59M homes for sale"], ["Median days on market", 35, "", null, "33 in September"]],
    src: ["National Association of REALTORS", "https://www.nar.realtor/newsroom/existing-home-sales-decreased-5-5-percent-october-nar-report"] },
  takeaways: {
    buyers: "Rates jumped back above 7% this week, but 254 prices are softer than a year ago and homes are sitting 77 to 79 days. That gives buyers room to negotiate on price, repairs and closing costs. Get pre-approved and compare at least three lenders.",
    sellers: "More competition and longer market times mean pricing right on day one matters. List prices in Killeen-Temple are down about 7% from a year ago. Expect buyers to ask for concessions.",
    owners: "Values have flattened, not crashed. If you locked a rate under 5%, there is little reason to refinance now. Watch your 2027 appraisal notice in the spring and protest if it's out of line with nearby sales."
  },
  calc: { price: 275000, downPct: 10 }
};
