import * as Phaser from 'phaser'
import './style.css'

import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import CharacterSelectScene from './scenes/CharacterSelectScene.js'
import Level1Scene from './scenes/Level1Scene.js'

window.ChitoControls = {
  left: false,
  right: false,
  dash: false,
  jump: false,
  jumpQueued: false
}

function resetMobileControls() {
  if (!window.ChitoControls) return

  window.ChitoControls.left = false
  window.ChitoControls.right = false
  window.ChitoControls.dash = false
  window.ChitoControls.jump = false
  window.ChitoControls.jumpQueued = false

  document.querySelectorAll('.mobile-btn').forEach((button) => {
    button.classList.remove('is-pressed')
  })
}

function setupMobileControls() {
  const buttons = document.querySelectorAll('[data-control]')

  buttons.forEach((button) => {
    const control = button.dataset.control
    let activePointerId = null

    const setControl = (isDown) => {
      if (!window.ChitoControls) return

      window.ChitoControls[control] = isDown

      if (control === 'jump' && isDown) {
        window.ChitoControls.jumpQueued = true
      }

      if (isDown) {
        button.classList.add('is-pressed')
      } else {
        button.classList.remove('is-pressed')
      }
    }

    const down = (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (activePointerId !== null) return

      activePointerId = event.pointerId

      if (button.setPointerCapture && event.pointerId !== undefined) {
        try {
          button.setPointerCapture(event.pointerId)
        } catch {
          // iOS puede fallar silenciosamente en algunos casos.
        }
      }

      setControl(true)
    }

    const up = (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (activePointerId === null) return

      if (event.pointerId !== undefined && event.pointerId !== activePointerId) {
        return
      }

      activePointerId = null
      setControl(false)
    }

    button.addEventListener('pointerdown', down, { passive: false })
    button.addEventListener('pointerup', up, { passive: false })
    button.addEventListener('pointercancel', up, { passive: false })
    button.addEventListener('lostpointercapture', up, { passive: false })

    button.addEventListener(
      'touchstart',
      (event) => {
        event.preventDefault()
      },
      { passive: false }
    )

    button.addEventListener(
      'touchmove',
      (event) => {
        event.preventDefault()
      },
      { passive: false }
    )
  })

  window.addEventListener('blur', resetMobileControls)

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resetMobileControls()
    }
  })
}

setupMobileControls()

const config = {
  type: Phaser.AUTO,
  parent: 'app',

  width: 1600,
  height: 900,

  backgroundColor: '#8ed7ff',

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
    activePointers: 6
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 900
  },

  scene: [
    BootScene,
    MenuScene,
    CharacterSelectScene,
    Level1Scene
  ]
}

new Phaser.Game(config)