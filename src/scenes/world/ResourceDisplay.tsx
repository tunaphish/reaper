import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Combatant, Status } from '../../model/combatant';
import classNames from './world.module.css';
import { Ally } from '../../model/ally';

export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[classNames.meterBackground, className].join(' ')}>
      <div className={classNames.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}


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

  return (
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
              className={classNames.castingWindow}
              animate={{ height: (Math.abs(props.ally.actionPoints%1) * 100) + '%' }}
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

            {overflowAP > 0 && (
              <div className={classNames.overflowRow}>
                {Array.from({ length: overflowAP }).map((_, i) => (
                  <div
                    key={`overflow-${i}`}
                    className={classNames.overflowToken}
                  />
                ))}
              </div>
            )}
          </div>
          </div>

       </div>
    </div>
  )
});

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
