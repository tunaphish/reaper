
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { MenuState } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';

import { enemies } from '../../data/enemies';
import { Enemy } from '../../model/enemy';
import { CursorList } from './CursorList';
import { ImageWindowView } from '../shared/ImageWindowView';
import { EventType, ImageWindow } from '../../model/spread';

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

const getEnemyImageView = (enemy: Enemy): ImageWindow =>{
  return {
    type: EventType.IMAGE,
    layout: {
      x: 100,
      y: 200,
      width: 250,
      height: 250,
    },
    layers: [{
      src: enemy.baseImageSrc,
    }]
  }
}

const ImageWindowViewWrapper = (props: { imageWindow: ImageWindow }): JSX.Element => {
  const { layout } = props.imageWindow;
  const style: React.CSSProperties = {
    position: 'absolute',
    width: layout?.width ?? 380,
    height: layout?.height ?? 140,
    left: layout?.x ?? 225,
    top: layout?.y ?? 620,
  }
  return (
    <div style={style}>
      <ImageWindowView imageWindow={props.imageWindow}/>
    </div>
  )
}

const DisplayedEnemy = (props: { enemy: Enemy }): JSX.Element => {
  const enemyImageWindow: ImageWindow = getEnemyImageView(props.enemy);
  return (
    <>
      <Window style={{ position: 'absolute', top: '175px', left: '100px', padding: '5px', zIndex: 10 }}>{props.enemy.name}</Window>
      <Window style={{ position: 'absolute', top: '400px', left: '75px', width: '300px', padding: '5px', zIndex: 10 }}>{props.enemy.journalDescription}</Window>
      <ImageWindowViewWrapper imageWindow={enemyImageWindow}/>
    </>
  )
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
      {displayedEnemy && <DisplayedEnemy enemy={displayedEnemy} />}
      <Window style={{ position: 'absolute', bottom: '60px', left: '20px', padding: '5px', zIndex: 10 }}>
        <CursorList
          items={displayedEnemies}
          getKey={e => e.name}
          renderLabel={e => <div>{e.name}</div>}
          onSelect={onClickEnemyMenuOption}
        />
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

  const journalOptions = [
    JournalMenuState.ENEMIES,
    JournalMenuState.TECHNIQUES,
  ]

  return (
    <>
      <AnimatePresence mode="wait">
        {journalMenuState === JournalMenuState.ENEMIES && <EnemyListView world={props.world}/>}
      </AnimatePresence>
      <Window style={{ position: 'absolute', bottom: '60px', left: '150px', padding: '5px', zIndex: 10 }}>
        <CursorList
          items={journalOptions}
          getKey={s => s}
          renderLabel={s => <div>{s}</div>}
          onSelect={onClickJournalMenuOption}
        />
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

const MenuOptions = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  const style: React.CSSProperties = {
    zIndex: 5,
    position: 'absolute',
    right: '20px',
    bottom: '50px',
    padding: '5px'
  }


  const options = [
    { label: "Inventory", menuState: MenuState.INVENTORY },
    { label: "Journal", menuState: MenuState.JOURNAL },
    { label: "Exit", menuState: MenuState.NONE },
  ]

  return (
    <Window style={style}>
      <CursorList
        items={options}
        getKey={o => o.label}
        renderLabel={o => <span>{o.label}</span>}
        onSelect={(option) => world.setMenu(option.menuState)}
      />
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