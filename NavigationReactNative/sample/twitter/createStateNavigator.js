import React from 'react';
import { StateNavigator } from 'navigation';
import Home from './Home';
import Tweet from './Tweet';
import { getHome } from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    { key: 'home' },
    { key: 'tweet', trackCrumbTrail: true }
  ]);

  var { home, tweet } = stateNavigator.states;
  home.renderScene = () => <Home tweets={getHome()} stateNavigator={stateNavigator}/>;
  tweet.renderScene = () => <Tweet stateNavigator={stateNavigator} />;

  tweet.truncateCrumbTrail = (state, crumbs) => crumbs;
  return stateNavigator;
}
