import React from 'react';
import {NavigationContext, NavigationBackLink, NavigationLink} from 'navigation-react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <div style={{backgroundColor: color}}>
        <NavigationLink stateKey={`scene${nextDirection[direction]}`}>
          {direction} {stateNavigator.stateContext.crumbs.length}
        </NavigationLink>
        {stateNavigator.stateContext.crumbs.length > 0 && (
          <NavigationBackLink distance={1}>
            Back
          </NavigationBackLink>
        )}
      </div>
    )}
    </NavigationContext.Consumer>
);

