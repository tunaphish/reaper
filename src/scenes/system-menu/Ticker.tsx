import classNames from './system-menu.module.css';

import * as React from 'react';

export const Ticker = ({ text }: { text: string; }): JSX.Element => (
  <div className={classNames.ticker}>
    <div className={classNames.tickerTrack}>
      <span>{text}&nbsp;&nbsp;</span>
      <span>{text}&nbsp;&nbsp;</span>
    </div>
  </div>
);
