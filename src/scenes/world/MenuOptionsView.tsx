
import * as React from 'react';
import { motion } from 'framer-motion';

export const MenuCursor = () => (
  <motion.img
    src="/reaper/ui/cursor.png" 
    alt=""
    style={{
      width: '24px',       
      imageRendering: 'pixelated',
      position: 'absolute',
      left: '-24px',
      top: '10%',
    }}
    initial={{ opacity: 0, x: 4 }}
    animate={{
      opacity: 1,
      x: [0, -4, 0],
    }}
    transition={{
      x: {
        repeat: Infinity,
        duration: 0.6,
        ease: 'easeInOut',
      },
      opacity: { duration: 0.15 },
    }}
  />
);

type MenuOptionsViewProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderLabel: (item: T) => React.ReactNode
  onSelect: (item: T, index: number) => void
  initialIndex?: number
  isCursor?: boolean
}

export const MenuOptionsView = ({items,getKey,renderLabel,onSelect,initialIndex = -1,isCursor=false}: MenuOptionsViewProps<T>): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex)

  return (
    <>
      {items.map((item, i) => (
        <div
          key={getKey(item) + i}
          onClick={() => {
            setSelectedIndex(i)
            onSelect(item, i)
          }}
          style={{ position: 'relative', display: 'flex' }}
        >
          {isCursor && i === selectedIndex && <MenuCursor />}
          {renderLabel(item)}
        </div>
      ))}
    </>
  )
}