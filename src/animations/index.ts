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
    }
    else {
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

export const shootElement = (element: Element) => {
  // random initial coordinates;
  // const initX = -5 + Math.random() * 10;
  // const initY = -5 + Math.random() * 10;
  const x = -40 + Math.random() * 80;
  const y = 30 + Math.random() * 80;

  // generate key frames
  const shootTiming = {
    duration: 1000,
    fill: "forwards", 
  };

  const keyframes = [
    {
      transform: `translate(0, 0)`,
      //transform: `translate(${initX}px, ${initY}px)`,
      opacity: 1,
    },
    {
      opacity: 1,
    },
    {
      transform: `translate(${x}px, -${y}px)`,
      opacity: 0,
    }
  ]
  
  // @ts-ignore not sure why it does no recognize fill
  element.animate(keyframes, shootTiming);
}
