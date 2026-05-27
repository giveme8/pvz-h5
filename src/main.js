import Phaser from 'phaser'
import { CONFIG } from './config.js'
import { PreloadScene } from './scenes/PreloadScene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { GameScene } from './scenes/GameScene.js'
import { UIScene } from './scenes/UIScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  backgroundColor: '#2d5a1b',
  parent: 'game-container',
  scene: [PreloadScene, MenuScene, GameScene, UIScene, GameOverScene],
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
