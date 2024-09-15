import { getRandomInt } from '../util';
// TODO: Add randomness to shake
// TODO: Add damage scaling

export const shakeElement = (element: Element, iterations: number = 1, strong: boolean = true) => {
  const duration = 350 + getRandomInt(100);

  const shakeTiming = {
    duration,
    timing: 'ease-in-out',
    iterations,
  };

  const keyFrames = [];
  for (let i = 0; i < 10; i++) {
    if (strong) {
      keyFrames.push({
        transform: `translate(${-20 + getRandomInt(40)}px, 
                              ${-20 + getRandomInt(40)}px) 
                       rotate(${-10 + getRandomInt(20)}deg)`,
      });
    } else {
      keyFrames.push({
        transform: `translate(${-6 + getRandomInt(12)}px, 
                              ${-6 + getRandomInt(12)}px) 
                       rotate(${-2 + getRandomInt(4)}deg)`,
      });
    }
  }
  keyFrames.push({ transform: 'translate(0, 0) rotate(0)' });

  element.animate(keyFrames, shakeTiming);
};
