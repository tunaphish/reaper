
import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { BattleView } from './BattleView';

import { Allies, Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { BattleStore } from './battleStore';
import { MapData } from '../../model/mapData';
import { DEBUG_MAP_DATA } from '../../data/maps';

import { Event, EventType, ShatterTechniqueEvent, ShatterTechniqueTarget, SoundEvent, } from '../../model/encounter';

import { Enemy } from '../../model/enemy';
import { Combatant, getActiveTechnique, getStatus, Status, techniqueIsViolated, updateDamage, useApResources } from '../../model/combatant';
import { updateActionPoints } from '../../model/combatant';
import { Action } from "../../model/action";
import { Item } from "../../model/item";
import { Technique } from "../../model/technique";
import { OptionType } from '../../model/option';
import { TargetType } from '../../model/targetType';

import { getRandomInt } from '../../model/math';
import { Executable } from '../../model/Executable';

import { enemies } from '../../data/enemies';
import { toJS } from 'mobx';

export type BattleOption = Action | Item | Technique;

const TEST_ENCOUNTER_ENEMIES = [enemies[0]];

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

type QueuedEvent = {
  event: Event,
  delayInMs: number,
  target?: Combatant,
  caster?: Combatant,
  techniques?: Technique[],
}

export class Battle extends Phaser.Scene {
  reactOverlay: ReactOverlay;
  private music: Phaser.Sound.BaseSound;
  mapData: MapData;
  battleStore: BattleStore;
  choiceSelectSound: Phaser.Sound.BaseSound;
  choiceDisabledSound: Phaser.Sound.BaseSound;

  inventory: Inventory;

  queuedEvents: QueuedEvent[] = [];
  callingSceneKey: string;
  
  // Battle 
  splinterNotCasted = true;
  firstActionNotTaken = true;


  constructor() {
    super(sceneConfig);
  }

  init(data: { battle?: Battle, enemies?: Enemy[], callingSceneKey: string, }): void {
    const playerSave: PlayerSave = this.registry.get('playerSave');
    const allies: Allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');
    this.mapData = DEBUG_MAP_DATA;
    
    this.battleStore = new BattleStore(playerSave, allies);

    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceDisabledSound = this.sound.add('stamina-depleted');
    this.music = this.sound.add("knight", {
      loop: true,  
      volume: 0.2  
    });


    this.callingSceneKey = data.callingSceneKey;
    if (!data.enemies && !data.battle) {
      // this.music.play();
      this.battleStore.pushEnemies(TEST_ENCOUNTER_ENEMIES);
    }
    if (data.enemies) {
      // this.music.play();
      this.battleStore.pushEnemies(data.enemies);
    }
  }

  create(): void {
    this.events.on('shutdown', () => this.music.stop());

    this.reactOverlay.create(<BattleView battle={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.processQueuedEvents(delta);

    this.checkEndBattleConditions(); 
    this.tickStats(delta);
    this.resetDeadAllyCasterMenu();
    
    this.executeCastedOptions();
    // this.executeEnemyStrategies();
  }

  playChoiceSelectSound(): void {
    this.choiceSelectSound.play();
  }

  playChoiceDisabledSound(): void {
    this.choiceDisabledSound.play();
  }

  // #region handle events
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

  checkEndBattleConditions(): void {
    this.battleStore.enemies = this.battleStore.enemies.filter(enemy => getStatus(enemy) !== Status.DEAD);

    if (this.battleStore.allies.every((member) => getStatus(member) === Status.DEAD)) {
      this.scene.start('GameOver');
    }

    //win
    if (this.battleStore.enemies.every((enemy) => getStatus(enemy) === Status.DEAD)) {
      for (const ally of this.battleStore.allies) {
        ally.bleed = 0;
        ally.techniques = [];
        ally.actionPoints = 0;
      }
      this.endScene();
    }
  }

  endScene(): void {
    this.fadeMusic(this.music);
    this.scene.resume(this.callingSceneKey);
    this.scene.stop();
  }
  
  // #endregion
  executeEvent(event: Event, target?: Combatant, caster?: Combatant, techniques?: Technique[]): void {
    switch (event.type) {
      case EventType.SOUND: {
        const soundEvent = event as SoundEvent;

        if (soundEvent.loop) {
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

        value = Math.floor(value);
        this.events.emit('updated-damage', { name: target.name, value });
        updateDamage(target, value);

        if (target?.castingExecutable?.executable?.interruptible) {
          target.castingExecutable = null;
          this.sound.play('bomb');
        }

        return;
      }

      case EventType.UPDATE_AP: {
        updateActionPoints(target, 1);
        return;
      }

      case EventType.SHATTER_TECHNIQUE: {
        const shatterTechniqueEvent = event as ShatterTechniqueEvent;
        if (shatterTechniqueEvent.target === ShatterTechniqueTarget.RANDOM) {
          target.techniques.splice(getRandomInt(target.techniques.length),1);
          return;
        }
      }



      default: {
        return;
      }
    }
  }

  tickStats(delta: number): void {
    this.battleStore.getCombatants().forEach((combatant) => {
      if (getStatus(combatant) === Status.DEAD) return;
      if (combatant.bleed > 0) {
        const damageTickRate = (delta / 1000) * 5;
        combatant.bleed -= damageTickRate;

        // TODO: extract 
        const newHealth = Math.max(0, combatant.health - damageTickRate);
        if (newHealth === 0) {
          combatant.actionPoints = 0;
          combatant.techniques = [];
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
      const regenPerTick = combatant.actionPointsRegenRatePerSecond * (delta / 1000) ;

      const newActionPoints = combatant.actionPoints + regenPerTick;

      // TOD: extract 
      if (newActionPoints > combatant.maxActionPoints) {
        this.sound.play('action-ready', { volume: .5 });
        combatant.actionPoints = combatant.maxActionPoints;
        return;
      }
      combatant.actionPoints = newActionPoints;
    });
  }

  executeEnemyStrategies(): void {    
    const actionableEnemies = this.battleStore.enemies
      .filter(enemy => getStatus(enemy) === Status.NEUTRAL)
      .filter(enemy => !enemy.castingExecutable)

    for (const enemy of actionableEnemies) {
      const strategy = enemy.strategies[enemy.selectedStrategyIndex];
      const option = (strategy.option as BattleOption);

      if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE ) continue;
      const action = option as Action;
      if (enemy.actionPoints < action.actionPointsCost) continue;

      const targets = strategy.getTargets(this, action, enemy);
      this.castOption(enemy, targets, option);      
    }
  }

castOption(caster: Combatant, targets: Combatant[], option: BattleOption): void {
    // Handle Action
    if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE) return;

    useApResources(caster, option.actionPointsCost);

    // Handle Magic 
    if (option.castTimeInMs) {
      caster.castingExecutable = {
        executable: option,
        targets,
        castedTimeInMs: 0,
        appliedTechniques: [],
        violated: false,
      }
      return;
    }
    this.executeOption(option, targets, caster);
  }

  resetDeadAllyCasterMenu(): void {
    if (!this.battleStore.activeAlly || getStatus(this.battleStore?.activeAlly) !== Status.DEAD) return ;

    this.battleStore.setActiveAlly(null);
    this.battleStore.resetSelections();
  }

  executeCastedOptions(): void {
    this.battleStore.getCombatants().forEach(combatant => { 
      if (!combatant.castingExecutable) return;

      const { executable: option, targets, castedTimeInMs } = combatant.castingExecutable;
      if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE) return;
      if (castedTimeInMs < option.castTimeInMs) return;

      this.executeOption(option, targets, combatant);
      
      combatant.castingExecutable = null;
    });
  }

  executeOption(option: Executable, targets: Combatant[], caster: Combatant): void {
    if (option.type !== OptionType.ACTION) return;

    for (const [idx, target] of targets.entries()) {
        const action = option as Action;
        if (action.conditionMet && !action.conditionMet(this, caster, target)) {
          this.sound.play('restriction-violated');
          caster.castingExecutable = null;
          return;
        } 

        if (this.firstActionNotTaken) this.firstActionNotTaken = false;
        if (action.name === "Splinter") this.splinterNotCasted = false;

        const events = action.events;

        const newEvents: QueuedEvent[] = events.map(event => ({
          event, 
          delayInMs: event.autoAdvanceInMs || 300 + (idx*300),
          target,
          caster: caster,
          techniques: [],
        }));

        this.queuedEvents.push(...newEvents);      
    }
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

  //#region battle input
  setAlly = (ally: Ally): void => {
    this.playChoiceSelectSound();

    if (this.battleStore.executable) {
      this.selectTarget(ally);
      return;
    }

    // Could probably just flip this
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED];
    if (CANNOT_OPEN_STATUS.includes(getStatus(ally)) || ally.castingExecutable) {
      this.sound.play('stamina-depleted');
      return;
    }

    this.sound.play('choice-select');
    this.battleStore.setActiveAlly(ally);

    this.battleStore.setActiveAlly(ally);
  }

  setTechnique = (technique: Technique): void => {
    // if (this.battleStore.activeTechnique.name === technique.name) {
    //   this.playChoiceDisabledSound();
    //   return;
    // }
    this.playChoiceSelectSound();
    this.battleStore.setActiveTechnique(technique);
  }
  
  selectTarget = (combatant: Combatant): void => {
    if (!this.battleStore.executable) return;
    if (this.battleStore.targets.some(target => combatant.name === target.name) ) {
      this.playChoiceDisabledSound();
      return;
    }
    console.log(toJS(combatant))

    switch (this.battleStore.executable.targetType) {
      case TargetType.SELF:
        if (combatant.name !== this.battleStore.activeAlly.name) {
          this.playChoiceDisabledSound();
        }
        this.battleStore.setTargets([combatant]);
        this.playChoiceSelectSound();
        break;
      case TargetType.SINGLE_TARGET:
        this.battleStore.setTargets([combatant]);
        this.playChoiceSelectSound();
        break;
      case TargetType.AOE: 
        if (this.battleStore.enemies.some(enemy => enemy.name === combatant.name)) {
          this.battleStore.setTargets(this.battleStore.enemies);
        } else {
          this.battleStore.setTargets(this.battleStore.allies);
        }
        break;
      default:
        break;
    }
    this.castOption(this.battleStore.activeAlly, this.battleStore.targets, this.battleStore.executable);
    this.battleStore.resetSelections();
  }

  selectOption(option: BattleOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      case OptionType.ACTION:
      case OptionType.TECHNIQUE:
        const executable = option as Executable;
        const activeTechnique = getActiveTechnique(this.battleStore.activeAlly, executable);
        if (activeTechnique !== undefined && activeTechnique.violated) {
          this.sound.play('restriction-violated');
          return;
        }
        this.battleStore.setExecutable(executable);
        switch (executable.targetType) {
          case TargetType.SELF:
            this.battleStore.setTargets([this.battleStore.activeAlly]);
            break;
          case TargetType.SINGLE_TARGET:
            this.battleStore.setTargets([this.battleStore.enemies[0]]);
            break;
          case TargetType.AOE:
            this.battleStore.setTargets(this.battleStore.enemies);
            break;
        }
        break;
    }
  }

  //#endregion
  
}
