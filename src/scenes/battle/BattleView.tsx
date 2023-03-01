import { Status } from '../../entities/combatant';
import { TargetType } from '../../entities/action';
import { Option } from '../../entities/party';
import { Action } from '../../entities/action';

import { BattleModel } from './battleModel';
import styles from './battle.module.css';
import { createElement } from '../../ui/jsxFactory';
import { Battle } from './Battle';
import { shakeElement } from '../../animations';

export class BattleView {
  private battleDisplay: any;
  private enemyHealth: any;
  private enemyStamina: any;
  private enemyPortrait: any;
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

    const background = <div className={styles.background}/>;
    background.style.backgroundImage = "url('/reaper/assets/backgrounds/pikrepo.jpg')";

    this.enemyPortrait = <div className={styles.enemyPortait}/>
    this.enemyPortrait.style.backgroundImage = "url('/reaper/assets/characters/eji.png')";

    this.animeText = <p className={styles.animeText}>Test Text</p>;
    this.battleDisplay = (
      <div className={styles.tvContainer}>
        <div className={styles.staticEffect}>
          <div className={styles.oldTvContent}>
            {background}
            {this.enemyPortrait}
            <div className={styles.enemyUi}>
              {this.enemyHealth}
              {this.enemyStamina}
            </div>
            {this.animeText}
          </div>
        </div>
      </div>
    );

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
          member.options.filter((option) => option.isInitialOption),
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
        {this.battleDisplay}
        {this.menu}
        {this.partyBar}
        {this.menuViewsContainer}
      </div>
    );

    scene.ui.create(container, scene);


  }

  updateStats(model: BattleModel) {
    const enemy = model.enemies[0];
    // maybe caching?
    this.enemyHealth.innerText = `❤️ ${Math.trunc(enemy.health)}/${enemy.maxHealth}`;
    this.enemyStamina.innerText = `☀️ ${Math.trunc(enemy.stamina)}/${enemy.maxStamina}`;

    for (let i = 0; i < model.party.members.length; i++) {
      this.partyMemberHealthViews[i].innerText = `❤️ ${Math.trunc(model.party.members[i].health)}/${
        model.party.members[i].maxHealth
      }`;
      this.partyMemberStaminaViews[i].innerText = `☀️ ${Math.trunc(model.party.members[i].stamina)}/${
        model.party.members[i].maxStamina
      }`;
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
  addMenu(options: Option[], scene: Battle, header: string, isTargetMenu = false) {
    const modalMenu = (
      <div className={styles.modalMenu}>
        <div className={styles.modalMenuHeader}> {header} </div>
      </div>
    );
    modalMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    options.forEach((option) => {
      let modalMenuOption: Element;

      // Target
      if (isTargetMenu) {
        modalMenuOption = <div className={styles.modalMenuOption}>{option.name}</div>;
        modalMenuOption.addEventListener('click', () => {
          scene.playButtonClickSound();
          scene.setTargets(option.name);
          this.closeMenus();
          return;
        });
      }

      // Action 
      else if (isAction(option)) {
        const action = (option as Action);
        modalMenuOption = <div className={styles.modalMenuOption}>{ `${option.name} - ${action.staminaCost}`}</div>;

        modalMenuOption.addEventListener('click', () => {
          scene.playButtonClickSound();
            scene.setAction(action);
            const targets = scene.getTargets();
            if (action.targetType === TargetType.SELF || action.targetType === TargetType.ALL) {
              this.closeMenus();
              scene.setTargets(null);
              return;
            }
  
            const IS_TARGET_MENU = true;
            this.addMenu(
              targets.map((target) => ({ name: target.name })),
              scene,
              'Targets',
              IS_TARGET_MENU,
            );
            return;
        });
      }
      
      else { // is option
        modalMenuOption = <div className={styles.modalMenuOption}>{option.name}</div>;
        modalMenuOption.addEventListener('click', () => {
          scene.playButtonClickSound();
          const newOptions = scene.getOptions(option);
          this.addMenu(newOptions, scene, option.name);
        });
      }

      modalMenuOption.setAttribute('data-text', modalMenuOption.innerHTML);
      const emotions = scene.getEmotionStyleKeys();
      emotions.forEach(emotion => {
        if (emotion === 'anger') {
          this.shakeText(modalMenuOption);
          return;
        }
        modalMenuOption.classList.add(styles[emotion]);
      });
      console.log(emotions);

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
    shakeElement(this.enemyPortrait);
  }

  shakePartyMember(partyMemberIndex: number): void {
    shakeElement(this.partyMemberCells[partyMemberIndex]);
  }

  shakeText(element: Element) {
    element.innerHTML = element.innerHTML.split('').map(function(element){
      return '<div>' + element + '</div>';
    }).join('');
    for (let i = 0; i < element.children.length; i++) {
      const child: any = element.children[i];
      child.style.display = 'inline-block';
      shakeElement(child, Infinity, false);
    }
    
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

  displayEffectOnEnemy(effectKeyName: string): void {
    const effect = <div className={styles.effect} />
    effect.style.backgroundImage = `url("/reaper/assets/effects/${effectKeyName}")`;
    this.enemyPortrait.appendChild(effect)
    setTimeout(function () {
      effect.remove();
    }, 1000)    
  }

  displayEffectOnMember(partyMemberIndex: number, effectKeyName: string): void {
    const effect = <div className={styles.effect} />
    effect.style.backgroundImage = `url("/reaper/assets/effects/${effectKeyName}")`;
    this.partyMemberCells[partyMemberIndex].appendChild(effect)
    setTimeout(function () {
      effect.remove();
    }, 1000)    
  }
}

function isAction(option: Option): option is Action {
  return (option as Action).execute !== undefined;
}
