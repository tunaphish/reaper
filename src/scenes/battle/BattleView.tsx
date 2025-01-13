import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuOption } from '../../model/menuOption';

import styles from './battle.module.css';
import { Battle } from './Battle';
import { Folder } from '../../model/folder';
import { Stage } from './Stage';
import { ActionsViewManager, ResourceDisplay } from './ResourceDisplay';
import { Action } from '../../model/action';

const Description = observer((props: { battle: Battle }) => {
  const text = props.battle.battleStore.reaction?.description || (props.battle.battleStore.executable as Action)?.description;
  console.log(text);
  const style: React.CSSProperties = {
    padding: 5,
    position: "absolute",
    top: 0,
    width: "100%"
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


const MenuOptionView = (props: { option: MenuOption, battleScene: Battle }) => {
  const { option } = props;
  const onClickOption = () => props.battleScene.selectOption(option);
  
  return ( 
    <button key={option.name} onClick={onClickOption} className={styles.menuOption} disabled={option.type === OptionType.ITEM && option.charges === 0}>
        <div>{option.name}</div>
        { option.type === OptionType.ACTION && <div className={styles.optionCost}>{option.staminaCost}</div>}
        { option.type === OptionType.ITEM && <div className={styles.optionCost}>{option.charges}/{option.maxCharges}</div>}
        { option.type === OptionType.FOLDER && option.criteria && <div className={option.criteria.fulfilled ? styles.magicCostFulfilled : styles.magicCost}>{option.criteria.magicCost}</div>}
    </button>
  )
}

const MenuView = observer((props: {menuContent: Folder, idx: number, battleScene: Battle }) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  const HORIZONTAL_OFFSET = 50;
  const VERTICAL_OFFSET = 200;
  const style: React.CSSProperties = {
    right: 30 * (props.idx - 1) + HORIZONTAL_OFFSET + 'px',
    bottom: 30 * (props.idx - 1) + VERTICAL_OFFSET + 'px',
  }
  return (
      <div className={styles.modalMenu} style={style} onClick={onClickMenu}>
        <div className={styles.window} 
          style={{ 
            minWidth: "100px",
            width:" 100%",
          }}
        >
        <div className={styles.windowName}>{props.menuContent.name}</div>
        <div className={styles.menuContent}>
          {
            props.menuContent.options.map((option: MenuOption) => <MenuOptionView key={option.name} option={option} battleScene={props.battleScene}/>)
          }
        </div>
        </div>

    </div>

  );    
});


const MenuContainer = observer((props: { battleScene: Battle }) => {
  const onClickModalContainer = () => {
    props.battleScene.closeMenu();
  }
  const variants: Variants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: {
      opacity: 0,
      x: "-5%",
    },    
  }

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {
          props.battleScene.battleStore.menus.map((menu, idx) => {
          return (
            <motion.div 
              custom={{idx, total: props.battleScene.battleStore.menus.length}}
              className={styles.modalContainer} 
              onClick={onClickModalContainer}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              key={idx}
              style={{ zIndex: 10 * (idx + 1) }}
            >
            <MenuView menuContent={menu} idx={idx} battleScene={props.battleScene} />
          </motion.div>        
          )
          })
        }
    </div>
  );
}) 



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
            battle.battleStore.notifications.map(({ text, source, isEnemy, id }, idx: number) =>  {
              

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

export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { allies } = props.scene.battleStore;
    const onClickalliesMember = (member: Ally) => {
      props.scene.openInitialMenu(member);
    }

    return (
        <div className={styles.container}>
          <Description battle={props.scene} />
          <div style={{ flex: 4, zIndex: -1 }}> 
            <Stage scene={props.scene} />
          </div>
          <NotificationsManager battle={props.scene}/>
          <div className={styles.combatantBar}>
              {allies.map((member) => {
                return( 
                  <div style={{ position: 'relative', flex: '1' }} key={member.name}>
                    <ActionsViewManager battleScene={props.scene} combatant={member} />
                    <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickalliesMember(member)} key={member.name}/>
                  </div>
                )
              })}
          </div>
          <MenuContainer battleScene={props.scene}/>
        </div>
      )
});
