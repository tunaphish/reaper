import { Behavior, Enemy } from '../../entities/enemy';
import { Party, PartyMember, Option, Folder } from '../../entities/party';
import { Action, ActionTags, TargetType } from '../../entities/action';
import { Status } from '../../entities/combatant';

import { DefaultParty } from '../../entities/parties';
import { healieBoi, randomEnemy } from '../../entities/enemies';

import UiOverlayPlugin from '../../ui/UiOverlayPlugin'; // figure out how this works, I think it gets injected into every scene
import { getRandomInt } from '../../util/random';

import { BattleModel } from './battleModel';
import { BattleView } from './BattleView';
import { Combatant } from '../../entities/combatant';
import { excited, depressed, disgusted, envious, anger, confusion } from '../../entities/emotions';
import { ACTION_SET, slash } from '../../entities/actions';
import { shuffle } from '../../util';

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
  private targets?: Combatant[];

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

    // Set Party Member Status
    party.members.forEach((member, idx) => {
      if (member.health <= 0) {
        member.status = Status.DEAD;
        this.view.setPartyMemberCellDead(idx);
        if (this.model.activePartyMemberIndex === idx) {
          // get live party member
          for (let i = 0; i < party.members.length; i++) {
            if (party.members[i].status !== Status.DEAD) {
              this.model.activePartyMemberIndex = i;
              this.view.updatePartyMemberView(this, this.model);
              this.view.closeMenus();
              break;
            }
          }
        }
      } else if (member.stamina <= 0) {
        member.status = Status.EXHAUSTED;
        this.view.setPartyMemberCellExhausted(idx);
      } else {
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

    if (this.action && this.targets) {
      const activeMember = this.getActiveMember();
      if (activeMember.stamina < 0) {
        this.playBadOptionSound();
      } else {
        console.log(`${this.getActiveMember().name} used ${this.action.name} on ${this.targets[0].name}`);
        activeMember.stamina -= this.action.staminaCost;
        this.action.execute(this.model, this.targets);
        if (this.action.soundKeyName) this.sound.play(this.action.soundKeyName);
        this.shakeTarget(this.targets, this.action);
      }

      this.action = null;
      this.targets = null;
    }

    this.getCombatants().forEach((target) => {
      this.updateCombatantHealth(target, delta);
      this.updateCombatantStamina(target, delta);
    });

    this.lastCalculation += delta;

    if (this.lastCalculation > 2000) {
      this.getCombatants().forEach((combatant) => {
        if (combatant.emotionalState.get(envious) > 0) combatant.stackedDamage += 10;
      });
      this.lastCalculation = 0;
      this.updateEnemies(); // behavior
    }

    this.view.updateStats(this.model);

    // bloodlust check
    party.members.forEach((member, idx) => {
      if (member.emotionalState.get(excited) > 0 && member.stamina === member.maxStamina) {
        this.view.closeMenus();
        this.setActivePartyMember(idx);
        this.action = slash; // TODO: select random attack
        this.targets = randomEnemy(enemies, party, null);
      }
    });
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
    for (const [emotion, count] of enemy.emotionalState) {
      if (emotion.onUpdate) emotionBehaviors = emotion.onUpdate(enemies, party, emotionBehaviors, count);
    }
    console.log(emotionBehaviors);

    // Randomly Select Behavior Based on Weight
    const summedWeights = emotionBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);
    let runningSum = 0;
    const selectedBehavior = emotionBehaviors.find((behavior) => {
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

  getOptions(option: Option): Option[] {
    // const activeMember: PartyMember = this.getActiveMember();
    // TODO: fix emotion application
    // const { enemies, party } = this.model;
    // let emotionalOptions = option.options;
    // for (const [emotion, count] of activeMember.emotionalState) {
    //   if (emotion.onClick) emotionalOptions = emotion.onClick(this.model, emotionalOptions, count);
    // }
    const activeMember: PartyMember = this.getActiveMember();
    let emotionOptions = [...(option as Folder).options];
    if (activeMember.emotionalState.get(anger) > 0) emotionOptions.unshift(activeMember.options[0]) // attack is always the first
    if (activeMember.emotionalState.get(confusion) > 0) emotionOptions = shuffle(emotionOptions);

    return emotionOptions;
  }

  setAction(action: Action): void {
    this.action = action;
  }

  getCombatants(): Combatant[] {
    return [...this.model.party.members, ...this.model.enemies];
  }

  getTargets(): Combatant[] {
    const activeMember = this.getActiveMember();
    const initialTargets = this.getCombatants().filter(isAlive);

    let emotionalTargets = initialTargets;
    for (const [emotion, count] of activeMember.emotionalState) {
      if (emotion.onOpenTargets) emotionalTargets = emotion.onOpenTargets(emotionalTargets, count);
    }

    return emotionalTargets;
  }

  getActiveMember(): PartyMember {
    return this.model.party.members[this.model.activePartyMemberIndex];
  }

  setTargets(targets: string): void {
    // Target Self
    if (this.action.targetType === TargetType.SELF) {
      this.targets = [this.getActiveMember()];
      return;
    }

    if (this.action.targetType === TargetType.ALL) {
      this.targets = this.getCombatants().filter(isAlive);
      return;
    }

    // Target Single
    this.targets = [this.getCombatants().find((target) => target.name === targets)];
  }

  updateCombatantHealth(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD || combatant.stackedDamage < 0) return;
    const isDisgusted = combatant.emotionalState.get(disgusted) > 0;
    const DAMAGE_TICK_RATE = (delta / 1000) * (isDisgusted ? 20 : 10);
    combatant.stackedDamage -= DAMAGE_TICK_RATE;
    combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
  }

  updateCombatantStamina(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    const regenPerTick =
      combatant.staminaRegenRate * (delta / 1000) * (combatant.emotionalState.get(depressed) > 0 ? 0.5 : 1);
    combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
  }

  shakeTarget(targets: Combatant[], action: Action): void {
    if (!action.tags.has(ActionTags.ATTACK)) return;
    for (const target of targets) {
      for (let i = 0; i < this.model.enemies.length; i++) {
        if (this.model.enemies[i] === target) this.view.shakeEnemy();
      }

      for (let i = 0; i < this.model.party.members.length; i++) {
        if (this.model.party.members[i] === target) this.view.shakePartyMember(i);
      }
    }
  }

  getMemberStatus(memberIndex: number) {
    return this.model.party.members[memberIndex].status;
  }
}

const isAlive = (combatant: Combatant) => combatant.health > 0;
