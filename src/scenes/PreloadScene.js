import Phaser from 'phaser'
import { SPRITES, SHEETS, FRAMES } from '../assets/AssetKeys.js'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const { width, height } = this.cameras.main
    const bar = this.add.graphics()
    const box = this.add.graphics()
    box.fillStyle(0x222222, 0.8)
    box.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)
    this.add.text(width / 2, height / 2 - 50, '加载中...', {
      fontSize: '18px', fill: '#fff',
    }).setOrigin(0.5)

    this.load.on('progress', (value) => {
      bar.clear()
      bar.fillStyle(0x5CCC44, 1)
      bar.fillRect(width / 2 - 155, height / 2 - 20, 310 * value, 40)
    })

    // Load each individual sprite by its key
    for (const [key, { path }] of Object.entries(SPRITES)) {
      this.load.image(key, path)
    }

    // Load UI sheet (still a full sheet with frame offsets)
    this.load.image(SHEETS.UI, 'assets/ui.png')
  }

  create() {
    // Register named frames on UI texture
    const uiTex = this.textures.get(SHEETS.UI)
    for (const [name, f] of Object.entries(FRAMES)) {
      if (uiTex && !uiTex.has(name)) {
        uiTex.add(name, 0, f.x, f.y, f.w, f.h)
      }
    }
    console.log('sun_orb loaded:', this.textures.exists('sun_orb'))
    this.scene.start('MenuScene')
  }
}
