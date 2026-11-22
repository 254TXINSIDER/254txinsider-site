// 254 Housing Dashboard data. Updated by the daily news run.
// Rates: Mortgage News Daily (daily index, weekdays) and Freddie Mac PMMS (weekly, Thursdays).
// Local: Realtor.com metro data via FRED (monthly). Austin: Unlock MLS / Austin Board of REALTORS (monthly). National: NAR (monthly).
window.MARKET = {
  updated: "2026-11-22",
  rates: {
    daily: { label: "Daily 30-yr fixed", v: 7.33, chg: -0.12, asOf: "Nov 20, 2026", src: ["Mortgage News Daily", "https://www.mortgagenewsdaily.com/mortgage-rates/mnd"] },
    daily15: { label: "Daily 15-yr fixed", v: 6.89, chg: -0.10, asOf: "Nov 20, 2026", src: ["Mortgage News Daily", "https://www.mortgagenewsdaily.com/mortgage-rates/mnd"] },
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
    buyers: "Rates are still above 7%, though the daily average eased to 7.33% on Friday. 254 prices are softer than a year ago and homes are sitting 77 to 79 days. That gives buyers room to negotiate on price, repairs and closing costs. Get pre-approved and compare at least three lenders.",
    sellers: "More competition and longer market times mean pricing right on day one matters. List prices in Killeen-Temple are down about 7% from a year ago. Expect buyers to ask for concessions.",
    owners: "Values have flattened, not crashed. If you locked a rate under 5%, there is little reason to refinance now. Watch your 2027 appraisal notice in the spring and protest if it's out of line with nearby sales."
  },
  calc: { price: 275000, downPct: 10 },
  // Tax areas. Each unit: [name, rate per $100, exemption] where exemption is "school" ($140,000 off for homesteads),
  // "pct20" (20% of value, min $5,000, for homesteads) or "" (none). "avg" = county average effective rate (Census ACS 2020-2024).
  taxAreas: [
    { name: "Temple (Temple ISD)", year: "2026", units: [["Temple ISD", 1.0619, "school"], ["City of Temple", 0.75, "pct20"], ["Bell County", 0.2995, ""], ["Temple College", 0.2498, "pct20"], ["Bell Co. Road District", 0.0468, ""], ["Temple Health & Bio District", 0.0142, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Killeen (Killeen ISD)", year: "2026", units: [["Killeen ISD", 0.8622, "school"], ["City of Killeen", 0.7301, ""], ["Bell County", 0.2995, ""], ["Central Texas College", 0.0943, ""], ["Bell Co. Road District", 0.0468, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Belton (Belton ISD)", year: "2026", units: [["Belton ISD", 1.1177, "school"], ["City of Belton", 0.5619, ""], ["Bell County", 0.2995, ""], ["Bell Co. Road District", 0.0468, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Harker Heights (Killeen ISD)", year: "2026", units: [["Killeen ISD", 0.8622, "school"], ["City of Harker Heights", 0.53, ""], ["Bell County", 0.2995, ""], ["Central Texas College", 0.0943, ""], ["Bell Co. Road District", 0.0468, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Nolanville (Killeen ISD)", year: "2026", units: [["Killeen ISD", 0.8622, "school"], ["City of Nolanville", 0.5671, ""], ["Bell County", 0.2995, ""], ["Central Texas College", 0.0943, ""], ["Bell Co. Road District", 0.0468, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Salado (Salado ISD, in village)", year: "2026", units: [["Salado ISD", 1.1471, "school"], ["Village of Salado", 0.3797, "pct20"], ["Bell County", 0.2995, ""], ["Bell Co. Road District", 0.0468, ""], ["Clearwater UWCD", 0.0022, ""]] },
    { name: "Waco (Waco ISD)", year: "2026", units: [["Waco ISD", 1.0346, "school"], ["City of Waco", 0.755, ""], ["McLennan County", 0.3748, "pct20"], ["McLennan Community College", 0.140772, "pct20"]] },
    { name: "Waco (Midway ISD)", year: "2026", units: [["Midway ISD", 0.9089, "school"], ["City of Waco", 0.755, ""], ["McLennan County", 0.3748, "pct20"], ["McLennan Community College", 0.140772, "pct20"]] },
    { name: "Hewitt (Midway ISD)", year: "2026", units: [["Midway ISD", 0.9089, "school"], ["City of Hewitt", 0.590427, ""], ["McLennan County", 0.3748, "pct20"], ["McLennan Community College", 0.140772, "pct20"]] },
    { name: "Woodway (Midway ISD)", year: "2026", units: [["Midway ISD", 0.9089, "school"], ["City of Woodway", 0.391668, ""], ["McLennan County", 0.3748, "pct20"], ["McLennan Community College", 0.140772, "pct20"]] },
    { name: "Robinson (Robinson ISD)", year: "2026*", units: [["Robinson ISD (2025 rate)", 0.94664, "school"], ["City of Robinson", 0.535326, ""], ["McLennan County", 0.3748, "pct20"], ["McLennan Community College", 0.140772, "pct20"]] },
    { name: "Copperas Cove (Copperas Cove ISD)", year: "est.", units: [["Copperas Cove ISD (2025 rate)", 0.7575, "school"], ["City of Copperas Cove (2026 proposed)", 0.699, ""], ["Coryell County (2026 proposed)", 0.515, ""]] },
    { name: "Other Lampasas County (county avg.)", avg: 1.17 },
    { name: "Other Erath County (county avg.)", avg: 1.07 },
    { name: "Other Falls County (county avg.)", avg: 1.37 },
    { name: "Other Milam County (county avg.)", avg: 0.99 },
    { name: "Other Bosque County (county avg.)", avg: 0.98 }
  ],
  taxSrc: [["BellCAD 2026 tax rate chart", "https://bellcad.org/wp-content/uploads/2026/10/2026_TAX_RATE_CHART.pdf"], ["McLennan County tax rate worksheets", "https://www.mclennan.gov/1088/Taxing-Entity-5-Year-Tax-Rate-Worksheet-"]],
  // Loan rules: FHA upfront MIP 1.75% financed + annual MIP 0.55% (0.50% with 5%+ down); VA funding fee (first use) 2.15% / 1.5% / 1.25% financed, no monthly MI;
  // Conventional with under 20% down: PMI estimate (editable).
  loans: { fhaUpfront: 1.75, fhaAnnual: 0.55, fhaAnnualLow: 0.50, vaFee: [[0, 2.15], [5, 1.5], [10, 1.25]], pmi: [[5, 0.75], [10, 0.55], [15, 0.4], [20, 0]] }
};
