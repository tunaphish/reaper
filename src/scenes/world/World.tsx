import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import Player from './player/Player';
import { WorldView } from './WorldView';

import { Allies, Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { Menu, MenuOption, WorldStore } from './worldStore';
import { MapData } from '../../model/mapData';
import { DEBUG_MAP_DATA } from '../../data/maps';

import * as EXAMPLE_SPREADS from '../../data/encounters/example';
import { Encounter, Event, EventType, SoundEvent } from '../../model/encounter';


import { enemies } from '../../data/enemies';

import { Enemy } from '../../model/enemy';
import { Combatant, Status } from '../../model/combatant';
import { updateActionPoints } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action } from "../../model/action";
import { Item } from "../../model/item";
import { Technique } from "../../model/technique";
import { OptionType } from '../../model/option';
import { TargetType } from '../../model/targetType';

import * as Techniques from '../../data/techniques';

export type CombatOption = Folder | Enemy | Ally | Action | Item | Technique;


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

type QueuedEvent = {
  event: Event,
  delayInMs: number
}

export class World extends Phaser.Scene {
  private player: Player;
  reactOverlay: ReactOverlay;
  private music: Phaser.Sound.BaseSound;
  mapData: MapData;
  triggerGroup!: Phaser.Physics.Arcade.StaticGroup

  worldStore: WorldStore;

  choiceSelectSound: Phaser.Sound.BaseSound;
  choiceDisabledSound: Phaser.Sound.BaseSound;

  inventory: Inventory;

  queuedEvents: QueuedEvent[] = [];

  // combat
  combatInitiated = true;

  constructor() {
    super(sceneConfig);
  }

  // dynamically preload map data here

  init(): void {
    const playerSave: PlayerSave = this.registry.get('playerSave');
    const allies: Allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');
    this.mapData = DEBUG_MAP_DATA;
    
    this.worldStore = new WorldStore(playerSave, allies);
    this.worldStore.pushEnemy(enemies[1]) //knight

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

    // Create Map Triggers
    this.triggerGroup = this.physics.add.staticGroup()
    // TODO: Update to pull trigger data from Tiled
    // this.createEncounterTriggers(spawnPoint)


    // Player
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);

    // Map Triggers
    this.physics.add.overlap(
      this.player,
      this.triggerGroup,
      this.onTriggerOverlap,
      undefined,
      this
    )


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
    this.onTriggerExit();
    this.processQueuedEvents(delta);

    // combat
    this.worldStore.tickStats(delta);
    this.worldStore.updateCombatantsState();
    this.checkBattleEndConditions();
    this.resetDeadAllyCasterMenu();
    this.executeSelectedOption();    

  }

  onTriggerExit(): void {
    this.triggerGroup.children.iterate(zone => {
      const overlapping = zone.getData("overlapping");
      if (overlapping && !this.physics.overlap(zone, this.player)) {
        zone.setData("overlapping", false);

        // TODO handle actual exit conditions
        this.queuedEvents = [];
        this.worldStore.closeWindows();
        this.worldStore.setContextAction(null);
      }
    });
  }

  addQueuedEvents(events: Event[]): void {
    const newEvents: QueuedEvent[] = events.map(event => ({event, delayInMs: event.delayInMs || 300}));
    this.queuedEvents.push(...newEvents);
  }

  playChoiceSelectSound(): void {
    this.choiceSelectSound.play();
  }

  playChoiceDisabledSound(): void {
    this.choiceDisabledSound.play();
  }

  createEncounterTriggers(spawnPoint: Phaser.Types.Tilemaps.TiledObject): void {
    const triggers = [
      {
        triggerId: 'example_trigger_id',
        encounter: EXAMPLE_SPREADS.EXAMPLE_SPREAD,
        x: spawnPoint.x,
        y: spawnPoint.y,
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

    const encounter: Encounter  = zone.getData("encounter");
    this.addQueuedEvents(encounter.events);
  } 

  processQueuedEvents(delta: number): void {
    const toDelay: QueuedEvent[] = [];

    for (const queuedEvent of this.queuedEvents) {
      if (queuedEvent.delayInMs < 0) {
        this.executeEvent(queuedEvent.event);
        continue;
      }
      queuedEvent.delayInMs -= delta;
      toDelay.push(queuedEvent);
    }
    this.queuedEvents = toDelay;
  }

  executeEvent(event: Event): void {
    switch (event.type) {
      case EventType.IMAGE:
      case EventType.TEXT: {
        this.worldStore.pushWindow(event);
        return;
      }

      case EventType.OBSERVE:
      case EventType.CHOICE: {
        this.worldStore.setContextAction(event);
        return;
      }

      case EventType.SOUND: {
        const soundEvent = event as SoundEvent;

        if (soundEvent.loop) {
          if (this.music.key === soundEvent.key) return;

          if (this.music.isPlaying) {
            this.music.stop();
          }

          this.music = this.sound.add(soundEvent.key, {
            loop: true,
            volume: 0.5,
          });

          this.music.play();
          return;
        }

        this.sound.add(soundEvent.key, {
          loop: false,
          volume: 0.5,
        }).play();
        return;
      }
    }
  }

  //#region input based actions
  setAlly = (ally: Ally): void => {
    this.worldStore.closeMenus();
    this.playChoiceSelectSound();
    if (this.combatInitiated) {
        const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED]
        if (CANNOT_OPEN_STATUS.includes(ally.status)) {
          this.sound.play('stamina-depleted');
          return;
        }

        this.sound.play('choice-select');
        this.worldStore.setActiveAlly(ally);
        this.events.emit('caster-set', ally);
        this.worldStore.pushMenu(this.getCombatMenu(ally.folder));
    } else {
      const systemMenu = this.getSystemMenu();
      this.worldStore.pushMenu(systemMenu);
    }

    this.worldStore.setActiveAlly(ally);
  }

  popMenu = (): void => {
    this.playChoiceDisabledSound();
    this.worldStore.popMenu();
  }

  onNextEncounter = (encounter: Encounter): void => {
    this.playChoiceSelectSound();
    this.worldStore.setContextAction(null);
    this.addQueuedEvents(encounter.events);
  }

  onMultiSelect = (encounter: Encounter): void => {
    this.playChoiceSelectSound();
    this.worldStore.closeWindows();
    this.addQueuedEvents(encounter.events);
  }

  getSystemMenu(): Menu {
    const enemyJournalMenuOptions: MenuOption[] = getDisplayedEnemies(enemies, this.worldStore.playerSave.seenEnemies)
      .map(enemy => {
        return {
          display: enemy.name,
          execute: () => {
            this.worldStore.setEnemyJournalContent(enemy);
          }
        }
      });
    const enemyJournalMenu: Menu = {
      onClose: () => this.worldStore.setEnemyJournalContent(null),
      menuOptions: enemyJournalMenuOptions,
      isCursor: true,
    }
    

    const journalMenu: Menu = {
      menuOptions: [
        {
          display: "Enemies",
          execute: () => {  
            this.worldStore.pushMenu(enemyJournalMenu);
          }
        },
        {
          display: "Techniques",
          execute: () => {  
            //
          }
        },
      ]
    };

    const systemMenu: Menu = {
      onClose: () => this.worldStore.setSystemsMenuOpen(false),
      menuOptions: [
        {
          display: "Journal",
          execute: () => {  
            this.worldStore.pushMenu(journalMenu);
          }
        },
        {
          display: "Exit",
          execute: () => {  
            this.worldStore.closeMenus();
          }
        },
      ],
    }  

    return systemMenu;
  }
  

  //#endregion
  

  //#region combat
  resetDeadAllyCasterMenu(): void {
    if (this.worldStore.activeAlly && this.worldStore?.activeAlly.status === Status.DEAD) {
      this.worldStore.setActiveAlly(null);
      // this.worldStore.emptyMenu();
    }
  }

  checkBattleEndConditions(): void {
    if (this.worldStore.allies.every((member) => member.status === Status.DEAD)) {
      console.log('win')
    }
    if (this.worldStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      // console.log('lose')
    }
  }

  getCombatMenu(folder: Folder): Menu {
    const menuOptions: MenuOption[] = folder.options.map(option => {
      return {
        display: option.name,
        execute: () => {
          this.selectOption(option as CombatOption);
        }
      }
    });

    return { menuOptions };
  }
  
  getTargetsMenu(targets: Combatant[]): Menu {
    const menuOptions: MenuOption[] = targets.map(target => {
      return {
        display: target.name,
        execute: () => {
          this.worldStore.setTarget(target);
        }
      }
    });
    const onClose = () => {
      this.worldStore.setTarget(null);
    }

    return { menuOptions, onClose };
  }

  selectOption(option: CombatOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      case OptionType.ACTION:
        const action = option as Action;
        this.worldStore.setExecutable(action);
        switch (action.targetType) {
          case TargetType.SELF:
            this.worldStore.pushMenu(this.getTargetsMenu([this.worldStore.activeAlly]));
            break;
          case TargetType.ENEMIES:
            this.worldStore.pushMenu(this.getTargetsMenu(this.worldStore.enemies));
            break;
          case TargetType.ALLIES:
            this.worldStore.pushMenu(this.getTargetsMenu(this.worldStore.allies));
            break;
          case TargetType.SINGLE_TARGET:
            this.worldStore.pushMenu(this.getTargetsMenu(this.worldStore.getCombatants()));
            break;
        }
        break;
      case OptionType.TECHNIQUE:
        this.worldStore.pushMenu(this.getTargetsMenu([this.worldStore.activeAlly]));
        break;
      case OptionType.ENEMY:
      case OptionType.ALLY:
        const combatant = option;
        this.worldStore.setTarget(combatant);
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        const folderMenu = this.getCombatMenu(folder);
        this.worldStore.pushMenu(folderMenu);
        break;
    }
  }

  executeSelectedOption(): void {
    if (
      !this.worldStore.activeAlly || 
      !this.worldStore.executable || 
      !this.worldStore.target
    ) return; 
    

    // if (combatant.queuedOption.type === OptionType.ITEM) {
    //   combatant.queuedOption.charges -= 1;
    //   combatant.queuedOption.execute(combatant.queuedTarget, combatant);
    //   this.sound.play(combatant.queuedOption.soundKeyName);
    // } else

    if (this.worldStore.executable.type === OptionType.TECHNIQUE) {
      const technique = (this.worldStore.executable as Technique);

      if (this.worldStore.activeAlly.activeTechniques.has(this.worldStore.executable)) {
        updateActionPoints(this.worldStore.activeAlly, technique.actionPointsCost);
        this.worldStore.activeAlly.activeTechniques.delete(this.worldStore.executable);
      } else {
        updateActionPoints(this.worldStore.activeAlly, -technique.actionPointsCost);
        this.worldStore.activeAlly.activeTechniques.add(this.worldStore.executable);
      }
    
      
      this.sound.play(technique.soundKeyName);
      this.worldStore.resetSelections();
      return;
    }

    const action = (this.worldStore.executable as Action);
    updateActionPoints(this.worldStore.activeAlly, -action.actionPointsCost);

    const potency = action.potency * (this.worldStore.activeAlly.activeTechniques.has(Techniques.buff) ? 2 : 1);
    action.resolve(this.worldStore.target, this.worldStore.activeAlly, potency);
    
    this.sound.play(action.soundKeyName);
    
    this.worldStore.resetSelections();
    
  }

  //#endregion
}

const getDisplayedEnemies = (enemies: Enemy[], seenEnemies: SeenEnemy[]): Enemy[] => {
  const seenMap = new Map(seenEnemies.map(se => [se.enemyName, se.seenAt]));

  return enemies
    .filter(enemy => seenMap.has(enemy.name))
    .sort((a, b) => seenMap.get(b.name) - seenMap.get(a.name));
}

