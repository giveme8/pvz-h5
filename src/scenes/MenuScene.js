import Phaser from 'phaser'
import { CONFIG } from '../config.js'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    this.add.rectangle(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT, 0x2C7A2C)

    this.add.text(CONFIG.WIDTH / 2, 180, '植物大战僵尸', {
      fontSize: '52px',
      fill: '#FFD700',
      stroke: '#1a4a1a',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(CONFIG.WIDTH / 2, 260, 'H5 MVP', {
      fontSize: '24px',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    const startBtn = this.add.text(CONFIG.WIDTH / 2, 380, '[ 开始游戏 ]', {
      fontSize: '32px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive()

    startBtn.on('pointerover', () => startBtn.setStyle({ fill: '#fff' }))
    startBtn.on('pointerout', () => startBtn.setStyle({ fill: '#FFD700' }))
    startBtn.on('pointerdown', () => this.scene.start('GameScene'))

    this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 40, '点击植物选择 → 点击格子放置 | 保护家园不被僵尸攻破！', {
      fontSize: '14px',
      fill: '#ccc',
    }).setOrigin(0.5)
  }
}
