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

export type TextWindow = {
  type: EventType.TEXT
  text: string
  speed?: TextSpeed
  layout?: WindowLayout
};

export type ImageLayer = {
  src: string
  z?: number                 // higher = on top
  fit?: 'cover' | 'contain'
  // opacity?: number
}

export type ImageWindow = {
  type: EventType.IMAGE
  layers: ImageLayer[]
  layout?: WindowLayout
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