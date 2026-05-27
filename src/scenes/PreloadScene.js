import Phaser from 'phaser'
import { SHEETS, FRAMES } from '../assets/AssetKeys.js'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Progress bar
    const { width, height } = this.cameras.main
    const bar = this.add.graphics()
    const box = this.add.graphics()
    box.fillStyle(0x222222, 0.8)
    box.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    this.load.on('progress', (value) => {
      bar.clear()
      bar.fillStyle(0x5CCC44, 1)
      bar.fillRect(width / 2 - 155, height / 2 - 20, 310 * value, 40)
    })

    this.load.image(SHEETS.CHARACTERS, 'assets/characters.png')
    this.load.image(SHEETS.EFFECTS,    'assets/effects.png')
    this.load.image(SHEETS.TERRAIN,    'assets/terrain.png')
    this.load.image(SHEETS.UI,         'assets/ui.png')
  }

  create() {
    // Register named frames on each texture so entities can reference them by key
    for (const [name, f] of Object.entries(FRAMES)) {
      const tex = this.textures.get(f.sheet)
      if (tex && !tex.has(name)) {
        tex.add(name, 0, f.x, f.y, f.w, f.h)
      }
    }
    this.scene.start('MenuScene')
  }
}
