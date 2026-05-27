import { CONFIG } from '../../config.js'

export class Pea {
  constructor(scene, x, y, row, damage, speed) {
    this.scene = scene
    this.row = row
    this.damage = damage
    this.speed = speed
    this.isDead = false

    this.body = scene.add.graphics()
    this.body.fillStyle(0x228B22, 1)
    this.body.fillCircle(0, 0, 8)
    this.body.x = x
    this.body.y = y
  }

  update(time, delta) {
    if (this.isDead) return
    this.body.x += this.speed * (delta / 1000)

    // 飞出屏幕
    if (this.body.x > CONFIG.WIDTH + 20) {
      this.destroy()
      return
    }

    // 碰撞检测
    for (const zombie of this.scene.zombies) {
      if (zombie.isDead || zombie.row !== this.row) continue
      const dist = Math.abs(this.body.x - zombie.x)
      if (dist < 25) {
        zombie.takeDamage(this.damage)
        this.destroy()
        return
      }
    }
  }

  destroy() {
    this.isDead = true
    this.body.destroy()
  }
}
