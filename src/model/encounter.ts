export enum TextSpeed {
  SLOW,
  NORMAL,
  FAST
}

export type WindowLayout = {
  x?: number // center
  y?: number // bottom
  width?: number // px, default: 480
  height?: number // px, default: auto
};

export enum EventType {
  TEXT,
  IMAGE,
  SOUND,
  DECISION,
  
  // Combat
  UPDATE_DAMAGE,
  UPDATE_AP,
  SHATTER_TECHNIQUE,
  SHATTER,
}

export type BaseEvent = {
  autoAdvanceInMs?: number;
}

export type BaseWindow = BaseEvent & {
  layout?: WindowLayout
}

export type TextEffect = 'normal' | 'frenzy' | 'limit'

export type TextToken = {
  text: string
  effect?: TextEffect
}

export type TextWindow = BaseWindow & {
  type: EventType.TEXT
  line: TextToken[]
  speed?: TextSpeed
};

export type ImageLayer = {
  src: string
  fit?: 'cover' | 'contain'
}

export type ImageWindow = BaseWindow & {
  type: EventType.IMAGE
  layers: ImageLayer[]
}

export type SoundEvent = BaseEvent & {
  type: EventType.SOUND
  key: string
  loop?: boolean
}

// #region EncounterActions

export type Choice = {
  line: TextToken[]
  nextEncounter: Encounter
}

export type Decision = BaseEvent & {
  type: EventType.DECISION
  title?: TextToken[]
  choices: Choice[]
}

// #endregion

// #region CombatEvents

export type UpdateDamageEvent = BaseEvent & {
  type: EventType.UPDATE_DAMAGE
  value: number
}

export type UpdateApEvent = BaseEvent & {
  type: EventType.UPDATE_AP
  value: number
}

export enum ShatterTechniqueTarget {
  RANDOM = 'random'
}

export type ShatterTechniqueEvent = BaseEvent & {
  type: EventType.SHATTER_TECHNIQUE
  target: ShatterTechniqueTarget
}

export type ShatterEvent = BaseEvent & {
  type: EventType.SHATTER
}


// #endregion

export type Window = TextWindow | ImageWindow | Decision;

export type CombatEvent = UpdateDamageEvent | UpdateApEvent | ShatterTechniqueEvent | ShatterEvent;

export type Event = Window | SoundEvent | CombatEvent;

export type Encounter = {
  id: string
  events: Event[]
};