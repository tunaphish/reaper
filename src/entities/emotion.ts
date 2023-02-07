export interface Emotion {
  name: string,
  display: string,
  onApply: () => void; 
  // onTick
  // onRemove
}

export const Anger: Emotion = {
  name: 'Anger',
  display: '😡',
  onApply: () => {
    console.log('i am angy');
  }
}