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
    ]
  },
  {
    type: WindowType.TEXT,
    text: 'Random dialogue to test sound. (Fast speed test)',
    speed: TextSpeed.FAST
  },
]