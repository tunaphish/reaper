import { Behavior, Enemy } from '../../entities/enemy';
import { Party, PartyMember } from '../../entities/party';
import { Action, ActionTags } from '../../entities/action';

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
  private buttonClickSound: Phaser.Sound.BaseSound;
  private menuCloseSound: Phaser.Sound.BaseSound;

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
    this.buttonClickSound = this.sound.add('dialogue-advance');
    this.menuCloseSound = this.sound.add('choice-select');
    this.view = new BattleView(this, this.model);
  }

  update(time, delta): void {
    const { enemies, party } = this.model;
    if (party.members.every((member) => member.health <= 0)) {
      console.log('HEROES DEAD');
    }
    if (enemies.every((enemy) => enemy.health <= 0)) {
      console.log('ENEMIES DEAD');
    }

    if (this.action && this.target) {
      console.log(`${this.getActiveMember().name} used ${this.action.name} on ${this.target.name}`);
      this.action.execute(enemies, party, this.target);
      // todo: check if actually damage dealing attacks
      this.shakeTarget(this.target, this.action);
      this.action = null;
      this.target = null;

    }

    this.lastCalculation += delta;

    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;

      this.getCombatants().forEach((target) => {
        this.updateCombantantStamina(target);
      });

      this.updateEnemies(); // behavior

      //updateCombatants?
      //update respective displays
    }

    this.view.updateStats(this.model);
  }

  updateEnemies() {
    // Update Stats
    const { enemies, party } = this.model;
    enemies.forEach((enemy) => {
      //Select Behavior
      const selectedBehavior = this.selectBehavior(enemies, party, enemy);
      const target = selectedBehavior.targetPriority(enemies, party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(enemies, party, target);
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
    this.buttonClickSound.play();
  }

  playMenuCloseSound() {
    this.menuCloseSound.play();
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
  }

  getCombatants(): Combatant[] {
    return [...this.model.party.members, ...this.model.enemies].filter(isAlive);
  }

  getTargets(): Combatant[] {
    // TODO: Apply Traits
    // TODO: Apply Emotions
    return this.getCombatants();
  }

  getActiveMember(): PartyMember {
    return this.model.party.members[this.model.activePartyMemberIndex];
  }

  setTarget(targetName: string): void {
    this.target = this.getTargets().find((target) => target.name === targetName);
  }

  updateCombantantStamina(combatant: Combatant): void {
    combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + 25);
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
}

const isAlive = (combatant: Combatant) => combatant.health > 0;
