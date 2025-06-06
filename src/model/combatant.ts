export enum Status {
  NORMAL = 'NORMAL',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  ACTIONING = 'ACTIONING'
}


export type Combatant = {
  name: string;
  health: number;
  maxHealth: number;
  bleed: number;
  
  spritePath: string;

  status: Status;

  position: [x: number, y: number, z: number];
}
