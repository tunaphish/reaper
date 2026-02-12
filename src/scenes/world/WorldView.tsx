
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { MenuState } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';
import { TypewriterText } from '../shared/TypewriterText';
import { enemies } from '../../data/enemies';
import { Enemy } from '../../model/enemy';
import { CursorList } from '../shared/CursorList';
import { ImageWindowContent, Window } from '../shared';
import { TextSpeed, TextWindow, Window as WindowModel, Event, EventType, ImageWindow } from '../../model/encounter';
import { PanelWindow } from '../shared/Window';

export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <AnimatePresence mode="wait">
        {props.world.worldStore.menuState !== MenuState.NONE && <MenuContainer world={world} />}
      </AnimatePresence>
      <EncounterContainer world={world} />
    </div>
  )
});

// #region Menu 

const MenuContainer = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  return (
    <>
      {world.mapData.musicKey && <NowPlayingView world={world} />}
      <AnimatePresence mode="wait">
        {world.worldStore.menuState === MenuState.JOURNAL && <JournalTypeView world={world} />}
      </AnimatePresence>
      <LocationNameView world={world} />
      <SpiritsView world={world} />
      <MenuOptions world={world} />
      <AllyBarView world={world} />
    </>
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

const DisplayedEnemy = (props: { enemy: Enemy }): JSX.Element => {
  const enemyImageWindow: ImageWindow = getEnemyImageView(props.enemy);
  return (
    <>
      <Window style={{ position: 'absolute', top: '175px', left: '100px', padding: '5px', zIndex: 10 }}>{props.enemy.name}</Window>
      <Window style={{ position: 'absolute', top: '400px', left: '75px', width: '300px', padding: '5px', zIndex: 10 }}>{props.enemy.journalDescription}</Window>
      <PanelWindow window={enemyImageWindow}>
        <ImageWindowContent imageWindow={enemyImageWindow}/>
      </PanelWindow>
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


const AllyBarView = (props: { world: World }): JSX.Element => {
  const { allies } = props.world;
  
  const style: React.CSSProperties = {
    width: '120px',
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

 
// #endregion

// #region Encounter

export const EncounterContainer = observer(({world}: {world: World}) => (
  <>
    <AnimatePresence>
      {
        world.worldStore.windows.map((window, idx) => (
          <PanelWindow window={window} key={idx}>
            <WindowContentView window={window} world={world}/>
          </PanelWindow>
        ))
      }
    </AnimatePresence>
  </>
));

const WindowContentView = (props: { window: WindowModel, world: World }) => {
  switch (props.window.type) {
    case EventType.IMAGE:
      return <ImageWindowContent imageWindow={props.window} />
    case EventType.TEXT:
      return <TextWindowView textWindow={props.window} />
    default:
      return null
  }
}

const TextWindowView = (props: { textWindow: TextWindow }) => {
  const {line, speed} = props.textWindow;
  return <TypewriterText line={line} textSpeed={speed || TextSpeed.NORMAL} />
}

// #endregion