import React from 'react';
import {NavigationLink} from 'navigation-react';
import {NavigationBackLink} from 'navigation-react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color, index}) => (
  <div style={{backgroundColor: color}}>
    <NavigationLink stateKey={`scene${nextDirection[direction]}`}>
      {direction} {index}
    </NavigationLink>
    {index > 0 && <NavigationBackLink distance={1}>
      Back
    </NavigationBackLink>}
  </div>
);

