
import * as React from 'react';
import { motion } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { Ally } from '../../model/ally';
import { MenuState } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';

import { enemies } from '../../data/enemies';
import { Enemy } from '../../model/enemy';

export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      {props.world.worldStore.menuState !== MenuState.NONE && <MenuContainer world={world} />}
      <StartBar world={world} />
    </div>
  )
});

const MenuContainer = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  return (
    <div className={classNames.menuContainer}>
      {world.mapData.musicKey && <NowPlayingView world={world} />}
      {world.worldStore.menuState === MenuState.JOURNAL && <JournalTypeView world={world} />}
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

enum JournalMenuState {
  NONE = 'none',
  ENEMIES = 'enemies',
  TECHNIQUES = 'techniques',
}

const EnemyListView = (props: { world: World }): JSX.Element => {
  const [displayedEnemy, setDisplayedEnemy] = React.useState<Enemy>(null);
  const displayedEnemies = getDisplayedEnemies(enemies, props.world.worldStore.playerSave.seenEnemies);
  return (
    <>
      {displayedEnemy && <Window style={{ position: 'absolute', top: '350px', left: '200px', padding: '5px', zIndex: 5 }}>{displayedEnemy.name}</Window>}
      {displayedEnemy && <Window style={{ position: 'absolute', top: '400px', left: '100px', width: '300px', padding: '5px', zIndex: 5 }}>{displayedEnemy.journalDescription}</Window>}
      <Window style={{ position: 'absolute', top: '300px', right: '10px', padding: '5px', zIndex: 5 }}>
        { displayedEnemies.map(enemy => <div key={enemy.name} onClick={() => setDisplayedEnemy(enemy)}>{enemy.name}</div>)}
      </Window>
    </>
    
  )
}

const JournalTypeView = (props: { world: World }): JSX.Element => {
  const [journalMenuState, setJournalMenuState] = React.useState(JournalMenuState.NONE);

  return (
    <>
      {journalMenuState === JournalMenuState.ENEMIES && <EnemyListView world={props.world}/>}
      <Window style={{ position: 'absolute', top: '300px', left: '10px', padding: '5px', zIndex: 5 }}>
        <div onClick={() => setJournalMenuState(JournalMenuState.ENEMIES)}>Enemies</div>
        <div onClick={() => setJournalMenuState(JournalMenuState.TECHNIQUES)}>Techniques</div>
      </Window>
    </> 
  )
}

const LocationNameView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', bottom: '50px', left: '10px', padding: '5px', zIndex: 5 }}>Location: {props.world.mapData.locationName}</Window>
const NowPlayingView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', top: '10px', right: 'left', padding: '5px' }}>Now Playing: {props.world.mapData.musicKey}</Window>
const SpiritsView = (props: { world: World }): JSX.Element => <Window style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px' }}>Spirits: {props.world.worldStore.playerSave.spirits}</Window>

const MenuOptions = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  const style: React.CSSProperties = {
    zIndex: 5,
    position: 'absolute',
    right: '20px',
    bottom: '40px',
  }

  const onClickInventory = () => {
    world.setMenu(MenuState.INVENTORY);
  }

  const onClickJournal = () => {
    world.setMenu(MenuState.JOURNAL);
  }

  const onClickExit = () => {
    world.setMenu(MenuState.NONE);
  }

  return (
    <Window style={style}>
      <div className={classNames.menuContainer}>
        <div onClick={onClickInventory}>Inventory</div>
        <div onClick={onClickJournal}>Journal</div>
        <div onClick={onClickExit}>Exit</div>
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
  return (
    <div className={classNames.combatantBar}>
        {allies.map((ally) => <AllyView ally={ally} key={ally.name}/>)}
    </div>
  )
}

const AllyView = (props: { ally: Ally }): JSX.Element => {
  const { ally } = props;

  const style: React.CSSProperties = {
    width: '100%',
    padding: '5px',
  }

  return (
    <Window key={ally.name} style={style}>
      {ally.name}
      <Meter value={ally.health} max={ally.maxHealth} className={classNames.healthMeter}></Meter>
    </Window>
  );
}

const expandFromCenterTransition = {
  initial: {
    scaleX: 0,
    transformOrigin: "center",
    
  },
  animate: {
    scaleX: 1,
    
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
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
}

const Window = ({children, style}: WindowProps) => {
    return (
      <motion.div 
        variants={expandFromCenterTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className={classNames.window}
        style={style}
      >
        {children}
      </motion.div>
    )
}