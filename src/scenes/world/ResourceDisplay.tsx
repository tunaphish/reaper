import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './world.module.css';
import {Technique} from '../../model/technique';
import { Ally } from '../../model/ally';

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


export const ResourceDisplay = observer((props: {ally: Ally, onClickCell?: () => void}) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[props.ally.status],
  ];
  
  const baseAP = props.ally.maxActionPoints;
  const totalAP = Math.floor(props.ally.actionPoints);
  const overflowAP = Math.max(0, totalAP - baseAP);

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
          animate={{ height: (Math.abs(props.ally.actionPoints%1) * 100) + '%' }}
          transition={{ duration: 0 }}
        />

        <div className={styles.characterCellContainer}>
          <div style={{ fontSize: '12px' }}>{props.ally.name}</div>
          <div className={styles.meterContainer}>
            <Meter value={props.ally.health} max={props.ally.maxHealth} className={styles.bleedMeter}/>
            <Meter value={props.ally.health-props.ally.bleed} max={props.ally.maxHealth} className={styles.healthMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(props.ally.health)}</div>
          </div>
          <div className={styles.actionPointRow}>
            {Array.from({ length: baseAP }).map((_, i) => (
              <div
                key={`base-${i}`}
                className={[
                  styles.actionPointToken,
                  i < totalAP ? styles.filled : styles.empty,
                ].join(' ')}
              />
            ))}

            {overflowAP > 0 && (
              <div className={styles.overflowRow}>
                {Array.from({ length: overflowAP }).map((_, i) => (
                  <div
                    key={`overflow-${i}`}
                    className={styles.overflowToken}
                  />
                ))}
              </div>
            )}
          </div>
       </div>
    </div>
  )
});