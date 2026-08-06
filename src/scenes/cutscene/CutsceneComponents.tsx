import React, { ReactNode } from 'react';
import classNames from './cutscene.module.css';

interface BackgroundProps {
  src: string;
  children?: ReactNode;
}

export const Section = ({ src, children }: BackgroundProps): JSX.Element => {
  return (
    <div
      className={classNames.background}
      style={{
        backgroundImage: `url(${src})`,
      }}
    >
      {children}
    </div>
  );
}

interface DialogueBubbleProps {
  text: string;
  position?: { x: string; y: string };
  speaker?: string;
}

export const DialogueBubble = ({
  text,
  position = { x: '50%', y: '50%' },
}: DialogueBubbleProps): JSX.Element => {
  return (
    <div
      className={classNames.dialogueBubble}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {text}
    </div>
  );
}