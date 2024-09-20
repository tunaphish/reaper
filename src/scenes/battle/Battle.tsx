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
}

export class Battle extends Phaser.Scene {
  ui: UiOverlayPlugin;
  private lastCalculation = 0;
  private music: Phaser.Sound.BaseSound;

  battleStore: BattleStore;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // Init Battle
    this.battleStore = new BattleStore([healieBoi], DefaultParty);
    this.ui.create(<BattleView scene={this}/>, this);
  }

  update(time, delta: number): void {
    // Set Party Member Status
    this.battleStore.party.members.forEach((member, idx) => {
      if (member.health <= 0) {
        member.status = Status.DEAD;
        this.battleStore.caster = null
        // signal caster changed
        // signal menu closed
      } else if (member.stamina <= 0) {
        member.status = Status.EXHAUSTED;
      } else if (member.status === Status.BLOCKING) {
        // do nothing
      } else {
        member.status = Status.NORMAL;
      }
      // this.view.setPartyMemberStatus(idx, member);
    });

    if (this.battleStore.party.members.every((member) => member.status === Status.DEAD)) {
      console.log('HEROES DEAD');
    }
    if (this.battleStore.enemies.every((enemy) => enemy.health <= 0)) {
      console.log('ENEMIES DEAD');
    }

    if (this.battleStore.action && this.battleStore.target) {
      if (this.battleStore.caster.stamina < 0) {
        this.sound.play('stamina-depleted');
      } else {
        console.log(`${this.battleStore.caster.name} used ${this.battleStore.action.name} on ${this.battleStore.target[0].name}`);
        this.battleStore.caster.stamina -= this.battleStore.action.staminaCost;
        this.battleStore.action.execute(this.battleStore.target, this.battleStore.caster);
        if (this.battleStore.action.soundKeyName) this.sound.play(this.battleStore.action.soundKeyName);
        //if (this.battleStore.action.imageKeyName) this.displayEffect(this.battleStore.target, this.battleStore.action.imageKeyName);
        //this.shakeTarget(this.battleStore.target, this.battleStore.action);
      }

      this.battleStore.action = null;
      this.battleStore.target = null;
    }

    this.getCombatants().forEach((target) => {
      this.updateCombatantHealth(target, delta);
      this.updateCombatantStamina(target, delta);
      // this.view.updateStats(this);
    });

    this.lastCalculation += delta;
    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;
      this.updateEnemies(); // behavior
    }

  }

  updateEnemies() {
    this.battleStore.enemies.forEach((enemy) => {
      const selectedBehavior = this.selectBehavior(this.battleStore.enemies, this.battleStore.party, enemy);
      const target = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(target, enemy);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
      //if (selectedBehavior.action.imageKeyName) this.displayEffect(target, selectedBehavior.action.imageKeyName);
      //this.shakeTarget(target, selectedBehavior.action);
      if (selectedBehavior.dialoguePool && Math.floor(Math.random() * 2) === 0) {
        const randomActionDialogue =
          selectedBehavior.dialoguePool[Math.floor(Math.random() * selectedBehavior.dialoguePool.length)];
        // this.view.updateAnimeText(randomActionDialogue);
      }
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

  getOptions(option: Option): Option[] {
    const options = [...(option as Folder).options];
    return options;
  }

  setAction(action: Action): void {
    this.battleStore.action = action;
  }

  getCombatants(): Combatant[] {
    return [...this.battleStore.party.members, ...this.battleStore.enemies];
  }

  gettarget(): Combatant[] {
    const initialtarget = this.getCombatants().filter(isAlive);
    return initialtarget;
  }

  settarget(combatant: Combatant): void {
    if (this.battleStore.action.targetType === TargetType.SELF) {
      this.battleStore.setTarget(this.battleStore.caster);
      return;
    }
    this.battleStore.setTarget(combatant);


    // if it contains commas... it's multiple target. (what about mass confusion)
    
  }

  updateCombatantHealth(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD || combatant.stackedDamage < 0) return;
    const DAMAGE_TICK_RATE = (delta / 1000) * 10;
    combatant.stackedDamage -= DAMAGE_TICK_RATE;
    combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
  }

  updateCombatantStamina(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    const regenPerTick = combatant.staminaRegenRate * (delta / 1000);
    combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
  }

  // shakeTarget(target: Combatant[], action: Action): void {
  //   if (!action.tags.has(ActionTags.ATTACK)) return;
  //   for (const target of target) {
  //     for (let i = 0; i < this.battleStore.enemies.length; i++) {
  //       //if (this.model.enemies[i] === target) 
  //         // this.view.shakeEnemy();
  //     }

  //     for (let i = 0; i < this.battleStore.party.members.length; i++) {
  //       //if (this.model.party.members[i] === target) this.view.shakePartyMember(i);
  //     }
  //   }
  // }

  getMemberStatus(memberIndex: number) {
    return this.battleStore.party.members[memberIndex].status;
  }

  // displayEffect(target: Combatant[], effectKeyName: string): void {
  //   for (const target of target) {
  //     for (let i = 0; i < this.battleStore.enemies.length; i++) {
  //       //if (this.model.enemies[i] === target) // this.view.displayEffectOnEnemy(effectKeyName);
  //     }
  //     for (let i = 0; i < this.battleStore.party.members.length; i++) {
  //       //if (this.model.party.members[i] === target) // this.view.displayEffectOnMember(i, effectKeyName);
  //     }
  //   }
  // }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  openInitialMenu(member?: PartyMember) {
    if (member.status === Status.DEAD) {
      this.sound.play('stamina-depleted');
      return;
    }
    this.sound.play('dialogue-advance');
    this.battleStore.setCaster(member);
    this.battleStore.menus.push(member.options);
    console.log(this.battleStore.menus)
  }
}

const isAlive = (combatant: Combatant) => combatant.health > 0;
