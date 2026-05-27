import { BaseZombie } from './BaseZombie.js'
import { CONFIG } from '../../config.js'

export class ConeZombie extends BaseZombie {
  constructor(scene, row) {
    super(scene, row, CONFIG.ZOMBIES.CONE)
  }

  drawBody() {
    super.drawBody()
    // 绘制路障（橙色圆锥）
    this.body.fillStyle(0xFF8C00, 1)
    this.body.fillTriangle(
      this.x - 14, this.y - 28,
      this.x + 14, this.y - 28,
      this.x, this.y - 52,
    )
  }
}
