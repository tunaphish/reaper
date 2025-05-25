import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';
import { Ally } from '../../model/ally';

export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[styles.meterBackground, className].join(' ')}>
      <div className={styles.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}

// export const ActionView = (props: { action: DeferredAction }) => {
//     const { action } = props;
  
//     const getRandomBorderPoint = () => {
//       const boxSize = 100;
//       const y = Math.random() * boxSize;
//       const center = boxSize / 2;
//       const heightFactor = 4; // Adjust this for how high the arc is
//       const x = heightFactor * (1 - Math.pow((y - center) / center, 2)); // Parabolic formula
//       return [x, y];
//     }
  
//     const style: React.CSSProperties = React.useMemo(() => {
//       const [topPos, leftPos] = getRandomBorderPoint();
//       const top = `${topPos}%`; 
//       const left = `${leftPos}%`;
//       return {
//         position: 'absolute', 
//         top, 
//         left,
//         transform: "translate(-50%, -50%)",
//       }
//     }, []);

//     return (
//       <div style={style}>
//         <motion.fieldset
//           className={action.isEnemyCaster ? styles.enemyWindow : styles.window} 
//           style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
//           initial={{ scaleY: 0 }} 
//           animate={{ scaleY: 1 }} 
//           exit={{ scaleY: 0 }}
//           transition={{ duration: .1, ease: 'easeOut' }} 
//         >
//           <Meter value={action.timeTilExecute} max={action.action.animTimeInMs}/>
//           <legend style={{ fontSize: '12px' }}>{action.caster.name}</legend>
//           <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
//             {action.action.name}
//           </div>
//         </motion.fieldset>
//         <div className={styles.reactionContainer}>
//           {
//             action.reactions.map((reaction, idx) => 
//               <motion.div 
//               className={action.isEnemyCaster ? styles.window : styles.enemyWindow } // bug here, need to include correct color.... potentially this ui might suck lol 
//               style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
//               initial={{ scaleY: 0 }} 
//               animate={{ scaleY: 1 }} 
//               exit={{ scaleY: 0 }}
//               transition={{ duration: .1, ease: 'easeOut' }} 
//               key={idx}
//             >
//               <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
//                 {reaction.name}
//               </div>
//             </motion.div>
//             )
//           }
//         </div>
//       </div>
//     )
//   }



export const ResourceDisplay = observer((props: {ally: Ally, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[props.ally.status],
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
          <div className={styles.windowName}>{props.ally.name}</div>
          <div className={styles.resourceContainer}>
            <div className={styles.meterContainer}>
              <Meter value={props.ally.health} max={props.ally.maxHealth} className={styles.bleedMeter}/>
              <Meter value={props.ally.health-props.ally.bleed} max={props.ally.maxHealth} className={styles.healthMeter}/>
              <div className={styles.meterNumber}>{Math.ceil(props.ally.health)}</div>
            </div>
            <div className={styles.meterContainer}>
              <Meter value={props.ally.stamina < 0 ? 0 : props.ally.stamina } max={props.ally.maxStamina} className={styles.staminaMeter}/>
              <div className={styles.meterNumber}>{Math.ceil(props.ally.stamina)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});