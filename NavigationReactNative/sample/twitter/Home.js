import React from 'react';
import {Platform} from 'react-native';
import {NavigationBar, CoordinatorLayout, FloatingActionButton} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar title="Home" barTintColor={Platform.OS === 'android' ? '#fff' : 'rgb(247,247,247)'} />
    <Tweets tweets={tweets} />
    <FloatingActionButton text='Hello' image={require('./home.png')} />
  </CoordinatorLayout>
);
