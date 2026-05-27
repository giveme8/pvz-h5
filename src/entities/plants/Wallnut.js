import { BasePlant } from './BasePlant.js'
import { CONFIG } from '../../config.js'

export class Wallnut extends BasePlant {
  constructor(scene, row, col) {
    super(scene, row, col, CONFIG.PLANTS.WALLNUT)
  }
  // 纯防御型，无需 update 逻辑
}
