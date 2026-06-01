const PHASES = [
  {
    value: 0,
    label: 'Aucun effet',
    symbol: '×0',
    cssClass: 'phase-zero',
    instruction: 'Clique sur toutes les cases où l\'attaque n\'a aucun effet sur le type défenseur.',
  },
  {
    value: 2,
    label: 'Super efficace',
    symbol: '×2',
    cssClass: 'phase-double',
    instruction: 'Clique sur toutes les cases où l\'attaque est super efficace.',
  },
  {
    value: 0.5,
    label: 'Peu efficace',
    symbol: '×½',
    cssClass: 'phase-half',
    instruction: 'Clique sur toutes les cases où l\'attaque est peu efficace.',
  },
];

const state = {
  phaseIndex: 0,
  selected: new Set(),
  mode: 'playing', // 'playing' | 'validated'
};

function initGame() {
  applyPhaseUI();
  document.getElementById('type-table').addEventListener('click', onCellClick);
  document.getElementById('validate-btn').addEventListener('click', onValidateClick);
}

// ── Button handler ──────────────────────────────────────────────────────────

function onValidateClick() {
  if (state.mode === 'playing') validatePhase();
  else nextPhase();
}

// ── Cell interaction ────────────────────────────────────────────────────────

function onCellClick(e) {
  if (state.mode !== 'playing') return;
  const cell = e.target.closest('.game-cell');
  if (!cell) return;
  const key = cellKey(cell);
  if (state.selected.has(key)) {
    state.selected.delete(key);
    cell.classList.remove('selected');
  } else {
    state.selected.add(key);
    cell.classList.add('selected');
  }
  updateCounters();
}

function cellKey(cell) {
  return `${cell.dataset.atk}-${cell.dataset.def}`;
}

// ── Validation ──────────────────────────────────────────────────────────────

function validatePhase() {
  state.mode = 'validated';
  const phase = PHASES[state.phaseIndex];
  let correct = 0, missed = 0, wrong = 0;

  document.querySelectorAll('.game-cell').forEach(cell => {
    const value   = parseFloat(cell.dataset.value);
    const isTarget   = value === phase.value;
    const isSelected = state.selected.has(cellKey(cell));

    if (isTarget && isSelected) {
      cell.classList.add('cell-correct');
      cell.textContent = cellSymbol(value);
      correct++;
    } else if (isTarget && !isSelected) {
      cell.classList.add('cell-missed');
      cell.textContent = cellSymbol(value);
      missed++;
    } else if (!isTarget && isSelected) {
      cell.classList.remove('selected');
      cell.classList.add('cell-wrong');
      wrong++;
    }
  });

  // Hide counters
  document.querySelectorAll('.row-counter').forEach(c => { c.textContent = ''; });

  // Score in phase indicator
  const total = correct + missed;
  const parts = [`<strong>${correct} / ${total}</strong> trouvées`];
  if (wrong  > 0) parts.push(`<span class="score-wrong">${wrong} en trop</span>`);
  if (missed > 0) parts.push(`<span class="score-missed">${missed} manquées</span>`);
  document.getElementById('phase-instruction').innerHTML = parts.join(' · ');

  const isLast = state.phaseIndex === PHASES.length - 1;
  document.getElementById('validate-btn').textContent = isLast ? 'Voir le résultat →' : 'Phase suivante →';
}

// ── Phase transition ─────────────────────────────────────────────────────────

function nextPhase() {
  state.phaseIndex++;
  state.selected.clear();
  state.mode = 'playing';

  document.querySelectorAll('.game-cell').forEach(cell => {
    cell.className = 'game-cell';
    cell.textContent = '';
  });

  document.getElementById('validate-btn').textContent = 'Valider la phase';

  if (state.phaseIndex < PHASES.length) {
    applyPhaseUI();
  } else {
    showFinalTable();
  }
}

// ── Final reveal (tâche 8) ──────────────────────────────────────────────────

function showFinalTable() {
  // placeholder — à implémenter
}

// ── UI helpers ───────────────────────────────────────────────────────────────

function applyPhaseUI() {
  const phase = PHASES[state.phaseIndex];
  document.body.className = phase.cssClass;
  document.getElementById('phase-number').textContent = `Phase ${state.phaseIndex + 1} / 3`;
  document.getElementById('phase-symbol').textContent = phase.symbol;
  document.getElementById('phase-label').textContent  = phase.label;
  document.getElementById('phase-instruction').textContent = phase.instruction;
  updateCounters();
}

function updateCounters() {
  const phaseValue = PHASES[state.phaseIndex].value;
  document.querySelectorAll('.row-counter').forEach(counter => {
    const defIdx = parseInt(counter.dataset.def);
    let remaining = 0;
    TYPES.forEach((_, atkIdx) => {
      if (TYPE_CHART[atkIdx][defIdx] === phaseValue && !state.selected.has(`${atkIdx}-${defIdx}`)) {
        remaining++;
      }
    });
    counter.textContent = remaining > 0 ? remaining : '';
    counter.classList.toggle('counter-done', remaining === 0);
  });
}

function cellSymbol(value) {
  if (value === 0)   return '✕';
  if (value === 0.5) return '½';
  if (value === 2)   return '2';
  return '';
}
