import React from 'react'
import classNames from './encounter.module.css'

type LimitBreakTextProps = {
  text: string
}

export const LimitBreakText: React.FC<LimitBreakTextProps> = ({ text }) => {
  return (
    <span className={classNames.limitBreak}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={classNames.limitBreakLetter}
          style={{
            animationDelay: `${-(i * 40)}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}