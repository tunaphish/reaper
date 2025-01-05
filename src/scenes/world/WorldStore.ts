import * as THREE from 'three';
import { makeAutoObservable } from 'mobx';

export class WorldStore {
    targetPosition = new THREE.Vector3(0, 0, 0);
    direction = 1.570;
    isMoving = false;
  
    constructor() {
        makeAutoObservable(this);
    }
  
    setTargetPosition(targetPosition) {
        this.targetPosition = targetPosition;
    }
  
    setDirection(direction) {
        this.direction = direction;
    }
  
    setIsMoving(isMoving) {
        this.isMoving = isMoving;
    }
  }