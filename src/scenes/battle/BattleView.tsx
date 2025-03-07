import * as React from 'react';
import styles from './battle.module.css';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuOption } from '../../model/menuOption';
import { Action } from '../../model/action';
import { Combatant, Status } from '../../model/combatant';
import { Folder } from '../../model/folder';

import { Battle } from './Battle';
import { Stage } from './Stage';
import { Meter } from './Meter';
import { TimelineAction } from './BattleStore';

const Description = observer((props: { battle: Battle }) => {
  const text = props.battle.battleStore.reaction?.description || (props.battle.battleStore.executable as Action)?.description;
  const style: React.CSSProperties = {
    padding: 5,
    position: "absolute",
    top: 0,
    width: "100%",
  };

  return (
    <AnimatePresence>
    { text && (
        <motion.fieldset 
          style={style}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
          className={styles.window}
        >
          <legend>Help</legend>
          {text}
        </motion.fieldset>
    )}
    </AnimatePresence>
  )
});

const NotificationsManager = observer((props: {  battle: Battle }) => {
  const { battle } = props;

  return (
    <div style={{
      position: 'relative',
      pointerEvents: 'none',
      flex: 7,
      width: '100%',
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'flex-start',       
        justifyContent: 'flex-end',
        width: '100%',
        zIndex: 2,   
      }}>
        <AnimatePresence >
          { 
            battle.battleStore.notifications.map(({ text, source, isEnemy, id }) =>  {
              
              const style: React.CSSProperties = isEnemy ? {
                padding: 5,
                right: "5%",
                marginTop: "-2%",
                alignSelf: 'flex-end',
              } : {
                padding: 5,
                left: "5%",
                marginTop: "-2%",
              };

              return (
                <motion.fieldset
                  key={id}
                  className={ isEnemy ? styles.enemyWindow : styles.window }
                  style={style}
                  layout='preserve-aspect'
                  exit={{ opacity: 0 }}
                  transition={{ duration: .1, ease: 'easeOut' }} 
                >
                  <legend>{source}</legend>
                  {text}
              </motion.fieldset>
              )
            })
          }
        </AnimatePresence>
      </div>
    </div>
  )
});

export const ResourceDisplay = observer((props: {combatant: Combatant, battleScene: Battle }) => {
  const { combatant } = props;

  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[combatant.status],
  ];

  
  const juggleWidth = {
    width: `${combatant.juggleDuration * .1}px`
  }

  return (
    <div style={{ flex: '1', margin: '5px' }}>
      <div className={style.join(' ')} onClick={() => props.battleScene.openInitialMenu((combatant as Ally))} 
        style={{ 
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr", 
        }}>
        <div className={styles.characterCellContainer}>
          <div className={styles.windowName}>{combatant.name}</div>
          <div className={styles.meterContainer}>
            <Meter value={combatant.health} max={combatant.maxHealth} className={styles.bleedMeter}/>
            <Meter value={combatant.health-combatant.bleed} max={combatant.maxHealth} className={styles.healthMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(combatant.health)}</div>
          </div>
          <div className={styles.meterContainer}>
            <Meter value={combatant.stamina < 0 ? 0 : combatant.stamina } max={combatant.maxStamina} className={styles.staminaMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(combatant.stamina)}</div>
          </div>
        </div>
      </div>
      <div className={styles.juggleMeter} style={juggleWidth}/>
    </div>
  )
});

const MenuOptionView = (props: { option: MenuOption, battleScene: Battle }) => {
  const { option } = props;
  const onClickOption = () => props.battleScene.selectOption(option);
  
  return ( 
    <button key={option.name} onClick={onClickOption} className={styles.menuOption} disabled={option.type === OptionType.ITEM && option.charges === 0}>
        <div>{option.name}</div>
        { (option.type === OptionType.ACTION || option.type === OptionType.REACTION) && <div className={styles.optionCost}>{option.staminaCost}</div>}
        { option.type === OptionType.ITEM && <div className={styles.optionCost}>{option.charges}/{option.maxCharges}</div>}
        { option.type === OptionType.FOLDER && option.criteria && <div className={option.criteria.fulfilled ? styles.magicCostFulfilled : styles.magicCost}>{option.criteria.magicCost}</div>}
    </button>
  )
}

const MenuView = observer((props: {menuContent: Folder, battle: Battle }) => {
  const menuContentView = props.menuContent.options.map((option: MenuOption) => <MenuOptionView key={option.name} option={option} battleScene={props.battle}/>);
  return (
    <div className={styles.window} style={{ flex: '1', margin: '5px '}}>
      <div className={styles.windowName}>{props.menuContent.name}</div>
      <div className={styles.menuContent}>{menuContentView}</div>
    </div>
  );    
});


const MenuContainer = observer((props: { battleScene: Battle }) => {
  const { menus } = props.battleScene.battleStore;
  const topMenu = menus[menus.length-1];
  return (
    <div style={{ flex: '1', height: '100%', width: '100%' }}>
      {topMenu && <MenuView menuContent={topMenu} battle={props.battleScene} />}
    </div>
  );
}) 

const TIMELINE_LENGTH = 5000;

export const ActionView = (props: { action: TimelineAction }): JSX.Element => {
  const { action } = props;
  const left = `${100 - (action.timeTilExecute / action.action.castTimeInMs * 100)}%`;

  const style: React.CSSProperties = {
      position: 'absolute', 
      bottom: action.isEnemyCaster ? '25%' : 0, 
      left,
      transform: "translateX(-50%)",
  }

  return (
    <div style={style}>
      <motion.fieldset
        className={action.isEnemyCaster ? styles.enemyWindow : styles.window} 
        style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr", padding: 5 }}
        initial={{ scaleY: 0 }} 
        animate={{ scaleY: 1 }} 
        exit={{ scaleY: 0 }}
        transition={{ duration: .1, ease: 'easeOut' }} 
      >
        <legend style={{fontSize: 12,}}>{action.target.name}</legend>
        {action.action.name}
      </motion.fieldset>
      {/* <div className={styles.reactionContainer}>
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
      </div> */}
    </div>
  )
}

export const Timeline = observer((props: { battle: Battle }) => {
  const { battle } = props;
  const { timelineActions, time } = battle.battleStore;
  const currentTime = time % TIMELINE_LENGTH;

  const right = `${100 - (currentTime/TIMELINE_LENGTH * 100)}%`;

  const style: React.CSSProperties = {
      position: 'absolute', 
      right,
      transform: "translateX(-50%)",
  }
  return (
      <div className={styles.window} style={{ flex: .3, position: 'relative' }}>
          <div className={styles.timelinePositionIndicator} style={style}/>
          { timelineActions.map((action) => <ActionView key={action.id} action={action} />)      }
      </div>
  )
});


export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
  
  const { allies, enemies } = props.scene.battleStore;

  return (
      <div className={styles.container}>
        <div className={styles.stageContainer}> 
          {/* <Stage scene={props.scene} /> */}
        </div>
        <div className={styles.uiContainer}>
          <div className={styles.combatantBar}>
                {enemies.map((enemy) => {
                  return( 
                    <div style={{ position: 'relative', flex: '1' }} key={enemy.name}>
                      <ResourceDisplay battleScene={props.scene} combatant={enemy} />
                    </div>
                  )
                })}
          </div>
          <Description battle={props.scene} />
          <NotificationsManager battle={props.scene}/>
          <Timeline battle={props.scene}/>
          <div className={styles.interactionContainer}>
            <div className={styles.combatantBar}>
                {allies.map((ally) => {
                  return( 
                    <div style={{ position: 'relative', flex: '1' }} key={ally.name}>
                      <ResourceDisplay battleScene={props.scene} combatant={ally} key={ally.name}/>
                    </div>
                  )
                })}
            </div>
            <MenuContainer battleScene={props.scene}/>
          </div>
        </div>
      </div>
    )
});
