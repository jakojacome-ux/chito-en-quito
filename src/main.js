import * as Phaser from 'phaser'
import './style.css'

import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import CharacterSelectScene from './scenes/CharacterSelectScene.js'
import Level1Scene from './scenes/Level1Scene.js'

const GAME_WIDTH = 1600
const GAME_HEIGHT = 900

window.ChitoControls = {
  left: false,
  right: false,
  dash: false,
  jump: false,
  jumpQueued: false
}

let userEnteredGame = false

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

function isPortrait() {
  return window.innerHeight > window.innerWidth
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
          // Algunos navegadores móviles pueden fallar aquí sin afectar el control.
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
    } else {
      refreshGameLayout()
    }
  })
}

function updateBodyMode() {
  document.body.classList.toggle('touch-device', isTouchDevice())
  document.body.classList.toggle('portrait-mode', isPortrait())
  document.body.classList.toggle('landscape-mode', !isPortrait())
  document.body.classList.toggle('entered-game', userEnteredGame)

  const shouldShowGame = userEnteredGame && (!isTouchDevice() || !isPortrait())

  document.body.classList.toggle('game-visible', shouldShowGame)
  document.body.classList.toggle('landing-active', !shouldShowGame)

  if (!shouldShowGame) {
    resetMobileControls()
  }
}

async function tryLandscapeExperience() {
  const root = document.documentElement

  try {
    if (root.requestFullscreen && !document.fullscreenElement) {
      await root.requestFullscreen()
    }
  } catch {
    // iPhone Safari normalmente no permite fullscreen desde web normal.
  }

  try {
    if (screen.orientation?.lock) {
      await screen.orientation.lock('landscape')
    }
  } catch {
    // iPhone Safari normalmente no permite bloquear orientación.
  }
}

let game = null

function createGame() {
  const config = {
    type: Phaser.AUTO,
    parent: 'game-shell',

    width: GAME_WIDTH,
    height: GAME_HEIGHT,

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

    render: {
      antialias: true,
      roundPixels: false,
      pixelArt: false
    },

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    },

    scene: [
      BootScene,
      MenuScene,
      CharacterSelectScene,
      Level1Scene
    ]
  }

  game = new Phaser.Game(config)
  window.__CHITO_GAME__ = game
}

function refreshGameLayout() {
  updateBodyMode()

  requestAnimationFrame(() => {
    if (game?.scale) {
      game.scale.refresh()
    }

    window.scrollTo(0, 0)

    setTimeout(() => {
      if (game?.scale) {
        game.scale.refresh()
      }

      window.scrollTo(0, 0)
    }, 180)
  })
}

function setupLanding() {
  const enterButton = document.getElementById('enter-game-button')
  const helper = document.getElementById('landing-helper')

  if (!enterButton) return

  enterButton.addEventListener('click', async () => {
    userEnteredGame = true

    if (helper) {
      helper.textContent = isTouchDevice() && isPortrait()
        ? 'Listo. Pon tu iPhone horizontal y la aventura se abrirá automáticamente.'
        : 'Cargando aventura...'
    }

    await tryLandscapeExperience()
    refreshGameLayout()
  })
}

setupMobileControls()
setupLanding()
createGame()
refreshGameLayout()

window.addEventListener('resize', refreshGameLayout)

window.addEventListener('orientationchange', () => {
  resetMobileControls()

  setTimeout(() => {
    refreshGameLayout()
  }, 240)

  setTimeout(() => {
    refreshGameLayout()
  }, 620)
})

window.addEventListener('load', refreshGameLayout)