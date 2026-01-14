import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import Player from './player/Player';
import { WorldView } from './WorldView';
// import { fencer } from '../../data/enemies';

import { Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { fencer } from '../../data/enemies';
import { MenuState, WorldStore } from './worldStore';
import { MapData } from '../../model/mapData';
import { DEBUG_MAP_DATA } from '../../data/maps';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  private player: Player;
  reactOverlay: ReactOverlay;
  private music: Phaser.Sound.BaseSound;
  mapData: MapData;

  worldStore: WorldStore;

  choiceSelectSound: Phaser.Sound.BaseSound;
  choiceDisabledSound: Phaser.Sound.BaseSound;

  allies: Ally[];
  inventory: Inventory;

  constructor() {
    super(sceneConfig);
  }

  // dynamically preload map data here

  init(): void {
    const playerSave: PlayerSave = this.registry.get('playerSave');
    this.allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');
    this.mapData = DEBUG_MAP_DATA;
    
    this.worldStore = new WorldStore(playerSave.spirits);

    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceDisabledSound = this.sound.add('stamina-depleted');
  }

  create(): void {
    // Map
    const map = this.make.tilemap({ key: this.mapData.tilemapKey });
    const tileset = map.addTilesetImage(this.mapData.tilesetTiledKey, this.mapData.tilesetPhaserKey);

    map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0).setCollisionByProperty({ collides: true });
    map.createLayer('Above Player', tileset, 0, 0).setDepth(10);

    const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

    // Player
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);

    this.cameras.main.fadeIn(1200);
    if (this.mapData.musicKey) {
      this.music = this.sound.add(this.mapData.musicKey, {
        loop: true,  
        volume: 0.2  
      });
      // this.music.play();
    }
    
    this.reactOverlay.create(<WorldView world={this}/>, this);
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

  setMenu(menuState: MenuState): void {
    if (menuState === this.worldStore.menuState) {
      this.choiceDisabledSound.play();
      return;
    }
    this.choiceSelectSound.play();
    this.worldStore.setMenuState(menuState);
  }
}