import React from 'react';
import {NavigationLink} from 'navigation-react';
import Banner from './Banner';

export default ({timeline: {id, name, username, logo, bio, 
  followers, following, tweets}, stateNavigator}) => (
  <div>
    <Banner title={name} stateNavigator={stateNavigator} />
  </div>
);

