/* eslint-disable react/jsx-key */
import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Encounter } from './encounter';
import { TextSpeed, Window, WindowLayout } from '../../model/spread';
import classNames from './encounter.module.css';
import { TypewriterText } from './TypewriterText';

// #region UI
const expandFromCenterTransition = {
  initial: {
    scaleX: 0,
    transformOrigin: "center",
    
  },
  animate: {
    scaleX: 1,
    
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  exit: {
    scaleX: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

function anchorToTransform(anchor: WindowLayout['anchor']) {
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

const InteractableWindow = (props: { encounter: Encounter, window: Window }) => {
    // TODO: probably spin out to other types..
    // ASSUMES TEXT WINDOW
    const {layout, text, speed} = props.window;
    const style: React.CSSProperties = {
      position: 'absolute',
      width: layout?.width ?? 380,
      height: layout?.height ?? 140,
      left: layout?.x ?? 225,
      top: layout?.y ?? 620,
      transform: anchorToTransform(layout?.anchor ?? 'center'),
    }

    const TextWindow = <TypewriterText text={text} textSpeed={speed || TextSpeed.NORMAL} />

    return (
      <div style={style}>
        <motion.div 
          className={classNames.window} 
          onClick={() => props.encounter.advanceSpread()} 
          variants={expandFromCenterTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {TextWindow}
        </motion.div>
      </div>
    )
}

export const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={classNames.encounterContainer}>
      {
        encounter.encounterStore.displayedWindows.map(window => <InteractableWindow encounter={encounter} window={window} key={window.text}/>)
      }
    </div>
  )
});