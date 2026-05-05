import * as Phaser from 'phaser'

const GAME_WIDTH = 1600
const GAME_HEIGHT = 900

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')

    this.helpOverlay = []
  }

  create() {
    this.cleanGameplayState()

    this.cameras.main.setBackgroundColor('#d1ab80')

    this.drawBackground()
    this.createTitle()
    this.createMenuButtons()
    this.createFooter()

    this.scale.on('resize', this.handleResize, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanup()
    })

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanup()
    })
  }

  cleanup() {
    this.scale.off('resize', this.handleResize, this)
  }

  cleanGameplayState() {
    document.body.classList.remove('gameplay-active')

    if (window.ChitoControls) {
      window.ChitoControls.left = false
      window.ChitoControls.right = false
      window.ChitoControls.dash = false
      window.ChitoControls.jump = false
      window.ChitoControls.jumpQueued = false
    }

    document.querySelectorAll('.mobile-btn').forEach((button) => {
      button.classList.remove('is-pressed')
    })
  }

  handleResize() {
    this.cameras.main.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  }

  drawBackground() {
    const cx = GAME_WIDTH / 2

    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xd1ab80)

    this.add.rectangle(cx, 245, GAME_WIDTH, 310, 0x8fd3f4)

    const skyGlow = this.add.rectangle(cx, 120, GAME_WIDTH, 230, 0xf3c794, 0.5)
    skyGlow.setDepth(0)

    this.add.ellipse(450, 145, 520, 92, 0xd8e9e7, 0.58)
    this.add.ellipse(930, 130, 680, 100, 0xdce9e5, 0.6)
    this.add.ellipse(1180, 210, 580, 86, 0xd3e5e4, 0.5)

    const mountains = this.add.graphics()

    mountains.fillStyle(0x8d9096, 0.85)
    mountains.beginPath()
    mountains.moveTo(0, 395)
    mountains.lineTo(230, 200)
    mountains.lineTo(440, 395)
    mountains.lineTo(790, 190)
    mountains.lineTo(1080, 395)
    mountains.lineTo(1340, 205)
    mountains.lineTo(1600, 385)
    mountains.lineTo(1600, 515)
    mountains.lineTo(0, 515)
    mountains.closePath()
    mountains.fillPath()

    mountains.fillStyle(0x676f7b, 0.78)
    mountains.beginPath()
    mountains.moveTo(0, 470)
    mountains.lineTo(310, 285)
    mountains.lineTo(560, 470)
    mountains.lineTo(900, 285)
    mountains.lineTo(1240, 470)
    mountains.lineTo(1490, 315)
    mountains.lineTo(1600, 420)
    mountains.lineTo(1600, 545)
    mountains.lineTo(0, 545)
    mountains.closePath()
    mountains.fillPath()

    this.drawCityLayer()
    this.drawStreetLayer()

    const shade = this.add.rectangle(cx, 730, GAME_WIDTH, 340, 0x000000, 0.16)
    shade.setDepth(2)

    const warmOverlay = this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffc478, 0.08)
    warmOverlay.setDepth(3)
  }

  drawCityLayer() {
    const g = this.add.graphics()
    const baseY = 695

    const houses = [
      { x: 80, w: 150, h: 250, color: 0xb89454 },
      { x: 250, w: 150, h: 230, color: 0x6f91a8 },
      { x: 430, w: 160, h: 255, color: 0xdfd8cb },
      { x: 630, w: 150, h: 235, color: 0x7894a5 },
      { x: 815, w: 170, h: 265, color: 0xc4b79d },
      { x: 1035, w: 160, h: 240, color: 0xb89454 },
      { x: 1230, w: 165, h: 260, color: 0xd8d4c8 },
      { x: 1430, w: 150, h: 235, color: 0x6f91a8 },
      { x: 1580, w: 160, h: 255, color: 0xb89454 }
    ]

    houses.forEach((h, index) => {
      g.fillStyle(h.color, 0.94)
      g.fillRect(h.x - h.w / 2, baseY - h.h, h.w, h.h)

      g.fillStyle(0x9d542e, 0.98)
      g.beginPath()
      g.moveTo(h.x - h.w / 2 - 12, baseY - h.h)
      g.lineTo(h.x, baseY - h.h - 70)
      g.lineTo(h.x + h.w / 2 + 12, baseY - h.h)
      g.closePath()
      g.fillPath()

      g.fillStyle(0x5c3726, 1)
      g.fillRect(h.x - 16, baseY - 82, 32, 82)

      g.fillStyle(0x6a3f2d, 0.95)
      g.fillRect(h.x - 52, baseY - 165, 28, 42)
      g.fillRect(h.x + 24, baseY - 165, 28, 42)

      if (index % 2 === 0) {
        g.fillStyle(0xf1c24c, 0.9)
        g.fillRect(h.x - 70, baseY - 115, 34, 18)
        g.fillRect(h.x + 36, baseY - 115, 34, 18)
      }
    })
  }

  drawStreetLayer() {
    const g = this.add.graphics()

    g.fillStyle(0x8f7563, 1)
    g.fillRect(0, 695, GAME_WIDTH, 205)

    g.fillStyle(0xb8844f, 1)
    g.fillRect(0, 790, GAME_WIDTH, 110)

    g.fillStyle(0xe4aa52, 1)
    g.fillRect(0, 790, GAME_WIDTH, 20)

    g.lineStyle(4, 0xe3b25f, 0.7)
    for (let x = 0; x < GAME_WIDTH; x += 120) {
      g.lineBetween(x, 790, x, 900)
    }

    g.fillStyle(0x7a4c2e, 0.42)
    for (let y = 830; y < 895; y += 28) {
      for (let x = 20; x < GAME_WIDTH; x += 90) {
        g.fillRect(x, y, 52, 12)
      }
    }
  }

  createTitle() {
    this.add
      .text(GAME_WIDTH / 2, 105, 'Chito', {
        fontFamily: 'Arial Black',
        fontSize: '86px',
        color: '#f8c248',
        stroke: '#3a1d12',
        strokeThickness: 10
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, 185, 'en Quito', {
        fontFamily: 'Arial Black',
        fontSize: '72px',
        color: '#28bdf6',
        stroke: '#10243a',
        strokeThickness: 9
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, 265, 'Encuentra el café en el Centro Histórico', {
        fontFamily: 'Arial Black',
        fontSize: '30px',
        color: '#ffffff',
        stroke: '#3a1d12',
        strokeThickness: 7
      })
      .setOrigin(0.5)
  }

  createMenuButtons() {
    this.createMainButton({
      x: GAME_WIDTH / 2,
      y: 470,
      width: 430,
      height: 82,
      label: 'Jugar',
      color: 0xf5bf3a,
      textColor: '#3a1d12',
      onClick: () => {
        this.scene.start('CharacterSelectScene')
      }
    })

    this.createMainButton({
      x: GAME_WIDTH / 2,
      y: 575,
      width: 430,
      height: 82,
      label: 'Personajes',
      color: 0x31b8f3,
      textColor: '#ffffff',
      onClick: () => {
        this.scene.start('CharacterSelectScene')
      }
    })

    this.createMainButton({
      x: GAME_WIDTH / 2,
      y: 680,
      width: 430,
      height: 82,
      label: 'Cómo jugar',
      color: 0x9c55f2,
      textColor: '#ffffff',
      onClick: () => {
        this.openHowToPlay()
      }
    })
  }

  createMainButton({ x, y, width, height, label, color, textColor, onClick }) {
    const container = this.add.container(x, y)

    const shadow = this.add.rectangle(0, 12, width, height, 0x000000, 0.28)
    const bg = this.add
      .rectangle(0, 0, width, height, color, 1)
      .setStrokeStyle(5, 0xffdf77, 0.92)

    const topLight = this.add.rectangle(0, -height / 2 + 12, width - 18, 12, 0xffffff, 0.2)

    const text = this.add
      .text(0, 0, label, {
        fontFamily: 'Arial Black',
        fontSize: '34px',
        color: textColor,
        stroke: label === 'Jugar' ? '#f4e0a6' : '#14304a',
        strokeThickness: label === 'Jugar' ? 2 : 5
      })
      .setOrigin(0.5)

    container.add([shadow, bg, topLight, text])

    container.setSize(width, height)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    )

    container.on('pointerover', () => {
      bg.setScale(1.015)
      text.setScale(1.015)
    })

    container.on('pointerout', () => {
      bg.setScale(1)
      text.setScale(1)
      container.y = y
    })

    container.on('pointerdown', () => {
      container.y = y + 5
      bg.setFillStyle(0xe0a92e)
    })

    container.on('pointerup', () => {
      container.y = y
      bg.setFillStyle(color)
      onClick()
    })

    return container
  }

  createFooter() {
    this.add
      .text(GAME_WIDTH / 2, 845, 'Versión estable · Chito en Quito', {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#fff3d6',
        stroke: '#3a1d12',
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setAlpha(0.92)
  }

  openHowToPlay() {
    this.closeHowToPlay()

    const dim = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x06111f, 0.72)
    dim.setDepth(100)

    const panel = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 760, 540, 0xfff4df, 0.98)
      .setStrokeStyle(6, 0xf1c24c, 1)
    panel.setDepth(101)

    const title = this.add
      .text(GAME_WIDTH / 2, 225, 'Cómo jugar', {
        fontFamily: 'Arial Black',
        fontSize: '48px',
        color: '#f1b52f',
        stroke: '#3a1d12',
        strokeThickness: 8
      })
      .setOrigin(0.5)
    title.setDepth(102)

    const instructions = [
      '← →  Muévete por el Centro Histórico',
      '↑     Salta entre plataformas',
      '⚡    Corre más rápido',
      '☕    Recoge todos los cafés',
      '🏁    Llega a la cafetería para ganar',
      '🕵️    Evita a los ladrones'
    ]

    const instructionText = this.add
      .text(GAME_WIDTH / 2, 420, instructions.join('\n'), {
        fontFamily: 'Arial Black',
        fontSize: '28px',
        color: '#2e1f14',
        align: 'left',
        lineSpacing: 15
      })
      .setOrigin(0.5)
    instructionText.setDepth(102)

    const closeButton = this.createModalButton(GAME_WIDTH / 2, 655, 'Entendido', () => {
      this.closeHowToPlay()
    })

    this.helpOverlay.push(dim, panel, title, instructionText, closeButton)
  }

  createModalButton(x, y, label, onClick) {
    const container = this.add.container(x, y)
    container.setDepth(103)

    const shadow = this.add.rectangle(0, 9, 320, 70, 0x000000, 0.25)
    const bg = this.add
      .rectangle(0, 0, 320, 70, 0xf5bf3a, 1)
      .setStrokeStyle(4, 0x6e3a1e, 0.75)

    const text = this.add
      .text(0, 0, label, {
        fontFamily: 'Arial Black',
        fontSize: '28px',
        color: '#3a1d12'
      })
      .setOrigin(0.5)

    container.add([shadow, bg, text])

    container.setSize(320, 70)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-160, -35, 320, 70),
      Phaser.Geom.Rectangle.Contains
    )

    container.on('pointerdown', () => {
      container.y = y + 4
    })

    container.on('pointerup', () => {
      container.y = y
      onClick()
    })

    return container
  }

  closeHowToPlay() {
    this.helpOverlay.forEach((item) => {
      if (item && item.destroy) {
        item.destroy()
      }
    })

    this.helpOverlay = []
  }
}