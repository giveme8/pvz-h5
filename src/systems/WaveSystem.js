import { CONFIG } from '../config.js'

export class WaveSystem {
  constructor(scene) {
    this.scene = scene
    this.currentWave = 0
    this.waveActive = false
    this.zombiesAlive = 0
    this.totalZombiesSpawned = 0

    this.scene.events.on('zombieDied', () => {
      this.zombiesAlive--
      this.checkWaveEnd()
    })
  }

  start() {
    this.scheduleNextWave()
  }

  scheduleNextWave() {
    if (this.currentWave >= CONFIG.WAVES.length) return
    const wave = CONFIG.WAVES[this.currentWave]
    this.scene.time.delayedCall(wave.delay, () => this.spawnWave(wave))
  }

  spawnWave(wave) {
    this.waveActive = true
    const waveNum = this.currentWave + 1
    this.scene.events.emit('waveStart', waveNum)

    let spawnOffset = 0
    for (const group of wave.zombies) {
      for (let i = 0; i < group.count; i++) {
        this.scene.time.delayedCall(spawnOffset, () => {
          const row = Phaser.Math.Between(0, CONFIG.GRID.ROWS - 1)
          this.scene.events.emit('spawnZombie', { type: group.type, row })
          this.zombiesAlive++
          this.totalZombiesSpawned++
        })
        spawnOffset += group.interval
      }
    }
    this.currentWave++
  }

  checkWaveEnd() {
    if (this.waveActive && this.zombiesAlive <= 0) {
      this.waveActive = false
      if (this.currentWave >= CONFIG.WAVES.length) {
        this.scene.events.emit('victory')
      } else {
        this.scheduleNextWave()
      }
    }
  }
}
