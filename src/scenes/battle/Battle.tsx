import * as React from 'react';
import { load } from 'js-yaml';
import { observable, action, makeAutoObservable } from 'mobx';
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
  targets?: Combatant[];
  menus: Option[][] = [];

  constructor(enemies: Enemy[], party: Party) {
    this.enemies = enemies;
    this.party = party;
    makeAutoObservable(this)
  }

  setCaster(member?: PartyMember): void {
    this.caster = member
    console.log(this.caster);
  }
}

export class Battle extends Phaser.Scene {
  ui: UiOverlayPlugin;
  private lastCalculation = 0;
  private music: Phaser.Sound.BaseSound;

  battleStore: BattleStore;

  // Dialogue Additions
  scriptFileName: string;
  dialogueTriggers: DialogueTrigger[];
  isBattlePaused = false;
  private lineIndex;
  private scripts: any;
  private script: string[];

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // Init Battle
    this.battleStore = new BattleStore([healieBoi], DefaultParty);
    this.scriptFileName = 'mission-7';
    this.dialogueTriggers = [
      // {
      //   trigger: ([healieBoi], DefaultParty) => true,
      //   scriptKeyName: 'start'
      // },
      {
        trigger: ([healieBoi], DefaultParty) => healieBoi.health < 150,
        scriptKeyName: 'fuck_you',
      },
      {
        trigger: ([healieBoi], DefaultParty) => healieBoi.health < 1,
        scriptKeyName: 'death',
      },
    ];
    this.ui.create(<BattleView scene={this}/>, this);
    this.scripts = load(this.cache.text.get(this.scriptFileName));
  }

  update(time, delta: number): void {
    if (this.isBattlePaused) return;

    // Dialogue Trigger Checks
    this.dialogueTriggers.forEach((dialogueTrigger, idx) => {
      if (dialogueTrigger.trigger(this.battleStore.enemies, this.battleStore.party)) {
        // // this.view.switchToDialogueMenu();
        this.isBattlePaused = true;
        this.updateScript(dialogueTrigger.scriptKeyName);
        this.dialogueTriggers.splice(idx, 1); // remove dialogue trigger
        return;
      }
    });

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

    if (this.battleStore.action && this.battleStore.targets) {
      if (this.battleStore.caster.stamina < 0) {
        this.sound.play('stamina-depleted');
      } else {
        console.log(`${this.battleStore.caster.name} used ${this.battleStore.action.name} on ${this.battleStore.targets[0].name}`);
        this.battleStore.caster.stamina -= this.battleStore.action.staminaCost;
        this.battleStore.action.execute(this.battleStore.targets, this.battleStore.caster);
        if (this.battleStore.action.soundKeyName) this.sound.play(this.battleStore.action.soundKeyName);
        if (this.battleStore.action.imageKeyName) this.displayEffect(this.battleStore.targets, this.battleStore.action.imageKeyName);
        this.shakeTarget(this.battleStore.targets, this.battleStore.action);
      }

      this.battleStore.action = null;
      this.battleStore.targets = null;
    }

    this.getCombatants().forEach((target) => {
      this.updateCombatantHealth(target, delta);
      this.updateCombatantStamina(target, delta);
    });

    this.lastCalculation += delta;

    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;
      this.updateEnemies(); // behavior
    }

    // this.view.updateStats(this);
  }

  updateEnemies() {
    this.battleStore.enemies.forEach((enemy) => {
      const selectedBehavior = this.selectBehavior(this.battleStore.enemies, this.battleStore.party, enemy);
      const targets = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(targets, enemy);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
      if (selectedBehavior.action.imageKeyName) this.displayEffect(targets, selectedBehavior.action.imageKeyName);
      this.shakeTarget(targets, selectedBehavior.action);
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

  getTargets(): Combatant[] {
    const initialTargets = this.getCombatants().filter(isAlive);
    return initialTargets;
  }

  setTargets(targets: string): void {
    if (this.battleStore.action.targetType === TargetType.SELF) {
      this.battleStore.targets = [this.battleStore.caster];
      return;
    }

    if (this.battleStore.action.targetType === TargetType.ALL) {
      this.battleStore.targets = this.getCombatants().filter(isAlive);
      return;
    }

    // if it contains commas... it's multiple targets. (what about mass confusion)
    this.battleStore.targets = [this.getCombatants().find((target) => target.name === targets)];
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

  shakeTarget(targets: Combatant[], action: Action): void {
    if (!action.tags.has(ActionTags.ATTACK)) return;
    for (const target of targets) {
      for (let i = 0; i < this.battleStore.enemies.length; i++) {
        //if (this.model.enemies[i] === target) 
          // this.view.shakeEnemy();
      }

      for (let i = 0; i < this.battleStore.party.members.length; i++) {
        //if (this.model.party.members[i] === target) this.view.shakePartyMember(i);
      }
    }
  }

  getMemberStatus(memberIndex: number) {
    return this.battleStore.party.members[memberIndex].status;
  }

  displayEffect(targets: Combatant[], effectKeyName: string): void {
    for (const target of targets) {
      for (let i = 0; i < this.battleStore.enemies.length; i++) {
        //if (this.model.enemies[i] === target) // this.view.displayEffectOnEnemy(effectKeyName);
      }
      for (let i = 0; i < this.battleStore.party.members.length; i++) {
        //if (this.model.party.members[i] === target) // this.view.displayEffectOnMember(i, effectKeyName);
      }
    }
  }

  advanceLine(): void {
    this.lineIndex++;
    if (this.lineIndex >= this.script.length) {
      this.music?.stop();
      this.scene.start('Battle'); //TODO: send elsewhere
      return;
    }

    const line = this.script[this.lineIndex];
    const [keys, value] = line.split(' | ');
    const [action, actor, adjective] = keys.split(' ');
    switch (action) {
      case 'show':
        // this.background = `url("/reaper/assets/backgrounds/${actor}.jpg")`;
        // this.parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';
        // this.updateParallax();
        this.advanceLine();
        break;
      case 'enter':
        // const emotion = adjective ? `-${adjective}` : '';
        // this.middleground = `url("/reaper/assets/characters/${actor}${emotion}.png")`;
        // this.updateParallax();
        this.advanceLine();
        break;
      case 'says':
        this.sound.play('dialogue-advance');
        // this.view.updateMenuText(actor, value);
        break;
      case 'announce':
        this.sound.play('dialogue-advance');
        // this.view.updateMenuText('', value);
        break;
      case 'display':
        this.sound.play('dialogue-advance');
        // this.view.updateAnimeText(value);
        break;
      case 'play':
        this.playSong(actor);
        this.advanceLine();
        break;
      case 'choose':
        // this.view.updateMenuChoices(this, value);
        break;
      case 'initiate':
        // this.view.updatePartyMemberView(this);
        this.isBattlePaused = false;
        // this.sound.play('battle-start');
        break;
      default:
        this.advanceLine();
    }
  }

  playSong(songKey): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  updateScript(newScriptKey: string) {
    this.sound.play('dialogue-advance');
    this.script = this.scripts[newScriptKey];
    this.lineIndex = -1;
    this.advanceLine();
  }

  openInitialMenu(member?: PartyMember) {
    if (this.isBattlePaused) return;
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
