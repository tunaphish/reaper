import { Behavior, Enemy } from '../../entities/enemy';
import { Party, PartyMember } from '../../entities/party';
import { Action, ActionTags, TargetType } from '../../entities/action';
import { Status } from '../../entities/combatant';

import { DefaultParty } from '../../entities/parties';
import { healieBoi } from '../../entities/enemies';

import UiOverlayPlugin from '../../ui/UiOverlayPlugin'; // figure out how this works, I think it gets injected into every scene
import { getRandomInt } from '../../util/random';

import { BattleModel } from './battleModel';
import { BattleView } from './BattleView';
import { Combatant } from '../../entities/combatant';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export class Battle extends Phaser.Scene {
  ui: UiOverlayPlugin;
  private lastCalculation = 0;
  private model: BattleModel;
  private view: BattleView;

  private battleMusic: Phaser.Sound.BaseSound;

  private action?: Action;
  private target?: Combatant;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    this.model = {
      enemies: [healieBoi],
      party: DefaultParty,
      activePartyMemberIndex: 0,
    };
  }

  public create(): void {
    this.battleMusic = this.sound.add('upgrade');
    this.battleMusic.play();
    this.view = new BattleView(this, this.model);    
  }

  update(time, delta: number): void {
    const { enemies, party } = this.model;

    party.members.forEach((member, idx) => {
      if (member.health <= 0) {
        member.status = Status.DEAD;
        this.view.setPartyMemberCellDead(idx);
        if (this.model.activePartyMemberIndex === idx) {
          // get live party member
          for (let i=0; i<party.members.length; i++) {
            if (party.members[i].status !== Status.DEAD) {
              this.model.activePartyMemberIndex = i;
              this.view.updatePartyMemberView(this, this.model);
              this.view.closeMenus();
              break;
            }
          }
        }
      }
      else if (member.stamina <= 0) {
        member.status = Status.EXHAUSTED;
        this.view.setPartyMemberCellExhausted(idx);
      }
      else {
        member.status = Status.NORMAL;
        this.view.setPartyMemberCellNormal(idx);
      }
    });

    if (party.members.every((member) => member.status === Status.DEAD)) {
      console.log('HEROES DEAD');
    }
    if (enemies.every((enemy) => enemy.health <= 0)) {
      console.log('ENEMIES DEAD');
    }

    if (this.action && this.target) {
      const activeMember = this.getActiveMember();
      if (activeMember.stamina < 0) {
        this.playBadOptionSound();
      }
      else {
        console.log(`${this.getActiveMember().name} used ${this.action.name} on ${this.target.name}`);
        activeMember.stamina -= this.action.staminaCost;
        this.action.execute(this.model, this.target);
        if (this.action.soundKeyName) this.sound.play(this.action.soundKeyName);
        this.shakeTarget(this.target, this.action);
      }

      this.action = null;
      this.target = null;
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

    this.view.updateStats(this.model);
  }

  updateEnemies() {
    const { enemies, party } = this.model;
    enemies.forEach((enemy) => {
      const selectedBehavior = this.selectBehavior(enemies, party, enemy);
      const target = selectedBehavior.targetPriority(enemies, party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(this.model, target);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
      this.shakeTarget(target, selectedBehavior.action);
      this.view.updatePartyMemberView(this, this.model);
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
      traitedBehaviors = trait.onUpdate(enemies, party, traitedBehaviors);
    });

    // Apply Emotions
    let emotionBehaviors = traitedBehaviors;
    for (const state of enemy.emotionalState) {
      emotionBehaviors = state.emotion?.onUpdate(enemies, party, emotionBehaviors, state.count);
    }

    // Randomly Select Behavior Based on Weight
    const summedWeights = traitedBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);
    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find((behavior) => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    });
    return selectedBehavior;
  }

  setActivePartyMember(index: number) {
    this.model.activePartyMemberIndex = index;
    this.view.updatePartyMemberView(this, this.model);
  }

  playButtonClickSound() {
    this.sound.play('dialogue-advance');
  }

  playMenuCloseSound() {
    this.sound.play('choice-select');
  }

  playBadOptionSound() {
    this.sound.play('stamina-depleted');
  }

  getOptions(optionKey: string): string[] {
    const activeMember: PartyMember = this.getActiveMember();
    const matchedOptions = activeMember.options.find((option) => option.name === optionKey);

    // TODO: Apply Traits

    // Apply emotion
    const { enemies, party } = this.model;
    let emotionalOptions = matchedOptions.options;
    for (const state of activeMember.emotionalState) {
      emotionalOptions = state.emotion?.onClick(this.model, emotionalOptions, state.count);
    }

    return emotionalOptions;
  }

  getAction(actionName: string): Action {
    const activeMember = this.getActiveMember();
    return activeMember.actions.find((action) => actionName === action.name);
  }

  setAction(action: Action): void {
    this.action = action;
    if (action.targetType === TargetType.SELF) this.target = this.getActiveMember();
  }

  getCombatants(): Combatant[] {
    return [...this.model.party.members, ...this.model.enemies];
  }

  getTargets(): Combatant[] {
    // TODO: Apply Traits

    const activeMember = this.getActiveMember();
    // TODO: don't filter if action can target dead people;
    const initialTargets = this.getCombatants().filter(isAlive);

    let emotionalTargets = initialTargets;
    for (const state of activeMember.emotionalState) {
      if (state.emotion.onOpenTargets) emotionalTargets = state.emotion.onOpenTargets(emotionalTargets, state.count);
    };

    return emotionalTargets;
  }

  getActiveMember(): PartyMember {
    return this.model.party.members[this.model.activePartyMemberIndex];
  }

  setTarget(targetName: string): void {
    this.target = this.getCombatants().find((target) => target.name === targetName);
  }

  updateCombatantHealth(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD || combatant.stackedDamage < 0) return;
    const DAMAGE_TICK_RATE = 10 * (delta/1000);
    combatant.stackedDamage -= DAMAGE_TICK_RATE;
    combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
  }

  updateCombatantStamina(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    const regenPerTick = combatant.staminaRegenRate * (delta/1000);
    combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
  }

  shakeTarget(target: Combatant, action: Action): void {
    if (!action.tags.has(ActionTags.ATTACK)) return;
    for (let i = 0; i<this.model.enemies.length; i++) {
      if (this.model.enemies[i] === target) this.view.shakeEnemy();
    }
    
    for (let i = 0; i<this.model.party.members.length; i++) {
      if (this.model.party.members[i] === target) this.view.shakePartyMember(i);
    }
  }

  getMemberStatus(memberIndex: number) {
    return this.model.party.members[memberIndex].status;
  }
}

const isAlive = (combatant: Combatant) => combatant.health > 0;
