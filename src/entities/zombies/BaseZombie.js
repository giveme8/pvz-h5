import { CONFIG } from '../../config.js'

export class BaseZombie {
  constructor(scene, row, zombieConfig) {
    this.scene = scene
    this.row = row
    this.config = zombieConfig
    this.hp = zombieConfig.hp
    this.maxHp = zombieConfig.hp
    this.speed = zombieConfig.speed
    this.isDead = false
    this.isAttacking = false
    this.lastAttackTime = 0
    this.targetPlant = null

    const { y } = scene.gridSystem.cellToWorld(row, 0)
    this.x = CONFIG.WIDTH + 40
    this.y = y

    this.body = scene.add.image(this.x, this.y, zombieConfig.key)
      .setDisplaySize(48, 72)
      .setOrigin(0.5)
      .setFlipX(true)

    this.hpBar = scene.add.graphics()
    this.drawHpBar()

    scene.events.emit('zombieSpawned', this)
  }

  drawHpBar() {
    const ratio = this.hp / this.maxHp
    const w = 44
    this.hpBar.clear()
    this.hpBar.fillStyle(0x333333, 1)
    this.hpBar.fillRect(this.x - w / 2, this.y - 52, w, 5)
    const color = ratio > 0.5 ? CONFIG.COLORS.HP_GREEN : ratio > 0.25 ? 0xFFAA00 : CONFIG.COLORS.HP_RED
    this.hpBar.fillStyle(color, 1)
    this.hpBar.fillRect(this.x - w / 2, this.y - 52, w * ratio, 5)
  }

  update(time, delta) {
    if (this.isDead) return

    // 检查前方是否有植物阻挡
    const cell = this.scene.gridSystem.worldToCell(this.x, this.y)
    this.targetPlant = null

    if (cell) {
      const plant = this.scene.gridSystem.getPlant(cell.row, cell.col)
      if (plant && !plant.isDead) {
        this.targetPlant = plant
      }
    }

    if (this.targetPlant) {
      // 攻击
      if (time - this.lastAttackTime >= this.config.attackInterval) {
        this.lastAttackTime = time
        this.targetPlant.takeDamage(this.config.damage)
      }
    } else {
      // 向左移动
      this.x -= this.speed * (delta / 1000)

      // 僵尸到达草坪左侧 → 游戏失败
      if (this.x < CONFIG.GRID.OFFSET_X - 40) {
        this.scene.events.emit('gameOver')
        return
      }
    }

    this.body.setPosition(this.x, this.y)
    this.drawHpBar()
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) this.die()
  }

  die() {
    if (this.isDead) return
    this.isDead = true
    this.body.destroy()
    this.hpBar.destroy()
    this.scene.events.emit('zombieDied', this)
  }

  destroy() {
    this.body.destroy()
    this.hpBar.destroy()
  }
}
