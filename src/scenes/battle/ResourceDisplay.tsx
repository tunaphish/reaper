import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';
import { DeferredAction } from './BattleStore';

const ActionView = (props: { action: DeferredAction }) => {
    const { action } = props;
  
    const getRandomBorderPoint = () => {
      const boxSize = 100;
      const side = Math.floor(Math.random() * 4);  
  
      switch (side) {
        case 0: // Top edge
          return [Math.random() * boxSize, 0];
        case 1: // Right edge
          return [boxSize, Math.random() * boxSize];
        case 2: // Bottom edge
          return [Math.random() * boxSize, boxSize];
        case 3: // Left edge
          return [0, Math.random() * boxSize];
      }
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
          className={styles.window} 
          style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
          <motion.div 
            className={styles.actionWindow}
            animate={{ width: Math.min(Math.round(action.timeTilExecute / (action.action.animTimeInMs || 1) * 100), 100) + "%"  }}
            transition={{ duration: 0 }}
          />
          <legend style={{ fontSize: '12px' }}>{action.caster.name}</legend>
          <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
            {action.action.name}
          </div>
        </motion.fieldset>
        <div className={styles.reactionContainer}>
          {
            action.reactions.map((reaction, idx) => 
              <img src='/reaper/assets/ui/icons/magic.png' className={styles.reaction}key={idx} />
            )
          }
        </div>
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
  
    const actionsDirectedAtCombatant = props.battleScene.battleStore.deferredActions.filter(action => action.target.name === props.combatant.name);
    
    const juggleWidth = {
      width: `${props.combatant.juggleDuration * .1}px`
    }
  
    return (
      <div style={{ position: 'relative' }}>
        {
          actionsDirectedAtCombatant.map((action) => <ActionView key={action.id} action={action} />)
        }
        <div className={style.join(' ')} onClick={props.onClickCell} 
          style={{ 
            aspectRatio: 1, 
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",  
          }}>
          <motion.div 
            className={styles.castingWindow}
            animate={{ height: props.combatant.status === Status.CASTING ? Math.min(Math.round(props.combatant.timeInStateInMs / props.combatant.queuedOption.castTimeInMs * 100), 100) + "%" : 0  }}
            transition={{ duration: 0 }}
          />
          <div className={styles.characterCellContainer}>
            <div className={styles.windowName}>{props.combatant.name}</div>
            <div className={styles.resourceContainer}>
              <div className={styles.meterContainer}>
                <meter className={styles.bleedMeter} min={0} value={props.combatant.health} max={props.combatant.maxHealth}></meter>
                <meter className={styles.healthMeter} min={0} value={props.combatant.health-props.combatant.bleed} max={props.combatant.maxHealth}></meter>
                <div className={styles.meterNumber}>{Math.ceil(props.combatant.health)}</div>
              </div>
              <div className={styles.meterContainer}>
                <meter className={styles.staminaMeter} min={0} value={props.combatant.stamina} max={props.combatant.maxStamina}></meter>
                <div className={styles.meterNumber}>{Math.ceil(props.combatant.stamina)}</div>
              </div>
              <div className={styles.meterContainer}>
                <meter className={styles.magicMeter} min={0} value={props.combatant.magic} max={props.combatant.maxMagic}></meter>
                <div className={styles.meterNumber}>{Math.ceil(props.combatant.magic)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.juggleMeter} style={juggleWidth}/>
      </div>
  
    )
  });