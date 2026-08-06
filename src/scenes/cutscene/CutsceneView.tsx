import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Cutscene } from './Cutscene';
import classNames from './cutscene.module.css';
 
interface CutsceneViewProps { 
    cutscene: Cutscene;
    children?: ReactNode;
}
 
export const CutsceneView = observer(({ children, cutscene }: CutsceneViewProps) => {
  return (
    <div className={classNames.container}>
      {children}
      <div className={classNames.footer}>
        <button
          className={classNames.closeButton}
          onClick={() => cutscene.endScene()} 
        >
          End Scene
        </button>
      </div>
    </div>
  );
});
 