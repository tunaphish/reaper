import { Behavior, Enemy } from '../../entities/enemy';
import { Party, PartyMember } from '../../entities/party';
import { Action, ActionTags } from '../../entities/action';

import { DefaultParty } from '../../entities/parties';
import { healieBoi } from '../../entities/enemies';

import UiOverlayPlugin from '../../ui/UiOverlayPlugin'; // figure out how this works, I think it gets injected into every scene
import { getRandomInt } from '../../util/random';

import { BattleModel } from './battleModel';
import { BattleView, TextBattleView } from './BattleView';
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
  private textView: TextBattleView;
  private buttonClickSound: Phaser.Sound.BaseSound;
  private menuCloseSound: Phaser.Sound.BaseSound;

  // player actions
  private action?: Action;
  private target?: Combatant;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // load enemy
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
    this.textView = new TextBattleView(this, this.model);
  }

  update(time, delta): void {
    const { enemies, party } = this.model;
    if (party.members.every((member) => member.health <= 0)) {
      console.log('HEROES DEAD');
    }

    if (this.action && this.target) {
      console.log(`${this.getActiveMember().name} used ${this.action.name} on ${this.target.name}`);
      this.textView.displayAction(this.action, this.target, this.getActiveMember());
      this.textView.updateStats(this.model);
      this.action.execute(enemies, party, this.target);
      this.action = null;
      this.target = null;

      // reduce stamina 
      
    }
    // all hero health is gone
    // all enemy health is gone
    // battle checks

    this.lastCalculation += delta;

    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;
      //this.updateEnemies();
    }
  }

  updateEnemies() {
    // Update Stats
    const { enemies, party } = this.model;
    enemies.forEach((enemy) => {
      enemy.stamina = Math.min(enemy.maxStamina, enemy.stamina + 25);

      //Select Behavior
      const selectedBehavior = this.selectBehavior(enemies, party, enemy);
      const target = selectedBehavior.targetPriority(enemies, party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(enemies, party, target);
      this.textView.displayAction(selectedBehavior.action, target, enemy);
      this.textView.updateStats(this.model);
      this.view.updatePartyMemberView(this, this.model)
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
    this.textView.displayBehaviors(traitedBehaviors);

    // Apply Emotions
    let emotionBehaviors = traitedBehaviors;
    for (const state of enemy.emotionalState) {
      emotionBehaviors = state.emotion?.onUpdate(enemies, party, emotionBehaviors, state.count);
    }

    // displayBehaviorTable
    this.textView.displayBehaviors(emotionBehaviors);

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
    console.log(index);
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
    const match = activeMember.options.find(option => option.name === optionKey)
    console.log(match);
    return match.options;
  }

  getAction(actionName: string): Action {
    const activeMember = this.getActiveMember();
    return activeMember.actions.find(action => actionName === action.name);
  }

  setAction(action: Action): void {
    this.action = action;
  }

  getTargets(): Combatant[] {
    return [...this.model.party.members, ...this.model.enemies];
  };

  getActiveMember(): PartyMember {
    return this.model.party.members[this.model.activePartyMemberIndex];
  }

  setTarget(targetName: string): void {
    this.target = this.getTargets().find(target => target.name === targetName);
    console.log(this.target);
  };
}
