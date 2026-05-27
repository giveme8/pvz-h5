// Sprite sheet frame definitions — single source of truth for all asset coordinates
// All sheets are 1448×1086px

// characters.png — 6 cols × 2 rows, cell = 241×543
const CW = 241, RH = 543

// effects.png — 4 cols × 3 rows, cell = 362×362
// terrain.png  — 4 cols × 3 rows, cell = 362×362
const EW = 362, EH = 362

export const SHEETS = {
  CHARACTERS: 'characters',
  EFFECTS:    'effects',
  TERRAIN:    'terrain',
  UI:         'ui',
}

// Frame definitions: { sheet, x, y, w, h }
export const FRAMES = {
  // Plants (characters row 0)
  peashooter:  { sheet: 'characters', x: 0,      y: 0,  w: CW, h: RH },
  sunflower:   { sheet: 'characters', x: CW,     y: 0,  w: CW, h: RH },
  wallnut:     { sheet: 'characters', x: CW * 2, y: 0,  w: CW, h: RH },

  // Zombies (characters row 1)
  zombie_normal: { sheet: 'characters', x: 0,      y: RH, w: CW, h: RH },
  zombie_cone:   { sheet: 'characters', x: CW,     y: RH, w: CW, h: RH },

  // Projectiles (effects row 0)
  pea:         { sheet: 'effects', x: 0,      y: 0,  w: EW, h: EH },
  ice_ball:    { sheet: 'effects', x: EW,     y: 0,  w: EW, h: EH },

  // Terrain tiles (terrain rows 0–1)
  tile_grass:  { sheet: 'terrain', x: 0,      y: 0,       w: EW, h: EH },
  tile_flower: { sheet: 'terrain', x: EW,     y: 0,       w: EW, h: EH },
  tile_dirt:   { sheet: 'terrain', x: EW * 2, y: 0,       w: EW, h: EH },
  tile_stone:  { sheet: 'terrain', x: EW * 3, y: 0,       w: EW, h: EH },
  tile_meadow: { sheet: 'terrain', x: 0,      y: EH,      w: EW, h: EH },
  tile_sand:   { sheet: 'terrain', x: EW * 3, y: EH,      w: EW, h: EH },

  // UI — plant card frames (top row, 6 cards each ~241×400)
  card_green:  { sheet: 'ui', x: 0,      y: 0, w: 241, h: 380 },
  card_gold:   { sheet: 'ui', x: 241,    y: 0, w: 241, h: 380 },
  card_brown:  { sheet: 'ui', x: 482,    y: 0, w: 241, h: 380 },
  card_blue:   { sheet: 'ui', x: 723,    y: 0, w: 241, h: 380 },
  card_purple: { sheet: 'ui', x: 964,    y: 0, w: 241, h: 380 },
  card_red:    { sheet: 'ui', x: 1205,   y: 0, w: 243, h: 380 },
}

// Plant key → card frame mapping
export const PLANT_CARDS = {
  sunflower:   'card_gold',
  peashooter:  'card_green',
  wallnut:     'card_brown',
}
