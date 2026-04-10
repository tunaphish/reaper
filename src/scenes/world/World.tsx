
import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import Player from './objects/Player';
import { WorldView } from './WorldView';

import { Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { MapData } from '../../model/mapData';
import { DEBUG_MAP_DATA } from '../../data/maps';

import { Event } from '../../model/encounter';

import { Enemy } from '../../model/enemy';
import { Combatant } from '../../model/combatant';
import { Folder } from '../../model/folder';
import { Action } from "../../model/action";
import { Item } from "../../model/item";
import { Technique } from "../../model/technique";

import VirtualJoystick from './objects/VirtualJoystick';
import FieldEnemy from './objects/FieldEnemy';
import { TOP_LEVEL_SPREADS } from '../../data/encounters/example';
import { enemies } from '../../data/enemies';

export type CombatOption = Folder | Enemy | Ally | Action | Item | Technique;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

type QueuedEvent = {
  event: Event,
  delayInMs: number,
  target?: Combatant,
  caster?: Combatant,
  techniques?: Technique[],
}

export class World extends Phaser.Scene {
  private player: Player;
  private joystick: VirtualJoystick;
  private fieldEnemies: FieldEnemy[] = [];

  reactOverlay: ReactOverlay;
  private fieldMusic: Phaser.Sound.BaseSound;
  mapData: MapData;
  triggerGroup!: Phaser.Physics.Arcade.StaticGroup


  choiceSelectSound: Phaser.Sound.BaseSound;
  choiceDisabledSound: Phaser.Sound.BaseSound;

  inventory: Inventory;

  queuedEvents: QueuedEvent[] = [];

  constructor() {
    super(sceneConfig);
  }

  // dynamically preload map data here

  init(): void {
    this.inventory = this.registry.get('inventory');
    this.mapData = DEBUG_MAP_DATA;
    
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


    // TEMP STUFF
    // Create Map Triggers
    this.triggerGroup = this.physics.add.staticGroup()
    // TODO: Update to pull trigger data from Tiled
    const spawnPoint: Phaser.Types.Tilemaps.TiledObject = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');
    // this.createEncounterTriggers(spawnPoint)
    for (let i=0; i<1; i++) {
      this.fieldEnemies.push(new FieldEnemy(this, spawnPoint.x, spawnPoint.y-48));
    }

    // Player
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.joystick = new VirtualJoystick(this);
    // this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);

    // Map Triggers
    this.physics.add.overlap(
      this.player,
      this.triggerGroup,
      this.onTriggerOverlap,
      undefined,
      this
    )

    // this.physics.add.overlap(
    //   this.player,
    //   this.fieldEnemies,
    //   this.onFieldEnemyOverlap,
    //   undefined,
    //   this
    // )

    this.cameras.main.fadeIn(1200);
    if (this.mapData.musicKey) {
      this.fieldMusic = this.sound.add(this.mapData.musicKey, {
        loop: true,  
        volume: 0.2  
      });
      this.fieldMusic.play();
    }
    
    this.reactOverlay.create(<WorldView world={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.player.setInput(this.joystick.vector.x, this.joystick.vector.y);
    this.player.update();
    // this.onTriggerExit();
  }


  playChoiceSelectSound(): void {
    this.choiceSelectSound.play();
  }

  playChoiceDisabledSound(): void {
    this.choiceDisabledSound.play();
  }

  // #region handle events
  createEncounterTriggers(spawnPoint: Phaser.Types.Tilemaps.TiledObject): void {
    const triggers = [
      {
        triggerId: 'example_trigger_id',
        encounter: TOP_LEVEL_SPREADS[0],
        x: spawnPoint.x,
        y: spawnPoint.y - 48,
        width: 48,
        height: 48
      }
    ]

    for (const data of triggers) {
      const zone = this.add.zone(
        data.x,
        data.y,
        data.width,
        data.height
      );

      this.physics.add.existing(zone, true);

      zone.setData("encounter", data.encounter);
      zone.setData("triggerId", data.triggerId);
      zone.setData("overlapping", false);

      this.triggerGroup.add(zone);
    }
  }

  onTriggerOverlap(
    player: Phaser.GameObjects.GameObject,
    zone: Phaser.GameObjects.GameObject
  ): void {
    const overlapping = zone.getData("overlapping");
    if (overlapping) return;
    zone.setData("overlapping", true);
  } 

  // onFieldEnemyOverlap(player: Player, enemy: FieldEnemy): void {
  //   if (enemy.inBattle) return;
  //   enemy.inBattle = true;
  //   this.worldStore.enemies.push(enemies[0]);

  //   if (this.worldStore.battleInitiated) return;
  //   this.fadeMusic(this.fieldMusic);
  //   this.worldStore.battleInitiated = true;
  //   this.sound.play('battle-start');
       

  // }

  // onTriggerExit(): void {
  //   this.triggerGroup.children.iterate(zone => {
  //     const overlapping = zone.getData("overlapping");
  //     if (overlapping && !this.physics.overlap(zone, this.player)) {
  //       zone.setData("overlapping", false);

  //       // TODO handle actual exit conditions
  //       this.queuedEvents = [];
  //       this.worldStore.closeWindows();
  //       this.worldStore.setContextAction(null);
  //     }
  //   });
  // }
  
  // #endregion
  
  fadeMusic(music: Phaser.Sound.BaseSound): void {
    if (!music.isPlaying) return;
    
    this.tweens.add({
      targets: music,
      volume: 0,            
      duration: 1000,       
      onComplete: () => {
        music.pause();   
      }
    });
  }

  openSystemMenu(): void {
    this.choiceSelectSound.play();
    this.scene.pause('World');
    this.scene.run('SystemMenu', { locationName: this.mapData.locationName, musicKey: this.fieldMusic.key })
  }

  openTalkEncounter(): void {
    this.choiceSelectSound.play();
    this.scene.pause('World')
    this.scene.launch('Encounter', { encounter: TOP_LEVEL_SPREADS[0], callingSceneKey: sceneConfig.key });
  }

  openBattleEncounter(): void {
    this.choiceSelectSound.play();
    this.scene.pause('World')
    this.scene.launch('Encounter', { enemies: [enemies[0]], callingSceneKey: sceneConfig.key });
  }
}

