import Phaser from "phaser";
import { IAddKeys } from "../@types/player";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      fauna(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Fauna;
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;

  private _health = 3;

  private knives?: Phaser.Physics.Arcade.Group;

  get health() {
    return this._health;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("fauna-idle-down");
  }

  setKnives(knives: Phaser.Physics.Arcade.Group) {
    this.knives = knives;
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    --this._health;

    // sounds
    const soundDamage = this.scene.sound.add("player-damage");
    const soundBodyFall = this.scene.sound.add("body-fall");

    if (this._health <= 0) {
      // sound play
      soundBodyFall.play();

      this.healthState = HealthState.DEAD;
      this.anims.play("fauna-faint");
      this.setVelocity(0, 0);
    } else {
      // sound play
      soundDamage.play({
        volume: 0.3,
      });

      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  private throwKnife() {
    if (!this.knives) {
      return;
    }

    // sound
    const soundPow = this.scene.sound.add("pow");
    soundPow.play({
      volume: 0.3,
    });

    const knife = this.knives.get(
      this.x,
      this.y,
      "knife"
    ) as Phaser.Physics.Arcade.Image;

    if (!knife) {
      return;
    }

    const parts = this.anims.currentAnim.key.split("-");
    const direction = parts[2];

    const vec = new Phaser.Math.Vector2(0, 0); // {x: 0, y: 0}

    switch (direction) {
      case "up":
        vec.y = -1;
        break;

      case "down":
        vec.y = 1;
        break;

      default:
      case "side":
        if (this.scaleX < 0) {
          vec.x = -1;
        } else {
          vec.x = 1;
        }
        break;
    }

    const angle = vec.angle();

    knife.setActive(true);
    knife.setVisible(true);

    knife.setRotation(angle);

    // start position
    knife.x += vec.x * 16;
    knife.y += vec.y * 16;

    // speed knife
    knife.setVelocity(vec.x * 300, vec.y * 300);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, addKeys: IAddKeys) {
    // if dead - not inputs
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    if (!cursors) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      // if (this.activeChest)
      // {
      // 	const coins = this.activeChest.open()
      // 	this._coins += coins

      // 	sceneEvents.emit('player-coins-changed', this._coins)
      // }
      // else
      // {
      this.throwKnife();
      // }
      // return
    }

    const speed = 100;
    const speedSide = 80;

    const rightUpMove =
      (cursors.right?.isDown && cursors.up?.isDown) ||
      (addKeys.d.isDown && addKeys.w.isDown);
    const rightDownMove =
      (cursors.right?.isDown && cursors.down?.isDown) ||
      (addKeys.d.isDown && addKeys.s.isDown);
    const leftUpMove =
      (cursors.left?.isDown && cursors.up?.isDown) ||
      (addKeys.a.isDown && addKeys.w.isDown);
    const leftDownMove =
      (cursors.left?.isDown && cursors.down?.isDown) ||
      (addKeys.a.isDown && addKeys.s.isDown);

    const leftMove = cursors.left?.isDown || addKeys.a.isDown;
    const rightMove = cursors.right?.isDown || addKeys.d.isDown;
    const upMove = cursors.up?.isDown || addKeys.w.isDown;
    const downMove = cursors.down?.isDown || addKeys.s.isDown;

    //right && up
    if (rightUpMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(speedSide, -speedSide);
      this.scaleX = 1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 8;
    }
    //right && down
    else if (rightDownMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(speedSide, speedSide);
      this.scaleX = 1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 8;
    }
    //left && up
    else if (leftUpMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(-speedSide, -speedSide);
      this.scaleX = -1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 24;
    }
    //left && down
    else if (leftDownMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(-speedSide, speedSide);
      this.scaleX = -1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 24;
    }
    // left
    else if (leftMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 24;
    }
    //right
    else if (rightMove) {
      this.anims.play("fauna-run-side", true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 8;
    }
    // up
    else if (upMove) {
      this.anims.play("fauna-run-up", true);
      this.setVelocity(0, -speed);
      this.scaleX = 1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 8;
    }
    // down
    else if (downMove) {
      this.anims.play("fauna-run-down", true);
      this.setVelocity(0, speed);
      this.scaleX = 1;

      // bugfix - проход сквозь стены
      this.body.offset.x = 8;
    }

    // idle
    else {
      this.anims.play("fauna-idle-down", true);
      this.setVelocity(0, 0);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "fauna",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Fauna(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    // hitbox
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.5);
    sprite.body.offset.y = 14;

    return sprite;
  }
);
