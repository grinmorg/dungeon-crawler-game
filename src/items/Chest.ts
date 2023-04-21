import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.play("chest-closed");
  }

  open() {
    if (this.anims.currentAnim.key !== "chest-closed") {
      return 0;
    }

    // sound
    const sound = this.scene.sound.add("collect-coins");
    sound.play({
      volume: 0.3,
    });

    this.play("chest-open");
    return Phaser.Math.Between(50, 200);
  }
}
