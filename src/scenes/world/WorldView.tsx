import * as React from 'react';
import styles from './world.module.css';
import { World } from './World';

export const WorldView = (props: { scene: World }): JSX.Element => {
    return (
      <div className={styles.navigation}>
        <div className={styles.navigationButton} onClick={() => props.scene.pause()}>menu</div>
        <div className={styles.navigationButton} onClick={() => props.scene.battle()}>battle</div>
      </div>
    );
  }