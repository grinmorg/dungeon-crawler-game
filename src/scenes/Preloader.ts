import Phaser from "phaser";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "tiles/dungeon_tiles_extrud.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

    // characters
    this.load.atlas(
      "fauna",
      "characters/fauna/fauna.png",
      "characters/fauna/fauna.json"
    );

    // enemies
    this.load.atlas("skel", "enemies/skel/skel.png", "enemies/skel/skel.json");

    // weapon
    this.load.image("knife", "weapons/weapon_knife.png");

    // items
    this.load.atlas("treasure", "items/treasure.png", "items/treasure.json");

    // ui
    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-half", "ui/ui_heart_half.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");
    this.load.image('joystick', 'ui/joystick.png');
    this.load.image('knife-icon', 'ui/arrow-archery.svg');

    // particles
    this.load.image("smoke", "particles/white-smoke.png");

    // audio
    this.load.audio("skel-dead", "audio/skeleton.mp3");
    this.load.audio("back", "audio/back.mp3");
    this.load.audio("player-damage", "audio/player-damage.mp3");
    this.load.audio("body-fall", "audio/body-fall.mp3");
    this.load.audio("pow", "audio/pow.mp3");
    this.load.audio("collect-coins", "audio/collect-coins.mp3");

    // joystick
    this.load.plugin("rexvirtualjoystickplugin", VirtualJoystickPlugin, true);
  }

  create() {
    // запуск сцены game
    this.scene.start("game");

    
  }
}
