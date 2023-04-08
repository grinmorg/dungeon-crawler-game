import "./style.scss";
import Phaser from 'phaser';
import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";
import GameUI from "./scenes/GameUI";


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth / 2,
	height: window.innerHeight / 2,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: import.meta.env.DEV ? true : false
		}
	},
	scene: [Preloader, Game, GameUI],
	scale: {
		zoom: 2
	},
	backgroundColor: '#4488aa',
})