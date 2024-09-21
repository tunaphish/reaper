import * as React from 'react';
import { makeAutoObservable } from 'mobx';
import { Behavior, Enemy } from '../../model/enemy';
import { Party, PartyMember, Option, Folder } from '../../model/party';
import { Action, ActionTags, TargetType } from '../../model/action';
import { Status } from '../../model/combatant';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';

import { DefaultParty } from '../../data/parties';
import { healieBoi } from '../../data/enemies';
import { self } from '../../model/targetPriorities';

import { getRandomInt } from '../../util/random';

import { BattleView } from './BattleView';
import { Combatant } from '../../model/combatant';
import { idle } from '../../data/actions';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], party: Party) => boolean;
  scriptKeyName: string;
}

export class BattleStore {
  enemies: Enemy[];
  party: Party;

  caster?: PartyMember;
  action?: Action;
  target?: Combatant;
  menus: Option[][] = [];

  constructor(enemies: Enemy[], party: Party) {
    this.enemies = enemies;
    this.party = party;
    makeAutoObservable(this)
  }

  setCaster(member?: PartyMember): void {
    this.caster = member
  }

  setTarget(member?: Combatant): void {
    this.target = member
  }

  tickStats(updateFunc: (combatant: Combatant, delta: number) => void, delta: number): void {
    [...this.party.members, ...this.enemies].forEach((combatant) => {
      updateFunc(combatant, delta);
    });
  }

  updateCombatantsState(): void {
    [...this.party.members, ...this.enemies].forEach((combatant) => {
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
        // if (combatant === this.caster) {
        //   this.setCaster(null);
        //   this.menus = [];
        // }
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else if (combatant.status === Status.BLOCKING) {
        // do nothing
      } else {
        combatant.status = Status.NORMAL;
      }
    });
  }
}

export class Battle extends Phaser.Scene {
  ui: UiOverlayPlugin;
  private lastCalculation = 0;
  private music: Phaser.Sound.BaseSound;

  battleStore: BattleStore;

  constructor() {
    super(sceneConfig);
  }

  public init(): void {
    // Init Battle
    this.battleStore = new BattleStore([healieBoi], DefaultParty);
    this.ui.create(<BattleView scene={this}/>, this);
  }

  update(time: number, delta: number): void {
    if (this.battleStore.party.members.every((member) => member.status === Status.DEAD)) {
      console.log('HEROES DEAD');
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      console.log('ENEMIES DEAD');
    }

    if (this.battleStore.caster && this.battleStore.action && this.battleStore.target) {
      console.log(`${this.battleStore.caster.name} used ${this.battleStore.action.name} on ${this.battleStore.target.name}`);
      this.battleStore.caster.stamina -= this.battleStore.action.staminaCost;
      this.battleStore.action.execute(this.battleStore.target, this.battleStore.caster);
      
      if (this.battleStore.action.soundKeyName) this.sound.play(this.battleStore.action.soundKeyName);
      //if (this.battleStore.action.imageKeyName) this.displayEffect(this.battleStore.target, this.battleStore.action.imageKeyName);
      //this.shakeTarget(this.battleStore.target, this.battleStore.action);
    
      this.battleStore.caster = null;
      this.battleStore.action = null;
      this.battleStore.target = null;
      this.battleStore.menus = [];
    }

    this.battleStore.tickStats(this.updateStats, delta);
    this.battleStore.updateCombatantsState();

    // enemy AI
    this.lastCalculation += delta;
    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;
      this.updateEnemies(); 
    }

  }

  updateEnemies(): void {
    this.battleStore.enemies.forEach((enemy) => {
      const selectedBehavior = this.selectBehavior(this.battleStore.enemies, this.battleStore.party, enemy);
      const target = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(target, enemy);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
      //if (selectedBehavior.action.imageKeyName) this.displayEffect(target, selectedBehavior.action.imageKeyName);
      //this.shakeTarget(target, selectedBehavior.action);
    });
  }

  selectBehavior(enemies: Enemy[], party: Party, enemy: Enemy): Behavior {
    // Baseline Behavior Filter
    const filteredBehaviors = enemy.behaviors.filter((behavior) => {
      if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
      if (enemy.stamina < behavior.action.staminaCost) return false;
      if (enemy.health === enemy.maxHealth && behavior.action.tags.has(ActionTags.HEAL)) return false;
      return true;
    });

    // Apply Traits
    let traitedBehaviors = filteredBehaviors;
    enemy.traits.forEach((trait) => {
      if (trait.onUpdate) traitedBehaviors = trait.onUpdate(enemies, party, traitedBehaviors);
    });

    // Randomly Select Behavior Based on Weight
    const summedWeights = filteredBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);
    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find((behavior) => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    });
    return selectedBehavior || { action: idle, weight: 100, targetPriority: self }; // in case it doesn't pick anything
  }

  setAction(action: Action): void {
    this.battleStore.action = action;
  }

  setTarget(combatant: Combatant): void {
    this.battleStore.setTarget(combatant);    
  }

  updateStats(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    if (combatant.bleed > 0) {
      const DAMAGE_TICK_RATE = (delta / 1000) * 10;
      combatant.bleed -= DAMAGE_TICK_RATE;
      combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
    }
    const regenPerTick = combatant.staminaRegenRatePerSecond * (delta / 1000);
    combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
  }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  openInitialMenu(member?: PartyMember): void {
    if (member.status === Status.DEAD) {
      this.sound.play('stamina-depleted');
      return;
    }
    this.sound.play('choice-select');
    this.battleStore.setCaster(member);
    this.battleStore.menus.push(member.options);
  }

  closeMenu(): void {
    this.battleStore.menus.pop();
    this.sound.play('dialogue-advance');
  }
}
