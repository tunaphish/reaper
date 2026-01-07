import { Spread, TextSpeed } from "../../model/spread";

export const EXAMPLE_SPREAD: Spread = [
  {
    text: 'Hi, I am an arbitrarily long string meant to showcase the wordwrap feature in text.'
  },
  {
    text: 'I love you senpai. (Slow speed test)',
    speed: TextSpeed.SLOW
  },
  {
    text: 'Random dialogue to test sound. (Fast speed test)',
    speed: TextSpeed.FAST
  },
  {
    text: 'Hello, how are you?'
  }
]