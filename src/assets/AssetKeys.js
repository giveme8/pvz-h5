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
  // Sun drop — golden glow ball (effects row 0, col 3)
  sun_orb:       { path: 'assets/sprites/effects/fx-4.png' },

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

// UI frames within ui.png — measured via alpha-channel pixel analysis
const CUW = 241
export const FRAMES = {
  // Plant card slots (top section y=56..369, 6 cards)
  card_green:  { sheet: 'ui', x: 0,         y: 56, w: CUW, h: 314 },
  card_gold:   { sheet: 'ui', x: CUW,       y: 56, w: CUW, h: 314 },
  card_brown:  { sheet: 'ui', x: CUW * 2,   y: 56, w: CUW, h: 314 },
  card_blue:   { sheet: 'ui', x: CUW * 3,   y: 56, w: CUW, h: 314 },
  card_purple: { sheet: 'ui', x: CUW * 4,   y: 56, w: CUW, h: 314 },
  card_red:    { sheet: 'ui', x: CUW * 5,   y: 56, w: 243, h: 314 },

  // Circle buttons (measured: y=433..560, each ~143×128)
  btn_pause:    { sheet: 'ui', x: 493, y: 433, w: 143, h: 128 },
  btn_settings: { sheet: 'ui', x: 673, y: 433, w: 143, h: 128 },
  btn_back:     { sheet: 'ui', x: 853, y: 434, w: 142, h: 127 },

  // HUD progress bar icons (measured: sun=y413, coin=y548, heart=y680)
  icon_sun:     { sheet: 'ui', x: 1063, y: 413, w: 122, h: 124 },
  icon_coin:    { sheet: 'ui', x: 1062, y: 548, w: 103, h: 103 },
  icon_heart:   { sheet: 'ui', x: 1062, y: 680, w:  97, h:  97 },

  // Full HUD bar rows (icon + bar combined, for use as full bar background)
  bar_sun:      { sheet: 'ui', x: 1063, y: 413, w: 341, h: 124 },
  bar_coin:     { sheet: 'ui', x: 1062, y: 548, w: 342, h: 103 },
  bar_heart:    { sheet: 'ui', x: 1062, y: 680, w: 342, h:  97 },
}

export const PLANT_CARDS = {
  sunflower:  'card_gold',
  peashooter: 'card_green',
  wallnut:    'card_brown',
}
