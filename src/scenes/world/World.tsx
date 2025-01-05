import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { WorldView } from './WorldView';
import { thief } from '../../data/enemies';

import { Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { WorldStore } from './WorldStore';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  worldStore: WorldStore;
  reactOverlay: ReactOverlay;

  choiceSelectSound: Phaser.Sound.BaseSound;

  allies: Ally[];
  inventory: Inventory

  constructor() {
    super(sceneConfig);
  }

  preload(): void {
    this.load.json('shizuka-sprite-data', '/reaper/assets/sprites/shizuka-full.json');
  }

  init(): void {
    this.worldStore = new WorldStore();
  }

  create(): void {
    this.allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');
    this.choiceSelectSound = this.sound.add('choice-select');
    this.reactOverlay.create(<WorldView scene={this}/>, this);
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
    this.scene.run('Battle', { enemies: [thief] });
  }

  world(): void {
    this.choiceSelectSound.play();
    this.scene.manager.getScenes(false).forEach(scene => {
      this.scene.stop(scene.scene.key);  
    });
    this.scene.start('MainMenu');
  };
}
