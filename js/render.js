function buildTable() {
  const table = document.getElementById('type-table');

  // Header row: empty corner + attacking type labels
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const cornerTh = document.createElement('th');
  cornerTh.className = 'corner';
  cornerTh.innerHTML = '<span class="axis-label def-label">DEF →</span><span class="axis-label atk-label">↓ ATT</span>';
  headerRow.appendChild(cornerTh);

  TYPES.forEach(type => {
    const th = document.createElement('th');
    th.className = 'col-header';
    const badge = document.createElement('span');
    badge.className = 'type-badge';
    badge.textContent = type.fr;
    badge.style.backgroundColor = type.color;
    th.appendChild(badge);
    headerRow.appendChild(th);
  });

  // Empty header above the counter column
  headerRow.appendChild(document.createElement('th'));

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Data rows: attacking type label + cells (defenders are columns)
  const tbody = document.createElement('tbody');

  TYPES.forEach((atkType, atkIdx) => {
    const row = document.createElement('tr');

    // Row header: attacking type
    const rowTh = document.createElement('th');
    rowTh.className = 'row-header';
    const badge = document.createElement('span');
    badge.className = 'type-badge';
    badge.textContent = atkType.fr;
    badge.style.backgroundColor = atkType.color;
    rowTh.appendChild(badge);
    row.appendChild(rowTh);

    // Cells: one per defending type
    TYPES.forEach((_, defIdx) => {
      const td = document.createElement('td');
      td.className = 'game-cell';
      td.dataset.value = TYPE_CHART[atkIdx][defIdx];
      td.dataset.atk = atkIdx;
      td.dataset.def = defIdx;
      row.appendChild(td);
    });

    // Counter cell at end of row (keyed by attacker)
    const counterTd = document.createElement('td');
    counterTd.className = 'row-counter';
    counterTd.dataset.atk = atkIdx;
    row.appendChild(counterTd);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}

function effectivenessClass(value) {
  if (value === 0)   return 'eff-zero';
  if (value === 0.5) return 'eff-half';
  if (value === 2)   return 'eff-double';
  return 'eff-normal';
}

function cellLabel(value) {
  if (value === 0)   return '✕';
  if (value === 0.5) return '½';
  if (value === 2)   return '2';
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  buildTable();
  initGame();
});
