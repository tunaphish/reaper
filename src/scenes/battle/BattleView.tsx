import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';


import classNames from './battle.module.css';
import { Battle } from './Battle';
import {  EnemyResourceDisplay } from './Stage';
import { Meter } from './Meter';
import { Action } from '../../model/action';
import { Status } from '../../model/combatant';
import { ActionMenu, MenuType, TargetMenu } from './menu';
import { Enemy } from '../../model/enemy';


const MenuActionView = (props: { action: Action, battleScene: Battle }) => {
  const { action } = props;
  const onClickAction = () => props.battleScene.selectAction(action);
  
  return ( 
    <button key={action.name} onClick={onClickAction} className={classNames.menuOption} >
        <div>{action.name}</div>
        <div className={classNames.optionCost}>{action.staminaCost}</div>
    </button>
  )
}

const MenuTargetView = (props: { target: Enemy, battleScene: Battle }) => {
  const { target } = props;
  const onClickTarget = () => props.battleScene.selectTarget(target);
  
  return ( 
    <button key={target.name} onClick={onClickTarget} className={classNames.menuOption} >
        <div>{target.name}</div>
    </button>
  )
}

const MenuCategoryListView = (props: { battleScene: Battle}) => {
  const { battleScene } = props;
  return (
    <>
      <button onClick={() => battleScene.selectAttack()} className={classNames.menuOption}><div>Attack</div></button>
      <button onClick={() => battleScene.selectDefend()} className={classNames.menuOption}><div>Defend</div></button>
      <button className={classNames.menuOption} disabled><div>Item</div></button>
    </>
  )
}

const MenuView = observer((props: { battleScene: Battle }) => {
  const { battleScene } = props;
  const { menu } = battleScene.battleStore;
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  return (
      <div className={classNames.modalMenu} onClick={onClickMenu}>
        <div className={classNames.window} 
          style={{ 
            minWidth: "100px",
            width:" 100%",
          }}
        >
        <div className={classNames.windowName}>{menu.name}</div>
        <div className={classNames.menuContent}>
          {
            menu.type === MenuType.ACTION && (menu as ActionMenu).actions.map((action: Action) => <MenuActionView key={action.name} action={action} battleScene={props.battleScene}/>)
          }
          {
            menu.type === MenuType.TARGET && (menu as TargetMenu).targets.map((target: Enemy) => <MenuTargetView key={target.name} target={target} battleScene={props.battleScene}/>)
          }
          {
            menu.type === MenuType.CATEGORY && <MenuCategoryListView battleScene={battleScene} />
          }
        </div>
        </div>

    </div>

  );    
});

const QueueView = observer((props: { battleScene: Battle}) => {
  const onClickCancelQueue = () => {
    props.battleScene.cancelQueue();
  }

  const onClickConfirmQueue = () => {
    props.battleScene.confirmQueue();
  }

  return (
    <div className={classNames.queueContainer}>
      <div className={classNames.actionContainer}>
        {
          props.battleScene.battleStore.queue.map((queueAction, idx) => {
            return (
                <motion.fieldset
                  className={classNames.window}
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


      <div className={classNames.queueOperations}>
        <div className={classNames.window} onClick={onClickCancelQueue}>Cancel</div>
        <div className={classNames.window} onClick={onClickConfirmQueue}>Confirm</div>
      </div>
    </div>
  )
})

export const ResourceDisplay = observer((props: {ally: Ally, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: classNames.DEAD,
    [Status.EXHAUSTED]: classNames.EXHAUSTED,
  };
  const style = [
    classNames.window,
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

        <div className={classNames.characterCellContainer}>
          <div className={classNames.windowName}>{props.ally.name}</div>
          <div className={classNames.resourceContainer}>
            <div className={classNames.meterContainer}>
              <Meter value={props.ally.health} max={props.ally.maxHealth} className={classNames.bleedMeter}/>
              <Meter value={props.ally.health-props.ally.bleed} max={props.ally.maxHealth} className={classNames.healthMeter}/>
              <div className={classNames.meterNumber}>{Math.ceil(props.ally.health)}</div>
            </div>
            <div className={classNames.meterContainer}>
              <Meter value={props.ally.stamina < 0 ? 0 : props.ally.stamina } max={props.ally.maxStamina} className={classNames.staminaMeter}/>
              <div className={classNames.meterNumber}>{Math.ceil(props.ally.stamina)}</div>
            </div>
            <div className={classNames.meterContainer}>
              <Meter value={ props.battleScene.battleStore.getStaminaUsed(props.ally) } max={props.ally.maxStamina} className={classNames.staminaUsedMeter}/>
              <div className={classNames.meterNumber}>{props.battleScene.battleStore.getStaminaUsed(props.ally)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

const MenuContainer = observer((props: { battleScene: Battle }) => {

  const variants: Variants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: {
      opacity: 0,
      x: "-5%",
    },    
  }
  // TODO: Better Logic for determing queue view visible
  return (
    <motion.div 
      className={classNames.modalContainer} 
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {props.battleScene.battleStore.queue.length > 0 && <QueueView battleScene={props.battleScene} /> }
      {props.battleScene.battleStore.menu && <MenuView battleScene={props.battleScene} />}
    </motion.div>        
  ) 
}) 


export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { allies, enemies } = props.scene.battleStore;
    const onClickAlly = (ally: Ally) => {
      props.scene.setCaster(ally);
    }

    return (
        <div className={classNames.container}>
          {/* <Description battle={props.scene} /> */}
          <div className={classNames.combatantBar}>
              {enemies.map((enemy) => {
                return( 
                  <div style={{ position: 'relative', flex: '1' }} key={enemy.name}>
                    <EnemyResourceDisplay battleScene={props.scene} enemy={enemy} />
                  </div>
                )
              })}
          </div>
          <div style={{ flex: 4, zIndex: -1 }}> 
            {/* <Stage scene={props.scene} /> */}
          </div>
          <MenuContainer battleScene={props.scene}/>
          <div className={classNames.combatantBar}>
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
