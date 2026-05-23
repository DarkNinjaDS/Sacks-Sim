/* ─────────────────────────────────────────
   IPL SIM — app.js
   ───────────────────────────────────────── */

// ===================================================
//   STATIC DATA  (teams, venues, colors)
// ===================================================

const TEAM_COLORS = {
  // User Teams
  aqua: '#00adbf', bhukla: '#a52a2a', patake: '#6a0dad', 
  anuj: '#006400', pranav: '#ff6600',
  // CPU/Group Teams
  southafrica: '#007a4d', rcbat: '#e01f2b', thehundred: '#00b2a9',
  australia:   '#f9be00', miat:   '#004c93', hydat:      '#f26522',
  newzealand: '#555555', kkrat: '#3a225d', sa20: '#ef3340',
  england: '#00247d', rrat: '#ea1e8c', punat: '#d71921',
  india: '#1a237e', cskat: '#f7a721', delat: '#3d5afe',
};

const TEAM_DISPLAY = {
  // User Teams
  aqua: 'Aqua Rehman Bangal', 
  bhukla: 'Major Bhukla', 
  patake: 'SP Doxxers', 
  anuj: 'Asad Lahori', 
  pranav: 'Agenda Doval',
  // CPU/Group Teams
  southafrica: 'South Africa', rcbat: 'RCB AT', thehundred: 'The Hundred',
  australia: 'Australia', miat: 'MI AT', hydat: 'HYD AT',
  newzealand: 'New Zealand', kkrat: 'KKR AT', sa20: 'SA20',
  england: 'England', rrat: 'RR AT', punat: 'PUN AT',
  india: 'India', cskat: 'CSK AT', delat: 'DEL AT',
};

// ===================================================
//   TOURNAMENT GROUPS
// ===================================================

const TOURNAMENT_GROUPS = {
  'Group A': ['aqua', 'southafrica', 'rcbat', 'thehundred'],
  'Group B': ['bhukla', 'australia', 'miat', 'hydat'],
  'Group C': ['patake', 'newzealand', 'kkrat', 'sa20'],
  'Group D': ['anuj', 'england', 'rrat', 'punat'],
  'Group E': ['pranav', 'india', 'cskat', 'delat'],
};

// Reverse map: team key → group name
const TEAM_TO_GROUP = {};
Object.entries(TOURNAMENT_GROUPS).forEach(([group, teams]) => {
  teams.forEach(t => { TEAM_TO_GROUP[t] = group; });
});


const STADIUMS = {
  'MCG, Melbourne':              { pace:1.1, spin:0.9, outfield:1.0, dew:0.10, pitch:'balanced' },
  'Shere-e-Bangla, Mirpur':      { pace:0.7, spin:1.4, outfield:0.8, dew:0.85, pitch:'green'    },
  'HPCA, Dharamshala':           { pace:1.3, spin:0.7, outfield:1.1, dew:0.10, pitch:'dusty'    },
  'SKY Stadium, Wellington':     { pace:1.2, spin:0.8, outfield:1.0, dew:0.20, pitch:'green'    },
  'Eden Gardens, Kolkata':       { pace:0.9, spin:1.2, outfield:1.2, dew:0.65, pitch:'dusty'    },
  'Lords, London':               { pace:1.2, spin:0.9, outfield:1.0, dew:0.10, pitch:'green'    },
  'Wanderers, Johannesburg':     { pace:1.4, spin:0.6, outfield:1.1, dew:0.10, pitch:'green'    },
  'Gaddafi, Lahore':             { pace:0.8, spin:1.3, outfield:1.2, dew:0.50, pitch:'balanced' },
  'Optus, Perth':                { pace:1.5, spin:0.5, outfield:1.1, dew:0.05, pitch:'green'    },
  "Queen's Park Oval, Trinidad": { pace:0.7, spin:1.3, outfield:0.9, dew:0.40, pitch:'dusty'    },
  'DY Patil, Navi Mumbai':       { pace:1.0, spin:0.9, outfield:1.3, dew:0.75, pitch:'balanced' },
  'Wankhede, Mumbai':            { pace:1.1, spin:0.8, outfield:1.4, dew:0.80, pitch:'balanced' },
  'Sheikh Zayed, Abu Dhabi':     { pace:1.1, spin:1.0, outfield:1.0, dew:0.15, pitch:'balanced' },
  'Kabul Intl Stadium, Kabul':   { pace:0.8, spin:1.4, outfield:1.1, dew:0.10, pitch:'dusty'    },
  'SCS, Sharjah':                { pace:0.8, spin:1.2, outfield:1.5, dew:0.25, pitch:'dusty'    },
  'NMS, Ahmedabad':              { pace:1.2, spin:0.9, outfield:1.1, dew:0.35, pitch:'balanced' },
  'Arun Jaitley, Delhi':         { pace:0.8, spin:1.3, outfield:1.1, dew:0.50, pitch:'dusty'    },
  'The Village, Dublin':         { pace:1.3, spin:0.7, outfield:0.9, dew:0.20, pitch:'green'    },
};

// Pre-defined 11-player rosters (keys must match PLAYER_DB names)
const TEAM_ROSTERS = {
    // Group A
    "aqua": [
        "Travis Head", "Abhishek Sharma", "Heinrich Klaasen", "Nicholas Pooran", "Mitchell Marsh",
        "Rishabh Pant", "Wanindu Hasaranga", "Harshal Patel", "Mohammad Shami", "Pat Cummins",
        "Avesh Khan", "Ishan Kishan", "Liam Livingstone", "Mohsin Khan", "Aiden Markram"
    ],
    "southafrica": [
        "Aiden Markram", "Quinton de Kock", "Ryan Rickelton", "Dewald Brevis", "Tristan Stubbs",
        "David Miller", "Marco Jansen", "George Linde", "Keshav Maharaj", "Kagiso Rabada",
        "Anrich Nortje", "Jason Smith", "Corbin Bosch", "Kwena Maphaka", "Lungi Ngidi"
    ],
    "rcbat": [
        "Virat Kohli", "Chris Gayle", "Devdutt Padikkal", "AB de Villiers", "Glenn Maxwell",
        "Dinesh Karthik", "Jitesh Sharma", "Harshal Patel", "Anil Kumble", "Josh Hazlewood",
        "Yuzvendra Chahal", "Faf du Plessis", "Rajat Patidar", "Wanindu Hasaranga", "Mohammed Siraj"
    ],
    "thehundred": [
        "Phil Salt", "Will Jacks", "Jos Buttler", "Jordan Cox", "Harry Brook",
        "Liam Livingstone", "Sam Curran", "Rashid Khan", "Adil Rashid", "Adam Milne",
        "Tymal Mills", "Ben Duckett", "James Vince", "Benny Howell", "Chris Jordan"
    ],

    // Group B
    "bhukla": [
        "Jordan Cox", "Phil Salt", "Virat Kohli", "Ruturaj Gaikwad", "Sanju Samson",
        "Shivam Dube", "Josh Hazlewood", "Noor Ahmad", "Khaleel Ahmed", "Bhuvneshwar Kumar",
        "Krunal Pandya", "Jacob Duffy", "Rajat Patidar", "Tim David", "Matt Short"
    ],
    "australia": [
        "Travis Head", "Mitchell Marsh", "Josh Inglis", "Cameron Green", "Tim David",
        "Marcus Stoinis", "Glenn Maxwell", "Ben Dwarshuis", "Nathan Ellis", "Xavier Bartlett",
        "Adam Zampa", "Matt Renshaw", "Cooper Connolly", "Matthew Kuhnemann", "Steve Smith"
    ],
    "miat": [
        "Rohit Sharma", "Quinton de Kock", "Suryakumar Yadav", "Ishan Kishan", "Hardik Pandya",
        "Kieron Pollard", "Krunal Pandya", "Harbhajan Singh", "Trent Boult", "Jasprit Bumrah",
        "Lasith Malinga", "Sachin Tendulkar", "Tilak Varma", "Rahul Chahar", "Mitchell McClenaghan"
    ],
    "hydat": [
        "David Warner", "Shikhar Dhawan", "Kane Williamson", "Manish Pandey", "Andrew Symonds",
        "Heinrich Klaasen", "Jason Holder", "Rashid Khan", "Bhuvneshwar Kumar", "T. Natarajan",
        "Dale Steyn", "Jonny Bairstow", "Rohit Sharma", "Pragyan Ojha", "RP Singh"
    ],

    // Group C
    "patake": [
        "Tim Seifert", "Shubman Gill", "Sai Sudarshan", "Jos Buttler", "Cameron Green",
        "Rinku Singh", "Sunil Narine", "Rashid Khan", "Jason Holder", "Varun Chakravarthy",
        "Matheesha Pathirana", "Mohammad Siraj", "Finn Allen", "Kagiso Rabada", "Harshit Rana"
    ],
    "newzealand": [
        "Finn Allen", "Tim Seifert", "Rachin Ravindra", "Glenn Phillips", "Daryl Mitchell",
        "Mark Chapman", "James Neesham", "Mitchell Santner", "Kyle Jamieson", "Jacob Duffy",
        "Matt Henry", "Devon Conway", "Cole McConchie", "Ish Sodhi", "Lockie Ferguson"
    ],
    "kkrat": [
        "Chris Lynn", "Sunil Narine", "Gautam Gambhir", "Robin Uthappa", "Rinku Singh",
        "Yusuf Pathan", "Andre Russell", "Piyush Chawla", "Harshit Rana", "Umesh Yadav",
        "Varun Chakravarthy", "Nitish Rana", "Jacques Kallis", "Dinesh Karthik", "Morne Morkel"
    ],
    "sa20": [
        "Ryan Rickelton", "Will Jacks", "Aiden Markram", "Rassie van der Dussen", "Heinrich Klaasen",
        "Tristan Stubbs", "Marco Jansen", "George Linde", "Bjorn Fortuin", "Kagiso Rabada",
        "Ottneil Baartman", "Leus du Plooy", "Dewald Brevis", "Keshav Maharaj", "Anrich Nortje"
    ],

    // Group D
    "anuj": [
        "Yashasvi Jaiswal", "Ryan Rickelton", "Will Jacks", "Suryakumar Yadav", "Tilak Verma",
        "Riyan Parag", "Shimron Hetmyer", "Donovan Ferreria", "Hardik Pandya", "Ravindra Jadeja",
        "Mitchell Santner", "Jasprit Bumrah", "Trent Boult", "Tushar Deshpande", "Ravi Bishnoi"
    ],
    "england": [
        "Phil Salt", "Ben Duckett", "Jos Buttler", "Tom Banton", "Harry Brook",
        "Will Jacks", "Sam Curran", "Liam Dawson", "Jofra Archer", "Adil Rashid",
        "Luke Wood", "Jacob Bethell", "Jamie Overton", "Rehan Ahmed", "Josh Tongue"
    ],
    "rrat": [
        "Jos Buttler", "Yashasvi Jaiswal", "Sanju Samson", "Shane Watson", "Yusuf Pathan",
        "Shimron Hetmyer", "James Faulkner", "Jofra Archer", "Shane Warne", "Yuzvendra Chahal",
        "Siddharth Trivedi", "Ajinkya Rahane", "Riyan Parag", "Shreyas Gopal", "Trent Boult"
    ],
    "punat": [
        "KL Rahul", "Shaun Marsh", "Shreyas Iyer", "Glenn Maxwell", "David Miller",
        "Shashank Singh", "Irfan Pathan", "Axar Patel", "Piyush Chawla", "Arshdeep Singh",
        "Sandeep Sharma", "Mayank Agarwal", "Liam Livingstone", "Ravi Bishnoi", "Mohammed Shami"
    ],

    // Group E
    "pranav": [
        "KL Rahul", "Pathum Nissanka", "Prabhsimran Singh", "Shreyas Iyer", "Cooper Connolly",
        "Shashank Singh", "David Miller", "Tristan Stubbs", "Marcus Stoinis", "Axar Patel",
        "Ben Dwarshuis", "Arshdeep Singh", "T Natarajan", "Kuldeep Yadav", "Yuzvendra Chahal"
    ],
    "india": [
        "Abhishek Sharma", "Ishan Kishan", "Tilak Varma", "Suryakumar Yadav", "Hardik Pandya",
        "Shivam Dube", "Rinku Singh", "Axar Patel", "Arshdeep Singh", "Jasprit Bumrah",
        "Varun Chakravarthy", "Sanju Samson", "Washington Sundar", "Kuldeep Yadav", "Mohammed Siraj"
    ],
    "cskat": [
        "Faf du Plessis", "Ruturaj Gaikwad", "Suresh Raina", "Ambati Rayudu", "MS Dhoni",
        "Ravindra Jadeja", "Albie Morkel", "Dwayne Bravo", "Ravichandran Ashwin", "Deepak Chahar",
        "Mohit Sharma", "Shane Watson", "Shivam Dube", "Imran Tahir", "Matheesha Pathirana"
    ],
    "delat": [
        "Virender Sehwag", "Shikhar Dhawan", "Shreyas Iyer", "Rishabh Pant", "JP Duminy",
        "Tristan Stubbs", "Axar Patel", "Chris Morris", "Amit Mishra", "Kagiso Rabada",
        "Morne Morkel", "David Warner", "Marcus Stoinis", "Kuldeep Yadav", "Ashish Nehra"
    ]
};

// Load custom saved rosters from localStorage on reload
try {
  const savedRosters = JSON.parse(localStorage.getItem('sackssim_rosters'));
  if (savedRosters) {
    Object.assign(TEAM_ROSTERS, savedRosters);
  }
} catch (e) {
  console.warn("Could not load custom rosters", e);
}

// ===================================================
//   PLAYER DATABASE  (populated by fetch)
// ===================================================

let PLAYER_DB = {};   // filled once players.json loads

// ===================================================
//   LOAD PLAYER DATA
// ===================================================

async function loadPlayerData() {
  const statusEl = document.getElementById('dataStatus');
  try {
    const res = await fetch('players.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    PLAYER_DB = await res.json();
    const count = Object.keys(PLAYER_DB).length;
    statusEl.textContent = `✓ ${count} players loaded`;
    statusEl.className = 'data-status ok';
    console.log(`[IPL SIM] Loaded ${count} players from players.json`);
  } catch (err) {
    console.warn('[IPL SIM] Could not load players.json, using built-in fallbacks.', err);
    statusEl.textContent = `⚠ Using built-in player data`;
    statusEl.className = 'data-status error';
    // Inject a small fallback so the sim still works offline
    PLAYER_DB = BUILTIN_FALLBACK;
  }
}

// Minimal fallback used only when players.json isn't available
const BUILTIN_FALLBACK = {
  'Virat Kohli':     { name:'Virat Kohli',     role:'batsman',    bat_rating:95, bowl_rating:20, strike_rate:136.4, bowl_style:'unknown' },
  'Rohit Sharma':    { name:'Rohit Sharma',     role:'batsman',    bat_rating:90, bowl_rating:15, strike_rate:139.0, bowl_style:'unknown' },
  'Jasprit Bumrah':  { name:'Jasprit Bumrah',   role:'bowler',     bat_rating:20, bowl_rating:98, strike_rate:80.0,  bowl_style:'Right-arm Fast' },
  'Phil Salt':       { name:'Phil Salt',        role:'batsman',    bat_rating:95, bowl_rating:0,  strike_rate:175.7, bowl_style:'unknown' },
  'Pat Cummins':     { name:'Pat Cummins',      role:'bowler',     bat_rating:45, bowl_rating:93, strike_rate:109.0, bowl_style:'Right-arm Fast' },
  'Babar Azam':      { name:'Babar Azam',       role:'batsman',    bat_rating:92, bowl_rating:10, strike_rate:127.6, bowl_style:'unknown' },
  'Jos Buttler':     { name:'Jos Buttler',      role:'batsman',    bat_rating:93, bowl_rating:0,  strike_rate:146.4, bowl_style:'unknown' },
  'Glenn Maxwell':   { name:'Glenn Maxwell',    role:'all-rounder',bat_rating:87, bowl_rating:72, strike_rate:156.5, bowl_style:'Off-spin' },
  'Hardik Pandya':   { name:'Hardik Pandya',    role:'all-rounder',bat_rating:80, bowl_rating:75, strike_rate:147.4, bowl_style:'Right-arm Medium' },
  'Shaheen Afridi':  { name:'Shaheen Afridi',   role:'bowler',     bat_rating:30, bowl_rating:91, strike_rate:85.0,  bowl_style:'Left-arm Fast' },
  'Adil Rashid':     { name:'Adil Rashid',      role:'bowler',     bat_rating:38, bowl_rating:81, strike_rate:96.0,  bowl_style:'Leg-spin' },
};

// ===================================================
//   POPULATE SELECTS
// ===================================================

function populateSelects() {
  const t1 = document.getElementById('team1Select');
  const t2 = document.getElementById('team2Select');
  const vs = document.getElementById('venueSelect');

  Object.entries(TEAM_DISPLAY).forEach(([key, name]) => {
    [t1, t2].forEach(sel => {
      const opt = document.createElement('option');
      opt.value = key; opt.textContent = name;
      sel.appendChild(opt);
    });
  });

  Object.keys(STADIUMS).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name; opt.textContent = name;
    vs.appendChild(opt);
  });

  // Sensible defaults
  t1.value = 'anuj';
  t2.value = 'aqua';
  vs.value = 'Eden Gardens, Kolkata';
}

// ===================================================
//   PLAYER HELPERS
// ===================================================

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Returns a Player object, falling back gracefully if name not in DB */
function getPlayer(name) {
  const d = PLAYER_DB[name];
  if (!d) {
    // Attempt case-insensitive match
    const key = Object.keys(PLAYER_DB).find(k => k.toLowerCase() === name.toLowerCase());
    if (key) return buildPlayer(PLAYER_DB[key]);
    // Generic fallback
    return { name, role: 'batsman', bat_rating: 70, bowl_rating: 50, strike_rate: 120, bowl_style: 'unknown' };
  }
  return buildPlayer(d);
}

function buildPlayer(d) {
  return {
    name:         d.name         || d,
    role:         d.role         || 'batsman',
    bat_subtype:  d.bat_subtype  || 'anchor',
    bowl_subtype: d.bowl_subtype || null,
    bat_rating:   d.bat_rating   ?? 70,
    bowl_rating:  d.bowl_rating  ?? 0,
    strike_rate:  d.strike_rate  ?? 120,
    bowl_style:   d.bowl_style   || 'unknown',
  };
}

/** 11-player roster for a team key */
function getTeamPlayers(teamKey) {
  if (TEAM_ROSTERS[teamKey]) return TEAM_ROSTERS[teamKey];

  // Auto-generate a balanced XI from PLAYER_DB for custom teams
  const all = Object.keys(PLAYER_DB);
  return all.sort((a, b) => hashStr(a + teamKey) - hashStr(b + teamKey)).slice(0, 11);
}

// ===================================================
//   PITCH MODIFIERS
// ===================================================

function pitchModifiers(pitchType) {
  return ({
    balanced: { pace:1.00, spin:1.00, outfield:1.0 },
    green:    { pace:1.30, spin:0.70, outfield:1.0 },
    dusty:    { pace:0.70, spin:1.40, outfield:0.9 },
    dead:     { pace:1.00, spin:0.60, outfield:1.4 },
    bouncy:   { pace:1.25, spin:0.80, outfield:1.1 },
  })[pitchType] || { pace:1.0, spin:1.0, outfield:1.0 };
}

// ===================================================
//   CORE BALL SIMULATION  (role-aware, absolute bands)
//
//   Each bat_subtype has FIXED base probability tables that
//   only then get scaled by rating, pitch, and phase.
//   This avoids compounding floats turning every edge case
//   into an anomaly.
//
//   Batsman roles
//   ─────────────
//   basher    — hits from ball 1; high 4/6 chance; acceptable dismissal risk
//   anchor    — settles over first 12 balls (SR starts ~70%, ramps to full)
//   defensive — SR hovers 85-110; very low dismissal risk
//   switcher  — ultra-gritty for first 14 balls (very hard to dismiss), then
//               transforms into a full basher from ball 15 onward
//
//   Pacer roles
//   ──────────────
//   breezer     — peak wicket threat in overs 1-6
//   rattler     — peak wicket threat in overs 7-14
//   executioner — peak wicket threat in overs 15-20
//
//   Spinner roles
//   ──────────────
//   controller — economical, rarely takes wickets
//   trickster  — takes wickets but also gets hit
// ===================================================

function simulateBall(batsman, bowler, opts) {
  const {
    pace, spin, outfield, dew,
    currentOver, totalWickets, inningsRuns,
    consecutiveBoundaries, consecutiveWickets,
    ballsFaced,
  } = opts;

  // ─────────────────────────────────────────────────────
  //  STEP 1 — BASE WICKET / BOUNDARY probabilities
  //           driven entirely by bat_subtype (absolute)
  // ─────────────────────────────────────────────────────
  let baseWicket, baseFour, baseSix, baseDot;

  switch (batsman.bat_subtype) {

    case 'basher':
      // Aggressive from ball 1 — higher boundary chance, accepts more risk
      baseWicket = 0.072;
      baseFour   = 0.170;
      baseSix    = 0.085;
      baseDot    = 0.240;
      break;

    case 'anchor': {
      // Settles in over ~12 balls. Progress goes 0→1 linearly.
      const p = Math.min(ballsFaced / 12, 1.0);
      // At p=0: conservative. At p=1: near-basher levels.
      baseWicket = 0.040 + 0.030 * p;    // 0.040 → 0.070
      baseFour   = 0.090 + 0.075 * p;    // 0.090 → 0.165
      baseSix    = 0.030 + 0.050 * p;    // 0.030 → 0.080
      baseDot    = 0.340 - 0.090 * p;    // 0.340 → 0.250
      break;
    }

    case 'switcher': {
      // Phase 1 (0–14 balls): Gritty defensive mode — very hard to dismiss, low scoring.
      // Phase 2 (15+ balls): Unleashes into full basher mode with increasing aggression.
      if (ballsFaced < 15) {
        // Extremely hard to get out early — tighter than even defensive
        const earlyP = ballsFaced / 14;   // 0 → 1 over the first 14 balls
        baseWicket = 0.020 + 0.010 * earlyP;   // 0.020 → 0.030  (lower than defensive!)
        baseFour   = 0.055 + 0.030 * earlyP;   // 0.055 → 0.085  (very few boundaries)
        baseSix    = 0.008 + 0.012 * earlyP;   // 0.008 → 0.020
        baseDot    = 0.430 - 0.040 * earlyP;   // 0.430 → 0.390  (lots of dots/singles)
      } else {
        // Phase 2: ramps aggressively from ball 15 onward — full basher within ~10 more balls
        const lateP = Math.min((ballsFaced - 15) / 10, 1.0);
        baseWicket = 0.032 + 0.010 * lateP;    // 0.032 → 0.072  (risk increases as they bash)
        baseFour   = 0.110 + 0.060 * lateP;    // 0.110 → 0.170
        baseSix    = 0.040 + 0.045 * lateP;    // 0.040 → 0.085
        baseDot    = 0.320 - 0.080 * lateP;    // 0.320 → 0.240
      }
      break;
    }

    case 'defensive':
      // Compact, composed. Very hard to get out, won't smash.
      baseWicket = 0.028;
      baseFour   = 0.075;
      baseSix    = 0.020;
      baseDot    = 0.400;
      break;

    default:
      baseWicket = 0.060;
      baseFour   = 0.130;
      baseSix    = 0.055;
      baseDot    = 0.300;
  }

  // ─────────────────────────────────────────────────────
  //  STEP 2 — BOWLER ROLE MULTIPLIERS  (phase-specific)
  // ─────────────────────────────────────────────────────
  let wicketMult = 1.0;
  let runMult    = 1.0;  // affects boundaries

  switch (bowler.bowl_subtype) {

    case 'breezer':
      if      (currentOver <= 6)  { wicketMult = 1.70; runMult = 0.85; }
      else if (currentOver <= 14) { wicketMult = 0.75; runMult = 1.05; }
      else                        { wicketMult = 0.60; runMult = 1.10; }
      break;

    case 'rattler':
      if      (currentOver <= 6)  { wicketMult = 0.70; runMult = 1.05; }
      else if (currentOver <= 14) { wicketMult = 1.65; runMult = 0.85; }
      else                        { wicketMult = 0.80; runMult = 1.05; }
      break;

    case 'executioner':
      if      (currentOver <= 6)  { wicketMult = 0.55; runMult = 1.05; }
      else if (currentOver <= 14) { wicketMult = 0.80; runMult = 1.00; }
      else                        { wicketMult = 1.80; runMult = 0.80; }
      break;

    case 'controller':
      // Low wickets, suppressed boundaries — dots and singles
      wicketMult = 0.50;
      runMult    = 0.65;
      break;

    case 'trickster':
      // Wickets AND expensive
      wicketMult = 1.40;
      runMult    = 1.20;
      break;
  }

  // ─────────────────────────────────────────────────────
  //  STEP 3 — RATING INFLUENCE  (modest, not dominant)
  //           keeps skill meaningful but roles stay primary
  // ─────────────────────────────────────────────────────
  // Normalised so average (70) = 1.0, max swing ±25%
  const batSkill  = Math.max(0.75, Math.min(1.25, batsman.bat_rating  / 75));
  const bowlSkill = Math.max(0.75, Math.min(1.25, bowler.bowl_rating  / 75));

  // Higher bat_rating → fewer wickets, more boundaries
  // Higher bowl_rating → more wickets, fewer boundaries
  const ratingWicketMod   = (1 / batSkill) * bowlSkill;
  const ratingBoundaryMod = batSkill * (1 / bowlSkill);

  // ─────────────────────────────────────────────────────
  //  STEP 4 — PITCH ASSIST
  // ─────────────────────────────────────────────────────
  const isSpinner  = /spin|slow|orthodox/i.test(bowler.bowl_style);
  const pitchAssist = isSpinner ? spin : pace;   // e.g. 1.3 for green pitch vs pacer

  // Pitch only affects wickets (1±25%) and boundaries (outfield ±15%)
  const pitchWicketMod   = 0.75 + 0.25 * pitchAssist;   // 0.75–1.25 range typical
  const pitchBoundaryMod = 0.90 + 0.10 * outfield;

  // ─────────────────────────────────────────────────────
  //  STEP 5 — MATCH PHASE
  // ─────────────────────────────────────────────────────
  let phaseWicketMod = 1.0, phaseBoundaryMod = 1.0;
  const isCollapse = (currentOver <= 6  && totalWickets >= 3) ||
                     (currentOver <= 13 && totalWickets >= 5);

  if (isCollapse) {
    phaseWicketMod   = 0.40;   // new batsman treads carefully
    phaseBoundaryMod = 0.35;
  } else if (currentOver <= 6) {
    phaseBoundaryMod = 1.15;
    phaseWicketMod   = 1.00;
  } else if (currentOver <= 14) {
    phaseBoundaryMod = 0.90;
    phaseWicketMod   = 0.90;
  } else {
    phaseBoundaryMod = 1.35;
    phaseWicketMod   = 1.30;
  }

  // ─────────────────────────────────────────────────────
  //  STEP 6 — MOMENTUM & DEW
  // ─────────────────────────────────────────────────────
  if (consecutiveBoundaries >= 2) phaseBoundaryMod *= 0.50;
  if (consecutiveWickets    >= 1) phaseWicketMod   *= 0.35;
  if (dew) { phaseBoundaryMod *= 1.10; phaseWicketMod *= 0.90; }

  // Score dampening (prevents 300+ totals)
  if      (inningsRuns > 240) { phaseBoundaryMod *= 0.25; }
  else if (inningsRuns > 210) { phaseBoundaryMod *= 0.60; }

  // ─────────────────────────────────────────────────────
  //  STEP 7 — FINAL PROBABILITIES
  // ─────────────────────────────────────────────────────
  const pWicket = Math.min(
    baseWicket * wicketMult * ratingWicketMod * pitchWicketMod * phaseWicketMod,
    0.50
  );
  const pSix = Math.min(
    baseSix * runMult * ratingBoundaryMod * pitchBoundaryMod * phaseBoundaryMod,
    0.30
  );
  const pFour = Math.min(
    baseFour * runMult * ratingBoundaryMod * pitchBoundaryMod * phaseBoundaryMod,
    0.45
  );
  // Dot ball probability (floored by subtype)
  const pDot = Math.max(baseDot, 0.10);

  // ─────────────────────────────────────────────────────
  //  STEP 8 — OUTCOME ROLL
  // ─────────────────────────────────────────────────────
  const roll = Math.random();

  if (roll < pWicket) {
    const d = Math.random();
    const how = d < 0.05 ? 'run out' : d < 0.25 ? 'bowled' : d < 0.45 ? 'lbw' : 'caught';
    return { runs: 0, isWicket: true, type: 'wicket', how };
  }

  const roll2 = Math.random();
  if (roll2 < pSix)  return { runs: 6, isWicket: false, type: 'six'  };
  if (roll2 < pFour) return { runs: 4, isWicket: false, type: 'four' };

  // Singles / twos / threes / dot — proportions from subtype
  const r = Math.random();
  if (r < pDot)                  return { runs: 0, isWicket: false, type: 'dot'   };
  if (r < pDot + 0.38)           return { runs: 1, isWicket: false, type: 'one'   };
  if (r < pDot + 0.38 + 0.18)   return { runs: 2, isWicket: false, type: 'two'   };
  return                                { runs: 3, isWicket: false, type: 'three' };
}

// ===================================================
//   INNINGS SIMULATION
// ===================================================

function simulateInnings(battingTeam, bowlingTeam, targetScore, opts, maxBalls = 120, maxWkts = 10) {
  const { pace, spin, outfield, dew, customBowlingOrder = [] } = opts; // <-- Added custom array here

  // Build batsmen
  const batsmen = battingTeam.map(name => ({
    ...getPlayer(name), runs: 0, balls: 0, fours: 0, sixes: 0,
    isOut: false, dismissal: 'not out', ballsFaced: 0,
  }));

  // Build bowler pool
  let bowlerPool = bowlingTeam
    .map(name => getPlayer(name))
    .filter(p => p.bowl_rating > 30 || /bowl|all|pacer|spinner/i.test(p.role));

  // Ensure any explicitly requested part-timers are forced into the bowling pool
  customBowlingOrder.forEach(name => {
    if (name && name !== 'auto' && !bowlerPool.find(b => b.name === name)) {
      bowlerPool.push(getPlayer(name));
    }
  });

  if (bowlerPool.length < 5) {
    const extra = bowlingTeam.map(name => getPlayer(name)).filter(p => !bowlerPool.find(b=>b.name===p.name)).slice(0, 5 - bowlerPool.length);
    bowlerPool.push(...extra);
  }
  bowlerPool.sort((a, b) => b.bowl_rating - a.bowl_rating);

  const oversCount = {};
  const bowlStats  = {};
  bowlerPool.forEach(b => { oversCount[b.name] = 0; bowlStats[b.name] = { overs:0, runs:0, wickets:0 }; });

  let totalRuns = 0, totalWickets = 0, totalBalls = 0;
  let striker = 0, nonStriker = 1;
  let ballsThisOver = 0;
  let lastBowlerName = null, currentBowler = null;
  let consBoundaries = 0, consWickets = 0;
  const ballLog = [];

  while (totalBalls < maxBalls && totalWickets < maxWkts) {
    const overNum = Math.floor(totalBalls / 6) + 1;

    // ── Select bowler for new over ──
    if (ballsThisOver === 0) {
      let desiredBowlerName = customBowlingOrder[overNum - 1];
      if (desiredBowlerName === 'auto') desiredBowlerName = null;

      const eligible  = bowlerPool.filter(b => oversCount[b.name] < 4 && b.name !== lastBowlerName);
      const eligible2 = bowlerPool.filter(b => oversCount[b.name] < 4);
      
      currentBowler = null;
      
      // If user forced a bowler, try to use them
      if (desiredBowlerName) {
        let match = eligible.find(b => b.name === desiredBowlerName);
        if (match) {
          currentBowler = match;
        } else {
          console.warn(`[IPL SIM] Custom bowler ${desiredBowlerName} for over ${overNum} invalid (max overs reached or bowling consecutively). Falling back to Auto.`);
        }
      }

      // Fallback to bot auto-select if no custom bowler or if custom was invalid
      if (!currentBowler) {
        currentBowler = eligible[0] || eligible2[0] || bowlerPool[0];
      }

      oversCount[currentBowler.name]++;
      bowlStats[currentBowler.name].overs++;
      lastBowlerName = currentBowler.name;
      consBoundaries = 0;
    }

    const batsman = batsmen[striker];
    const ball = simulateBall(batsman, currentBowler, {
      pace, spin, outfield, dew,
      currentOver: overNum,
      totalWickets,
      inningsRuns: totalRuns,
      consecutiveBoundaries: consBoundaries,
      consecutiveWickets: consWickets,
      ballsFaced: batsman.ballsFaced,
    });

    // Momentum
    if      (ball.isWicket)  { consWickets++; consBoundaries = 0; }
    else if (ball.runs >= 4) { consBoundaries++; consWickets = 0; }
    else                     { consBoundaries = 0; consWickets = 0; }

    // Stats
    totalRuns      += ball.runs;
    totalBalls++;
    ballsThisOver++;
    batsman.runs   += ball.runs;
    batsman.balls++;
    batsman.ballsFaced++;
    if (ball.runs === 4) batsman.fours++;
    if (ball.runs === 6) batsman.sixes++;
    bowlStats[currentBowler.name].runs += ball.runs;

    const logEntry = {
      over: overNum, ball: ballsThisOver,
      batsman: batsman.name, bowler: currentBowler.name,
      runs: ball.runs, type: ball.type,
      total: totalRuns, wickets: totalWickets + (ball.isWicket ? 1 : 0),
      batRuns: batsman.runs, batBalls: batsman.balls,
    };

    if (ball.isWicket) {
      batsman.isOut = true;
      totalWickets++;
      bowlStats[currentBowler.name].wickets++;
      const fielders = bowlingTeam.filter(n => n !== currentBowler.name);
      const fielder  = fielders[Math.floor(Math.random() * fielders.length)] || currentBowler.name;
      batsman.dismissal = buildDismissalText(ball.how, currentBowler.name, fielder, bowlingTeam);
      logEntry.dismissal = ball.how;
      striker = Math.max(striker, nonStriker) + 1;
      if (striker >= batsmen.length) break;
    } else {
      if (ball.runs % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
    }

    ballLog.push(logEntry);

    if (ballsThisOver === 6) {
      ballsThisOver = 0;
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (targetScore && totalRuns >= targetScore) break;
  }

  const battingCard = batsmen
    .filter(b => b.balls > 0)
    .map(b => ({
      name: b.name, runs: b.runs, balls: b.balls, fours: b.fours, sixes: b.sixes,
      sr: b.balls > 0 ? Math.round((b.runs / b.balls) * 1000) / 10 : 0,
      isOut: b.isOut, dismissal: b.dismissal,
    }));

  const bowlingCard = Object.entries(bowlStats)
    .filter(([, s]) => s.overs > 0)
    .map(([name, s]) => ({
      name, overs: s.overs, runs: s.runs, wickets: s.wickets,
      economy: s.overs > 0 ? Math.round((s.runs / s.overs) * 100) / 100 : 0,
    }));

  return { runs: totalRuns, wickets: totalWickets, balls: totalBalls, battingCard, bowlingCard, ballLog };
}

function buildDismissalText(how, bowlerName, fielder, _squad) {
  if (how === 'run out')  return `run out (${fielder})`;
  if (how === 'bowled')   return `b ${bowlerName}`;
  if (how === 'lbw')      return `lbw b ${bowlerName}`;
  return `c ${fielder} b ${bowlerName}`;
}

// ===================================================
//   MATCH STATE
// ===================================================

let matchData = null;

// ===================================================
//   RUN SIMULATION
// ===================================================

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runSimulation() {
  const t1key   = document.getElementById('team1Select').value;
  const t2key   = document.getElementById('team2Select').value;
  const venue   = document.getElementById('venueSelect').value;
  const pitchType = document.getElementById('pitchType').value;
  const dew     = document.getElementById('dewToggle').classList.contains('on');

  if (!t1key || !t2key)  { alert('Please select both teams!'); return; }
  if (t1key === t2key)   { alert('Teams must be different!'); return; }
  if (!venue)            { alert('Please select a venue!'); return; }

  // Show loading
  const loading     = document.getElementById('loading');
  const loadingText = document.getElementById('loadingText');
  loading.classList.add('show');
  const msgs = ['Tossing the coin…','Setting the pitch…','Batting order set…','Simulating 1st innings…','Simulating 2nd innings…','Calculating result…'];
  let mi = 0;
  const msgInterval = setInterval(() => { loadingText.textContent = msgs[mi++ % msgs.length]; }, 500);
  await sleep(50);

  // ── Toss ──
  const tossWinPref = document.getElementById('tossWinner').value;
  const tossDec     = document.getElementById('tossDecision').value;
  // Map 'team1'/'team2' dropdown values to actual team keys
  let tossWinner;
  if      (tossWinPref === 'auto')  tossWinner = Math.random() < 0.5 ? t1key : t2key;
  else if (tossWinPref === 'team1') tossWinner = t1key;
  else if (tossWinPref === 'team2') tossWinner = t2key;
  else                              tossWinner = t1key; // fallback
  const batFirst   = (tossWinner === t1key) === (tossDec === 'bat') ? t1key : t2key;
  const fieldFirst = batFirst === t1key ? t2key : t1key;

  // ── Pitch factors ──
  const stadia = STADIUMS[venue] || { pace:1.0, spin:1.0, outfield:1.0 };
  const pm     = pitchModifiers(pitchType);
  const pace      = stadia.pace    * pm.pace;
  const spin      = stadia.spin    * pm.spin;
  const outfield  = stadia.outfield * pm.outfield;

  // ── Rosters ──
  const battingTeam1  = getTeamPlayers(batFirst);
  const bowlingTeam1  = getTeamPlayers(fieldFirst);

  clearInterval(msgInterval);
  loading.classList.remove('show');

  // ── Branch: live or instant ──
  const isLive = document.getElementById('liveToggle').classList.contains('on');

  if (isLive) {
    await runLiveSimulation(
      t1key, t2key, venue, pitchType, dew,
      tossWinner, tossDec, batFirst, fieldFirst,
      pace, spin, outfield
    );
    return;
  }

  // Map which custom config goes to which innings
  const inn1BowlingOrder = customBowlingOrders[fieldFirst] || [];
  const inn2BowlingOrder = customBowlingOrders[batFirst] || [];

  // ── Normal instant simulation ──
  // Calculate Hot Streaks right before pulling players
  updateHotStreaks(); 

  const inn1   = simulateInnings(battingTeam1, bowlingTeam1, null,           { pace, spin, outfield, dew: false, customBowlingOrder: inn1BowlingOrder });
  const target = inn1.runs + 1;
  const inn2   = simulateInnings(bowlingTeam1, battingTeam1, target,         { pace, spin, outfield, dew, customBowlingOrder: inn2BowlingOrder });

  // ── Result & Super Over Logic ──
  let winMsg, matchWinner;
  
  if (inn2.runs === target - 1) {
    // IT'S A TIE! TRIGGER SUPER OVER
    const t1Roster = battingTeam1.map(n => getPlayer(n));
    const t2Roster = bowlingTeam1.map(n => getPlayer(n));
    
    // Pick Top 3 Batters and Top 1 Bowler per team
    const t1Bats = t1Roster.sort((a,b) => b.bat_rating - a.bat_rating).slice(0,3).map(p=>p.name);
    const t1Bowl = t1Roster.sort((a,b) => b.bowl_rating - a.bowl_rating).slice(0,1).map(p=>p.name);
    
    const t2Bats = t2Roster.sort((a,b) => b.bat_rating - a.bat_rating).slice(0,3).map(p=>p.name);
    const t2Bowl = t2Roster.sort((a,b) => b.bowl_rating - a.bowl_rating).slice(0,1).map(p=>p.name);

    // Simulate 6 balls, max 2 wickets
    const so1 = simulateInnings(t1Bats, t2Bowl, null, { pace, spin, outfield, dew: false, customBowlingOrder: [] }, 6, 2);
    const so2 = simulateInnings(t2Bats, t1Bowl, so1.runs + 1, { pace, spin, outfield, dew: true, customBowlingOrder: [] }, 6, 2);

    matchWinner = so2.runs > so1.runs ? fieldFirst : batFirst;
    winMsg = `MATCH TIED! ${TEAM_DISPLAY[matchWinner]} won the Super Over (${so1.runs} vs ${so2.runs})`;
    
    // Append the super over stats to the main innings so they show in the scorecard
    inn1.battingCard.push(...so1.battingCard.map(b => ({...b, dismissal: b.dismissal + ' (SO)'})));
    inn2.battingCard.push(...so2.battingCard.map(b => ({...b, dismissal: b.dismissal + ' (SO)'})));
  } else if (inn2.runs >= target) {
    const wkts = 10 - inn2.wickets;
    winMsg      = `${TEAM_DISPLAY[fieldFirst]} won by ${wkts} wicket${wkts !== 1 ? 's' : ''}`;
    matchWinner = fieldFirst;
  } else {
    const margin = inn1.runs - inn2.runs;
    winMsg      = `${TEAM_DISPLAY[batFirst]} won by ${margin} run${margin !== 1 ? 's' : ''}`;
    matchWinner = batFirst;
  }

  matchData = { t1key, t2key, venue, pitchType, batFirst, fieldFirst,
                inn1, inn2, target, matchWinner, winMsg, tossWinner, tossDec };

  saveMatchToLog(matchData);
  renderMatch();
}

// ===================================================
//   RENDER — MATCH OVERVIEW
// ===================================================

function renderMatch() {
  const { batFirst, fieldFirst, inn1, inn2, venue, pitchType, winMsg, tossWinner, tossDec } = matchData;

  document.getElementById('preMatch').style.display   = 'none';
  document.getElementById('matchView').style.display  = 'block';

  // Venue & pitch chips
  document.getElementById('venueName').textContent = venue;
  const pm = pitchModifiers(pitchType);
  document.getElementById('pitchChips').innerHTML = `
    <div class="stat-chip"><div class="stat-chip-label">Pitch</div><div class="stat-chip-val" style="color:var(--accent)">${pitchType.toUpperCase()}</div></div>
    <div class="stat-chip"><div class="stat-chip-label">Pace</div><div class="stat-chip-val">${pm.pace.toFixed(1)}x</div></div>
    <div class="stat-chip"><div class="stat-chip-label">Spin</div><div class="stat-chip-val">${pm.spin.toFixed(1)}x</div></div>
    <div class="stat-chip"><div class="stat-chip-label">Outfield</div><div class="stat-chip-val">${pm.outfield.toFixed(1)}x</div></div>
  `;

  // Toss line
  document.getElementById('tossDisplay').textContent =
    `${TEAM_DISPLAY[tossWinner]} won the toss and elected to ${tossDec} first.`;

  // Result banner
  document.getElementById('resultBanner').classList.add('show');
  document.getElementById('resultTitle').textContent    = winMsg;
  document.getElementById('resultSubtitle').textContent = `Target: ${matchData.target} | ${venue}`;

  // Innings mini-scores
  document.getElementById('inn1Score').textContent = `${inn1.runs}/${inn1.wickets}`;
  document.getElementById('inn1Overs').textContent = `${Math.floor(inn1.balls/6)}.${inn1.balls%6} overs • ${TEAM_DISPLAY[batFirst]}`;
  document.getElementById('inn2Score').textContent = `${inn2.runs}/${inn2.wickets}`;
  document.getElementById('inn2Overs').textContent = `${Math.floor(inn2.balls/6)}.${inn2.balls%6} overs • ${TEAM_DISPLAY[fieldFirst]}`;

  showInnings(1);
  renderStats();
}

// ===================================================
//   RENDER — SCORECARD
// ===================================================

function showInnings(n) {
  const { inn1, inn2, batFirst, fieldFirst } = matchData;
  const inn     = n === 1 ? inn1 : inn2;
  const batting = n === 1 ? batFirst  : fieldFirst;
  const bowling = n === 1 ? fieldFirst : batFirst;

  // Button states
  document.getElementById('inn1Btn').className  = n === 1 ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('inn2Btn').className  = n === 2 ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('inn1Card').className = n === 1 ? 'innings-card active' : 'innings-card';
  document.getElementById('inn2Card').className = n === 2 ? 'innings-card active' : 'innings-card';

  document.getElementById('battingTeamLabel').textContent = `${TEAM_DISPLAY[batting]} — Batting`;
  document.getElementById('bowlingTeamLabel').textContent = `${TEAM_DISPLAY[bowling]} — Bowling`;

  const color  = TEAM_COLORS[batting]  || '#00d4ff';
  const bcolor = TEAM_COLORS[bowling]  || '#ff6b35';
  const maxSR  = Math.max(...inn.battingCard.map(b => b.sr), 100);

  // Batting rows
  const tbody = document.getElementById('battingTbody');
  tbody.innerHTML = inn.battingCard.map(b => {
    const runColor = b.runs >= 100 ? 'var(--gold)' : b.runs >= 50 ? 'var(--accent3)' : 'var(--text)';
    const runBold  = b.runs >= 50 ? '700' : '400';
    const star     = b.runs >= 100 ? '★' : '';
    const barW     = Math.min((b.sr / maxSR) * 60, 60);

    // Badge: always show bat_subtype in batting card (it's what matters here)
    const p = PLAYER_DB[b.name] || {};
    const sub = p.bat_subtype;
    const badge = sub ? `<span class="subtype-badge bat-${sub}">${sub}</span>` : '';

    return `
      <tr class="fade-up">
        <td class="player-name-cell">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${b.name}${badge}</div>
          <span class="dismissal-text">${b.dismissal}</span>
        </td>
        <td class="right" style="color:${runColor};font-weight:${runBold}">${b.runs}${star}</td>
        <td class="right">${b.balls}</td>
        <td class="right">${b.fours}</td>
        <td class="right">${b.sixes}</td>
        <td class="right">
          <div class="sr-bar-wrap">
            <div class="sr-bar" style="width:${barW}px;background:${color}"></div>
            ${b.sr}
          </div>
        </td>
      </tr>`;
  }).join('');

  const extras = Math.max(0, inn.runs - inn.battingCard.reduce((s, b) => s + b.runs, 0));
  tbody.innerHTML += `
    <tr style="background:rgba(255,255,255,0.02)">
      <td style="color:var(--muted);font-size:0.8rem" colspan="5">Extras</td>
      <td class="right" style="color:var(--muted)">${extras}</td>
    </tr>
    <tr style="font-weight:600">
      <td>TOTAL</td>
      <td class="right" colspan="5" style="color:${color};font-family:'Bebas Neue',sans-serif;font-size:1.2rem">${inn.runs}/${inn.wickets}</td>
    </tr>`;

  // Bowling rows
  const btbody = document.getElementById('bowlingTbody');
  btbody.innerHTML = [...inn.bowlingCard]
    .sort((a, b) => b.wickets - a.wickets)
    .map(b => {
      const wkColor  = b.wickets >= 3 ? 'var(--accent2)' : 'var(--text)';
      const wkBold   = b.wickets >= 3 ? '700' : '400';
      const wkStar   = b.wickets >= 5 ? '★' : '';
      const ecoColor = b.economy < 7 ? 'var(--accent3)' : b.economy > 10 ? 'var(--danger)' : 'var(--text)';

      // Badge: always show bowl_subtype in bowling card
      const p = PLAYER_DB[b.name] || {};
      const sub = p.bowl_subtype;
      const badge = sub ? `<span class="subtype-badge bowl-${sub}">${sub}</span>` : '';

      return `
        <tr class="fade-up">
          <td class="player-name-cell">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${b.name}${badge}</div>
          </td>
          <td class="right">${b.overs}</td>
          <td class="right">${b.runs}</td>
          <td class="right" style="color:${wkColor};font-weight:${wkBold}">${b.wickets}${wkStar}</td>
          <td class="right" style="color:${ecoColor}">${b.economy}</td>
        </tr>`;
    }).join('');
}

// ===================================================
//   RENDER — BALL LOG
// ===================================================

function showLog(n) {
  const log = n === 1 ? matchData.inn1.ballLog : matchData.inn2.ballLog;
  document.getElementById('log1Btn').className = n === 1 ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('log2Btn').className = n === 2 ? 'btn btn-primary' : 'btn btn-secondary';

  // Group by over
  const byOver = {};
  log.forEach(e => {
    if (!byOver[e.over]) byOver[e.over] = [];
    byOver[e.over].push(e);
  });

  document.getElementById('ballLogContainer').innerHTML = Object.entries(byOver)
    .reverse()
    .map(([over, balls]) => {
      const overRuns = balls.reduce((s, b) => s + b.runs, 0);
      const wkts     = balls.filter(b => b.type === 'wicket').length;
      const last     = balls[balls.length - 1];
      const chips    = balls.map(b => {
        const label = b.type === 'wicket' ? 'W' : b.runs === 0 ? '·' : b.runs;
        return `<div class="ball-chip ${b.type}" data-tip="${b.batsman}: ${b.runs}r vs ${b.bowler}">${label}</div>`;
      }).join('');
      return `
        <div class="over-row">
          <div class="over-header">
            Over ${over} — ${overRuns} runs${wkts ? `, ${wkts} wkt` : ''} &nbsp;|&nbsp;
            ${balls[0].batsman} vs ${balls[0].bowler} &nbsp;|&nbsp;
            ${last.total}/${last.wickets}
          </div>
          <div class="balls-row">${chips}</div>
        </div>`;
    }).join('');
}

// ===================================================
//   RENDER — STATS TAB
// ===================================================

function renderStats() {
  const { inn1, inn2, batFirst, fieldFirst } = matchData;

  // 1. Gather all players from both innings
  const fullBats = [
    ...inn1.battingCard.map(b => ({ ...b, team: batFirst })),
    ...inn2.battingCard.map(b => ({ ...b, team: fieldFirst })),
  ];

  const fullBowlers = [
    ...inn1.bowlingCard.map(b => ({ ...b, team: fieldFirst })),
    ...inn2.bowlingCard.map(b => ({ ...b, team: batFirst })),
  ];

  // 2. Sort for the Top 5 lists
  const allBats = [...fullBats].sort((a, b) => b.runs - a.runs).slice(0, 5);
  const allBowlers = [...fullBowlers].sort((a, b) => b.wickets - a.wickets || a.economy - b.economy).slice(0, 5);

  // 3. Calculate Post-Match Awards
  // Super Striker (min 5 balls)
  const validStrikers = fullBats.filter(b => b.balls >= 5);
  const superStriker = validStrikers.length > 0 
    ? validStrikers.sort((a,b) => b.sr - a.sr)[0] 
    : [...fullBats].sort((a,b) => b.sr - a.sr)[0];

  // Collapse Saver
  const collapseSaver = [...fullBats].sort((a, b) => b.balls - a.balls)[0];

  // Greenery Award (min 6 actual balls bowled)
  // Combine logs from both innings to count exact balls
  const allBalls = [...inn1.ballLog, ...inn2.ballLog];
  
  const validBowlers = fullBowlers.filter(bowler => {
    // Count every ball this specific bowler bowled in the match
    const ballsBowled = allBalls.filter(ball => ball.bowler === bowler.name).length;
    return ballsBowled >= 6; // Must have bowled at least 6 deliveries
  });
  
  const greenery = validBowlers.length > 0 
    ? validBowlers.sort((a,b) => a.economy - b.economy)[0] 
    : [...fullBowlers].sort((a,b) => a.economy - b.economy)[0];

  const maxRuns = allBats[0]?.runs || 1;

  // Calculate MVP (Player of the Match)
  let mvp = { name: '—', impact: -1, runs: 0, wkts: 0 };
  fullBats.forEach(b => {
    // Formula: Runs + (Strike Rate modifier)
    let impact = b.runs + (b.runs * (b.sr / 100) * 0.5);
    let bowlerData = fullBowlers.find(bow => bow.name === b.name);
    let wkts = 0;
    
    if (bowlerData) {
      wkts = bowlerData.wickets;
      impact += (wkts * 25) + (bowlerData.overs * 2); // Huge wicket weight
    }
    
    // NEW: 50% Impact Bonus for being on the winning team
    if (b.team === matchData.matchWinner) {
      impact *= 1.25; 
    }
    
    if (impact > mvp.impact) mvp = { name: b.name, impact, runs: b.runs, wkts };
  });

  const potmHtml = `
    <div class="potm-card fade-up">
      <div class="potm-title">Player of the Match</div>
      <div class="potm-name">${mvp.name}</div>
      <div class="potm-stats">${mvp.runs} Runs • ${mvp.wkts} Wickets</div>
    </div>
  `;

  // 4. Build HTML for top lists
  const topBatsHtml = allBats.map((b, i) => {
    const c = TEAM_COLORS[b.team] || '#00d4ff';
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--muted);width:16px">#${i+1}</div>
        <div style="flex:1">
          <div style="font-size:0.88rem;margin-bottom:3px">${b.name}</div>
          <div style="height:4px;border-radius:2px;background:var(--border)">
            <div style="height:100%;border-radius:2px;background:${c};width:${(b.runs/maxRuns)*100}%;transition:width 0.6s"></div>
          </div>
        </div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:${c}">${b.runs}</div>
        <div style="font-size:0.7rem;color:var(--muted);font-family:'Space Mono',monospace">SR ${b.sr}</div>
      </div>`;
  }).join('');

  const topBowlHtml = allBowlers.map((b, i) => {
    const c = TEAM_COLORS[b.team] || '#ff6b35';
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--muted);width:16px">#${i+1}</div>
        <div style="flex:1">
          <div style="font-size:0.88rem;margin-bottom:2px">${b.name}</div>
          <div style="font-size:0.7rem;color:var(--muted);font-family:'Space Mono',monospace">${b.overs} overs • eco ${b.economy}</div>
        </div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:${c}">${b.wickets}W</div>
        <div style="font-size:0.7rem;color:var(--muted);font-family:'Space Mono',monospace">${b.runs}r</div>
      </div>`;
  }).join('');

  // 5. Build HTML for Awards
  const awardsHtml = `
    <div class="scorecard" style="grid-column:1/-1">
      <div class="scorecard-header"><div class="dot" style="background:var(--accent3)"></div>Post Match Awards</div>
      <div style="padding:16px 20px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
          <div style="font-size:2.2rem; margin-bottom:10px;">⚡</div>
          <div style="font-family:'Bebas Neue', sans-serif; font-size:1.3rem; color:var(--accent); letter-spacing:1px;">Super Striker</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.7rem; color:var(--muted); margin-bottom:10px; text-transform:uppercase;">Highest Strike Rate</div>
          <div style="font-weight:600; font-size:1.1rem; color:var(--text);">${superStriker ? superStriker.name : '—'}</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.85rem; color:var(--accent); margin-top:4px;">${superStriker ? superStriker.sr + ' SR' : ''}</div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
          <div style="font-size:2.2rem; margin-bottom:10px;">🛡️</div>
          <div style="font-family:'Bebas Neue', sans-serif; font-size:1.3rem; color:var(--gold); letter-spacing:1px;">Collapse Saver</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.7rem; color:var(--muted); margin-bottom:10px; text-transform:uppercase;">Most Balls Faced</div>
          <div style="font-weight:600; font-size:1.1rem; color:var(--text);">${collapseSaver ? collapseSaver.name : '—'}</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.85rem; color:var(--gold); margin-top:4px;">${collapseSaver ? collapseSaver.balls + ' Balls' : ''}</div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
          <div style="font-size:2.2rem; margin-bottom:10px;">🌱</div>
          <div style="font-family:'Bebas Neue', sans-serif; font-size:1.3rem; color:var(--success); letter-spacing:1px;">Greenery Award</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.7rem; color:var(--muted); margin-bottom:10px; text-transform:uppercase;">Lowest Economy</div>
          <div style="font-weight:600; font-size:1.1rem; color:var(--text);">${greenery ? greenery.name : '—'}</div>
          <div style="font-family:'Space Mono', monospace; font-size:0.85rem; color:var(--success); margin-top:4px;">${greenery ? greenery.economy + ' Econ' : ''}</div>
        </div>

      </div>
    </div>
  `;

  // 6. Inject into DOM
  document.getElementById('statsGrid').innerHTML = `
    ${potmHtml} <div class="scorecard">
      <div class="scorecard-header"><div class="dot"></div>Top Batsmen</div>
      <div style="padding:8px 16px">${topBatsHtml}</div>
    </div>
    
    <div class="scorecard">
      <div class="scorecard-header"><div class="dot" style="background:var(--accent2)"></div>Top Bowlers</div>
      <div style="padding:8px 16px">${topBowlHtml}</div>
    </div>
    
    ${awardsHtml}
    
    <div class="scorecard" style="grid-column:1/-1">
      <div class="scorecard-header"><div class="dot" style="background:var(--gold)"></div>Match Summary</div>
      <div style="padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <div style="font-size:0.7rem;color:var(--muted);font-family:'Space Mono',monospace;margin-bottom:4px">1ST INNINGS — ${TEAM_DISPLAY[batFirst]}</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:var(--accent)">${inn1.runs}/${inn1.wickets}</div>
          <div style="font-size:0.78rem;color:var(--muted)">${Math.floor(inn1.balls/6)}.${inn1.balls%6} overs • RPO: ${inn1.balls > 0 ? Math.round(inn1.runs / (inn1.balls/6) * 10)/10 : '—'}</div>
        </div>
        <div>
          <div style="font-size:0.7rem;color:var(--muted);font-family:'Space Mono',monospace;margin-bottom:4px">2ND INNINGS — ${TEAM_DISPLAY[fieldFirst]}</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:var(--accent2)">${inn2.runs}/${inn2.wickets}</div>
          <div style="font-size:0.78rem;color:var(--muted)">${Math.floor(inn2.balls/6)}.${inn2.balls%6} overs • Target: ${matchData.target}</div>
        </div>
      </div>
    </div>`;
}

// ===================================================
//   UI HELPERS
// ===================================================

function switchTab(tab) {
  const tabs = ['scorecard', 'balllog', 'stats'];
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.className = tabs[i] === tab ? 'tab active' : 'tab';
  });
  document.querySelectorAll('.tab-panel').forEach(p => { p.className = 'tab-panel'; });
  const panel = document.getElementById(tab + '-panel');
  if (panel) panel.className = 'tab-panel active';
  if (tab === 'balllog' && matchData) showLog(1);
}

function showPage(page) {
  document.querySelectorAll('.nav-btn').forEach((b, i) => {
    b.className = (['sim', 'howto'][i] === page) ? 'nav-btn active' : 'nav-btn';
  });
  document.getElementById('simPage').style.display    = page === 'sim'   ? 'block' : 'none';
  document.getElementById('howtoPage').style.display  = page === 'howto' ? 'block' : 'none';
}

function resetAll() {
  // Stop any live sim in progress
  liveAborted = true;
  if (liveTimer) { clearTimeout(liveTimer); liveTimer = null; }

  matchData = null;
  document.getElementById('preMatch').style.display        = 'block';
  document.getElementById('matchView').style.display       = 'none';
  document.getElementById('liveMatchView').style.display   = 'none';
  document.getElementById('resultBanner').classList.remove('show');

  // Reset the stop button for next time
  const stopBtn = document.getElementById('liveStopBtn');
  stopBtn.textContent = '⏹ Stop';
  stopBtn.onclick = stopLive;
}

// ===================================================
//   LIVE MATCH ENGINE
// ===================================================

let liveState = null;       // holds all mutable live-sim state
let liveTimer = null;       // the active setTimeout handle
let liveAborted = false;    // flag to cleanly stop mid-match

// (liveToggle listener is wired in the main DOMContentLoaded init block below)

// ── Entry point (called instead of normal sim when live is on) ──
async function runLiveSimulation(t1key, t2key, venue, pitchType, dew, tossWinner, tossDec, batFirst, fieldFirst, pace, spin, outfield) {

  liveAborted = false;

  // Pre-compute the full innings data first (identical engine)
  const battingTeam1 = getTeamPlayers(batFirst);
  const bowlingTeam1 = getTeamPlayers(fieldFirst);
  const inn1BowlingOrder = customBowlingOrders[fieldFirst] || [];
  const inn2BowlingOrder = customBowlingOrders[batFirst] || [];
  const inn1Full = simulateInnings(battingTeam1, bowlingTeam1, null,             { pace, spin, outfield, dew: false, customBowlingOrder: inn1BowlingOrder });
  const target   = inn1Full.runs + 1;
  const inn2Full = simulateInnings(bowlingTeam1, battingTeam1, target,           { pace, spin, outfield, dew, customBowlingOrder: inn2BowlingOrder });

  // Store for post-match scorecard
  matchData = {
    t1key, t2key, venue, pitchType, batFirst, fieldFirst,
    inn1: inn1Full, inn2: inn2Full, target,
    matchWinner: inn2Full.runs >= target ? fieldFirst : batFirst,
    winMsg: inn2Full.runs >= target
      ? `${TEAM_DISPLAY[fieldFirst]} won by ${10 - inn2Full.wickets} wicket${10 - inn2Full.wickets !== 1 ? 's' : ''}`
      : `${TEAM_DISPLAY[batFirst]} won by ${inn1Full.runs - inn2Full.runs} run${inn1Full.runs - inn2Full.runs !== 1 ? 's' : ''}`,
    tossWinner, tossDec,
  };

  // Show the live view panel
  document.getElementById('preMatch').style.display      = 'none';
  document.getElementById('liveMatchView').style.display = 'block';
  document.getElementById('matchView').style.display     = 'none';

  const delay = parseInt(document.getElementById('liveSpeed').value, 10) || 800;

  // ── Play through innings 1 ──
  await playLiveInnings(inn1Full, 1, batFirst, fieldFirst, null, delay);
  if (liveAborted) return;

  // ── Innings break ──
  await liveInningsBreak(inn1Full, batFirst, fieldFirst, target, delay);
  if (liveAborted) return;

  // ── Play through innings 2 ──
  await playLiveInnings(inn2Full, 2, fieldFirst, batFirst, target, delay);
  if (liveAborted) return;

  // ── Match over → show full scorecard ──
  saveMatchToLog(matchData); // <-- This saves it to the dashboard!
  endLiveMatch();
}

// ── Plays one innings ball-by-ball ──
function playLiveInnings(inn, inningsNum, battingKey, bowlingKey, targetScore, delay) {
  return new Promise(resolve => {
    const log       = inn.ballLog;
    const color     = TEAM_COLORS[battingKey]  || '#00d4ff';
    const bcolor    = TEAM_COLORS[bowlingKey]  || '#ff6b35';
    let ballIdx     = 0;

    // Per-ball live tracking state
    const batStats  = {};   // name → { runs, balls }
    const bowStats  = {};   // name → { runs, wickets, overs }
    const overLog   = {};   // overNum → [ball entries]

    // Initialise from the pre-computed innings (so we replay deterministically)
    // We rebuild stats from scratch as we go through the log
    inn.battingCard.forEach(b => { batStats[b.name] = { runs: 0, balls: 0 }; });
    inn.bowlingCard.forEach(b => { bowStats[b.name] = { runs: 0, wickets: 0, overs: 0 }; });

    // Prime the UI header
    document.getElementById('liveMatchTitle').textContent =
      `${TEAM_DISPLAY[battingKey]} vs ${TEAM_DISPLAY[bowlingKey]}`;
    document.getElementById('liveInnBadge').textContent =
      inningsNum === 1 ? '1st Innings' : '2nd Innings';
    document.getElementById('liveCurrentOverBalls').innerHTML = '';
    document.getElementById('liveOversLog').innerHTML = '';
    document.getElementById('liveEventFlash').className = 'live-event-flash';
    document.getElementById('liveControlsInfo').textContent =
      inningsNum === 1 ? 'Simulating 1st innings…' : 'Simulating 2nd innings…';

    if (targetScore) {
      document.getElementById('liveTargetWrap').style.display = 'block';
      document.getElementById('liveTargetNum').textContent = targetScore;
    } else {
      document.getElementById('liveTargetWrap').style.display = 'none';
    }

    function tick() {
      if (liveAborted)    { resolve(); return; }
      if (ballIdx >= log.length) { resolve(); return; }

      const entry     = log[ballIdx];
      const overNum   = entry.over;
      const ballNum   = entry.ball;
      const strikerN  = entry.batsman;
      const bowlerN   = entry.bowler;

      // Figure out non-striker: last batsman who batted that isn't the striker and hasn't been dismissed
      // We track who has faced balls; the non-striker is the other active one
      if (!batStats[strikerN]) batStats[strikerN] = { runs: 0, balls: 0 };
      if (!bowStats[bowlerN])  bowStats[bowlerN]  = { runs: 0, wickets: 0, overs: 0 };

      // Update stats
      batStats[strikerN].runs  += entry.runs;
      batStats[strikerN].balls += 1;
      bowStats[bowlerN].runs   += entry.runs;
      if (entry.type === 'wicket') bowStats[bowlerN].wickets++;

      // Accumulate over log
      if (!overLog[overNum]) overLog[overNum] = [];
      overLog[overNum].push(entry);

      // ── Score line ──
      const scoreEl = document.getElementById('liveScoreBig');
      scoreEl.textContent = `${entry.total}/${entry.wickets}`;
      // Flash colour on boundary/wicket
      scoreEl.className = 'live-score-big';
      void scoreEl.offsetWidth; // force reflow
      if      (entry.type === 'wicket') scoreEl.classList.add('flash-wicket');
      else if (entry.type === 'six')    scoreEl.classList.add('flash-six');
      else if (entry.type === 'four')   scoreEl.classList.add('flash-four');
      setTimeout(() => { scoreEl.className = 'live-score-big'; }, 600);

      document.getElementById('liveScoreMeta').textContent =
        `${Math.floor(entry.over - 1 + entry.ball / 6)} overs completed` +
        (targetScore ? ` • Need ${Math.max(0, targetScore - entry.total)} from ${120 - (overNum - 1) * 6 - ballNum} balls` : '');

      // ── RRR ──
      if (targetScore) {
        const remaining   = 120 - ((overNum - 1) * 6 + ballNum);
        const toWin       = Math.max(0, targetScore - entry.total);
        const rrr         = remaining > 0 ? ((toWin / remaining) * 6).toFixed(2) : '—';
        document.getElementById('liveRRR').textContent = `RRR ${rrr}`;
      }

      // ── Striker card ──
      const sStats = batStats[strikerN];
      const sSR    = sStats.balls > 0 ? Math.round((sStats.runs / sStats.balls) * 100) : 0;
      const sPlayer = PLAYER_DB[strikerN] || {};
      const sBadge  = sPlayer.bat_subtype
        ? `<span class="subtype-badge bat-${sPlayer.bat_subtype}">${sPlayer.bat_subtype}</span>` : '';
      document.getElementById('liveStrikerName').innerHTML = `${strikerN} ${sBadge}`;
      document.getElementById('liveStrikerStats').textContent = `${sStats.runs} (${sStats.balls})`;
      document.getElementById('liveStrikerSR').textContent    = `SR ${sSR}`;

      // ── Non-striker ──
      // Non-striker = whoever else has batted but isn't out and isn't the striker
      const dismissed = log.slice(0, ballIdx + 1)
        .filter(e => e.type === 'wicket')
        .map(e => e.batsman);
      const nonStrikerName = Object.keys(batStats).find(
        n => n !== strikerN && !dismissed.includes(n) && batStats[n].balls > 0
      ) || '—';
      const nsStats = batStats[nonStrikerName] || { runs: 0, balls: 0 };
      const nsSR    = nsStats.balls > 0 ? Math.round((nsStats.runs / nsStats.balls) * 100) : 0;
      document.getElementById('liveNonStrikerName').textContent  = nonStrikerName;
      document.getElementById('liveNonStrikerStats').textContent = `${nsStats.runs} (${nsStats.balls})`;
      document.getElementById('liveNonStrikerSR').textContent    = `SR ${nsSR}`;

      // ── Bowler card ──
      const bStats = bowStats[bowlerN];
      // Count overs bowled so far in this innings for this bowler
      const oversBowled = Object.values(overLog).filter(ov => ov[0].bowler === bowlerN).length;
      const partialBalls = overLog[overNum].filter(b => b.bowler === bowlerN).length;
      const overStr = entry.ball === 6 ? `${oversBowled}` : `${oversBowled - 1}.${entry.ball}`;
      const bPlayer = PLAYER_DB[bowlerN] || {};
      const bBadge  = bPlayer.bowl_subtype
        ? `<span class="subtype-badge bowl-${bPlayer.bowl_subtype}">${bPlayer.bowl_subtype}</span>` : '';
      document.getElementById('liveBowlerName').innerHTML = `${bowlerN} ${bBadge}`;
      document.getElementById('liveBowlerStats').textContent = `${bStats.wickets}-${bStats.runs} (${overStr})`;
      const eco = oversBowled > 0 ? (bStats.runs / oversBowled).toFixed(2) : '—';
      document.getElementById('liveBowlerEco').textContent   = `Eco ${eco}`;

      // ── Current over chips ──
      const overChips = document.getElementById('liveCurrentOverBalls');
      if (ballNum === 1) overChips.innerHTML = ''; // new over
      const chip = document.createElement('div');
      const chipType = entry.type;
      const chipLabel = chipType === 'wicket' ? 'W' : entry.runs === 0 ? '·' : entry.runs;
      chip.className = `ball-chip ${chipType} ball-arrive`;
      chip.textContent = chipLabel;
      chip.setAttribute('data-tip', `${strikerN}: ${entry.runs}r`);
      overChips.appendChild(chip);

      // Over label
      document.getElementById('liveOverLabel').textContent =
        `OVER ${overNum} — BALL ${ballNum}`;
      const overRuns = overLog[overNum].reduce((s, b) => s + b.runs, 0);
      document.getElementById('liveOverRuns').textContent =
        `${overRuns} run${overRuns !== 1 ? 's' : ''} this over`;

      // ── Event flash ──
      const flashEl = document.getElementById('liveEventFlash');
      flashEl.className = 'live-event-flash'; // reset
      void flashEl.offsetWidth;
      const flashMap = {
        dot:    ['ev-dot',    '● Dot ball'],
        one:    ['ev-single', '1 Run'],
        two:    ['ev-two',    '2 Runs'],
        three:  ['ev-three',  '3 Runs'],
        four:   ['ev-four',   '⬡ FOUR!'],
        six:    ['ev-six',    '⬡ SIX!!'],
        wicket: ['ev-wicket', `OUT! ${inn.battingCard.find(b=>b.name===strikerN)?.dismissal || ''}`],
      };
      const [cls, label] = flashMap[chipType] || ['ev-dot', '●'];
      flashEl.className = `live-event-flash show ${cls}`;
      flashEl.textContent = label;

      // ── Completed over → push to recent overs log ──
      if (ballNum === 6) {
        bowStats[bowlerN].overs++;
        const completed = overLog[overNum];
        const oRuns = completed.reduce((s, b) => s + b.runs, 0);
        const oWkts = completed.filter(b => b.type === 'wicket').length;
        const row   = document.createElement('div');
        row.className = 'live-over-log-row';
        const chips2 = completed.map(b => {
          const l = b.type === 'wicket' ? 'W' : b.runs === 0 ? '·' : b.runs;
          return `<div class="ball-chip ${b.type}">${l}</div>`;
        }).join('');
        row.innerHTML = `
          <div class="live-over-num">OV ${overNum}</div>
          <div class="live-over-chips">${chips2}</div>
          <div class="live-over-summary">${oRuns}r${oWkts ? ` ${oWkts}w` : ''} · ${completed[0].bowler.split(' ').pop()}</div>
        `;
        const logContainer = document.getElementById('liveOversLog');
        logContainer.insertBefore(row, logContainer.firstChild);
        // Clear current-over chips for next over
        setTimeout(() => { overChips.innerHTML = ''; }, delay * 0.8);
      }

      ballIdx++;
      liveTimer = setTimeout(tick, delay);
    }

    // Kick off
    tick();
  });
}

// ── Pause between innings ──
function liveInningsBreak(inn1, batFirst, fieldFirst, target, delay) {
  return new Promise(resolve => {
    if (liveAborted) { resolve(); return; }

    // Show a temporary break card inside the live view
    const flash = document.getElementById('liveEventFlash');
    flash.className = 'live-event-flash show ev-six';
    flash.textContent = `INNINGS BREAK — ${TEAM_DISPLAY[fieldFirst]} need ${target}`;

    document.getElementById('liveScoreBig').textContent = `${inn1.runs}/${inn1.wickets}`;
    document.getElementById('liveScoreMeta').textContent =
      `${Math.floor(inn1.balls/6)}.${inn1.balls%6} overs — End of 1st innings`;
    document.getElementById('liveControlsInfo').textContent = 'Innings break…';

    liveTimer = setTimeout(() => {
      flash.className = 'live-event-flash';
      resolve();
    }, delay * 5);
  });
}

// ── After both innings finish, swap to the normal scorecard view ──
function endLiveMatch() {
  document.getElementById('liveEventFlash').className = 'live-event-flash show ev-six';
  document.getElementById('liveEventFlash').textContent = `🏆 ${matchData.winMsg}`;
  document.getElementById('liveControlsInfo').textContent = 'Match complete!';
  document.getElementById('liveStopBtn').textContent = '📊 View Scorecard';
  document.getElementById('liveStopBtn').onclick = showFullScorecard;
}

function showFullScorecard() {
  document.getElementById('liveMatchView').style.display = 'none';
  document.getElementById('matchView').style.display     = 'block';
  renderMatch();
}

function stopLive() {
  liveAborted = true;
  if (liveTimer) clearTimeout(liveTimer);
  liveTimer = null;

  // If match was complete the button becomes "View Scorecard", handled above
  // Otherwise snap to full scorecard immediately
  if (matchData) {
    showFullScorecard();
  } else {
    document.getElementById('liveMatchView').style.display = 'none';
    document.getElementById('preMatch').style.display      = 'block';
  }
}

// ===================================================
//   CUSTOM BOWLING ORDERS
// ===================================================

const DEFAULT_BOWLING_ORDERS = {
  "aqua": [
    "Mohammad Shami", 
    "Pat Cummins", 
    "Mohammad Shami", 
    "Avesh Khan", 
    "Mohammad Shami",
    "Wanindu Hasaranga", 
    "Pat Cummins", 
    "Wanindu Hasaranga", 
    "Avesh Khan", 
    "Wanindu Hasaranga",
    "Pat Cummins", 
    "Avesh Khan", 
    "Wanindu Hasaranga", 
    "Harshal Patel", 
    "Mohammad Shami",
    "Harshal Patel", 
    "Pat Cummins", 
    "Harshal Patel", 
    "Avesh Khan", 
    "Harshal Patel"
  ],
  "anuj": [
    "Trent Boult",
    "Hardik Pandya",
    "Trent Boult",
    "Hardik Pandya",
    "Trent Boult",
    "Will Jacks",
    "Ravi Bishnoi",
    "Will Jacks",
    "Ravi Bishnoi",
    "Mitchell Santner",
    "Jasprit Bumrah",
    "Ravi Bishnoi",
    "Mitchell Santner",
    "Ravi Bishnoi",
    "Mitchell Santner",
    "Jasprit Bumrah",
    "Hardik Pandya",
    "Jasprit Bumrah",
    "Trent Boult",
    "Jasprit Bumrah"
  ],
  "bhukla": [
    // Add Bhukla's permanent 20-over array here...
  ],
   "pranav": [
    "Arshdeep Singh",
    "Ben Dwarshuis",
    "Arshdeep Singh",
    "Ben Dwarshuis",
    "Axar Patel",
    "Kuldeep Yadav",
    "Axar Patel",
    "Kuldeep Yadav",
    "Yuzvendra Chahal",
    "Kuldeep Yadav",
    "Yuzvendra Chahal",
    "Axar Patel",
    "Yuzvendra Chahal",
    "Marcus Stoinis",
    "Ben Dwarshuis",
    "Yuzvendra Chahal",
    "Kuldeep Yadav",
    "Arshdeep Singh",
    "Ben Dwarshuis",
    "Arshdeep Singh"
  ],
   "patake": [
    "Jason Holder",
    "Matheesha Pathirana",
    "Jason Holder",
    "Matheesha Pathirana",
    "Sunil Narine",
    "Rashid Khan",
    "Varun Chakravarthy",
    "Sunil Narine",
    "Rashid Khan",
    "Varun Chakravarthy",
    "Rashid Khan",
    "Varun Chakravarthy",
    "Sunil Narine",
    "Varun Chakravarthy",
    "Rashid Khan",
    "Sunil Narine",
    "Matheesha Pathirana",
    "Jason Holder",
    "Matheesha Pathirana",
    "Jason Holder"
   ]
};

let customBowlingOrders = { ...DEFAULT_BOWLING_ORDERS };

// Try to load saved bowling orders from localStorage
try {
  const savedOrders = JSON.parse(localStorage.getItem('sackssim_bowling_orders'));
  if (savedOrders) {
    // This merges their temporary local changes OVER the permanent defaults
    Object.assign(customBowlingOrders, savedOrders);
  }
} catch (e) {
  console.warn("Could not load custom bowling orders", e);
}

function openBowlingModal() {
  const t1key = document.getElementById('team1Select').value;
  const t2key = document.getElementById('team2Select').value;
  if (!t1key || !t2key) { alert("Please select both teams first!"); return; }

  const t1Name = TEAM_DISPLAY[t1key] || t1key;
  const t2Name = TEAM_DISPLAY[t2key] || t2key;
  const t1Roster = getTeamPlayers(t1key);
  const t2Roster = getTeamPlayers(t2key);

  // Access Control: Check if user is master or owns the specific team
  const isMaster = currentUser && currentUser.access === 'master';
  const canEditT1 = isMaster || (currentUser && currentUser.team === t1key);
  const canEditT2 = isMaster || (currentUser && currentUser.team === t2key);

  document.getElementById('t1BowlSetup').innerHTML = buildBowlingCol(t1Name, t1key, t1Roster, canEditT1);
  document.getElementById('t2BowlSetup').innerHTML = buildBowlingCol(t2Name, t2key, t2Roster, canEditT2);

  document.getElementById('bowlingModalOverlay').classList.add('show');
  document.getElementById('bowlingModal').style.display = 'block';
  
  validateBowlingOrders();
}

function closeBowlingModal() {
  document.getElementById('bowlingModalOverlay').classList.remove('show');
  document.getElementById('bowlingModal').style.display = 'none';
}

function buildBowlingCol(teamName, teamKey, roster, canEdit) {
  let html = `<h3 style="font-family:'Bebas Neue'; color:var(--accent); margin-bottom:16px; letter-spacing:1px; font-size:1.4rem;">${teamName} Bowling</h3>`;
  const currentOrder = customBowlingOrders[teamKey] || [];
  
  for (let i = 1; i <= 20; i++) {
    const prevVal = currentOrder[i - 1] || 'auto';
    const options = `<option value="auto">🤖 Auto (Smart Select)</option>` +
                    roster.map(p => `<option value="${p}" ${prevVal === p ? 'selected' : ''}>${p}</option>`).join('');
    
    // Disable the select element if the user doesn't have permission
    const disabledAttr = canEdit ? '' : 'disabled';
    const opacityStyle = canEdit ? '' : 'opacity:0.6; pointer-events:none;';

    html += `<div style="display:flex; align-items:center; margin-bottom:10px; ${opacityStyle}">
      <div style="width:55px; font-family:'Space Mono', monospace; font-size:0.75rem; color:var(--muted);">Ov ${i}</div>
      <select id="bowl_${teamKey}_${i}" style="margin-bottom:0; padding:8px 12px; flex:1;" onchange="validateBowlingOrders()" ${disabledAttr}>${options}</select>
    </div>`;
  }
  return html;
}

function saveBowlingModal() {
  const t1key = document.getElementById('team1Select').value;
  const t2key = document.getElementById('team2Select').value;
  
  const isMaster = currentUser && currentUser.access === 'master';
  const canEditT1 = isMaster || (currentUser && currentUser.team === t1key);
  const canEditT2 = isMaster || (currentUser && currentUser.team === t2key);

  if (canEditT1) {
    customBowlingOrders[t1key] = [];
    for (let i = 1; i <= 20; i++) customBowlingOrders[t1key].push(document.getElementById(`bowl_${t1key}_${i}`).value);
  }
  
  if (canEditT2) {
    customBowlingOrders[t2key] = [];
    for (let i = 1; i <= 20; i++) customBowlingOrders[t2key].push(document.getElementById(`bowl_${t2key}_${i}`).value);
  }
  
  try {
    localStorage.setItem('sackssim_bowling_orders', JSON.stringify(customBowlingOrders));
  } catch (e) {
    console.warn("Browser blocked saving to localStorage", e);
  }
  
  // --- ADDED FIREBASE SYNC ---
  if (window.db) {
    window.dbSet(window.dbRef(window.db, 'bowling_orders'), customBowlingOrders);
  }
  
  closeBowlingModal();
}

function validateBowlingOrders() {
  const t1key = document.getElementById('team1Select').value;
  const t2key = document.getElementById('team2Select').value;
  let hasErrors = false;
  
  [t1key, t2key].forEach(teamKey => {
    if (!teamKey) return;
    const counts = {};
    let prev = null;
    
    for (let i = 1; i <= 20; i++) {
      const sel = document.getElementById(`bowl_${teamKey}_${i}`);
      if (!sel) continue;
      
      sel.classList.remove('select-error');
      const val = sel.value;
      
      if (val !== 'auto') {
        counts[val] = (counts[val] || 0) + 1;
        if (val === prev) {
          sel.classList.add('select-error');
          const prevSel = document.getElementById(`bowl_${teamKey}_${i-1}`);
          if (prevSel) prevSel.classList.add('select-error');
          hasErrors = true;
        }
      }
      prev = val;
    }
    
    for (let b in counts) {
      if (counts[b] > 4) {
        hasErrors = true;
        for (let i = 1; i <= 20; i++) {
          const sel = document.getElementById(`bowl_${teamKey}_${i}`);
          if (sel && sel.value === b) {
            sel.classList.add('select-error');
          }
        }
      }
    }
  });

  let warnEl = document.getElementById('bowlWarning');
  if (!warnEl) {
    warnEl = document.createElement('span');
    warnEl.id = 'bowlWarning';
    warnEl.style.color = 'var(--danger)';
    warnEl.style.marginRight = '16px';
    warnEl.style.fontSize = '0.85rem';
    warnEl.style.fontFamily = "'Space Mono', monospace";
    
    const footer = document.querySelector('#bowlingModal .modal-footer');
    if (footer) footer.insertBefore(warnEl, footer.firstChild);
  }
  
  warnEl.textContent = hasErrors ? '⚠ Fix red slots (Max 4 overs / No back-to-back)' : '';
}

function renderPointsTable() {
  const log = getMatchLog();
  const container = document.getElementById('groupPointsContainer');
  if (!container) return;

  // Build a standings map per team across all matches
  const table = {};
  const ensureTeam = (key) => {
    if (!table[key]) {
      table[key] = { key, mp:0, w:0, l:0, d:0, pts:0,
                     runsFor:0, ballsFor:0, runsAgainst:0, ballsAgainst:0 };
    }
  };

  log.forEach(m => {
    const a = m.batFirst;
    const b = m.fieldFirst;
    ensureTeam(a); ensureTeam(b);
    const inn1Balls = m.inn1.balls || 120;
    const inn2Balls = m.inn2.balls || 120;

    table[a].mp++;
    table[a].runsFor      += m.inn1.runs;
    table[a].ballsFor     += inn1Balls;
    table[a].runsAgainst  += m.inn2.runs;
    table[a].ballsAgainst += inn2Balls;

    table[b].mp++;
    table[b].runsFor      += m.inn2.runs;
    table[b].ballsFor     += inn2Balls;
    table[b].runsAgainst  += m.inn1.runs;
    table[b].ballsAgainst += inn1Balls;

    if (m.matchWinner === a) {
      table[a].w++; table[a].pts += 2; table[b].l++;
    } else if (m.matchWinner === b) {
      table[b].w++; table[b].pts += 2; table[a].l++;
    } else {
      table[a].d++; table[a].pts += 1;
      table[b].d++; table[b].pts += 1;
    }
  });

  // Calculate NRR for each team
  Object.values(table).forEach(r => {
    const orf = r.ballsFor    > 0 ? r.runsFor    / (r.ballsFor    / 6) : 0;
    const ora = r.ballsAgainst> 0 ? r.runsAgainst/ (r.ballsAgainst/ 6) : 0;
    r.nrr = orf - ora;
  });

  const rankClass = ['gold','silver','bronze'];
  const rowClass  = ['pts-leader','pts-second','pts-third'];

  function buildGroupTable(groupName, teamKeys) {
    const rows = teamKeys.map(key => table[key] || {
      key, mp:0, w:0, l:0, d:0, pts:0, nrr:0
    });

    // Sort: pts desc → nrr desc
    rows.sort((a, b) => b.pts - a.pts || (b.nrr||0) - (a.nrr||0) ||
      (TEAM_DISPLAY[a.key]||a.key).localeCompare(TEAM_DISPLAY[b.key]||b.key));

    const groupColor = (() => {
      const firstKey = teamKeys[0];
      return TEAM_COLORS[firstKey] || 'var(--accent)';
    })();

    return `
      <div class="group-table-section" style="margin-bottom: 28px;">
        <div class="group-table-header" style="border-left: 3px solid ${groupColor}; padding-left: 10px; margin-bottom: 10px;">
          <span style="font-family:'Bebas Neue'; font-size:1.3rem; letter-spacing:2px; color:${groupColor}">${groupName}</span>
        </div>
        <table class="pts-table">
          <thead>
            <tr>
              <th class="pts-th pts-th-rank">#</th>
              <th class="pts-th pts-th-team">Team</th>
              <th class="pts-th pts-th-num">M</th>
              <th class="pts-th pts-th-num">W</th>
              <th class="pts-th pts-th-num">L</th>
              <th class="pts-th pts-th-num">D</th>
              <th class="pts-th pts-th-num pts-pts-col">PTS</th>
              <th class="pts-th pts-th-nrr">NRR</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => {
              const teamName  = TEAM_DISPLAY[r.key] || r.key;
              const teamColor = TEAM_COLORS[r.key]  || 'var(--text)';
              const nrr = r.nrr || 0;
              const nrrStr = nrr >= 0 ? '+' + nrr.toFixed(3) : nrr.toFixed(3);
              const nrrClass = nrr > 0 ? 'pts-nrr-pos' : nrr < 0 ? 'pts-nrr-neg' : 'pts-nrr-zero';
              return `<tr class="pts-row ${rowClass[i] || ''}">
                <td class="pts-td pts-td-rank ${rankClass[i] || ''}">#${i+1}</td>
                <td class="pts-td pts-td-team" style="color:${teamColor}">${teamName}</td>
                <td class="pts-td pts-td-num">${r.mp||0}</td>
                <td class="pts-td pts-td-num">${r.w||0}</td>
                <td class="pts-td pts-td-num">${r.l||0}</td>
                <td class="pts-td pts-td-num">${r.d||0}</td>
                <td class="pts-td pts-td-pts">${r.pts||0}</td>
                <td class="pts-td pts-td-nrr ${nrrClass}">${nrrStr}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = Object.entries(TOURNAMENT_GROUPS)
    .map(([groupName, teamKeys]) => buildGroupTable(groupName, teamKeys))
    .join('');

  // Update subtitle
  const totalMatches = log.length;
  const ptsSubtitle = document.getElementById('ptsSubtitle');
  if (ptsSubtitle) {
    ptsSubtitle.textContent = `${totalMatches} match${totalMatches !== 1 ? 'es' : ''} • 5 Groups`;
  }
}
// ===================================================

let memoryLog = []; // Bulletproof fallback for browser restrictions

function getMatchLog() {
  try {
    const log = localStorage.getItem('iplSimLog');
    return log ? JSON.parse(log) : memoryLog;
  } catch(e) {
    return memoryLog; // Use fallback if browser blocks storage
  }
}

function saveMatchToLog(data) {
  // Save to local storage as backup
  const log = getMatchLog();
  if (!data.id) {
    data.id = Date.now();
    data.date = new Date().toISOString();
  }
  log.push(data);
  localStorage.setItem('iplSimLog', JSON.stringify(log));

  // Sync to Firebase
  if (window.db) {
    window.dbSet(window.dbRef(window.db, 'matches/' + data.id), data);
  }
}

function deleteMatch(id, event) {
  event.stopPropagation(); 
  let log = getMatchLog();
  log = log.filter(m => m.id !== id);
  memoryLog = log;
  try { localStorage.setItem('iplSimLog', JSON.stringify(log)); } catch(e) {}
  
  // --- ADDED FIREBASE SYNC ---
  if (window.db) {
    window.dbSet(window.dbRef(window.db, 'matches/' + id), null);
  }
  
  renderDashboard(); 
}

function clearMatchLog() {
  try { localStorage.removeItem('iplSimLog'); } catch(e) {}
  memoryLog = [];
  
  // --- ADDED FIREBASE SYNC ---
  if (window.db) {
    window.dbSet(window.dbRef(window.db, 'matches'), null);
  }
  
  renderDashboard(); 
}

function loadHistoricalMatch(id) {
  const log = getMatchLog();
  const match = log.find(m => m.id === id);
  if (match) {
    matchData = match;
    toggleDashboard(); 
    document.getElementById('liveMatchView').style.display = 'none';
    renderMatch(); 
  }
}

// ===================================================
//   DASHBOARD LOGIC & RENDER
// ===================================================

function toggleDashboard() {
  const dash = document.getElementById('slideDashboard');
  const overlay = document.getElementById('dashOverlay');
  const isOpen = dash.classList.contains('open');
  
  if (isOpen) {
    dash.classList.remove('open');
    overlay.classList.remove('show');
  } else {
    renderDashboard(); // Refresh data before opening
    dash.classList.add('open');
    overlay.classList.add('show');
  }
}

function switchDashTab(tabId) {
  // Update buttons
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update panels
  document.querySelectorAll('.dash-panel').forEach(p => p.style.display = 'none');
  document.getElementById(tabId + '-panel').style.display = 'block';
}

function renderDashboard() {
  const log = getMatchLog();
  const empty = document.getElementById('dashEmptyState');
  const content = document.getElementById('dashContent');

  // ── Teams & Roster Rendering ──
  const teamsGrid = document.getElementById('teamsGridContainer');
  const rosterContainer = document.getElementById('teamRosterContainer');
  
  // Show grid, hide specific roster on load
  teamsGrid.style.display = 'grid';
  rosterContainer.style.display = 'none';

  teamsGrid.innerHTML = Object.entries(TEAM_DISPLAY).map(([teamKey, teamName]) => {
    const c = TEAM_COLORS[teamKey] || 'var(--accent)';
    return `
      <div class="dash-team-card" style="border-top: 3px solid ${c}" onclick="showTeamRoster('${teamKey}')">
        <div class="dash-team-card-title" style="color:${c}">${teamName}</div>
        <div style="font-size:0.75rem; color:var(--muted); margin-top:8px;">View Squad & Stats ➔</div>
      </div>
    `;
  }).join('');
  
  // Global function to handle clicks
  window.showTeamRoster = (teamKey) => {
    teamsGrid.style.display = 'none';
    rosterContainer.style.display = 'block';
    
    updateHotStreaks(); // Ensure badges are fresh
    const squad = getTeamPlayers(teamKey);
    const tColor = TEAM_COLORS[teamKey] || 'var(--accent)';
    
    // Identify current Cap Holders
    const currentOrangeCap = topBats[0] ? topBats[0][0] : null;
    const currentPurpleCap = topBowlers[0] ? topBowlers[0][0] : null;
    
    let html = `
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 20px;">
        <h2 style="font-family:'Bebas Neue'; font-size: 2.2rem; color:${tColor}; letter-spacing: 2px; margin:0;">${TEAM_DISPLAY[teamKey]} SQUAD</h2>
        <button class="btn btn-secondary" style="width:auto; padding: 8px 16px; font-size:0.8rem;" onclick="document.getElementById('teamsGridContainer').style.display='grid'; document.getElementById('teamRosterContainer').style.display='none';">⬅ Back</button>
      </div>
      <div class="roster-grid">
    `;
    
    squad.forEach(name => {
      const p = PLAYER_DB[name] || { role: 'unknown' };
      const statsBat  = batTotals[teamKey + ':' + name]  || { runs: 0, balls: 0, matches: 0 };
      const statsBowl = bowlTotals[teamKey + ':' + name] || { wickets: 0, runs: 0, overs: 0, matches: 0 };
      
      // Calculate advanced stats
      const sr = statsBat.balls > 0 ? ((statsBat.runs / statsBat.balls) * 100).toFixed(1) : '0.0';
      const eco = statsBowl.overs > 0 ? (statsBowl.runs / statsBowl.overs).toFixed(2) : '0.00';
      const innings = statsBat.innings || 0;
      const dismissals = innings - (statsBat.notOuts || 0);
      // Cricket avg: runs / dismissals; if never dismissed show runs* (not-out)
      const avg = dismissals > 0
        ? (statsBat.runs / dismissals).toFixed(1)
        : innings > 0 ? statsBat.runs + '*' : '—';
      
      // Badges
      const fireIcon = HOT_PLAYERS[name] ? `<span class="fire-badge">🔥 HOT</span>` : '';
      const ocIcon = name === currentOrangeCap ? `<span class="cap-badge oc-badge" title="Orange Cap">🧢</span>` : '';
      const pcIcon = name === currentPurpleCap ? `<span class="cap-badge pc-badge" title="Purple Cap">🧢</span>` : '';
      
      html += `
        <div class="roster-card fade-up" style="border-top-color: ${tColor};">
          <div class="roster-card-header">
            <div class="roster-name">${name} ${ocIcon}${pcIcon}${fireIcon}</div>
            <div class="roster-role">${p.role}</div>
          </div>
          <div class="roster-stats-grid roster-stats-grid--6">
            <div class="r-stat"><div class="r-val" style="color:var(--text)">${innings}</div><div class="r-lbl">INNS</div></div>
            <div class="r-stat"><div class="r-val" style="color:var(--text)">${statsBat.runs}</div><div class="r-lbl">RUNS</div></div>
            <div class="r-stat"><div class="r-val" style="color:var(--accent3)">${avg}</div><div class="r-lbl">AVG</div></div>
            <div class="r-stat"><div class="r-val" style="color:var(--text)">${sr}</div><div class="r-lbl">SR</div></div>
            <div class="r-stat"><div class="r-val" style="color:var(--accent2)">${statsBowl.wickets}</div><div class="r-lbl">WKTS</div></div>
            <div class="r-stat"><div class="r-val" style="color:var(--accent2)">${eco}</div><div class="r-lbl">ECO</div></div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    rosterContainer.innerHTML = html;
  };

  // 1. Force the match count to update immediately
  document.getElementById('dashMatchCount').textContent = `${log.length} match${log.length !== 1 ? 'es' : ''}`;

  // 2. If it's empty, visually clear the stats tab so old data doesn't linger!
  if (log.length === 0) {
    empty.style.display = 'flex';
    content.style.display = 'none';
    
    document.getElementById('ocPlayerName').textContent = '—';
    document.getElementById('ocRuns').textContent = '0';
    document.getElementById('ocMeta').textContent = '—';
    document.getElementById('ocLeaderboard').innerHTML = '';

    document.getElementById('pcPlayerName').textContent = '—';
    document.getElementById('pcWickets').textContent = '0';
    document.getElementById('pcMeta').textContent = '—';
    document.getElementById('pcLeaderboard').innerHTML = '';

    document.getElementById('ssPlayerName').textContent = '—';
    document.getElementById('ssStrikeRate').textContent = '0.0';
    document.getElementById('ssMeta').textContent = 'Min 15 balls faced';
    document.getElementById('ssLeaderboard').innerHTML = '';
    
    return;
  }
  
  empty.style.display = 'none';
  content.style.display = 'block';

  // ── Aggregate player stats across all matches ──
  // Keys are "teamKey:playerName" for team-specific stats
  const batTotals  = {};  // "teamKey:name" → { runs, balls, fours, sixes, matches }
  const bowlTotals = {};  // "teamKey:name" → { wickets, runs, overs, matches }

  log.forEach(match => {
    // Determine which team key each innings belongs to
    const inn1TeamKey = match.batFirst;
    const inn2TeamKey = match.fieldFirst;

    const processInnings = (inn, isBatting, teamKey) => {
      if (isBatting) {
        inn.battingCard.forEach(b => {
          const k = teamKey + ':' + b.name;
          if (!batTotals[k]) batTotals[k] = { runs:0, balls:0, fours:0, sixes:0, matches:0, innings:0, notOuts:0 };
          batTotals[k].runs    += b.runs;
          batTotals[k].balls   += b.balls;
          batTotals[k].fours   += b.fours;
          batTotals[k].sixes   += b.sixes;
          batTotals[k].matches++;
          batTotals[k].innings++;
          if (!b.isOut) batTotals[k].notOuts++;
        });
      } else {
        inn.bowlingCard.forEach(b => {
          const k = teamKey + ':' + b.name;
          if (!bowlTotals[k]) bowlTotals[k] = { wickets:0, runs:0, overs:0, matches:0 };
          bowlTotals[k].wickets += b.wickets;
          bowlTotals[k].runs    += b.runs;
          bowlTotals[k].overs   += parseFloat(b.overs) || 0;
          bowlTotals[k].matches++;
        });
      }
    };
    processInnings(match.inn1, true,  inn1TeamKey);
    processInnings(match.inn2, false, inn1TeamKey);
    processInnings(match.inn2, true,  inn2TeamKey);
    processInnings(match.inn1, false, inn2TeamKey);
  });

  // Flat totals (across all teams) used for leaderboard caps
  const batTotalsFlat  = {};
  const bowlTotalsFlat = {};
  Object.entries(batTotals).forEach(([k, v]) => {
    const name = k.split(':').slice(1).join(':');
    if (!batTotalsFlat[name]) batTotalsFlat[name] = { runs:0, balls:0, fours:0, sixes:0, matches:0, innings:0, notOuts:0 };
    batTotalsFlat[name].runs    += v.runs;
    batTotalsFlat[name].balls   += v.balls;
    batTotalsFlat[name].fours   += v.fours;
    batTotalsFlat[name].sixes   += v.sixes;
    batTotalsFlat[name].matches += v.matches;
    batTotalsFlat[name].innings += v.innings;
    batTotalsFlat[name].notOuts += v.notOuts;
  });
  Object.entries(bowlTotals).forEach(([k, v]) => {
    const name = k.split(':').slice(1).join(':');
    if (!bowlTotalsFlat[name]) bowlTotalsFlat[name] = { wickets:0, runs:0, overs:0, matches:0 };
    bowlTotalsFlat[name].wickets += v.wickets;
    bowlTotalsFlat[name].runs    += v.runs;
    bowlTotalsFlat[name].overs   += v.overs;
    bowlTotalsFlat[name].matches += v.matches;
  });

  // Sort leaderboards (use flat totals — across all teams)
  const topBats = Object.entries(batTotalsFlat).sort((a,b) => b[1].runs - a[1].runs).slice(0, 5);
  const topBowlers = Object.entries(bowlTotalsFlat).sort((a,b) => b[1].wickets - a[1].wickets || (a[1].runs / Math.max(a[1].overs,1)) - (b[1].runs / Math.max(b[1].overs,1))).slice(0, 5);
  
  // Super Striker (Min 15 balls faced)
  const topStrikers = Object.entries(batTotalsFlat)
    .filter(([name, s]) => s.balls >= 15)
    .map(([name, s]) => ({ name, sr: (s.runs / s.balls) * 100, runs: s.runs, balls: s.balls }))
    .sort((a, b) => b.sr - a.sr)
    .slice(0, 5);

  const rankLabels = ['gold','silver','bronze'];

  // ── Orange Cap ──
  const [ocName, ocStats] = topBats[0] || ['—', null];
  document.getElementById('ocPlayerName').textContent = ocName;
  document.getElementById('ocRuns').textContent       = ocStats ? ocStats.runs : '—';
  document.getElementById('ocMeta').textContent       = ocStats ? `${ocStats.matches} innings • avg ${ocStats.balls > 0 ? Math.round((ocStats.runs / ocStats.matches)*10)/10 : '—'} per inn` : '—';
  document.getElementById('ocLeaderboard').innerHTML = topBats.map(([name, s], i) => {
    const avgSR = s.balls > 0 ? Math.round((s.runs / s.balls) * 100) : 0;
    return `<div class="cap-lb-row"><div class="cap-lb-rank ${rankLabels[i] || ''}">#${i+1}</div>
      <div class="cap-lb-name">${name}</div><div class="cap-lb-val orange">${s.runs}</div><div class="cap-lb-sub">SR ${avgSR}</div></div>`;
  }).join('');

  // ── Purple Cap ──
  const [pcName, pcStats] = topBowlers[0] || ['—', null];
  document.getElementById('pcPlayerName').textContent = pcName;
  document.getElementById('pcWickets').textContent    = pcStats ? pcStats.wickets : '—';
  document.getElementById('pcMeta').textContent       = pcStats ? `${pcStats.matches} matches • ${Math.round(pcStats.overs*10)/10} overs` : '—';
  document.getElementById('pcLeaderboard').innerHTML = topBowlers.map(([name, s], i) => {
    const eco = s.overs > 0 ? (s.runs / s.overs).toFixed(2) : '—';
    return `<div class="cap-lb-row"><div class="cap-lb-rank ${rankLabels[i] || ''}">#${i+1}</div>
      <div class="cap-lb-name">${name}</div><div class="cap-lb-val purple">${s.wickets}W</div><div class="cap-lb-sub">eco ${eco}</div></div>`;
  }).join('');

  // ── Cyan Cap (Super Striker) ──
  const ssLeader = topStrikers[0] || null;
  document.getElementById('ssPlayerName').textContent = ssLeader ? ssLeader.name : '—';
  document.getElementById('ssStrikeRate').textContent = ssLeader ? ssLeader.sr.toFixed(1) : '0.0';
  document.getElementById('ssMeta').textContent       = ssLeader ? `${ssLeader.runs} runs off ${ssLeader.balls} balls` : 'Min 15 balls faced';
  document.getElementById('ssLeaderboard').innerHTML = topStrikers.map((s, i) => {
    return `<div class="cap-lb-row"><div class="cap-lb-rank ${rankLabels[i] || ''}">#${i+1}</div>
      <div class="cap-lb-name">${s.name}</div><div class="cap-lb-val cyan">${s.sr.toFixed(1)}</div><div class="cap-lb-sub">${s.balls} balls</div></div>`;
  }).join('');

  // -- Points Table --
  renderPointsTable();

  // ── Match History ──
  document.getElementById('dashMatchCount').textContent = `${log.length} match${log.length !== 1 ? 'es' : ''}`;
  document.getElementById('matchHistoryList').innerHTML = [...log].reverse().map((m, i) => {
    const t1 = TEAM_DISPLAY[m.t1key] || m.t1key;
    const t2 = TEAM_DISPLAY[m.t2key] || m.t2key;
    const c1 = TEAM_COLORS[m.t1key] || '#00d4ff';
    const c2 = TEAM_COLORS[m.t2key] || '#ff6b35';
    const winColor = TEAM_COLORS[m.matchWinner] || 'var(--accent)';
    const dateStr = m.date ? new Date(m.date).toLocaleDateString('en-GB', { day:'numeric', month:'short' }) : 'Just now';
    
    return `<div class="match-hist-row" style="cursor:pointer;" onclick="loadHistoricalMatch(${m.id})">
      <div class="hist-idx">${log.length - i}</div>
      <div class="hist-teams"><span style="color:${c1}">${t1}</span><span style="color:var(--muted);font-family:'Space Mono',monospace;font-size:0.7rem;margin:0 6px">vs</span><span style="color:${c2}">${t2}</span></div>
      <div class="hist-result" style="color:${winColor}">${m.winMsg}</div>
      <div style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--muted);flex-shrink:0">${dateStr}</div>
      <div class="dash-delete-btn" onclick="deleteMatch(${m.id}, event)" title="Delete Match">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
    </div>`;
  }).join('');
}

// ===================================================
//   Hot Streak For players
// ===================================================

let HOT_PLAYERS = {};

function updateHotStreaks() {
  const log = getMatchLog();
  HOT_PLAYERS = {};
  const history = {};
  
  // Collect last 2 performances for every player
  log.slice(-10).forEach(m => {
    [m.inn1, m.inn2].forEach(inn => {
      inn.battingCard.forEach(b => {
        if (!history[b.name]) history[b.name] = { bat: [], bowl: [] };
        history[b.name].bat.push(b.runs);
      });
      inn.bowlingCard.forEach(b => {
        if (!history[b.name]) history[b.name] = { bat: [], bowl: [] };
        history[b.name].bowl.push(b.wickets);
      });
    });
  });

  // Check for Back-to-back 50s OR Back-to-back 3+ Wickets
  for (const [name, h] of Object.entries(history)) {
    let isHotBat = false, isHotBowl = false;
    if (h.bat.length >= 2) {
      const last2 = h.bat.slice(-2);
      if (last2[0] >= 50 && last2[1] >= 50) isHotBat = true;
    }
    if (h.bowl.length >= 2) {
      const last2 = h.bowl.slice(-2);
      if (last2[0] >= 3 && last2[1] >= 3) isHotBowl = true;
    }
    if (isHotBat || isHotBowl) HOT_PLAYERS[name] = { isHotBat, isHotBowl };
  }
}

// UPDATE your existing buildPlayer function to apply the +5 buff
function buildPlayer(d) {
  let p = {
    name:         d.name         || d,
    role:         d.role         || 'batsman',
    bat_subtype:  d.bat_subtype  || 'anchor',
    bowl_subtype: d.bowl_subtype || null,
    bat_rating:   d.bat_rating   ?? 70,
    bowl_rating:  d.bowl_rating  ?? 0,
    strike_rate:  d.strike_rate  ?? 120,
    bowl_style:   d.bowl_style   || 'unknown',
  };
  
  // Apply the Hot Streak Buff! 
  if (HOT_PLAYERS[p.name]) {
    if (HOT_PLAYERS[p.name].isHotBat) p.bat_rating += 5;
    if (HOT_PLAYERS[p.name].isHotBowl) p.bowl_rating += 5;
  }
  return p;
}

// ===================================================
//   FIREBASE BRIDGE
// ===================================================

window.startFirebaseSync = function() {
  if (!window.db) return;

  // 1. Sync Matches (With Corruption Filter!)
  window.dbOnValue(window.dbRef(window.db, 'matches'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // 🛡️ Filter out broken test data that lacks complete innings data
      const allMatches = Object.values(data).filter(m => m && m.id && m.inn1 && m.inn2);
      localStorage.setItem('iplSimLog', JSON.stringify(allMatches));
      
      const dash = document.getElementById('slideDashboard');
      if (dash && dash.classList.contains('open')) renderDashboard();
    } else {
      // If database is completely empty, clear local storage too
      localStorage.removeItem('iplSimLog');
    }
  });

  // 2. Sync Bowling Orders
  window.dbOnValue(window.dbRef(window.db, 'bowling_orders'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.assign(customBowlingOrders, data);
      localStorage.setItem('sackssim_bowling_orders', JSON.stringify(customBowlingOrders));
    }
  });

  // 3. Sync Playing XI Rosters
  window.dbOnValue(window.dbRef(window.db, 'rosters'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.assign(TEAM_ROSTERS, data);
      localStorage.setItem('sackssim_rosters', JSON.stringify(TEAM_ROSTERS));
    }
  });
};

// ===================================================
//   INIT
// ===================================================

window.addEventListener('DOMContentLoaded', async () => {
  populateSelects();
  await loadPlayerData();

  // Show/hide speed selector when live toggle is flipped
  document.getElementById('liveToggle').addEventListener('click', () => {
    setTimeout(() => {
      const on = document.getElementById('liveToggle').classList.contains('on');
      document.getElementById('liveSpeedRow').style.display = on ? 'block' : 'none';
    }, 0);
  });
});
