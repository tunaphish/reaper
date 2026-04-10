import { Enemy } from '../model/enemy';
import { Combatant, getStatus, Status, techniqueIsActive } from '../model/combatant';
import { OptionType } from '../model/option';

import * as Actions from './actions';
import * as Techniques from './techniques';
import { getRandomInt } from '../model/math';
import { EncounterScene as EncounterScene} from '../scenes/encounter/Encounter';
import { Action } from '../model/action';

const isAlive = (target: Combatant) => getStatus(target) !== Status.DEAD;
const hasTechnique = (combatant => combatant.activeTechniques.length > 0);

const randomTarget = (potentialTargets: Combatant[]): Combatant[] => {
  return [potentialTargets.at(getRandomInt(potentialTargets.length))];
};

const randomAliveAlly = (scene: EncounterScene, action: Action, caster: Enemy): Combatant[] => {
  const potentialTargets = scene.encounterStore.allies
    .filter(ally => !action.conditionMet || action.conditionMet(scene, caster, ally))
    .filter(isAlive);
  return randomTarget(potentialTargets.length > 0 ? potentialTargets : scene.encounterStore.allies);
};


const randomAllyWithTechnique = (scene: EncounterScene): Combatant[] => {
  const potentialTargets = scene.encounterStore.allies
    .filter(hasTechnique)
    .filter(isAlive);
  return randomTarget(potentialTargets.length > 0 ? potentialTargets : scene.encounterStore.allies);
};

const self = (scene: EncounterScene, action: Action, caster: Enemy): Combatant[] => [caster];


export const fencer: Enemy = {
  type: OptionType.ENEMY,
  name: 'Fencer',
  journalDescription: 'Debug Enemy meant to use specialized attacks',
  combatPortraitSrc: '/reaper/images/fencer-test.png',

  health: 20,
  maxHealth: 200,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .20,
  
  strategies: [
    { 
      option: Actions.magic, 
      weight: 20, 
      getTargets: randomAllyWithTechnique, 
      isValid: (encounter: EncounterScene): boolean => encounter.encounterStore.allies.some(hasTechnique) 
    },
    { 
      option: Actions.attack, 
      weight: 100, 
      getTargets: randomAliveAlly, 
      isValid: (): boolean => true 
    },
    { 
      option: Actions.splinter, 
      weight: 500, 
      getTargets: randomAliveAlly, 
      isValid: (encounter: EncounterScene): boolean => encounter.splinterNotCasted },
    { 
      option: Actions.engage, 
      weight: 500, 
      getTargets: randomAliveAlly, 
      isValid: (encounter: EncounterScene): boolean => encounter.encounterStore.allies.some(ally => ally.health === ally.maxHealth ) },
    { 
      option: Techniques.counter, 
      weight: 2000, 
      getTargets: self, 
      isValid: (encounter: EncounterScene, caster: Combatant): boolean => !techniqueIsActive(caster, Techniques.counter),
    },
  ],
  selectedStrategyIndex: 0,

  activeTechniques: [],
};



export const knight: Enemy = {
  type: OptionType.ENEMY,
  name: 'Knight',
  journalDescription: 'Debug Enemy meant to use defensive actions',
  combatPortraitSrc: '/reaper/images/knight.gif',

  health: 200,
  maxHealth: 200,
  bleed: 0,

  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .13,

  strategies: [
    { 
      option: Actions.magic, 
      weight: 20, 
      getTargets: randomAllyWithTechnique, 
      isValid: (encounter: EncounterScene): boolean => encounter.encounterStore.allies.some(hasTechnique) 
    },
    { 
      option: Actions.attack, 
      weight: 100, 
      getTargets: randomAliveAlly, 
      isValid: (): boolean => true 
    },
    { 
      option: Actions.splinter, 
      weight: 500, 
      getTargets: randomAliveAlly, 
      isValid: (encounter: EncounterScene): boolean => encounter.splinterNotCasted },
    { 
      option: Actions.engage, 
      weight: 500, 
      getTargets: randomAliveAlly, 
      isValid: (encounter: EncounterScene): boolean => encounter.encounterStore.allies.some(ally => ally.health === ally.maxHealth ) },
    { 
      option: Techniques.counter, 
      weight: 2000, 
      getTargets: self, 
      isValid: (encounter: EncounterScene, caster: Combatant): boolean => !techniqueIsActive(caster, Techniques.counter),
    },
  ],
  selectedStrategyIndex: 0,

  activeTechniques: [],
};

export const enemies = [
  fencer,
  knight
]

// #endregion