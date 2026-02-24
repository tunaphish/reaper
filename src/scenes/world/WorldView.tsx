
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { Menu, MenuOption } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';
import { TypewriterText } from '../shared/TypewriterText';
import { Enemy } from '../../model/enemy';
import { ImageWindowContent, Window } from '../shared';
import { TextSpeed, TextWindow, Window as WindowModel, Event, EventType, ImageWindow, ActionEvent } from '../../model/encounter';
import { PanelWindow } from '../shared/Window';
import { Ally } from '../../model/ally';
import { Ticker } from './Ticker';
import { CursorList } from '../shared/CursorList';

export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <AnimatePresence>
        { world.worldStore.enemyJournalContent && <DisplayedEnemy enemy={world.worldStore.enemyJournalContent} />}
        { world.worldStore.systemsMenuOpen && <InfoView world={world} /> }
      </AnimatePresence>
      <EncounterContainer world={world} />
      <AllyBarView world={world} />
    </div>
  )
});

const MenuView = observer((props: { world: World, menu: Menu, idx: number }): JSX.Element => {
  const { world, menu, idx } = props;
  const isTopMenu = world.worldStore.menus.length-1 === idx;

  const verticalOffset = (-20*idx) + (-20*menu.menuOptions.length);
  const horizontalOffset = ((idx%2 ===0) ? 20 : 40) + 20 

  const style: React.CSSProperties = {
    position: "absolute",
    top: verticalOffset + "px", 
    left: horizontalOffset + "px",
  }

  const onClick = (option: MenuOption) => {
    if (!isTopMenu) return;
    world.playChoiceSelectSound();
    option.execute()
  }

  const onClickExit = (e) => {
    e.stopPropagation();
    if (!isTopMenu) return;
    world.popMenu();
  }

  const Content = menu?.isCursor ?
    <CursorList 
      items={menu.menuOptions}
      getKey={(item) => item.display} 
      renderLabel={(item) => <>{item.display}</>}
      onSelect={(item) => { world.playChoiceSelectSound(); item.execute(); }}
    /> :
    <>{menu.menuOptions.map(option => <div key={option.display} onClick={() => onClick(option)}>{option.display}</div>)}</>

  return (
    <Window style={style}>
        <div style={{ color: 'black', background: 'white', }} onClick={(e) => onClickExit(e)}>
          X
        </div>
        <div style={{ padding: '5px' }}>
          {Content}
        </div>
    </Window>
  )
});

const ActionEventView = observer((props: { world: World, actionEvent: ActionEvent }): JSX.Element => {
  const { world, actionEvent } = props;
  const onClick = () => {
    world.selectActionEvent(actionEvent);
  }
  return (
    <Window style={{ padding: '5px' }} onClick={onClick}>{actionEvent.display}</Window>
  );
});

const ActionEventsView = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  return <>{world.worldStore.actionEvents.map((actionEvent,idx) => <ActionEventView world={world} actionEvent={actionEvent} key={idx} />)}</>
});

const MenuStack = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  return <>{world.worldStore.menus.map((menu, idx) => <MenuView world={world} menu={menu} idx={idx} key={idx}/>)}</>
});


const AllyView = observer((props: { world: World, ally: Ally, idx: number }): JSX.Element => {
  const { world, ally, idx } = props;

  const isInEncounter = world.worldStore.windows.length > 0;

  const style: React.CSSProperties = {
    width: '100%',
    padding: '5px',
    position: 'relative',
    color: isInEncounter ? 'gray' : 'white',
  }

  const onClick = () => {
    if (isInEncounter) {
      world.playChoiceDisabledSound;
      return;
    }
    if (world.worldStore.activeAlly?.name === ally.name && world.worldStore.menus.length > 0) return;
    world.setAlly(ally);
  }
  
  return (
    <>
      <Window key={ally.name} style={style} delay={idx*0.15} onClick={onClick}>
        {ally.name}
        <Meter value={ally.health} max={ally.maxHealth} className={classNames.healthMeter}></Meter>
      </Window>
      <div style={{ position: "absolute", top: "-20px" }}>
        {ally.name === world.worldStore.activeAlly?.name && <MenuStack world={world} />}
        {ally.name === "Eji" && <ActionEventsView world={world} />}
      </div>
    </>

  )
});

// const ChoiceView = (props: { world: World }): JSX.Element => {
//   const choice = props.world.worldStore.choiceWindow;
//   const style: React.CSSProperties = {
//     position: "absolute",
//     top: "-20px",
//     width: '80%',
//     height: '100%',
//     margin: '10px',
//     display: 'flex',
//     zIndex: 100
//   }
//   return (
//     <Window style={style}>
//       {choice.title && <TypewriterText line={choice.title} textSpeed={TextSpeed.NORMAL} />}
//       {
//         choice.options.map((option, idx) => 
//           <div key={idx} onClick={() => props.world.selectChoice(option.nextEncounter)}>
//             {<TypewriterText line={option.line} textSpeed={TextSpeed.NORMAL} />}
//           </div>
//         )
//       }
//     </Window>
//   )
// }

const AllyBarView = observer((props: { world: World }): JSX.Element => (
  <div className={classNames.combatantBar}>
    {props.world.allies.map((ally,i) => <AllyView world={props.world} ally={ally} key={ally.name} idx={i}/>)}
  </div>
));

// #region Menu 


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

const InfoView = (props: { world: World }): JSX.Element => (
  <>
    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
      <Window style={{ padding: '5px', marginBottom: '5px' }} delay={0.05}>Location: {props.world.mapData.locationName}</Window>
      {props.world.mapData.musicKey && <Window style={{ padding: '5px', width: '200px' }} delay={0.15}><Ticker text={"Now Playing: " + props.world.mapData.musicKey}/></Window>}
    </div>
    <Window style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px' }} delay={0.25}>Spirits: {props.world.worldStore.playerSave.spirits}</Window>
  </>
)


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