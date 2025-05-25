import * as React from 'react';
import * as THREE from 'three';
import styles from './battle.module.css';

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping, Vector3Like, Vector3 } from 'three';
import { Stats, Html, useTexture, } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { QuarksUtil, BatchedRenderer, QuarksLoader } from 'three.quarks';

import { Battle } from './Battle';
import { Meter } from './Meter';
import { Combatant } from '../../model/combatant';
import { Ally } from '../../model/ally';

const ParticleManager = (props: { battle: Battle }) =>{
  const { battle } = props;
  const [batchRenderer] = React.useState(new BatchedRenderer()); // why is state necessary

  const { scene } = useThree()
  React.useEffect(() => {
    const loader = new QuarksLoader();

    battle.events.on('particle-effect', (jsonPath: string, position: [x: number, y: number, z: number]) => { 
      const [x,y,z] = position;
      loader.load(
        jsonPath,
        (obj) => {
          QuarksUtil.addToBatchRenderer(obj, batchRenderer);
          QuarksUtil.setAutoDestroy(obj, true);
          obj.scale.set(0.1, 0.1, 0.1);
          obj.position.set(x,y,z);
          QuarksUtil.play(obj);
          scene.add(obj);
        },
      )
      scene.add(batchRenderer);
    });
  }, [])

  useFrame((state, delta) => {
    batchRenderer.update(delta)
  })

  return null;
}

export const EnemyResourceDisplay = observer((props: {combatant: Combatant, battleScene: Battle }) => {
  const { combatant } = props;

  return (
    <div className={styles.enemyResourceDisplay}>
      <div className={styles.windowName}>{combatant.name}</div>
      <div className={styles.enemyMeterContainer}>
        <Meter value={combatant.health} max={combatant.maxHealth} className={styles.bleedMeter}/>
        <Meter value={combatant.health-combatant.bleed} max={combatant.maxHealth} className={styles.healthMeter}/>
      </div>
      <div className={styles.enemyMeterContainer}>
        <Meter value={combatant.stamina < 0 ? 0 : combatant.stamina } max={combatant.maxStamina} className={styles.staminaMeter}/>
      </div>
    </div>
  )
});

const CombatantSprite = (props: {combatant: Combatant, battleScene: Battle, isEnemy: boolean }) => {
  const { combatant, battleScene, isEnemy } = props;
  const [beingEffected, setBeingEffected] = React.useState(false);
  const texture = useTexture(combatant.spritePath);

  React.useEffect(() => {
    battleScene.events.on('combatant-effected', (effectedCombatant: Combatant) => {
      if (effectedCombatant.name !== combatant.name) return;
      setBeingEffected(true);
    });
  }, []);

  const customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: texture,
    alphaTest: 0.5
  });
  const [x,y,z] = combatant.position

  return (
    // <RigidBody type="dynamic">

      <mesh customDepthMaterial={customDepthMaterial} position={combatant.position} castShadow >
        <Html 
          transform
          occlude='blending'
          pointerEvents='none'
          position={[x,y+1,z]}
        >
          <div style={{position: 'relative'}}>
            { isEnemy && <EnemyResourceDisplay combatant={combatant} battleScene={battleScene}/> }
          </div>
        </Html>
        <planeGeometry args={[1,1]} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          map={texture}
          transparent={true}
          alphaTest={0.5}
        />
      </mesh>
      // <CuboidCollider args={[0.5, 0.5, 0.5]} />
    // </RigidBody>


  )
}

const Plane = () => {
  const checkerTexture = useLoader(TextureLoader, '/reaper/textures/checker.svg')
  checkerTexture.wrapS = checkerTexture.wrapT = RepeatWrapping;
  checkerTexture.repeat.set(10, 10); // Adjust the repeat for more tiles

  return (
    <RigidBody type="fixed" >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} /> 
        <meshStandardMaterial map={checkerTexture} />
      </mesh>
      <CuboidCollider args={[10, 0.1, 10]} friction={0} restitution={0} />
    </RigidBody>
  )
}

const Camera = (props: { battle: Battle }) => {
  const { battle } = props;
  const { camera } = useThree();
  const [targetPosition, setTargetPosition] = React.useState<Vector3Like>(camera.position)


  React.useEffect(() => {
    camera.position.set(1, 0, 0); 
    camera.lookAt(0, 0, -7); 

    battle.events.on('caster-set', (caster: Ally) => {
      const [x,y,z] = caster.position;
      const newTargetPosition = new Vector3(1+x,y,2+z);
      setTargetPosition(newTargetPosition);
    });
  }, []);

  useFrame(() => {
    const {x,y,z} = camera.position.lerp(targetPosition, 0.2);
    camera.position.set(x, y, z); 
    camera.lookAt(0, 0, -7);
  })

  return null; 
}


export const Stage = (props: { scene: Battle }): JSX.Element => {
  const { scene } = props;
  return (
  <Canvas shadows>
    <Stats />
    <Camera battle={scene}/>
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 1, 0]} intensity={100} castShadow />
    <ParticleManager battle={scene} />
    <Physics>
      {scene.battleStore.enemies.map((enemy) => <CombatantSprite key={enemy.name} combatant={enemy} battleScene={scene} isEnemy={true}/>)}
      {scene.battleStore.allies.map((ally) => <CombatantSprite key={ally.name} combatant={ally} battleScene={scene} isEnemy={false}/>)}
      <Plane/>
    </Physics>
  </Canvas>
  )
}