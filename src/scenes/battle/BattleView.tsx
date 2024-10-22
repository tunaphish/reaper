import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Combatant, JankenbowThrow, Status } from '../../model/combatant';
import { Ally } from '../../model/ally';
import { OptionType } from '../../model/option';
import { MenuContent } from '../../model/menuContent';
import { MenuOption } from '../../model/menuOption';

import * as Spells from '../../data/spells';

import styles from './battle.module.css';
import { Battle } from './Battle';
import { observable, toJS } from 'mobx';


const ICON_MAP ={
  attack: '/reaper/assets/ui/icons/attack.png',
  magic: '/reaper/assets/ui/icons/magic.png',
  item: '/reaper/assets/ui/icons/item.png',
  folder: '/reaper/assets/ui/icons/folder.png',
  ally: '/reaper/assets/ui/icons/ally.png',
  enemy: '/reaper/assets/ui/icons/enemy.png',
}

const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void, battleScene: Battle }) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: styles.DEAD,
    [Status.EXHAUSTED]: styles.EXHAUSTED,
  };
  const style = [
    styles.characterCell,
    statusToStylesMap[props.combatant.status],
    props.combatant.takingDamage ? styles.shake : '',
  ];
  const onAnimationEnd = () => { props.combatant.takingDamage = false }; // hacky
  const onCastingWindowAnimationComplete = (definition: { height?: string }) => {
    if (definition?.height === "100%") {
      props.battleScene.setCombatantAttacking(props.combatant);
    }
  } 
  const onAttackWindowAnimationComplete = (definition: { opacity?: number }) => {
    if (definition?.opacity === 1) {
      props.battleScene.execute(props.combatant);
    }
  } 

  return (
    <div className={style.join(' ')} onClick={props.onClickCell} onAnimationEnd={onAnimationEnd}>

      <motion.div 
        className={styles.castingWindow}
        animate={{ height: props.combatant?.queuedOption != null ? "100%" : 0  }}
        transition={{ duration: props.combatant?.queuedOption != null ? (props.combatant.queuedOption.castTimeInMs / 1000) : 0 }}
        onAnimationComplete={onCastingWindowAnimationComplete}
       />
      <div className={styles.resourceContainer}>
        <div>{props.combatant.name}</div>
        <div className={styles.statContainer}>
          <div>❤️ </div>
          <div className={styles.meterContainer}>
            <meter className={styles.bleedMeter} min={0} value={props.combatant.health} max={props.combatant.maxHealth}></meter>
            <meter className={styles.healthMeter} min={0} value={props.combatant.health-props.combatant.bleed} max={props.combatant.maxHealth}></meter>
            <div className={styles.meterNumber}>{Math.ceil(props.combatant.health)}</div>
          </div>
        </div>
        <div className={styles.statContainer}>
          <div>☀️ </div>
          <div className={styles.meterContainer}>
            <meter className={styles.staminaMeter} min={0} value={props.combatant.stamina} max={props.combatant.maxStamina}></meter>
            <div className={styles.meterNumber}>{Math.ceil(props.combatant.stamina)}</div>
          </div>
        </div>
        <div className={styles.statContainer}>
          <div>🌙 </div>
          <div className={styles.meterContainer}>
            <meter className={styles.magicMeter} min={0} value={props.combatant.magic} max={props.combatant.maxMagic}></meter>
            <meter className={styles.flowMeter} min={0} value={props.combatant.flow} max={props.combatant.maxMagic}></meter>
            <div className={styles.meterNumber}>{Math.ceil(props.combatant.magic)}</div>
          </div>
        </div>
      </div>
      <motion.div 
        className={styles.attackWindow}
        animate={{ opacity: props.combatant.status === Status.ATTACKING ? 1 : 0  }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={onAttackWindowAnimationComplete}
       />
    </div>
  )
});


const MenuView = (props: {menuContent: MenuContent, idx: number, battleScene: Battle }) => {
  const Zantetsuken = observer(() => {
    return (
        props.idx === 0 && 
        props.battleScene?.battleStore.caster.activeSpells.find(activeSpell => activeSpell.name === Spells.ZANTETSUKEN.name) &&
        <div className={styles.menu}>ZANTETSUKEN {props.battleScene.battleStore.zantetsukenMultiplier.toFixed(2)}X</div>
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
    const setJankenboThrow = (jankenboThrow: JankenbowThrow) => {
      props.battleScene.setJankenboThrow(jankenboThrow);
      props.battleScene.advanceSpell();
    }

    return (
        <>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenbowThrow.ROCK)}>ROCK</div>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenbowThrow.PAPER)}>PAPER</div>
          <div className={styles.menuOption} onClick={() => setJankenboThrow(JankenbowThrow.SCISSORS)}>SCISSORS</div>
        </>
    )
  };

  const Charge = observer(() => {
    const onChargeStart = () => {
      props.battleScene.setCasterCharging();
    }
    const onChargeEnd = () => {
      props.battleScene.setCasterNormal();
      props.battleScene.advanceSpell();
    }

    return (
          <button 
            onMouseDown={onChargeStart}
            onMouseUp={onChargeEnd}
            onTouchStart={onChargeStart} 
            onTouchEnd={onChargeEnd}>
              CHARGE!!! {props.battleScene.battleStore.chargeMultiplier.toFixed(2)}X
        </button>
    )
  });

  const RIGHT_OFFSET = 50;
  const BOTTOM_OFFSET = 150;
  const style: React.CSSProperties = {
    right: 30 * (props.idx - 1) + RIGHT_OFFSET + 'px',
    bottom: 30 * (props.idx - 1) + BOTTOM_OFFSET + 'px',
  }
    return (
        <div className={styles.modalMenu} style={style} onClick={onClickMenu}>
          <div className={styles.menu}>
          <div className={styles.modalMenuHeader}>{props.menuContent.name}</div>
          <hr style={{ marginBottom: 4 }}/>
          {
            props.menuContent.type === OptionType.FOLDER && 
            props.menuContent.options.map((option: MenuOption) => {
              const onClickOption = () => props.battleScene.selectOption(option);
              
              function getFolderKey(option: MenuOption) {
                switch(option.type) {
                  case OptionType.FOLDER:
                    return'folder';
                  case OptionType.ENEMY:
                    return'enemy';
                  case OptionType.ALLY:
                    return'ally';
                  case OptionType.ACTION:
                    return'attack';
                  case OptionType.ITEM:
                    return'item';
                  case OptionType.SPELL:
                    return'magic';
                  default:
                    return'folder';
                }
              }
              const iconMapKey = getFolderKey(option);
      
              return ( <button key={option.name} onClick={onClickOption} className={styles.menuOption} disabled={option.type === OptionType.ITEM && option.charges === 0}>
                  <img
                    src={ICON_MAP[iconMapKey]}
                    alt="Icon"
                    style={{ width: '18px', height: '18px', marginRight: '4px' }} 
                  />
                <div>{option.name}</div>
                { option.type === OptionType.ACTION && <div className={styles.optionCost}>{option.staminaCost}</div>}
                { option.type === OptionType.SPELL && (
                    <>
                      <div className={styles.magicCost}>{option.magicCost}</div>
                      <input type="checkbox" checked={!!props.battleScene.battleStore?.caster.activeSpells.find((spell) => spell.name === option.name)} disabled/>
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
        <Zantetsuken />
      </div>

    );    



}




const MenuContainer = observer((props: { menus: MenuContent[], battleScene: Battle }) => {
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
    <div className={styles.menuViewsContainer}>
        {
          props.menus.map((menu, idx) => {
          return (
            <motion.div 
              custom={{idx, total: props.menus.length}}
              className={styles.modalContainer} 
              onClick={onClickModalContainer}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              key={idx}
              style={{ zIndex: 10 * (idx + 1) }}
            >
            <MenuView menuContent={menu} idx={idx} battleScene={props.battleScene}/>
          </motion.div>        
          )
          })
        }
    </div>
  );
}) 

export const BattleView = observer((props: { scene: Battle }): JSX.Element => {
    const { enemies, allies } = props.scene.battleStore;
    const onClickalliesMember = (member: Ally) => {
      props.scene.openInitialMenu(member);
    }
    const onAnimationEnd = () => {
      props.scene.startBattle();
    }
    // TODO: update for multiple enemies
    const enemyPortaitStyle: React.CSSProperties = {
      backgroundImage: `url(${enemies[0].imageUrl})`
    }
    const backgroundImageStyle: React.CSSProperties = {
      backgroundImage: `url(${props.scene.backgroundImageUrl})`
    }

    return (
        <div className={styles.container}>
          <div className={styles.alliesBar}>
            {enemies.map((enemy) => {
              return <ResourceDisplay battleScene={props.scene} combatant={enemy} key={enemy.name} />
            })}
         </div>
         <motion.div
            style={{
              width: '100%',
              height: '100%',
              flex: 4,
            }}
            initial={{ scaleY: 0 }} 
            animate={{ scaleY: 1 }} 
            transition={{ duration: .3, ease: 'easeOut' }} 
            onAnimationComplete={onAnimationEnd} 
          >
            <div className={styles.tvContainer}>
              <div className={styles.staticEffect}>
                <div className={styles.oldTvContent}>
                <div className={styles.background} style={backgroundImageStyle}/>
                  <div className={styles.enemyPortait} style={enemyPortaitStyle}/>
                  <p className={styles.animeText}>{props.scene.battleStore.stageText}</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className={styles.alliesBar}>
              {allies.map((member) => {
                return <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickalliesMember(member)} key={member.name}/>
              })}
          </div>
          <MenuContainer menus={props.scene.battleStore.menus} battleScene={props.scene}/>
        </div>
      )
});
