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

    this.touchLeft = false
    this.touchRight = false
    this.touchDash = false
    this.touchJump = false
    this.touchJumpQueued = false
    this.touchButtons = []
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
    this.physics.world.setBounds(0, 0, 4200, 900)

    this.input.addPointer(5)

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

    this.touchLeft = false
    this.touchRight = false
    this.touchDash = false
    this.touchJump = false
    this.touchJumpQueued = false
    this.touchButtons = []
    this.pauseOverlay = []

    this.createTextures()
    this.createBackground()
    this.createPlatforms()
    this.createDecorProps()
    this.createPlayer()
    this.createCoffeeItems()
    this.createEnemies()
    this.createGoal()
    this.createControls()
    this.createCamera()
    this.createHud()
    this.createTouchControls()
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

    g.clear()
    g.fillStyle(0x7b5135, 1)
    g.fillRect(0, 0, 128, 180)

    g.fillStyle(0x9a6640, 1)
    g.fillRect(0, 0, 128, 32)

    g.fillStyle(0xc8843e, 1)
    for (let x = 0; x < 128; x += 24) {
      g.fillCircle(x + 12, 5, 11)
    }

    g.fillStyle(0x5d3b27, 1)
    g.fillRect(0, 58, 128, 8)
    g.fillRect(0, 116, 128, 7)

    g.fillStyle(0x6f472e, 1)
    for (let y = 72; y < 160; y += 28) {
      for (let x = 0; x < 128; x += 36) {
        g.fillRect(x + ((y / 28) % 2) * 16, y, 28, 12)
      }
    }

    g.lineStyle(3, 0xe0b15f, 1)
    g.strokeRect(0, 0, 128, 180)
    g.generateTexture('cleanGroundTile', 128, 180)

    g.clear()
    g.fillStyle(0x6e4a33, 1)
    g.fillRect(0, 0, 128, 64)

    g.fillStyle(0x9b6a45, 1)
    g.fillRect(0, 0, 128, 15)

    g.lineStyle(3, 0xe0b15f, 1)
    g.strokeRect(0, 0, 128, 64)

    g.fillStyle(0x5c3c29, 1)
    for (let x = 8; x < 128; x += 34) {
      g.fillRect(x, 28, 24, 10)
    }

    g.generateTexture('cleanStonePlatform', 128, 64)

    g.clear()
    g.fillStyle(0x8b552c, 1)
    g.fillRect(0, 0, 128, 64)

    g.fillStyle(0xb8793e, 1)
    g.fillRect(0, 0, 128, 15)

    g.fillStyle(0x5b321a, 1)
    g.fillRect(0, 31, 128, 6)

    g.lineStyle(3, 0xe0b15f, 1)
    g.strokeRect(0, 0, 128, 64)

    g.fillStyle(0x3d2414, 1)
    for (let x = 16; x < 128; x += 38) {
      g.fillCircle(x, 42, 4)
      g.fillCircle(x + 16, 42, 4)
    }

    g.generateTexture('cleanWoodPlatform', 128, 64)

    g.clear()
    g.fillStyle(0xffd978, 1)
    g.fillCircle(8, 8, 8)
    g.generateTexture('coffeeParticle', 16, 16)

    g.clear()
    g.fillStyle(0x000000, 0.18)
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

    g.destroy()
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#8ed7ff')

    const sky = this.add.image(0, 0, 'sky')
    sky.setOrigin(0, 0)
    sky.setDisplaySize(4200, 900)
    sky.setScrollFactor(0.05)
    sky.setDepth(0)

    const mountains = this.add.image(0, 0, 'mountains')
    mountains.setOrigin(0, 0)
    mountains.setDisplaySize(4200, 900)
    mountains.setScrollFactor(0.15)
    mountains.setDepth(1)

    const cityFar = this.add.image(0, 0, 'cityFar')
    cityFar.setOrigin(0, 0)
    cityFar.setDisplaySize(4200, 900)
    cityFar.setScrollFactor(0.28)
    cityFar.setDepth(2)

    const buildingsMid = this.add.image(0, 0, 'buildingsMid')
    buildingsMid.setOrigin(0, 0)
    buildingsMid.setDisplaySize(4200, 900)
    buildingsMid.setScrollFactor(0.55)
    buildingsMid.setDepth(3)
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup()

    this.addGround(0, 720, 4200, 180)

    const platformData = [
      { x: 520, y: 610, w: 240, h: 42, key: 'cleanStonePlatform' },
      { x: 840, y: 535, w: 240, h: 42, key: 'cleanStonePlatform' },
      { x: 1160, y: 460, w: 240, h: 42, key: 'cleanStonePlatform' },

      { x: 1600, y: 610, w: 260, h: 42, key: 'cleanWoodPlatform' },
      { x: 1940, y: 535, w: 260, h: 42, key: 'cleanWoodPlatform' },
      { x: 2280, y: 460, w: 260, h: 42, key: 'cleanWoodPlatform' },

      { x: 2780, y: 610, w: 240, h: 42, key: 'cleanStonePlatform' },
      { x: 3100, y: 535, w: 240, h: 42, key: 'cleanStonePlatform' },
      { x: 3420, y: 460, w: 240, h: 42, key: 'cleanStonePlatform' }
    ]

    platformData.forEach((p) => {
      this.addCleanPlatform(p.x, p.y, p.w, p.h, p.key)
    })
  }

  addGround(x, y, width, height) {
    const base = this.add.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      0x7b5135
    )
    base.setDepth(4)

    const visual = this.add.tileSprite(
      x + width / 2,
      y + height / 2,
      width,
      height,
      'cleanGroundTile'
    )
    visual.setDepth(5)

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
      x + width / 2,
      y + height / 2 + 12,
      width,
      64,
      0x000000,
      0.14
    )
    shadow.setDepth(4)

    const base = this.add.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      64,
      0x6e4a33
    )
    base.setDepth(5)

    const visual = this.add.tileSprite(
      x + width / 2,
      y + height / 2,
      width,
      64,
      visualKey
    )
    visual.setDepth(6)

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
    const shadow = this.add.ellipse(x, bottomY + 4, height * 0.65, 18, 0x000000, 0.16)
    shadow.setDepth(8)

    const prop = this.add.image(x, bottomY, key)
    prop.setOrigin(0.5, 1)
    prop.setDisplaySize((prop.width / prop.height) * height, height)
    prop.setDepth(9)

    return prop
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
      width: 150,
      height: 150
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(140, 650, 'playerBody')
    this.player.setVisible(false)
    this.player.setCollideWorldBounds(true)
    this.player.body.setSize(70, 140)

    this.physics.add.collider(this.player, this.platforms)

    this.playerShadow = this.add.ellipse(this.player.x, this.player.y + 72, 90, 22, 0x000000, 0.2)
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

    this.astroShadow = this.add.ellipse(this.player.x - 105, this.player.y + 72, 76, 18, 0x000000, 0.18)
    this.astroShadow.setDepth(16)

    this.astro = this.add.image(this.player.x - 105, this.player.y + 70, 'astroIdle1')
    this.astro.setOrigin(0.5, 1)
    this.astro.setDisplaySize(120, 95)
    this.astro.setDepth(19)
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
      const coffee = this.coffees.create(position.x, position.y, 'coffeeAsset')

      coffee.setDisplaySize(56, 56)
      coffee.setDepth(16)

      coffee.body.allowGravity = false
      coffee.body.immovable = true
      coffee.body.setSize(40, 40)

      const baseY = position.y

      this.tweens.add({
        targets: coffee,
        y: baseY - 10,
        duration: 850 + index * 50,
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
      targets: this.goal,
      alpha: 0.82,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  collectCoffee(player, coffee) {
    if (!coffee.active) return

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
    for (let i = 0; i < 12; i += 1) {
      const particle = this.add.image(x, y, 'coffeeParticle')
      particle.setScale(1)
      particle.setAlpha(1)
      particle.setDepth(30)

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const distance = Phaser.Math.Between(40, 120)

      const targetX = x + Math.cos(angle) * distance
      const targetY = y + Math.sin(angle) * distance

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0,
        duration: 420,
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
      800,
      360,
      `¡NIVEL COMPLETADO!\nEncontraste el café en Quito\n\nBonus vidas: ${bonus}\nPuntaje final: ${this.score}\n\nPresiona R para jugar otra vez`,
      {
        fontFamily: 'Arial',
        fontSize: '42px',
        fontStyle: 'bold',
        color: '#ffdf77',
        align: 'center',
        stroke: '#3a1b08',
        strokeThickness: 8
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

    this.gameOverText = this.add.text(800, 390, 'GAME OVER\nPresiona R para reiniciar', {
      fontFamily: 'Arial',
      fontSize: '48px',
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
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
    this.cameras.main.setFollowOffset(-350, 120)
  }

  createHud() {
    const hudBg = this.add.rectangle(800, 42, 1600, 84, 0x06111f, 0.32)
    hudBg.setScrollFactor(0)
    hudBg.setDepth(90)

    this.logoText = this.add.text(32, 14, 'Chito\nQuito', {
      fontFamily: 'Arial',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#ffbf38',
      lineSpacing: -10,
      stroke: '#06223f',
      strokeThickness: 3
    })
    this.logoText.setScrollFactor(0)
    this.logoText.setDepth(91)

    this.createHudPill(172, 16, 430, 52, 0x6d3f20, 0xffbf38)
    this.levelText = this.add.text(195, 26, 'Nivel 1 · Centro Histórico', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#fff2dc'
    })
    this.levelText.setScrollFactor(0)
    this.levelText.setDepth(93)

    this.createHudPill(650, 16, 170, 52, 0x6d3f20, 0xffbf38)
    this.heartsText = this.add.text(674, 26, '❤️❤️❤️', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.heartsText.setScrollFactor(0)
    this.heartsText.setDepth(93)

    this.createHudPill(850, 16, 150, 52, 0x3d812d, 0xb7f57e)
    this.coffeeText = this.add.text(878, 26, '☕ 0/6', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.coffeeText.setScrollFactor(0)
    this.coffeeText.setDepth(93)

    this.createHudPill(1030, 16, 190, 52, 0x166aa3, 0x7bd6ff)
    this.scoreText = this.add.text(1058, 26, '⭐ 000000', {
      fontFamily: 'Arial',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff'
    })
    this.scoreText.setScrollFactor(0)
    this.scoreText.setDepth(93)

    this.createPauseButton()

    this.messageText = this.add.text(800, 128, '', {
      fontFamily: 'Arial',
      fontSize: '32px',
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

    const pill = this.add.rectangle(x + width / 2, y + height / 2, width, height, color, 0.92)
    pill.setStrokeStyle(4, strokeColor, 0.75)
    pill.setScrollFactor(0)
    pill.setDepth(92)

    return pill
  }

  createPauseButton() {
    const x = 1530
    const y = 43

    const shadow = this.add.circle(x, y + 5, 36, 0x000000, 0.25)
    shadow.setScrollFactor(0)
    shadow.setDepth(100)

    this.pauseButton = this.add.circle(x, y, 36, 0xffbf38, 0.95)
    this.pauseButton.setStrokeStyle(4, 0xffffff, 0.38)
    this.pauseButton.setScrollFactor(0)
    this.pauseButton.setDepth(101)
    this.pauseButton.setInteractive({ useHandCursor: true })

    const icon = this.add.text(x, y, 'Ⅱ', {
      fontFamily: 'Arial',
      fontSize: '34px',
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

  createTouchControls() {
    const leftButton = this.createTouchButton({
      x: 96,
      y: 792,
      label: '←',
      color: 0x27bdff,
      onDown: () => {
        this.touchLeft = true
      },
      onUp: () => {
        this.touchLeft = false
      }
    })

    const rightButton = this.createTouchButton({
      x: 218,
      y: 792,
      label: '→',
      color: 0x27bdff,
      onDown: () => {
        this.touchRight = true
      },
      onUp: () => {
        this.touchRight = false
      }
    })

    const dashButton = this.createTouchButton({
      x: 1355,
      y: 792,
      label: '⚡',
      color: 0x9b55ff,
      onDown: () => {
        this.touchDash = true
      },
      onUp: () => {
        this.touchDash = false
      }
    })

    const jumpButton = this.createTouchButton({
      x: 1490,
      y: 792,
      label: '↑',
      color: 0xffbf38,
      onDown: () => {
        this.touchJump = true
        this.touchJumpQueued = true
      },
      onUp: () => {
        this.touchJump = false
      }
    })

    this.touchButtons.push(leftButton, rightButton, dashButton, jumpButton)
  }

  createTouchButton({ x, y, label, color, onDown, onUp }) {
    const shadow = this.add.circle(x, y + 8, 52, 0x000000, 0.25)
    shadow.setScrollFactor(0)
    shadow.setDepth(120)

    const button = this.add.circle(x, y, 52, color, 0.72)
    button.setStrokeStyle(5, 0xffdf77, 0.86)
    button.setScrollFactor(0)
    button.setDepth(121)
    button.setInteractive({ useHandCursor: true })

    const text = this.add.text(x, y + 1, label, {
      fontFamily: 'Arial',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#13233a',
      strokeThickness: 5
    })

    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(122)

    let activePointerId = null

    const press = (pointer) => {
      if (this.isPaused || this.isGameOver || this.isVictory) return
      if (activePointerId !== null) return

      activePointerId = pointer.id

      button.setScale(0.92)
      shadow.setScale(0.92)
      text.setScale(0.92)

      onDown()
    }

    const release = (pointer) => {
      if (activePointerId === null) return
      if (pointer && pointer.id !== activePointerId) return

      activePointerId = null

      button.setScale(1)
      shadow.setScale(1)
      text.setScale(1)

      onUp()
    }

    button.on('pointerdown', press)
    button.on('pointerup', release)
    button.on('pointerout', release)
    button.on('pointerupoutside', release)

    this.input.on('pointerup', (pointer) => {
      release(pointer)
    })

    return {
      shadow,
      button,
      text
    }
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
    this.touchLeft = false
    this.touchRight = false
    this.touchDash = false
    this.touchJump = false
    this.touchJumpQueued = false

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

    const dim = this.add.rectangle(800, 450, 1600, 900, 0x06111f, 0.66)
    dim.setScrollFactor(0)
    dim.setDepth(140)

    const panel = this.add.rectangle(800, 450, 610, 420, 0x081a2d, 0.96)
    panel.setStrokeStyle(5, 0xffbf38, 0.9)
    panel.setScrollFactor(0)
    panel.setDepth(141)

    const title = this.add.text(800, 310, 'Pausa', {
      fontFamily: 'Arial',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#ffbf38',
      stroke: '#3a1b08',
      strokeThickness: 8
    })
    title.setOrigin(0.5)
    title.setScrollFactor(0)
    title.setDepth(142)

    const resume = this.createPauseMenuButton(800, 410, 'Continuar', () => {
      this.resumeGame()
    })

    const restart = this.createPauseMenuButton(800, 510, 'Reiniciar nivel', () => {
      this.physics.resume()
      this.scene.restart({
        selectedCharacter: this.selectedCharacter
      })
    })

    const menu = this.createPauseMenuButton(800, 610, 'Volver al menú', () => {
      this.physics.resume()
      this.scene.start('MenuScene')
    })

    this.pauseOverlay.push(dim, panel, title, ...resume, ...restart, ...menu)
  }

  createPauseMenuButton(x, y, label, callback) {
    const shadow = this.add.rectangle(x, y + 7, 370, 64, 0x000000, 0.26)
    shadow.setScrollFactor(0)
    shadow.setDepth(142)

    const button = this.add.rectangle(x, y, 370, 64, 0xffbf38, 0.96)
    button.setStrokeStyle(4, 0xffffff, 0.36)
    button.setScrollFactor(0)
    button.setDepth(143)
    button.setInteractive({ useHandCursor: true })

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '28px',
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

    const speed = this.keys.dash.isDown || this.touchDash ? 430 : 320
    const body = this.player.body

    const movingLeft = this.cursors.left.isDown || this.keys.left.isDown || this.touchLeft
    const movingRight = this.cursors.right.isDown || this.keys.right.isDown || this.touchRight

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

    const jumpPressed = keyboardJumpPressed || this.touchJumpQueued

    if (jumpPressed && body.blocked.down) {
      body.setVelocityY(-820)
    }

    this.touchJumpQueued = false

    this.updatePlayerVisual()
    this.updateAstro()
    this.updatePlayerTexture()
    this.updateAstroTexture()
    this.updateEnemies()
  }

  updateEnemies() {
    if (!this.enemies) return

    const enemyList = this.enemies.getChildren
      ? this.enemies.getChildren()
      : []

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
    })
  }

  updatePlayerVisual() {
    this.playerVisual.x = this.player.x
    this.playerVisual.y = this.player.y + 70

    const size = this.getCharacterDisplaySize()
    this.playerVisual.setDisplaySize(size.width, size.height)

    if (this.playerShadow) {
      this.playerShadow.x = this.player.x
      this.playerShadow.y = this.player.y + 72
      this.playerShadow.setAlpha(this.player.body.blocked.down ? 0.2 : 0.08)
    }
  }

  updateAstro() {
    const directionOffset = this.playerVisual.flipX ? 105 : -105
    const targetX = this.player.x + directionOffset
    const targetY = this.player.y + 70

    this.astro.x = Phaser.Math.Linear(this.astro.x, targetX, 0.08)
    this.astro.y = Phaser.Math.Linear(this.astro.y, targetY, 0.08)

    this.astro.setDisplaySize(120, 95)

    if (this.astroShadow) {
      this.astroShadow.x = this.astro.x
      this.astroShadow.y = this.astro.y + 2
      this.astroShadow.setAlpha(this.player.body.blocked.down ? 0.18 : 0.07)
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
  }

  updateAstroTexture() {
    if (!this.astro || !this.player || !this.player.body) return

    const isMoving = Math.abs(this.player.body.velocity.x) > 20
    const isJumping = !this.player.body.blocked.down
    const frame = Math.floor(this.time.now / 140) % 3

    if (isJumping) {
      this.astro.setTexture('astroJump')
      this.astro.setDisplaySize(120, 95)
      return
    }

    if (isMoving) {
      const frames = ['astroRun1', 'astroRun2', 'astroRun3']
      this.astro.setTexture(frames[frame])
    } else {
      const idleFrame = Math.floor(this.time.now / 500) % 2
      this.astro.setTexture(idleFrame === 0 ? 'astroIdle1' : 'astroIdle2')
    }

    this.astro.setDisplaySize(120, 95)
  }
}