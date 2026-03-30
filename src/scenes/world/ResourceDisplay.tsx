import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'framer-motion';
import { Combatant, getStatus, Status, techniqueIsViolated } from '../../model/combatant';
import classNames from './world.module.css';
import { Ally } from '../../model/ally';
import { PanelWindow, Window } from './Window';
import { ImageWindowContent } from './ImageWindowContent';
import { EventType, ImageWindow, TextSpeed } from '../../model/encounter';
import { TypewriterText } from './TypewriterText';
import { Technique } from '../../model/technique';
import { OptionType } from '../../model/option';
import { World } from './World';
import { MenuCursor } from './MenuOptionsView';
import clsx from 'clsx';

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
      {combatant.castingExecutable && <Meter value={combatant.castingExecutable.castedTimeInMs} max={combatant.castingExecutable.executable.castTimeInMs} />}
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


      {combatant.activeTechniques.map((activeTechnique, i) => (
        <img
          key={`tech-${i}`}
          src={activeTechnique.technique.iconSrc || "/reaper/ui/icons/attack.png"}
          className={clsx(classNames.techniqueIcon, activeTechnique.violated && classNames.stigma)}
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
    statusToStylesMap[getStatus(props.combatant)],
  ];

  const onClick = () => {
    props.world.selectTarget(props.combatant);
  }
  
  return (
    <>
      <div className={className.join(' ')} onClick={props.onClickCell || onClick}>
          <div className={classNames.characterCellContainer} >
            { props.world.worldStore?.targets?.some(target => target.name === props.combatant.name) && <MenuCursor size={48}/>}
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

export const Streaks = (): JSX.Element => {
  const [streaks, setStreaks] = React.useState([]);

  React.useEffect(() => {
    const generated = Array.from({ length: 60 }).map(() => {
      const levels = ["low", "medium", "high"] as const;
      const intensity = levels[Math.floor(Math.random() * levels.length)];

      let heightMod = 1,
        speedMod = 1,
        opacityMod = 1;

      switch (intensity) {
        case "low":
          heightMod = 0.7;
          speedMod = 0.7;
          opacityMod = 0.5;
          break;
        case "medium":
          heightMod = 1;
          speedMod = 1;
          opacityMod = 1;
          break;
        case "high":
          heightMod = 1.5;
          speedMod = 1.5;
          opacityMod = 1.2;
          break;
      }

      return {
        left: Math.random() * 100,
        height: (50 + Math.random() * 100) * heightMod,
        duration: (0.5 + Math.random() * 1.5) / speedMod, // shorter = faster
        opacity: Math.min(0.2 + Math.random() * 0.3 * opacityMod, 1),
        intensity
      };
    });

    setStreaks(generated);
  }, []);

  return (
    <div className={classNames.streaksContainer}>
      {streaks.map((s, i) => (
        <div
          key={i}
          className={classNames.streak}
          style={{
            left: `${s.left}vw`,
            height: `${s.height}px`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity
          }}
        />
      ))}
    </div>
  );
};

export const TechniqueView = (props: {technique: Technique; position: { x: number; y: number }, combatant: Combatant;}): JSX.Element => {
  const { technique, position, combatant } = props;
  const color = techniqueIsViolated(combatant, technique) ? 'red' : '';

  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${position.y}%`,
    left: `${position.x}%`,
    padding: '5px',
    color
  };

  return <Window style={style}>{technique.name}</Window>;
};

const CastingWindow = observer(({ ally, world }: { ally: Ally, world: World }) => {
  const { castingExecutable } = ally;
  const techniques = castingExecutable?.appliedTechniques || [];

  const positions = React.useMemo(() => getNonOverlappingPositions(techniques.length), [techniques.length]);
  const [visibleCount, setVisibleCount] = React.useState(0);

  const baseDelay = 200; 
  const castTimeMs = castingExecutable?.executable?.castTimeInMs ?? 0;
  const stepMs = techniques.length > 0 
    ? (castTimeMs * 0.8) / (techniques.length + 1)
    : 0;

  React.useEffect(() => {
    if (!castingExecutable) return;

    setVisibleCount(0);

    const timers = techniques.map((technique, i) => {
      return window.setTimeout(() => {
        world.checkActionTechniqueConditionMet(ally, castingExecutable.targets, technique);
        setVisibleCount(prev => prev + 1);
      }, baseDelay + stepMs * (i + 1));
    });

    return () => timers.forEach(clearTimeout);
  }, [castingExecutable, stepMs, baseDelay, techniques, world.sound]);

  const castingImageSrc = castingExecutable?.executable?.castingImageSrc;
  if (!castingImageSrc) return null;

  const imageWindow: ImageWindow = {
    type: EventType.IMAGE,
    layout: { x: 10, y: -160, width: 120 },
    layers: [{ src: castingImageSrc }]
  };

  return (
    <AnimatePresence>
      <PanelWindow window={imageWindow} style={{ position: 'absolute', display: 'grid', gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}>
        
        <Window style={{ position: 'absolute', top: '-25px', left: '25px', fontSize: '18px' }} delay={baseDelay / 1000}>
          <TypewriterText textSpeed={TextSpeed.SLOW} line={[{ text: castingExecutable.executable.name }]} />
        </Window>

        <div style={{ width: '100%', height: '100%', gridRow: 1, gridColumn: 1 }}>
          <ImageWindowContent imageWindow={imageWindow} />
        </div>
        {castingExecutable.violated && <div className={classNames.violation}>VIOLATION</div>}
        {techniques.slice(0, visibleCount).map((tech, i) => (
          <TechniqueView key={tech.name} technique={tech} position={positions[i]} combatant={ally}/>
        ))}
      </PanelWindow>
    </AnimatePresence>
  );
});

const getNonOverlappingPositions = (count: number) =>
  Array.from({ length: count }, () => {
    const border = Math.floor(Math.random() * 3);
    return border === 0
      ? { x: 70, y: Math.random() * 50 + 25 }
      : border === 1
      ? { x: 0, y: Math.random() * 50 + 25 }
      : { x: Math.random() * 50 + 25, y: 90 };
  }).sort(() => Math.random() - 0.5);