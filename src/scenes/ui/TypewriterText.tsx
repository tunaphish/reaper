import * as React from 'react';
import styles from './ui.module.css';

export enum TextSpeed {
  SLOW,
  NORMAL,
  FAST
}

type TypewriterTextProps = { 
  text: string; 
  textSpeed?: TextSpeed 
  onClick?: () => void,
}

export function textSpeedToValue(speed: TextSpeed): number {
  switch (speed) {
    case TextSpeed.SLOW:
      return 45
    case TextSpeed.NORMAL:
      return 25
    case TextSpeed.FAST:
      return 5
    default:
      return 25
  }
}

export const TypewriterText = ({ text, textSpeed = TextSpeed.NORMAL }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(true);

  React.useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }

    if (displayIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[displayIndex]);
        setDisplayIndex((prev) => prev + 1);
      }, textSpeedToValue(textSpeed));

      return () => clearTimeout(timeout); 
    } 

    setIsTyping(false);
  }, [displayIndex, text]);

  return (
    <span className={styles.dialogueText}>
      {displayedText}
      { !isTyping && <span className={styles.dialogueTextIndicator} />} 
    </span>
  )
}