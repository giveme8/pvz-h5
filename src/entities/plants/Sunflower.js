import { BasePlant } from './BasePlant.js'
import { CONFIG } from '../../config.js'

export class Sunflower extends BasePlant {
  constructor(scene, row, col) {
    super(scene, row, col, CONFIG.PLANTS.SUNFLOWER)
    this.lastProduceTime = scene.time.now
  }

  update(time, delta) {
    if (time - this.lastProduceTime >= this.config.sunProduceInterval) {
      this.lastProduceTime = time
      this.scene.sunSystem.spawnSunAt(this.x, this.y, this.config.sunProduceAmount)
    }
  }
}
