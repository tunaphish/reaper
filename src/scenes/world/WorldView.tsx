
import * as React from 'react';
import classNames from './world.module.css';
import { World } from './World';
import { observer } from 'mobx-react-lite';
import { Window } from '../ui/Window';


export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <StartBar world={world}/>
    </div>
)
});

export const StartBar = observer(({world}: {world: World}) => {
  const style: React.CSSProperties = { 
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  };

  return (
    <Window style={style}>
      {/* <span onClick={() => world.openBattleEncounter()}>battle</span> */}
      <span onClick={() => world.openTalkEncounter()}>interact</span>
      <span onClick={() => world.openSystemMenu()}>menu</span>
    </Window>
  )
});
