import React from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationStack} from 'navigation-react-native';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home', route: '{tab?}', defaults: {tab: 'home'}},
    {key: 'notifications', route: 'x/y'},
    {key: 'tweet', route: 'tweet/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}},
    {key: 'timeline', route: 'timeline/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}}
  ], NavigationStack.HistoryManager && new NavigationStack.HistoryManager(url => {
    const {state, data} = stateNavigator.parseLink(url);
    let fluent = stateNavigator.fluent().navigate('home');
    if (state.key === 'home' && data.tab === 'notifications')
      stateNavigator.historyManager.addHistory(fluent.url, true);
    return fluent.navigate(state.key, data).url;
  }));

  if (Platform.OS === 'web') stateNavigator.start();
  
  return stateNavigator;
}
