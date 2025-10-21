import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';
import {Technique} from '../../model/technique';

export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[styles.meterBackground, className].join(' ')}>
      <div className={styles.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}

export const TechniqueView = (props: { technique: Technique }) => {
    const { technique } = props;
  
    const getRandomBorderPoint = () => {
      const boxSize = 100;
      const y = Math.random() * boxSize;
      const center = boxSize / 2;
      const heightFactor = 4; // Adjust this for how high the arc is
      const x = heightFactor * (1 - Math.pow((y - center) / center, 2)); // Parabolic formula
      return [x, y];
    }
  
    const style: React.CSSProperties = React.useMemo(() => {
      const [topPos, leftPos] = getRandomBorderPoint();
      const top = `${topPos}%`; 
      const left = `${leftPos}%`;
      return {
        position: 'absolute', 
        top, 
        left,
        transform: "translate(-50%, -50%)",
      }
    }, []);

    return (
      <div style={style}>
        <motion.div
          className={styles.window} 
          style={{ fontSize: '16px' }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
          {technique.name}
        </motion.div>
      </div>
    )
  }

export const TechniqueViewManager = observer(((props: {combatant: Combatant }) => {
  const { combatant } = props;
  return (
    [...combatant.activeTechniques].map((technique) => <TechniqueView key={technique.name} technique={technique} />)      
  )
})); 


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
    <div className={style.join(' ')} onClick={props.onClickCell} 
      style={{ 
        flex: '1',
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr", 
      }}>

        <motion.div 
          className={styles.castingWindow}
          animate={{ height: (Math.abs(props.combatant.actionPoints%1) * 100) + '%' }}
          transition={{ duration: 0 }}
        />

        <div className={styles.characterCellContainer}>
          <div style={{ fontSize: '12px' }}>{props.combatant.name}</div>
          <div className={styles.meterContainer}>
            <Meter value={props.combatant.health} max={props.combatant.maxHealth} className={styles.bleedMeter}/>
            <Meter value={props.combatant.health-props.combatant.bleed} max={props.combatant.maxHealth} className={styles.healthMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(props.combatant.health)}</div>
          </div>
       </div>
       <div className={styles.actionPoints}>
          {Math.floor(props.combatant.actionPoints)}
       </div>
    </div>
  )
});