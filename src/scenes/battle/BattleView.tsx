import { Behavior } from '../../entities/enemy';
import { Option } from '../../entities/party';

import { BattleModel } from './battleModel';
import styles from './battle.module.css';
import { createElement } from '../../ui/jsxFactory';
import { Battle } from './Battle';
import { Combatant } from '../../entities/combatant';
import { Action } from '../../entities/action';


export interface IBattleView {
  updateStats: (model: BattleModel) => void;
}

export class TextBattleView implements IBattleView {
  constructor(scene: Battle, battleModel: BattleModel) {
    this.updateStats(battleModel);
  }

  displayAction(action: Action, target: Combatant, combatant: Combatant) {
    console.log('~');
    console.log(`${combatant.name} used ${action.name} on ${target.name}`);
  }

  updateStats(model: BattleModel): void {
    const { enemies, party } = model;
    enemies.forEach((enemy) =>
      console.log(
        `${enemy.name}: ❤️ ${enemy.health} / ${enemy.maxHealth} |  ☀️ ${enemy.stamina} / ${enemy.maxStamina}`,
      ),
    );
    party.members.forEach((member) =>
      console.log(
        `${member.name}: ❤️ ${member.health} / ${member.maxHealth} |  ☀️ ${member.stamina} / ${member.maxStamina}`,
      ),
    );
  }

  displayBehaviors(behaviors: Behavior[]): void {
    const behaviorTable = behaviors.map((behavior) => ({ name: behavior.action.name, weight: behavior.weight }));
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

  private menuViewsContainer: Element;
  private menuViews: Element[] = [];

  constructor(scene: Battle, battleModel: BattleModel) {
    const { enemies, party } = battleModel;

    // Enemy Display
    const enemy = enemies[0];
    this.enemyHealth = (
      <div>
        ❤️ {enemy.health}/{enemy.maxHealth}
      </div>
    );
    this.enemyStamina = (
      <div>
        ☀️ {enemy.stamina}/{enemy.maxStamina}
      </div>
    );
    this.animeText = <p className={styles.animeText}>Test Text</p>;
    const parallax = (
      <div className={styles.parallax} id="parallax">
        <div className={styles.tvContainer}>
          <div className={styles.staticEffect}>
            <div className={styles.oldTvContent}>
              <div className={styles.enemyUi}>
                {this.enemyHealth}
                {this.enemyStamina}
              </div>
              {this.animeText}
            </div>
          </div>
        </div>
      </div>
    );
    parallax.style.backgroundImage =
      'url(https://raw.githubusercontent.com/oscicen/oscicen.github.io/master/img/depth-3.png), url("/reaper/assets/characters/eji.png"), url("/reaper/assets/backgrounds/pikrepo.jpg")';
    parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';

    // Party Bar Display
    this.partyBar = <div className={styles.partyBar} />;
    party.members.forEach((member, index) => {
      const partyMemberDisplay = (
        <div className={styles.characterCell}>
          {member.name}
          <div>
            ❤️ {member.health}/ {member.maxHealth}
          </div>
          <div>
            ☀️ {member.stamina}/ {member.maxStamina}
          </div>
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
      const actMenuButton = <div className={styles.menuButton}>ACT</div>;
      actMenuButton.addEventListener('click', () => {
        console.log(member);
        this.addMenu(member.options.filter(option => option.isInitialOption).map(option => option.name), scene, 'ACT'); 
      });

      const itemMenuButton = <div className={styles.menuButton}>ITEM</div>;
      itemMenuButton.addEventListener('click', () => {
        console.log(member);
        console.log('clicked item')
      });

      const memberPrimaryMenu = (
        <div className={styles.battleOptions}>
          { actMenuButton }
          { itemMenuButton }
        </div>
      );

      this.partyMemberPrimaryMenus.push(memberPrimaryMenu);
    });
    this.menu = <div className={styles.menu} />;
    this.updatePartyMemberView(scene, battleModel);

    this.menuViewsContainer = <div className={ styles.menuViewsContainer } />;

    const container: Element = (
      <div className={styles.container}>
        {parallax}
        {this.menu}
        {this.partyBar}
        {this.menuViewsContainer}
      </div>
    );

    scene.ui.create(container, scene);
    parallax.addEventListener('click', () => scene.updateEnemies()); // for testing purposes
  }

  updateStats: (model: BattleModel) => void;

  updatePartyMemberView(scene: Battle, model: BattleModel) {
    this.menu.replaceChildren(this.partyMemberPrimaryMenus[model.activePartyMemberIndex]);
    this.partyMemberCells.forEach((cell, index) => {
      cell.classList.remove(styles.active);
      if (index === model.activePartyMemberIndex) {
        cell.classList.add(styles.active);
      }
    });
    scene.playButtonClickSound();
  }

  // Handles All additional menus atm. (probably too much responsibility)
  addMenu(options: string[], scene: Battle, header: string, isTargetMenu: boolean = false) {
    const modalMenu = (
      <div className={styles.modalMenu}>
        <div className={styles.modalMenuHeader}> { header } </div>
      </div>
    );
    modalMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    })

    options.forEach(option => {
      const modalMenuOption: Element = (
        <div className={styles.modalMenuOption}>
          { option }
        </div>
      );

      modalMenuOption.addEventListener('click', () => {
        scene.playButtonClickSound();

        if (isTargetMenu) {
          scene.setTarget(option);
          this.closeMenus();
          return;
        }

        const action = scene.getAction(option);
        if (action) {
          scene.setAction(action);
          console.log(action.targetType);
          const targets = scene.getTargets();
          const IS_TARGET_MENU = true;
          this.addMenu(targets.map(target => target.name), scene, 'Targets', IS_TARGET_MENU);
          return;
        }
        
        const newOptions = scene.getOptions(option);
        this.addMenu(newOptions, scene, option);
      });

      modalMenu.append(modalMenuOption);
    });

    const modalContainer = (
      <div className={styles.modalContainer}>
        { modalMenu }
      </div>
    );

    this.menuViews.push(modalContainer);

    modalContainer.addEventListener('click', () => {
      this.menuViewsContainer.removeChild(modalContainer);
      this.menuViews.pop();
      scene.playMenuCloseSound();
    });

    modalContainer.style.zIndex = 10 * this.menuViews.length;
    const RIGHT_OFFSET = 10;
    modalMenu.style.right = (30 * (this.menuViews.length-1) + RIGHT_OFFSET) + 'px';
    const BOTTOM_OFFSET = 240;
    modalMenu.style.bottom = (30 * (this.menuViews.length-1) + BOTTOM_OFFSET) + 'px';

    this.menuViewsContainer.appendChild(modalContainer);
  }

  closeMenus() {
    while (this.menuViews.length > 0) {
      const menuView = this.menuViews.pop();
      menuView.remove();
    }
  }
}
