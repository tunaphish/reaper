import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Encounter } from './Encounter';
import { ImageLayer, ImageWindow, TextSpeed, TextWindow, Window, WindowLayout, EventType, Spread, Event } from '../../model/spread';
import classNames from './encounter.module.css';

import { TypewriterText } from './TypewriterText';
import { ActiveSpread } from './EncounterStore';

// REPLACE KEY WITH SOMETHING ELSE... maybe ID
// solution for isMostRecent likely to not work for multiple spreads..
export const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={classNames.encounterContainer}>
      {
        encounter.encounterStore.activeSpreads.map((activeSpread, idx) => <SpreadView encounter={encounter} activeSpread={activeSpread} key={idx} activeSpreadIndex={idx}/>)
      }
    </div>
  )
});

const isWindow = (event: Event) => (event.type === EventType.CHOICE || event.type === EventType.IMAGE || event.type === EventType.TEXT);

type SpreadViewProps = {
  activeSpread: ActiveSpread
  encounter: Encounter
  activeSpreadIndex: number
}
const SpreadView = observer(({activeSpread, encounter, activeSpreadIndex}: SpreadViewProps) => {
  return activeSpread.spread.events
    .slice(0, activeSpread.spreadIndex+1)
    .filter(isWindow)
    .map((eventWindow, idx) => (
    <InteractableWindow 
      encounter={encounter} 
      window={eventWindow} 
      key={idx} 
      activeSpreadsIndex={activeSpreadIndex}
      isMostRecent={true} // fix this later
    />))
      
})

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

type InteractableWindowProps = {
  encounter: Encounter, 
  window: Window,
  isMostRecent: boolean,
  activeSpreadsIndex: number,
}

const InteractableWindow = ({window, encounter, isMostRecent, activeSpreadsIndex}: InteractableWindowProps) => {
  const {layout, advanceTimerInMs} = window;
    const style: React.CSSProperties = {
      position: 'absolute',
      width: layout?.width ?? 380,
      height: layout?.height ?? 140,
      left: layout?.x ?? 225,
      top: layout?.y ?? 620,
      transform: anchorToTransform(layout?.anchor ?? 'center'),
    }

    React.useEffect(() => {
      if (!advanceTimerInMs) return;

      const timer = setTimeout(() => {
        encounter.advanceSpread(activeSpreadsIndex)
      }, advanceTimerInMs)

      return () => clearTimeout(timer);
    }, [advanceTimerInMs, encounter])
    
    const isInteractable = !advanceTimerInMs && isMostRecent;

    const onClickWindow = () => {
      if (!isInteractable) return;
      encounter.advanceSpread(activeSpreadsIndex);
    }
    
    return (
      <motion.div 
        variants={expandFromCenterTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div onClick={onClickWindow} className={classNames.window} style={style}>
          <WindowContentView window={window} />
          {isInteractable && <div className={classNames.interactionIndicator}/>}
        </div>
      </motion.div>
      
    )
}

const WindowContentView = (props: { window: Window }) => {
  switch (props.window.type) {
    case EventType.IMAGE:
      return <ImageWindowView imageWindow={props.window} />
    case EventType.TEXT:
      return <TextWindowView textWindow={props.window} />
    default:
      return null
  }
}

const ImageLayerView: React.FC<{ layer: ImageLayer }> = ({ layer }) => {
  return (
    <img
      src={layer.src}
      draggable={false}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: layer.fit ?? 'contain',
        objectPosition: 'bottom center',
        zIndex: layer.z ?? 0,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}

const ImageWindowView = (props: { imageWindow: ImageWindow }) => {
  return props.imageWindow.layers.map((layer, i) => (
    <ImageLayerView key={i} layer={layer} />
  ));
}

const TextWindowView = (props: { textWindow: TextWindow }) => {
  const {line, speed} = props.textWindow;
  return <TypewriterText line={line} textSpeed={speed || TextSpeed.NORMAL} />
}

