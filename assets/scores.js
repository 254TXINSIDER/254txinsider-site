// 254 Scoreboard data. Updated by the daily update. Powers https://254txinsider.com/scoreboard/
// sport: { k, n (name), g ("Boys" | "Girls" | "Boys & girls"), season (text), status ("playoffs" | "season" | "off"), when (shown when off), note,
//   tracker: { round, next, alive: [{ t, c, r, n }], out: [{ t, c, r, n }] }   (playoffs only)
//   games: [{ d, lv ("HS" | "College"), t1, s1, t2, s2, note, where }]          (finals; t1 = the 254 team)
//   up:    [{ d, lv, t1, t2, time, where, note }] }                            (upcoming)
window.SCORES = {
  updated: "2026-11-20",
  sports: [
    {
      k: "football", n: "Football", g: "Boys", season: "August to December", status: "playoffs",
      note: "UIL area round is Nov. 19-21. Regional round is Nov. 26-28. Times and sites can change, so check with each school.",
      tracker: {
        round: "Area round (Nov. 19-21)", next: "Regional round, Nov. 26-28",
        alive: [
          { t: "Bremond", c: "2A-II", r: "12-0", n: "Won area round 71-21 over Three Rivers. Advances to regionals." },
          { t: "La Vega", c: "4A-II", r: "11-0", n: "Area: vs. Geronimo Navarro, Fri. 7:30 p.m., Crusader Stadium, Belton" },
          { t: "Robinson", c: "4A-II", r: "9-2", n: "Area: vs. Rockport-Fulton, Fri., Gustafson Stadium, San Antonio" },
          { t: "China Spring", c: "4A-I", r: "4-7", n: "Area: vs. Stafford, Fri. 7 p.m., Buffalo Stadium, Giddings" },
          { t: "Lorena", c: "3A-I", r: "9-2", n: "Area: vs. Diboll, Fri. 7:30 p.m., Mustang Stadium, Madisonville" },
          { t: "Cameron Yoe", c: "", r: "", n: "Area: vs. Orangefield, Fri., Houston" },
          { t: "Rosebud-Lott", c: "", r: "", n: "Area: vs. Flatonia, Fri., Manor" },
          { t: "Crawford", c: "", r: "", n: "Area: vs. Wellington, Fri., Graham" },
          { t: "Goldthwaite", c: "", r: "11-0", n: "Area: vs. Haskell, Fri., San Angelo" },
          { t: "San Saba", c: "", r: "", n: "Area: vs. Muenster, Fri., Granbury" },
          { t: "Aquilla", c: "", r: "11-0", n: "Area: vs. Medina, Fri., Priddy" },
          { t: "Oglesby", c: "", r: "", n: "Area: vs. Union Hill, Fri., Oakwood" },
          { t: "Mount Calm", c: "", r: "", n: "Area: vs. Runge, Fri., Bartlett" },
          { t: "Waco Valor Prep", c: "TAPPS 6-Man D-II", r: "8-3", n: "State final: vs. Keller Harvest, Fri. 7 p.m., Rocket Field, Robinson" },
          { t: "Central Texas Christian (Temple)", c: "TAPPS 11-Man", r: "9-2", n: "State final: vs. Dallas First Baptist (12-0), date and site TBA" }
        ],
        out: [
          { t: "Belton", c: "5A-II", r: "8-4", n: "Lost 57-14 to South Oak Cliff, area round" },
          { t: "Axtell", c: "2A-I", r: "", n: "Lost 28-16 to De Leon, area round" },
          { t: "Harker Heights", c: "", r: "", n: "Lost 31-27 to Red Oak, bi-district" },
          { t: "Killeen Ellison", c: "", r: "", n: "Lost 31-21 to Midlothian Heritage, bi-district" },
          { t: "Lake Belton", c: "", r: "", n: "Lost 55-0 to North Crowley, bi-district" }
        ]
      },
      games: [
        { d: "2026-11-19", lv: "HS", t1: "Bremond", s1: 71, t2: "Three Rivers", s2: 21, note: "2A-II area round" },
        { d: "2026-11-19", lv: "HS", t1: "Belton", s1: 14, t2: "South Oak Cliff", s2: 57, note: "5A-II area round", where: "Waco ISD Stadium" },
        { d: "2026-11-19", lv: "HS", t1: "Axtell", s1: 16, t2: "De Leon", s2: 28, note: "2A-I area round", where: "Dublin" },
        { d: "2026-11-14", lv: "College", t1: "UMHB", s1: 13, t2: "Hardin-Simmons", s2: 3, note: "Clinched ASC title", where: "Crusader Stadium, Belton" },
        { d: "2026-11-14", lv: "College", t1: "Baylor", s1: 7, t2: "No. 10 BYU", s2: 28 }
      ],
      up: [
        { d: "2026-11-21", lv: "College", t1: "Baylor", t2: "Texas Tech", time: "2:30 p.m.", where: "McLane Stadium, Waco", note: "Senior Day" },
        { d: "2026-11-28", lv: "College", t1: "UMHB", t2: "Trinity", time: "1 p.m.", where: "Crusader Stadium, Belton", note: "NCAA D-III playoffs, 2nd round" },
        { d: "2026-11-28", lv: "College", t1: "Baylor", t2: "No. 21 Houston", time: "8:30 p.m.", where: "Houston", note: "ESPN2" }
      ]
    },
    {
      k: "volleyball", n: "Volleyball", g: "Girls", season: "August to November", status: "playoffs",
      note: "The UIL state tournament is Nov. 19-21 at the Curtis Culwell Center in Garland. 254 results will be added here.",
      games: [], up: []
    },
    {
      k: "basketball-boys", n: "Boys Basketball", g: "Boys", season: "November to March", status: "season",
      note: "High school season is underway. Area scores are added as schools and local media report them.",
      games: [
        { d: "2026-11-18", lv: "College", t1: "Baylor", s1: 104, t2: "Jackson State", s2: 55, where: "Foster Pavilion, Waco" },
        { d: "2026-11-15", lv: "College", t1: "Baylor", s1: 72, t2: "No. 7 Texas", s2: 75 }
      ],
      up: [
        { d: "2026-11-24", lv: "College", t1: "Baylor", t2: "Alabama", time: "", where: "Las Vegas", note: "Players Era 16 Championship" }
      ]
    },
    {
      k: "basketball-girls", n: "Girls Basketball", g: "Girls", season: "November to March", status: "season",
      note: "High school season is underway. Area scores are added as schools and local media report them.",
      games: [
        { d: "2026-11-15", lv: "College", t1: "Baylor", s1: 100, t2: "East Texas A&M", s2: 66 }
      ],
      up: [
        { d: "2026-11-20", lv: "College", t1: "Baylor", t2: "No. 4 USC", time: "10 p.m.", where: "" },
        { d: "2026-11-22", lv: "College", t1: "Baylor", t2: "Northern Kentucky", time: "2 p.m.", where: "Foster Pavilion, Waco" }
      ]
    },
    { k: "cross-country", n: "Cross Country", g: "Boys & girls", season: "August to November", status: "off", when: "Fall season is complete. Back in August.", games: [], up: [] },
    { k: "band", n: "UIL Marching Band", g: "Boys & girls", season: "Fall (marching), spring (concert)", status: "off", when: "Marching season is wrapping up. Concert and sight-reading results come in the spring.", games: [], up: [] },
    { k: "soccer-boys", n: "Boys Soccer", g: "Boys", season: "January to April", status: "off", when: "Season starts in January.", games: [], up: [] },
    { k: "soccer-girls", n: "Girls Soccer", g: "Girls", season: "January to April", status: "off", when: "Season starts in January.", games: [], up: [] },
    { k: "baseball", n: "Baseball", g: "Boys", season: "February to June", status: "off", when: "Season starts in February.", games: [], up: [] },
    { k: "softball", n: "Softball", g: "Girls", season: "February to June", status: "off", when: "Season starts in February.", games: [], up: [] },
    { k: "track", n: "Track & Field", g: "Boys & girls", season: "February to May", status: "off", when: "Season starts in February.", games: [], up: [] }
  ]
};
