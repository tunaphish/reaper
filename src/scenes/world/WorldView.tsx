
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { Menu, MenuOption } from './worldStore';
import { observer } from 'mobx-react-lite';
import { ActionBar, CombatantHealthBar, ResourceDisplay } from './ResourceDisplay';
import { TypewriterText } from './TypewriterText';
import { Enemy } from '../../model/enemy';
import { ImageWindowContent, Window } from '.';
import { TextSpeed, TextWindow, Window as WindowModel, Event, EventType, ImageWindow, ObserveAction, ContextAction, ChoiceAction } from '../../model/encounter';
import { PanelWindow } from './Window';
import { Ally } from '../../model/ally';
import { Ticker } from './Ticker';
import { MenuOptionsView } from './MenuOptionsView';
import { getRandomInt } from '../../model/math';

export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <AnimatePresence>
        { world.worldStore.enemyJournalContent && <DisplayedEnemy enemy={world.worldStore.enemyJournalContent} />}
        { world.worldStore.systemsMenuOpen && <InfoView world={world} /> }
      </AnimatePresence>
      <EnemiesContainer world={world} />
      <EncounterContainer world={world} />
      <AllyBarView world={world} />
    </div>
)
});


//#region Combat


type DamagePopup = {
  id: number;
  value: number;
};

export const usePhaserDamagePopups = (
  scene: Phaser.Scene | null,
  ref: React.RefObject<HTMLElement>,
  target: string,
): DamagePopup[] => {
  const [popups, setPopups] = React.useState<DamagePopup[]>([]);
  const idRef = React.useRef(0);

  React.useEffect(() => {
    if (!scene || !ref.current) return;

    const handler = (data) => {
      if (data.name !== target) return;
      if (ref.current && data.value > 0) shakeElement(ref.current);

      const id = idRef.current++;
      setPopups((p) => [...p, { id, value: data.value }]);

      setTimeout(() => {
        setPopups((p) => p.filter((x) => x.id !== id));
      }, 20000);
    };

    scene.events.on("updated-damage", handler);
    return () => {
      scene.events.off("updated-damage", handler);
    };
  }, [scene, ref, target]);

  return popups;
}

export const EnemiesContainer = observer(({world}: {world: World}) => {
  return (
    <>
      <AnimatePresence>
        {
          world.worldStore.enemies.map((enemy, idx) => (
             <EnemyView world={world} enemy={enemy} idx={idx} key={enemy.name + idx} count={world.worldStore.enemies.length} />
          ))
        }
      </AnimatePresence>
    </>
  )
});


const EnemyView = observer(
  (props: { world: World, enemy: Enemy; idx: number; count: number }): JSX.Element => {
    const { world, enemy, idx, count } = props;

    const ref = React.useRef<HTMLDivElement>(null);
    const popups = usePhaserDamagePopups(world, ref, enemy.name);

    const STAGE_W = 450;
    const SIZE = 235;

    const positions: { x: number; y: number }[] = (() => {
      switch (count) {
        case 1:
          return [{ x: (STAGE_W - SIZE) / 2, y: 120 }];
        case 2:
          return [
            { x: 40, y: 120 },
            { x: STAGE_W - SIZE - 40, y: 120 },
          ];
        case 3:
          return [
            { x: (STAGE_W - SIZE) / 2, y: 80 },
            { x: 20, y: 340 },
            { x: STAGE_W - SIZE - 20, y: 340 },
          ];
        case 4:
        default:
          return [
            { x: 20, y: 80 },
            { x: STAGE_W - SIZE - 20, y: 80 },
            { x: 20, y: 360 },
            { x: STAGE_W - SIZE - 20, y: 360 },
          ];
      }
    })();

    const { x, y } = positions[idx];

    const enemyImageWindow: ImageWindow = {
      type: EventType.IMAGE,
      layout: {
        x,
        y,
        width: SIZE,
      },
      layers: [
        {
          src: enemy.baseImageSrc,
        },
      ],
    };

    return (      
        <PanelWindow window={enemyImageWindow} >
          <div ref={ref}>
            <ResourceDisplay combatant={enemy} world={world}/>
            <div>{enemy.castingAction?.option?.name || enemy.strategies[enemy.selectedStrategyIndex].option.name}</div>
          </div>
          {popups.map((p) => (
            <div key={p.id} className={p.value > 0 ? classNames.damagePopup : classNames.healPopup}>
              {Math.abs(p.value)}
            </div>
          ))}
        </PanelWindow>
    );
  }
);

export const shakeElement = (element: Element): void => {
  const duration = 350 + getRandomInt(100);
  
  const shakeTiming = {
    duration,
    timing: 'ease-in-out',
    iterationCount: 1,
  }

  const keyFrames = [];
  for (let i=0; i<10; i++) {
    keyFrames.push({ transform: `translate(${-20+getRandomInt(40)}px, ${-20+getRandomInt(40)}px) rotate(${-10+getRandomInt(20)}deg)`});
  }
  keyFrames.push({ transform: 'translate(0, 0) rotate(0)'});


  element.animate(keyFrames, shakeTiming);
}


//#endregion

const MenuView = observer((props: { world: World, menu: Menu, idx: number, verticalOffset: number, horizontalOffset: number }): JSX.Element => {
  const { world, menu, idx, verticalOffset, horizontalOffset } = props;
  const isTopMenu = world.worldStore.menus.length-1 === idx;

  const style: React.CSSProperties = {
    position: "absolute",
    top: verticalOffset + "px", 
    left: horizontalOffset + "px",
  }


  const onClickExit = (e) => {
    e.stopPropagation();
    if (!isTopMenu) return;
    world.popMenu();
  }


  return (
    <Window style={style}>
      <div className={classNames.windowTitleBar} onClick={(e) => onClickExit(e)}>
        <div className={classNames.menuTitleText}>{menu.title}</div>
        <div>X</div>
      </div>
      <div className={classNames.menuContent} style={{ width: 'max-content' }}>
        <MenuOptionsView 
          items={menu.menuOptions}
          getKey={(item) => item.display} 
          renderLabel={(item) => item.display()}
          onSelect={(item) => { 
            if (!isTopMenu) return;
            world.playChoiceSelectSound(); 
            item.execute();
          }}
          isCursor={menu.isCursor}
        /> 
      </div>
    </Window>
  )
});

const ContextActionView = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  switch (world.worldStore.contextAction.type) {
    case EventType.CHOICE:
      return <ChoiceView world={world} />
    case EventType.OBSERVE:
      return <ObserveView world={world} />
    default:
      return null
  }
});

const ObserveView = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  const contextAction = world.worldStore.contextAction as ObserveAction;
  const onClick = () => {
    world.onNextEncounter(contextAction.nextEncounter);
  }
  return (
    <Window style={{ padding: '5px' }} onClick={onClick}>{contextAction.display}</Window>
  );
});

const ChoiceView = (props: { world: World }): JSX.Element => {
  const choice = props.world.worldStore.contextAction as ChoiceAction;
  
  const style: React.CSSProperties = {
    position: "absolute",
    top: "-40px",
    left: "20px",
  }
  const choices = choice.isMutuallyExclusive ?
    choice.options.map((option, idx) => 
      <div key={idx} onClick={() => props.world.onNextEncounter(option.nextEncounter)}>
        {<TypewriterText line={option.line} textSpeed={TextSpeed.NORMAL} />}
      </div>
    ) :
    <MenuOptionsView 
      getKey={(item) => item.nextEncounter.id}
      items={choice.options}
      renderLabel={(item) => <TypewriterText line={item.line} textSpeed={TextSpeed.NORMAL} />}
      onSelect={(item) => props.world.onMultiSelect(item.nextEncounter)}
      isCursor={true}
    />

    choice.options.map((option, idx) =>
      <div key={idx} onClick={() => props.world.onMultiSelect(option.nextEncounter)}>
        {<TypewriterText line={option.line} textSpeed={TextSpeed.NORMAL} />}
      </div>
    );

  return (
    <Window style={style}>
      {choice.title && <TypewriterText line={choice.title} textSpeed={TextSpeed.NORMAL} />}
      { choices }
    </Window>
  )
}

const MenuStack = observer((props: { world: World }): JSX.Element => {
  const { world } = props;
  const { menus } = world.worldStore;
  const [widths, setWidths] = React.useState({});

  const setWidth = (idx, el) => {
    if (!el) return;
    const w = el.offsetWidth;
    setWidths(prev => (prev[idx] === w ? prev : { ...prev, [idx]: w }));
  };

 return <>
    {menus.map((menu, idx) => {
      const verticalOffset = (-20*idx) + (-20*menus[0].menuOptions.length);

      const prevWidth = widths[idx - 1] || 0;
      const direction = idx % 2 === 0 ? -1 : 1;
      const horizontalOffset = direction * (prevWidth / 2 + 20);

      return (
        <div ref={(el) => setWidth(idx, el)} key={idx}>
          <MenuView
            world={world}
            menu={menu}
            verticalOffset={verticalOffset}
            idx={idx}
            horizontalOffset={horizontalOffset}
          />
        </div>
      );
    })}
  </>
});


const AllyView = observer((props: { world: World, ally: Ally, idx: number }): JSX.Element => {
  const { world, ally, idx } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const popups = usePhaserDamagePopups(world, ref, ally.name);

  const isInEncounter = world.worldStore.windows.length > 0 || world.worldStore.contextAction;

  const onClick = () => {
    if (isInEncounter) {
      world.playChoiceDisabledSound();
      return;
    }

    world.setAlly(ally);
  }
  
  return (
    <div className={classNames.allyViewWrapper}>
      <div className={classNames.allyViewInner} ref={ref}>
        <ResourceDisplay combatant={ally} onClickCell={onClick} world={world}/>
      </div>
      <div className={classNames.allyMenuOverlay}>
        {ally.name === world.worldStore.activeAlly?.name && <MenuStack world={world} />}
        {ally.name === "Eji" && world.worldStore.contextAction && <ContextActionView world={world}  />}
      </div>
      {popups.map((p) => (
        <div key={p.id} className={p.value > 0 ? classNames.damagePopup : classNames.healPopup}>
          {Math.abs(p.value)}
        </div>
      ))}
    </div>

  )
});


const AllyBarView = observer((props: { world: World }): JSX.Element => (
  <div className={classNames.allyBar}>
    {props.world.worldStore.allies.map((ally,i) => <AllyView world={props.world} ally={ally} key={ally.name} idx={i}/>)}
  </div>
));

// #region Menu 


const getEnemyImageView = (enemy: Enemy): ImageWindow => {
  return {
    type: EventType.IMAGE,
    layout: {
      x: 100,
      y: 200,
      width: 250,
      height: 250,
    },
    layers: [{
      src: enemy.combatPortraitSrc,
    }]
  }
}

const DisplayedEnemy = (props: { enemy: Enemy }): JSX.Element => {
  const enemyImageWindow: ImageWindow = getEnemyImageView(props.enemy);
  return (
    <>
      <PanelWindow window={enemyImageWindow}>
        <ImageWindowContent imageWindow={enemyImageWindow}/>
      </PanelWindow>
      <Window style={{ position: 'absolute', top: '175px', left: '100px', padding: '5px' }}>{props.enemy.name}</Window>
      <Window style={{ position: 'absolute', top: '400px', left: '75px', width: '300px', padding: '5px'  }}>{props.enemy.journalDescription}</Window>
    </>
  )
}

const InfoView = (props: { world: World }): JSX.Element => (
  <>
    <div className={classNames.infoViewWrapper}>
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