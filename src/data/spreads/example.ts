import { Spread, TextSpeed, ImageWindow, WindowType } from "../../model/spread";

export const EXAMPLE_SPREAD: Spread = [
  {
    type: WindowType.TEXT,
    text: 'Hi, I am an arbitrarily long string meant to showcase the wordwrap feature in text.'
  },
  {
    type: WindowType.TEXT,
    text: 'I love you senpai. (Slow speed test)',
    speed: TextSpeed.SLOW
  },
  {
    type: WindowType.TEXT,
    text: 'Random dialogue to test sound. (Fast speed test)',
    speed: TextSpeed.FAST
  },
  {
    type: WindowType.TEXT,
    text: 'Hello, how are you?'
  }
]

export const BUNNY_MASK_SPREAD: Spread = [
  {
    type: WindowType.IMAGE,
    layers: [
      {
        src: '/reaper/public/images/lofi-street.jpg',
        z: 0,
        fit: 'cover'
      },
      {
        src: '/reaper/public/images/eji.png',
        z: 1,
      }
    ],
    layout: {
      width: 140,
      height: 300,
    }
  },
  {
    type: WindowType.IMAGE,
    layers: [
      {
        src: '/reaper/public/images/bun-mask.jpg',
        z: 0,
        fit: 'cover'
      },
    ],
    layout: {
      width: 80,
      height: 110,
    },
  },
  {
    type: WindowType.TEXT,
    text: "Don't worry about what I look like...",
    layout: {
      x: 300,
      y: 550,
      width: 150,
      height: 100,
    }
  },
]