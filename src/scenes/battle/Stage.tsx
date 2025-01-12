import * as React from 'react';
import styles from './battle.module.css';

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping, Vector3Like } from 'three';
import { Stats, Html } from '@react-three/drei';


import { Battle } from './Battle';
import { ActionsViewManager, ResourceDisplay } from './ResourceDisplay';
import { Combatant } from '../../model/combatant';

const CombatantSprite = (props: {combatant: Combatant, battleScene: Battle, position: [x: number, y: number, z: number], isEnemy: boolean }) => {
  const { combatant, battleScene, isEnemy } = props;
  const [beingEffected, setBeingEffected] = React.useState(false);
  
  React.useEffect(() => {
    battleScene.events.on('combatant-effected', (effectedCombatant: Combatant) => {
      if (effectedCombatant.name !== combatant.name) return;
      setBeingEffected(true);
    });
  }, []);


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
          <div style={{position: 'relative'}}>
            { isEnemy && <ActionsViewManager combatant={combatant} battleScene={battleScene}/> }
            <img className={beingEffected ? styles.shake : ''} src={combatant.spritePath} onAnimationEnd={() => setBeingEffected(false)}/>
            { isEnemy &&  <ResourceDisplay combatant={combatant} battleScene={battleScene}/>  }
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
  ['Cloud']: -2,
  ['Barret']: 1.1,
  ['Tifa']: 5.5,
}

const Camera = (props: { battle: Battle }) => {
  const { battle } = props;
  const { camera } = useThree();
  const [targetPosition, setTargetPosition] = React.useState<Vector3Like>(camera.position)

  React.useEffect(() => {
    // camera.position.set(1, 0, 0); 
    camera.position.set(1, 10, 0); 

    camera.lookAt(0, 0, -1); 

    // battle.events.on('caster-set', (caster: Ally) => {
    //   const xPosition = CASTER_X_POSITION_MAP[caster.name] || 1.1;
    //   setTargetPosition({x: xPosition, y: 10, z: 3 });
    // });
  }, []);

  useFrame(() => {
    const newPosition = camera.position.lerp(targetPosition, 0.2);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z); 
    camera.lookAt(0, 0, -1); 
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
          {scene.battleStore.enemies.map((enemy, idx) => <CombatantSprite key={enemy.name} combatant={enemy} battleScene={scene} position={[idx*5, 0, -2]} isEnemy={true}/>)}
          {scene.battleStore.allies.map((ally, idx) => <CombatantSprite key={ally.name} combatant={ally} battleScene={scene} position={[idx*2 - 2, 0, 2]} isEnemy={false}/>)}
          <Plane/>
        </Physics>
    </Canvas>
    )
  }