import { Spread, TextSpeed, EventType } from "../../model/spread";

export const EXAMPLE_SPREAD: Spread = {
  id: "Typewriter Test Example",
  events: [
    {
      type: EventType.SOUND,
      key: 'charged',
    },
    {
      type: EventType.TEXT,
      text: 'Hi, I am an arbitrarily long string meant to showcase the wordwrap feature in text.'
    },
    {
      type: EventType.SOUND,
      key: 'knight',
      loop: true,
    },
    {
      type: EventType.TEXT,
      text: 'I love you senpai. (Slow speed test)',
      speed: TextSpeed.SLOW
    },
    {
      type: EventType.TEXT,
      text: 'Random dialogue to test sound. (Fast speed test)',
      speed: TextSpeed.FAST
    },
    {
      type: EventType.TEXT,
      text: 'Hello, how are you?'
    }
  ]
}

export const BUNNY_MASK_SPREAD: Spread = 
{
  id: "Bunny Mask Example",
  events: [
    {
      type: EventType.IMAGE,
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
      },
      advanceTimerInMs: 200,
    },
    {
      type: EventType.IMAGE,
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
      type: EventType.TEXT,
      text: "Don't worry about what I look like...",
      layout: {
        x: 300,
        y: 550,
        width: 150,
        height: 100,
      }
    },
  ]
}