import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';


import classNames from './battle.module.css';
import { Battle } from './Battle';
import {  EnemyResourceDisplay } from './Stage';
import { Meter } from './Meter';
import { Action, ActionType } from '../../model/action';
import { Combatant, Status } from '../../model/combatant';
import { ActionMenu, MenuType, TargetMenu } from './menu';
import { Enemy } from '../../model/enemy';
import { BattleState } from './BattleStore';


const MenuActionView = (props: { action: Action, battle: Battle, caster: Ally }) => {
  const { action, caster, battle } = props;
  const onClickAction = () => battle.selectAction(action, caster);
  
  return ( 
    <button key={action.name} onClick={onClickAction} className={classNames.menuOption} >
        <div>{action.name}</div>
        <div className={classNames.optionCost}>{action.staminaCost}</div>
    </button>
  )
}

const MenuTargetView = (props: { target: Combatant, battleScene: Battle }) => {
  const { target } = props;
  const onClickTarget = () => props.battleScene.selectTarget(target);
  
  return ( 
    <button key={target.name} onClick={onClickTarget} className={classNames.menuOption} >
        <div>{target.name}</div>
    </button>
  )
}


const QueueView = observer((props: { battleScene: Battle}) => {

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
    </div>
  )
})

export const ResourceDisplay = observer((props: {ally: Ally, onClickCell?: () => void, battle: Battle }) => {
  const { battle, ally } = props;
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
    <fieldset className={style.join(' ')} style={{ padding: 0, flex: '1' }}>
      <legend className={classNames.windowName}>{props.ally.name}</legend>
      <div>
        {battle.battleStore.state === BattleState.ATTACK && ally.actions.filter(action => action.actionType === ActionType.ATTACK).map(action => <MenuActionView action={action} key={action.name} battle={battle} caster={ally}/>)}
        {battle.battleStore.state === BattleState.DEFEND && ally.actions.filter(action => action.actionType === ActionType.DEFENSE).map(action => <MenuActionView action={action} key={action.name} battle={battle} caster={ally}/>)}
      </div>
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
      </div>
    </fieldset>
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
      <QueueView battleScene={props.battleScene} /> 
    </motion.div>        
  ) 
}) 

export const TargetBar = observer((props: { battle: Battle }): JSX.Element => {
  const { battle } = props;
  if (battle.battleStore.queue.length === 0) return null;

  if (battle.battleStore.state === BattleState.ATTACK) {
    return (
      <div className={classNames.window}>
        <div className={classNames.actionBar}>
          {battle.battleStore.enemies.map(enemy => (
            <MenuTargetView battleScene={battle} target={enemy} key={enemy.name} />
          ))}
        </div>
      </div>
    )
  }

  if (battle.battleStore.state === BattleState.DEFEND) {
    return (
      <div className={classNames.window}>
        <div className={classNames.actionBar}>
          {battle.battleStore.allies.map(ally => (
            <MenuTargetView battleScene={battle} target={ally} key={ally.name} />
          ))}
        </div>
      </div>
    )
  }

  return null;
});

export const ActionBar = observer((props: { battle: Battle }): JSX.Element => {
  const { battle } = props;

  return (
    <div className={classNames.window}>
      <div className={classNames.actionBar}>
        <button onClick={() => battle.selectAttack()} className={classNames.menuOption}><div>Attack</div></button>
        <button onClick={() => battle.selectDefend()} className={classNames.menuOption}><div>Defend</div></button>
        <button className={classNames.menuOption} disabled><div>Item</div></button>
        <button onClick={() => battle.cancel()} className={classNames.menuOption}><div>Cancel</div></button>
      </div>
    </div>
  )
});

export const BattleView = observer((props: { battle: Battle }): JSX.Element => {
  const { battle } = props;
  const { allies, enemies } = battle.battleStore;
  const onClickAlly = (ally: Ally) => {
    battle.setCaster(ally);
  }

  return (
      <div className={classNames.container}>
        {/* <Description battle={battle} /> */}
        <div className={classNames.combatantBar}>
            {enemies.map((enemy) => {
              return( 
                <div style={{ position: 'relative', flex: '1' }} key={enemy.name}>
                  <EnemyResourceDisplay battleScene={battle} enemy={enemy} />
                </div>
              )
            })}
        </div>
        <div style={{ flex: 4, zIndex: -1 }}> 
          {/* <Stage scene={battle} /> */}
        </div>
        <MenuContainer battleScene={battle}/>
        <TargetBar battle={battle} />
        <div className={classNames.combatantBar}>
            {allies.map((ally) => {
              return( 
                <div style={{ position: 'relative', flex: '1' }} key={ally.name}>
                  <ResourceDisplay battle={battle} ally={ally} onClickCell={() => onClickAlly(ally)} key={ally.name}/>
                </div>
              )
            })}
        </div>
        <ActionBar battle={battle}/>

      </div>
    )
});
