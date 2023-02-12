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
  private menu: Element;

  private partyMemberPrimaryMenus: Element[] = [];
  private partyMemberCells: Element[] = [];
  private partyBar: Element;


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
    


    // Party Bar Display
    this.partyBar = (
      <div className={styles.partyBar} />
    );
    party.members.forEach((member, index) => {
      const partyMemberDisplay = (
        <div className={styles.characterCell}>
          { member.name }
          <div>❤️ { member.health }/ { member.maxHealth }</div>
          <div>☀️ { member.stamina }/ { member.maxStamina }</div>
        </div>
      );

      partyMemberDisplay.addEventListener('click', () => {
        scene.setActivePartyMember(index);
      });
      this.partyBar.appendChild(partyMemberDisplay);
      this.partyMemberCells.push(partyMemberDisplay);
    });

    // Menu Display (Dependency on Party Bar for Setting Active Cell);
    party.members.forEach((member) => {
      const memberPrimaryMenu = (
        <div className={styles.battleOptions}>
          <div className={styles.menuRow}>
            <div className={styles.menuButton}>{ member.primaryOptions[0].name }</div>
            <div className={styles.menuButton}>{ member.primaryOptions[1].name }</div>
          </div>
          <div className={styles.menuRow}>
            <div className={styles.menuButton}>{ member.primaryOptions[2].name }</div>
            <div className={styles.menuButton}>{ member.primaryOptions[3].name }</div>
          </div>
        </div>
      );

      this.partyMemberPrimaryMenus.push(memberPrimaryMenu);
    });
    this.menu = <div className={styles.menu}/>
    this.updatePartyMemberView(scene, battleModel);

    const container: Element = (
      <div className={styles.container}>
        {parallax}
        {this.menu}
        {this.partyBar}
      </div>
    );

    scene.ui.create(container, scene);
    parallax.addEventListener('click', () => scene.updateEnemies());
  }

  updateStats: (model: BattleModel) => void;
  updatePartyMemberView(scene: Battle, model: BattleModel) {
    this.menu.replaceChildren(this.partyMemberPrimaryMenus[model.activePartyMemberIndex]);
    this.partyMemberCells.forEach((cell, index) => {
      // remove style
      cell.classList.remove(styles.active);
      if (index === model.activePartyMemberIndex) {
        cell.classList.add(styles.active);
      }
    });
    scene.playButtonClickSound();
  }
}