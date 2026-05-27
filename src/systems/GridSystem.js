import { CONFIG } from '../config.js'

const { GRID } = CONFIG

// Alternate grass/flower by checkerboard — these keys are loaded as individual images
const TILE_KEYS = ['tile_grass', 'tile_flower']

export class GridSystem {
  constructor(scene) {
    this.scene = scene
    this.grid = Array.from({ length: GRID.ROWS }, () => Array(GRID.COLS).fill(null))
    this.tileSprites = []
    this.hoverGraphics = scene.add.graphics()
    this.drawGrid()
  }

  cellToWorld(row, col) {
    return {
      x: GRID.OFFSET_X + col * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
      y: GRID.OFFSET_Y + row * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
    }
  }

  worldToCell(worldX, worldY) {
    const col = Math.floor((worldX - GRID.OFFSET_X) / GRID.CELL_SIZE)
    const row = Math.floor((worldY - GRID.OFFSET_Y) / GRID.CELL_SIZE)
    if (row < 0 || row >= GRID.ROWS || col < 0 || col >= GRID.COLS) return null
    return { row, col }
  }

  isOccupied(row, col) {
    return this.grid[row][col] !== null
  }

  place(row, col, plant) {
    this.grid[row][col] = plant
  }

  remove(row, col) {
    this.grid[row][col] = null
  }

  getPlant(row, col) {
    return this.grid[row][col]
  }

  // 返回某行内所有植物，按列从右到左（离僵尸最近的先）
  getPlantsInRow(row) {
    const plants = []
    for (let col = GRID.COLS - 1; col >= 0; col--) {
      if (this.grid[row][col]) plants.push(this.grid[row][col])
    }
    return plants
  }

  drawGrid() {
    const cs = GRID.CELL_SIZE
    const gridW = GRID.COLS * cs
    const gridH = GRID.ROWS * cs
    const gx = GRID.OFFSET_X
    const gy = GRID.OFFSET_Y

    if (this.scene.textures.exists('tile_grass')) {
      // tileSprite covers entire grid; scale tiles to cell size (texture is ~362px raw)
      const ts = this.scene.add.tileSprite(gx + gridW / 2, gy + gridH / 2, gridW, gridH, 'tile_grass')
      const grassFrame = this.scene.textures.getFrame('tile_grass')
      const texW = grassFrame ? grassFrame.realWidth : 362
      ts.setTileScale(cs / texW, cs / texW)

      // Checkerboard overlay: semi-transparent flower tiles on alternating cells
      if (this.scene.textures.exists('tile_flower')) {
        for (let row = 0; row < GRID.ROWS; row++) {
          for (let col = 0; col < GRID.COLS; col++) {
            if ((row + col) % 2 === 0) continue
            const x = gx + col * cs + cs / 2
            const y = gy + row * cs + cs / 2
            const overlay = this.scene.add.image(x, y, 'tile_flower')
            overlay.setDisplaySize(cs, cs).setAlpha(0.85)
            this.tileSprites.push(overlay)
          }
        }
      }
    } else {
      // Fallback: solid color checkerboard
      const bg = this.scene.add.graphics()
      for (let row = 0; row < GRID.ROWS; row++) {
        for (let col = 0; col < GRID.COLS; col++) {
          const color = (row + col) % 2 === 0 ? CONFIG.COLORS.GRID_EVEN : CONFIG.COLORS.GRID_ODD
          bg.fillStyle(color, 1)
          bg.fillRect(gx + col * cs, gy + row * cs, cs, cs)
        }
      }
    }
  }

  highlightCell(row, col, valid) {
    this.hoverGraphics.clear()
    if (row === null) return
    const color = valid ? 0x88FF44 : 0xFF4444
    this.hoverGraphics.fillStyle(color, 0.4)
    this.hoverGraphics.fillRect(
      GRID.OFFSET_X + col * GRID.CELL_SIZE,
      GRID.OFFSET_Y + row * GRID.CELL_SIZE,
      GRID.CELL_SIZE - 1,
      GRID.CELL_SIZE - 1
    )
  }
}
