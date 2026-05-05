import * as Phaser from 'phaser'

const GAME_WIDTH = 1600
const GAME_HEIGHT = 900

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene')
    this.selectedCharacter = 'jako'
  }

  create() {
    document.body.classList.remove('gameplay-active')

    this.selectedCharacter = 'jako'

    this.cameras.main.setBackgroundColor('#d1ab80')

    this.drawBackground()
    this.createTitle()
    this.createCards()
    this.createButtons()
    this.refreshSelection()
  }

  drawBackground() {
    const cx = GAME_WIDTH / 2

    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xd1ab80)
    this.add.rectangle(cx, 245, GAME_WIDTH, 310, 0x8fd3f4)

    this.add.ellipse(420, 145, 540, 90, 0xd8e9e7, 0.58)
    this.add.ellipse(1000, 135, 660, 100, 0xdce9e5, 0.6)

    const mountains = this.add.graphics()

    mountains.fillStyle(0x8d9096, 0.85)
    mountains.beginPath()
    mountains.moveTo(0, 395)
    mountains.lineTo(240, 205)
    mountains.lineTo(470, 395)
    mountains.lineTo(820, 195)
    mountains.lineTo(1120, 395)
    mountains.lineTo(1400, 215)
    mountains.lineTo(1600, 370)
    mountains.lineTo(1600, 540)
    mountains.lineTo(0, 540)
    mountains.closePath()
    mountains.fillPath()

    mountains.fillStyle(0x676f7b, 0.78)
    mountains.beginPath()
    mountains.moveTo(0, 470)
    mountains.lineTo(320, 290)
    mountains.lineTo(600, 470)
    mountains.lineTo(930, 300)
    mountains.lineTo(1260, 470)
    mountains.lineTo(1510, 320)
    mountains.lineTo(1600, 420)
    mountains.lineTo(1600, 560)
    mountains.lineTo(0, 560)
    mountains.closePath()
    mountains.fillPath()

    this.drawCityLayer()

    this.add.rectangle(cx, 740, GAME_WIDTH, 320, 0x000000, 0.16)
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffc478, 0.08)
  }

  drawCityLayer() {
    const g = this.add.graphics()
    const baseY = 720

    const houses = [
      { x: 110, w: 150, h: 240, color: 0xb89454 },
      { x: 290, w: 150, h: 220, color: 0x6f91a8 },
      { x: 485, w: 160, h: 250, color: 0xdfd8cb },
      { x: 690, w: 150, h: 230, color: 0x7894a5 },
      { x: 895, w: 170, h: 255, color: 0xc4b79d },
      { x: 1120, w: 160, h: 235, color: 0xb89454 },
      { x: 1325, w: 165, h: 250, color: 0xd8d4c8 },
      { x: 1535, w: 150, h: 230, color: 0x6f91a8 }
    ]

    houses.forEach((h) => {
      g.fillStyle(h.color, 0.92)
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
    })
  }

  createTitle() {
    this.add.text(GAME_WIDTH / 2, 80, 'Chito en Quito', {
      fontFamily: 'Arial Black',
      fontSize: '60px',
      color: '#f8c248',
      stroke: '#3a1d12',
      strokeThickness: 9
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, 145, 'Elige tu personaje', {
      fontFamily: 'Arial Black',
      fontSize: '30px',
      color: '#ffffff',
      stroke: '#3a1d12',
      strokeThickness: 6
    }).setOrigin(0.5)
  }

  createCards() {
    this.jakoCard = this.createCharacterCard({
      x: 580,
      y: 435,
      id: 'jako',
      label: 'Jako',
      buttonColor: 0x31b8f3,
      characterTexture: 'jakoIdle1'
    })

    this.estefiCard = this.createCharacterCard({
      x: 1020,
      y: 435,
      id: 'estefi',
      label: 'Estefi',
      buttonColor: 0x9c55f2,
      characterTexture: 'estefiIdle1'
    })
  }

  createCharacterCard({ x, y, id, label, buttonColor, characterTexture }) {
    const container = this.add.container(x, y)

    const shadow = this.add.rectangle(0, 18, 350, 530, 0x000000, 0.28)

    const frame = this.add.rectangle(0, 0, 350, 530, 0x10253a, 0.88)
      .setStrokeStyle(5, 0xffffff, 0.35)

    const topGlow = this.add.rectangle(0, -160, 330, 140, 0x173453, 0.36)

    const platform = this.add.rectangle(0, 100, 180, 70, 0x1d2d40, 0.82)

    container.add([shadow, frame, topGlow, platform])

    if (this.textures.exists(characterTexture)) {
      const character = this.add.image(-26, -55, characterTexture)
      character.setDisplaySize(145, 190)
      character.setAlpha(1)
      container.add(character)
    }

    if (this.textures.exists('astroIdle1')) {
      const astro = this.add.image(82, 95, 'astroIdle1')
      astro.setDisplaySize(82, 68)
      astro.setAlpha(1)
      container.add(astro)
    }

    const buttonBg = this.add.rectangle(0, 150, 260, 76, buttonColor, 1)
      .setStrokeStyle(4, 0xe9e9e9)

    const buttonText = this.add.text(0, 150, label, {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#25313f',
      strokeThickness: 6
    }).setOrigin(0.5)

    const astroLabel = this.add.text(0, 210, 'con Astro', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#fff3d6',
      stroke: '#3a1d12',
      strokeThickness: 4
    }).setOrigin(0.5)

    container.add([buttonBg, buttonText, astroLabel])

    container.setSize(350, 530)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-175, -265, 350, 530),
      Phaser.Geom.Rectangle.Contains
    )

    container.on('pointerdown', () => {
      this.selectedCharacter = id
      this.refreshSelection()
    })

    return {
      id,
      container,
      frame
    }
  }

  createButtons() {
    this.statusText = this.add.text(GAME_WIDTH / 2, 720, 'Seleccionado: Jako + Astro', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#fff3d6',
      stroke: '#3a1d12',
      strokeThickness: 5
    }).setOrigin(0.5)

    this.createButton({
      x: 620,
      y: 800,
      width: 280,
      height: 76,
      label: '← Menú',
      color: 0xf2f2f2,
      textColor: '#23364a',
      onClick: () => {
        this.scene.start('MenuScene')
      }
    })

    this.createButton({
      x: 980,
      y: 800,
      width: 280,
      height: 76,
      label: 'Continuar',
      color: 0xf5bf3a,
      textColor: '#3a1d12',
      onClick: () => {
        this.scene.start('Level1Scene', {
          selectedCharacter: this.selectedCharacter
        })
      }
    })
  }

  createButton({ x, y, width, height, label, color, textColor, onClick }) {
    const container = this.add.container(x, y)

    const shadow = this.add.rectangle(0, 10, width, height, 0x000000, 0.25)

    const bg = this.add.rectangle(0, 0, width, height, color, 1)
      .setStrokeStyle(4, 0xe8d59b, 1)

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: textColor
    }).setOrigin(0.5)

    container.add([shadow, bg, text])

    container.setSize(width, height)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    )

    container.on('pointerdown', () => {
      container.y = y + 4
    })

    container.on('pointerup', () => {
      container.y = y
      onClick()
    })

    container.on('pointerout', () => {
      container.y = y
    })

    return container
  }

  refreshSelection() {
    const jakoSelected = this.selectedCharacter === 'jako'

    this.jakoCard.frame.setStrokeStyle(7, jakoSelected ? 0xf8c248 : 0xffffff, jakoSelected ? 1 : 0.35)
    this.estefiCard.frame.setStrokeStyle(7, !jakoSelected ? 0xf8c248 : 0xffffff, !jakoSelected ? 1 : 0.35)

    if (this.statusText) {
      this.statusText.setText(
        jakoSelected
          ? 'Seleccionado: Jako + Astro'
          : 'Seleccionado: Estefi + Astro'
      )
    }
  }
}