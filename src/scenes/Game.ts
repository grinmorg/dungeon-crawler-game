import Phaser from "phaser";
import { createSkelAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Skel from "../enemies/Skel";
import debugDraw from "../utils/debug";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Phaser.Physics.Arcade.Sprite;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private hit = 0;
  // private particles!: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // this.particles = this.add.particles("smoke");
  }

  create() {
    createCharacterAnims(this.anims);
    createSkelAnims(this.anims);
    // this.add.image(0,0,'tiles');

    // создаю сцену из tilemap json
    const map = this.make.tilemap({ key: "dungeon" });

    // сопоставление тайлов с загруженным png (название тайлов берётся из редактора)
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    map.createLayer("Ground", tileset);

    const wallsLayer = map.createLayer("Walls", tileset);
    const itemsLayer = map.createLayer("Items", tileset);

    // Добавляю стенам свойство
    wallsLayer.setCollisionByProperty({ collides: true });
    itemsLayer.setCollisionByProperty({ collides: true });

    debugDraw(this, wallsLayer);
    debugDraw(this, itemsLayer);

    // персонаж
    this.fauna = this.physics.add.sprite(128, 128, "fauna", "walk-down-3.png");

    // делаю чуть меньше хитбокс
    this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.5);
    this.fauna.body.offset.y = 14;

    // ставлю в изначальную позицию
    this.fauna.setPosition(48, 48);

    // camera
    this.cameras.main.startFollow(this.fauna, true);
    // this.fauna.anims.play('fauna-run-side');

    // моб скелет
    const skels = this.physics.add.group({
      classType: Skel,
    });

    skels.get(68, 96, "skel");
    setInterval(() => {
      skels.get(568, 296, "skel");
    }, 1000);

    // столкновение (со стенами)
    this.physics.add.collider(this.fauna, wallsLayer);
    this.physics.add.collider(skels, wallsLayer);

    // столкновение (с предметами)
    this.physics.add.collider(this.fauna, itemsLayer);
    this.physics.add.collider(skels, itemsLayer);

    // игрока с мобами
    this.physics.add.collider(
      this.fauna,
      skels,
      this.handlePlayerSkedCollision,
      undefined,
      this
    );
  }

  private handlePlayerSkedCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const skel = obj2 as Skel;

    const dx = this.fauna.x - skel.x;
    const dy = this.fauna.y - skel.y;

    // { x: -169.20240379829326, y: -106.63276489371978 }
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.fauna.setVelocity(dir.x, dir.y);

    this.hit = 1;

    // this.fauna.handleDamage(dir)

    // sceneEvents.emit('player-health-changed', this.fauna.health)

    // if (this.fauna.health <= 0)
    // {
    // 	this.playerLizardsCollider?.destroy()
    // }
  }

  update(): void {
    if (this.hit > 0) {
      ++this.hit;

      if (this.hit > 10) {
        this.hit = 0;
      }

      return;
    }

    if (!this.cursors || !this.fauna) {
      return;
    }

    const speed = 100;
    const speedSide = 80;

    //right && up
    if (
      (this.cursors.right?.isDown && this.cursors.up?.isDown) ||
      (this.keyD.isDown && this.keyW.isDown)
    ) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(speedSide, -speedSide);
      this.fauna.scaleX = 1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 8;
    }
    //right && down
    else if (
      (this.cursors.right?.isDown && this.cursors.down?.isDown) ||
      (this.keyD.isDown && this.keyS.isDown)
    ) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(speedSide, speedSide);
      this.fauna.scaleX = 1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 8;
    }
    //left && up
    else if (
      (this.cursors.left?.isDown && this.cursors.up?.isDown) ||
      (this.keyA.isDown && this.keyW.isDown)
    ) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(-speedSide, -speedSide);
      this.fauna.scaleX = -1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 24;
    }
    //left && down
    else if (
      (this.cursors.left?.isDown && this.cursors.down?.isDown) ||
      (this.keyA.isDown && this.keyS.isDown)
    ) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(-speedSide, speedSide);
      this.fauna.scaleX = -1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 24;
    }
    // left
    else if (this.cursors.left?.isDown || this.keyA.isDown) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(-speed, 0);
      this.fauna.scaleX = -1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 24;
    }
    //right
    else if (this.cursors.right?.isDown || this.keyD.isDown) {
      this.fauna.anims.play("fauna-run-side", true);
      this.fauna.setVelocity(speed, 0);
      this.fauna.scaleX = 1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 8;
    }
    // up
    else if (this.cursors.up?.isDown || this.keyW.isDown) {
      this.fauna.anims.play("fauna-run-up", true);
      this.fauna.setVelocity(0, -speed);
      this.fauna.scaleX = 1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 8;
    }
    // down
    else if (this.cursors.down?.isDown || this.keyS.isDown) {
      this.fauna.anims.play("fauna-run-down", true);
      this.fauna.setVelocity(0, speed);
      this.fauna.scaleX = 1;

      // bugfix - проход сквозь стены
      this.fauna.body.offset.x = 8;
    }

    // idle
    else {
      this.fauna.anims.play("fauna-idle-down", true);
      this.fauna.setVelocity(0, 0);
    }
  }
}
