import Expo from 'expo';
import ExpoPhaser from 'expo-phaser';
import './phaser-plugin-isometric.js';
import Playable from './states/Playable';

export default class Game {

  constructor({ context, width, height, seed }) {
    const game = ExpoPhaser.game({ context: context, width: width, height: height });
    this.expoGame = game, this.width = width, this.height = height;

    this.playable = new Playable({ game, context, seed });
    game.state.add('Playable', this.playable);
    game.state.start('Playable');
  }

  updateControls = velocity =>
    this.playable && this.playable.updateControls({ velocity });
  onTouchesBegan = (x, y) =>
    this.playable && this.playable.onTouchesBegan(x, y);
  onTouchesMoved = (x, y) =>
    this.playable && this.playable.onTouchesMoved(x, y);
  onTouchesEnded = (x, y) =>
    this.playable && this.playable.onTouchesEnded(x, y);
    onClick = (x, y, callback) =>
    this.playable && this.playable.onClick(x, y, callback);

}
