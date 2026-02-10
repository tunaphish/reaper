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
  anchor?: 'center' | 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
};

export enum EventType {
  TEXT,
  IMAGE,
  SOUND,
  CHOICE,
  END_ENCOUNTER,
}

export type BaseWindow = {
  layout?: WindowLayout
  advanceTimerInMs?: number
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
  z?: number
  fit?: 'cover' | 'contain'
  // opacity?: number
}

export type ImageWindow = BaseWindow & {
  type: EventType.IMAGE
  layers: ImageLayer[]
}

export type SoundEvent = {
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

export type EndEncounterEvent = { 
  type: EventType.END_ENCOUNTER
}

export type Window = TextWindow | ImageWindow | ChoiceWindow;

export type Event = Window | SoundEvent | EndEncounterEvent;

export type Encounter = {
  id: string
  events: Event[]
};