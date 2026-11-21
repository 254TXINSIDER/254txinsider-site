// 254 Scoreboard data. Updated by the daily update. Powers https://254txinsider.com/scoreboard/
// sport: { k, n (name), g ("Boys" | "Girls" | "Boys & girls"), season (text), status ("playoffs" | "season" | "off"), when (shown when off), note,
//   tracker: { round, next, alive: [{ t, c, r, n }], out: [{ t, c, r, n }] }   (playoffs only)
//   games: [{ d, lv ("HS" | "College"), t1, s1, t2, s2, note, where }]          (finals; t1 = the 254 team)
//   up:    [{ d, lv, t1, t2, time, where, note }] }                            (upcoming)
window.SCORES = {
  updated: "2026-11-21",
  sports: [
    {
      k: "football", n: "Football", g: "Boys", season: "August to December", status: "playoffs",
      note: "UIL regional round is Nov. 26-28. Dates, times and sites were still to be announced as of Nov. 21; check with each school. Lorena and Cameron Yoe meet in an all-254 regional.",
      tracker: {
        round: "Regional round (Nov. 26-28)", next: "Following round, first week of December",
        alive: [
          { t: "La Vega", c: "4A-II", r: "12-0", n: "Regional: vs. Wimberley (11-0), date, time and site TBA" },
          { t: "Robinson", c: "4A-II", r: "10-2", n: "Regional: vs. Brownwood (7-5), date, time and site TBA" },
          { t: "Stephenville", c: "4A-I", r: "12-0", n: "Regional: vs. Huffman Hargrave, date, time and site TBA" },
          { t: "Lorena", c: "3A-I", r: "10-2", n: "Regional: vs. Cameron Yoe (11-1), date, time and site TBA" },
          { t: "Cameron Yoe", c: "3A-I", r: "11-1", n: "Regional: vs. Lorena (10-2), date, time and site TBA" },
          { t: "Whitney", c: "3A-I", r: "", n: "Regional: vs. Gunter, date, time and site TBA" },
          { t: "Rosebud-Lott", c: "2A-I", r: "11-1", n: "Regional: vs. Shiner (12-0), date, time and site TBA" },
          { t: "Goldthwaite", c: "2A-II", r: "12-0", n: "Regional: vs. Santo (11-1), date, time and site TBA" },
          { t: "Bremond", c: "2A-II", r: "12-0", n: "Regional: vs. Junction, date, time and site TBA" },
          { t: "Aquilla", c: "6-Man D-I", r: "12-0", n: "Regional: vs. Union Hill (12-0), date, time and site TBA" },
          { t: "Mount Calm", c: "6-Man D-II", r: "", n: "Regional: vs. Ladonia Fannindel, date, time and site TBA" }
        ],
        out: [
          { t: "Waco Valor Prep", c: "TAPPS 6-Man D-II", r: "", n: "STATE CHAMPION: beat Keller Harvest 68-44 for a second straight title" },
          { t: "Central Texas Christian (Temple)", c: "TAPPS 11-Man D-IV", r: "9-3", n: "Lost 55-22 to Dallas First Baptist, state final" },
          { t: "China Spring", c: "4A-I", r: "4-8", n: "Lost 36-12 to Stafford, area round" },
          { t: "Crawford", c: "2A-II", r: "", n: "Lost 46-23 to Wellington, area round" },
          { t: "San Saba", c: "2A-I", r: "", n: "Lost 55-3 to Muenster, area round" },
          { t: "Oglesby", c: "6-Man D-I", r: "", n: "Lost 100-86 to Union Hill, area round" },
          { t: "Belton", c: "5A-II", r: "8-4", n: "Lost 57-14 to South Oak Cliff, area round" },
          { t: "Axtell", c: "2A-I", r: "", n: "Lost 28-16 to De Leon, area round" },
          { t: "Harker Heights", c: "", r: "", n: "Lost 31-27 to Red Oak, bi-district" },
          { t: "Killeen Ellison", c: "", r: "", n: "Lost 31-21 to Midlothian Heritage, bi-district" },
          { t: "Lake Belton", c: "", r: "", n: "Lost 55-0 to North Crowley, bi-district" }
        ]
      },
      games: [
        { d: "2026-11-20", lv: "HS", t1: "La Vega", s1: 56, t2: "Geronimo Navarro", s2: 7, note: "4A-II area round", where: "Crusader Stadium, Belton" },
        { d: "2026-11-20", lv: "HS", t1: "Robinson", s1: 31, t2: "Rockport-Fulton", s2: 21, note: "4A-II area round", where: "Gustafson Stadium, San Antonio" },
        { d: "2026-11-20", lv: "HS", t1: "Lorena", s1: 50, t2: "Diboll", s2: 28, note: "3A-I area round", where: "Madisonville" },
        { d: "2026-11-20", lv: "HS", t1: "Cameron Yoe", s1: 50, t2: "Orangefield", s2: 48, note: "3A-I area round", where: "Houston" },
        { d: "2026-11-20", lv: "HS", t1: "China Spring", s1: 12, t2: "Stafford", s2: 36, note: "4A-I area round", where: "Giddings" },
        { d: "2026-11-20", lv: "HS", t1: "Rosebud-Lott", s1: 67, t2: "Flatonia", s2: 35, note: "2A-I area round", where: "Manor" },
        { d: "2026-11-20", lv: "HS", t1: "Goldthwaite", s1: 70, t2: "Haskell", s2: 38, note: "2A-II area round", where: "San Angelo" },
        { d: "2026-11-20", lv: "HS", t1: "Aquilla", s1: 84, t2: "Medina", s2: 72, note: "6-man D-I area round", where: "Priddy" },
        { d: "2026-11-20", lv: "HS", t1: "Mount Calm", s1: 53, t2: "Runge", s2: 7, note: "6-man D-II area round", where: "Bartlett" },
        { d: "2026-11-20", lv: "HS", t1: "Waco Valor Prep", s1: 68, t2: "Keller Harvest", s2: 44, note: "TAPPS 6-man D-II state final", where: "Rocket Field, Robinson" },
        { d: "2026-11-20", lv: "HS", t1: "Central Texas Christian", s1: 22, t2: "Dallas First Baptist", s2: 55, note: "TAPPS D-IV state final", where: "Waco" },
        { d: "2026-11-19", lv: "HS", t1: "Belton", s1: 14, t2: "South Oak Cliff", s2: 57, note: "5A-II area round", where: "Waco ISD Stadium" }
      ],
      up: [
        { d: "2026-11-21", lv: "College", t1: "Baylor", t2: "Texas Tech", time: "2:30 p.m.", where: "McLane Stadium, Waco", note: "Senior Day" },
        { d: "2026-11-21", lv: "College", t1: "Tarleton State", t2: "North Alabama", time: "3 p.m.", where: "Florence, Ala.", note: "Regular-season finale; FCS playoff field announced Sunday" },
        { d: "2026-11-28", lv: "College", t1: "UMHB", t2: "Trinity", time: "Check UMHB for time", where: "Site to be confirmed", note: "NCAA D-III playoffs, 2nd round; ESPN+" },
        { d: "2026-11-28", lv: "College", t1: "Baylor", t2: "No. 21 Houston", time: "8:30 p.m.", where: "Houston", note: "ESPN2" }
      ]
    },
    {
      k: "volleyball", n: "Volleyball", g: "Girls", season: "August to November", status: "playoffs",
      note: "Clifton won the 3A Division II state title Nov. 20 in Garland, the school's first state title in any team sport. Salado finished 4A Division I state runner-up.",
      games: [
        { d: "2026-11-20", lv: "HS", t1: "Clifton", s1: 3, t2: "Wall", s2: 0, note: "3A-II state final: 25-21, 25-23, 25-19. State champion", where: "Curtis Culwell Center, Garland" },
        { d: "2026-11-20", lv: "HS", t1: "Salado", s1: 0, t2: "Decatur", s2: 3, note: "4A-I state final: 23-25, 21-25, 21-25", where: "Curtis Culwell Center, Garland" }
      ], up: []
    },
    {
      k: "basketball-boys", n: "Boys Basketball", g: "Boys", season: "November to March", status: "season",
      note: "High school season is underway. Area scores are added as schools and local media report them.",
      games: [
        { d: "2026-11-18", lv: "College", t1: "Baylor", s1: 104, t2: "Jackson State", s2: 55, where: "Foster Pavilion, Waco" },
        { d: "2026-11-15", lv: "College", t1: "Baylor", s1: 72, t2: "No. 7 Texas", s2: 75 }
      ],
      up: [
        { d: "2026-11-22", lv: "College", t1: "UMHB", t2: "Aurora", time: "6:45 p.m.", where: "Away" },
        { d: "2026-11-24", lv: "College", t1: "Baylor", t2: "Alabama", time: "", where: "Las Vegas", note: "Players Era 16 Championship" },
        { d: "2026-11-24", lv: "College", t1: "UMHB", t2: "UW-Stevens Point", time: "6 p.m.", where: "Away" }
      ]
    },
    {
      k: "basketball-girls", n: "Girls Basketball", g: "Girls", season: "November to March", status: "season",
      note: "High school season is underway. Area scores are added as schools and local media report them.",
      games: [
        { d: "2026-11-20", lv: "College", t1: "Baylor", s1: 69, t2: "USC", s2: 78, where: "Intuit Dome, Inglewood, Calif." },
        { d: "2026-11-15", lv: "College", t1: "Baylor", s1: 100, t2: "East Texas A&M", s2: 66 }
      ],
      up: [
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
