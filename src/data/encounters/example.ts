import { Encounter, TextSpeed, EventType } from '../../model/encounter';

export const EXAMPLE_SPREAD: Encounter = {
  id: 'Typewriter Test Example',
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
      ],
    },
    {
      type: EventType.SOUND,
      key: 'knight',
      loop: true,
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'I love you senpai. (Slow speed test)' }],
      speed: TextSpeed.SLOW,
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'Random dialogue to test sound. (Fast speed test)' }],
      speed: TextSpeed.FAST,
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'Hello how are you' }],
    },
  ],
};

export const BUNNY_MASK_SPREAD: Encounter = {
  id: 'Bunny Mask Example',
  events: [
    {
      type: EventType.IMAGE,
      layers: [
        {
          src: '/reaper/images/lofi-street.jpg',
          fit: 'cover',
        },
        {
          src: '/reaper/images/eji.png',
        },
      ],
      layout: {
        x: 50,
        y: 200,
        width: 140,
        height: 300,
      },
    },
    {
      type: EventType.IMAGE,
      layers: [
        {
          src: '/reaper/images/bun-mask.jpg',
          z: 0,
          fit: 'cover',
        },
      ],
      layout: {
        x: 90,
        y: 300,
        width: 80,
        height: 110,
      },
      delayInMs: 200,
    },
    {
      type: EventType.TEXT,
      delayInMs: 300,
      line: [{ text: "Don't worry about what I look like . . ." }],
      layout: {
        x: 100,
        y: 200,
        width: 200,
        height: 80,
      },
    },
  ],
};

export const YES_NO_CHOICE_SPREAD: Encounter = {
  id: 'Yes No Choice Spread',
  events: [
    {
      type: EventType.CHOICE,
      isMutuallyExclusive: true,
      title: [{ text: 'do you yield? ' }],
      options: [
        {
          line: [{ text: 'yes' }],
          nextEncounter: {
            id: 'yes yield',
            events: [
              {
                type: EventType.TEXT,
                line: [{ text: 'wise choice' }],
                speed: TextSpeed.FAST,
              },
            ],
          },
        },
        {
          line: [{ text: 'no' }],
          nextEncounter: {
            id: 'no yield',
            events: [
              {
                type: EventType.TEXT,
                line: [{ text: 'then it is death' }],
                speed: TextSpeed.FAST,
              },
            ],
          },
        },
      ],
    },
  ],
};

export const INTERROGATION_SPREAD: Encounter = {
  id: 'INTERROGATION Spread',
  events: [
    {
      type: EventType.CHOICE,
      isMutuallyExclusive: false,
      title: [{ text: 'what do you wanna know?' }],
      options: [
        {
          line: [{ text: 'who was the victim?' }],
          nextEncounter: {
            id: 'asdf',
            events: [
              {
                type: EventType.TEXT,
                line: [{ text: 'he was my brother' }],
                speed: TextSpeed.FAST,
                layout: {
                  x: 100,
                  y: 550,
                  width: 150,
                  height: 100,
                }
              },
            ],
          },
        },
        {
          line: [{ text: 'but why male models' }],
          nextEncounter: {
            id: 'zoolander',
            events: [
              {
                type: EventType.TEXT,
                line: [{ text: 'Are you serious?' }],
                speed: TextSpeed.FAST,
                layout: {
                  x: 300,
                  y: 550,
                  width: 150,
                  height: 100,
                } 
              },
            ],
          },
        },
      ],
    },
  ],
};
