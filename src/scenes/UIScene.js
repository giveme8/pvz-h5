import Phaser from 'phaser'
import { CONFIG } from '../config.js'
import { SHEETS, FRAMES, PLANT_CARDS, SPRITES } from '../assets/AssetKeys.js'

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    const gameScene = this.scene.get('GameScene')

    // HUD 背景条
    this.add.rectangle(CONFIG.WIDTH / 2, 34, CONFIG.WIDTH, 68, CONFIG.COLORS.UI_BG)

    // 波次标签（持久显示）
    this.waveLabel = this.add.text(CONFIG.WIDTH / 2, 34, '', {
      fontSize: '20px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    // 阳光徽章（右侧）
    const badgeBg = this.add.graphics()
    badgeBg.fillStyle(0x1a5c1a, 1)
    badgeBg.fillCircle(0, 0, 26)
    badgeBg.fillStyle(CONFIG.COLORS.SUN_COLOR, 1)
    badgeBg.fillCircle(-8, 0, 13)
    badgeBg.x = 820
    badgeBg.y = 34

    this.sunText = this.add.text(836, 24, `${gameScene.sunSystem.sun}`, {
      fontSize: '22px',
      fill: '#FFD700',
      stroke: '#1a1a00',
      strokeThickness: 3,
    }).setOrigin(0, 0.5)

    // 植物选择栏（左侧竖列）
    this.add.rectangle(58, CONFIG.HEIGHT / 2, 112, CONFIG.HEIGHT, CONFIG.COLORS.UI_BG)

    const plantList = [
      { key: 'sunflower',  cost: 50,  color: CONFIG.PLANTS.SUNFLOWER.color,  cardFrame: PLANT_CARDS.sunflower },
      { key: 'peashooter', cost: 100, color: CONFIG.PLANTS.PEASHOOTER.color, cardFrame: PLANT_CARDS.peashooter },
      { key: 'wallnut',    cost: 50,  color: CONFIG.PLANTS.WALLNUT.color,    cardFrame: PLANT_CARDS.wallnut },
    ]
    const hasUI = this.textures.exists(SHEETS.UI)

    this.plantButtons = []
    plantList.forEach((p, i) => {
      const btnY = 110 + i * 110

      let bg, sprite
      if (hasUI) {
        bg = this.add.image(58, btnY, SHEETS.UI, p.cardFrame)
          .setDisplaySize(92, 102)
          .setInteractive()
        if (SPRITES[p.key] && this.textures.exists(p.key)) {
          sprite = this.add.image(58, btnY - 12, p.key).setDisplaySize(54, 54)
        }
      } else {
        bg = this.add.rectangle(58, btnY, 90, 90, p.color).setInteractive()
      }

      this.add.text(58, btnY + 32, `${p.cost}☀`, {
        fontSize: '13px',
        fill: '#FFD700',
        stroke: '#000',
        strokeThickness: 2,
        align: 'center',
      }).setOrigin(0.5)

      bg.on('pointerdown', () => {
        if (gameScene.sunSystem.sun < p.cost) return
        gameScene.selectedPlant = p.key
        this.highlightSelected(i)
      })
      if (!hasUI) {
        bg.on('pointerover', () => {
          if (gameScene.sunSystem.sun >= p.cost) bg.setFillStyle(Phaser.Display.Color.ValueToColor(p.color).lighten(20).color)
        })
        bg.on('pointerout', () => bg.setFillStyle(i === this._selectedIndex ? 0xFFFFFF : p.color))
      }

      this.plantButtons.push({ bg, sprite, cost: p.cost, color: p.color, hasUI })
    })

    this._selectedIndex = -1

    const onSunChanged = (val) => {
      this.sunText.setText(`${val}`)
      this._updateCardAffordance(val)
    }
    gameScene.events.on('sunChanged', onSunChanged)
    this._updateCardAffordance(gameScene.sunSystem.sun)

    const onPlantDeselected = () => {
      this._selectedIndex = -1
      this.clearHighlight()
    }
    gameScene.events.on('plantDeselected', onPlantDeselected)

    const onWaveStart = (num) => {
      this.waveLabel.setText(`第 ${num} 波！`)
    }
    gameScene.events.on('waveStart', onWaveStart)

    this.events.once('shutdown', () => {
      gameScene.events.off('sunChanged', onSunChanged)
      gameScene.events.off('plantDeselected', onPlantDeselected)
      gameScene.events.off('waveStart', onWaveStart)
    })
  }

  _updateCardAffordance(sun) {
    this.plantButtons.forEach((btn, i) => {
      const canAfford = sun >= btn.cost
      const isSelected = i === this._selectedIndex
      const alpha = isSelected ? 0.7 : canAfford ? 1 : 0.4
      if (btn.bg) btn.bg.setAlpha(alpha)
      if (btn.sprite) btn.sprite.setAlpha(canAfford ? 1 : 0.35)
    })
  }

  highlightSelected(index) {
    this._selectedIndex = index
    this.plantButtons.forEach((btn, i) => {
      if (!btn.hasUI) btn.bg.setFillStyle(i === index ? 0xFFFFFF : btn.color)
      btn.bg.setAlpha(i === index ? 0.7 : (this._canAffordBtn(i) ? 1 : 0.4))
    })
  }

  _canAffordBtn(i) {
    const gameScene = this.scene.get('GameScene')
    return gameScene.sunSystem.sun >= this.plantButtons[i].cost
  }

  clearHighlight() {
    const gameScene = this.scene.get('GameScene')
    const sun = gameScene.sunSystem.sun
    this.plantButtons.forEach((btn, i) => {
      if (!btn.hasUI) btn.bg.setFillStyle(btn.color)
      btn.bg.setAlpha(sun >= btn.cost ? 1 : 0.4)
      if (btn.sprite) btn.sprite.setAlpha(sun >= btn.cost ? 1 : 0.35)
    })
  }
}
