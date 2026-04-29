import * as Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    this.createBackground()
    this.createTitle()
    this.createMenuButtons()
    this.createFooter()
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#8ed7ff')

    const width = this.scale.width
    const height = this.scale.height

    // Cielo
    this.add.rectangle(width / 2, height / 2, width, height, 0x8ed7ff)

    // Atardecer
    this.add.rectangle(width / 2, 130, width, 260, 0xf7c38b).setAlpha(0.9)

    // Montañas
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

    // Centro histórico simple de fondo
    for (let x = -40; x < width + 220; x += 230) {
      const colors = [0xf0d6b8, 0xf1bd62, 0x8db7ce, 0xf4e8d4]
      const color = colors[Math.floor(x / 230 + 10) % colors.length]

      this.add.rectangle(x + 100, 620, 200, 260, color)

      const roof = this.add.graphics()
      roof.fillStyle(0xb85e2d, 1)
      roof.fillTriangle(x, 485, x + 100, 420, x + 200, 485)

      this.add.rectangle(x + 55, 590, 34, 52, 0x7b4a2a)
      this.add.rectangle(x + 140, 590, 34, 52, 0x7b4a2a)
      this.add.rectangle(x + 100, 690, 54, 95, 0x62371f)
    }

    // Oscurecer un poco abajo para que los botones lean bien
    const overlay = this.add.rectangle(width / 2, height - 170, width, 340, 0x06111f)
    overlay.setAlpha(0.42)
  }

  createTitle() {
    const width = this.scale.width

    this.add.text(width / 2, 150, 'Chito', {
      fontFamily: 'Arial',
      fontSize: '96px',
      fontStyle: 'bold',
      color: '#ffbf38',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 10
    }).setOrigin(0.5)

    this.add.text(width / 2, 235, 'en Quito', {
      fontFamily: 'Arial',
      fontSize: '86px',
      fontStyle: 'bold',
      color: '#27bdff',
      align: 'center',
      stroke: '#06223f',
      strokeThickness: 10
    }).setOrigin(0.5)

    this.add.text(width / 2, 310, 'Encuentra el café en el Centro Histórico', {
      fontFamily: 'Arial',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#fff2dc',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 5
    }).setOrigin(0.5)
  }

  createMenuButtons() {
    const width = this.scale.width

    this.createButton(width / 2, 505, 'Jugar', '#ffbf38', '#8f4e0c', () => {
      this.scene.start('CharacterSelectScene')
    })

    this.createButton(width / 2, 610, 'Cómo jugar', '#27bdff', '#07588f', () => {
      this.showHowToPlay()
    })
  }

  createButton(x, y, label, color, shadowColor, callback) {
    const buttonWidth = 420
    const buttonHeight = 76

    const shadow = this.add.rectangle(x, y + 9, buttonWidth, buttonHeight, Phaser.Display.Color.HexStringToColor(shadowColor).color)
    shadow.setOrigin(0.5)
    shadow.setInteractive({ useHandCursor: true })

    const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, Phaser.Display.Color.HexStringToColor(color).color)
    button.setOrigin(0.5)
    button.setStrokeStyle(4, 0xffffff, 0.38)
    button.setInteractive({ useHandCursor: true })

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#3a1b08'
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

  showHowToPlay() {
    const width = this.scale.width
    const height = this.scale.height

    const panel = this.add.rectangle(width / 2, height / 2, 760, 360, 0x06111f, 0.92)
    panel.setStrokeStyle(4, 0xffbf38)

    const title = this.add.text(width / 2, height / 2 - 125, 'Cómo jugar', {
      fontFamily: 'Arial',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#ffbf38',
      stroke: '#3a1b08',
      strokeThickness: 5
    }).setOrigin(0.5)

    const instructions = this.add.text(width / 2, height / 2 - 25,
      'A / ←  moverse a la izquierda\nD / →  moverse a la derecha\nW / Espacio / ↑  saltar\nShift  correr\n\nRecoge los 6 cafés y llega a la cafetería.',
      {
        fontFamily: 'Arial',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#fff2dc',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5)

    const close = this.add.text(width / 2, height / 2 + 130, 'Cerrar', {
      fontFamily: 'Arial',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#27bdff'
    }).setOrigin(0.5)

    close.setInteractive({ useHandCursor: true })

    close.on('pointerup', () => {
      panel.destroy()
      title.destroy()
      instructions.destroy()
      close.destroy()
    })
  }

  createFooter() {
    const width = this.scale.width

    this.add.text(width / 2, 840, 'Versión Phaser · Nivel 1 en desarrollo', {
      fontFamily: 'Arial',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2dc'
    }).setOrigin(0.5)
  }
}