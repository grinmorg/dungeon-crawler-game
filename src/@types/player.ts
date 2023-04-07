export interface IPlayer {
  id: string;
  name: string;
  direction: "left" | "right";
  color: string;
  x: number;
  y: number;
  coins: number;
}

export interface IPlayersList {
  [key: string]: Phaser.Physics.Arcade.Image;
}

export interface IAddKeys {
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
}
