import React from 'react';
import {Platform} from 'react-native';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar title="Home" barTintColor={Platform.OS === 'android' ? '#fff' : 'rgb(247,247,247)'} />
    <Tweets tweets={tweets} />
  </CoordinatorLayout>
);
