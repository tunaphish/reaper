import * as React from 'react';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';
import Player from '../../sprites/Player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  private player: Player;
  ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

    map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0).setCollisionByProperty({ collides: true });
    map.createLayer('Above Player', tileset, 0, 0).setDepth(10);

    const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);

    this.cameras.main.fadeIn(1200);

    const Ui = () => {
      const onClickPause = () => {
        this.scene.pause();
        this.scene.run('PauseMenu');
      }
      return <div onClick={onClickPause}>click me</div>;
    }
    
    this.ui.create(<Ui/>, this);

  }

  public update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
