
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { MenuState } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';

import { enemies } from '../../data/enemies';
import { Enemy } from '../../model/enemy';

export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <AnimatePresence mode="wait">
        {props.world.worldStore.menuState !== MenuState.NONE && <MenuContainer world={world} />}
      </AnimatePresence>
      
      <StartBar world={world} />
    </div>
  )
});

const MenuContainer = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  return (
    <div className={classNames.menuContainer}>
      {world.mapData.musicKey && <NowPlayingView world={world} />}
      <AnimatePresence mode="wait">
        {world.worldStore.menuState === MenuState.JOURNAL && <JournalTypeView world={world} />}
      </AnimatePresence>
      <LocationNameView world={world} />
      <SpiritsView world={world} />
      <MenuOptions world={world} />
      <AllyBarView world={world} />
    </div>
  )
  
});

const getDisplayedEnemies = (enemies: Enemy[], seenEnemies: SeenEnemy[]): Enemy[] => {
  const seenMap = new Map(seenEnemies.map(se => [se.enemyName, se.seenAt]));

  return enemies
    .filter(enemy => seenMap.has(enemy.name))
    .sort((a, b) => seenMap.get(b.name) - seenMap.get(a.name));
}

const EnemyListView = (props: { world: World }): JSX.Element => {
  const [displayedEnemy, setDisplayedEnemy] = React.useState<Enemy>(null);
  const displayedEnemies = getDisplayedEnemies(enemies, props.world.worldStore.playerSave.seenEnemies);

  const onClickEnemyMenuOption = (newEnemy: Enemy) => {
    if (displayedEnemy === newEnemy) {
      props.world.playChoiceDisabledSound();
      return;
    }
    props.world.playChoiceSelectSound();
    setDisplayedEnemy(newEnemy);
  }

  return (
    <>
      {displayedEnemy && <Window style={{ position: 'absolute', top: '350px', left: '200px', padding: '5px', zIndex: 5 }}>{displayedEnemy.name}</Window>}
      {displayedEnemy && <Window style={{ position: 'absolute', top: '400px', left: '100px', width: '300px', padding: '5px', zIndex: 5 }}>{displayedEnemy.journalDescription}</Window>}
      <Window style={{ position: 'absolute', top: '300px', right: '10px', padding: '5px', zIndex: 5 }}>
        { displayedEnemies.map(enemy => <div key={enemy.name} onClick={() => onClickEnemyMenuOption(enemy)}>{enemy.name}</div>)}
      </Window>
    </> 
  )
}

enum JournalMenuState {
  NONE = 'none',
  ENEMIES = 'enemies',
  TECHNIQUES = 'techniques',
}

const JournalTypeView = (props: { world: World }): JSX.Element => {
  const [journalMenuState, setJournalMenuState] = React.useState(JournalMenuState.NONE);

  const onClickJournalMenuOption = (newJournalMenuState: JournalMenuState) => {
    if (journalMenuState === newJournalMenuState) {
      props.world.playChoiceDisabledSound();
      return;
    }
    props.world.playChoiceSelectSound();
    setJournalMenuState(newJournalMenuState);
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {journalMenuState === JournalMenuState.ENEMIES && <EnemyListView world={props.world}/>}
      </AnimatePresence>
      <Window style={{ position: 'absolute', top: '300px', left: '10px', padding: '5px', zIndex: 5 }}>
        <div onClick={() => onClickJournalMenuOption(JournalMenuState.ENEMIES)}>Enemies</div>
        <div onClick={() => onClickJournalMenuOption(JournalMenuState.TECHNIQUES)}>Techniques</div>
      </Window>
    </> 
  )
}

const Ticker = ({ text }: { text: string }) => (
  <div className={classNames.ticker}>
    <div className={classNames.tickerTrack}>
      <span>{text}&nbsp;&nbsp;</span>
      <span>{text}&nbsp;&nbsp;</span>
    </div>
  </div>
);

const LocationNameView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', bottom: '50px', left: '10px', padding: '5px', zIndex: 5 }} delay={0.05}>Location: {props.world.mapData.locationName}</Window>
const NowPlayingView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', top: '10px', right: 'left', padding: '5px', width: '200px' }} delay={0.15}><Ticker text={"Now Playing: " + props.world.mapData.musicKey}/></Window>
const SpiritsView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px' }} delay={0.25}>Spirits: {props.world.worldStore.playerSave.spirits}</Window>

const SelectableOption = (props: { selected: boolean, children: React.ReactNode}): JSX.Element =>  <div style={{ position: 'relative'}}>{props.selected && <MenuCursor />}{props.children}</div>;

const MenuCursor = () => (
  <motion.img
    src="/reaper/ui/cursor.png" 
    alt=""
    style={{
      width: '24px',       
      imageRendering: 'pixelated',
      position: 'absolute',
      left: '-24px',
      top: '10%',
    }}
    initial={{ opacity: 0, x: 4 }}
    animate={{
      opacity: 1,
      x: [0, -4, 0],
    }}
    transition={{
      x: {
        repeat: Infinity,
        duration: 0.6,
        ease: 'easeInOut',
      },
      opacity: { duration: 0.15 },
    }}
  />
);


const MenuOptions = observer((props: { world: World }): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const { world } = props;
  const style: React.CSSProperties = {
    zIndex: 5,
    position: 'absolute',
    right: '20px',
    bottom: '40px',
  }

  const onClickOption = (option, i) => {
    setSelectedIndex(i);
    world.setMenu(option.menuState);
  }

  const options = [
    { label: "Inventory", menuState: MenuState.INVENTORY },
    { label: "Journal", menuState: MenuState.JOURNAL },
    { label: "Exit", menuState: MenuState.NONE },
  ]

  return (
    <Window style={style}>
      <div className={classNames.menuContainer}>
        {options.map((option, i) => (
          <SelectableOption selected={i===selectedIndex} key={option.label}><span onClick={() => onClickOption(option, i)}>{option.label}</span></SelectableOption>
        ))}
      </div>
    </Window>
  )
});

const StartBar = (props: { world: World }): JSX.Element => {
  const { world } = props;
  const onClick = () => {
    if (world.worldStore.menuState === MenuState.NONE) {
      world.setMenu(MenuState.NEUTRAL);
      return;
    }

    world.setMenu(MenuState.NONE);
    return;
  }

  return (
    <Window style={{ width: '100%', pointerEvents: 'auto' }}>
      <span onClick={onClick}>menu</span>
    </Window>
  )
}

const AllyBarView = (props: { world: World }): JSX.Element => {
  const { allies } = props.world;
  
  const style: React.CSSProperties = {
    width: '100%',
    padding: '5px',
  }
  
  return (
    <div className={classNames.combatantBar}>
        {allies.map((ally,i) => (
          <Window key={ally.name} style={style} delay={i*0.15}>
            {ally.name}
            <Meter value={ally.health} max={ally.maxHealth} className={classNames.healthMeter}></Meter>
          </Window>
        ))}
    </div>
  )
}



const expandFromCenterTransition = {
  initial: {
    scaleX: 0,
    transformOrigin: "center",
    
  },
  animate: (delay) => ({
    scaleX: 1,
    transition: {
      delay,
      duration: 0.15,
      ease: "easeOut",
    },
  }),
  exit: {
    scaleX: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

type WindowProps = {
  children: React.ReactNode
  style?: React.CSSProperties
  delay?: number 
}

const Window = ({children, style, delay}: WindowProps) => {
    return (
      <motion.div 
        variants={expandFromCenterTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={delay || 0}
        className={classNames.window}
        style={style}
      >
        {children}
      </motion.div>
    )
}