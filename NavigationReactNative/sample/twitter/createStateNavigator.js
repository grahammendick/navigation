import React from 'react';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Tweet from './Tweet';
import {getHome, getTweet} from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    { key: 'home' },
    { key: 'tweet', trackCrumbTrail: true }
  ]);

  const { home, tweet } = stateNavigator.states;
  home.renderScene = () => <Home tweets={getHome()} stateNavigator={stateNavigator}/>;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} stateNavigator={stateNavigator} />;

  tweet.truncateCrumbTrail = (state, crumbs) => crumbs;
  return stateNavigator;
}
