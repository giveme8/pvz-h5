const WORD_LISTS = {
  zombie_normal: ['sun', 'eat', 'run', 'dig', 'hit', 'bite', 'grab', 'claw', 'slow', 'moan'],
  zombie_cone:   ['stomp', 'smash', 'devour', 'shamble', 'stumble', 'rampage', 'crusher', 'growling'],
}

const BASE_DAMAGE = 150
const COMBO_TIERS = [
  { threshold: 10, multiplier: 3 },
  { threshold: 5,  multiplier: 2 },
  { threshold: 3,  multiplier: 1.5 },
]

export class TypingSystem {
  constructor(scene) {
    this.scene = scene
    this.zombies = []
    this.currentTarget = null
    this.typedBuffer = ''
    this.combo = 0
    this.labels = new Map()

    // Ensure canvas receives keyboard events
    const canvas = scene.game.canvas
    canvas.setAttribute('tabindex', '0')
    this._canvasClickHandler = () => canvas.focus()
    canvas.addEventListener('click', this._canvasClickHandler)
    canvas.focus()
    this._canvas = canvas

    scene.events.on('zombieSpawned', (z) => this.onZombieSpawned(z))
    scene.events.on('zombieDied',    (z) => this.onZombieDied(z))
    scene.input.keyboard.on('keydown', (e) => this.onKeyDown(e))
  }

  _pickWord(zombie) {
    const list = WORD_LISTS[zombie.config.key] || WORD_LISTS.zombie_normal
    return list[Math.floor(Math.random() * list.length)]
  }

  _multiplier() {
    for (const tier of COMBO_TIERS) {
      if (this.combo >= tier.threshold) return tier.multiplier
    }
    return 1
  }

  onZombieSpawned(zombie) {
    zombie._word   = this._pickWord(zombie)
    zombie._typed  = ''

    const base = { fontSize: '15px', stroke: '#000', strokeThickness: 2 }
    const typed     = this.scene.add.text(0, 0, '', { ...base, fill: '#44FF44' }).setOrigin(0, 0.5).setDepth(10)
    const remaining = this.scene.add.text(0, 0, zombie._word, { ...base, fill: '#ffffff' }).setOrigin(0, 0.5).setDepth(10)

    this.labels.set(zombie, { typed, remaining })
    this.zombies.push(zombie)
    this._syncLabel(zombie)
    this._updateTarget()
  }

  onZombieDied(zombie) {
    const lbl = this.labels.get(zombie)
    if (lbl) {
      lbl.typed.destroy()
      lbl.remaining.destroy()
    }
    this.labels.delete(zombie)

    const idx = this.zombies.indexOf(zombie)
    if (idx !== -1) this.zombies.splice(idx, 1)

    if (this.currentTarget === zombie) {
      this.currentTarget = null
      this.typedBuffer = ''
      this._updateTarget()
    }
  }

  _updateTarget() {
    const alive = this.zombies.filter(z => !z.isDead)
    if (!alive.length) {
      this.currentTarget = null
      return
    }
    const prev = this.currentTarget
    // Nearest to left edge = smallest x
    this.currentTarget = alive.reduce((a, b) => a.x < b.x ? a : b)
    if (this.currentTarget !== prev) {
      this.typedBuffer = ''
      this.currentTarget._typed = ''
    }
    this._highlightLabels()
  }

  _highlightLabels() {
    for (const [zombie, lbl] of this.labels) {
      const isTarget = zombie === this.currentTarget
      lbl.remaining.setStyle({ fill: isTarget ? '#FFD700' : '#aaaaaa' })
    }
  }

  _syncLabel(zombie) {
    const lbl = this.labels.get(zombie)
    if (!lbl) return
    const bx = zombie.body ? zombie.body.x : zombie.x
    const by = zombie.body ? zombie.body.y : zombie.y

    const typed = zombie._typed || ''
    const word  = zombie._word  || ''

    lbl.typed.setText(typed)
    lbl.remaining.setText(word.slice(typed.length))

    const totalWidth = lbl.typed.width + lbl.remaining.width
    const startX = bx - totalWidth / 2
    lbl.typed.setPosition(startX, by - 55)
    lbl.remaining.setPosition(startX + lbl.typed.width, by - 55)
  }

  onKeyDown(event) {
    const char = event.key
    if (char.length !== 1 || !/[a-zA-Z]/.test(char)) return
    const key = char.toLowerCase()

    if (!this.currentTarget || this.currentTarget.isDead) {
      this._updateTarget()
      return
    }

    const word     = this.currentTarget._word
    const expected = word[this.typedBuffer.length]

    if (key === expected) {
      this.typedBuffer += key
      this.currentTarget._typed = this.typedBuffer
      this._syncLabel(this.currentTarget)

      if (this.typedBuffer === word) {
        this.combo++
        const mul = this._multiplier()
        const dmg = Math.floor(BASE_DAMAGE * mul)

        this._showDamageFloat(this.currentTarget, dmg, mul)
        this.currentTarget.takeDamage(dmg)
        this.typedBuffer = ''

        if (this.currentTarget && !this.currentTarget.isDead) {
          this.currentTarget._word  = this._pickWord(this.currentTarget)
          this.currentTarget._typed = ''
          this._syncLabel(this.currentTarget)
          this._highlightLabels()
        }
        // If zombie died, onZombieDied will call _updateTarget
      }
    } else {
      // Wrong key — reset buffer only, keep combo
      this.typedBuffer = ''
      this.currentTarget._typed = ''
      this._syncLabel(this.currentTarget)
    }
  }

  _showDamageFloat(zombie, dmg, mul) {
    const x = zombie.body ? zombie.body.x : zombie.x
    const y = zombie.body ? zombie.body.y : zombie.y
    const label = mul >= 3 ? `×3 -${dmg}💥` : mul >= 2 ? `×2 -${dmg}🔥` : mul >= 1.5 ? `×1.5 -${dmg}` : `-${dmg}`
    const fill  = mul >= 3 ? '#FF4444' : mul >= 2 ? '#FF8800' : mul >= 1.5 ? '#FFDD00' : '#ffffff'

    const text = this.scene.add.text(x, y - 70, label, {
      fontSize: mul > 1 ? '20px' : '16px',
      fill,
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20)

    this.scene.tweens.add({
      targets: text,
      y: y - 115,
      alpha: 0,
      duration: 900,
      onComplete: () => text.destroy(),
    })

    if (mul >= 3) {
      this.scene.tweens.add({ targets: text, scaleX: 1.4, scaleY: 1.4, duration: 120, yoyo: true })
    }
  }

  update() {
    for (const zombie of this.zombies) {
      if (!zombie.isDead) this._syncLabel(zombie)
    }
  }

  destroy() {
    for (const lbl of this.labels.values()) {
      lbl.typed.destroy()
      lbl.remaining.destroy()
    }
    this.labels.clear()
    this.zombies = []
    this.currentTarget = null
    if (this._canvas && this._canvasClickHandler) {
      this._canvas.removeEventListener('click', this._canvasClickHandler)
    }
  }
}
