import { BaseZombie } from './BaseZombie.js'
import { CONFIG } from '../../config.js'

export class ConeZombie extends BaseZombie {
  constructor(scene, row) {
    super(scene, row, CONFIG.ZOMBIES.CONE)
  }
}
