import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({stateNavigator}) => (
  <div>
    <h1>Timeline</h1>
    <NavigationLink
      stateKey="tweet"
      stateNavigator={stateNavigator}>
      Tweet
    </NavigationLink>
  </div>
);

