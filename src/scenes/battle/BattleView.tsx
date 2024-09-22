import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Combatant, Status } from '../../model/combatant';
import { PartyMember, Folder, Option } from '../../model/party';
import { Action } from '../../model/action';

import styles from './battle.module.css';
import { Battle } from './Battle';

const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void}) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  }
  const style = [
    styles.characterCell,
    statusToStylesMap[props.combatant.status]
    // styles.shake,
  ]

  return (
    <div className={style.join(' ')} onClick={props.onClickCell}>
      <div>{props.combatant.name}</div>
      <div>❤️ {Math.ceil(props.combatant.health)}/ {props.combatant.maxHealth}</div>
      <div>☀️ {Math.ceil(props.combatant.stamina)}/ {props.combatant.maxStamina}</div>
      <div>🌙 {Math.ceil(props.combatant.magic)}/ {props.combatant.maxMagic}</div>
    </div>
  )
});

type MenuOption = Folder | Combatant | Action | Option
const MenuView = (props: {folder: Folder, style: React.CSSProperties, battleScene: Battle }) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  return (
    <div className={styles.modalMenu} style={props.style} onClick={onClickMenu}>
      <div className={styles.modalMenuHeader}>{props.folder.name}</div>
      <hr/>
      {props.folder.options.map((option: MenuOption) => {
        const optionText = 'staminaCost' in option ? option.name + ' - ' + option.staminaCost : option.name;
        const onClickOption = () => props.battleScene.selectOption(option);
        return (
          <div key={option.name} onClick={onClickOption}>{optionText}</div>
        )
      })}
    </div>
  );
}

const MenuContainer = observer((props: { menus: Folder[], battleScene: Battle }) => {
  const onClickModalContainer = () => props.battleScene.closeMenu();
  return (
    <div className={styles.menuViewsContainer}>
      {props.menus.map((menu, idx) => {

        const RIGHT_OFFSET = 50;
        const BOTTOM_OFFSET = 150;
        const style: React.CSSProperties = {
          zIndex: 10 * idx,
          right: 30 * (idx - 1) + RIGHT_OFFSET + 'px',
          bottom: 30 * (idx - 1) + BOTTOM_OFFSET + 'px',
        }

        return (
          <div key={idx} className={styles.modalContainer} onClick={onClickModalContainer}>
            <MenuView folder={menu} style={style} battleScene={props.battleScene}/>
          </div>
      )})}
    </div>
  );
}) 

export const BattleView = (props: { scene: Battle }): JSX.Element => {
    const { enemies, party } = props.scene.battleStore;
    const onClickPartyMember = (member: PartyMember) => {
      props.scene.openInitialMenu(member);
    }
    // TODO: update for multiple enemies
    const enemyPortaitStyle: React.CSSProperties = {
      backgroundImage: `url(${enemies[0].imageUrl})`
    }
    const backgroundImageStyle: React.CSSProperties = {
      backgroundImage: `url(${props.scene.backgroundImageUrl})`
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
              <div className={styles.background} style={backgroundImageStyle}/>
                <div className={styles.enemyPortait} style={enemyPortaitStyle}/>
                <p className={styles.animeText} />
              </div>
            </div>
          </div>
    
          <div className={styles.partyBar}>
              {party.members.map((member) => {
                return <ResourceDisplay combatant={member} onClickCell={() => onClickPartyMember(member)} key={member.name}/>
              })}
          </div>
          <MenuContainer menus={props.scene.battleStore.menus} battleScene={props.scene}/>
        </div>
      )
};
