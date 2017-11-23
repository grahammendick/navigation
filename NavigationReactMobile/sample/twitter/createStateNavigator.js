import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home', route: ''},
    {key: 'tweet', trackCrumbTrail: true},
    {key: 'timeline', trackCrumbTrail: true}
  ], new MobileHistoryManager(url => {
    var {state, data} = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
      .navigate('home')
      .navigate(state.key, data).url;
  }));

  const {home, tweet, timeline} = stateNavigator.states;
  home.renderScene = data => null;
  tweet.renderScene = data => null;
  timeline.renderScene = data => null;
  
  return stateNavigator;
}
