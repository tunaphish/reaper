import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Combatant, JankenboThrow, Status } from '../../model/combatant';
import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuContent } from '../../model/menuContent';
import { MenuOption } from '../../model/menuOption';

import * as Spells from '../../data/spells';

import styles from './battle.module.css';
import { Battle } from './Battle';
import { MenuSelections } from './BattleStore';

const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
    [Status.BLOCKING]: styles.BLOCKING,
  };
  const style = [
    styles.window,
    statusToStylesMap[props.combatant.status],
    props.combatant.takingDamage ? styles.shake : '',
  ];
  const onAnimationEnd = () => { props.combatant.takingDamage = false }; // hacky

  // const actionsDirectedAtCombatant = props.battleScene.deferredActions.filter(action => {
  //   action.target.name
  // })

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-5px', left: '-5px' }}>
        <div className={styles.window} style={{ padding: 5 }}>
          attack
        </div>
      </div>
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


const MenuView = observer((props: {menuContent: MenuContent, idx: number, battleScene: Battle, menuSelection: MenuSelections, isEnemy: boolean }) => {
  const Zantetsuken = observer(() => {
    return (
        props.idx === 0 && 
        props.menuSelection.caster && 
        props.menuSelection.caster.activeSpells.find(activeSpell => activeSpell.name === Spells.ZANTETSUKEN.name) &&
        <div className={styles.menu}>ZANTETSUKEN {props.menuSelection.zantetsukenMultiplier.toFixed(2)}X</div>
    )
  });
  
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }


  const Cleave = () => {
    const [value, setValue] = React.useState('0')
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
      if (e.currentTarget.value === "100") {
        props.battleScene.advanceSpell();
      }
    }
    return (
      <input type="range" min="0" max="100" value={value} onChange={onChange}/>
    )
  }

  const Jankenbo = () => {
    const setJankenboThrow = (jankenboThrow: JankenboThrow) => {
      props.battleScene.setJankenboThrow(jankenboThrow);
      props.battleScene.advanceSpell();
    }

    return (
        <>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenboThrow.ROCK)}>ROCK</div>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenboThrow.PAPER)}>PAPER</div>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenboThrow.SCISSORS)}>SCISSORS</div>
        </>
    )
  };

  const Charge = observer(() => {
    const onChargeStart = () => {
      props.battleScene.setCasterStatus(Status.CHARGING);
    }
    const onChargeEnd = () => {
      props.battleScene.setCasterStatus(Status.NORMAL);
      props.battleScene.advanceSpell();
    }

    return (
          <button 
            onMouseDown={onChargeStart}
            onMouseUp={onChargeEnd}
            onTouchStart={onChargeStart} 
            onTouchEnd={onChargeEnd}>
              CHARGE!!! {props.menuSelection.chargeMultiplier.toFixed(2)}X
        </button>
    )
  });

  const HORIZONTAL_OFFSET = 50;
  const VERTICAL_OFFSET = 150;
  const style: React.CSSProperties = props.isEnemy ?
  {
    left: 30 * (props.idx - 1) + HORIZONTAL_OFFSET + 'px',
    top: 30 * (props.idx - 1) + VERTICAL_OFFSET + 'px',
  }
  : {
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
            props.menuContent.options.map((option: MenuOption, index: number) => {
              const onClickOption = () => props.battleScene.selectOption(option, props.menuSelection);
              const classes = [
                styles.menuOption,
                props.idx === props.menuSelection.menus.length-1 && props.isEnemy && index === props.battleScene.battleStore.enemyCursorIdx ? styles.cursor : '',
              ]
              return ( <button key={option.name} onClick={onClickOption} className={classes.join(' ')} disabled={option.type === OptionType.ITEM && option.charges === 0}>

                <div>{option.name}</div>
                { option.type === OptionType.ACTION && <div className={styles.optionCost}>{option.staminaCost}</div>}
                { option.type === OptionType.SPELL && (
                    <>
                      <input type="checkbox" checked={!!props.menuSelection?.caster.activeSpells.find((spell) => spell.name === option.name)} disabled/>
                      <div className={styles.magicCost}>{option.magicCost}</div>
                    </>
                  )
                }
                { option.type === OptionType.ITEM && <div className={styles.optionCost}>{option.charges}/{option.maxCharges}</div>}
              </button>
              )
            })
          }
          {
            props.menuContent.name === Spells.CHARGE.name && <Charge />
          }
          {
            props.menuContent.name === Spells.JANKENBO.name && <Jankenbo />
          }
          {
            props.menuContent.name === Spells.CLEAVE.name && <Cleave />
          }
        </div>
        </div>

      <Zantetsuken />
    </div>

  );    
});


const MenuContainer = observer((props: { battleScene: Battle, menuSelections: MenuSelections, isEnemy: boolean }) => {
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
    <div className={ props.isEnemy ? styles.unclickable : ''}>
        {
          props.menuSelections.menus.map((menu, idx) => {
          return (
            <motion.div 
              custom={{idx, total: props.menuSelections.menus.length}}
              className={styles.modalContainer} 
              onClick={onClickModalContainer}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              key={idx}
              style={{ zIndex: 10 * (idx + 1) }}
            >
            <MenuView menuContent={menu} idx={idx} battleScene={props.battleScene} menuSelection={props.menuSelections} isEnemy={props.isEnemy}/>
          </motion.div>        
          )
          })
        }
    </div>
  );
}) 

const Stage = (props: { scene: Battle }) => {
  const { enemies } = props.scene.battleStore;

  const onAnimationEnd = () => {
    props.scene.startBattle();
  }
  
  const enemyPortaitStyle: React.CSSProperties = {
    backgroundImage: `url(${enemies[0].imageUrl})`
  }
  const backgroundImageStyle: React.CSSProperties = {
    backgroundImage: `url(${props.scene.backgroundImageUrl})`
  }
  
  return ( 
    <div style={{ flex: 4, display: "flex", justifyContent: "space-around", }}>
      <motion.div
        style={{
          width: "100%",
          margin: 10,
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
        initial={{ scaleY: 0 }} 
        animate={{ scaleY: 1 }} 
        transition={{ duration: .3, ease: 'easeOut' }} 
        onAnimationComplete={onAnimationEnd} 
      >
        <div className={styles.window} style={{ aspectRatio: "16/9" }}>
          <div className={styles.tvContainer}>
            <div className={styles.background} style={backgroundImageStyle}/>
            <div className={styles.enemyPortait} style={enemyPortaitStyle}/>
          </div>
        </div>
      </motion.div>
    </div>

  )
}

const Description = observer((props: { text: string, isEnemy: boolean }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const style: React.CSSProperties =  props.isEnemy ?
  {
    padding: 5,
    position: "absolute",
    top: 0,
    right: "5%",
    width: "50%"
  } :
  {
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
          <MenuContainer battleScene={props.scene} menuSelections={props.scene.battleStore.enemyMenuSelections} isEnemy={true}/>
          <div className={styles.alliesBar}>
            {enemies.map((enemy) => {
              return <ResourceDisplay battleScene={props.scene} combatant={enemy} key={enemy.name} />
            })}
         </div>
          <Description text={props.scene.battleStore.enemyMenuSelections.text} isEnemy={true}/>
          <Stage scene={props.scene} />
          <Description text={props.scene.battleStore.allyMenuSelections.text} isEnemy={false}/>
          <div className={styles.alliesBar}>
              {allies.map((member) => {
                return <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickalliesMember(member)} key={member.name}/>
              })}
          </div>
          <MenuContainer battleScene={props.scene} menuSelections={props.scene.battleStore.allyMenuSelections} isEnemy={false}/>
        </div>
      )
});
