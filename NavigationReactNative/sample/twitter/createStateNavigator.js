import React from 'react';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Notifications from './Notifications';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getFollows, getTweet, getTimeline} from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home'},
    {key: 'notifications'},
    {key: 'tweet', trackCrumbTrail: true},
    {key: 'timeline', trackCrumbTrail: true}
  ]);

  const { home, notifications, tweet, timeline } = stateNavigator.states;
  home.renderScene = () => <Home tweets={getHome()} follows={getFollows()} stateNavigator={stateNavigator}/>;
  notifications.renderScene = () => <Notifications follows={getFollows()} stateNavigator={stateNavigator}/>;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} stateNavigator={stateNavigator} />;
  timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)} stateNavigator={stateNavigator} />;

  tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

  timeline.truncateCrumbTrail = (state, crumbs, data) => {
    const lastCrumb = crumbs[crumbs.length - 1];
    if (lastCrumb.state === state && lastCrumb.data.id === data.id)
      return crumbs.slice(0, -1);
    return crumbs;
  };
  return stateNavigator;
}
