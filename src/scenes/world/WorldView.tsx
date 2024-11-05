import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './world.module.css';
import { World } from './World';

const Party = (props: { scene: World }) => {
  return (
    <div className={styles.partyContainer}>
      <div className={styles.abilitiesContainer}>
        <div>abilities placeholder</div>
      </div>
      <div className={styles.window}>desc placeholder</div>
      <div className={styles.window} style={{ display: 'flex', justifyContent: 'space-around' }}>
        {props.scene.allies.map((ally) => {
          return (
            <div className={styles.ally} key={ally.name}>
              <div>pic</div>
              <div>{ally.name}</div>
              <div>HP {ally.health}/{ally.maxHealth}</div>
              <div>MP {ally.magic}/{ally.maxMagic}</div>
            </div>
          )
        })}
      </div>
    </div>
   )
}

const Inventory = (props: { scene: World }) => {
  return (
    <div>
      Inventory Placeholder
    </div>
   )
}

export const WorldView = (props: { scene: World }): JSX.Element => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuContent, setMenuContent] = React.useState<JSX.Element | null>(null);

  const onMenuClick = () => {
    props.scene.allies = props.scene.registry.get('allies'); // allies gets set after battle.
    setMenuOpen(!menuOpen);
    props.scene.pause();
    setMenuContent(<Party scene={props.scene}/>);
  }

  const onPartyClick = () => {
    props.scene.choiceSelectSound.play();
    setMenuContent(<Party scene={props.scene}/>);
  }

  const onInventoryClick = () => {
    props.scene.choiceSelectSound.play();
    setMenuContent(<Inventory scene={props.scene}/>);
  }

  const onExitClick = () => {
    setMenuOpen(!menuOpen);
    setMenuContent(null);
    props.scene.unpause();
  }

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuContent}>
        {menuContent}
      </div>
      <motion.div 
        animate={{ width: menuOpen ? '100%' : '100px' }}
        className={styles.navigation}
      >
        {
          menuOpen ?
          (<>
            <div className={styles.navigationButton} onClick={onPartyClick}>party</div>
            <div className={styles.navigationButton} onClick={onInventoryClick}>inv</div>
            <div className={styles.navigationButton} onClick={() => props.scene.battle()}>battle</div>
            <div className={styles.navigationButton} onClick={onExitClick}>exit</div>
          </>) :
          <div className={styles.navigationButton} onClick={onMenuClick}>menu</div>
        }
        
      </motion.div>
    </div>

  );
}