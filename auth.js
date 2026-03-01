/* ─────────────────────────────────────────
   SACKS SIM — auth.js
   Login & Access Control System
   ───────────────────────────────────────── */

// ===================================================
//   USER CREDENTIALS & ACCESS LEVELS
// ===================================================

const USERS = {
  aqua:   { password: 'aqua123',   access: 'master', team: 'aqua',   displayName: 'Aqua' },
  anuj:   { password: 'lenda45',   access: 'master', team: 'anuj',   displayName: 'Anuj' },
  pranav: { password: 'pranav123', access: 'master', team: null,     displayName: 'Pranav' },
  bhukla: { password: 'bhukla123', access: 'player', team: 'bhukla', displayName: 'Bhukla' },
  patake: { password: 'patake123', access: 'player', team: 'patake', displayName: 'Patake' },
};

// Currently logged-in user state
let currentUser = null;

// ===================================================
//   SESSION MANAGEMENT
// ===================================================

function saveSession(user) {
  sessionStorage.setItem('sackssim_user', JSON.stringify(user));
}

function loadSession() {
  try {
    const data = sessionStorage.getItem('sackssim_user');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function clearSession() {
  sessionStorage.removeItem('sackssim_user');
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
  const bowlBtn = document.querySelector('[onclick="openBowlingModal()"]');
  if (bowlBtn && !isMaster) {
    bowlBtn.style.opacity = '0.4';
    bowlBtn.style.pointerEvents = 'none';
    bowlBtn.title = 'Only master users can set bowling orders';
  }

  // Show "My Team" section for players
  if (!isMaster && currentUser.team) {
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
  const allPlayers = Object.keys(PLAYER_DB).sort();

  container.style.display = 'block';
  container.innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-title">🎯 My Team — ${teamName}</div>
      <div style="font-size:0.72rem; color:var(--muted); font-family:'Space Mono',monospace; margin-bottom:12px;">
        PLAYING XI <span style="color:var(--accent)">${roster.filter(Boolean).length}/11</span>
      </div>
      <div id="playingXiList" class="playing-xi-list"></div>
      <button class="btn btn-primary" style="margin-top:12px; font-size:0.85rem;" onclick="savePlayingXi()">
        💾 Save Playing XI
      </button>
      <div id="xiSaveMsg" style="display:none; margin-top:8px; font-family:'Space Mono',monospace; font-size:0.7rem; color:var(--accent3);">✓ Playing XI saved!</div>
    </div>
  `;

  renderPlayingXiEditor(teamKey, roster, allPlayers);
}

function renderPlayingXiEditor(teamKey, roster, allPlayers) {
  const list = document.getElementById('playingXiList');
  if (!list) return;

  list.innerHTML = '';
  const slots = Array.from({ length: 11 }, (_, i) => roster[i] || '');

  slots.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = 'xi-slot';
    row.innerHTML = `
      <span class="xi-num">${i + 1}</span>
      <select class="xi-select" id="xiSlot_${i}">
        <option value="">— Select Player —</option>
        ${allPlayers.map(p => `<option value="${p}" ${p === player ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
    `;
    list.appendChild(row);
  });
}

function savePlayingXi() {
  if (!currentUser || !currentUser.team) return;
  const teamKey = currentUser.team;

  const newXi = [];
  for (let i = 0; i < 11; i++) {
    const sel = document.getElementById(`xiSlot_${i}`);
    if (sel && sel.value) newXi.push(sel.value);
    else newXi.push('');
  }

  const filled = newXi.filter(Boolean);
  if (filled.length < 11) {
    const missing = 11 - filled.length;
    if (!confirm(`You have ${missing} empty slot(s). Save anyway?`)) return;
  }

  // Update the global roster
  TEAM_ROSTERS[teamKey] = newXi.filter(Boolean);

  // Show save message
  const msg = document.getElementById('xiSaveMsg');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 2500);
  }

  console.log(`[AUTH] ${currentUser.displayName} updated ${teamKey} Playing XI:`, TEAM_ROSTERS[teamKey]);
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