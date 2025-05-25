import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';


import styles from './battle.module.css';
import { Battle } from './Battle';
import {  EnemyResourceDisplay } from './Stage';
import { ResourceDisplay } from './ResourceDisplay';
import { Action } from '../../model/action';


const MenuActionView = (props: { action: Action, battleScene: Battle }) => {
  const { action } = props;
  const onClickaction = () => props.battleScene.selectAction(action);
  
  return ( 
    <button key={action.name} onClick={onClickaction} className={styles.menuOption} >
        <div>{action.name}</div>
        <div className={styles.optionCost}>{action.staminaCost}</div>
    </button>
  )
}

const MenuView = observer((props: { battleScene: Battle }) => {
  const { battleScene } = props;
  const { menu } = battleScene.battleStore;
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  return (
      <div className={styles.modalMenu} onClick={onClickMenu}>
        <div className={styles.window} 
          style={{ 
            minWidth: "100px",
            width:" 100%",
          }}
        >
        <div className={styles.windowName}>{menu.name}</div>
        <div className={styles.menuContent}>
          {
            menu.actions.map((action: Action) => <MenuActionView key={action.name} action={action} battleScene={props.battleScene}/>)
          }
        </div>
        </div>

    </div>

  );    
});

const QueueView = observer((props: { battleScene: Battle}) => {
  if (props.battleScene.battleStore.queue.length === 0) return null;
  
  const onClickCancelQueue = () => {
    props.battleScene.cancelQueue();
  }

  const onClickConfirmQueue = () => {
    props.battleScene.confirmQueue();
  }

  return (
    <div className={styles.queueContainer}>
      <div className={styles.actionContainer}>
        {
          props.battleScene.battleStore.queue.map((queueAction, idx) => {
            return (
                <motion.fieldset
                  className={styles.window}
                  key={idx} 
                  style={{padding: 0}}
                  initial={{ scaleY: 0 }} 
                  animate={{ scaleY: 1 }} 
                  exit={{ scaleY: 0 }}
                  transition={{ duration: .1, ease: 'easeOut' }} 
              
                >
                  <legend style={{ fontSize: '12px' }}>{queueAction.caster.name}</legend>
                  <div style={{ padding: 5, gridColumn: 1, gridRow: 1, fontSize: '16px' }}>
                    {queueAction.action.name}
                  </div>
                </motion.fieldset>
            )
          })
        }
      </div>


      <div className={styles.queueOperations}>
        <div className={styles.window} onClick={onClickCancelQueue}>Cancel</div>
        <div className={styles.window} onClick={onClickConfirmQueue}>Confirm</div>
      </div>
    </div>
  )
})

const MenuContainer = observer((props: { battleScene: Battle }) => {

  const variants: Variants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: {
      opacity: 0,
      x: "-5%",
    },    
  }

  if (!props.battleScene.battleStore.menu) return null;

  return (
    <motion.div 
      className={styles.modalContainer} 
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <QueueView battleScene={props.battleScene} />
      <MenuView battleScene={props.battleScene} />
    </motion.div>        
  ) 
}) 


export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { allies, enemies } = props.scene.battleStore;
    const onClickAlly = (ally: Ally) => {
      props.scene.setCaster(ally);
    }

    return (
        <div className={styles.container}>
          {/* <Description battle={props.scene} /> */}
          <div className={styles.combatantBar}>
              {enemies.map((enemy) => {
                return( 
                  <div style={{ position: 'relative', flex: '1' }} key={enemy.name}>
                    <EnemyResourceDisplay battleScene={props.scene} combatant={enemy} />
                  </div>
                )
              })}
          </div>
          <div style={{ flex: 4, zIndex: -1 }}> 
            {/* <Stage scene={props.scene} /> */}
          </div>
          <MenuContainer battleScene={props.scene}/>
          <div className={styles.combatantBar}>
              {allies.map((ally) => {
                return( 
                  <div style={{ position: 'relative', flex: '1' }} key={ally.name}>
                    <ResourceDisplay battleScene={props.scene} ally={ally} onClickCell={() => onClickAlly(ally)} key={ally.name}/>
                  </div>
                )
              })}
          </div>
 
        </div>
      )
});
