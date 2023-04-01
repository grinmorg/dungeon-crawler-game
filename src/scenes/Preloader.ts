import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "tiles/dungeon_tiles_extrud.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");
    this.load.atlas("fauna", "characters/fauna/fauna.png", "characters/fauna/fauna.json");
    this.load.atlas("skel", "enemies/skel/skel.png", "enemies/skel/skel.json");
  }

  create() {
    // запуск сцены game
    this.scene.start("game");
  }
}
