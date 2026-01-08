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
  z?: number                 // higher = on top
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

export type Window = TextWindow | ImageWindow;

export type Event = Window | SoundEvent;

export type Spread = {
  id: string
  events: Event[]
};