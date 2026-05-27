import Phaser from 'phaser'
import { CONFIG } from './config.js'
import { MenuScene } from './scenes/MenuScene.js'
import { GameScene } from './scenes/GameScene.js'
import { UIScene } from './scenes/UIScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  backgroundColor: '#1a1a2e',
  parent: document.body,
  scene: [MenuScene, GameScene, UIScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
})

export default game
