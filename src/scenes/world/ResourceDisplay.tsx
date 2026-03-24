import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import classNames from './world.module.css';
import { Ally } from '../../model/ally';
import { PanelWindow, Window } from './Window';
import { ImageWindowContent } from './ImageWindowContent';
import { EventType, ImageWindow, TextSpeed } from '../../model/encounter';
import { TypewriterText } from './TypewriterText';
import { Technique } from '../../model/technique';
import { OptionType } from '../../model/option';
import { World } from './World';

export const Meter = (props: {
  value: number;
  max: number;
  className?: string;
  vertical?: boolean;
}): JSX.Element => {
  const { className, value, max, vertical } = props;

  const percent = Math.min(Math.round((value / max) * 100), 100) + "%";

  const style = vertical
    ? { height: percent }
    : { width: percent };

  return (
    <div className={classNames.meterBackground}>
      <div
        className={[classNames.meter, className].join(" ")}
        style={style}
      />
    </div>
  );
};

export const CombatantHealthBar = observer((props: { combatant: Combatant }) => {
  return <div className={classNames.meterContainer}>
          <Meter value={props.combatant.health} max={props.combatant.maxHealth} className={classNames.bleedMeter} />
          <Meter value={props.combatant.health - props.combatant.bleed} max={props.combatant.maxHealth} className={classNames.healthMeter} />
          <div className={classNames.healthBarRow}>
            <div className={classNames.healthBarLabel}>{props.combatant.name}</div>
            <div className={classNames.healthBarLabel}>{Math.ceil(props.combatant.health)}</div>
          </div>
        </div>;
});


export const ActionBar = observer((props: { combatant: Combatant }) => {
  const { combatant } = props;

  const baseAP = combatant.maxActionPoints;
  const totalAP = Math.floor(combatant.actionPoints);
  const overflowAP = Math.max(0, totalAP - baseAP);

  return (
    <div className={classNames.meterContainer}>
      <Meter value={((combatant.actionPoints % 1) + 1) % 1} max={1} className={classNames.actionPointMeterWindow} />
      {combatant.castingAction && <Meter value={combatant.castingAction.castedTimeInMs} max={combatant.castingAction.option.castTimeInMs} />}
      <div className={classNames.actionPointRow}>
        {Array.from({ length: baseAP }).map((_, i) => (
          <div
            key={`base-${i}`}
            className={[
              classNames.actionPointToken,
              i < totalAP ? classNames.filled : classNames.empty,
            ].join(' ')}
          />
        ))}

        {Array.from({ length: overflowAP }).map((_, i) => (
          <div
            key={`overflow-${i}`}
            className={classNames.overflowToken}
          />
        ))}


      {combatant.activeTechniques.map((technique, i) => (
        <img
          key={`tech-${i}`}
          src={technique.iconSrc || "/reaper/ui/icons/attack.png"}
          className={classNames.techniqueIcon}
        />
      ))}
      </div>
    </div>
  );

});


export const ResourceDisplay = observer((props: {combatant: Combatant, onClickCell?: () => void, world: World}) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: classNames.DEAD,
    [Status.EXHAUSTED]: classNames.EXHAUSTED,
  };
  const className = [
    classNames.window,
    statusToStylesMap[props.combatant.status],
  ];
  
  return (
    <>
      <div className={className.join(' ')} onClick={props.onClickCell}>
          <div className={classNames.characterCellContainer} >

            <div className={classNames.portraitContainer } >
              <Meter vertical value={props.combatant.health} max={props.combatant.maxHealth} className={classNames.bleedMeter} />
              <Meter  vertical value={props.combatant.health - props.combatant.bleed} max={props.combatant.maxHealth} className={classNames.healthMeter} />
              <img  src={props.combatant.combatPortraitSrc}></img>
              <div className={classNames.healthNumber}>{Math.trunc(props.combatant.health)}</div>
            </div>
            <ActionBar combatant={props.combatant} />
        </div>
      </div>
      {props.combatant.type === OptionType.ALLY && <CastingWindow ally={props.combatant as Ally} world={props.world} />}
    </>

  )
});


export const TechniqueView = (props: {
  technique: Technique;
  delay: number;
  world: World;
  position: { x: number; y: number };
}): JSX.Element => {
  const { technique, world, delay, position } = props;
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (technique.soundKeyName) {
        world.sound.play(technique.soundKeyName);
      }
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [technique, world, delay]);

  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${position.y}%`,
    left: `${position.x}%`,
    padding: '5px',
  };

  return <Window style={style} delay={delay}>{technique.name}</Window>;
};

const CastingWindow = observer(({ ally, world }: { ally: Ally, world: World }) => {
  const { castingAction } = ally;

  const positions = React.useMemo(() => {
    return getNonOverlappingPositions(ally.activeTechniques.length);
  }, [ally.activeTechniques.length]);

  if (!castingAction?.option?.castingImageSrc) return null;

  const imageWindow: ImageWindow = {
    type: EventType.IMAGE,
    layout: { x: 10, y: -160, width: 120 },
    layers: [{ src: castingAction.option.castingImageSrc }]
  };

  const baseDelay = 0.2;
  const castTimeSec = (castingAction.option.castTimeInMs ?? 0) / 1000;
  const END_BUFFER_RATIO = 0.2;
  const activeItemCount = ally.activeTechniques.length + 1;
  const step = activeItemCount > 0 ? (castTimeSec * (1 - END_BUFFER_RATIO)) / activeItemCount : 0;

  return (
    <AnimatePresence>
      <PanelWindow window={imageWindow} style={{ position: 'absolute' }}>
        <Window
          style={{ position: 'absolute', top: '-25px', left: '25px',fontSize: '18px' }}
          delay={baseDelay}
        >
          <TypewriterText textSpeed={TextSpeed.SLOW} line={[{ text: castingAction.option.name }]} />
        </Window>
        <ImageWindowContent imageWindow={imageWindow} />
        {ally.activeTechniques.map((technique, index) => {
          const position = positions[index];
          return (
            <TechniqueView
              key={technique.name}
              technique={technique}
              delay={step * (index + 1)}
              world={world}
              position={position} 
            />
          );
        })}
      </PanelWindow>
    </AnimatePresence>
  );
});

const getNonOverlappingPositions = (count: number) => {
  type Position = { x: number; y: number };
  const positions: Position[] = [];

  for (let i = 0; i < count; i++) {
    const border = Math.floor(Math.random() * 3);
    let x = 0;
    let y = 0;

    switch (border) {
      case 0:
        x = 70;
        y = Math.random() * 50 + 25;
        break;
      case 1:
        x = 0;
        y = Math.random() * 50 + 25;
        break;
      case 2:
        x = Math.random() * 50 + 25;
        y = 90;
        break;
    }

    positions.push({ x, y });
  }

  return positions.sort(() => Math.random() - 0.5);
};