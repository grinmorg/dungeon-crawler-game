import Phaser from "phaser";
import { createSkelAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Skel from "../enemies/Skel";
import debugDraw from "../utils/debug";
import { IAddKeys } from "../@types/player";

import Fauna from "../characters/Fauna";
import "../characters/Fauna";
import { sceneEvents } from "../events/EventsCenter";
import { createChestAnims } from "../anims/ChestAnims";
import Chest from "../items/Chest";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Fauna;
  private addKeys!: IAddKeys;
  private knives!: Phaser.Physics.Arcade.Group;
  private skels!: Phaser.Physics.Arcade.Group;
  private playerSkelsCollider?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("game");

    this.addKeys = {} as IAddKeys;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.addKeys.w = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.addKeys.a = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.addKeys.s = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.addKeys.d = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
  }

  create() {
    // музыка на задний фон || ТОЛЬКО ДЛЯ ПРОДА))
    if (import.meta.env.PROD) {
      const soundBack = this.sound.add("back");
      soundBack.play({
        rate: 1,
        loop: true,
        volume: 0.1,
      });
    }

    this.scene.run("game-ui");

    createCharacterAnims(this.anims);
    createSkelAnims(this.anims);
    createChestAnims(this.anims);
    // this.add.image(0,0,'tiles');

    // создаю сцену из tilemap json
    const map = this.make.tilemap({ key: "dungeon" });

    // сопоставление тайлов с загруженным png (название тайлов берётся из редактора)
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    map.createLayer("Ground", tileset);

    const wallsLayer = map.createLayer("Walls", tileset);
    const itemsLayer = map.createLayer("Items", tileset); // огонь на стенах, колонны и тд

    // сундуки
    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestLayer = map.getObjectLayer("Chests");
    chestLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        "treasure"
      ); // removed chest_empty_open_anim_f0.png
    });

    // Добавляю стенам свойство
    wallsLayer.setCollisionByProperty({ collides: true });
    itemsLayer.setCollisionByProperty({ collides: true });
    // персонаж
    this.fauna = this.add.fauna(128, 128, "fauna");

    // ставлю в изначальную позицию
    this.fauna.setPosition(48, 48);

    // ножи для игрока
    // создание ножей
    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
    });
    this.fauna.setKnives(this.knives);

    if (import.meta.env.DEV) {
      debugDraw(this, wallsLayer);
      debugDraw(this, itemsLayer);
    }

    // camera
    this.cameras.main.startFollow(this.fauna, true);
    // this.fauna.anims.play('fauna-run-side');

    // моб скелет
    this.skels = this.physics.add.group({
      classType: Skel,
    });

    const skelsLayer = map.getObjectLayer("Skelets");
    skelsLayer.objects.forEach((skelObj) => {
      this.skels.get(skelObj.x! + skelObj.width! * 0.5, skelObj.y! + skelObj.height! * 0.5, "skel");
    });

    // столкновение (со стенами)
    this.physics.add.collider(this.fauna, wallsLayer);
    this.physics.add.collider(this.skels, wallsLayer);
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );

    // столкновение (с предметами)
    this.physics.add.collider(this.fauna, itemsLayer);
    this.physics.add.collider(this.skels, itemsLayer);
    this.physics.add.collider(
      this.fauna,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );

    // столкновение игрока с мобами
    this.playerSkelsCollider = this.physics.add.collider(
      this.fauna,
      this.skels,
      this.handlePlayerSkedCollision,
      undefined,
      this
    );

    // столкновение ножей со скелетами
    this.physics.add.collider(
      this.knives,
      this.skels,
      this.handleKnifeSkelsCollision,
      undefined,
      this
    );
  }

  private handlePlayerChestCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const chest = obj2 as Chest;

    this.fauna.setChest(chest);
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    _: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeSkelsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj1.destroy();

    // эфект и звук

    const soundDeathSkel = this.sound.add("skel-dead");
    soundDeathSkel.play({
      rate: 2,
      volume: 0.2,
    });

    // Немного дыма при столкновении
    const particles = this.add.particles("smoke");
    const emitter = particles.createEmitter({
      x: obj2.body.position.x,
      y: obj2.body.position.y,
      lifespan: 700,
      speed: { min: 50, max: 100 },
      scale: { start: 0.3, end: 0.2 },
      blendMode: "ADD",
    });

    // Explode the particles
    emitter.explode(1, obj2.body.position.x, obj2.body.position.y);

    obj2.destroy();
  }

  private handlePlayerSkedCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const skel = obj2 as Skel;

    const dx = this.fauna.x - skel.x;
    const dy = this.fauna.y - skel.y;

    // { x: -169.20240379829326, y: -106.63276489371978 }
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.fauna.handleDamage(dir);

    sceneEvents.emit("player-health-changed", this.fauna.health);

    if (this.fauna.health <= 0) {
      this.playerSkelsCollider?.destroy();
    }
  }

  update(): void {
    if (this.fauna) {
      this.fauna.update(this.cursors, this.addKeys);
    }
  }
}
