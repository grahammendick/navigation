import React from 'react';
import {Platform} from 'react-native';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar
      title="Home"
      isActive={({tab}) => tab === 0}
      barTintColor={Platform.OS === 'android' ? '#fff' : null} />
    <Tweets tweets={tweets} />
  </CoordinatorLayout>
);
