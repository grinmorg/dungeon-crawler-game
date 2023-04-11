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
  
    // weapon
    this.load.image('knife', 'weapons/weapon_knife.png')

    // ui
    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-half", "ui/ui_heart_half.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");

    // particles
    this.load.image("smoke", "particles/white-smoke.png");
  

    // audio
    this.load.audio('skel-dead', 'audio/skeleton.mp3');
    this.load.audio('back', 'audio/back.mp3');
    this.load.audio('player-damage', 'audio/player-damage.wav');
  }

  create() {
    // запуск сцены game
    this.scene.start("game");
  }
}
