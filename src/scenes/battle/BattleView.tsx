import { BattleModel } from './battleModel';
import styles from './battle.module.css';
import { createElement } from '../../ui/jsxFactory';
import { Battle } from './Battle';
import { shakeElement } from '../../animations';
import { Status } from '../../entities/combatant';
import { TargetType } from '../../entities/action';

export class BattleView {
  private parallax: any;
  private enemyHealth: any;
  private enemyStamina: any;
  private animeText: any;
  private menu: Element;

  private partyMemberPrimaryMenus: Element[] = [];

  private partyMemberCells: Element[] = [];
  private partyMemberHealthViews: any[] = [];
  private partyMemberStaminaViews: any[] = [];
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
    this.parallax = (
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
    this.parallax.style.backgroundImage =
      'url(https://raw.githubusercontent.com/oscicen/oscicen.github.io/master/img/depth-3.png), url("/reaper/assets/characters/eji.png"), url("/reaper/assets/backgrounds/pikrepo.jpg")';
    this.parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';

    // Party Bar Display
    this.partyBar = <div className={styles.partyBar} />;
    party.members.forEach((member, index) => {
      const memberHealthView = (
        <div>
          ❤️ {member.health}/ {member.maxHealth}
        </div>
      );
      const memberStaminaView = (
        <div>
          ☀️ {member.stamina}/ {member.maxStamina}
        </div>
      );

      const partyMemberDisplay = (
        <div className={styles.characterCell}>
          {member.name}
          {memberHealthView}
          {memberStaminaView}
        </div>
      );

      partyMemberDisplay.addEventListener('click', () => {
        if (scene.getMemberStatus(index) === Status.DEAD) {
          scene.playBadOptionSound();
          return;
        }
        scene.playButtonClickSound();
        scene.setActivePartyMember(index);
      });
      this.partyBar.appendChild(partyMemberDisplay);
      this.partyMemberCells.push(partyMemberDisplay);
      this.partyMemberHealthViews.push(memberHealthView);
      this.partyMemberStaminaViews.push(memberStaminaView);
    });

    // Menu Display (Dependency on Party Bar for Setting Active Cell);
    party.members.forEach((member) => {
      const actMenuButton = <div className={styles.menuButton}>ACT</div>;
      actMenuButton.addEventListener('click', () => {
        scene.playButtonClickSound();
        this.addMenu(
          member.options.filter((option) => option.isInitialOption).map((option) => option.name),
          scene,
          'ACT',
        );
      });

      const itemMenuButton = <div className={styles.menuButton}>ITEM</div>;
      itemMenuButton.addEventListener('click', () => {
        console.log(member);
        console.log('clicked item');
      });

      const memberPrimaryMenu = (
        <div className={styles.battleOptions}>
          {actMenuButton}
          {itemMenuButton}
        </div>
      );

      this.partyMemberPrimaryMenus.push(memberPrimaryMenu);
    });
    this.menu = <div className={styles.menu} />;
    this.updatePartyMemberView(scene, battleModel);

    this.menuViewsContainer = <div className={styles.menuViewsContainer} />;

    const container: Element = (
      <div className={styles.container}>
        {this.parallax}
        {this.menu}
        {this.partyBar}
        {this.menuViewsContainer}
      </div>
    );

    scene.ui.create(container, scene);

    // for testing purposes
    this.parallax.addEventListener('click', () => {
      scene.updateEnemies()
    }); 
  }

  updateStats(model: BattleModel) {
    const enemy = model.enemies[0];
    // maybe caching?
    this.enemyHealth.innerText = `❤️ ${Math.trunc(enemy.health)}/${enemy.maxHealth}`;
    this.enemyStamina.innerText = `☀️ ${Math.trunc(enemy.stamina)}/${enemy.maxStamina}`;

    for (let i = 0; i < model.party.members.length; i++) {
      this.partyMemberHealthViews[
        i
      ].innerText = `❤️ ${Math.trunc(model.party.members[i].health)}/${model.party.members[i].maxHealth}`;
      this.partyMemberStaminaViews[
        i
      ].innerText = `☀️ ${Math.trunc(model.party.members[i].stamina)}/${model.party.members[i].maxStamina}`;
    }
  }

  updatePartyMemberView(scene: Battle, model: BattleModel) {
    this.menu.replaceChildren(this.partyMemberPrimaryMenus[model.activePartyMemberIndex]);
    this.partyMemberCells.forEach((cell, index) => {
      cell.classList.remove(styles.active);
      if (index === model.activePartyMemberIndex) {
        cell.classList.add(styles.active);
      }
    });
  }

  // Handles All additional menus atm. (probably too much responsibility)
  addMenu(options: string[], scene: Battle, header: string, isTargetMenu = false) {
    const modalMenu = (
      <div className={styles.modalMenu}>
        <div className={styles.modalMenuHeader}> {header} </div>
      </div>
    );
    modalMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    options.forEach((option) => {
      const modalMenuOption: Element = <div className={styles.modalMenuOption}>{option}</div>;

      modalMenuOption.addEventListener('click', () => {
        scene.playButtonClickSound();

        if (isTargetMenu) {
          scene.setTargets(option);
          this.closeMenus();
          return;
        }

        const action = scene.getAction(option);
        if (action) {
          scene.setAction(action);
          const targets = scene.getTargets();
          if (action.targetType === TargetType.SELF || action.targetType === TargetType.ALL) {
            this.closeMenus();
            scene.setTargets(null);
            return;
          }

          const IS_TARGET_MENU = true;
          this.addMenu(
            targets.map((target) => target.name),
            scene,
            'Targets',
            IS_TARGET_MENU,
          );
          return;
        }

        const newOptions = scene.getOptions(option);
        this.addMenu(newOptions, scene, option);
      });

      modalMenu.append(modalMenuOption);
    });

    const modalContainer = <div className={styles.modalContainer}>{modalMenu}</div>;

    this.menuViews.push(modalContainer);

    modalContainer.addEventListener('click', () => {
      this.menuViewsContainer.removeChild(modalContainer);
      this.menuViews.pop();
      scene.playMenuCloseSound();
    });

    modalContainer.style.zIndex = 10 * this.menuViews.length;
    const RIGHT_OFFSET = 10;
    modalMenu.style.right = 30 * (this.menuViews.length - 1) + RIGHT_OFFSET + 'px';
    const BOTTOM_OFFSET = 240;
    modalMenu.style.bottom = 30 * (this.menuViews.length - 1) + BOTTOM_OFFSET + 'px';

    this.menuViewsContainer.appendChild(modalContainer);
  }

  closeMenus(): void {
    while (this.menuViews.length > 0) {
      const menuView = this.menuViews.pop();
      menuView.remove();
    }
  }

  shakeEnemy(): void {
    shakeElement(this.parallax);
  };

  shakePartyMember(partyMemberIndex: number): void {
    shakeElement(this.partyMemberCells[partyMemberIndex]);
  }

  setPartyMemberCellDead(memberIndex: number): void {
    this.partyMemberCells[memberIndex].classList.remove(styles.characterCellExhausted);
    this.partyMemberCells[memberIndex].classList.add(styles.characterCellDead);
  }

  setPartyMemberCellExhausted(memberIndex: number): void {
    this.partyMemberCells[memberIndex].classList.remove(styles.characterCellDead);
    this.partyMemberCells[memberIndex].classList.add(styles.characterCellExhausted);
  }

  setPartyMemberCellNormal(memberIndex: number): void {
    this.partyMemberCells[memberIndex].classList.remove(styles.characterCellDead);
    this.partyMemberCells[memberIndex].classList.remove(styles.characterCellExhausted);
  }
}
