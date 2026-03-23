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
}) => {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px' }}>
            <div style={{ fontSize: '12px' }}>{props.combatant.name}</div>
            <div style={{ fontSize: '12px' }}>{Math.ceil(props.combatant.health)}</div>
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
      {props.combatant.type === OptionType.ALLY && <CastingWindow ally={props.combatant as ally} world={props.world} />}
    </>

  )
});


export const TechniqueView = (props: { technique: Technique, delay: number, world: World }): JSX.Element => {
  const { technique, world, delay } = props;

  const getRandomBorderPoint = () => {
    const boxSize = 100;
    const y = Math.random() * boxSize;
    const center = boxSize / 2;
    const heightFactor = 4; // Adjust this for how high the arc is
    const x = heightFactor * (1 - Math.pow((y - center) / center, 2)) - 20; // Parabolic formula
    return [x, y];
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (technique.soundKeyName) {
        world.sound.play(technique.soundKeyName);
      }
    }, delay * 1000); 

    return () => clearTimeout(timeout); 
  }, [technique, world, delay]);

  const style: React.CSSProperties = React.useMemo(() => {
    const [topPos, leftPos] = getRandomBorderPoint();
    const top = `${topPos}px`; 
    const left = `${leftPos}%`;

    return {
      position: 'absolute', 
      top, 
      left,
      padding: '5px',
      zIndex: 10,
    }
  }, []);

  return <Window style={style} delay={props.delay}>{technique.name}</Window>
}

const CastingWindow = observer(({ ally, world }: { ally: Ally, world: World }) => {
  const { castingAction } = ally;

  if (!castingAction?.option?.castingImageSrc) return null;

  const imageWindow: ImageWindow = {
    type: EventType.IMAGE,
    layout: { x: 25, y: -150, width: 150 },
    layers: [{ src: castingAction.option.castingImageSrc }]
  };

  const baseDelay = 0.2;
  const castTimeSec = (castingAction.option.castTimeInMs ?? 0) / 1000;
  const END_BUFFER_RATIO = 0.2;
  const activeItemCount = castingAction.appliedTechniques.length + 1;
  const step = activeItemCount > 0 ? (castTimeSec * (1 - END_BUFFER_RATIO)) / activeItemCount : 0;

  return (
    <AnimatePresence>
      <div style={{ position: 'relative', top: '-40px', left: '75' }}>
        <PanelWindow window={imageWindow}>
          <Window
            style={{ position: 'absolute', top: '-20px', left: '50px', zIndex: 20, fontSize: '18px' }}
            delay={baseDelay}
          >
            <TypewriterText textSpeed={TextSpeed.SLOW} line={[{ text: castingAction.option.name }]} />
          </Window>
          <ImageWindowContent imageWindow={imageWindow} />
        </PanelWindow>

        {castingAction.appliedTechniques.map((technique, index) => (
          <TechniqueView
            key={technique.name}
            technique={technique}
            delay={step * (index + 1)}
            world={world}
          />
        ))}
      </div>
    </AnimatePresence>
  );
});
