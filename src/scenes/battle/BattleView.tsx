import { BattleModel } from './battleModel';
import styles from './battle.module.css';
import { createElement } from '../../ui/jsxFactory';
import { Battle } from './Battle';
import { Behavior } from '../../entities/enemy';

export interface IBattleView {
  updateStats: (model: BattleModel) => void;
}

export class TextBattleView implements IBattleView{

  constructor(scene: Battle, battleModel: BattleModel) {
    this.updateStats(battleModel);
  }

  displayEnemyAction(selectedBehavior: any, target, enemy: any) {
    console.log('~');
    console.log(`${enemy.name} used ${selectedBehavior.action.name} on ${target.name}`)
  }

  updateStats(model: BattleModel): void {
    const { enemies, party } = model;
    enemies.forEach(enemy => console.log(`${enemy.name}: ❤️ ${enemy.health} / ${enemy.maxHealth} |  ☀️ ${enemy.stamina} / ${enemy.maxStamina}`));
    party.members.forEach(member => console.log(`${member.name}: ❤️ ${member.health} / ${member.maxHealth} |  ☀️ ${member.stamina} / ${member.maxStamina}`));
  }
  
  displayBehaviors(behaviors: Behavior[]): void {
    const behaviorTable = behaviors.map(behavior => ({ name: behavior.action.name, weight: behavior.weight }));
    console.table(behaviorTable);
  }
}

export class BattleView implements IBattleView {
  private enemyHealth: any;
  private enemyStamina: any;
  private animeText: any;
  private menu: Element

  constructor(scene: Battle, battleModel: BattleModel) {
    const { enemies, party } = battleModel;

    // Enemy Display 
    const enemy = enemies[0];
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

    // Menu Display
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

    // Party Bar Display
    
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

    scene.ui.create(container, scene);
    parallax.addEventListener('click', () => scene.updateEnemies());
  }

  updateStats: (model: BattleModel) => void;
}