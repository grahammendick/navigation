import React from 'react';
import {NavigationLink} from 'navigation-react';
import {NavigationBackLink} from 'navigation-react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color, index, stateNavigator}) => (
  <div style={{backgroundColor: color}}>
    <NavigationLink
      stateKey={`scene${nextDirection[direction]}`}
      stateNavigator={stateNavigator}>
      {direction} {index}
    </NavigationLink>
    {index > 0 && <NavigationBackLink
      distance={1}
      stateNavigator={stateNavigator}>
      Back
    </NavigationBackLink>}
  </div>
);

