/* ─────────────────────────────────────────
   SACKS SIM — auth.js
   Login & Access Control System
   ───────────────────────────────────────── */

// ===================================================
//   USER CREDENTIALS & ACCESS LEVELS
// ===================================================

const USERS = {
  // Masters
  aqua:   { password: 'aqua18',    access: 'master', team: 'aqua',   displayName: 'Aqua' },
  anuj:   { password: 'lenda45',   access: 'master', team: 'anuj',   displayName: 'Anuj' },
  pranav: { password: 'pranav123', access: 'master', team: null,     displayName: 'Pranav' },
  
  // Original Players
  bhukla: { password: 'bhukla123', access: 'player', team: 'bhukla', displayName: 'Bhukla' },
  patake: { password: 'patake123', access: 'player', team: 'patake', displayName: 'Patake' },
  
  // Player for Pranav's team (Since Pranav master is set to null)
  agenda: { password: 'agenda123', access: 'player', team: 'pranav', displayName: 'Agenda Doval' },

  // Group A
  sa:         { password: 'sa123',         access: 'player', team: 'southafrica', displayName: 'South Africa' },
  rcbat:      { password: 'rcbat123',      access: 'player', team: 'rcbat',       displayName: 'RCB AT' },
  thehundred: { password: 'thehundred123', access: 'player', team: 'thehundred',  displayName: 'The Hundred' },

  // Group B
  aus:        { password: 'aus123',        access: 'player', team: 'australia',   displayName: 'Australia' },
  miat:       { password: 'miat123',       access: 'player', team: 'miat',        displayName: 'MI AT' },
  hydat:      { password: 'hydat123',      access: 'player', team: 'hydat',       displayName: 'HYD AT' },

  // Group C
  nz:         { password: 'nz123',         access: 'player', team: 'newzealand',  displayName: 'New Zealand' },
  kkrat:      { password: 'kkrat123',      access: 'player', team: 'kkrat',       displayName: 'KKR AT' },
  sa20:       { password: 'sa20123',       access: 'player', team: 'sa20',        displayName: 'SA20' },

  // Group D
  eng:        { password: 'eng123',        access: 'player', team: 'england',     displayName: 'England' },
  rrat:       { password: 'rrat123',       access: 'player', team: 'rrat',        displayName: 'RR AT' },
  punat:      { password: 'punat123',      access: 'player', team: 'punat',       displayName: 'PUN AT' },

  // Group E
  ind:        { password: 'ind123',        access: 'player', team: 'india',       displayName: 'India' },
  cskat:      { password: 'cskat123',      access: 'player', team: 'cskat',       displayName: 'CSK AT' },
  delat:      { password: 'delat123',      access: 'player', team: 'delat',       displayName: 'DEL AT' }
};

// Currently logged-in user state
let currentUser = null;

// ===================================================
//   SESSION MANAGEMENT
// ===================================================

function saveSession(user) {
  try {
    sessionStorage.setItem('sackssim_user', JSON.stringify(user));
  } catch (e) {
    console.warn("Session storage is blocked. Login will not persist on reload.");
  }
}

function loadSession() {
  try {
    const data = sessionStorage.getItem('sackssim_user');
    return data ? JSON.parse(data) : null;
  } catch (e) { 
    return null; 
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem('sackssim_user');
  } catch (e) {
    // Ignore error
  }
}

// ===================================================
//   LOGIN LOGIC
// ===================================================

function attemptLogin() {
  const usernameEl = document.getElementById('loginUsername');
  const passwordEl = document.getElementById('loginPassword');
  const errorEl    = document.getElementById('loginError');

  const username = usernameEl.value.trim().toLowerCase();
  const password = passwordEl.value;

  errorEl.textContent = '';
  errorEl.style.display = 'none';

  if (!username || !password) {
    showLoginError('Please enter both username and password.');
    return;
  }

  const user = USERS[username];
  if (!user || user.password !== password) {
    showLoginError('Invalid username or password.');
    shakeLoginCard();
    return;
  }

  // Successful login
  currentUser = { username, ...user };
  saveSession(currentUser);
  hideLoginScreen();
  applyAccessRestrictions();
  updateUserBadge();
}

function logout() {
  currentUser = null;
  clearSession();
  showLoginScreen();
  resetAccessRestrictions();
}

function showLoginError(msg) {
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
}

function shakeLoginCard() {
  const card = document.getElementById('loginCard');
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 500);
}

// ===================================================
//   SCREEN TOGGLE
// ===================================================

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appWrapper').style.display  = 'none';
  // Clear fields
  const u = document.getElementById('loginUsername');
  const p = document.getElementById('loginPassword');
  if (u) u.value = '';
  if (p) p.value = '';
  document.getElementById('loginError').style.display = 'none';
}

function hideLoginScreen() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appWrapper').style.display  = 'block';
}

// ===================================================
//   ACCESS CONTROL
// ===================================================

function applyAccessRestrictions() {
  if (!currentUser) return;

  const isMaster = currentUser.access === 'master';

  // Master-only elements
  document.querySelectorAll('[data-master-only]').forEach(el => {
    el.style.display = isMaster ? '' : 'none';
  });

  // Player-only elements (only visible to players, not masters)
  document.querySelectorAll('[data-player-only]').forEach(el => {
    el.style.display = (!isMaster && currentUser.team) ? '' : 'none';
  });

  // Disable simulate button for players
  const simBtn = document.getElementById('simBtn');
  if (simBtn) {
    if (!isMaster) {
      simBtn.disabled = true;
      simBtn.style.opacity = '0.4';
      simBtn.style.cursor  = 'not-allowed';
      simBtn.title = 'Only master users can simulate matches';
    } else {
      simBtn.disabled = false;
      simBtn.style.opacity = '';
      simBtn.style.cursor  = '';
      simBtn.title = '';
    }
  }

  // Sidebar: hide sim controls for players but show team management

   
  // Show Team Management section for all valid users
  if (isMaster || currentUser.team) {
    showPlayerTeamSection();
  }
}

function resetAccessRestrictions() {
  document.querySelectorAll('[data-master-only]').forEach(el => {
    el.style.display = '';
  });
  document.querySelectorAll('[data-player-only]').forEach(el => {
    el.style.display = 'none';
  });
  const simBtn = document.getElementById('simBtn');
  if (simBtn) {
    simBtn.disabled = false;
    simBtn.style.opacity = '';
    simBtn.style.cursor  = '';
  }
}

// ===================================================
//   USER BADGE
// ===================================================

function updateUserBadge() {
  const badge = document.getElementById('userBadge');
  if (!badge || !currentUser) return;

  const accessLabel = currentUser.access === 'master' ? '★ MASTER' : '◆ PLAYER';
  const accessColor = currentUser.access === 'master' ? 'var(--accent)' : 'var(--accent2)';

  badge.innerHTML = `
    <span class="user-badge-name">${currentUser.displayName}</span>
    <span class="user-badge-role" style="color:${accessColor}">${accessLabel}</span>
    <button class="user-badge-logout" onclick="logout()" title="Logout">⏻</button>
  `;
  badge.style.display = 'flex';
}

// ===================================================
//   PLAYING XI MANAGEMENT (Player feature)
// ===================================================

function showPlayerTeamSection() {
  const container = document.getElementById('playerTeamSection');
  if (!container || !currentUser || !currentUser.team) return;

  const teamKey = currentUser.team;
  const teamName = TEAM_DISPLAY[teamKey] || teamKey;
  const roster = TEAM_ROSTERS[teamKey] || [];
  
  // FIX: Force the pool to STRICTLY be the 15 players assigned to this team
  // No falling back to Object.keys(PLAYER_DB) anymore
  const allPlayers = roster.slice().sort();

  container.style.display = 'block';
  container.innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-title">🎯 My Team — ${teamName}</div>
      <div style="font-size:0.72rem; color:var(--muted); font-family:'Space Mono',monospace; margin-bottom:12px;">
        PLAYING XI <span style="color:var(--accent)" id="xiCountBadge">${roster.filter(Boolean).length}/11</span>
      </div>
      <div id="playingXiList" class="playing-xi-list"></div>
      <div class="xi-bench-label">BENCH</div>
      <div id="xiBenchList" class="xi-bench-list"></div>
      <button class="btn btn-primary" style="margin-top:12px; font-size:0.85rem;" onclick="savePlayingXi()">
        💾 Save Playing XI
      </button>
      <div id="xiSaveMsg" style="display:none; margin-top:8px; font-family:'Space Mono',monospace; font-size:0.7rem; color:var(--accent3);">✓ Playing XI saved!</div>
    </div>
  `;

  renderPlayingXiEditor(teamKey, roster, allPlayers);
}

// ── internal drag state ──
let _xiDragSrc = null;        // the element being dragged
let _xiDragSrcZone = null;    // 'xi' | 'bench'
let _xiCurrentOrder = [];     // live working copy of the XI (11 names)
let _xiBench = [];            // players not in the XI

function renderPlayingXiEditor(teamKey, roster, allPlayers) {
  // Build working state
  _xiCurrentOrder = Array.from({ length: 11 }, (_, i) => roster[i] || '').filter(Boolean);
  // Bench = team players not currently in the XI
  const inXi = new Set(_xiCurrentOrder);
  _xiBench = allPlayers.filter(p => !inXi.has(p));

  _rebuildXiDOM();
  _rebuildBenchDOM();
}

function _rebuildXiDOM() {
  const list = document.getElementById('playingXiList');
  if (!list) return;
  list.innerHTML = '';

  _xiCurrentOrder.forEach((player, i) => {
    const row = _makeXiRow(player, i);
    list.appendChild(row);
  });

  // Drop zone at the bottom of XI (when dragging from bench with XI full, swap last)
  list.addEventListener('dragover',  _onXiListDragOver);
  list.addEventListener('drop',      _onXiListDrop);

  _updateCountBadge();
}

function _rebuildBenchDOM() {
  const bench = document.getElementById('xiBenchList');
  if (!bench) return;
  bench.innerHTML = '';

  if (_xiBench.length === 0) {
    bench.innerHTML = '<div style="font-size:0.7rem;color:var(--muted);font-family:\'Space Mono\',monospace;padding:6px 0;">All players in XI</div>';
    return;
  }

  _xiBench.forEach(player => {
    const pill = _makeBenchPill(player);
    bench.appendChild(pill);
  });

  bench.addEventListener('dragover', e => e.preventDefault());
  bench.addEventListener('drop',     _onBenchDrop);
}

function _makeXiRow(player, index) {
  const row = document.createElement('div');
  row.className = 'xi-slot xi-draggable';
  row.draggable = true;
  row.dataset.player = player;
  row.dataset.index  = index;

  row.innerHTML = `
    <span class="xi-drag-handle">⠿</span>
    <span class="xi-num">${index + 1}</span>
    <span class="xi-name">${player}</span>
    <button class="xi-remove-btn" title="Move to bench" onclick="(function(){_xiMoveXiToBench('${player.replace(/'/g,"\\'")}')})()">✕</button>
  `;

  row.addEventListener('dragstart', e => {
    _xiDragSrc     = row;
    _xiDragSrcZone = 'xi';
    row.classList.add('xi-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', player);
  });
  row.addEventListener('dragend', () => {
    row.classList.remove('xi-dragging');
    document.querySelectorAll('.xi-slot').forEach(r => r.classList.remove('xi-drag-over'));
  });
  row.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.xi-slot').forEach(r => r.classList.remove('xi-drag-over'));
    if (row !== _xiDragSrc) row.classList.add('xi-drag-over');
  });
  row.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    row.classList.remove('xi-drag-over');
    if (!_xiDragSrc) return;

    if (_xiDragSrcZone === 'xi') {
      // Reorder within XI
      const fromIdx = parseInt(_xiDragSrc.dataset.index);
      const toIdx   = parseInt(row.dataset.index);
      if (fromIdx === toIdx) return;
      const moved = _xiCurrentOrder.splice(fromIdx, 1)[0];
      _xiCurrentOrder.splice(toIdx, 0, moved);
      _rebuildXiDOM();
    } else if (_xiDragSrcZone === 'bench') {
      // Bench player dropped onto an XI slot → swap
      const benchPlayer = e.dataTransfer.getData('text/plain');
      const toIdx = parseInt(row.dataset.index);
      const displaced = _xiCurrentOrder[toIdx];
      _xiCurrentOrder[toIdx] = benchPlayer;
      _xiBench = _xiBench.filter(p => p !== benchPlayer);
      if (displaced) _xiBench.push(displaced);
      _xiBench.sort();
      _rebuildXiDOM();
      _rebuildBenchDOM();
    }
    _xiDragSrc = null;
  });

  return row;
}

function _makeBenchPill(player) {
  const pill = document.createElement('div');
  pill.className = 'xi-bench-pill';
  pill.draggable = true;
  pill.dataset.player = player;
  pill.textContent = player;

  pill.addEventListener('dragstart', e => {
    _xiDragSrc     = pill;
    _xiDragSrcZone = 'bench';
    pill.classList.add('xi-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', player);
  });
  pill.addEventListener('dragend', () => {
    pill.classList.remove('xi-dragging');
  });

  // Clicking a bench pill also adds to end of XI (if space), pushing last XI player to bench
  pill.addEventListener('click', () => {
    if (_xiCurrentOrder.length < 11) {
      _xiCurrentOrder.push(player);
      _xiBench = _xiBench.filter(p => p !== player);
    } else {
      // XI full — swap with last
      const displaced = _xiCurrentOrder.pop();
      _xiCurrentOrder.push(player);
      _xiBench = _xiBench.filter(p => p !== player);
      _xiBench.push(displaced);
      _xiBench.sort();
    }
    _rebuildXiDOM();
    _rebuildBenchDOM();
  });

  return pill;
}

function _onXiListDragOver(e) { e.preventDefault(); }

function _onXiListDrop(e) {
  // Dropped onto the list background (not on a specific row)
  e.preventDefault();
  if (!_xiDragSrc || _xiDragSrcZone !== 'bench') return;
  const benchPlayer = e.dataTransfer.getData('text/plain');
  if (_xiCurrentOrder.length < 11) {
    _xiCurrentOrder.push(benchPlayer);
    _xiBench = _xiBench.filter(p => p !== benchPlayer);
  } else {
    const displaced = _xiCurrentOrder.pop();
    _xiCurrentOrder.push(benchPlayer);
    _xiBench = _xiBench.filter(p => p !== benchPlayer);
    _xiBench.push(displaced);
    _xiBench.sort();
  }
  _rebuildXiDOM();
  _rebuildBenchDOM();
  _xiDragSrc = null;
}

function _onBenchDrop(e) {
  // XI player dragged to bench → move to bench
  e.preventDefault();
  if (!_xiDragSrc || _xiDragSrcZone !== 'xi') return;
  const player = e.dataTransfer.getData('text/plain');
  _xiMoveXiToBench(player);
  _xiDragSrc = null;
}

function _xiMoveXiToBench(player) {
  _xiCurrentOrder = _xiCurrentOrder.filter(p => p !== player);
  if (!_xiBench.includes(player)) { _xiBench.push(player); _xiBench.sort(); }
  _rebuildXiDOM();
  _rebuildBenchDOM();
}

function _updateCountBadge() {
  const badge = document.getElementById('xiCountBadge');
  if (badge) badge.textContent = `${_xiCurrentOrder.length}/11`;
}

function savePlayingXi() {
  if (!currentUser || !currentUser.team) return;
  const teamKey = currentUser.team; // No need for normalizeTeamKey anymore!

  if (_xiCurrentOrder.length < 11) {
    const missing = 11 - _xiCurrentOrder.length;
    if (!confirm(`You have ${missing} empty slot(s). Save anyway?`)) return;
  }

  // Save selection using the user's direct team key
  TEAM_ROSTERS[teamKey] = [..._xiCurrentOrder, ..._xiBench];

  // Save the updated rosters globally to localStorage
  try {
    localStorage.setItem('sackssim_rosters', JSON.stringify(TEAM_ROSTERS));
  } catch (e) {
    console.warn("Browser blocked saving to localStorage", e);
  }

  // Show save message
  const msg = document.getElementById('xiSaveMsg');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 2500);
  }

  console.log(`[AUTH] ${currentUser.displayName} updated & saved ${teamKey} Playing XI.`);
}

// ===================================================
//   INIT
// ===================================================

function initAuth() {
  // Check for existing session
  const session = loadSession();
  if (session && USERS[session.username]) {
    currentUser = { ...USERS[session.username], username: session.username };
    hideLoginScreen();
    applyAccessRestrictions();
    updateUserBadge();
  } else {
    showLoginScreen();
  }

  // Login form keyboard support
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('keydown', e => {
      if (e.key === 'Enter') attemptLogin();
    });
  }
}

// Run auth init after DOM is ready
document.addEventListener('DOMContentLoaded', initAuth);
