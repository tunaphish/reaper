import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuOption } from '../../model/menuOption';

import styles from './battle.module.css';
import { Battle } from './Battle';
import { Folder } from '../../model/folder';
import { Stage, EnemyResourceDisplay } from './Stage';
import { ResourceDisplay } from './ResourceDisplay';

import { Action } from '../../model/action';

const Description = observer((props: { battle: Battle }) => {
  const text = (props.battle.battleStore.executable as Action)?.description;
  const style: React.CSSProperties = {
    padding: 5,
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
    </button>
  )
}

const MenuView = observer((props: {menuContent: Folder, idx: number, battleScene: Battle }) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  const HORIZONTAL_OFFSET = 50;
  const VERTICAL_OFFSET = 100;
  const style: React.CSSProperties = {
    right: 50 * (props.idx - 1) + HORIZONTAL_OFFSET + 'px',
    bottom: 50 * (props.idx - 1) + VERTICAL_OFFSET + 'px',
  }


  const effects = props.battleScene.battleStore.menus.flatMap(menu => menu.options).filter((option: MenuOption) => option.type === OptionType.EFFECT);

  return (
      <div className={styles.modalMenu} style={style} onClick={onClickMenu}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            {props.idx === props.battleScene.battleStore.menus.length-1 && 
              <Description battle={props.battleScene} /> 
              
            }
            
            <fieldset className={styles.window} 
              style={{ 
                minWidth: "100px",
                width:" 100%",
              }}
            >
              <legend>{props.menuContent.name}</legend>
              <div className={styles.menuContent}>
                {
                  props.menuContent.options.filter((option: MenuOption) => option.type !== OptionType.EFFECT).map((option: MenuOption) => <MenuOptionView key={option.name} option={option} battleScene={props.battleScene}/>)
                }
              </div>
              { props.idx === props.battleScene.battleStore.menus.length-1 &&  <div className={styles.effects}>{ effects.map(effect => effect.name).join(' / ')}</div>}
          </fieldset>
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
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
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



export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { allies, enemies } = props.scene.battleStore;
    const onClickalliesMember = (member: Ally) => {
      props.scene.openInitialMenu(member);
    }

    return (
        <div className={styles.container}>
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
          <div className={styles.combatantBar}>
              {allies.map((member) => {
                return( 
                  <div style={{ position: 'relative', flex: '1' }} key={member.name}>
                    <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickalliesMember(member)} key={member.name}/>
                  </div>
                )
              })}
          </div>
          <MenuContainer battleScene={props.scene}/>
        </div>
      )
});
