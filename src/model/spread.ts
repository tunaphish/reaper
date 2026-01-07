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

export type TextWindow = {
  text: string
  speed?: TextSpeed
  layout?: WindowLayout
};

export type Window = TextWindow;

export type Spread = Window[];