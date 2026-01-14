
import * as React from 'react';
import { motion } from 'framer-motion';
import classNames from './world.module.css';
import { World } from './World';
import { Ally } from '../../model/ally';
import { MenuState } from './worldStore';
import { observer } from 'mobx-react-lite';
import { Meter } from '../battle/ResourceDisplay';

export const WorldView = (props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <MenuContainer world={world} />
      <StartBar world={world} />
    </div>
  )
}

const MenuContainer = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  return (
    <div className={classNames.menuContainer}>
      {world.worldStore.menuState !== MenuState.NONE && <MenuOptions world={world} />}
      {world.worldStore.menuState !== MenuState.NONE && <AllyBarView world={world} />}
    </div>
  )
});

const MenuOptions = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  return (
    <div className={classNames.menuContainer}>
      <div>Primary</div>
      <div>Primary</div>
      <div>Primary</div>
    </div>
  )
});

const StartBar = (props: { world: World }): JSX.Element => {
  const { world } = props;
  const onClick = () => {
    if (world.worldStore.menuState === MenuState.NONE) {
      world.setMenu(MenuState.NEUTRAL);
      return;
    }

    world.setMenu(MenuState.NONE);
    return;
  }

  return (
    <div className={classNames.startbar} onClick={onClick}>start</div>
  )
}

const AllyBarView = (props: { world: World }): JSX.Element => {
  const { allies } = props.world;
  return (
    <div className={classNames.combatantBar}>
        {allies.map((ally) => <AllyView ally={ally} key={ally.name}/>)}
    </div>
  )
}

const AllyView = (props: { ally: Ally }): JSX.Element => {
  const { ally } = props;

  const style: React.CSSProperties = {
    width: '100%',
    padding: '5px',
  }

  return (
    <Window key={ally.name} style={style}>
      {ally.name}
      <Meter value={ally.health} max={ally.maxHealth} className={classNames.healthMeter}></Meter>
    </Window>
  );
}

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

type WindowProps = {
  children: React.ReactNode
  style: React.CSSProperties
}

const Window = ({children, style}: WindowProps) => {
    return (
      <motion.div 
        variants={expandFromCenterTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className={classNames.window}
        style={style}
      >
        {children}
      </motion.div>
      
    )
}