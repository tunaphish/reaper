import { Combatant } from './combatant';
import { Folder } from './folder';
import { OptionType } from './option';

export type Ally = Combatant & {
  folder: Folder;
  type: OptionType.ALLY;  
  menuPortraitPath: string;

  actionPoints: number;
  maxActionPoints: number;
  actionPointsRegenRatePerSecond: number; 
};

export type Allies = Ally[];


export const updateActionPoints = (target: Ally, change: number): void => {
  target.actionPoints = Math.min(target.maxActionPoints, target.actionPoints + change);
};
