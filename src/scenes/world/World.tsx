import * as React from 'react';
import UiOverlayPlugin from '../UiOverlayPlugin';
import Player from './player/Player';
import { WorldView } from './WorldView';
import { healieBoi } from '../../data/enemies';

import { Ally } from '../../model/ally';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  private player: Player;
  ui: UiOverlayPlugin;
  allies: Ally[];
  private choiceSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
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
    
    this.ui.create(<WorldView scene={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
  }

  pause(): void {
    this.choiceSelectSound.play();
    this.scene.pause();
    this.scene.run('PauseMenu');
  }

  battle(): void {
    this.choiceSelectSound.play();
    this.scene.pause();
    this.scene.run('Battle', { enemies: [healieBoi], allies: this.allies});
  }
}
