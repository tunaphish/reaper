import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';

export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[styles.meterBackground, className].join(' ')}>
      <div className={styles.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}


export const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[props.combatant.status],
  ];



  return (
    <div style={{ flex: '1' }}>
      <div className={style.join(' ')} onClick={props.onClickCell} 
        style={{ 
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr", 
        }}>
        <div className={styles.characterCellContainer}>
          <div className={styles.windowName}>{props.combatant.name}</div>
          <div className={styles.resourceContainer}>
            <div className={styles.meterContainer}>
              <Meter value={props.combatant.health} max={props.combatant.maxHealth} className={styles.bleedMeter}/>
              <Meter value={props.combatant.health-props.combatant.bleed} max={props.combatant.maxHealth} className={styles.healthMeter}/>
              <div className={styles.meterNumber}>{Math.ceil(props.combatant.health)}</div>
            </div>
            <div className={styles.meterContainer}>
              <Meter value={props.combatant.stamina < 0 ? 0 : props.combatant.stamina } max={props.combatant.maxStamina} className={styles.staminaMeter}/>
              <div className={styles.meterNumber}>{Math.ceil(props.combatant.stamina)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});