
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './encounter.module.css';
import { EncounterScene } from './Encounter';
import { Menu } from './encounterStore';
import { observer } from 'mobx-react-lite';
import { ResourceDisplayWrapper } from './ResourceDisplay';
import { TypewriterText } from '../ui/TypewriterText';
import { Enemy } from '../../model/enemy';
import { ImageWindowContent } from '../ui/ImageWindowContent';
import { TextSpeed, TextWindow, Window as WindowModel, EventType, ImageWindow, ChoiceAction } from '../../model/encounter';
import { PanelWindow, Window } from '../ui/Window';
import { Ally } from '../../model/ally';
import { MenuOptionsView } from '../ui/MenuOptionsView';
import { getRandomInt } from '../../model/math';
import { getStatus } from '../../model/combatant';
import { toJS } from 'mobx';

export const EncounterView = observer((props: { encounter: EncounterScene }): JSX.Element => {
  const { encounter: encounter } = props
  return (
    <div className={classNames.container}>
      <Description encounter={encounter} />
      <EnemiesContainer encounter={encounter} />
      <EncounterContainer encounter={encounter} />
      <AllyBarView encounter={encounter} />
      {props.encounter.encounterStore.choiceAction && <ChoiceView encounter={encounter}  />}
    </div>
)
});

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

export const Description = observer(({encounter}: {encounter: EncounterScene}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: "5px",
  } 

  return (
  <>
    { encounter.encounterStore.executable && <Window style={style}>{encounter.encounterStore.executable.description}</Window> }  
  </>

  )
});

export const EnemiesContainer = observer(({encounter}: {encounter: EncounterScene}) => {
  return (
    <>
      <AnimatePresence>
        {
          encounter.encounterStore.enemies.map((enemy, idx) => (
             <EnemyView encounter={encounter} enemy={enemy} idx={idx} key={enemy.name + idx} count={encounter.encounterStore.enemies.length} />
          ))
        }
      </AnimatePresence>
    </>
  )
});


const EnemyView = observer(
  (props: { encounter: EncounterScene, enemy: Enemy; idx: number; count: number }): JSX.Element => {
    const { encounter, enemy, idx, count } = props;

    const ref = React.useRef<HTMLDivElement>(null);
    const popups = usePhaserDamagePopups(encounter, ref, enemy.name);

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
          src: enemy.combatPortraitSrc,
        },
      ],
    };

    return (      
        <PanelWindow window={enemyImageWindow} >
          <div ref={ref}>
            <ResourceDisplayWrapper combatant={enemy} encounter={encounter}>
              <img src={enemy.combatPortraitSrc}></img>
            </ResourceDisplayWrapper>
            <div>{enemy.castingExecutable?.executable?.name || enemy.strategies[enemy.selectedStrategyIndex].option.name}</div>
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

const MenuView = observer((props: { encounter: EncounterScene, menu: Menu, idx: number, verticalOffset: number, horizontalOffset: number }): JSX.Element => {
  const { encounter, menu, idx, verticalOffset, horizontalOffset } = props;
  const isTopMenu = encounter.encounterStore.menus.length-1 === idx;

  const style: React.CSSProperties = {
    position: "absolute",
    top: verticalOffset + "px", 
    left: horizontalOffset + "px",
  }


  const onClickExit = (e) => {
    e.stopPropagation();
    if (!isTopMenu) return;
    encounter.popMenu();
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
            encounter.playChoiceSelectSound(); 
            item.execute();
          }}
          isCursor={menu.isCursor}
        /> 
      </div>
    </Window>
  )
});

const ChoiceView = (props: { encounter: EncounterScene }): JSX.Element => {
  const choice = props.encounter.encounterStore.choiceAction;
  
  const style: React.CSSProperties = {
    position: "absolute",
    top: "-40px",
    left: "20px",
  }
  const choices = !!choice.isMutuallyExclusive ?
    choice.options.map((option, idx) => 
      <div key={idx} onClick={() => props.encounter.onNextEncounter(option.nextEncounter)}>
        {<TypewriterText line={option.line} textSpeed={TextSpeed.NORMAL} />}
      </div>
    ) :
    <MenuOptionsView 
      getKey={(item) => item.nextEncounter.id}
      items={choice.options}
      renderLabel={(item) => <TypewriterText line={item.line} textSpeed={TextSpeed.NORMAL} />}
      onSelect={(item) => props.encounter.onMultiSelect(item.nextEncounter)}
      isCursor={true}
    />

    choice.options.map((option, idx) =>
      <div key={idx} onClick={() => props.encounter.onMultiSelect(option.nextEncounter)}>
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

const MenuStack = observer((props: { encounter: EncounterScene }): JSX.Element => {
  const { encounter } = props;
  const { menus } = encounter.encounterStore;
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
            encounter={encounter}
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


const AllyView = observer((props: { encounter: EncounterScene, ally: Ally, idx: number }): JSX.Element => {
  const { encounter, ally, idx } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const popups = usePhaserDamagePopups(encounter, ref, ally.name);

  const isInEncounter = encounter.encounterStore.windows.length > 0 || encounter.encounterStore.choiceAction;

  const combatPortraitSrc = `/reaper/ui/ally/${ally.name}-${getStatus(ally)}.png`

  const onClick = () => {
    if (isInEncounter) {
      encounter.playChoiceDisabledSound();
      return;
    }

    encounter.setAlly(ally);
  }
  
  return (
    <div className={classNames.allyViewWrapper}>
      <div className={classNames.allyViewInner} ref={ref}>
        <ResourceDisplayWrapper combatant={ally} encounter={encounter} onClickCell={onClick} idx={idx}>
          <img src={combatPortraitSrc}></img>
        </ResourceDisplayWrapper>
      </div>

      <div className={classNames.allyMenuOverlay}>
        {ally.name === encounter.encounterStore.activeAlly?.name && <MenuStack encounter={encounter} />}
      </div>
      
      {popups.map((p) => (
        <div key={p.id} className={p.value > 0 ? classNames.damagePopup : classNames.healPopup}>
          {Math.abs(p.value)}
        </div>
      ))}
    </div>

  )
});


const AllyBarView = observer((props: { encounter: EncounterScene }): JSX.Element => (
  <div className={classNames.allyBar}>
    <AnimatePresence>
      {props.encounter.encounterStore.battleInitiated && props.encounter.encounterStore.allies.map((ally,i) => <AllyView encounter={props.encounter} ally={ally} key={ally.name} idx={i}/>)}
    </AnimatePresence>
    
  </div>
));



// #region Encounter

export const EncounterContainer = observer(({encounter}: {encounter: EncounterScene}) => (
  <>
    <AnimatePresence>
      {
        encounter.encounterStore.windows.map((window, idx) => (
          <PanelWindow window={window} key={idx}>
            <WindowContentView window={window} encounter={encounter}/>
          </PanelWindow>
        ))
      }
    </AnimatePresence>
  </>
));

const WindowContentView = (props: { window: WindowModel, encounter: EncounterScene }) => {
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