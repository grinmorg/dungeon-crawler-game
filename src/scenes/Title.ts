import Phaser from "phaser";

export default class Title extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // bg
    this.add.sprite(0, 0, "bg-title").setOrigin(0);

    // welcome
    this.add.text(screenCenterX, 30, "- Welcome to Dungeon Crawler -").setOrigin(0.5, 0.5);
    this.add.text(screenCenterX, this.cameras.main.worldView.y + this.cameras.main.height - 20, "Author of assets - 0x72", { font: '"Press Start 2P"' }).setOrigin(0.5, 0.5);


    // controlls
    this.add.image(screenCenterX, screenCenterY, "controlls");

    // play btn
    const textPlay = this.add.text(screenCenterX, 80, "[ Play Game ]").setOrigin(0.5, 0.5);
    textPlay.setInteractive();

    textPlay.on("pointerover", () => {
      textPlay.setTint(0xff0000);
    });
    textPlay.on("pointerout", () => {
      textPlay.setTint(0xffffff);
    });

    textPlay.on("pointerup", () => {
      this.scene.start("game");
    });
  }
}
