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
    const hasTerrain = this.scene.textures.exists('tile_grass')
    for (let row = 0; row < GRID.ROWS; row++) {
      for (let col = 0; col < GRID.COLS; col++) {
        const x = GRID.OFFSET_X + col * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
        const y = GRID.OFFSET_Y + row * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
        if (hasTerrain) {
          const tileKey = TILE_KEYS[(row + col) % 2]
          const tile = this.scene.add.image(x, y, tileKey)
          tile.setDisplaySize(GRID.CELL_SIZE, GRID.CELL_SIZE)
          this.tileSprites.push(tile)
        } else {
          if (!this.graphics) this.graphics = this.scene.add.graphics()
          const color = (row + col) % 2 === 0 ? CONFIG.COLORS.GRID_EVEN : CONFIG.COLORS.GRID_ODD
          this.graphics.fillStyle(color, 1)
          this.graphics.fillRect(x - GRID.CELL_SIZE / 2, y - GRID.CELL_SIZE / 2, GRID.CELL_SIZE - 1, GRID.CELL_SIZE - 1)
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
