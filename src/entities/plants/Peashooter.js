import { BasePlant } from './BasePlant.js'
import { CONFIG } from '../../config.js'
import { Pea } from '../projectiles/Pea.js'

export class Peashooter extends BasePlant {
  constructor(scene, row, col) {
    super(scene, row, col, CONFIG.PLANTS.PEASHOOTER)
    this.lastFireTime = 0
  }

  update(time, delta) {
    if (time - this.lastFireTime < this.config.fireInterval) return

    // 检查同行是否有僵尸
    const zombiesInRow = this.scene.zombies.filter(z => z.row === this.row && !z.isDead && z.x > this.x)
    if (zombiesInRow.length === 0) return

    this.lastFireTime = time
    const pea = new Pea(this.scene, this.x, this.y, this.row, this.config.projectileDamage, this.config.projectileSpeed)
    this.scene.projectiles.push(pea)
  }
}
