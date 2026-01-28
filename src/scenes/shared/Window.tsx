import * as React from 'react';
import classNames from './shared.module.css';
import { motion } from 'framer-motion';

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
};

export const Window = ({ children, style, delay = 0,  onClick }: WindowProps) => {
  return (
    <motion.div 
      variants={expandFromCenterTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={delay}
    >
      <div
        className={classNames.window}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    </motion.div>
  );
};
