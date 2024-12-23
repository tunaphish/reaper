import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Combatant, Status } from '../../model/combatant';
import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuOption } from '../../model/menuOption';

import styles from './battle.module.css';
import { Battle } from './Battle';
import { Folder } from '../../model/folder';

const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.window,
    statusToStylesMap[props.combatant.status],
    props.combatant.takingDamage ? styles.shake : '',
  ];
  const onAnimationEnd = () => { props.combatant.takingDamage = false }; // hacky

  const actionsDirectedAtCombatant = props.battleScene.deferredActions.filter(action => action.target.name === props.combatant.name);

  return (
    <div style={{ position: 'relative' }}>
      {
        actionsDirectedAtCombatant.map((action, idx) => {
          const style: React.CSSProperties = {
            position: 'absolute', 
            top:  `${-10*(idx+1)}px`, 
            left: `${-5*(idx+1)}px`
          }
          return (
            <div key={idx}>
              <div style={style}>
                <motion.div 
                  className={styles.window} 
                  style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}
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
                  <div style={{ padding: 5, gridColumn: 1, gridRow: 1 }}>
                    {action.action.name}
                  </div>
                </motion.div>
              </div>
            </div>
          )
        })
      }

      <div className={style.join(' ')} onClick={props.onClickCell} onAnimationEnd={onAnimationEnd}
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
              <meter className={styles.flowMeter} min={0} value={props.combatant.flow} max={props.combatant.maxMagic}></meter>
              <div className={styles.meterNumber}>{Math.ceil(props.combatant.magic)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
});


const MenuView = observer((props: {menuContent: Folder, idx: number, battleScene: Battle }) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  const HORIZONTAL_OFFSET = 50;
  const VERTICAL_OFFSET = 150;
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
            props.menuContent.type === OptionType.FOLDER && 
            props.menuContent.options.map((option: MenuOption) => {
              const onClickOption = () => props.battleScene.selectOption(option);

              return ( <button key={option.name} onClick={onClickOption} className={styles.menuOption} disabled={option.type === OptionType.ITEM && option.charges === 0}>

                <div>{option.name}</div>
                { option.type === OptionType.ACTION && <div className={styles.optionCost}>{option.staminaCost}</div>}
                { option.type === OptionType.ITEM && <div className={styles.optionCost}>{option.charges}/{option.maxCharges}</div>}
              </button>
              )
            })
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
    <div>
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

const Stage = (props: { scene: Battle }) => {  
  return ( 
    <div style={{ flex: 4, display: "flex", justifyContent: "space-around", }}>
    </div>

  )
}

const Description = observer((props: { text: string }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const style: React.CSSProperties = {
    padding: 5,
    position: "absolute",
    bottom: 0,
    left: "5%",
    width: "50%"
  };

  React.useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [props.text]);

  return (
    <AnimatePresence>
    { isVisible && (
        <motion.div 
          style={{ position: "relative" }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
            <div className={styles.window} style={style}>
              {props.text}
            </div>
        </motion.div>
    )}
    </AnimatePresence>
  )
});

export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { enemies, allies } = props.scene.battleStore;
    const onClickalliesMember = (member: Ally) => {
      props.scene.openInitialMenu(member);
    }

    return (
        <div className={styles.container}>
          <div className={styles.alliesBar}>
            {enemies.map((enemy) => {
              return <ResourceDisplay battleScene={props.scene} combatant={enemy} key={enemy.name} />
            })}
         </div>
          <Stage scene={props.scene} />
          <Description text={props.scene.battleStore.text}/>
          <div className={styles.alliesBar}>
              {allies.map((member) => {
                return <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickalliesMember(member)} key={member.name}/>
              })}
          </div>
          <MenuContainer battleScene={props.scene}/>
        </div>
      )
});
