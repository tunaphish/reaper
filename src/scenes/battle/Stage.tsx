import * as React from 'react';
import styles from './battle.module.css';

import { Canvas, useLoader } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from 'three';
import { CameraControls, Stats } from '@react-three/drei';
import { Battle } from './Battle';
import { Html } from '@react-three/drei';
import { Enemy } from '../../model/enemy';
import { ResourceDisplay } from './ResourceDisplay';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import { Combatant } from '../../model/combatant';


const Dialogue = observer((props: { enemy: Enemy }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const style: React.CSSProperties = {
    padding: 5,
    position: "absolute",
    top: "20px",
    right: "-180%",
    width: "200%",
  }

  React.useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [props.enemy.dialogue]);

  return (
    <AnimatePresence>
    { isVisible && (
        <motion.div 
          style={{ position: "relative" }}
          initial={{ scaleY: 0 }} 
          animate={{ scaleY: 1 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: .1, ease: 'easeOut' }} 
        >
            <div className={styles.window} style={style}>
              {props.enemy.dialogue}
            </div>
        </motion.div>
    )}
    </AnimatePresence>
  )
});


const Enemy = (props: {enemy: Enemy, battleScene: Battle, position: [x: number, y: number, z: number] }) => {
  const { enemy, battleScene } = props;
  const [beingEffected, setBeingEffected] = React.useState(false);
  
  React.useEffect(() => {
    battleScene.events.on('combatant-effected', (effectedCombatant: Combatant) => {
      if (effectedCombatant.name !== enemy.name) return;
      setBeingEffected(true);
    });
  }, []);

  return (
    <mesh position={props.position}>
      <Html 
        transform
        occlude
        castShadow
        receiveShadow
      >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ResourceDisplay combatant={enemy} battleScene={battleScene}/>
            <Dialogue enemy={enemy} />
            <img className={beingEffected ? styles.shake : ''} src={enemy.spritePath} onAnimationEnd={() => setBeingEffected(false)}/>
          </div>
        
      </Html>
    </mesh>

  )
}

const Plane = () => {
    const checkerTexture = useLoader(TextureLoader, '/reaper/assets/textures/checker.svg')
    checkerTexture.wrapS = checkerTexture.wrapT = RepeatWrapping;
    checkerTexture.repeat.set(10, 10); // Adjust the repeat for more tiles
  
    return (
      <RigidBody type="fixed" >
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} /> 
          <meshStandardMaterial map={checkerTexture} />
        </mesh>
        <CuboidCollider args={[10, 0.1, 10]} friction={0} restitution={0} />
      </RigidBody>
    )
  }

export const Stage = (props: { scene: Battle }) => {
    const { scene } = props;
    return (
    <Canvas>
        <Stats />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Physics>
          {scene.battleStore.enemies.map((enemy, idx) => <Enemy key={enemy.name} enemy={enemy} battleScene={scene} position={[idx*5, 0, -15]}/>)}
          <Plane/>
        </Physics>
        {/* <CameraControls /> */}
    </Canvas>
    )
  }