import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Combatant } from '../../model/combatant';
import { Option, PartyMember } from '../../model/party';

import styles from './battle.module.css';
import { Battle } from './Battle';

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

const MenuView = (props: {options: Option[], style: React.CSSProperties}) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation();

  return (
    <div className={styles.modalMenu} style={props.style} onClick={onClickMenu}>
      <div className={styles.modalMenuHeader}>temp header</div>
      {props.options.map((option) => (
        <div key={option.name}>{option.name}</div>
      ))}
    </div>
  );
}

const MenuContainer = observer((props: { menus, battleScene: Battle }) => {
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
          <div className={styles.modalContainer} onClick={onClickModalContainer}>
            <MenuView options={menu} key={idx} style={style} />
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
       <MenuContainer menus={props.scene.battleStore.menus} battleScene={props.scene}/>
        </div>
      )
};
