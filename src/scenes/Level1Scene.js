import * as Phaser from 'phaser'

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene')

    this.player = null
    this.playerVisual = null
    this.playerShadow = null
    this.astro = null
    this.astroShadow = null

    this.platforms = null
    this.coffees = null
    this.enemies = null
    this.goal = null

    this.cursors = null
    this.keys = null

    this.logoText = null
    this.levelText = null
    this.heartsText = null
    this.coffeeText = null
    this.scoreText = null
    this.messageText = null
    this.pauseButton = null
    this.pauseOverlay = []

    this.coffeeCount = 0
    this.totalCoffee = 6
    this.score = 0
    this.lives = 3

    this.isInvulnerable = false
    this.isGameOver = false
    this.isVictory = false
    this.isPaused = false
    this.goalMessageCooldown = false

    this.selectedCharacter = 'jako'
  }

  init(data) {
    this.selectedCharacter = data?.selectedCharacter || 'jako'
  }

  preload() {
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

  create() {
    document.body.classList.add('gameplay-active')

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanGameplayState()
    })

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanGameplayState()
    })

    this.physics.world.setBounds(0, 0, 4200, 900)

    this.input.addPointer(6)

    if (this.input.manager?.canvas) {
      this.input.manager.canvas.style.touchAction = 'none'
    }

    this.coffeeCount = 0
    this.score = 0
    this.lives = 3
    this.isInvulnerable = false
    this.isGameOver = false
    this.isVictory = false
    this.isPaused = false
    this.goalMessageCooldown = false
    this.pauseOverlay = []

    this.resetHtmlControls()

    this.createTextures()
    this.createBackground()
    this.createPlatforms()
    this.createDecorProps()
    this.createForegroundDepth()
    this.createPlayer()
    this.createCoffeeItems()
    this.createEnemies()
    this.createGoal()
    this.createControls()
    this.createCamera()
    this.createHud()
  }

  cleanGameplayState() {
    document.body.classList.remove('gameplay-active')
    this.resetHtmlControls()
  }

  resetHtmlControls() {
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

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })

    g.clear()
    g.fillStyle(0xffffff, 0.01)
    g.fillRect(0, 0, 70, 140)
    g.generateTexture('playerBody', 70, 140)

    g.clear()
    g.fillStyle(0xffffff, 0.01)
    g.fillRect(0, 0, 64, 44)
    g.generateTexture('platformBody', 64, 44)

    this.createGroundTexture(g)
    this.createStonePlatformTexture(g)
    this.createWoodPlatformTexture(g)
    this.createCoffeeParticleTexture(g)
    this.createThiefPlaceholderTexture(g)
    this.createMistTexture(g)
    this.createLightTexture(g)

    g.destroy()
  }

  createGroundTexture(g) {
    g.clear()

    g.fillStyle(0x6e462f, 1)
    g.fillRect(0, 0, 160, 190)

    g.fillStyle(0xb87235, 1)
    g.fillRect(0, 0, 160, 34)

    g.fillStyle(0xe09b48, 1)
    for (let x = 0; x < 160; x += 28) {
      g.fillCircle(x + 14, 5, 12)
    }

    g.fillStyle(0x4d2f20, 1)
    g.fillRect(0, 56, 160, 8)
    g.fillRect(0, 116, 160, 7)

    g.fillStyle(0x7b5135, 1)
    for (let y = 72; y < 170; y += 28) {
      for (let x = 0; x < 160; x += 42) {
        const offset = y % 56 === 0 ? 0 : 18
        g.fillRect(x + offset, y, 32, 13)
      }
    }

    g.fillStyle(0x8f5c3b, 1)
    g.fillRect(0, 34, 160, 12)

    g.lineStyle(3, 0xf0b85a, 1)
    g.strokeRect(0, 0, 160, 190)

    g.generateTexture('deepGroundTile', 160, 190)
  }

  createStonePlatformTexture(g) {
    g.clear()

    g.fillStyle(0x5d3f2d, 1)
    g.fillRect(0, 0, 160, 72)

    g.fillStyle(0xa36f47, 1)
    g.fillRect(0, 0, 160, 17)

    g.fillStyle(0x493122, 1)
    g.fillRect(0, 54, 160, 18)

    g.fillStyle(0x6f4a34, 1)
    for (let x = 8; x < 160; x += 42) {
      g.fillRect(x, 28, 30, 11)
    }

    g.lineStyle(3, 0xe7b35c, 1)
    g.strokeRect(0, 0, 160, 72)

    g.generateTexture('deepStonePlatform', 160, 72)
  }

  createWoodPlatformTexture(g) {
    g.clear()

    g.fillStyle(0x7a4524, 1)
    g.fillRect(0, 0, 160, 72)

    g.fillStyle(0xb87539, 1)
    g.fillRect(0, 0, 160, 17)

    g.fillStyle(0x4f2b17, 1)
    g.fillRect(0, 32, 160, 6)
    g.fillRect(0, 58, 160, 8)

    g.fillStyle(0x2f1b10, 1)
    for (let x = 18; x < 160; x += 42) {
      g.fillCircle(x, 45, 4)
      g.fillCircle(x + 18, 45, 4)
    }

    g.lineStyle(3, 0xe7b35c, 1)
    g.strokeRect(0, 0, 160, 72)

    g.generateTexture('deepWoodPlatform', 160, 72)
  }

  createCoffeeParticleTexture(g) {
    g.clear()
    g.fillStyle(0xffd978, 1)
    g.fillCircle(8, 8, 8)
    g.generateTexture('coffeeParticle', 16, 16)
  }

  createMistTexture(g) {
    g.clear()
    g.fillStyle(0xffffff, 0.18)
    g.fillEllipse(180, 45, 360, 70)
    g.fillEllipse(360, 55, 420, 80)
    g.fillEllipse(580, 42, 360, 65)
    g.generateTexture('softMist', 760, 110)
  }

  createLightTexture(g) {
    g.clear()
    g.fillStyle(0xffd98a, 0.16)
    g.fillCircle(120, 120, 120)
    g.fillStyle(0xffd98a, 0.1)
    g.fillCircle(120, 120, 90)
    g.fillStyle(0xffd98a, 0.08)
    g.fillCircle(120, 120, 55)
    g.generateTexture('warmGlow', 240, 240)
  }

  createThiefPlaceholderTexture(g) {
    g.clear()

    g.fillStyle(0x000000, 0.2)
    g.fillEllipse(39, 103, 60, 14)

    g.fillStyle(0x1f2430, 1)
    g.fillRect(18, 38, 44, 54)

    g.fillStyle(0xd99a63, 1)
    g.fillCircle(40, 25, 18)

    g.fillStyle(0x111111, 1)
    g.fillRect(20, 17, 40, 9)
    g.fillRect(28, 8, 24, 10)

    g.fillStyle(0xffffff, 1)
    g.fillRect(28, 27, 8, 3)
    g.fillRect(44, 27, 8, 3)

    g.fillStyle(0x7a4a24, 1)
    g.fillEllipse(69, 58, 34, 46)

    g.fillStyle(0x111820, 1)
    g.fillRect(22, 88, 14, 24)
    g.fillRect(44, 88, 14, 24)

    g.generateTexture('thiefPlaceholder', 90, 120)
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#8ed7ff')

    const sky = this.add.image(0, 0, 'sky')
    sky.setOrigin(0, 0)
    sky.setDisplaySize(4200, 900)
    sky.setScrollFactor(0.04)
    sky.setDepth(0)

    const sunrise = this.add.rectangle(2100, 130, 4200, 260, 0xffc07a, 0.18)
    sunrise.setScrollFactor(0.03)
    sunrise.setDepth(0.5)

    const glow1 = this.add.image(650, 130, 'warmGlow')
    glow1.setDisplaySize(520, 520)
    glow1.setAlpha(0.42)
    glow1.setScrollFactor(0.03)
    glow1.setDepth(0.7)

    const mountains = this.add.image(0, 0, 'mountains')
    mountains.setOrigin(0, 0)
    mountains.setDisplaySize(4200, 900)
    mountains.setScrollFactor(0.13)
    mountains.setAlpha(0.82)
    mountains.setDepth(1)

    this.addMist(350, 425, 0.13, 0.36, 1.5)
    this.addMist(1550, 405, 0.16, 0.28, 1.7)
    this.addMist(2850, 420, 0.14, 0.34, 1.6)

    const cityFar = this.add.image(0, 0, 'cityFar')
    cityFar.setOrigin(0, 0)
    cityFar.setDisplaySize(4200, 900)
    cityFar.setScrollFactor(0.25)
    cityFar.setAlpha(0.9)
    cityFar.setDepth(2)

    const cityShade = this.add.rectangle(2100, 620, 4200, 250, 0x5f4b44, 0.08)
    cityShade.setScrollFactor(0.28)
    cityShade.setDepth(2.5)

    const buildingsMid = this.add.image(0, 0, 'buildingsMid')
    buildingsMid.setOrigin(0, 0)
    buildingsMid.setDisplaySize(4200, 900)
    buildingsMid.setScrollFactor(0.5)
    buildingsMid.setDepth(3)

    const bottomDepth = this.add.rectangle(2100, 760, 4200, 280, 0x24150f, 0.14)
    bottomDepth.setScrollFactor(0.65)
    bottomDepth.setDepth(3.5)
  }

  addMist(x, y, scroll, alpha, scale) {
    const mist = this.add.image(x, y, 'softMist')
    mist.setDisplaySize(760 * scale, 110 * scale)
    mist.setAlpha(alpha)
    mist.setScrollFactor(scroll)
    mist.setDepth(1.6)

    this.tweens.add({
      targets: mist,
      x: x + 70,
      alpha: alpha * 0.75,
      duration: 4200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    return mist
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup()

    this.addGround(0, 720, 4200, 180)

    const platformData = [
      { x: 520, y: 610, w: 240, h: 42, key: 'deepStonePlatform' },
      { x: 840, y: 535, w: 240, h: 42, key: 'deepStonePlatform' },
      { x: 1160, y: 460, w: 240, h: 42, key: 'deepStonePlatform' },

      { x: 1600, y: 610, w: 260, h: 42, key: 'deepWoodPlatform' },
      { x: 1940, y: 535, w: 260, h: 42, key: 'deepWoodPlatform' },
      { x: 2280, y: 460, w: 260, h: 42, key: 'deepWoodPlatform' },

      { x: 2780, y: 610, w: 240, h: 42, key: 'deepStonePlatform' },
      { x: 3100, y: 535, w: 240, h: 42, key: 'deepStonePlatform' },
      { x: 3420, y: 460, w: 240, h: 42, key: 'deepStonePlatform' }
    ]

    platformData.forEach((p) => {
      this.addCleanPlatform(p.x, p.y, p.w, p.h, p.key)
    })
  }

  addGround(x, y, width, height) {
    const baseShadow = this.add.rectangle(
      x + width / 2,
      y + height / 2 + 18,
      width,
      height,
      0x22140d,
      0.34
    )
    baseShadow.setDepth(3.8)

    const base = this.add.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      0x6e462f
    )
    base.setDepth(4)

    const visual = this.add.tileSprite(
      x + width / 2,
      y + height / 2,
      width,
      height,
      'deepGroundTile'
    )
    visual.setDepth(5)

    const topHighlight = this.add.rectangle(
      x + width / 2,
      y + 10,
      width,
      18,
      0xffc66c,
      0.18
    )
    topHighlight.setDepth(6)

    const platform = this.platforms.create(
      x + width / 2,
      y + height / 2,
      'platformBody'
    )

    platform.setDisplaySize(width, height)
    platform.setVisible(false)
    platform.refreshBody()

    return platform
  }

  addCleanPlatform(x, y, width, height, visualKey) {
    const shadow = this.add.rectangle(
      x + width / 2 + 8,
      y + height / 2 + 18,
      width,
      62,
      0x000000,
      0.19
    )
    shadow.setDepth(4)

    const base = this.add.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      72,
      0x5d3f2d
    )
    base.setDepth(5)

    const visual = this.add.tileSprite(
      x + width / 2,
      y + height / 2,
      width,
      72,
      visualKey
    )
    visual.setDepth(6)

    const topGlow = this.add.rectangle(
      x + width / 2,
      y + height / 2 - 25,
      width - 10,
      8,
      0xffd38a,
      0.18
    )
    topGlow.setDepth(7)

    const platform = this.platforms.create(
      x + width / 2,
      y + height / 2,
      'platformBody'
    )

    platform.setDisplaySize(width, height)
    platform.setVisible(false)
    platform.refreshBody()

    return platform
  }

  createDecorProps() {
    this.addProp(260, 718, 'farolAsset', 145)
    this.addProp(430, 718, 'flowerPotAsset', 74)
    this.addProp(700, 718, 'benchAsset', 82)

    this.addProp(1450, 718, 'bollardAsset', 64)
    this.addProp(1710, 718, 'signAsset', 124)
    this.addProp(2070, 718, 'flowerPotAsset', 74)

    this.addProp(2600, 718, 'farolAsset', 145)
    this.addProp(2920, 718, 'crateAsset', 70)
    this.addProp(3230, 718, 'flowerPotAsset', 74)

    this.addProp(3700, 718, 'benchAsset', 84)
  }

  addProp(x, bottomY, key, height) {
    const shadow = this.add.ellipse(x + 6, bottomY + 5, height * 0.7, 20, 0x000000, 0.18)
    shadow.setDepth(8)

    const prop = this.add.image(x, bottomY, key)
    prop.setOrigin(0.5, 1)
    prop.setDisplaySize((prop.width / prop.height) * height, height)
    prop.setDepth(9)

    return prop
  }

  createForegroundDepth() {
    const vignetteTop = this.add.rectangle(2100, 0, 4200, 120, 0x06111f, 0.13)
    vignetteTop.setOrigin(0.5, 0)
    vignetteTop.setScrollFactor(0)
    vignetteTop.setDepth(80)

    const warmFloor = this.add.rectangle(2100, 720, 4200, 90, 0xffb45a, 0.08)
    warmFloor.setScrollFactor(0.72)
    warmFloor.setDepth(10)

    const foregroundMist = this.add.image(900, 690, 'softMist')
    foregroundMist.setDisplaySize(1200, 150)
    foregroundMist.setAlpha(0.12)
    foregroundMist.setScrollFactor(0.85)
    foregroundMist.setDepth(11)

    const foregroundMist2 = this.add.image(2900, 700, 'softMist')
    foregroundMist2.setDisplaySize(1300, 150)
    foregroundMist2.setAlpha(0.1)
    foregroundMist2.setScrollFactor(0.86)
    foregroundMist2.setDepth(11)
  }

  getCharacterTexture(state, frame = 1) {
    const prefix = this.selectedCharacter === 'estefi' ? 'estefi' : 'jako'

    if (state === 'idle') return frame === 1 ? `${prefix}Idle1` : `${prefix}Idle2`
    if (state === 'run') return `${prefix}Run${frame}`
    if (state === 'jump') return `${prefix}Jump`
    if (state === 'fall') return `${prefix}Fall`

    return `${prefix}Idle1`
  }

  getCharacterDisplaySize() {
    return {
      width: 158,
      height: 158
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(140, 650, 'playerBody')
    this.player.setVisible(false)
    this.player.setCollideWorldBounds(true)
    this.player.body.setSize(70, 140)

    this.physics.add.collider(this.player, this.platforms)

    this.playerShadow = this.add.ellipse(this.player.x + 6, this.player.y + 74, 98, 25, 0x000000, 0.24)
    this.playerShadow.setDepth(17)

    this.playerVisual = this.add.image(
      this.player.x,
      this.player.y + 70,
      this.getCharacterTexture('idle', 1)
    )
    this.playerVisual.setOrigin(0.5, 1)

    const size = this.getCharacterDisplaySize()
    this.playerVisual.setDisplaySize(size.width, size.height)
    this.playerVisual.setDepth(20)
    this.playerVisual.setAlpha(1)

    this.astroShadow = this.add.ellipse(this.player.x - 112, this.player.y + 73, 92, 24, 0x000000, 0.24)
    this.astroShadow.setDepth(18)

    this.astro = this.add.image(this.player.x - 112, this.player.y + 70, 'astroIdle1')
    this.astro.setOrigin(0.5, 1)
    this.astro.setDisplaySize(138, 110)
    this.astro.setDepth(21)
    this.astro.setAlpha(1)
    this.astro.clearTint()
  }

  createCoffeeItems() {
    this.coffees = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })

    const coffeePositions = [
      { x: 300, y: 655 },
      { x: 640, y: 555 },
      { x: 960, y: 480 },
      { x: 1280, y: 405 },
      { x: 2060, y: 480 },
      { x: 3540, y: 405 }
    ]

    coffeePositions.forEach((position, index) => {
      const glow = this.add.image(position.x, position.y, 'warmGlow')
      glow.setDisplaySize(100, 100)
      glow.setAlpha(0.18)
      glow.setDepth(15)

      const coffee = this.coffees.create(position.x, position.y, 'coffeeAsset')
      coffee.setDisplaySize(56, 56)
      coffee.setDepth(16)

      coffee.body.allowGravity = false
      coffee.body.immovable = true
      coffee.body.setSize(40, 40)

      coffee.setData('glow', glow)

      const baseY = position.y

      this.tweens.add({
        targets: [coffee, glow],
        y: baseY - 10,
        duration: 850 + index * 50,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })

      this.tweens.add({
        targets: glow,
        alpha: 0.32,
        duration: 720,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })

    this.physics.add.overlap(
      this.player,
      this.coffees,
      this.collectCoffee,
      null,
      this
    )
  }

  createEnemies() {
    this.enemies = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })

    const enemyData = [
      { x: 1380, y: 718, minX: 1240, maxX: 1500, speed: 120 },
      { x: 2470, y: 718, minX: 2320, maxX: 2610, speed: 125 },
      { x: 3600, y: 718, minX: 3440, maxX: 3760, speed: 130 }
    ]

    enemyData.forEach((data) => {
      const shadow = this.add.ellipse(data.x, data.y + 2, 70, 18, 0x000000, 0.21)
      shadow.setDepth(17)

      const enemy = this.enemies.create(data.x, data.y, 'thiefPlaceholder')
      enemy.setOrigin(0.5, 1)
      enemy.setDisplaySize(86, 110)
      enemy.setDepth(18)

      enemy.body.allowGravity = false
      enemy.body.immovable = true
      enemy.body.setSize(58, 90)
      enemy.body.setOffset(16, 22)

      enemy.setData('minX', data.minX)
      enemy.setData('maxX', data.maxX)
      enemy.setData('speed', data.speed)
      enemy.setData('direction', 1)
      enemy.setData('shadow', shadow)

      enemy.setVelocityX(data.speed)
    })

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handleEnemyCollision,
      null,
      this
    )
  }

  createGoal() {
    const goalShadow = this.add.ellipse(3980, 724, 230, 34, 0x000000, 0.24)
    goalShadow.setDepth(11)

    const goalGlow = this.add.image(3980, 595, 'warmGlow')
    goalGlow.setDisplaySize(340, 340)
    goalGlow.setAlpha(0.2)
    goalGlow.setDepth(11)

    this.goal = this.physics.add.staticImage(3980, 718, 'cafeGoalAsset')
    this.goal.setOrigin(0.5, 1)
    this.goal.setDisplaySize(250, 240)
    this.goal.setDepth(12)
    this.goal.refreshBody()

    this.physics.add.overlap(
      this.player,
      this.goal,
      this.handleGoalOverlap,
      null,
      this
    )

    this.tweens.add({
      targets: [this.goal, goalGlow],
      alpha: { from: 0.82, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  collectCoffee(player, coffee) {
    if (!coffee.active) return

    const glow = coffee.getData('glow')
    if (glow) glow.destroy()

    coffee.disableBody(true, true)

    this.coffeeCount += 1
    this.score += 100

    this.createCoffeeCollectEffect(coffee.x, coffee.y)
    this.updateHud()

    if (this.coffeeCount === this.totalCoffee) {
      this.showTemporaryMessage('¡Todos los cafés encontrados! Busca la cafetería.')
    }
  }

  createCoffeeCollectEffect(x, y) {
    for (let i = 0; i < 14; i += 1) {
      const particle = this.add.image(x, y, 'coffeeParticle')
      particle.setScale(1)
      particle.setAlpha(1)
      particle.setDepth(30)

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const distance = Phaser.Math.Between(40, 125)

      const targetX = x + Math.cos(angle) * distance
      const targetY = y + Math.sin(angle) * distance

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0,
        duration: 440,
        ease: 'Quad.easeOut',
        onComplete: () => {
          particle.destroy()
        }
      })
    }
  }

  handleEnemyCollision() {
    if (this.isInvulnerable || this.isGameOver || this.isVictory || this.isPaused) return

    this.lives -= 1
    this.updateHud()

    this.createDamageEffect()

    if (this.lives <= 0) {
      this.triggerGameOver()
      return
    }

    this.respawnPlayer()
  }

  createDamageEffect() {
    this.isInvulnerable = true

    this.cameras.main.shake(180, 0.008)

    this.tweens.add({
      targets: [this.playerVisual, this.astro],
      alpha: 0.25,
      duration: 90,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        this.playerVisual.setAlpha(1)
        this.astro.setAlpha(1)
        this.isInvulnerable = false
      }
    })

    this.showTemporaryMessage('¡Cuidado con los ladrones!')
  }

  respawnPlayer() {
    this.player.setVelocity(0, 0)
    this.player.setPosition(Math.max(140, this.player.x - 180), 650)
  }

  handleGoalOverlap() {
    if (this.isGameOver || this.isVictory || this.isPaused) return

    if (this.coffeeCount < this.totalCoffee) {
      if (!this.goalMessageCooldown) {
        const missing = this.totalCoffee - this.coffeeCount
        this.showTemporaryMessage(`Te faltan ${missing} café${missing === 1 ? '' : 's'}`)
        this.goalMessageCooldown = true

        this.time.delayedCall(1200, () => {
          this.goalMessageCooldown = false
        })
      }

      return
    }

    this.triggerVictory()
  }

  triggerVictory() {
    this.isVictory = true

    const bonus = this.lives * 250
    this.score += 1000 + bonus
    this.updateHud()

    this.player.setVelocity(0, 0)
    this.physics.pause()

    this.cameras.main.flash(400, 255, 230, 120)
    this.cameras.main.shake(160, 0.004)

    this.victoryText = this.add.text(
      640,
      290,
      `¡NIVEL COMPLETADO!\nEncontraste el café en Quito\n\nBonus vidas: ${bonus}\nPuntaje final: ${this.score}\n\nPresiona R para jugar otra vez`,
      {
        fontFamily: 'Arial',
        fontSize: '34px',
        fontStyle: 'bold',
        color: '#ffdf77',
        align: 'center',
        stroke: '#3a1b08',
        strokeThickness: 7
      }
    )

    this.victoryText.setOrigin(0.5)
    this.victoryText.setScrollFactor(0)
    this.victoryText.setDepth(150)

    this.tweens.add({
      targets: this.victoryText,
      scale: 1.04,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  triggerGameOver() {
    this.isGameOver = true

    this.player.setVelocity(0, 0)
    this.physics.pause()

    this.gameOverText = this.add.text(640, 320, 'GAME OVER\nPresiona R para reiniciar', {
      fontFamily: 'Arial',
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#ffdf77',
      align: 'center',
      stroke: '#3a1b08',
      strokeThickness: 8
    })

    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setDepth(150)
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.W,
      dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      restart: Phaser.Input.Keyboard.KeyCodes.R,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC
    })
  }

  createCamera() {
    this.cameras.main.setBounds(0, 0, 4200, 900)
    this.cameras.main.roundPixels = true

    const isMobile =
      this.sys.game.device.os.iOS ||
      this.sys.game.device.os.android ||
      window.innerWidth < 1000

    if (isMobile) {
      this.cameras.main.setZoom(1.22)
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
      this.cameras.main.setFollowOffset(0, 95)
    } else {
      this.cameras.main.setZoom(1.08)
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
      this.cameras.main.setFollowOffset(-220, 110)
    }
  }

  createHud() {
    const hudBg = this.add.rectangle(640, 34, 1280, 68, 0x06111f, 0.3)
    hudBg.setScrollFactor(0)
    hudBg.setDepth(90)

    this.logoText = this.add.text(24, 11, 'Chito\nQuito', {
      fontFamily: 'Arial',
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#ffbf38',
      lineSpacing: -9,
      stroke: '#06223f',
      strokeThickness: 3
    })
    this.logoText.setScrollFactor(0)
    this.logoText.setDepth(91)

    this.createHudPill(160, 10, 320, 46, 0x6d3f20, 0xffbf38)
    this.levelText = this.add.text(180, 20, 'Nivel 1 · Centro Histórico', {
      fontFamily: 'Arial',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#fff2dc'
    })
    this.levelText.setScrollFactor(0)
    this.levelText.setDepth(93)

    this.createHudPill(520, 10, 130, 46, 0x6d3f20, 0xffbf38)
    this.heartsText = this.add.text(548, 20, '❤️❤️❤️', {
      fontFamily: 'Arial',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.heartsText.setScrollFactor(0)
    this.heartsText.setDepth(93)

    this.createHudPill(690, 10, 120, 46, 0x3d812d, 0xb7f57e)
    this.coffeeText = this.add.text(713, 20, '☕ 0/6', {
      fontFamily: 'Arial',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.coffeeText.setScrollFactor(0)
    this.coffeeText.setDepth(93)

    this.createHudPill(850, 10, 160, 46, 0x166aa3, 0x7bd6ff)
    this.scoreText = this.add.text(875, 20, '⭐ 000000', {
      fontFamily: 'Arial',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.scoreText.setScrollFactor(0)
    this.scoreText.setDepth(93)

    this.createPauseButton()

    this.messageText = this.add.text(640, 105, '', {
      fontFamily: 'Arial',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffdf77',
      stroke: '#3a1b08',
      strokeThickness: 6
    })

    this.messageText.setOrigin(0.5)
    this.messageText.setScrollFactor(0)
    this.messageText.setAlpha(0)
    this.messageText.setDepth(95)

    this.updateHud()
  }

  createHudPill(x, y, width, height, color, strokeColor) {
    const shadow = this.add.rectangle(x + width / 2, y + height / 2 + 5, width, height, 0x000000, 0.22)
    shadow.setScrollFactor(0)
    shadow.setDepth(91)

    const pill = this.add.rectangle(x + width / 2, y + height / 2, width, height, color, 0.9)
    pill.setStrokeStyle(4, strokeColor, 0.75)
    pill.setScrollFactor(0)
    pill.setDepth(92)

    return pill
  }

  createPauseButton() {
    const x = 1228
    const y = 34

    const shadow = this.add.circle(x, y + 5, 31, 0x000000, 0.25)
    shadow.setScrollFactor(0)
    shadow.setDepth(100)

    this.pauseButton = this.add.circle(x, y, 31, 0xffbf38, 0.95)
    this.pauseButton.setStrokeStyle(4, 0xffffff, 0.38)
    this.pauseButton.setScrollFactor(0)
    this.pauseButton.setDepth(101)
    this.pauseButton.setInteractive({ useHandCursor: true })

    const icon = this.add.text(x, y, 'Ⅱ', {
      fontFamily: 'Arial',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#3a1b08'
    })
    icon.setOrigin(0.5)
    icon.setScrollFactor(0)
    icon.setDepth(102)

    this.pauseButton.on('pointerup', () => {
      this.togglePause()
    })
  }

  togglePause() {
    if (this.isGameOver || this.isVictory) return

    if (this.isPaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }

  pauseGame() {
    this.isPaused = true
    this.resetHtmlControls()

    this.player.setVelocity(0, 0)
    this.physics.pause()

    this.createPauseOverlay()
  }

  resumeGame() {
    this.isPaused = false
    this.physics.resume()

    this.pauseOverlay.forEach((item) => item.destroy())
    this.pauseOverlay = []
  }

  createPauseOverlay() {
    this.pauseOverlay.forEach((item) => item.destroy())
    this.pauseOverlay = []

    const dim = this.add.rectangle(640, 360, 1280, 720, 0x06111f, 0.66)
    dim.setScrollFactor(0)
    dim.setDepth(140)

    const panel = this.add.rectangle(640, 360, 520, 360, 0x081a2d, 0.96)
    panel.setStrokeStyle(5, 0xffbf38, 0.9)
    panel.setScrollFactor(0)
    panel.setDepth(141)

    const title = this.add.text(640, 250, 'Pausa', {
      fontFamily: 'Arial',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffbf38',
      stroke: '#3a1b08',
      strokeThickness: 8
    })
    title.setOrigin(0.5)
    title.setScrollFactor(0)
    title.setDepth(142)

    const resume = this.createPauseMenuButton(640, 335, 'Continuar', () => {
      this.resumeGame()
    })

    const restart = this.createPauseMenuButton(640, 425, 'Reiniciar nivel', () => {
      this.physics.resume()
      this.scene.restart({
        selectedCharacter: this.selectedCharacter
      })
    })

    const menu = this.createPauseMenuButton(640, 515, 'Volver al menú', () => {
      this.physics.resume()
      this.scene.start('MenuScene')
    })

    this.pauseOverlay.push(dim, panel, title, ...resume, ...restart, ...menu)
  }

  createPauseMenuButton(x, y, label, callback) {
    const shadow = this.add.rectangle(x, y + 7, 330, 58, 0x000000, 0.26)
    shadow.setScrollFactor(0)
    shadow.setDepth(142)

    const button = this.add.rectangle(x, y, 330, 58, 0xffbf38, 0.96)
    button.setStrokeStyle(4, 0xffffff, 0.36)
    button.setScrollFactor(0)
    button.setDepth(143)
    button.setInteractive({ useHandCursor: true })

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#3a1b08'
    })
    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(144)

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

    return [shadow, button, text]
  }

  updateHud() {
    if (!this.heartsText || !this.coffeeText || !this.scoreText) return

    const hearts = '❤️'.repeat(Math.max(this.lives, 0))
    const formattedScore = String(this.score).padStart(6, '0')

    this.heartsText.setText(hearts)
    this.coffeeText.setText(`☕ ${this.coffeeCount}/${this.totalCoffee}`)
    this.scoreText.setText(`⭐ ${formattedScore}`)
  }

  showTemporaryMessage(message) {
    if (!this.messageText || this.isGameOver || this.isVictory || this.isPaused) return

    this.messageText.setText(message)
    this.messageText.setAlpha(0)
    this.messageText.setScale(0.85)

    this.tweens.add({
      targets: this.messageText,
      alpha: 1,
      scale: 1,
      duration: 180,
      ease: 'Back.easeOut',
      yoyo: true,
      hold: 1300,
      onComplete: () => {
        this.messageText.setAlpha(0)
      }
    })
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      this.togglePause()
    }

    if (this.isGameOver || this.isVictory) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
        this.physics.resume()
        this.scene.restart({
          selectedCharacter: this.selectedCharacter
        })
      }

      return
    }

    if (this.isPaused) return

    if (!this.player || !this.player.body || !this.playerVisual || !this.astro) return

    const mobileControls = window.ChitoControls || {}

    const speed = this.keys.dash.isDown || mobileControls.dash ? 430 : 320
    const body = this.player.body

    const movingLeft = this.cursors.left.isDown || this.keys.left.isDown || mobileControls.left
    const movingRight = this.cursors.right.isDown || this.keys.right.isDown || mobileControls.right

    if (movingLeft && !movingRight) {
      body.setVelocityX(-speed)
      this.playerVisual.setFlipX(true)
      this.astro.setFlipX(true)
    } else if (movingRight && !movingLeft) {
      body.setVelocityX(speed)
      this.playerVisual.setFlipX(false)
      this.astro.setFlipX(false)
    } else {
      body.setVelocityX(0)
    }

    const keyboardJumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.keys.jump)

    const jumpPressed = keyboardJumpPressed || mobileControls.jumpQueued

    if (jumpPressed && body.blocked.down) {
      body.setVelocityY(-820)
    }

    if (window.ChitoControls) {
      window.ChitoControls.jumpQueued = false
    }

    this.updatePlayerVisual()
    this.updateAstro()
    this.updatePlayerTexture()
    this.updateAstroTexture()
    this.updateEnemies()
  }

  updateEnemies() {
    if (!this.enemies) return

    const enemyList = this.enemies.getChildren ? this.enemies.getChildren() : []

    enemyList.forEach((enemy) => {
      if (!enemy || !enemy.body) return

      const minX = enemy.getData('minX')
      const maxX = enemy.getData('maxX')
      const speed = enemy.getData('speed')
      let direction = enemy.getData('direction')

      if (enemy.x >= maxX) {
        direction = -1
      } else if (enemy.x <= minX) {
        direction = 1
      }

      enemy.setData('direction', direction)
      enemy.setVelocityX(speed * direction)
      enemy.setFlipX(direction < 0)

      const shadow = enemy.getData('shadow')
      if (shadow) {
        shadow.x = enemy.x
        shadow.y = enemy.y + 2
      }
    })
  }

  updatePlayerVisual() {
    this.playerVisual.x = this.player.x
    this.playerVisual.y = this.player.y + 70

    const size = this.getCharacterDisplaySize()
    this.playerVisual.setDisplaySize(size.width, size.height)
    this.playerVisual.setAlpha(1)
    this.playerVisual.clearTint()

    if (this.playerShadow) {
      this.playerShadow.x = this.player.x + 6
      this.playerShadow.y = this.player.y + 74
      this.playerShadow.setAlpha(this.player.body.blocked.down ? 0.24 : 0.08)
      this.playerShadow.setScale(this.player.body.blocked.down ? 1 : 0.72)
    }
  }

  updateAstro() {
    const directionOffset = this.playerVisual.flipX ? 112 : -112
    const targetX = this.player.x + directionOffset
    const targetY = this.player.y + 70

    this.astro.x = Phaser.Math.Linear(this.astro.x, targetX, 0.08)
    this.astro.y = Phaser.Math.Linear(this.astro.y, targetY, 0.08)

    this.astro.setDisplaySize(138, 110)
    this.astro.setAlpha(1)
    this.astro.setDepth(21)
    this.astro.clearTint()

    if (this.astroShadow) {
      this.astroShadow.x = this.astro.x + 4
      this.astroShadow.y = this.astro.y + 4
      this.astroShadow.setAlpha(this.player.body.blocked.down ? 0.24 : 0.08)
      this.astroShadow.setScale(this.player.body.blocked.down ? 1 : 0.72)
    }
  }

  updatePlayerTexture() {
    if (!this.player || !this.player.body || !this.playerVisual) return

    const body = this.player.body
    const isMoving = Math.abs(body.velocity.x) > 20
    const isJumping = !body.blocked.down
    const frame = Math.floor(this.time.now / 120) % 3

    if (isJumping) {
      if (body.velocity.y < 0) {
        this.playerVisual.setTexture(this.getCharacterTexture('jump'))
      } else {
        this.playerVisual.setTexture(this.getCharacterTexture('fall'))
      }

      const size = this.getCharacterDisplaySize()
      this.playerVisual.setDisplaySize(size.width, size.height)
      this.playerVisual.setAlpha(1)
      this.playerVisual.clearTint()
      return
    }

    if (isMoving) {
      this.playerVisual.setTexture(this.getCharacterTexture('run', frame + 1))
    } else {
      const idleFrame = Math.floor(this.time.now / 450) % 2
      this.playerVisual.setTexture(this.getCharacterTexture('idle', idleFrame + 1))
    }

    const size = this.getCharacterDisplaySize()
    this.playerVisual.setDisplaySize(size.width, size.height)
    this.playerVisual.setAlpha(1)
    this.playerVisual.clearTint()
  }

  updateAstroTexture() {
    if (!this.astro || !this.player || !this.player.body) return

    const isMoving = Math.abs(this.player.body.velocity.x) > 20
    const isJumping = !this.player.body.blocked.down
    const frame = Math.floor(this.time.now / 140) % 3

    if (isJumping) {
      this.astro.setTexture('astroJump')
      this.astro.setDisplaySize(138, 110)
      this.astro.setAlpha(1)
      this.astro.clearTint()
      return
    }

    if (isMoving) {
      const frames = ['astroRun1', 'astroRun2', 'astroRun3']
      this.astro.setTexture(frames[frame])
    } else {
      const idleFrame = Math.floor(this.time.now / 500) % 2
      this.astro.setTexture(idleFrame === 0 ? 'astroIdle1' : 'astroIdle2')
    }

    this.astro.setDisplaySize(138, 110)
    this.astro.setAlpha(1)
    this.astro.clearTint()
  }
}