import * as React from 'react';
import styles from './battle.module.css';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuOption } from '../../model/menuOption';
import { Action } from '../../model/action';
import { Status } from '../../model/combatant';
import { Folder } from '../../model/folder';

import { Battle } from './Battle';
import { Stage } from './Stage';
import { ActionsViewManager, Meter } from './ActionsViewManager';

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
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: "50%",
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'flex-start',       
        justifyContent: 'flex-end',
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

export const ResourceDisplay = observer((props: {ally: Ally, battleScene: Battle }) => {
  const { ally } = props;

  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[ally.status],
  ];

  
  const juggleWidth = {
    width: `${ally.juggleDuration * .1}px`
  }

  return (
    <div style={{ flex: '1', margin: '5px' }}>
      <div className={style.join(' ')} onClick={() => props.battleScene.openInitialMenu(ally)} 
        style={{ 
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr", 
        }}>
        <motion.div 
          className={styles.castingWindow}
          animate={{ height: ally.status === Status.CASTING ? Math.min(Math.round(ally.timeInStateInMs / ally.queuedOption.castTimeInMs * 100), 100) + "%" : 0  }}
          transition={{ duration: 0 }}
        />
        <div className={styles.characterCellContainer}>
          <div className={styles.windowName}>{ally.name}</div>
          <div className={styles.meterContainer}>
            <Meter value={ally.health} max={ally.maxHealth} className={styles.bleedMeter}/>
            <Meter value={ally.health-ally.bleed} max={ally.maxHealth} className={styles.healthMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(ally.health)}</div>
          </div>
          <div className={styles.meterContainer}>
            <Meter value={ally.stamina < 0 ? 0 : ally.stamina } max={ally.maxStamina} className={styles.staminaMeter}/>
            <div className={styles.meterNumber}>{Math.ceil(ally.stamina)}</div>
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


export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { allies } = props.scene.battleStore;


    return (
        <div className={styles.container}>
          <div className={styles.stageContainer}> 
            <Stage scene={props.scene} />
          </div>
          <div className={styles.uiContainer}>
            <Description battle={props.scene} />
            <NotificationsManager battle={props.scene}/>
            <div className={styles.interactionContainer}>
              <div className={styles.combatantBar}>
                  {allies.map((ally) => {
                    return( 
                      <div style={{ position: 'relative', flex: '1' }} key={ally.name}>
                        <ActionsViewManager battleScene={props.scene} combatant={ally} />
                        <ResourceDisplay battleScene={props.scene} ally={ally} key={ally.name}/>
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
