const TYPES = [
  { id: 'normal',    fr: 'Normal',    color: '#9FA19F' },
  { id: 'fire',      fr: 'Feu',       color: '#E62829' },
  { id: 'water',     fr: 'Eau',       color: '#2980EF' },
  { id: 'electric',  fr: 'Électrik',  color: '#FAC000' },
  { id: 'grass',     fr: 'Plante',    color: '#3FA129' },
  { id: 'ice',       fr: 'Glace',     color: '#3DCEF3' },
  { id: 'fighting',  fr: 'Combat',    color: '#FF8000' },
  { id: 'poison',    fr: 'Poison',    color: '#9141CB' },
  { id: 'ground',    fr: 'Sol',       color: '#915121' },
  { id: 'flying',    fr: 'Vol',       color: '#81B9EF' },
  { id: 'psychic',   fr: 'Psy',       color: '#EF4179' },
  { id: 'bug',       fr: 'Insecte',   color: '#91A119' },
  { id: 'rock',      fr: 'Roche',     color: '#AFA981' },
  { id: 'ghost',     fr: 'Spectre',   color: '#704170' },
  { id: 'dragon',    fr: 'Dragon',    color: '#5060E1' },
  { id: 'dark',      fr: 'Ténèbres',  color: '#624D4E' },
  { id: 'steel',     fr: 'Acier',     color: '#60A1B8' },
  { id: 'fairy',     fr: 'Fée',       color: '#EF70EF' },
];

// chart[attacker][defender] = effectiveness multiplier
// Types order: Normal, Feu, Eau, Électrik, Plante, Glace, Combat, Poison,
//              Sol, Vol, Psy, Insecte, Roche, Spectre, Dragon, Ténèbres, Acier, Fée
const TYPE_CHART = [
  // atk: Normal
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
  // atk: Feu
  [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
  // atk: Eau
  [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
  // atk: Électrik
  [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
  // atk: Plante
  [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
  // atk: Glace
  [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
  // atk: Combat
  [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
  // atk: Poison
  [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
  // atk: Sol
  [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
  // atk: Vol
  [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
  // atk: Psy
  [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
  // atk: Insecte
  [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
  // atk: Roche
  [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
  // atk: Spectre
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
  // atk: Dragon
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
  // atk: Ténèbres
  [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 0.5, 1, 2, 1, 0.5, 1, 0.5],
  // atk: Acier
  [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
  // atk: Fée
  [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1],
];
