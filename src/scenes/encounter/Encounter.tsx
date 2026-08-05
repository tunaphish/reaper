
import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { EncounterView } from './EncounterView';

import { Allies, Ally } from '../../model/ally';
import { Inventory } from '../../model/inventory';
import { EncounterStore, Menu, MenuOption } from './encounterStore';
import { MapData } from '../../model/mapData';
import { DEBUG_MAP_DATA } from '../../data/maps';

import { Encounter, Event, EventType, ShatterTechniqueEvent, ShatterTechniqueTarget, SoundEvent, Topic, UpdateDamageEvent } from '../../model/encounter';

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
  key: 'Encounter',
};

type QueuedEvent = {
  event: Event,
  delayInMs: number,
  target?: Combatant,
  caster?: Combatant,
  techniques?: Technique[],
}

export class EncounterScene extends Phaser.Scene {
  reactOverlay: ReactOverlay;
  private music: Phaser.Sound.BaseSound;
  mapData: MapData;
  encounterStore: EncounterStore;
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

  init(data: { encounter?: Encounter, enemies?: Enemy[], callingSceneKey: string, }): void {
    const playerSave: PlayerSave = this.registry.get('playerSave');
    const allies: Allies = this.registry.get('allies');
    this.inventory = this.registry.get('inventory');
    this.mapData = DEBUG_MAP_DATA;
    
    this.encounterStore = new EncounterStore(playerSave, allies);

    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceDisabledSound = this.sound.add('stamina-depleted');
    this.music = this.sound.add("knight", {
      loop: true,  
      volume: 0.2  
    });


    this.callingSceneKey = data.callingSceneKey;
    if (data.enemies) {
      this.music.play();
      this.encounterStore.pushEnemies(data.enemies);
      this.encounterStore.setBattleInitiated(true);
    }
    if (data.encounter) {
      this.encounterStore.setActiveEncounter(data.encounter);
      this.advanceEvent();
    }
  }

  create(): void {
    this.events.on('shutdown', () => this.music.stop());

    this.reactOverlay.create(<EncounterView encounter={this}/>, this);
  }

  update(time: number, delta: number): void {
    this.processQueuedEvents(delta);
    this.autoAdvanceActiveEncounter(delta);

    if (!this.encounterStore.battleInitiated) return;
    this.checkEndBattleConditions(); 
    this.tickStats(delta);
    this.resetDeadAllyCasterMenu();
    this.executeCastedOptions();
    this.executeEnemyStrategies();
  }

  autoAdvanceActiveEncounter(delta: number): void {
    if (!this.encounterStore.activeEncounter) return;
    if (this.encounterStore.activeEncounter.eventIdx >= this.encounterStore.activeEncounter.encounter.events.length) return;
    const lastEvent = this.encounterStore.activeEncounter.encounter.events[this.encounterStore.activeEncounter.eventIdx];
    if (!lastEvent.autoAdvanceInMs) return;
    this.encounterStore.activeEncounter.timeSinceLastEventInMs = Math.min(this.encounterStore.activeEncounter.timeSinceLastEventInMs+delta, 1000000);
    if (this.encounterStore.activeEncounter.timeSinceLastEventInMs < lastEvent.autoAdvanceInMs) return;
    this.encounterStore.activeEncounter.timeSinceLastEventInMs = 0;
    this.advanceEvent();
  };

  canAdvance(): boolean {
    if (!this.encounterStore.activeEncounter) return false;
    if (this.encounterStore.activeEncounter.eventIdx >= this.encounterStore.activeEncounter.encounter.events.length) return true;
    const lastEvent = this.encounterStore.activeEncounter.encounter.events[this.encounterStore.activeEncounter.eventIdx];
    if (!lastEvent.autoAdvanceInMs) return true;
    if (this.encounterStore.activeEncounter.timeSinceLastEventInMs < lastEvent.autoAdvanceInMs) return false;
    return true;
  }

  advanceEvent(): void {
    if (!this.encounterStore.activeEncounter) return;
    this.playChoiceSelectSound();
    this.encounterStore.activeEncounter.eventIdx++;
    if (this.encounterStore.activeEncounter.eventIdx >= this.encounterStore.activeEncounter.encounter.events.length) {
      this.endScene();
      return;
    }
        
    this.executeEvent(this.encounterStore.activeEncounter.encounter.events[this.encounterStore.activeEncounter.eventIdx]);
  }


  playChoiceSelectSound(): void {
    this.choiceSelectSound.play();
  }

  playChoiceDisabledSound(): void {
    this.choiceDisabledSound.play();
  }

  // #region handle events
  addQueuedEvents(events: Event[]): void {
    const newEvents: QueuedEvent[] = events.map(event => ({event, delayInMs: event.autoAdvanceInMs || 0}));
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

  checkEndBattleConditions(): void {
    this.encounterStore.enemies = this.encounterStore.enemies.filter(enemy => getStatus(enemy) !== Status.DEAD);

    if (this.encounterStore.allies.every((member) => getStatus(member) === Status.DEAD)) {
      this.scene.start('GameOver');
    }

    //win
    if (this.encounterStore.enemies.every((enemy) => getStatus(enemy) === Status.DEAD)) {
      this.encounterStore.battleInitiated = false;
      for (const ally of this.encounterStore.allies) {
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
      case EventType.IMAGE:
      case EventType.DECISION:
      case EventType.INQUIRY:
      case EventType.TEXT: {
        this.encounterStore.pushWindow(event);
        return;
      }

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
          target.techniques.splice(getRandomInt(target.techniques.length),1);
          return;
        }
      }

      case EventType.SHATTER: {
        const totalAp = [...caster.techniques].reduce((total, curr) => curr.technique.actionPointsCost+total, 0);
        caster.actionPoints += totalAp;
        caster.techniques = [];
        return;
      }

      default: {
        return;
      }
    }
  }

  // #region encounter input
  onChoiceSelect = (encounter: Encounter): void => {
    this.encounterStore.setActiveEncounter(encounter);
    this.advanceEvent();
  }

  onTopicSelect = (topic: Topic): void => {
    this.playChoiceSelectSound();
    this.addQueuedEvents(topic.events);
  }

  //#endregion


  //#region battle input
  setAlly = (ally: Ally): void => {
    this.playChoiceSelectSound();

    if (this.encounterStore.executable) {
      this.selectTarget(ally);
      return;
    }

    // Could probably just flip this
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED];
    if (CANNOT_OPEN_STATUS.includes(getStatus(ally)) || ally.castingExecutable) {
      this.sound.play('stamina-depleted');
      return;
    }

    this.encounterStore.closeMenus();
    this.sound.play('choice-select');
    this.encounterStore.setActiveAlly(ally);
    this.encounterStore.pushMenu(this.getCombatMenu(ally.folder, ally.name));

    this.encounterStore.setActiveAlly(ally);
  }
  
  selectTarget = (combatant: Combatant): void => {
    if (!this.encounterStore.executable) return;
    if (this.encounterStore.targets.some(target => combatant.name === target.name) ) {
      this.playChoiceDisabledSound();
      return;
    }

    switch (this.encounterStore.executable.targetType) {
      case TargetType.SELF:
        if (combatant.name !== this.encounterStore.activeAlly.name) {
          this.playChoiceDisabledSound();
        }
        break;
      case TargetType.SINGLE_TARGET:
        this.encounterStore.setTargets([combatant]);
        this.playChoiceSelectSound();
        break;
      case TargetType.AOE: 
        if (this.encounterStore.enemies.some(enemy => enemy.name === combatant.name)) {
          this.encounterStore.setTargets(this.encounterStore.enemies);
        } else {
          this.encounterStore.setTargets(this.encounterStore.allies);
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
        const activeTechnique = getActiveTechnique(this.encounterStore.activeAlly, executable);
        if (activeTechnique !== undefined && activeTechnique.violated) {
          this.sound.play('restriction-violated');
          return;
        }
        this.encounterStore.setExecutable(executable);
        switch (executable.targetType) {
          case TargetType.SELF:
            this.encounterStore.setTargets([this.encounterStore.activeAlly]);
            break;
          case TargetType.SINGLE_TARGET:
            this.encounterStore.setTargets([this.encounterStore.enemies[0]]);
            break;
          case TargetType.AOE:
            this.encounterStore.setTargets(this.encounterStore.enemies);
            break;
        }
        this.encounterStore.pushMenu(this.getConfirmMenu());
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        const folderMenu = this.getCombatMenu(folder, folder.name);
        this.encounterStore.pushMenu(folderMenu);
        break;
    }
  }

  getConfirmMenu(): Menu {
    return {
      menuOptions: [{
        display: () => (<div>Confirm</div>),
        execute: () => {
          this.executeOption(this.encounterStore.activeAlly, this.encounterStore.targets, this.encounterStore.executable);
          this.encounterStore.resetSelections();  
        }
      }],
      onClose: () => {
        this.encounterStore.setTargets([]);
        this.encounterStore.setExecutable(null);
      }
    }
  }

  popMenu = (): void => {
    this.playChoiceDisabledSound();
    this.encounterStore.popMenu();
  }

  //#endregion
  

  //#region battle
  tickStats(delta: number): void {
    this.encounterStore.getCombatants().forEach((combatant) => {
      if (getStatus(combatant) === Status.DEAD) return;
      if (combatant.bleed > 0) {
        let damageTickRate = (delta / 1000) * 5;
        if (techniqueIsActive(combatant, Techniques.coagulate)) damageTickRate *= .33;
        combatant.bleed -= damageTickRate;

        // TOD: extract 
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
      const regenPerTick = combatant.actionPointsRegenRatePerSecond * 
        (combatant.techniques.some(activeTechnique => activeTechnique.technique.name === Techniques.haste.name) ? 2 : 1) *
        (delta / 1000) ;

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
    const actionableEnemies = this.encounterStore.enemies
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
    if (!this.encounterStore.activeAlly || getStatus(this.encounterStore?.activeAlly) !== Status.DEAD) return ;

    this.encounterStore.setActiveAlly(null);
    this.encounterStore.resetSelections();
    this.encounterStore.closeMenus();
  }


  getCombatMenu(folder: Folder, title: string): Menu {
    const menuOptions: MenuOption[] = folder.options.map((option) => {
      return {
        display: () => actionMenuItem(option, this.encounterStore.activeAlly),
        execute: () => {
          this.selectOption(option as CombatOption);
        }
      }
    });
    return { menuOptions, title };
  }

  executeCastedOptions(): void {
    this.encounterStore.getCombatants().forEach(combatant => { 
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
            combatant.techniques.push({technique, target, violated: false});
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
                  newEvent.autoAdvanceInMs = (event.autoAdvanceInMs || 0) + 600;
                  return newEvent;
                }) 
              events.push(...shadowEvents);
            }
            const newEvents: QueuedEvent[] = events.map(event => ({
              event, 
              delayInMs: event.autoAdvanceInMs || 300 + (idx*300),
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

      const idx = caster.techniques.findIndex(activeTechnique => activeTechnique.technique.name === technique.name);

      if (idx !== -1) {
        this.sound.play(technique.soundKeyName);
        updateActionPoints(caster, technique.actionPointsCost);
        caster.techniques.splice(idx, 1);
        return;
      } 
    }

    // Handle Action
    if (option.type !== OptionType.ACTION && option.type !== OptionType.TECHNIQUE) return;
    useApResources(caster, option.actionPointsCost);

    const appliedTechniques: Technique[] = [];
    let castedTimeInMs = 0;

    if (option.type === OptionType.ACTION && Actions.actionIsAnAttack(option as Action)) {
      
      const attackTechniquesTargettingCaster: Technique[] = this.encounterStore.getCombatants()
        .reduce((prev, curr) => [...prev, ...curr.techniques], [])
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
