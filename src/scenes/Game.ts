import Phaser from "phaser";
import { createSkelAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Skel from "../enemies/Skel";
import debugDraw from "../utils/debug";
import { IAddKeys } from "../@types/player";

import Fauna from "../characters/Fauna";
import "../characters/Fauna";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Fauna;
  private addKeys!: IAddKeys;

  // private particles!: Phaser.GameObjects.Particles.ParticleEmitterManager;

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

    if (import.meta.env.DEV) {
      debugDraw(this, wallsLayer);
      debugDraw(this, itemsLayer);
    }

    // персонаж
    this.fauna = this.add.fauna(128, 128, "fauna");

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
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const skel = obj2 as Skel;

    const dx = this.fauna.x - skel.x;
    const dy = this.fauna.y - skel.y;

    // { x: -169.20240379829326, y: -106.63276489371978 }
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.fauna.handleDamage(dir);

    // sceneEvents.emit('player-health-changed', this.fauna.health)

    // if (this.fauna.health <= 0)
    // {
    // 	this.playerLizardsCollider?.destroy()
    // }
  }

  update(): void {
    if (this.fauna) {
      this.fauna.update(this.cursors, this.addKeys);
    }
  }
}
