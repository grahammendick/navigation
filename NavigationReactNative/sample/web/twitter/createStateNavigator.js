import React from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getFollows, getTweet, getTimeline} from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home', route: '{tab?}', defaults: {tab: 0}},
    {key: 'notifications'},
    {key: 'tweet', route: 'tweet/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}},
    {key: 'timeline', route: 'timeline/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}}
  ]);
  const {home, notifications, tweet, timeline} = stateNavigator.states;
  const HomeLayout = Platform.OS === 'ios' ? Home : Tabs;
  home.renderScene = ({tab}) => <HomeLayout tweets={getHome()} follows={getFollows()} tab={tab} />;
  notifications.renderScene = () => <Notifications follows={getFollows()} />;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
  timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;
  
  return stateNavigator;
}
