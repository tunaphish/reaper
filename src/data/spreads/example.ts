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
      line: [
        { text: 'hey this is ' },
        { text: 'limit', effect: 'limit' },
        { text: ' break and ' },
        { text: 'madness', effect: 'frenzy' },
        { text: '...' },
      ]
    },
    {
      type: EventType.SOUND,
      key: 'knight',
      loop: true,
    },
    {
      type: EventType.TEXT,
      line: [{text: 'I love you senpai. (Slow speed test)'}],
      speed: TextSpeed.SLOW
    },
    {
      type: EventType.TEXT,
      line: [{text: 'Random dialogue to test sound. (Fast speed test)'}],
      speed: TextSpeed.FAST
    },
    {
      type: EventType.TEXT,
      line: [{text: 'Hello how are you'}],
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
          src: '/reaper/images/lofi-street.jpg',
          z: 0,
          fit: 'cover'
        },
        {
          src: '/reaper/images/eji.png',
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
          src: '/reaper/images/bun-mask.jpg',
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
      line: [{text: "Don't worry about what I look like . . ."}],
      layout: {
        x: 300,
        y: 550,
        width: 150,
        height: 100,
      }
    },
  ]
}