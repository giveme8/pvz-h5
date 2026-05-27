import Phaser from 'phaser'
import { CONFIG } from '../config.js'

export class SunSystem {
  constructor(scene) {
    this.scene = scene
    this.sun = CONFIG.SUN.INITIAL

    // 天降阳光定时器
    this.scene.time.addEvent({
      delay: CONFIG.SUN.DROP_INTERVAL,
      callback: this.dropSun,
      callbackScope: this,
      loop: true,
    })
  }

  dropSun() {
    const x = Phaser.Math.Between(CONFIG.GRID.OFFSET_X, CONFIG.WIDTH - 60)
    const y = -20
    this.spawnSunAt(x, y, CONFIG.SUN.DROP_AMOUNT)
  }

  spawnSunAt(x, y, amount) {
    const hasSunSprite = this.scene.textures.exists('sun_orb')
    let g
    if (hasSunSprite) {
      g = this.scene.add.image(x, y, 'sun_orb').setDisplaySize(48, 48).setOrigin(0.5)
    } else {
      const inner = this.scene.add.graphics().fillStyle(0xFFD700, 1).fillCircle(0, 0, 22)
      const outer = this.scene.add.graphics().fillStyle(0xFFA500, 0.4).fillCircle(0, 0, 28)
      g = this.scene.add.container(x, y, [outer, inner])
    }

    const targetY = Phaser.Math.Between(CONFIG.GRID.OFFSET_Y, CONFIG.HEIGHT - 60)
    this.scene.tweens.add({
      targets: g,
      y: targetY,
      duration: 2000,
      ease: 'Quad.easeOut',
      onComplete: () => {
        const zone = this.scene.add.zone(g.x, g.y, 48, 48).setInteractive()
        zone.on('pointerdown', () => {
          const fx = g.x, fy = g.y
          this.collect(amount)
          zone.destroy()
          this.scene.tweens.add({
            targets: g,
            scaleX: 1.5, scaleY: 1.5, alpha: 0,
            duration: 280,
            onComplete: () => { if (g.active) g.destroy() },
          })
          this.showFloatText(fx, fy, `+${amount}`)
        })
        this.scene.time.delayedCall(10000, () => {
          if (g.active) g.destroy()
          if (zone.active) zone.destroy()
        })
      },
    })
  }

  collect(amount) {
    this.sun += amount
    this.scene.events.emit('sunChanged', this.sun)
  }

  spend(amount) {
    if (this.sun < amount) return false
    this.sun -= amount
    this.scene.events.emit('sunChanged', this.sun)
    return true
  }

  canAfford(amount) {
    return this.sun >= amount
  }

  showFloatText(x, y, text) {
    const t = this.scene.add.text(x, y, text, {
      fontSize: '20px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)
    this.scene.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => t.destroy(),
    })
  }
}
