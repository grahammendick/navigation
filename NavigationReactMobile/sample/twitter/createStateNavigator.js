import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Home from './Home';
import Tweet from './Tweet';
import Timeline from './Timeline';

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
  home.renderScene = data => <Home stateNavigator={stateNavigator}/>;
  tweet.renderScene = data => <Tweet stateNavigator={stateNavigator}/>;
  timeline.renderScene = data => <Timeline stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
