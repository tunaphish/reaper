import { Behavior, Enemy } from '../../entities/enemy';
import { Party } from '../../entities/party';
import {  ActionTags } from '../../entities/action';

import { DefaultParty } from '../../entities/parties';
import { healieBoi } from '../../entities/enemies';

import UiOverlayPlugin from '../../ui/UiOverlayPlugin'; // figure out how this works, I think it gets injected into every scene 
import { getRandomInt } from '../../util/random';

import { BattleModel } from './battleModel';
import { BattleView, IBattleView, TextBattleView } from './BattleView';

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

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // load enemy
    this.model = {
      enemies: [healieBoi],
      party: DefaultParty
    }
  }

  public create(): void {
    this.view = new BattleView(this, this.model);
    this.textView = new TextBattleView(this, this.model);
  }

  update(time, delta): void {
    const { party } = this.model;
    if (party.members.every(member => member.health <= 0)) {
      console.log('HEROES DEAD');
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
    enemies.forEach(enemy => {
      enemy.stamina = Math.min(enemy.maxStamina, enemy.stamina + 25);
    
      //Select Behavior
      const selectedBehavior = this.selectBehavior(enemies, party, enemy);
      const target = selectedBehavior.targetPriority(enemies, party, enemy);
  
      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(enemies, party, target);
      this.textView.displayEnemyAction(selectedBehavior, target, enemy);
      this.textView.updateStats(this.model);
    });
  }

  selectBehavior(enemies: Enemy[], party: Party, enemy: Enemy): Behavior {
    // Baseline Behavior Filter
    const filteredBehaviors = enemy.behaviors.filter(behavior => {
      if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
      if (enemy.stamina < behavior.action.staminaCost) return false;
      if (enemy.health === enemy.maxHealth && behavior.action.tags.has(ActionTags.HEAL)) return false;
      return true;
    });

    // Apply Traits
    let modifiedBehaviors = filteredBehaviors;
    enemy.traits.forEach(trait => {
      modifiedBehaviors = trait.onUpdate(enemies, party, modifiedBehaviors);
    })

    // Apply Emotions
    let emotionBehaviors = modifiedBehaviors;

    // for (let emotion of enemy.emotionalState.keys()) {
    //   console.log(emotion.display);
    // }

    // Randomly Select Behavior Based on Weight
    const summedWeights = modifiedBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);
    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find(behavior => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    })
    return selectedBehavior;
  }
}
