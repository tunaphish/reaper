import * as React from 'react';
import classNames from './world.module.css';
import { Option, OptionType } from '../../model/option';
import { Technique } from '../../model/technique';
import { Combatant, techniqueIsActive } from '../../model/combatant';
import { Ally } from '../../model/ally';

export const actionMenuItem = (option: Option, ally: Ally): JSX.Element => {
    let className = ''

    if (option.type === OptionType.TECHNIQUE) {
        const technique = option as Technique;
        if (techniqueIsActive(ally, technique)) className = classNames.techniqueActive;
    }

    return (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} className={className}>
            <div>
            <img 
                src={getIconSrc(option)}
                alt="" 
                style={{ width: 16, height: 16, marginRight: 4, display:"inline-block" }}
            />
            {option.name}
            </div>
            { 'actionPointsCost' in option && <div style={{ marginLeft: '8px' }}>{option.actionPointsCost as string}</div>}
        </span>
    )
}

export const targetMenuItem = (target: Combatant) => {
    return (
        <span style={{ width: 'max-content' }}>
            <img 
            src={getIconSrc(target)}
            alt="" 
            style={{ width: 16, height: 16, marginRight: 4, display:"inline-block" }}
            
            />
            {target.name}
        </span>
    )
}

const getIconSrc = (option: { type: OptionType }): string => {
  switch (option.type) {
    case OptionType.FOLDER:
      return '/reaper/ui/icons/folder.png';
    case OptionType.ENEMY:
      return '/reaper/ui/icons/enemy.png';
    case OptionType.ALLY:
      return '/reaper/ui/icons/ally.png';
    case OptionType.ACTION:
      return '/reaper/ui/icons/attack.png';
    case OptionType.ITEM:
      return '/reaper/ui/icons/item.png';
    case OptionType.TECHNIQUE:
      return '/reaper/ui/icons/magic.png';
    default:
      return '/reaper/ui/icons/magic.png'; 
  }
}