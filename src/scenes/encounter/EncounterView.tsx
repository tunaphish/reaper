import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { Encounter } from './Encounter';
import { TextSpeed, TextWindow, Window as WindowModel, EventType, Event, ChoiceWindow, Option } from '../../model/spread';
import classNames from './encounter.module.css';

import { TypewriterText } from './TypewriterText';
import { ActiveSpread } from './EncounterStore';
import { ImageWindowContent } from '../shared';
import { MenuCursor } from '../shared/CursorList';
import { PanelWindow } from '../shared/Window';

// REPLACE KEY WITH SOMETHING ELSE... maybe ID
export const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={classNames.encounterContainer}>
      {
        encounter.encounterStore.activeSpreads.map((activeSpread, idx) => <SpreadView encounter={encounter} activeSpread={activeSpread} key={idx} activeSpreadIndex={idx}/>)
      }
    </div>
  )
});

const isWindow = (event: Event) => (event.type === EventType.CHOICE || event.type === EventType.IMAGE || event.type === EventType.TEXT);

type SpreadViewProps = {
  activeSpread: ActiveSpread
  encounter: Encounter
  activeSpreadIndex: number
}
const SpreadView = observer(({activeSpread, encounter, activeSpreadIndex}: SpreadViewProps) => {
  return activeSpread.spread.events
    .slice(0, activeSpread.spreadIndex+1)
    .filter(isWindow)
    .map((eventWindow, idx) => (
    <InteractableWindow 
      encounter={encounter} 
      window={eventWindow} 
      key={idx} 
      activeSpreadsIndex={activeSpreadIndex}
    />))
     
})

type InteractableWindowProps = {
  encounter: Encounter, 
  window: WindowModel,
  activeSpreadsIndex: number,
}

const InteractableWindow = ({window, encounter, activeSpreadsIndex}: InteractableWindowProps) => {
  const {advanceTimerInMs} = window;
    React.useEffect(() => {
      if (!advanceTimerInMs) return;

      const timer = setTimeout(() => {
        encounter.advanceSpread(activeSpreadsIndex)
      }, advanceTimerInMs)

      return () => clearTimeout(timer);
    }, [advanceTimerInMs, encounter])
    
    // const activeSpread = encounter.encounterStore.activeSpreads[activeSpreadsIndex];
    // const isLastWindow = window === activeSpread.spread.events[activeSpread.spread.events.length-1];
    const isInteractable = !advanceTimerInMs;

    const onClickWindow = () => {
      if (!isInteractable) return;
      encounter.advanceSpread(activeSpreadsIndex);
    }
    
    return (
      <PanelWindow onClick={onClickWindow} window={window}>
        {isInteractable && <MenuCursor/>}
        <WindowContentView window={window} encounter={encounter}/>
      </PanelWindow>
    )
}

const WindowContentView = (props: { window: WindowModel, encounter: Encounter }) => {
  switch (props.window.type) {
    case EventType.IMAGE:
      return <ImageWindowContent imageWindow={props.window} />
    case EventType.TEXT:
      return <TextWindowView textWindow={props.window} />
    case EventType.CHOICE:
      return <ChoiceWindowView choiceWindow={props.window} encounter={props.encounter} />
    default:
      return null
  }
}

const TextWindowView = (props: { textWindow: TextWindow }) => {
  const {line, speed} = props.textWindow;
  return <TypewriterText line={line} textSpeed={speed || TextSpeed.NORMAL} />
}

const OptionView = ({option, encounter}: {option: Option, encounter: Encounter}) => {
  const [selected, setSelected] = React.useState(false);

  const onClick = () => {
    if (selected) return;
    setSelected(true);
    encounter.addSpread(option.nextSpread)
  }
  return (
    <li onClick={onClick} className={selected ? classNames.disabled : ''}>
        <TypewriterText line={option.line} textSpeed={TextSpeed.FAST}/>
    </li>
  )
}

type ChoiceWindowViewProps = {
  choiceWindow: ChoiceWindow
  encounter: Encounter
}

const ChoiceWindowView = ({ choiceWindow, encounter }: ChoiceWindowViewProps) => {
  const { title, options } = choiceWindow

  return (
    <div>
      <TypewriterText line={title} textSpeed={TextSpeed.NORMAL} />
      <ul>
        {options.map((option, index) => <OptionView option={option} encounter={encounter} key={index} />)}
      </ul>
    </div>
  )
}

