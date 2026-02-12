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
  CHOICE,
  END_ENCOUNTER,
}

export type BaseEvent = {
  delayInMs?: number;
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

export type Option = {
  line: TextToken[]
  nextEncounter: Encounter
}

export type ChoiceWindow = BaseWindow & {
  type: EventType.CHOICE
  title: TextToken[]
  options: Option[]
  isMutuallyExclusive: boolean
}

export type Window = TextWindow | ImageWindow | ChoiceWindow;

export type Event = Window | SoundEvent;

export type Encounter = {
  id: string
  events: Event[]
};