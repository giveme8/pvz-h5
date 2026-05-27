import Phaser from 'phaser'
import { CONFIG } from '../config.js'
import { GridSystem } from '../systems/GridSystem.js'
import { SunSystem } from '../systems/SunSystem.js'
import { WaveSystem } from '../systems/WaveSystem.js'
import { Sunflower } from '../entities/plants/Sunflower.js'
import { Peashooter } from '../entities/plants/Peashooter.js'
import { Wallnut } from '../entities/plants/Wallnut.js'
import { NormalZombie } from '../entities/zombies/NormalZombie.js'
import { ConeZombie } from '../entities/zombies/ConeZombie.js'
import { TypingSystem } from '../systems/TypingSystem.js'

const PLANT_MAP = {
  sunflower: Sunflower,
  peashooter: Peashooter,
  wallnut: Wallnut,
}

const ZOMBIE_MAP = {
  NORMAL: NormalZombie,
  CONE: ConeZombie,
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.plants = []
    this.zombies = []
    this.projectiles = []
    this.selectedPlant = null
  }

  create() {
    // 重置游戏状态（支持重玩）
    this.plants = []
    this.zombies = []
    this.projectiles = []
    this.selectedPlant = null
    this.gameEnded = false

    // 背景
    this.add.rectangle(
      CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2,
      CONFIG.WIDTH, CONFIG.HEIGHT,
      CONFIG.COLORS.BG
    )

    // 网格外框（深色石头边框）
    const gx = CONFIG.GRID.OFFSET_X
    const gy = CONFIG.GRID.OFFSET_Y
    const gw = CONFIG.GRID.COLS * CONFIG.GRID.CELL_SIZE
    const gh = CONFIG.GRID.ROWS * CONFIG.GRID.CELL_SIZE
    const border = this.add.graphics()
    border.fillStyle(0x3B2A1A, 1)
    border.fillRect(gx - 8, gy - 8, gw + 16, gh + 16)
    border.fillStyle(0x5A3E2B, 1)
    border.fillRect(gx - 4, gy - 4, gw + 8, gh + 8)

    // 系统初始化
    this.gridSystem = new GridSystem(this)
    this.sunSystem = new SunSystem(this)
    this.waveSystem = new WaveSystem(this)
    if (this.typingSystem) this.typingSystem.destroy()
    this.typingSystem = CONFIG.TYPING_ENABLED ? new TypingSystem(this) : null

    // 事件绑定（先 off 再 on，防止重玩时重复绑定）
    this.events.off('spawnZombie').on('spawnZombie', ({ type, row }) => this.spawnZombie(type, row))
    this.events.off('gameOver').on('gameOver', () => {
      if (this.gameEnded) return
      this.gameEnded = true
      this.scene.start('GameOverScene', { win: false })
    })
    this.events.off('victory').on('victory', () => {
      if (this.gameEnded) return
      this.gameEnded = true
      this.scene.start('GameOverScene', { win: true })
    })

    // 网格点击放置植物（input 每次 create 会重置，直接 on 即可）
    this.input.on('pointerdown', (pointer) => this.handleClick(pointer))
    this.input.on('pointermove', (pointer) => this.handleHover(pointer))

    // 启动 UIScene（重玩时先停后启，确保重新初始化）
    this.scene.stop('UIScene')
    this.scene.launch('UIScene')

    // 开始波次
    this.waveSystem.start()
  }

  handleClick(pointer) {
    if (!this.selectedPlant) return
    const cell = this.gridSystem.worldToCell(pointer.x, pointer.y)
    if (!cell) return
    if (this.gridSystem.isOccupied(cell.row, cell.col)) return

    const plantCfg = CONFIG.PLANTS[this.selectedPlant.toUpperCase()]
    if (!plantCfg) return
    if (!this.sunSystem.spend(plantCfg.cost)) return

    const PlantClass = PLANT_MAP[this.selectedPlant]
    const plant = new PlantClass(this, cell.row, cell.col)
    this.gridSystem.place(cell.row, cell.col, plant)
    this.plants.push(plant)

    this.gridSystem.highlightCell(null, null, true)
    this.selectedPlant = null
    this.events.emit('plantDeselected')
  }

  handleHover(pointer) {
    if (!this.selectedPlant) return
    const cell = this.gridSystem.worldToCell(pointer.x, pointer.y)
    if (!cell) {
      this.gridSystem.highlightCell(null, null, true)
      return
    }
    const valid = !this.gridSystem.isOccupied(cell.row, cell.col)
    this.gridSystem.highlightCell(cell.row, cell.col, valid)
  }

  spawnZombie(type, row) {
    const ZombieClass = ZOMBIE_MAP[type]
    if (!ZombieClass) return
    const zombie = new ZombieClass(this, row)
    this.zombies.push(zombie)
  }

  update(time, delta) {
    if (this.typingSystem) this.typingSystem.update()

    // 更新植物
    for (const plant of this.plants) {
      if (!plant.isDead) plant.update(time, delta)
    }

    // 更新僵尸
    for (const zombie of this.zombies) {
      if (!zombie.isDead) zombie.update(time, delta)
    }

    // 更新投射物
    for (const pea of this.projectiles) {
      if (!pea.isDead) pea.update(time, delta)
    }

    // 清理死亡对象
    this.plants = this.plants.filter(p => !p.isDead)
    this.zombies = this.zombies.filter(z => !z.isDead)
    this.projectiles = this.projectiles.filter(p => !p.isDead)
  }
}
