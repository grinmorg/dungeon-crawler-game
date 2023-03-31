import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Phaser.Physics.Arcade.Sprite;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  create() {
    // this.add.image(0,0,'tiles');

    // создаю сцену из tilemap json
    const map = this.make.tilemap({ key: "dungeon" });

    // сопоставление тайлов с загруженным png (название тайлов берётся из редактора)
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    map.createLayer("Ground", tileset);

    const wallsLayer = map.createLayer("Walls", tileset);

    // Добавляю стенам свойство
    wallsLayer.setCollisionByProperty({ collides: true });

    // персонаж
    this.fauna = this.physics.add.sprite(128, 128, "fauna", "walk-down-3.png");

    // делаю чуть меньше хитбокс
    this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.6);
    this.fauna.body.offset.y = 14;

    // ставлю в изначальную позицию
    this.fauna.setPosition(48, 48);

    this.anims.create({
      key: "fauna-idle-down",
      frames: [{ key: "fauna", frame: "walk-down-3.png" }],
    });

    this.anims.create({
      key: "fauna-idle-up",
      frames: [{ key: "fauna", frame: "walk-up-3.png" }],
    });

    this.anims.create({
      key: "fauna-idle-side",
      frames: [{ key: "fauna", frame: "walk-side-3.png" }],
    });

    this.anims.create({
      key: "fauna-run-down",
      frames: this.anims.generateFrameNames("fauna", {
        start: 1,
        end: 8,
        prefix: "run-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "fauna-run-up",
      frames: this.anims.generateFrameNames("fauna", {
        start: 1,
        end: 8,
        prefix: "run-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "fauna-run-side",
      frames: this.anims.generateFrameNames("fauna", {
        start: 1,
        end: 8,
        prefix: "run-side-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "fauna-faint",
      frames: this.anims.generateFrameNames("fauna", {
        start: 1,
        end: 4,
        prefix: "faint-",
        suffix: ".png",
      }),
      frameRate: 15,
    });

    // столкновение (со стенами)
    this.physics.add.collider(this.fauna, wallsLayer);

    // camera
    this.cameras.main.startFollow(this.fauna, true);
    // this.fauna.anims.play('fauna-run-side');
  }

  update(): void {
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
