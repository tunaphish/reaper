import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import styles from './battle.module.css';
import { Battle } from './Battle';
import { DeferredAction } from './BattleStore';

export const ActionView = (props: { action: DeferredAction }): JSX.Element => {
    const { action } = props;
    const left = `${100 - (action.timeTilExecute / action.action.animTimeInMs * 100)}%`;

    const style: React.CSSProperties = {
        position: 'absolute', 
        bottom: action.isEnemyCaster ? '25%' : 0, 
        left,
        transform: "translateX(-50%)",
    }

    return (
      <div style={style}>
        <motion.div
          className={action.isEnemyCaster ? styles.enemyWindow : styles.window} 
          style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 0  }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
          <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
            {action.action.name} on {action.target.name}
          </div>
        </motion.div>
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

export const Timeline = observer((props: { battle: Battle }) => {
    const { battle } = props;
    const { deferredActions } = battle.battleStore;

    return (
        <div className={styles.window} style={{ flex: .3, position: 'relative' }}>
            { deferredActions.map((action) => <ActionView key={action.id} action={action} />)      }
        </div>
    )
});