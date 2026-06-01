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
};

function initGame() {
  applyPhaseUI();
  document.getElementById('type-table').addEventListener('click', onCellClick);
}

function onCellClick(e) {
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
}

function cellKey(cell) {
  return `${cell.dataset.atk}-${cell.dataset.def}`;
}

function applyPhaseUI() {
  const phase = PHASES[state.phaseIndex];
  document.body.className = phase.cssClass;
  document.getElementById('phase-number').textContent = `Phase ${state.phaseIndex + 1} / 3`;
  document.getElementById('phase-symbol').textContent = phase.symbol;
  document.getElementById('phase-label').textContent = phase.label;
  document.getElementById('phase-instruction').textContent = phase.instruction;
}
