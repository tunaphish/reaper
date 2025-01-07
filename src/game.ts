import * as Phaser from 'phaser';
import Scenes from './scenes';
import ReactOverlay from './plugins/ReactOverlay';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'r e a p e r',
  type: Phaser.HEADLESS,
  width: 1,
  height: 1,
  scene: Scenes,
  parent: 'game',
  backgroundColor: '#000000',
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [{ key: 'react-overlay', plugin: ReactOverlay, start: true, mapping: 'reactOverlay' }],
  },
};


export default new Phaser.Game(gameConfig);
