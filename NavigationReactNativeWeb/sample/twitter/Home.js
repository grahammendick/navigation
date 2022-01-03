import React from 'react';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar
      title="Home"
      isActive={({tab}) => tab === 0}
      barTintColor="#fff" />
    <Tweets tweets={tweets} />
  </CoordinatorLayout>
);
