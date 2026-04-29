import * as Phaser from 'phaser'

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene')

    this.selectedCharacter = 'jako'
    this.jakoCard = null
    this.estefiCard = null
    this.selectedText = null
  }

  preload() {
    this.load.image('jakoSelect', '/assets/characters/jako/jako_idle_01.png')
    this.load.image('estefiSelect', '/assets/characters/estefi/estefi_idle_01.png')
    this.load.image('astroSelect', '/assets/characters/astro/astro_idle_01.png')
  }

  create() {
    this.createBackground()
    this.createTitle()
    this.createCharacterCards()
    this.createActions()
  }

  createBackground() {
    const width = this.scale.width
    const height = this.scale.height

    this.cameras.main.setBackgroundColor('#8ed7ff')

    this.add.rectangle(width / 2, height / 2, width, height, 0x8ed7ff)

    this.add.rectangle(width / 2, 130, width, 260, 0xf7c38b).setAlpha(0.9)

    const mountains = this.add.graphics()
    mountains.fillStyle(0x9a745f, 0.65)

    mountains.beginPath()
    mountains.moveTo(0, 430)
    mountains.lineTo(260, 280)
    mountains.lineTo(520, 430)
    mountains.lineTo(850, 260)
    mountains.lineTo(1220, 430)
    mountains.lineTo(1600, 290)
    mountains.lineTo(1600, 900)
    mountains.lineTo(0, 900)
    mountains.closePath()
    mountains.fillPath()

    for (let x = -40; x < width + 220; x += 230) {
      const colors = [0xf0d6b8, 0xf1bd62, 0x8db7ce, 0xf4e8d4]
      const color = colors[Math.floor(x / 230 + 10) % colors.length]

      this.add.rectangle(x + 100, 650, 200, 260, color)

      const roof = this.add.graphics()
      roof.fillStyle(0xb85e2d, 1)
      roof.fillTriangle(x, 515, x + 100, 450, x + 200, 515)

      this.add.rectangle(x + 55, 620, 34, 52, 0x7b4a2a)
      this.add.rectangle(x + 140, 620, 34, 52, 0x7b4a2a)
      this.add.rectangle(x + 100, 720, 54, 95, 0x62371f)
    }

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x06111f)
    overlay.setAlpha(0.28)
  }

  createTitle() {
    const width = this.scale.width

    this.add.text(width / 2, 80, 'Chito en Quito', {
      fontFamily: 'Arial',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#ffbf38',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 8
    }).setOrigin(0.5)

    this.add.text(width / 2, 142, 'Elige tu personaje', {
      fontFamily: 'Arial',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff2dc',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 5
    }).setOrigin(0.5)
  }

  createCharacterCards() {
    this.jakoCard = this.createCharacterCard({
      x: 500,
      y: 455,
      characterKey: 'jako',
      characterTexture: 'jakoSelect',
      name: 'Jako',
      color: 0x27bdff
    })

    this.estefiCard = this.createCharacterCard({
      x: 1100,
      y: 455,
      characterKey: 'estefi',
      characterTexture: 'estefiSelect',
      name: 'Estefi',
      color: 0x9b55ff
    })

    this.updateSelection()
  }

  createCharacterCard({ x, y, characterKey, characterTexture, name, color }) {
    const container = this.add.container(x, y)

    const shadow = this.add.rectangle(0, 12, 420, 520, 0x000000, 0.28)
    const panel = this.add.rectangle(0, 0, 420, 520, 0x06111f, 0.78)
    panel.setStrokeStyle(5, color, 0.85)

    const glow = this.add.rectangle(0, 0, 440, 540, color, 0.12)
    glow.setVisible(false)

    const character = this.add.image(-35, 60, characterTexture)
    character.setOrigin(0.5, 1)
    character.setDisplaySize(230, 230)

    const astro = this.add.image(95, 92, 'astroSelect')
    astro.setOrigin(0.5, 1)
    astro.setDisplaySize(145, 110)

    const namePlate = this.add.rectangle(0, 185, 300, 74, color, 1)
    namePlate.setStrokeStyle(4, 0xffffff, 0.5)

    const nameText = this.add.text(0, 185, name, {
      fontFamily: 'Arial',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#13233a',
      strokeThickness: 5
    }).setOrigin(0.5)

    const astroText = this.add.text(0, 244, 'con Astro', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff2dc',
      stroke: '#3a1b08',
      strokeThickness: 4
    }).setOrigin(0.5)

    container.add([
      glow,
      shadow,
      panel,
      character,
      astro,
      namePlate,
      nameText,
      astroText
    ])

    panel.setInteractive({ useHandCursor: true })

    panel.on('pointerup', () => {
      this.selectedCharacter = characterKey
      this.updateSelection()
    })

    container.cardGlow = glow
    container.cardPanel = panel
    container.characterKey = characterKey

    this.tweens.add({
      targets: [character, astro],
      y: '+=8',
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    return container
  }

  updateSelection() {
    const cards = [this.jakoCard, this.estefiCard]

    cards.forEach((card) => {
      const isSelected = card.characterKey === this.selectedCharacter

      card.cardGlow.setVisible(isSelected)
      card.cardPanel.setStrokeStyle(
        isSelected ? 7 : 4,
        isSelected ? 0xffbf38 : 0xffffff,
        isSelected ? 1 : 0.28
      )

      this.tweens.add({
        targets: card,
        scale: isSelected ? 1.035 : 1,
        duration: 160,
        ease: 'Back.easeOut'
      })
    })

    if (this.selectedText) {
      this.selectedText.setText(
        `Seleccionado: ${this.selectedCharacter === 'jako' ? 'Jako' : 'Estefi'} + Astro`
      )
    }
  }

  createActions() {
    const width = this.scale.width

    this.selectedText = this.add.text(width / 2, 750, 'Seleccionado: Jako + Astro', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#fff2dc',
      stroke: '#3a1b08',
      strokeThickness: 5
    }).setOrigin(0.5)

    this.createButton(560, 825, '← Menú', 0xffffff, 0x8da2b6, '#14324f', () => {
      this.scene.start('MenuScene')
    })

    this.createButton(1040, 825, 'Continuar', 0xffbf38, 0x8f4e0c, '#3a1b08', () => {
      this.scene.start('Level1Scene', {
        selectedCharacter: this.selectedCharacter
      })
    })
  }

  createButton(x, y, label, color, shadowColor, textColor, callback) {
    const buttonWidth = 320
    const buttonHeight = 72

    const shadow = this.add.rectangle(x, y + 8, buttonWidth, buttonHeight, shadowColor)
    shadow.setOrigin(0.5)

    const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, color)
    button.setOrigin(0.5)
    button.setStrokeStyle(4, 0xffffff, 0.36)
    button.setInteractive({ useHandCursor: true })

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '30px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0.5)

    button.on('pointerdown', () => {
      button.y += 4
      text.y += 4
    })

    button.on('pointerup', () => {
      button.y -= 4
      text.y -= 4
      callback()
    })

    button.on('pointerout', () => {
      button.y = y
      text.y = y
    })
  }
}