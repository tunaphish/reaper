
export const clamp = (min: number, val: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

