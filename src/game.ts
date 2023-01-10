import * as Phaser from 'phaser';
import Scenes from './scenes';
import UiOverlayPlugin from './ui/UiOverlayPlugin';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'r e a p e r',
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Scenes,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  parent: 'game',
  backgroundColor: '#000000',
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [{ key: 'ui-overlay', plugin: UiOverlayPlugin, start: false, mapping: 'ui' }],
  },
};

export const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
