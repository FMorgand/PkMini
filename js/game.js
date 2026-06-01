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
  mode: 'playing', // 'playing' | 'validated' | 'complete'
  scores: [],      // [{correct, missed, wrong, total, missedCells, wrongCells}]
};

function initGame() {
  applyPhaseUI();
  document.getElementById('type-table').addEventListener('click', onCellClick);
  document.getElementById('validate-btn').addEventListener('click', onValidateClick);
}

// ── Button handler ──────────────────────────────────────────────────────────

function onValidateClick() {
  if      (state.mode === 'playing')   validatePhase();
  else if (state.mode === 'validated') nextPhase();
  else if (state.mode === 'complete')  resetGame();
}

// ── Cell interaction ────────────────────────────────────────────────────────

function onCellClick(e) {
  if (state.mode !== 'playing') return;
  const cell = e.target.closest('.game-cell');
  if (!cell) return;
  if (cell.classList.contains('cell-correct') ||
      cell.classList.contains('cell-missed')  ||
      cell.classList.contains('cell-revealed')) return;
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
  const missedCells = [];
  const wrongCells  = [];

  document.querySelectorAll('.game-cell').forEach(cell => {
    const value      = parseFloat(cell.dataset.value);
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
      missedCells.push({ atkIdx: parseInt(cell.dataset.atk), defIdx: parseInt(cell.dataset.def) });
    } else if (!isTarget && isSelected) {
      cell.classList.remove('selected');
      cell.classList.add('cell-wrong');
      wrong++;
      wrongCells.push({ atkIdx: parseInt(cell.dataset.atk), defIdx: parseInt(cell.dataset.def) });
    }
  });

  document.querySelectorAll('.row-counter').forEach(c => { c.textContent = ''; });

  const total = correct + missed;
  const parts = [`<strong>${correct} / ${total}</strong> trouvées`];
  if (wrong  > 0) parts.push(`<span class="score-wrong">${wrong} en trop</span>`);
  if (missed > 0) parts.push(`<span class="score-missed">${missed} manquées</span>`);
  document.getElementById('phase-instruction').innerHTML = parts.join(' · ');

  state.scores.push({ correct, missed, wrong, total, missedCells, wrongCells });

  const isLast = state.phaseIndex === PHASES.length - 1;
  document.getElementById('validate-btn').textContent = isLast ? 'Voir le résultat →' : 'Phase suivante →';
}

// ── Phase transition ──────────────────────────────────────────────────────────

function nextPhase() {
  state.phaseIndex++;
  state.selected.clear();
  state.mode = 'playing';

  document.querySelectorAll('.game-cell').forEach(cell => {
    if (cell.classList.contains('cell-revealed')) {
      // Already converted in a prior transition — leave untouched
    } else if (cell.classList.contains('cell-correct') || cell.classList.contains('cell-missed')) {
      const value = parseFloat(cell.dataset.value);
      cell.className = 'game-cell cell-revealed ' + revealClass(value);
      cell.textContent = cellSymbol(value);
    } else {
      cell.className = 'game-cell';
      cell.textContent = '';
    }
  });

  document.getElementById('validate-btn').textContent = 'Valider la phase';

  if (state.phaseIndex < PHASES.length) {
    applyPhaseUI();
  } else {
    showFinalTable();
  }
}

// ── Final reveal ────────────────────────────────────────────────────────────

function showFinalTable() {
  state.mode = 'complete';
  document.body.className = 'phase-complete';

  // Reveal all cells not yet locked
  document.querySelectorAll('.game-cell').forEach(cell => {
    if (!cell.classList.contains('cell-revealed')) {
      const value = parseFloat(cell.dataset.value);
      cell.className = 'game-cell ' + revealClass(value);
      cell.textContent = cellSymbol(value);
    }
  });

  // Re-apply error styles from all phases on top of natural colors
  state.scores.forEach(({ wrongCells, missedCells }) => {
    wrongCells.forEach(({ atkIdx, defIdx }) => {
      const cell = document.querySelector(`.game-cell[data-atk="${atkIdx}"][data-def="${defIdx}"]`);
      if (cell) { cell.className = 'game-cell cell-wrong'; cell.textContent = ''; }
    });
    missedCells.forEach(({ atkIdx, defIdx }) => {
      const cell = document.querySelector(`.game-cell[data-atk="${atkIdx}"][data-def="${defIdx}"]`);
      if (cell) {
        const value = parseFloat(cell.dataset.value);
        cell.className = 'game-cell cell-missed';
        cell.textContent = cellSymbol(value);
      }
    });
  });

  document.querySelectorAll('.row-counter').forEach(c => { c.textContent = ''; });

  const totalCorrect = state.scores.reduce((s, p) => s + p.correct, 0);
  const totalCells   = state.scores.reduce((s, p) => s + p.total,   0);
  const totalWrong   = state.scores.reduce((s, p) => s + p.wrong,   0);

  document.getElementById('phase-number').textContent = 'Bravo !';
  document.getElementById('phase-symbol').textContent = '★';
  document.getElementById('phase-label').textContent  = 'Table complète';

  const parts = [`<strong>${totalCorrect} / ${totalCells}</strong> cases trouvées`];
  if (totalWrong > 0) parts.push(`<span class="score-wrong">${totalWrong} erreur${totalWrong > 1 ? 's' : ''}</span>`);
  else parts.push('<span class="score-perfect">Parfait !</span>');
  document.getElementById('phase-instruction').innerHTML = parts.join(' · ');

  document.getElementById('validate-btn').textContent = 'Rejouer';

  buildErrorList();
}

function buildErrorList() {
  const container = document.getElementById('error-list');
  const hasErrors = state.scores.some(s => s.wrongCells.length > 0 || s.missedCells.length > 0);

  if (!hasErrors) {
    container.style.display = 'none';
    return;
  }

  let html = '<h3>Détail des erreurs</h3>';

  state.scores.forEach((score, i) => {
    if (score.wrongCells.length === 0 && score.missedCells.length === 0) return;
    const phase = PHASES[i];
    html += `<div class="error-phase">
      <h4><span class="error-phase-symbol">${phase.symbol}</span> ${phase.label}</h4>
      <ul>`;

    score.wrongCells.forEach(({ atkIdx, defIdx }) => {
      html += `<li class="err-item err-wrong-item">
        <span class="err-type" style="background:${TYPES[atkIdx].color}">${TYPES[atkIdx].fr}</span>
        <span class="err-arrow">→</span>
        <span class="err-type" style="background:${TYPES[defIdx].color}">${TYPES[defIdx].fr}</span>
        <span class="err-tag err-tag-wrong">sélectionné à tort</span>
      </li>`;
    });

    score.missedCells.forEach(({ atkIdx, defIdx }) => {
      html += `<li class="err-item err-missed-item">
        <span class="err-type" style="background:${TYPES[atkIdx].color}">${TYPES[atkIdx].fr}</span>
        <span class="err-arrow">→</span>
        <span class="err-type" style="background:${TYPES[defIdx].color}">${TYPES[defIdx].fr}</span>
        <span class="err-tag err-tag-missed">manquée</span>
      </li>`;
    });

    html += '</ul></div>';
  });

  container.innerHTML = html;
  container.style.display = 'block';
}

// ── Reset ────────────────────────────────────────────────────────────────────

function resetGame() {
  state.phaseIndex = 0;
  state.selected.clear();
  state.mode = 'playing';
  state.scores = [];

  document.querySelectorAll('.game-cell').forEach(cell => {
    cell.className = 'game-cell';
    cell.textContent = '';
  });

  const errorList = document.getElementById('error-list');
  errorList.innerHTML = '';
  errorList.style.display = 'none';

  document.getElementById('validate-btn').textContent = 'Valider la phase';
  applyPhaseUI();
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
    const atkIdx = parseInt(counter.dataset.atk);
    let total = 0, selectedInRow = 0;
    TYPES.forEach((_, defIdx) => {
      if (TYPE_CHART[atkIdx][defIdx] === phaseValue) total++;
      if (state.selected.has(`${atkIdx}-${defIdx}`)) selectedInRow++;
    });
    const remaining = Math.max(0, total - selectedInRow);
    counter.textContent = remaining > 0 ? remaining : '';
    counter.classList.toggle('counter-done', remaining === 0);
  });
}

function revealClass(value) {
  if (value === 0)   return 'reveal-zero';
  if (value === 0.5) return 'reveal-half';
  if (value === 2)   return 'reveal-double';
  return 'reveal-normal';
}

function cellSymbol(value) {
  if (value === 0)   return '✕';
  if (value === 0.5) return '½';
  if (value === 2)   return '2';
  return '';
}
