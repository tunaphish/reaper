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

export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[classNames.meterBackground, className].join(' ')}>
      <div className={classNames.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}

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

export const ResourceDisplay = observer((props: {ally: Ally, onClickCell?: () => void}) => {
  const statusToStylesMap = {
    [Status.NORMAL]: '',
    [Status.DEAD]: classNames.DEAD,
    [Status.EXHAUSTED]: classNames.EXHAUSTED,
  };
  const className = [
    classNames.window,
    statusToStylesMap[props.ally.status],
  ];
  
  const baseAP = props.ally.maxActionPoints;
  const totalAP = Math.floor(props.ally.actionPoints);
  const overflowAP = Math.max(0, totalAP - baseAP);

  const progress = ((props.ally.actionPoints % 1) + 1) % 1;
  const actionPointMeterHeight = (progress * 100) + '%';
  const castingWindowHeight = (props.ally.castingAction ? (props.ally.castingAction.castedTimeInMs / props.ally.castingAction.option.castTimeInMs)*100 : 0) + '%'

  return (
    <>
      <div className={className.join(' ')} onClick={props.onClickCell}>
          <div className={classNames.characterCellContainer}>
            <CombatantHealthBar combatant={props.ally} />
            <div className={classNames.actionPointsContainer}
              style={{ 
                flex: '1',
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr", 
              }}
            >
              <motion.div 
                className={classNames.actionPointMeterWindow}
                animate={{ height: actionPointMeterHeight }}
                transition={{ duration: 0 }}
              />
              <motion.div 
                className={classNames.castingWindow}
                animate={{ height: castingWindowHeight }}
                transition={{ duration: 0 }}
              />
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


              {props.ally.activeTechniques.map((technique, i) => (
                <img
                  key={`tech-${i}`}
                  src={technique.iconSrc || "/reaper/ui/icons/attack.png"}
                  className={classNames.techniqueIcon}
                />
              ))}
              </div>
            </div>
        </div>
      </div>
      <CastingWindow ally={props.ally} />
    </>

  )
});


export const TechniqueView = (props: { technique: Technique, delay: number }): JSX.Element => {
  const { technique } = props;

  const getRandomBorderPoint = () => {
    const boxSize = 100;
    const y = Math.random() * boxSize;
    const center = boxSize / 2;
    const heightFactor = 4; // Adjust this for how high the arc is
    const x = heightFactor * (1 - Math.pow((y - center) / center, 2)) - 20; // Parabolic formula
    return [x, y];
  }

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

const CastingWindow = (props: {ally: Ally }) => {
  const { castingAction } = props.ally;
  const imageWindow: ImageWindow = {
    type: EventType.IMAGE,
    layout: {
      x: 25,
      y: -150,
      width: 150,
    },
    layers: [{
      src: castingAction?.option?.castingImageSrc,
    }]
  }

  const baseDelay = 0.2; 

  return (
    <AnimatePresence>
      {
        castingAction && castingAction.option.castingImageSrc &&
        <div style={{ position: 'relative', top: '-40px', left: '75' }}>
          <PanelWindow window={imageWindow}>
            <Window style={{ position: 'absolute', top: '-20px', left: '50px', zIndex: 20, fontSize: '18px' }} delay={baseDelay}>
              <TypewriterText textSpeed={TextSpeed.SLOW} line={[{ text: castingAction.option.name }]}/>
            </Window>
            <ImageWindowContent imageWindow={imageWindow}/>
          </PanelWindow>
          {[...props.ally.activeTechniques].map((technique, index, arr) => {
              const techniques = [...props.ally.activeTechniques];
              const castTimeSec = (castingAction.option.castTimeInMs ?? 0) / 1000;
              const END_BUFFER_RATIO = 0.2;
              const activeItemCount = techniques.length + 1;
              const activeTime = castTimeSec * (1 - END_BUFFER_RATIO);
              const step = activeItemCount > 0 ? activeTime / activeItemCount : 0;
              const delay = step * (index + 1);

              return (
                <TechniqueView
                  key={technique.name}
                  technique={technique}
                  delay={delay}
                />
              );
            })}
        </div >
      }
      
    </AnimatePresence>
  )
}


