import * as Phaser from 'phaser'
import './style.css'

import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import CharacterSelectScene from './scenes/CharacterSelectScene.js'
import Level1Scene from './scenes/Level1Scene.js'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 1600,
  height: 900,
  backgroundColor: '#06111f',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2200 },
      debug: false
    }
  },

  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    activePointers: 5
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    BootScene,
    MenuScene,
    CharacterSelectScene,
    Level1Scene
  ]
}

new Phaser.Game(config)