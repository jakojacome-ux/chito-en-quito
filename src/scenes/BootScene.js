import * as Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#06111f')

    const width = this.scale.width
    const height = this.scale.height

    this.add.text(width / 2, height / 2 - 40, 'Chito en Quito', {
      fontFamily: 'Arial',
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#ffbf38',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 8
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 35, 'Cargando aventura...', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.time.delayedCall(650, () => {
      this.scene.start('MenuScene')
    })
  }
}