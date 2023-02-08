import { load } from 'js-yaml';
import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';
import { Enemy, Sei } from '../../entities/enemy';
import { DefaultParty, Party } from '../../entities/party';
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
  private enemy: Enemy;
  private enemyHealth: any;
  private enemyStamina: any;
  private party: Party;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    // load enemy
    this.enemy = Sei;
    this.party = DefaultParty;
  }

  public create(): void {
    this.enemyHealth = <div>❤️ {this.enemy.health}/{this.enemy.maxHealth}</div>;
    this.enemyStamina = <div>☀️ {this.enemy.stamina}/{this.enemy.maxStamina}</div>;
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
  }

  update(time, delta): void {
    // check if battle is over
    // all hero health is gone
    // all enemy health is gone
    // battle checks
    if (this.enemy.health < 0) {
      console.log('weiner');
    }

    this.lastCalculation += delta;
    
    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;

      // update health
      // update stamina
      this.enemy.stamina = Math.min(this.enemy.maxStamina, this.enemy.stamina + 25);
      this.selectAction(this.enemy);
    }
  }

  selectAction(enemy: Enemy): void {
    const filteredBehaviors = enemy.behaviors.filter(behavior => {
      if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
      if (enemy.stamina < behavior.action.staminaCost) return false;
      return true;
    });

    const summedWeights = filteredBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);

    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find(behavior => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    })
    if (!selectedBehavior) return;

    //side effects
    this.enemy.stamina -= selectedBehavior.action.staminaCost;
    selectedBehavior.action.executeAbility(this.enemy, this.party);
    this.updateDisplay();
  }

  updateDisplay(): void {
    console.log(`${this.enemy.name}: ❤️ ${this.enemy.health} / ${this.enemy.maxHealth} |  ☀️ ${this.enemy.stamina} / ${this.enemy.maxStamina}`)
    this.party.members.forEach(member => {
      console.log(`${member.name}: ❤️ ${member.health} / ${member.maxHealth} |  ☀️ ${member.stamina} / ${member.maxStamina}`)
    })
  }
}
