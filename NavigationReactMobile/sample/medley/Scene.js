import React from 'react';
import {NavigationLink} from 'navigation-react';
import {NavigationBackLink} from 'navigation-react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color, stateNavigator}) => {
  const {url, crumbs} = stateNavigator.stateContext;
  return (
    <div style={{backgroundColor: color}}>
      <NavigationLink
        stateKey={`scene${nextDirection[direction]}`}
        stateNavigator={stateNavigator}>
        {direction} {crumbs.length}
      </NavigationLink>
      {stateNavigator.canNavigateBack(1) && <NavigationBackLink
        distance={1}
        stateNavigator={stateNavigator}>
        Back
      </NavigationBackLink>}
    </div>
  );
};
