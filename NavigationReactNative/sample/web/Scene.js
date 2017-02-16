import React from 'react';
import {NavigationLink, NavigationBackLink} from 'navigation-react';

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
      <NavigationLink stateKey={`scene${nextDirection[direction]}`}>
        {direction} {crumbs.length}
      </NavigationLink>
      <NavigationBackLink distance={1}>
        Back
      </NavigationBackLink>
    </div>
  )
};
