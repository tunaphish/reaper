import React from 'react'
import classNames from './shared.module.css'

type LimitBreakLetterProps = {
  char: string
  offset: number
}

export const LimitBreakLetter: React.FC<LimitBreakLetterProps> = ({ char, offset }) => {
  return (
    <span
      className={classNames.limitBreakLetter}
      style={{
        animationDelay: `${-(offset * 40)}ms`,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  )
}