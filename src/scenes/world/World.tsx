const TESTING_COMBAT = false;

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
import { Encounter, Event, EventType, ShatterTechniqueEvent, ShatterTechniqueTarget, SoundEvent, UpdateDamageEvent } from '../../model/encounter';


import { enemies } from '../../data/enemies';

import { Enemy } from '../../model/enemy';
import { Combatant, getActiveTechnique, getStatus, removeTechnique, Status, techniqueIsActive, techniqueIsApplied, techniqueIsViolated, updateDamage, useApResources } from '../../model/combatant';
import { updateActionPoints } from '../../model/combatant';
import { Folder } from '../../model/folder';
import { Action } from "../../model/action";
import { Item } from "../../model/item";
import { Technique } from "../../model/technique";
import { OptionType } from '../../model/option';
import { TargetType } from '../../model/targetType';

import * as Techniques from '../../data/techniques';
import * as Actions from '../../data/actions';
import { toJS } from 'mobx';
import { getRandomInt } from '../../model/math';
import { actionMenuItem } from './CombatMenus';
import { Executable } from '../../model/Executable';

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
  combatInitiated = false;
  splinterNotCasted = true;
  firstActionNotTaken = true;

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
    this.createEncounterTriggers(spawnPoint)


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
      if (TESTING_COMBAT) this.music.play();
    }
    
    this.reactOverlay.create(<WorldView world={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.onTriggerExit();
    this.processQueuedEvents(delta);

    if (!this.combatInitiated) return;
    this.tickStats(delta);
    this.checkBattleEndConditions(); 
    this.resetDeadAllyCasterMenu();
    this.executeCastedOptions();
    if (TESTING_COMBAT) this.executeEnemyStrategies();
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
        encounter: EXAMPLE_SPREADS.EXAMPLE_SPREAD,
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

    const encounter: Encounter  = zone.getData("encounter");
    this.addQueuedEvents(encounter.events);
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

  processQueuedEvents(delta: number): void {
    const toDelay: QueuedEvent[] = [];

    for (const queuedEvent of this.queuedEvents) {
      if (queuedEvent.delayInMs < 0) {
        this.executeEvent(queuedEvent.event, queuedEvent.target, queuedEvent.caster, queuedEvent.techniques);
        continue;
      }
      queuedEvent.delayInMs -= delta;
      toDelay.push(queuedEvent);
    }
    this.queuedEvents = toDelay;
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
    const getDisplayedEnemies = (enemies: Enemy[], seenEnemies: SeenEnemy[]): Enemy[] => {
      const seenMap = new Map(seenEnemies.map(se => [se.enemyName, se.seenAt]));

      return enemies
        .filter(enemy => seenMap.has(enemy.name))
        .sort((a, b) => seenMap.get(b.name) - seenMap.get(a.name));
    }
    const enemyJournalMenuOptions: MenuOption[] = getDisplayedEnemies(enemies, this.worldStore.playerSave.seenEnemies)
      .map(enemy => {
        return {
          display: () => <span>{enemy.name}</span>,
          execute: () => {
            this.worldStore.setEnemyJournalContent(enemy);
          }
        }
      });
    const enemyJournalMenu: Menu = {
      onClose: () => this.worldStore.setEnemyJournalContent(null),
      menuOptions: enemyJournalMenuOptions,
      isCursor: true,
      title: "Enemies"
    }
    

    const journalMenu: Menu = {
      menuOptions: [
        {
          display: () => <span>Enemies</span>,
          execute: () => {  
            this.worldStore.pushMenu(enemyJournalMenu);
          }
        },
        {
          display: () => <span>Techniques</span>,
          execute: () => {  
            //
          }
        },
      ],
      title: "Journal",
    };

    const systemMenu: Menu = {
      onClose: () => this.worldStore.setSystemsMenuOpen(false),
      menuOptions: [
        {
          display: () => <span>Journal</span>,
          execute: () => {  
            this.worldStore.pushMenu(journalMenu);
          }
        },
        {
          display: () => <span>Exit</span>,
          execute: () => {  
            this.worldStore.closeMenus();
          }
        },
      ],
    }  

    return systemMenu;
  }
  
  // #endregion
  executeEvent(event: Event, target?: Combatant, caster?: Combatant, techniques?: Technique[]): void {
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

      case EventType.UPDATE_DAMAGE: {        
        let value = event.value;
        if (event.value > 0) {
          const technique = (techniques || []).find(t => t.name === Techniques.buff.name);
          if (technique) value *= techniqueIsViolated(caster, technique) ? .66 : 1.33
        }

        if (event.value > 0 && (techniques || []).some(t => t.name === Techniques.charged.name)) {
          removeTechnique(caster, Techniques.charged);
          value *= 2.0;
        }

        if (event.value > 0 && (techniques || []).some(t => t.name === Techniques.reciprocity.name)) {
          value *= -1;
        }

        if (event.value > 0 && (techniques || []).some(t => t.name === Techniques.nerf.name)) {
          value *= .67;
        }
        value = Math.floor(value);
        this.events.emit('updated-damage', { name: target.name, value });
        updateDamage(target, value);

        if (target?.castingExecutable?.executable?.interruptible) {
          target.castingExecutable = null;
          this.sound.play('bomb');
        }

        // perhaps counter is only active when I'm executing 
        // if (techniqueIsActive(target, Techniques.counter)) {
        //   this.executeOption(target, [caster], Actions.attack);
        // }
        return;
      }

      case EventType.UPDATE_AP: {
        updateActionPoints(target, 1);
        return;
      }

      case EventType.SHATTER_TECHNIQUE: {
        const shatterTechniqueEvent = event as ShatterTechniqueEvent;
        if (shatterTechniqueEvent.target === ShatterTechniqueTarget.RANDOM) {
          target.activeTechniques.splice(getRandomInt(target.activeTechniques.length),1);
          return;
        }
      }

      case EventType.SHATTER: {
        const totalAp = [...caster.activeTechniques].reduce((total, curr) => curr.technique.actionPointsCost+total, 0);
        caster.actionPoints += totalAp;
        caster.activeTechniques = [];
        return;
      }

      default: {
        return;
      }
    }
  }

  //#region combat input
  setAlly = (ally: Ally): void => {
    this.playChoiceSelectSound();
    if (this.combatInitiated) {

      if (this.worldStore.executable) {
          this.selectTarget(ally);
          return;
        }

        // Could probably just flip this
        const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED];
        if (CANNOT_OPEN_STATUS.includes(getStatus(ally)) || ally.castingExecutable) {
          this.sound.play('stamina-depleted');
          return;
        }

        this.worldStore.closeMenus();
        this.sound.play('choice-select');
        this.worldStore.setActiveAlly(ally);
        this.events.emit('caster-set', ally);
        this.worldStore.pushMenu(this.getCombatMenu(ally.folder, ally.name));
    } else {
      const systemMenu = this.getSystemMenu();
      this.worldStore.pushMenu(systemMenu);
    }

    this.worldStore.setActiveAlly(ally);
  }
  
  selectTarget = (combatant: Combatant): void => {
    if (!this.worldStore.executable) return;
    if (this.worldStore.targets.some(target => combatant.name === target.name) ) {
      this.playChoiceDisabledSound();
      return;
    }

    switch (this.worldStore.executable.targetType) {
      case TargetType.SELF:
        if (combatant.name !== this.worldStore.activeAlly.name) {
          this.playChoiceDisabledSound();
        }
        break;
      case TargetType.SINGLE_TARGET:
        this.worldStore.setTargets([combatant]);
        this.playChoiceSelectSound();
        break;
      case TargetType.AOE: 
        if (this.worldStore.enemies.some(enemy => enemy.name === combatant.name)) {
          this.worldStore.setTargets(this.worldStore.enemies);
        } else {
          this.worldStore.setTargets(this.worldStore.allies);
        }
        break;
      default:
        break;
    }
  }

  selectOption(option: CombatOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      case OptionType.ACTION:
      case OptionType.TECHNIQUE:
        const executable = option as Executable;
        const activeTechnique = getActiveTechnique(this.worldStore.activeAlly, executable);
        if (activeTechnique !== undefined && activeTechnique.violated) {
          this.sound.play('restriction-violated');
          return;
        }
        this.worldStore.setExecutable(executable);
        switch (executable.targetType) {
          case TargetType.SELF:
            this.worldStore.setTargets([this.worldStore.activeAlly]);
            break;
          case TargetType.SINGLE_TARGET:
            this.worldStore.setTargets([this.worldStore.enemies[0]]);
            break;
          case TargetType.AOE:
            this.worldStore.setTargets(this.worldStore.enemies);
            break;
        }
        this.worldStore.pushMenu(this.getConfirmMenu());
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        const folderMenu = this.getCombatMenu(folder, folder.name);
        this.worldStore.pushMenu(folderMenu);
        break;
    }
  }

  getConfirmMenu(): Menu {
    return {
      menuOptions: [{
        display: () => (<div>Confirm</div>),
        execute: () => {
          this.executeOption(this.worldStore.activeAlly, this.worldStore.targets, this.worldStore.executable);
          this.worldStore.resetSelections();  
        }
      }],
      onClose: () => {
        this.worldStore.setTargets([]);
        this.worldStore.setExecutable(null);
      }
    }
  }

  popMenu = (): void => {
    this.playChoiceDisabledSound();
    this.worldStore.popMenu();
  }

  //#endregion
  

  //#region combat
  tickStats(delta: number): void {
    this.worldStore.getCombatants().forEach((combatant) => {
      if (getStatus(combatant) === Status.DEAD) return;
      if (combatant.bleed > 0) {
        let damageTickRate = (delta / 1000) * 5;
        if (techniqueIsActive(combatant, Techniques.coagulate)) damageTickRate *= .33;
        combatant.bleed -= damageTickRate;

        const newHealth = Math.max(0, combatant.health - damageTickRate);
        if (newHealth === 0) {
          combatant.actionPoints = 0;
          combatant.activeTechniques = [];
        }

        combatant.health = newHealth;
      }

      if (combatant.castingExecutable) {
        combatant.castingExecutable.castedTimeInMs += delta;
        return;
      } 

      // handles overflow
      if (combatant.actionPoints >= combatant.maxActionPoints) {
        combatant.actionPoints = Math.trunc(combatant.actionPoints);
        return;
      }
      const regenPerTick = combatant.actionPointsRegenRatePerSecond * 
        (combatant.activeTechniques.some(activeTechnique => activeTechnique.technique.name === Techniques.haste.name) ? 2 : 1) *
        (delta / 1000) ;

      const newActionPoints = combatant.actionPoints + regenPerTick;
      if (newActionPoints > combatant.maxActionPoints) {
        this.sound.play('action-ready', { volume: .5 });
        combatant.actionPoints = combatant.maxActionPoints;
        return;
      }
      combatant.actionPoints = newActionPoints;
    });
  }

  executeEnemyStrategies(): void {    
    const actionableEnemies = this.worldStore.enemies
      .filter(enemy => getStatus(enemy) === Status.NEUTRAL)
      .filter(enemy => !enemy.castingExecutable)

    for (const enemy of actionableEnemies) {
      const strategy = enemy.strategies[enemy.selectedStrategyIndex];
      const option = (strategy.option as CombatOption);

      if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE ) continue;
      const action = option as Action;
      if (enemy.actionPoints < action.actionPointsCost) continue;

      const targets = strategy.getTargets(this, action, enemy);
      this.executeOption(enemy, targets, option);      
    }
  }

  resetDeadAllyCasterMenu(): void {
    if (!this.worldStore.activeAlly || getStatus(this.worldStore?.activeAlly) !== Status.DEAD) return ;

    this.worldStore.setActiveAlly(null);
    this.worldStore.resetSelections();
    this.worldStore.closeMenus();
  }

  checkBattleEndConditions(): void {
    if (this.worldStore.allies.every((member) => getStatus(member) === Status.DEAD)) {
      console.log('lose')
    }
    if (this.worldStore.enemies.every((enemy) => getStatus(enemy) === Status.DEAD)) {
      console.log('win')
    }
  }

  getCombatMenu(folder: Folder, title: string): Menu {
    const menuOptions: MenuOption[] = folder.options.map((option) => {
      return {
        display: () => actionMenuItem(option, this.worldStore.activeAlly),
        execute: () => {
          this.selectOption(option as CombatOption);
        }
      }
    });
    return { menuOptions, title };
  }

  executeCastedOptions(): void {
    this.worldStore.getCombatants().forEach(combatant => { 
      if (!combatant.castingExecutable) return;

      const { executable: option, targets, castedTimeInMs } = combatant.castingExecutable;
      if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE) return;
      if (castedTimeInMs < option.castTimeInMs) return;

      if (combatant.castingExecutable.violated){
        combatant.castingExecutable = null;
        if ('selectedStrategyIndex' in combatant) this.selectNewStrategy(combatant as Enemy);
        return;
      }

      for (const [idx, target] of targets.entries()) {
        if (option.type === OptionType.TECHNIQUE) {
            const technique = option as Technique;
            combatant.activeTechniques.push({technique, target, violated: false});
            this.sound.play(technique.soundKeyName)
          }


          if (option.type === OptionType.ACTION) {
            const action = option as Action;
            if (action.conditionMet && !action.conditionMet(this, combatant, target)) {
              this.sound.play('restriction-violated');
              combatant.castingExecutable = null;
              if ('selectedStrategyIndex' in combatant) this.selectNewStrategy(combatant as Enemy);
              return;
            } 

            if (this.firstActionNotTaken) this.firstActionNotTaken = false;
            if (action.name === "Splinter") this.splinterNotCasted = false;

            const events = action.events;
            if (techniqueIsApplied(combatant, Techniques.infuse) && action.events.every(event => event.type !== EventType.SHATTER) ) events.push({ type: EventType.SHATTER_TECHNIQUE, target: ShatterTechniqueTarget.RANDOM })
            if (techniqueIsActive(combatant, Techniques.shadow) && action.events.some(event => event.type === EventType.UPDATE_DAMAGE)) {
              const shadowEvents: Event[] = events
                .map(event => {
                  const newEvent: UpdateDamageEvent = (structuredClone(toJS(event)) as UpdateDamageEvent);
                  if (event.type === EventType.UPDATE_DAMAGE && event.value > 0) newEvent.value = event.value * .5;
                  newEvent.delayInMs = (event.delayInMs || 0) + 600;
                  return newEvent;
                }) 
              events.push(...shadowEvents);
            }
            const newEvents: QueuedEvent[] = events.map(event => ({
              event, 
              delayInMs: event.delayInMs || 300 + (idx*300),
              target,
              caster: combatant,
              techniques: [...combatant.castingExecutable.appliedTechniques],
            }));

            this.queuedEvents.push(...newEvents);

          }
      }
 
      combatant.castingExecutable = null;
      if ('selectedStrategyIndex' in combatant) this.selectNewStrategy(combatant as Enemy);
    });
  }

  selectNewStrategy(enemy: Enemy): void {
    const viableStrategies = enemy.strategies
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.isValid(this, enemy));

    const totalWeight = viableStrategies.reduce((sum, v) => sum + v.s.weight, 0)
    let roll = Math.random() * totalWeight

    for (const strategy of viableStrategies) {
      roll -= strategy.s.weight
      if (roll <= 0) enemy.selectedStrategyIndex = strategy.i
      continue;
    }
    enemy.selectedStrategyIndex = viableStrategies[viableStrategies.length - 1].i
  }

  executeOption(caster: Combatant, targets: Combatant[], option: CombatOption): void {
    // Handle Shatter
    if (option.type === OptionType.TECHNIQUE ) {
      const technique = (option as Technique);

      const idx = caster.activeTechniques.findIndex(activeTechnique => activeTechnique.technique.name === technique.name);

      if (idx !== -1) {
        this.sound.play(technique.soundKeyName);
        updateActionPoints(caster, technique.actionPointsCost);
        caster.activeTechniques.splice(idx, 1);
        return;
      } 
    }

    // Handle Action
    if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE) return;
    useApResources(caster, option.actionPointsCost);

    const appliedTechniques: Technique[] = [];
    let castedTimeInMs = 0;

    if (option.type === OptionType.ACTION && Actions.actionIsAnAttack(option as Action)) {
      
      const attackTechniquesTargettingCaster: Technique[] = this.worldStore.getCombatants()
        .reduce((prev, curr) => [...prev, ...curr.activeTechniques], [])
        .filter(activeTechnique => activeTechnique.target.name === caster.name)
        .filter(activeTechnique => ATTACK_TECHNIQUES.has(activeTechnique.technique.name))
        .map(activeTechnique => activeTechnique.technique);

      appliedTechniques.push(...attackTechniquesTargettingCaster);

      if (techniqueIsApplied(caster, Techniques.adrenaline)) {
        castedTimeInMs = option.castTimeInMs / 2;
      }

      // need to figure out reciprocity... single target only actions? any action really... mm. it's never applied
      // if (techniqueIsActive(caster, Techniques.reciprocity) && this.worldStore.allies.some(ally => ally.name === target.name)) appliedTechniques.push(Techniques.reciprocity);      
    }    

    caster.castingExecutable = {
      executable: option,
      targets,
      castedTimeInMs,
      appliedTechniques,
      violated: false,
    }
  }

  checkActionTechniqueConditionMet(caster: Combatant, targets: Combatant[], technique: Technique): void {
    if (techniqueIsViolated(caster, technique)) {
      this.sound.play('restriction-violated');
      return;
    }
    if (caster.castingExecutable.violated) return;
    if (technique.conditionMet && !technique.conditionMet(this, caster, targets)) {
      this.sound.play('restriction-violated');
      caster.castingExecutable.violated = true;
      const activeTechnique = getActiveTechnique(caster, technique);
      if (activeTechnique) activeTechnique.violated = true;
      return;
    }
    this.sound.play(technique.soundKeyName);    
  }

  //#endregion
}

const ATTACK_TECHNIQUES = new Set([
  Techniques.adrenaline.name,
  Techniques.buff.name,
  Techniques.infuse.name,
  Techniques.shadow.name,
  Techniques.charged.name,
  Techniques.nerf.name
])