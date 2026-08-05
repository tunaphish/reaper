
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './battle.module.css';
import { Battle } from './Battle';
import { Menu } from './battleStore';
import { observer } from 'mobx-react-lite';
import { ResourceDisplayWrapper } from './ResourceDisplay';
import { Enemy } from '../../model/enemy';
import { PanelWindow, Window } from '../ui/Window';
import { Ally } from '../../model/ally';
import { MenuOptionsView } from '../ui/MenuOptionsView';
import { getRandomInt } from '../../model/math';
import { Technique } from '../../model/technique';
import { BaseWindow, EventType, ImageWindow, WindowLayout } from '../../model/encounter';
import { ImageWindowContent } from '../ui/ImageWindowContent';

export const BattleView = observer((props: { battle: Battle }): JSX.Element => {
  const { battle: battle } = props
  return (
    <div className={classNames.container}>
      <EnemiesContainer battle={battle} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',  }}>
          {
            props.battle.battleStore.activeAlly && 
            props.battle.battleStore.activeAlly.techniques.map(technique => <TechniqueView battle={props.battle} technique={technique} key={technique.name}/>)
          }
      </div>
      <AllyBarView battle={props.battle} /> 
      {/* <Description battle={battle} /> */}      
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

export const Description = observer(({battle}: {battle: Battle}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: "5px",
  } 

  return (
  <>
    { battle.battleStore.executable && <Window style={style}>{battle.battleStore.executable.description}</Window> }  
  </>

  )
});

export const EnemiesContainer = observer(({battle}: {battle: Battle}) => {
  return (
    <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <AnimatePresence>
        {
          battle.battleStore.enemies.map((enemy, idx) => (
             <EnemyView battle={battle} enemy={enemy} idx={idx} key={enemy.name + idx} count={battle.battleStore.enemies.length} />
          ))
        }
      </AnimatePresence>
    </div>
  )
});


const EnemyView = observer(
  (props: { battle: Battle, enemy: Enemy; idx: number; count: number }): JSX.Element => {
    const { battle, enemy } = props;

    const ref = React.useRef<HTMLDivElement>(null);
    const popups = usePhaserDamagePopups(battle, ref, enemy.name);

    return (      
        <div style={{ width: "50%" }}>
          <div ref={ref}>
            <ResourceDisplayWrapper combatant={enemy} battle={battle}>
              <img src={enemy.combatPortraitSrc}></img>
            </ResourceDisplayWrapper>
            <div>{enemy.castingExecutable?.executable?.name || enemy.strategies[enemy.selectedStrategyIndex].option.name}</div>
          </div>
          {popups.map((p) => (
            <div key={p.id} className={p.value > 0 ? classNames.damagePopup : classNames.healPopup}>
              {Math.abs(p.value)}
            </div>
          ))}
        </div>
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

const MenuView = observer((props: { battle: Battle, menu: Menu, idx: number, verticalOffset: number, horizontalOffset: number }): JSX.Element => {
  const { battle, menu, idx, verticalOffset, horizontalOffset } = props;

  const style: React.CSSProperties = {
    position: "absolute",
    top: verticalOffset + "px", 
    left: horizontalOffset + "px",
  }

  return (
    <Window style={style}>
      <div className={classNames.windowTitleBar}>
        <div className={classNames.menuTitleText}>{menu.title}</div>
        <div>X</div>
      </div>
      <div className={classNames.menuContent} style={{ width: 'max-content' }}>
        <MenuOptionsView 
          items={menu.menuOptions}
          getKey={(item) => item.display} 
          renderLabel={(item) => item.display()}
          onSelect={(item) => { 
            battle.playChoiceSelectSound(); 
            item.execute();
          }}
          isCursor={menu.isCursor}
        /> 
      </div>
    </Window>
  )
});


const AllyView = observer((props: { battle: Battle, ally: Ally, idx: number }): JSX.Element => {
  const { battle, ally, idx } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const popups = usePhaserDamagePopups(battle, ref, ally.name);
  
  return (
    <div className={classNames.allyViewWrapper}>
      <div className={classNames.allyViewInner} ref={ref}>
        <ResourceDisplayWrapper combatant={ally} battle={battle} onClickCell={() => battle.setAlly(ally)} idx={idx}>
          <></>
        </ResourceDisplayWrapper>
      </div>
      
      {popups.map((p) => (
        <div key={p.id} className={p.value > 0 ? classNames.damagePopup : classNames.healPopup}>
          {Math.abs(p.value)}
        </div>
      ))}
    </div>

  )
});

const TechniqueView = observer((props: { battle: Battle, technique: Technique }): JSX.Element => {
  const imageWindow: ImageWindow = {
    type: EventType.IMAGE,
    layout: {
      x: props.technique.position.x,
      y: props.technique.position.y,
    },
    layers: [{
      src: props.technique.imageSrc
    }],
  };
  const style: React.CSSProperties = {
    width: 'fit-content',
  };

  return (
    <PanelWindow style={style} window={imageWindow}>
      {props.technique.imageSrc ? <ImageWindowContent imageWindow={imageWindow}/> : <div>{props.technique.name}</div>}
    </PanelWindow>
  )
});


const AllyBarView = observer((props: { battle: Battle }): JSX.Element => (
  <div className={classNames.allyBar}>
    <AnimatePresence>
      {props.battle.battleStore.allies.map((ally,i) => <AllyView battle={props.battle} ally={ally} key={ally.name} idx={i}/>)}
    </AnimatePresence>
  </div>
));

