// Asset key constants — generated sprites live in public/assets/sprites/
// Characters sheet was 6 cols × 2 rows (row 0: plants, row 1: zombies)
// Effects sheet was 4 cols × 3 rows
// Terrain sheet was 4 cols × 3 rows

// Individual sprite keys (loaded as separate images in PreloadScene)
export const SPRITES = {
  // Plants (characters row 0: char-1 to char-6)
  peashooter:    { path: 'assets/sprites/characters/char-1.png' },
  sunflower:     { path: 'assets/sprites/characters/char-2.png' },
  wallnut:       { path: 'assets/sprites/characters/char-3.png' },

  // Zombies (characters row 1: char-7 to char-12)
  zombie_normal: { path: 'assets/sprites/characters/char-7.png' },
  zombie_cone:   { path: 'assets/sprites/characters/char-8.png' },

  // Projectiles (effects row 0: fx-1=pea green, fx-2=ice ball)
  pea:           { path: 'assets/sprites/effects/fx-1.png' },

  // Terrain tiles (tile-1..4: row 0, tile-5..8: row 1)
  tile_grass:    { path: 'assets/sprites/terrain/tile-1.png' },
  tile_flower:   { path: 'assets/sprites/terrain/tile-2.png' },
  tile_dirt:     { path: 'assets/sprites/terrain/tile-3.png' },
  tile_stone:    { path: 'assets/sprites/terrain/tile-4.png' },
  tile_meadow:   { path: 'assets/sprites/terrain/tile-5.png' },
  tile_sand:     { path: 'assets/sprites/terrain/tile-8.png' },
}

// Sprite sheet references for UI elements (loaded as full sheets, referenced by frame)
// UI sheet still uses sheet + frame approach since layout is non-uniform
export const SHEETS = {
  UI: 'ui',
}

// UI plant card frames within ui.png (top row, 6 cards each ~241×380px)
const CUW = 241
export const FRAMES = {
  card_green:  { sheet: 'ui', x: 0,         y: 0, w: CUW, h: 380 },
  card_gold:   { sheet: 'ui', x: CUW,       y: 0, w: CUW, h: 380 },
  card_brown:  { sheet: 'ui', x: CUW * 2,   y: 0, w: CUW, h: 380 },
  card_blue:   { sheet: 'ui', x: CUW * 3,   y: 0, w: CUW, h: 380 },
  card_purple: { sheet: 'ui', x: CUW * 4,   y: 0, w: CUW, h: 380 },
  card_red:    { sheet: 'ui', x: CUW * 5,   y: 0, w: 243, h: 380 },
}

export const PLANT_CARDS = {
  sunflower:  'card_gold',
  peashooter: 'card_green',
  wallnut:    'card_brown',
}
