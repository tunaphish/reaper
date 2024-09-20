import * as React from 'react';
import { Scene } from 'phaser';
import { observer } from 'mobx-react-lite';

import { Combatant, Status } from '../../model/combatant';
import { TargetType } from '../../model/action';
import { Option, PartyMember } from '../../model/party';
import { Action } from '../../model/action';

import styles from './battle.module.css';
import { Battle, BattleStore } from './Battle';
import { shakeElement } from '../../animations';


const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void}) => {
  return (
    <div className={styles.characterCell} onClick={props.onClickCell}>
      <div>{props.combatant.name}</div>
      <div>❤️ {Math.ceil(props.combatant.health)}/ {props.combatant.maxHealth}</div>
      <div>☀️ {Math.ceil(props.combatant.stamina)}/ {props.combatant.maxStamina}</div>
      <div>🌙 {Math.ceil(props.combatant.magic)}/ {props.combatant.maxMagic}</div>
    </div>
  )
});

export const BattleView = (props: { scene: Battle }) => {
    const { enemies, party } = props.scene.battleStore;
    const onClickPartyMember = (member: PartyMember) => {
      props.scene.openInitialMenu(member);
    }
    return (
        <div className={styles.container}>
          <div className={styles.partyBar}>
            {enemies.map((enemy) => {
              return <ResourceDisplay combatant={enemy} key={enemy.name} />
            })}
        </div>
  
        <div className={styles.tvContainer}>
          <div className={styles.staticEffect}>
            <div className={styles.oldTvContent}>
            <div className={styles.background} />
              <div className={styles.enemyPortait} />
              <p className={styles.animeText} />
            </div>
          </div>
        </div>
  
        <div className={styles.partyBar}>
            {party.members.map((member) => {
              return <ResourceDisplay combatant={member} onClickCell={() => onClickPartyMember(member)} key={member.name}/>
            })}
        </div>
        <div className={styles.menuViewsContainer} />
        </div>
      )
};

        /* background.style.backgroundImage = "url('/reaper/assets/backgrounds/pikrepo.jpg')";
        enemyPortrait.style.backgroundImage = "url('/reaper/assets/characters/eji.png')"; */

    // Menu Display (Dependency on Party Bar for Setting Active Cell);
    // party.members.forEach((member) => {
    //   const actMenuButton = ;
    //   actMenuButton.addEventListener('click', () => {
    //     scene.playButtonClickSound();
    //     this.addMenu(
    //       scene,
    //       'ACT',
    //     );
    //   });




  // // Handles All additional menus atm. (probably too much responsibility)
  // addMenu(options: Option[], scene: Battle, header: string, isTargetMenu = false) {
  //   const modalMenu = (
  //     <div className={styles.modalMenu}>
  //       <div className={styles.modalMenuHeader}> {header} </div>
  //     </div>
  //   );
  //   modalMenu.addEventListener('click', (event) => {
  //     event.stopPropagation();
  //   });

  //   options.forEach((option) => {
  //     let modalMenuOption: Element;

  //     // Target
  //     if (isTargetMenu) {
  //       modalMenuOption = <div className={styles.modalMenuOption}>{option.name}</div>;
  //       modalMenuOption.addEventListener('click', () => {
  //         scene.playButtonClickSound();
  //         scene.setTargets(option.name);
  //         this.closeMenus();
  //         this.updatePartyMemberView(scene);
  //         return;
  //       });
  //     }

  //     // Action
  //     else if (isAction(option)) {
  //       const action = option as Action;
  //       modalMenuOption = <div className={styles.modalMenuOption}>{`${option.name} - ${action.staminaCost}`}</div>;

  //       modalMenuOption.addEventListener('click', () => {
  //         scene.playButtonClickSound();
  //         scene.setAction(action);
  //         const targets = scene.getTargets();
  //         if (action.targetType === TargetType.SELF || action.targetType === TargetType.ALL) {
  //           this.closeMenus();
  //           scene.setTargets(null);
  //           return;
  //         }

  //         const IS_TARGET_MENU = true;
  //         this.addMenu(
  //           targets.map((target) => ({ name: target.name })),
  //           scene,
  //           'Targets',
  //           IS_TARGET_MENU,
  //         );

  //         const attackDescription = <div className={styles.attackDescription}>{action.description}</div>;
  //         this.menu.replaceChildren(attackDescription);

  //         return;
  //       });
  //     } else {
  //       // is option
  //       modalMenuOption = <div className={styles.modalMenuOption}>{option.name}</div>;
  //       modalMenuOption.addEventListener('click', () => {
  //         scene.playButtonClickSound();
  //         const newOptions = scene.getOptions(option);
  //         this.addMenu(newOptions, scene, option.name);
  //       });
  //     }

  //     modalMenuOption.setAttribute('data-text', modalMenuOption.innerHTML);
  //     modalMenu.append(modalMenuOption);
  //   });

  //   const modalContainer = <div className={styles.modalContainer}>{modalMenu}</div>;

  //   this.menuViews.push(modalContainer);

  //   modalContainer.addEventListener('click', () => {
  //     this.menuViewsContainer.removeChild(modalContainer);
  //     this.menuViews.pop();
  //     scene.playMenuCloseSound();
  //     if (isTargetMenu) this.updatePartyMemberView(scene);
  //   });

  //   modalContainer.style.zIndex = 10 * this.menuViews.length;
  //   const RIGHT_OFFSET = 10;
  //   modalMenu.style.right = 30 * (this.menuViews.length - 1) + RIGHT_OFFSET + 'px';
  //   const BOTTOM_OFFSET = 240;
  //   modalMenu.style.bottom = 30 * (this.menuViews.length - 1) + BOTTOM_OFFSET + 'px';

  //   this.menuViewsContainer.appendChild(modalContainer);
  // }

  // closeMenus(): void {
  //   while (this.menuViews.length > 0) {
  //     const menuView = this.menuViews.pop();
  //     menuView.remove();
  //   }
  // }

  // shakeEnemy(): void {
  //   shakeElement(this.enemyPortrait);
  // }

  // shakePartyMember(partyMemberIndex: number): void {
  //   shakeElement(this.partyMemberCells[partyMemberIndex]);
  // }

  // shakeText(element: Element) {
  //   element.innerHTML = element.innerHTML
  //     .split('')
  //     .map(function (element) {
  //       return '<div>' + element + '</div>';
  //     })
  //     .join('');
  //   for (let i = 0; i < element.children.length; i++) {
  //     const child: any = element.children[i];
  //     child.style.display = 'inline-block';
  //     shakeElement(child, Infinity, false);
  //   }
  // }

  // setPartyMemberStatus(memberIndex: number, member: PartyMember) {
  //   const cell = this.partyMemberCells[memberIndex];
  //   switch (member.status) {
  //     case Status.BLOCKING:
  //       cell.style.border = '1px solid green';
  //       cell.style.color = 'green';
  //       break;
  //     case Status.DEAD:
  //       cell.style.border = '1px solid red';
  //       cell.style.color = 'gray';
  //       break;
  //     case Status.EXHAUSTED:
  //       cell.style.border = '1px solid purple';
  //       cell.style.color = 'purple';
  //       break;
  //     default:
  //       cell.style.border = '';
  //       cell.style.color = '';
  //       break;
  //   }
  // }

  // displayEffectOnEnemy(effectKeyName: string): void {
  //   const effect = <div className={styles.effect} />;
  //   effect.style.backgroundImage = `url("/reaper/assets/effects/${effectKeyName}")`;
  //   // TODO: Multiple enemies
  //   this.enemyCells[0].appendChild(effect);
  //   setTimeout(function () {
  //     effect.remove();
  //   }, 1000);
  // }

  // displayEffectOnMember(partyMemberIndex: number, effectKeyName: string): void {
  //   const effect = <div className={styles.effect} />;
  //   effect.style.backgroundImage = `url("/reaper/assets/effects/${effectKeyName}")`;
  //   this.partyMemberCells[partyMemberIndex].appendChild(effect);
  //   setTimeout(function () {
  //     effect.remove();
  //   }, 1000);
  // }

  // updateAnimeText(value: string) {
  //   this.animeText.innerText = value;
  // }


// function isAction(option: Option): option is Action {
//   return (option as Action).execute !== undefined;
// }
