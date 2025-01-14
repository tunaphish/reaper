import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';
import { DeferredAction } from './BattleStore';

export const Meter = (props: { value: number, max: number, className?: string }): JSX.Element => {
  const { className, value, max } = props;

  return (
    <div className={[styles.meterBackground, className].join(' ')}>
      <div className={styles.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}

export const ActionView = (props: { action: DeferredAction }): JSX.Element => {
    const { action } = props;
  
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
        <motion.fieldset
          className={action.isEnemyCaster ? styles.enemyWindow : styles.window} 
          style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
          <Meter value={action.timeTilExecute} max={action.action.animTimeInMs}/>
          <legend style={{ fontSize: '12px' }}>{action.caster.name}</legend>
          <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
            {action.action.name}
          </div>
        </motion.fieldset>
        <div className={styles.reactionContainer}>
          {
            action.reactions.map((reaction, idx) => 
              <motion.div 
              className={action.isEnemyCaster ? styles.window : styles.enemyWindow } // bug here, need to include correct color.... potentially this ui might suck lol 
              style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
              initial={{ scaleY: 0 }} 
              animate={{ scaleY: 1 }} 
              exit={{ scaleY: 0 }}
              transition={{ duration: .1, ease: 'easeOut' }} 
              key={idx}
            >
              <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
                {reaction.name}
              </div>
            </motion.div>
            )
          }
        </div>
      </div>
    )
  }

export const ActionsViewManager = observer(((props: {combatant: Combatant, battleScene: Battle }) => {
  const { combatant, battleScene } = props;
  const actionsDirectedAtCombatant = battleScene.battleStore.deferredActions.filter(action => action.target.name === combatant.name);
  return (
    actionsDirectedAtCombatant.map((action) => <ActionView key={action.id} action={action} />)      
  )
})); 

