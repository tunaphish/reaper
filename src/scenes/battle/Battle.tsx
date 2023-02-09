import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';

import { Behavior, Enemy } from '../../entities/enemy';
import { Party } from '../../entities/party';
import {  ActionTags } from '../../entities/action';

import { DefaultParty } from '../../mocks/party';
import { healieBoi } from '../../mocks/enemies';

import { getRandomInt } from '../../util/random';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private animeText: any;
  private menu: Element


  private lastCalculation = 0;
  private enemies: Enemy[];
  private enemyHealth: any;
  private enemyStamina: any;
  private party: Party;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // load enemy
    this.enemies = [healieBoi];
    this.party = DefaultParty;
  }

  public create(): void {
    const enemy = this.enemies[0];
    this.enemyHealth = <div>❤️ {enemy.health}/{enemy.maxHealth}</div>;
    this.enemyStamina = <div>☀️ {enemy.stamina}/{enemy.maxStamina}</div>;
    this.animeText = <p className={styles.animeText}>Test Text</p>
    
    const parallax = (
      <div className={styles.parallax} id="parallax">
          <div className={styles.tvContainer}>
          <div className={styles.staticEffect}>
            <div className={styles.oldTvContent}>
              <div className={styles.enemyUi}>
                  { this.enemyHealth }
                  { this.enemyStamina }
              </div>
              {this.animeText}
            </div>
          </div>
        </div>
      </div>
    );
    parallax.style.backgroundImage = 'url(https://raw.githubusercontent.com/oscicen/oscicen.github.io/master/img/depth-3.png), url("/reaper/assets/characters/eji.png"), url("/reaper/assets/backgrounds/pikrepo.jpg")';
    parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';

    const attackButton: Element = <div className={styles.menuButton}>Attack</div>;
    const magicButton: Element = <div className={styles.menuButton}>Magic</div>;
    const itemButton: Element = <div className={styles.menuButton}>Item</div>;
    const runButton: Element = <div className={styles.menuButton}>Run</div>;

    const battleMenu = (
      <div className={styles.battleOptions}>
        <div className={styles.menuRow}>
          {attackButton}
          {magicButton}
        </div>
        <div className={styles.menuRow}>
          {itemButton}
          {runButton}
        </div>
      </div>
    );

    this.menu = <div className={styles.menu}>{battleMenu}</div>;

    const partyBar: Element = (
      <div className={styles.partyBar}>
        <div className={styles.characterCell}>
          Eji
          <div>❤️ 100/100</div>
          <div>☀️ 100/100</div>
        </div>
        <div className={styles.characterCell}>
          Keshi
          <div>❤️ 100/100</div>
          <div>☀️ 100/100</div>
        </div>
        <div className={styles.characterCell}>
          Elise
          <div>❤️ 100/100</div>
          <div>☀️ 100/200</div>
        </div>
      </div>
    );

    const container: Element = (
      <div className={styles.container}>
        {parallax}
        {this.menu}
        {partyBar}
      </div>
    );

    this.ui.create(container, this);

    parallax.addEventListener('click', () => this.updateEnemies());
  }

  update(time, delta): void {
    if (this.party.members.every(member => member.health <= 0)) {
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
    this.enemies.forEach(enemy => {
      enemy.stamina = Math.min(enemy.maxStamina, enemy.stamina + 25);
    
      //Select Behavior
      const selectedBehavior = this.selectBehavior(this.enemies, this.party, enemy);
      const target = selectedBehavior.targetPriority(this.enemies, this.party, enemy);
  
      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(this.enemies, this.party, target);
      this.updateDisplay(selectedBehavior, target, enemy);
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

  updateDisplay(selectedBehavior: Behavior, target, enemy: Enemy): void {
    console.log('~');
    console.log(`${enemy.name} used ${selectedBehavior.action.name} on ${target.name}`)
    console.log(`${enemy.name}: ❤️ ${enemy.health} / ${enemy.maxHealth} |  ☀️ ${enemy.stamina} / ${enemy.maxStamina}`)
    this.party.members.forEach(member => {
      console.log(`${member.name}: ❤️ ${member.health} / ${member.maxHealth} |  ☀️ ${member.stamina} / ${member.maxStamina}`)
    })
  }
}
