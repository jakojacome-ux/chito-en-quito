import * as Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.createLoadingScreen()

    this.load.image('sky', '/assets/backgrounds/level1/sky_back.png')
    this.load.image('mountains', '/assets/backgrounds/level1/mountains_back.png')
    this.load.image('cityFar', '/assets/backgrounds/level1/city_far.png')
    this.load.image('buildingsMid', '/assets/backgrounds/level1/historic_buildings_mid.png')

    this.load.image('jakoIdle1', '/assets/characters/jako/jako_idle_01.png')
    this.load.image('jakoIdle2', '/assets/characters/jako/jako_idle_02.png')
    this.load.image('jakoRun1', '/assets/characters/jako/jako_run_01.png')
    this.load.image('jakoRun2', '/assets/characters/jako/jako_run_02.png')
    this.load.image('jakoRun3', '/assets/characters/jako/jako_run_03.png')
    this.load.image('jakoJump', '/assets/characters/jako/jako_jump.png')
    this.load.image('jakoFall', '/assets/characters/jako/jako_fall.png')

    this.load.image('estefiIdle1', '/assets/characters/estefi/estefi_idle_01.png')
    this.load.image('estefiIdle2', '/assets/characters/estefi/estefi_idle_02.png')
    this.load.image('estefiRun1', '/assets/characters/estefi/estefi_run_01.png')
    this.load.image('estefiRun2', '/assets/characters/estefi/estefi_run_02.png')
    this.load.image('estefiRun3', '/assets/characters/estefi/estefi_run_03.png')
    this.load.image('estefiJump', '/assets/characters/estefi/estefi_jump.png')
    this.load.image('estefiFall', '/assets/characters/estefi/estefi_fall.png')

    this.load.image('astroIdle1', '/assets/characters/astro/astro_idle_01.png')
    this.load.image('astroIdle2', '/assets/characters/astro/astro_idle_02.png')
    this.load.image('astroRun1', '/assets/characters/astro/astro_run_01.png')
    this.load.image('astroRun2', '/assets/characters/astro/astro_run_02.png')
    this.load.image('astroRun3', '/assets/characters/astro/astro_run_03.png')
    this.load.image('astroJump', '/assets/characters/astro/astro_jump.png')

    this.load.image('coffeeAsset', '/assets/props/level1/pickup_cafe_refinado.png')
    this.load.image('cafeGoalAsset', '/assets/props/level1/goal_cafeteria_meta.png')
    this.load.image('farolAsset', '/assets/props/level1/prop_farol_colonial.png')
    this.load.image('benchAsset', '/assets/props/level1/prop_banca_madera.png')
    this.load.image('flowerPotAsset', '/assets/props/level1/prop_maceta_flores.png')
    this.load.image('signAsset', '/assets/props/level1/prop_senaletica_colonial.png')
    this.load.image('crateAsset', '/assets/props/level1/obstacle_caja_madera.png')
    this.load.image('bollardAsset', '/assets/props/level1/obstacle_bolardo_piedra.png')
  }

  createLoadingScreen() {
    this.cameras.main.setBackgroundColor('#8ed7ff')

    const title = this.add.text(800, 330, 'Chito en Quito', {
      fontFamily: 'Arial Black',
      fontSize: '62px',
      color: '#f8c248',
      stroke: '#3a1d12',
      strokeThickness: 8
    })
    title.setOrigin(0.5)

    const barBg = this.add.rectangle(800, 450, 520, 34, 0x06111f, 0.36)
    barBg.setStrokeStyle(3, 0xf8c248, 0.8)

    const bar = this.add.rectangle(544, 450, 0, 22, 0xf8c248, 1)
    bar.setOrigin(0, 0.5)

    const loadingText = this.add.text(800, 510, 'Cargando aventura...', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#3a1d12',
      strokeThickness: 5
    })
    loadingText.setOrigin(0.5)

    this.load.on('progress', (value) => {
      bar.width = 512 * value
    })
  }

  create() {
    this.scene.start('MenuScene')
  }
}