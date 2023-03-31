import "./style.scss";
import Phaser from 'phaser';
import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";

console.log(import.meta.env);


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: import.meta.env.DEV ? true : false
		}
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 2
	},
	backgroundColor: '#4488aa',
})