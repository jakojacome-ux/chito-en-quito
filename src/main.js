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
let game = null

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
          // iOS puede fallar aquí sin romper la lógica del botón.
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
      refreshLayout()
    }
  })
}

function createGameIfNeeded() {
  if (game) return game

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

  return game
}

function updateBodyMode() {
  const touch = isTouchDevice()
  const portrait = isPortrait()

  document.body.classList.toggle('touch-device', touch)
  document.body.classList.toggle('portrait-mode', portrait)
  document.body.classList.toggle('landscape-mode', !portrait)
  document.body.classList.toggle('entered-game', userEnteredGame)

  /**
   * Regla principal:
   * - Antes de entrar: portada visible.
   * - En desktop: juego visible al entrar.
   * - En celular vertical: portada visible.
   * - En celular horizontal: juego visible.
   */
  const shouldShowGame = userEnteredGame && (!touch || !portrait)

  document.body.classList.toggle('game-visible', shouldShowGame)
  document.body.classList.toggle('landing-active', !shouldShowGame)

  if (!shouldShowGame) {
    resetMobileControls()
  }

  return shouldShowGame
}

function refreshLayout() {
  const shouldShowGame = updateBodyMode()

  requestAnimationFrame(() => {
    if (shouldShowGame) {
      createGameIfNeeded()

      if (game?.scale) {
        game.scale.refresh()
      }
    }

    window.scrollTo(0, 0)

    setTimeout(() => {
      if (shouldShowGame && game?.scale) {
        game.scale.refresh()
      }

      window.scrollTo(0, 0)
    }, 180)
  })
}

async function tryLandscapeExperience() {
  try {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
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

function setupLanding() {
  const enterButton = document.getElementById('enter-game-button')
  const helper = document.getElementById('landing-helper')

  if (!enterButton) return

  enterButton.addEventListener('click', async () => {
    userEnteredGame = true

    if (helper) {
      helper.textContent =
        isTouchDevice() && isPortrait()
          ? 'Gira tu iPhone a horizontal para abrir la aventura.'
          : 'Cargando aventura...'
    }

    await tryLandscapeExperience()
    refreshLayout()
  })
}

setupMobileControls()
setupLanding()
refreshLayout()

window.addEventListener('resize', () => {
  refreshLayout()
})

window.addEventListener('orientationchange', () => {
  resetMobileControls()

  setTimeout(() => {
    refreshLayout()
  }, 220)

  setTimeout(() => {
    refreshLayout()
  }, 650)
})

window.addEventListener('load', () => {
  refreshLayout()
})