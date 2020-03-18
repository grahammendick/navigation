import React from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar title="Home" barTintColor={Platform.OS === 'android' ? '#fff' : null} />
    <SafeAreaView style={{flex: 1}}>
      <Tweets tweets={tweets} />
    </SafeAreaView>
  </CoordinatorLayout>
);
