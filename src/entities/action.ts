export interface Action {
  name: string;
  staminaCost: number;
  executeAbility: () => void; // event emitters and listeners?
}

export const Slash: Action = {
  name: 'Slash',
  staminaCost: 50,
  executeAbility: () => {
    console.log('here i go slashin again');
    // event emitter to attack certain party members?
    // party members have listeners to take dmg etc
    // then emit event to update display... 
  }
}

export const Block: Action = {
  name: 'Block', 
  staminaCost: 50,
  executeAbility: () => {
    console.log('im a blockeeee');
  }
}

export const Idle: Action = {
  name: 'Idle', 
  staminaCost: 0,
  executeAbility: () => {
    console.log('im aint not doingo nothg');
  }
}