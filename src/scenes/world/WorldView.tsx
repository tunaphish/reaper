
import * as React from 'react';
import classNames from './world.module.css';
import { World } from './World';
import { observer } from 'mobx-react-lite';


export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <StartBar world={world}/>
    </div>
)
});

export const StartBar = observer(({world}: {world: World}) => {

  return (
    <div onClick={() => console.log('start the game')} style={{ position: 'relative' }}>
      start    
    </div>
  )
});
