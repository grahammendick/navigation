import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({stateNavigator}) => (
  <div>
    <h1>Tweet</h1>
    <NavigationLink
      stateKey="timeline"
      stateNavigator={stateNavigator}>
      Timeline
    </NavigationLink>
  </div>
);

