import Phaser from 'phaser'
import { CONFIG } from '../config.js'
import { SHEETS, FRAMES, PLANT_CARDS, SPRITES } from '../assets/AssetKeys.js'

const W = CONFIG.WIDTH
const H = CONFIG.HEIGHT
const HUD_H = CONFIG.GRID.HUD_H       // 72px
const PANEL_W = CONFIG.GRID.SIDEBAR_W // 200px
const CARD_W = 108
const CARD_H = 138

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    const gameScene = this.scene.get('GameScene')

    // ── HUD ─────────────────────────────────────────────────────────────
    this.add.rectangle(W / 2, HUD_H / 2, W, HUD_H, CONFIG.COLORS.UI_BG)
    // Bottom accent line
    this.add.rectangle(W / 2, HUD_H - 2, W, 4, 0x3a8a1a)

    // Wave label (center)
    this.waveLabel = this.add.text(W / 2, HUD_H / 2, '', {
      fontSize: '22px',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    // Sun badge (right)
    const sunBg = this.add.graphics()
    sunBg.fillStyle(0x1a3a0a, 1)
    sunBg.fillCircle(W - 132, HUD_H / 2, 24)
    sunBg.fillStyle(CONFIG.COLORS.SUN_COLOR, 1)
    sunBg.fillCircle(W - 148, HUD_H / 2, 14)

    this.sunText = this.add.text(W - 128, HUD_H / 2, `${gameScene.sunSystem.sun}`, {
      fontSize: '20px',
      fill: '#FFD700',
      stroke: '#1a1a00',
      strokeThickness: 2,
    }).setOrigin(0, 0.5)

    // Pause / settings placeholder buttons
    this.add.text(W - 62, HUD_H / 2, '[⏸]', {
      fontSize: '17px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5)

    this.add.text(W - 22, HUD_H / 2, '[⚙]', {
      fontSize: '17px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5)

    // ── LEFT PANEL ───────────────────────────────────────────────────────
    // Start below HUD so the HUD background color dominates the top-left corner
    this.add.rectangle(PANEL_W / 2, (HUD_H + H) / 2, PANEL_W, H - HUD_H, CONFIG.COLORS.SIDEBAR_BG)
    // Right border
    this.add.rectangle(PANEL_W - 1, (HUD_H + H) / 2, 3, H - HUD_H, 0x3a6a1a)

    const plantList = [
      { key: 'sunflower',  cost: 50,  cardFrame: PLANT_CARDS.sunflower },
      { key: 'peashooter', cost: 100, cardFrame: PLANT_CARDS.peashooter },
      { key: 'wallnut',    cost: 50,  cardFrame: PLANT_CARDS.wallnut },
    ]
    const hasUI = this.textures.exists(SHEETS.UI)
    const cardCX = PANEL_W / 2

    this.plantButtons = []
    plantList.forEach((p, i) => {
      const btnY = 160 + i * 155

      let bg, sprite
      if (hasUI) {
        bg = this.add.image(cardCX, btnY, SHEETS.UI, p.cardFrame)
          .setDisplaySize(CARD_W, CARD_H)
          .setInteractive()
      } else {
        bg = this.add.rectangle(cardCX, btnY, CARD_W, CARD_H, 0xEED9A0).setInteractive()
        const border = this.add.graphics()
        border.lineStyle(3, 0xD4A017, 1)
        border.strokeRoundedRect(cardCX - CARD_W / 2, btnY - CARD_H / 2, CARD_W, CARD_H, 8)
      }

      // Plant sprite in upper card area
      if (SPRITES[p.key] && this.textures.exists(p.key)) {
        sprite = this.add.image(cardCX, btnY - 20, p.key).setDisplaySize(80, 80)
      }

      // Cost label
      this.add.text(cardCX, btnY + 50, `${p.cost}☀`, {
        fontSize: '16px',
        fill: '#FFD700',
        stroke: '#000000',
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
          if (gameScene.sunSystem.sun >= p.cost) bg.setFillStyle(0xF5E8C0)
        })
        bg.on('pointerout', () => bg.setFillStyle(0xEED9A0))
      }

      this.plantButtons.push({ bg, sprite, cost: p.cost, hasUI })
    })

    this._selectedIndex = -1

    // Events
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
      const alpha = isSelected ? 0.7 : canAfford ? 1 : 0.55
      if (btn.bg) btn.bg.setAlpha(alpha)
      if (btn.sprite) btn.sprite.setAlpha(canAfford ? 1 : 0.55)
    })
  }

  highlightSelected(index) {
    this._selectedIndex = index
    this.plantButtons.forEach((btn, i) => {
      if (!btn.hasUI) btn.bg.setFillStyle(i === index ? 0x88FF44 : 0xEED9A0)
      const canAfford = this.scene.get('GameScene').sunSystem.sun >= btn.cost
      btn.bg.setAlpha(i === index ? 0.7 : canAfford ? 1 : 0.55)
    })
  }

  clearHighlight() {
    const sun = this.scene.get('GameScene').sunSystem.sun
    this.plantButtons.forEach((btn) => {
      if (!btn.hasUI) btn.bg.setFillStyle(0xEED9A0)
      const canAfford = sun >= btn.cost
      btn.bg.setAlpha(canAfford ? 1 : 0.55)
      if (btn.sprite) btn.sprite.setAlpha(canAfford ? 1 : 0.55)
    })
  }
}
