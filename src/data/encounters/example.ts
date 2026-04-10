import { Encounter, TextSpeed, EventType } from '../../model/encounter';

export const EXAMPLE_SPREAD: Encounter = {
  id: 'EXAMPLE_SPREAD',
  events: [
    {
      type: EventType.TEXT,
      line: [
        { text: 'hey this is ' },
        { text: 'limit', effect: 'limit' },
        { text: ' break and ' },
        { text: 'madness', effect: 'frenzy' },
        { text: '...' },
      ],
      layout: {
        x: 100,
        y: 100,
        width: 280,
        height: 100,
      },
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'I love you senpai. (Slow speed test)' }],
      speed: TextSpeed.SLOW,
      layout: {
        x: 100,
        y: 200,
        width: 280,
        height: 80,
      },
    },
    {
      type: EventType.SOUND,
      key: 'knight',
      loop: true,
      autoAdvanceInMs: 200,
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'Random dialogue to test sound. (Fast speed test)' }],
      speed: TextSpeed.FAST,
      layout: {
        x: 100,
        y: 300,
        width: 280,
        height: 80,
      },
    },
    {
      type: EventType.TEXT,
      line: [{ text: 'Hello how are you' }],
      layout: {
        x: 100,
        y: 400,
        width: 280,
        height: 80,
      },
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
      autoAdvanceInMs: 200,
    },
    {
      type: EventType.IMAGE,
      layers: [
        {
          src: '/reaper/images/bun-mask.jpg',
          fit: 'cover',
        },
      ],
      layout: {
        x: 90,
        y: 300,
        width: 80,
        height: 110,
      },
      autoAdvanceInMs: 200,
    },
    {
      type: EventType.TEXT,
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

export const YES_YIELD_ENCOUNTER: Encounter = {
  id: 'yes yield',
  events: [
    {
      type: EventType.TEXT,
      line: [{ text: 'wise choice' }],
      speed: TextSpeed.FAST,
    },
  ],
};

export const NO_YIELD_ENCOUNTER: Encounter = {
  id: 'no yield',
  events: [
    {
      type: EventType.TEXT,
      line: [{ text: 'then it is death' }],
      speed: TextSpeed.FAST,
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
          nextEncounter: YES_YIELD_ENCOUNTER,
        },
        {
          line: [{ text: 'no' }],
          nextEncounter: NO_YIELD_ENCOUNTER,
        },
      ],
    },
  ],
};

export const INTERROGATION_VICTIM_ENCOUNTER: Encounter = {
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
      },
    },
  ],
};

export const INTERROGATION_MODELS_ENCOUNTER: Encounter = {
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
      },
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
          nextEncounter: INTERROGATION_VICTIM_ENCOUNTER,
        },
        {
          line: [{ text: 'but why male models' }],
          nextEncounter: INTERROGATION_MODELS_ENCOUNTER,
        },
      ],
    },
  ],
};


export const TOP_LEVEL_SPREADS = [EXAMPLE_SPREAD, BUNNY_MASK_SPREAD, YES_NO_CHOICE_SPREAD, INTERROGATION_SPREAD];