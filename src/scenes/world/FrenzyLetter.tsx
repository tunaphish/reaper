import * as React from 'react';

import { motion, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

export const FrenzyLetter = ({ char, intensity = 4 }: { char: string; intensity?: number }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const interval = setInterval(() => {
      x.set((Math.random() - 0.5) * intensity)
      y.set((Math.random() - 0.5) * intensity)
    }, 50) // ~20 FPS jitter

    return () => clearInterval(interval)
  }, [intensity])

  return (
    <motion.span
      style={{
        display: 'inline-block',
        x,
        y,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}
