import * as React from 'react';
import classNames from './shared.module.css';
import { motion } from 'framer-motion';
import { WindowLayout, Window as WindowModel } from '../../model/spread';

const expandFromCenterTransition = {
  initial: {
    scaleX: 0,
    transformOrigin: "center",
  },
  animate: (delay: number) => ({
    scaleX: 1,
    transition: {
      delay,
      duration: 0.15,
      ease: "easeOut",
    },
  }),
  exit: {
    scaleX: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

type WindowProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  onClick?: () => void;
  window?: WindowModel
};

export const Window = ({ children, style, delay = 0, onClick, window }: WindowProps) => (
  <motion.div 
    variants={expandFromCenterTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    custom={delay}
    className={classNames.window}
    style={style}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

type PanelWindowProps = {
  children: React.ReactNode;
  window: WindowModel
  style?: React.CSSProperties;
  delay?: number;
  onClick?: () => void;
};

export const PanelWindow = ({ children, style, delay = 0, onClick, window }: PanelWindowProps) => {
  const layout = window?.layout;
  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    width: layout?.width ?? 380,
    height: layout?.height ?? 140,
    left: layout?.x ?? 225,
    top: layout?.y ?? 620,
    transform: anchorToTransform(layout?.anchor ?? 'center'),
    ...style
  }

  return (
    <div style={wrapperStyle}>
      <Window style={style} onClick={onClick} delay={delay}>
        {children}
      </Window>
    </div>
  );
};

const anchorToTransform = (anchor: WindowLayout['anchor']) => {
  switch (anchor) {
    case 'top-left': return 'translate(0, 0)'
    case 'top-right': return 'translate(-100%, 0)'
    case 'bottom-left': return 'translate(0, -100%)'
    case 'bottom-right': return 'translate(-100%, -100%)'
    case 'center':
    default:
      return 'translate(-50%, -50%)'
  }
}