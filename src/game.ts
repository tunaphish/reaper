import * as Phaser from 'phaser';
import Scenes from './scenes';
import ReactOverlay from './plugins/ReactOverlay';

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
    global: [{ key: 'react-overlay', plugin: ReactOverlay, start: true, mapping: 'reactOverlay' }],
  },
};

const seedLocalStorage = () => {
  localStorage.setItem(
    "reaper:playersave",
    JSON.stringify({
      spirits: 120,
      seenEnemies: [
        { enemyName: "Fencer", seenAt: Date.now() - 86400000 },
        { enemyName: "Knight", seenAt: Date.now() },
      ],
    })
  );
};
seedLocalStorage();

const game = new Phaser.Game(gameConfig);

export default game;

window.addEventListener('resize', () => {
  game.scale.refresh();
});