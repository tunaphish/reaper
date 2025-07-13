import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './world.module.css';
import { World } from './World';
import { WorldStage } from './WorldStage';
import { DynamicJoystick } from './DynamicJoystick';

const PartyWindow = (props: { scene: World }) => {
  return (
    <div className={styles.window} style={{ display: 'flex', justifyContent: 'space-around', padding: '5px' }}>
      {props.scene.allies.map((ally) => {
        return (
          <div className={styles.ally} key={ally.name}>
            <img src={ally.menuPortraitPath} style={{ maxWidth: '70%' }}/>
            <div>{ally.name}</div>
            <div>HP {ally.health}/{ally.maxHealth}</div>
          </div>
        )
      })}
    </div>
   )
}

const Party = (props: { scene: World }) => {
  return (
    <div className={styles.partyContainer}>
      <div className={styles.window} style={{ marginBottom: '5px' }}>desc placeholder</div>
      <div className={styles.abilitiesContainer}>
        <div>abilities placeholder</div>
      </div>
      <PartyWindow scene={props.scene} />
    </div>
   )
}

const Inventory = (props: { scene: World }) => {
  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.window} style={{ marginBottom: '5px' }}>desc placeholder</div>
      <PartyWindow scene={props.scene} />
      <div className={styles.window} style={{ flex: 1, padding: '5px', marginTop: '5px' }}>
        {
          props.scene.inventory.map(item => {
            return (
              <div key={item.name}>
                <button className={styles.item} disabled={!item.canUseOutsideBattle || item.charges === 0}>
                  { `${item.name} ${item.charges}/${item.maxCharges}` }
                </button>
              </div>
            )
          })
        }
      </div>
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
    props.scene.choiceSelectSound.play();
    setMenuOpen(!menuOpen);
    setMenuContent(null);
    props.scene.unpause();
  }

  return (
    <div className={styles.container}>
      <div className={styles.stageContainer}>
        <WorldStage world={props.scene} />
        {/* <DynamicJoystick world={props.scene} /> */}
      </div>
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
    </div>
  );
}