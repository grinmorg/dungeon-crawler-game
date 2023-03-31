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
