import { Status } from '../../entities/combatant';
import { TargetType } from '../../entities/action';
import { Option } from '../../entities/party';
import { Action } from '../../entities/action';

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

  // Dialogue logic
  private isAnimatingText = false;

  private actorMessage: any;
  private actorName: any;
  private actorDialogue: any;
  private choices: any;

  constructor(scene: Battle) {
    const { enemies, party } = scene.model;

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
      // disable if dialogue
      if (scene.isBattlePaused) return;
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
    this.updatePartyMemberView(scene);

    this.menuViewsContainer = <div className={styles.menuViewsContainer} />;

    // Dialogue - Alternate Menu 
    this.actorName = <div></div>;
    this.actorDialogue = <p className={styles.actorDialogue}></p>;
    this.actorMessage = (
      <div className={styles.actorMessage}>
        {this.actorName}
        {this.actorDialogue}
      </div>
    );
    this.choices = <div></div>;
    this.switchToDialogueMenu();
  
    const container: Element = (
      <div className={styles.container}>
        {this.battleDisplay}
        {this.menu}
        {this.partyBar}
        {this.menuViewsContainer}
      </div>
    );

    scene.ui.create(container, scene);

    // Dialogue Event Listeners
    this.actorDialogue.addEventListener('animationend', () => {
      this.isAnimatingText = false;
    });

    this.animeText.addEventListener('animationend', () => {
      this.isAnimatingText = false;
    });

    this.actorMessage.addEventListener('click', () => {
      if (this.isAnimatingText) {
        this.animeText.classList?.remove(styles.typeAnimation);
        this.actorDialogue.classList?.remove(styles.typeAnimation);
        this.isAnimatingText = false;
        return;
      }

      scene.advanceLine();
    });
  }

  updateStats(scene: Battle) {
    const model = scene.model;
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

  updatePartyMemberView(scene: Battle) {
    const activePartyMemberIndex = scene.model.activePartyMemberIndex;
    this.menu.replaceChildren(this.partyMemberPrimaryMenus[activePartyMemberIndex]);
    this.partyMemberCells.forEach((cell, index) => {
      cell.classList.remove(styles.active);
      if (index === activePartyMemberIndex) {
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
          this.updatePartyMemberView(scene);
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

            const attackDescription = <div className={styles.attackDescription}>{action.description}</div>;
            this.menu.replaceChildren(attackDescription);

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
      if (isTargetMenu) this.updatePartyMemberView(scene);
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

  updateAnimeText(value: string) {
    this.animeText.innerText = value;
    //work around to trigger CSS animation
    this.isAnimatingText = true;
    this.animeText.classList.remove(styles.typeAnimation);
    this.animeText.offsetWidth;
    this.animeText.classList.add(styles.typeAnimation);
  }

  switchToDialogueMenu() {
    this.closeMenus();
    this.menu.replaceChildren(this.actorMessage); // Overrides battle menu replacement
    this.actorDialogue.innerText = '';
    this.actorName.innerText = '';
  }

  updateMenuText(actor: string, value: string) {
    console.log('roo')
    this.menu.replaceChildren(this.actorMessage);

    console.log(actor);
    console.log(value);
    //work around to trigger CSS animation
    this.isAnimatingText = true;
    this.actorDialogue.classList.remove(styles.typeAnimation);
    this.actorDialogue.offsetWidth;
    this.actorDialogue.classList.add(styles.typeAnimation);
    this.actorName.innerText = actor;
    this.actorDialogue.innerText = value;
  }

  updateMenuChoices(scene: Battle, value: string) {
    this.menu.replaceChildren(this.choices);
    const options = value.split(' ~ ').map((pairs) => {
      const [newScriptKey, displayText] = pairs.split(' * ');
      return { newScriptKey, displayText };
    });

    options.forEach((option) => {
      const optionDiv = <div className={styles.optionDiv}>{option.displayText}</div>;
      this.choices.appendChild(optionDiv);
      optionDiv.addEventListener('click', () => {
        this.menu.replaceChildren(this.actorMessage);
        this.actorDialogue.innerText = '';
        this.actorName.innerText = '';
        scene.updateScript(option.newScriptKey);
      });
    });
  }

}

function isAction(option: Option): option is Action {
  return (option as Action).execute !== undefined;
}
