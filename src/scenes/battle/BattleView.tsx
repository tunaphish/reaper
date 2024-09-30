import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Combatant, Status } from '../../model/combatant';
import { PartyMember, Folder } from '../../model/party';
import { Option } from '../../model/option';
import { Action } from '../../model/action';

import styles from './battle.module.css';
import { Battle } from './Battle';

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
      props.battleScene.executeAction(props.combatant);
    }
  } 

  return (
    <div className={style.join(' ')} onClick={props.onClickCell} onAnimationEnd={onAnimationEnd}>
      <motion.div 
        className={styles.castingWindow}
        animate={{ height: props.combatant?.queuedAction != null ? "100%" : 0  }}
        transition={{ duration: props.combatant?.queuedAction != null ? 1 : 0 }}
        onAnimationComplete={onCastingWindowAnimationComplete}
       />
      <div className={styles.resourceContainer}>
        <div>{props.combatant.name}</div>
        <span>❤️ {Math.ceil(props.combatant.health)}/ {props.combatant.maxHealth}</span>
        <div className={styles.healthMeterContainer}>
          <meter className={styles.healthMeter} min={0} value={props.combatant.health-props.combatant.bleed} max={props.combatant.maxHealth}></meter>
          <meter className={styles.bleedMeter} min={0} value={props.combatant.health} max={props.combatant.maxHealth}></meter>
        </div>
        <span>☀️ {Math.ceil(props.combatant.stamina)}/ {props.combatant.maxStamina}</span>
        <meter className={styles.staminaMeter} min={0} value={props.combatant.stamina} max={props.combatant.maxStamina}></meter>
        <span>🌙 {Math.ceil(props.combatant.magic)}/ {props.combatant.maxMagic}</span>
        <div className={styles.magicMeterContainer}>
          <meter className={styles.flowMeter} min={0} value={props.combatant.flow} max={props.combatant.maxMagic}></meter>
          <meter className={styles.magicMeter} min={0} value={props.combatant.magic} max={props.combatant.maxMagic}></meter>
        </div>
      </div>
    </div>
  )
});

type MenuOption = Folder | Combatant | Action | Option
const MenuView = (props: {folder: Folder, style: React.CSSProperties, battleScene: Battle }) => {
  const onClickMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }



  return (
    <div className={styles.modalMenu} style={props.style} onClick={onClickMenu}>
      <div className={styles.modalMenuHeader}>{props.folder.name}</div>
      <hr style={{ marginBottom: 4 }}/>
      {props.folder.options.map((option: MenuOption) => {
        const onClickOption = () => props.battleScene.selectOption(option);
        
        let iconMapKey = 'folder';
        if ('staminaCost' in option) {
          iconMapKey = 'attack';
        } else if ('behaviors' in option) {
          iconMapKey = 'enemy';
        } else if ('folder' in option) {
          iconMapKey = 'ally';
        }

        return (
          <div key={option.name} onClick={onClickOption} className={styles.menuOption}>
            <img
              src={ICON_MAP[iconMapKey]}
              alt="Icon"
              style={{ width: '18px', height: '18px', marginRight: '4px' }} 
            />
          <div>{option.name}</div>
          { 'staminaCost' in option && <div className={styles.optionCost}>{option.staminaCost}</div>}
        </div>
        )
      })}
    </div>
  );
}

const MenuContainer = observer((props: { menus: Folder[], battleScene: Battle }) => {
  const onClickModalContainer = () => {
    props.battleScene.closeMenu();
  }
  const variants: Variants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: ({idx, total}) => ({
      opacity: 0,
      x: "-5%",
      transition: {
        delay: (total-idx-1) * 0.05,
      },
    }),    
  }

  return (
    <div className={styles.menuViewsContainer}>
      <AnimatePresence>
        {
          props.menus.map((menu, idx) => {
          const RIGHT_OFFSET = 50;
          const BOTTOM_OFFSET = 150;
          const style: React.CSSProperties = {
            zIndex: 10 * idx,
            right: 30 * (idx - 1) + RIGHT_OFFSET + 'px',
            bottom: 30 * (idx - 1) + BOTTOM_OFFSET + 'px',
          }
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
            >
            <MenuView folder={menu} style={style} battleScene={props.battleScene}/>
          </motion.div>        
          )
          })
        }
      </AnimatePresence>
    </div>
  );
}) 

export const BattleView = (props: { scene: Battle }): JSX.Element => {
    const { enemies, party } = props.scene.battleStore;
    const onClickPartyMember = (member: PartyMember) => {
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
          <div className={styles.partyBar}>
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
                  <p className={styles.animeText} />
                </div>
              </div>
            </div>
          </motion.div>
          <div className={styles.partyBar}>
              {party.members.map((member) => {
                return <ResourceDisplay battleScene={props.scene} combatant={member} onClickCell={() => onClickPartyMember(member)} key={member.name}/>
              })}
          </div>
          <MenuContainer menus={props.scene.battleStore.menus} battleScene={props.scene}/>
        </div>
      )
};
