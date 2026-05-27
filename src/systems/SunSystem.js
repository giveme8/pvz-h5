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
    const g = this.scene.add.graphics()
    g.fillStyle(CONFIG.COLORS.SUN_COLOR, 1)
    g.fillCircle(0, 0, 18)
    g.x = x
    g.y = y

    const targetY = Phaser.Math.Between(CONFIG.GRID.OFFSET_Y, CONFIG.HEIGHT - 60)
    this.scene.tweens.add({
      targets: g,
      y: targetY,
      duration: 2000,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // 使用 zone 让玩家点击收集
        const zone = this.scene.add.zone(g.x, g.y, 40, 40).setInteractive()
        zone.on('pointerdown', () => {
          const fx = g.x
          const fy = g.y
          this.collect(amount)
          g.destroy()
          zone.destroy()
          // 飘字提示（坐标在 destroy 前已保存）
          this.showFloatText(fx, fy, `+${amount}`)
        })
        // 10秒后自动消失（guard 防止已被点击后重复 destroy）
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
