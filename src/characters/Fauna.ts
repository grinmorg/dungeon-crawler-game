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

  private _health = 10;

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

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    --this._health;
    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.anims.play("fauna-faint");
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
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
