import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import Player from './player/Player';
import { WorldView } from './WorldView';
// import { fencer } from '../../data/enemies';

import { Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { fencer } from '../../data/enemies';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  private player: Player;
  reactOverlay: ReactOverlay


  choiceSelectSound: Phaser.Sound.BaseSound;

  allies: Ally[];
  inventory: Inventory

  constructor() {
    super(sceneConfig);
  }

  create(): void {
    this.allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');

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
    
    this.reactOverlay.create(<WorldView scene={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
  }

  pause(): void {
    this.choiceSelectSound.play();
    this.scene.pause('World');
  }

  unpause(): void {
    this.choiceSelectSound.play();
    this.scene.resume('World');
  }

  battle(): void {
    this.choiceSelectSound.play();
    this.scene.pause();
    this.scene.run('Battle', { enemies: [fencer] });
  }

  world(): void {
    this.choiceSelectSound.play();
    this.scene.manager.getScenes(false).forEach(scene => {
      this.scene.stop(scene.scene.key);  
    });
    this.scene.start('MainMenu');
  };
}