import { BaseZombie } from './BaseZombie.js'
import { CONFIG } from '../../config.js'

export class NormalZombie extends BaseZombie {
  constructor(scene, row) {
    super(scene, row, CONFIG.ZOMBIES.NORMAL)
  }
}
