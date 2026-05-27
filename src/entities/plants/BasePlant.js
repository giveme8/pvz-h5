import { CONFIG } from '../../config.js'

export class BasePlant {
  constructor(scene, row, col, plantConfig) {
    this.scene = scene
    this.row = row
    this.col = col
    this.config = plantConfig
    this.hp = plantConfig.hp
    this.maxHp = plantConfig.hp
    this.isDead = false

    const { x, y } = scene.gridSystem.cellToWorld(row, col)
    this.x = x
    this.y = y

    // 主体图形（色块占位，前端-小张后续替换为精灵图）
    this.body = scene.add.graphics()
    this.drawBody()

    // 血条
    this.hpBar = scene.add.graphics()
    this.drawHpBar()
  }

  drawBody() {
    const s = CONFIG.GRID.CELL_SIZE
    this.body.clear()
    this.body.fillStyle(this.config.color, 1)
    this.body.fillRoundedRect(this.x - s / 2 + 4, this.y - s / 2 + 4, s - 8, s - 8, 8)
  }

  drawHpBar() {
    const ratio = this.hp / this.maxHp
    const w = CONFIG.GRID.CELL_SIZE - 12
    this.hpBar.clear()
    // 背景
    this.hpBar.fillStyle(0x333333, 1)
    this.hpBar.fillRect(this.x - w / 2, this.y + 32, w, 5)
    // 血量
    const color = ratio > 0.5 ? CONFIG.COLORS.HP_GREEN : ratio > 0.25 ? 0xFFAA00 : CONFIG.COLORS.HP_RED
    this.hpBar.fillStyle(color, 1)
    this.hpBar.fillRect(this.x - w / 2, this.y + 32, w * ratio, 5)
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount)
    this.drawHpBar()
    if (this.hp <= 0) this.die()
  }

  die() {
    if (this.isDead) return
    this.isDead = true
    this.body.destroy()
    this.hpBar.destroy()
    this.scene.gridSystem.remove(this.row, this.col)
    this.scene.events.emit('plantDied', this)
  }

  update(time, delta) {}

  destroy() {
    this.body.destroy()
    this.hpBar.destroy()
  }
}
