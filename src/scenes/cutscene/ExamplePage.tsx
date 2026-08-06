import React from 'react';
import { Section, DialogueBubble } from './CutsceneComponents';

export const ExamplePage = (): JSX.Element => {

  return (
    <div style={{ width: '100%' }}>
      <Section src="/reaper/public/backgrounds/main-menu.png">
        <DialogueBubble
          text="Oh, hello there."
          position={{ x: '50%', y: '30%' }}
        />

        <DialogueBubble
          text="I wasn't expecting visitors."
          position={{ x: '50%', y: '55%' }}
        />

        <DialogueBubble
          text="What brings you here?"
          position={{ x: '50%', y: '120%' }}
        />
      </Section>

      <div style={{ height: '8000px' }} />
    </div>
  );
}