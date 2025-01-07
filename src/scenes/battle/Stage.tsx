import * as React from 'react';
import styles from './battle.module.css';

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping, Vector3Like } from 'three';
import { CameraControls, Stats, Html } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';

import { Battle } from './Battle';
import { Enemy } from '../../model/enemy';
import { ResourceDisplay } from './ResourceDisplay';
import { Combatant } from '../../model/combatant';
import { Ally } from '../../model/ally';


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


const EnemyView = (props: {enemy: Enemy, battleScene: Battle, position: [x: number, y: number, z: number] }) => {
  const { enemy, battleScene } = props;
  const [beingEffected, setBeingEffected] = React.useState(false);
  
  React.useEffect(() => {
    battleScene.events.on('combatant-effected', (effectedCombatant: Combatant) => {
      if (effectedCombatant.name !== enemy.name) return;
      setBeingEffected(true);
    });
  }, []);

  return (
    <RigidBody type="dynamic">
      <mesh position={props.position} >
        <Html 
          transform
          sprite
          occlude
          castShadow
          receiveShadow
          pointerEvents='none'
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
      <CuboidCollider args={[0.5, 0.5, 0.5]} />

    </RigidBody>
  )
}

const AllyView = (props: {ally: Ally, battleScene: Battle, position: [x: number, y: number, z: number] }) => {
  const { ally } = props;

  return (
    <RigidBody type="dynamic">
      <mesh position={props.position}>
        <Html 
          transform
          sprite
          occlude
          castShadow
          receiveShadow
          pointerEvents='none'
        >
            <div>
              <img  src={ally.spritePath} />
            </div>
          
        </Html>
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>


  )
}

const Plane = () => {
  const checkerTexture = useLoader(TextureLoader, '/reaper/textures/checker.svg')
  checkerTexture.wrapS = checkerTexture.wrapT = RepeatWrapping;
  checkerTexture.repeat.set(10, 10); // Adjust the repeat for more tiles

  return (
    <RigidBody type="fixed" >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} /> 
        <meshStandardMaterial map={checkerTexture} />
      </mesh>
      <CuboidCollider args={[10, 0.1, 10]} friction={0} restitution={0} />
    </RigidBody>
  )
}


const CASTER_X_POSITION_MAP = {
  ['Cloud']: -4.7,
  ['Barret']: 1.1,
  ['Tifa']: 7.2,
}

const Camera = (props: { battle: Battle }) => {
  const { battle } = props;
  const { camera } = useThree();
  const [targetPosition, setTargetPosition] = React.useState<Vector3Like>(camera.position)

  React.useEffect(() => {
    camera.position.set(1., 0, 3); 
    camera.lookAt(0, 0, -10); 

    battle.events.on('caster-set', (caster: Ally) => {
      const xPosition = CASTER_X_POSITION_MAP[caster.name] || 1.1;
      setTargetPosition({x: xPosition, y: 0, z: 3 });
    });
  }, []);

  useFrame(() => {
    const newPosition = camera.position.lerp(targetPosition, 0.2);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z); 
    camera.lookAt(0, 0, -10); 
  })

  return null; 
}


export const Stage = (props: { scene: Battle }) => {
    const { scene } = props;
    return (
    <Canvas>
        <Stats />
        <Camera battle={scene}/>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Physics>
          {scene.battleStore.enemies.map((enemy, idx) => <EnemyView key={enemy.name} enemy={enemy} battleScene={scene} position={[idx*5, 0, -15]}/>)}
          {scene.battleStore.allies.map((ally, idx) => <AllyView key={ally.name} ally={ally} battleScene={scene} position={[idx*5 -5, 0, 2]}/>)}
          <Plane/>
        </Physics>
    </Canvas>
    )
  }