import * as React from 'react';
import styles from './encounter.module.css';
import { TextEffect, TextSpeed, TextToken } from '../../model/spread';
import { LimitBreakLetter } from './LimitBreakLetter';
import { FrenzyLetter } from './FrenzyLetter';

const textSpeedToValue = (speed: TextSpeed): number => {
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

type TypewriterTextProps = { 
  line: TextToken[]; 
  textSpeed?: TextSpeed 
  onClick?: () => void,
}

type TypedChar = {
  char: string
  effect: TextEffect
}

const flattenTokens = (tokens: TextToken[]): TypedChar[] => {
  return tokens.flatMap(token =>
    token.text.split('').map(char => ({
      char,
      effect: token.effect ?? 'normal',
    }))
  )
}

export const TypewriterText = ({
  line,
  textSpeed = TextSpeed.NORMAL,
}: TypewriterTextProps) => {
  const chars = React.useMemo(() => flattenTokens(line), [line])
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (index >= chars.length) return

    const timeout = setTimeout(() => {
      setIndex(i => i + 1)
    }, textSpeedToValue(textSpeed))

    return () => clearTimeout(timeout)
  }, [index, chars.length, textSpeed])

  return (
    <div className={styles.textContainer}>
      {chars.slice(0, index).map((c, i) => {
        switch (c.effect) {
          case 'limit':
            return <LimitBreakLetter key={i} char={c.char} offset={i} />
          case 'frenzy':
            return <FrenzyLetter key={i} char={c.char} />
          default:
            return <span key={i}>{c.char === ' ' ? '\u00A0' : c.char}</span>
        }
      })}
    </div>
  )
}