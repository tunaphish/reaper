import { Ally, Allies } from '../model/ally';
import { OptionType } from '../model/option';
import * as Techniques from './techniques';


export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .13,

  techniques: [Techniques.basic],
};

export const Jin: Ally = {
  type: OptionType.ALLY,
  name: 'Jin',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .12,

  techniques: [],
};

export const Phia: Ally = {
  type: OptionType.ALLY,
  name: 'Phia',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .08,

  techniques: [],
};

export const DefaultAllies: Allies = [Eji, Jin, Phia];
