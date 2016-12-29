import React from 'react';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getTweet, getTimeline} from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    { key: 'home' },
    { key: 'tweet', trackCrumbTrail: true },
    { key: 'timeline', trackCrumbTrail: true }
  ]);

  const { home, tweet, timeline } = stateNavigator.states;
  home.renderScene = () => <Home tweets={getHome()} stateNavigator={stateNavigator}/>;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} stateNavigator={stateNavigator} />;
  timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)} stateNavigator={stateNavigator} />;

  tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

  timeline.truncateCrumbTrail = (state, crumbs, data) => {
    const crumb = crumbs[crumbs.length - 1];
    if (crumb.state === state && crumb.data.id === data.id)
      return crumbs.slice(0, -1);
    return crumbs;
  };
  return stateNavigator;
}
