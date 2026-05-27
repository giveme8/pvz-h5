import Phaser from 'phaser'
import { CONFIG } from '../config.js'

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    const gameScene = this.scene.get('GameScene')

    // HUD 背景条
    this.add.rectangle(CONFIG.WIDTH / 2, 40, CONFIG.WIDTH, 80, CONFIG.COLORS.UI_BG)

    // 阳光显示
    const sunIcon = this.add.graphics()
    sunIcon.fillStyle(CONFIG.COLORS.SUN_COLOR, 1)
    sunIcon.fillCircle(0, 0, 14)
    sunIcon.x = 740
    sunIcon.y = 40

    this.sunText = this.add.text(760, 30, `☀ ${gameScene.sunSystem.sun}`, {
      fontSize: '22px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 3,
    })

    const onSunChanged = (val) => this.sunText.setText(`☀ ${val}`)
    gameScene.events.on('sunChanged', onSunChanged)

    // 植物选择栏 (左侧竖列)
    this.add.rectangle(60, CONFIG.HEIGHT / 2, 110, CONFIG.HEIGHT, CONFIG.COLORS.UI_BG)

    const plantList = [
      { key: 'sunflower', label: '向日葵\n50☀', color: CONFIG.PLANTS.SUNFLOWER.color },
      { key: 'peashooter', label: '豌豆射手\n100☀', color: CONFIG.PLANTS.PEASHOOTER.color },
      { key: 'wallnut', label: '坚果墙\n50☀', color: CONFIG.PLANTS.WALLNUT.color },
    ]

    this.plantButtons = []
    plantList.forEach((p, i) => {
      const btnY = 110 + i * 110
      const bg = this.add.rectangle(60, btnY, 90, 90, p.color).setInteractive()
      this.add.text(60, btnY + 8, p.label, {
        fontSize: '11px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 2,
        align: 'center',
      }).setOrigin(0.5)

      bg.on('pointerdown', () => {
        gameScene.selectedPlant = p.key
        this.highlightSelected(i)
      })
      bg.on('pointerover', () => bg.setFillStyle(Phaser.Display.Color.ValueToColor(p.color).lighten(20).color))
      bg.on('pointerout', () => bg.setFillStyle(i === this._selectedIndex ? 0xFFFFFF : p.color))

      this.plantButtons.push({ bg, color: p.color })
    })

    this._selectedIndex = -1
    const onPlantDeselected = () => {
      this._selectedIndex = -1
      this.clearHighlight()
    }
    gameScene.events.on('plantDeselected', onPlantDeselected)

    // 波次提示
    this.waveText = this.add.text(CONFIG.WIDTH / 2, 15, '', {
      fontSize: '18px',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    const onWaveStart = (num) => {
      this.waveText.setText(`第 ${num} 波！`)
      this.tweens.add({
        targets: this.waveText,
        alpha: 0,
        delay: 2000,
        duration: 1000,
        onComplete: () => this.waveText.setAlpha(1),
      })
    }
    gameScene.events.on('waveStart', onWaveStart)

    // 场景关闭时移除跨场景事件监听，防止重启时重复绑定
    this.events.once('shutdown', () => {
      gameScene.events.off('sunChanged', onSunChanged)
      gameScene.events.off('plantDeselected', onPlantDeselected)
      gameScene.events.off('waveStart', onWaveStart)
    })
  }

  highlightSelected(index) {
    this._selectedIndex = index
    this.plantButtons.forEach((btn, i) => {
      btn.bg.setFillStyle(i === index ? 0xFFFFFF : btn.color)
    })
  }

  clearHighlight() {
    this.plantButtons.forEach(btn => btn.bg.setFillStyle(btn.color))
  }
}
