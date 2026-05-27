import Phaser from 'phaser'
import { CONFIG } from '../config.js'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data) {
    this.win = data.win
  }

  create() {
    const bgColor = this.win ? 0x2C7A2C : 0x7A2C2C
    this.add.rectangle(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT, bgColor, 0.85)

    const title = this.win ? '🎉 你赢了！' : '💀 游戏结束'
    const color = this.win ? '#FFD700' : '#FF4444'

    this.add.text(CONFIG.WIDTH / 2, 220, title, {
      fontSize: '56px',
      fill: color,
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    const msg = this.win ? '所有僵尸已被消灭，家园得救了！' : '僵尸突破了防线，家园沦陷了...'
    this.add.text(CONFIG.WIDTH / 2, 310, msg, {
      fontSize: '20px',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    const retry = this.add.text(CONFIG.WIDTH / 2, 400, '[ 再来一局 ]', {
      fontSize: '28px',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive()

    retry.on('pointerover', () => retry.setStyle({ fill: color }))
    retry.on('pointerout', () => retry.setStyle({ fill: '#fff' }))
    retry.on('pointerdown', () => this.scene.start('GameScene'))
  }
}
