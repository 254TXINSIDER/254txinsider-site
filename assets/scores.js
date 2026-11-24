// 254 Scoreboard data. Updated by the daily update. Powers https://254txinsider.com/scoreboard/
// sport: { k, n (name), g ("Boys" | "Girls" | "Boys & girls"), season (text), status ("playoffs" | "season" | "off"), when (shown when off), note,
//   tracker: { round, next, alive: [{ t, c, r, n }], out: [{ t, c, r, n }] }   (playoffs only)
//   games: [{ d, lv ("HS" | "College"), t1, s1, t2, s2, note, where }]          (finals; t1 = the 254 team)
//   up:    [{ d, lv, t1, t2, time, where, note }] }                            (upcoming)
window.SCORES = {
  updated: "2026-11-24",
  sports: [
    {
      "k": "football",
      "n": "Football",
      "g": "Boys",
      "season": "August to December",
      "status": "playoffs",
      "note": "UIL regional games are Friday, Nov. 27. Lorena and Cameron Yoe meet in an all-254 regional at 7:30 p.m. at Eagle Stadium in Salado (per KWTX's Nov. 23 slate). Tarleton State is the No. 2 FCS seed with a bye; UMHB hosts Trinity Nov. 28.",
      "tracker": {
        "round": "Regional round (Friday, Nov. 27)",
        "next": "Following round, first week of December",
        "alive": [
          {
            "t": "La Vega",
            "c": "4A-II",
            "r": "12-0",
            "n": "Regional: vs. Wimberley (11-0), Fri. Nov. 27, 7 p.m., The Pfield, Pflugerville"
          },
          {
            "t": "Robinson",
            "c": "4A-II",
            "r": "10-2",
            "n": "Regional: vs. Brownwood (7-5), Fri. Nov. 27, 7 p.m., Wildcat Stadium, Godley"
          },
          {
            "t": "Stephenville",
            "c": "4A-I",
            "r": "12-0",
            "n": "Regional: vs. Bay City (11-1), Fri. Nov. 27, 2 p.m., Hutto Memorial Stadium (per Dave Campbell's)"
          },
          {
            "t": "Lorena",
            "c": "3A-I",
            "r": "10-2",
            "n": "Regional: vs. Cameron Yoe (11-1), Fri. Nov. 27, 7:30 p.m., Eagle Stadium, Salado"
          },
          {
            "t": "Cameron Yoe",
            "c": "3A-I",
            "r": "11-1",
            "n": "Regional: vs. Lorena (10-2), Fri. Nov. 27, 7:30 p.m., Eagle Stadium, Salado"
          },
          {
            "t": "Whitney",
            "c": "3A-I",
            "r": "11-1",
            "n": "Regional: vs. Gunter (11-1), Fri. Nov. 27, 1 p.m., Pennington Field, Bedford"
          },
          {
            "t": "Rosebud-Lott",
            "c": "2A-I",
            "r": "11-1",
            "n": "Regional: vs. Shiner (12-0), Fri. Nov. 27, 3 p.m., House Park, Austin"
          },
          {
            "t": "Goldthwaite",
            "c": "2A-II",
            "r": "12-0",
            "n": "Regional: vs. Santo, Fri. Nov. 27, 7 p.m., Cervetto Stadium, Dublin"
          },
          {
            "t": "Bremond",
            "c": "2A-II",
            "r": "12-0",
            "n": "Regional: vs. Junction (10-2), Fri. Nov. 27, 7 p.m., Gupton Stadium, Cedar Park"
          },
          {
            "t": "Aquilla",
            "c": "6-Man D-I",
            "r": "12-0",
            "n": "Regional: vs. Union Hill (12-0), Fri. Nov. 27, 7 p.m., site TBA"
          },
          {
            "t": "Mount Calm",
            "c": "6-Man D-II",
            "r": "11-1",
            "n": "Regional: vs. Ladonia Fannindel (9-2), Fri. Nov. 27, 7 p.m., Coolidge Yellow Jacket Athletic Complex"
          }
        ],
        "out": [
          {
            "t": "Waco Valor Prep",
            "c": "TAPPS 6-Man D-II",
            "r": "",
            "n": "STATE CHAMPION: beat Keller Harvest 68-44 for a second straight title"
          },
          {
            "t": "Central Texas Christian (Temple)",
            "c": "TAPPS 11-Man D-IV",
            "r": "9-3",
            "n": "Lost 55-22 to Dallas First Baptist, state final"
          },
          {
            "t": "China Spring",
            "c": "4A-I",
            "r": "4-8",
            "n": "Lost 36-12 to Stafford, area round"
          },
          {
            "t": "Crawford",
            "c": "2A-II",
            "r": "",
            "n": "Lost 46-23 to Wellington, area round"
          },
          {
            "t": "San Saba",
            "c": "2A-I",
            "r": "",
            "n": "Lost 55-3 to Muenster, area round"
          },
          {
            "t": "Oglesby",
            "c": "6-Man D-I",
            "r": "",
            "n": "Lost 100-86 to Union Hill, area round"
          },
          {
            "t": "Belton",
            "c": "5A-II",
            "r": "8-4",
            "n": "Lost 57-14 to South Oak Cliff, area round"
          },
          {
            "t": "Axtell",
            "c": "2A-I",
            "r": "",
            "n": "Lost 28-16 to De Leon, area round"
          },
          {
            "t": "Harker Heights",
            "c": "",
            "r": "",
            "n": "Lost 31-27 to Red Oak, bi-district"
          },
          {
            "t": "Killeen Ellison",
            "c": "",
            "r": "",
            "n": "Lost 31-21 to Midlothian Heritage, bi-district"
          },
          {
            "t": "Lake Belton",
            "c": "",
            "r": "",
            "n": "Lost 55-0 to North Crowley, bi-district"
          }
        ]
      },
      "games": [
        {
          "d": "2026-11-21",
          "lv": "College",
          "t1": "Tarleton State",
          "s1": 31,
          "t2": "North Alabama",
          "s2": 24,
          "note": "Finished 12-0, outright UAC champion; FCS bracket revealed Nov. 22 on ESPNU",
          "where": "Florence, Ala."
        },
        {
          "d": "2026-11-21",
          "lv": "College",
          "t1": "Baylor",
          "s1": 10,
          "t2": "No. 12 Texas Tech",
          "s2": 20,
          "note": "Senior Day; Baylor 6-5",
          "where": "McLane Stadium, Waco"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "La Vega",
          "s1": 56,
          "t2": "Geronimo Navarro",
          "s2": 7,
          "note": "4A-II area round",
          "where": "Crusader Stadium, Belton"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Robinson",
          "s1": 31,
          "t2": "Rockport-Fulton",
          "s2": 21,
          "note": "4A-II area round",
          "where": "Gustafson Stadium, San Antonio"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Lorena",
          "s1": 50,
          "t2": "Diboll",
          "s2": 28,
          "note": "3A-I area round",
          "where": "Madisonville"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Cameron Yoe",
          "s1": 50,
          "t2": "Orangefield",
          "s2": 48,
          "note": "3A-I area round",
          "where": "Houston"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "China Spring",
          "s1": 12,
          "t2": "Stafford",
          "s2": 36,
          "note": "4A-I area round",
          "where": "Giddings"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Rosebud-Lott",
          "s1": 67,
          "t2": "Flatonia",
          "s2": 35,
          "note": "2A-I area round",
          "where": "Manor"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Goldthwaite",
          "s1": 70,
          "t2": "Haskell",
          "s2": 38,
          "note": "2A-II area round",
          "where": "San Angelo"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Aquilla",
          "s1": 84,
          "t2": "Medina",
          "s2": 72,
          "note": "6-man D-I area round",
          "where": "Priddy"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Mount Calm",
          "s1": 53,
          "t2": "Runge",
          "s2": 7,
          "note": "6-man D-II area round",
          "where": "Bartlett"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Waco Valor Prep",
          "s1": 68,
          "t2": "Keller Harvest",
          "s2": 44,
          "note": "TAPPS 6-man D-II state final",
          "where": "Rocket Field, Robinson"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Central Texas Christian",
          "s1": 22,
          "t2": "Dallas First Baptist",
          "s2": 55,
          "note": "TAPPS D-IV state final",
          "where": "Waco"
        },
        {
          "d": "2026-11-19",
          "lv": "HS",
          "t1": "Bremond",
          "s1": 71,
          "t2": "Three Rivers",
          "s2": 21,
          "note": "2A-II area round"
        },
        {
          "d": "2026-11-19",
          "lv": "HS",
          "t1": "Belton",
          "s1": 14,
          "t2": "South Oak Cliff",
          "s2": 57,
          "note": "5A-II area round",
          "where": "Waco ISD Stadium"
        }
      ],
      "up": [
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Stephenville",
          "t2": "Bay City",
          "time": "2 p.m.",
          "where": "Hutto Memorial Stadium",
          "note": "4A-I regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Whitney",
          "t2": "Gunter",
          "time": "1 p.m.",
          "where": "Pennington Field, Bedford",
          "note": "3A-I regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Rosebud-Lott",
          "t2": "Shiner",
          "time": "3 p.m.",
          "where": "House Park, Austin",
          "note": "2A-I regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "La Vega",
          "t2": "Wimberley",
          "time": "7 p.m.",
          "where": "The Pfield, Pflugerville",
          "note": "4A-II regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Robinson",
          "t2": "Brownwood",
          "time": "7 p.m.",
          "where": "Wildcat Stadium, Godley",
          "note": "4A-II regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Lorena",
          "t2": "Cameron Yoe",
          "time": "7:30 p.m.",
          "where": "Eagle Stadium, Salado",
          "note": "3A-I regional, all-254"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Bremond",
          "t2": "Junction",
          "time": "7 p.m.",
          "where": "Gupton Stadium, Cedar Park",
          "note": "2A-II regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Goldthwaite",
          "t2": "Santo",
          "time": "7 p.m.",
          "where": "Cervetto Stadium, Dublin",
          "note": "2A-II regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Aquilla",
          "t2": "Union Hill",
          "time": "7 p.m.",
          "where": "Site TBA",
          "note": "6-man D-I regional"
        },
        {
          "d": "2026-11-27",
          "lv": "HS",
          "t1": "Mount Calm",
          "t2": "Ladonia Fannindel",
          "time": "7 p.m.",
          "where": "Coolidge",
          "note": "6-man D-II regional"
        },
        {
          "d": "2026-11-28",
          "lv": "College",
          "t1": "UMHB",
          "t2": "Trinity",
          "time": "1 p.m.",
          "where": "Crusader Stadium, Belton",
          "note": "NCAA D-III playoffs, 2nd round; ESPN+"
        },
        {
          "d": "2026-11-28",
          "lv": "College",
          "t1": "Baylor",
          "t2": "No. 17 Houston",
          "time": "8:30 p.m.",
          "where": "TDECU Stadium, Houston",
          "note": "ESPN2"
        }
      ]
    },
    {
      "k": "volleyball",
      "n": "Volleyball",
      "g": "Girls",
      "season": "August to November",
      "status": "season",
      "note": "UIL season is over: Clifton won the 3A Division II state title Nov. 20 and Salado was 4A Division I runner-up. Baylor (17-9) closes its regular season this week.",
      "games": [
        {
          "d": "2026-11-22",
          "lv": "College",
          "t1": "Baylor",
          "s1": 2,
          "t2": "Arizona State",
          "s2": 3,
          "note": "Baylor 17-9, 9-7 Big 12"
        },
        {
          "d": "2026-11-20",
          "lv": "College",
          "t1": "Baylor",
          "s1": 3,
          "t2": "Iowa State",
          "s2": 2
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Clifton",
          "s1": 3,
          "t2": "Wall",
          "s2": 0,
          "note": "3A-II state final: 25-21, 25-23, 25-19. State champion",
          "where": "Curtis Culwell Center, Garland"
        },
        {
          "d": "2026-11-20",
          "lv": "HS",
          "t1": "Salado",
          "s1": 0,
          "t2": "Decatur",
          "s2": 3,
          "note": "4A-I state final: 23-25, 21-25, 21-25",
          "where": "Curtis Culwell Center, Garland"
        }
      ],
      "up": [
        {
          "d": "2026-11-25",
          "lv": "College",
          "t1": "Baylor",
          "t2": "West Virginia",
          "time": "2 p.m.",
          "where": "Morgantown, W.Va.",
          "note": "ESPN+"
        },
        {
          "d": "2026-11-27",
          "lv": "College",
          "t1": "Baylor",
          "t2": "Cincinnati",
          "time": "1 p.m.",
          "where": "Cincinnati",
          "note": "ESPN+; regular-season finale"
        }
      ]
    },
    {
      "k": "basketball-boys",
      "n": "Boys Basketball",
      "g": "Boys",
      "season": "November to March",
      "status": "season",
      "note": "High school season is underway. Area scores are added as schools and local media report them.",
      "games": [
        {
          "d": "2026-11-22",
          "lv": "College",
          "t1": "UMHB",
          "s1": 87,
          "t2": "Aurora",
          "s2": 80,
          "where": "Aurora, Ill."
        },
        {
          "d": "2026-11-19",
          "lv": "College",
          "t1": "Tarleton State",
          "s1": 51,
          "t2": "No. 18 USC",
          "s2": 96,
          "where": "Los Angeles",
          "note": "Tarleton 4-2"
        },
        {
          "d": "2026-11-18",
          "lv": "College",
          "t1": "Baylor",
          "s1": 104,
          "t2": "Jackson State",
          "s2": 55,
          "where": "Foster Pavilion, Waco"
        },
        {
          "d": "2026-11-15",
          "lv": "College",
          "t1": "Baylor",
          "s1": 72,
          "t2": "No. 7 Texas",
          "s2": 75
        }
      ],
      "up": [
        {
          "d": "2026-11-24",
          "lv": "College",
          "t1": "Baylor",
          "t2": "Alabama",
          "time": "9 p.m.",
          "where": "Las Vegas",
          "note": "Players Era"
        },
        {
          "d": "2026-11-24",
          "lv": "College",
          "t1": "UMHB",
          "t2": "UW-Stevens Point",
          "time": "6 p.m.",
          "where": "Stevens Point, Wis."
        },
        {
          "d": "2026-11-24",
          "lv": "College",
          "t1": "Tarleton State",
          "t2": "Weber State",
          "time": "6 p.m.",
          "where": "Ogden, Utah",
          "note": "ESPN+"
        },
        {
          "d": "2026-11-26",
          "lv": "College",
          "t1": "Baylor",
          "t2": "Gonzaga or Kansas State",
          "time": "5 or 10:30 p.m.",
          "where": "Las Vegas",
          "note": "Players Era"
        },
        {
          "d": "2026-11-29",
          "lv": "College",
          "t1": "UMHB",
          "t2": "Texas Lutheran",
          "time": "2 p.m.",
          "where": "Seguin"
        },
        {
          "d": "2026-11-30",
          "lv": "College",
          "t1": "UMHB",
          "t2": "Hendrix",
          "time": "6 p.m.",
          "where": "Belton"
        }
      ]
    },
    {
      "k": "basketball-girls",
      "n": "Girls Basketball",
      "g": "Girls",
      "season": "November to March",
      "status": "season",
      "note": "High school season is underway. Area scores are added as schools and local media report them.",
      "games": [
        {
          "d": "2026-11-22",
          "lv": "College",
          "t1": "Baylor",
          "s1": 96,
          "t2": "Northern Kentucky",
          "s2": 42,
          "where": "Foster Pavilion, Waco"
        },
        {
          "d": "2026-11-20",
          "lv": "College",
          "t1": "Baylor",
          "s1": 69,
          "t2": "USC",
          "s2": 78,
          "where": "Intuit Dome, Inglewood, Calif."
        },
        {
          "d": "2026-11-19",
          "lv": "College",
          "t1": "Tarleton State",
          "s1": 58,
          "t2": "Louisiana",
          "s2": 63,
          "where": "Away",
          "note": "Tarleton 2-3"
        },
        {
          "d": "2026-11-15",
          "lv": "College",
          "t1": "Baylor",
          "s1": 100,
          "t2": "East Texas A&M",
          "s2": 66
        }
      ],
      "up": [
        {
          "d": "2026-11-27",
          "lv": "College",
          "t1": "Baylor",
          "t2": "Penn State",
          "time": "4:30 p.m.",
          "where": "Paradise Jam",
          "note": "Paradise Jam"
        },
        {
          "d": "2026-11-28",
          "lv": "College",
          "t1": "Baylor",
          "t2": "Seton Hall or South Florida",
          "time": "TBA",
          "where": "Paradise Jam"
        }
      ]
    },
    {
      "k": "cross-country",
      "n": "Cross Country",
      "g": "Boys & girls",
      "season": "August to November",
      "status": "off",
      "when": "Fall season is complete. Back in August.",
      "games": [],
      "up": []
    },
    {
      "k": "band",
      "n": "UIL Marching Band",
      "g": "Boys & girls",
      "season": "Fall (marching), spring (concert)",
      "status": "off",
      "when": "Marching season is wrapping up. Concert and sight-reading results come in the spring.",
      "games": [],
      "up": []
    },
    {
      "k": "soccer-boys",
      "n": "Boys Soccer",
      "g": "Boys",
      "season": "January to April",
      "status": "off",
      "when": "Season starts in January.",
      "games": [],
      "up": []
    },
    {
      "k": "soccer-girls",
      "n": "Girls Soccer",
      "g": "Girls",
      "season": "January to April",
      "status": "off",
      "when": "Season starts in January.",
      "games": [],
      "up": []
    },
    {
      "k": "baseball",
      "n": "Baseball",
      "g": "Boys",
      "season": "February to June",
      "status": "off",
      "when": "Season starts in February.",
      "games": [],
      "up": []
    },
    {
      "k": "softball",
      "n": "Softball",
      "g": "Girls",
      "season": "February to June",
      "status": "off",
      "when": "Season starts in February.",
      "games": [],
      "up": []
    },
    {
      "k": "track",
      "n": "Track & Field",
      "g": "Boys & girls",
      "season": "February to May",
      "status": "off",
      "when": "Season starts in February.",
      "games": [],
      "up": []
    }
  ]
};
