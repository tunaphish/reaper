import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Combatant } from '../../model/combatant';
import classNames from './battle.module.css';
import { Battle } from './Battle';
import { MenuCursor } from '../ui/MenuOptionsView';
import clsx from 'clsx';
import { Window } from '../ui/Window';

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
        <div>{combatant.name}</div>
        <div>
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
        </div>



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


export const ResourceDisplayWrapper = observer((props: {combatant: Combatant, children: React.ReactNode, onClickCell?: () => void, battle: Battle, idx?: number}) => {

  const onClick = () => {
    props.battle.selectTarget(props.combatant);
  }
  
  return (
    <>
      <Window onClick={props.onClickCell || onClick} delay={(props.idx || 0) * .15 + .3}>
          <div className={classNames.characterCellContainer} >
            { props.battle.battleStore?.targets?.some(target => target.name === props.combatant.name) && <MenuCursor size={48}/>}
            <ActionBar combatant={props.combatant} />
            <div className={classNames.portraitContainer } >
              <Meter vertical value={props.combatant.health} max={props.combatant.maxHealth} className={classNames.bleedMeter} />
              <Meter  vertical value={props.combatant.health - props.combatant.bleed} max={props.combatant.maxHealth} className={classNames.healthMeter} />
              {props.children}
              <div className={classNames.healthNumber}>{Math.trunc(props.combatant.health)}</div>
            </div>
        </div>
      </Window>
    </>
  )
});

