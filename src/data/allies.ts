import { Ally, Allies } from '../model/ally';
import { OptionType } from '../model/option';


export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .13,

  activeTechniques: [],
};

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .12,

  activeTechniques: [],
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

  activeTechniques: [],
};

export const DefaultAllies: Allies = [Eji, Keshi, Phia];
