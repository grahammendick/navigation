import React from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NativeHistoryManager} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getFollows, getTweet, getTimeline} from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home', route: '{tab?}', defaults: {tab: 'home'}, title: 'Home'},
    {key: 'notifications', title: 'Notifications'},
    {key: 'tweet', route: 'tweet/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}, title: 'Tweet'},
    {key: 'timeline', route: 'timeline/{id}', trackCrumbTrail: true, defaultTypes: {id: 'number'}, title: 'Timeline'}
  ], new NativeHistoryManager(url => {
    const {state, data} = stateNavigator.parseLink(url);
    let fluent = stateNavigator.fluent().navigate('home');
    if (state.key === 'home' && data.tab === 'notifications')
      stateNavigator.historyManager.addHistory(fluent.url, true);
    return fluent.navigate(state.key, data).url;
  }));
  const {home, notifications, tweet, timeline} = stateNavigator.states;
  const HomeLayout = Platform.OS === 'ios' ? Home : Tabs;
  home.renderScene = ({tab}) => <HomeLayout tweets={getHome()} follows={getFollows()} tab={tab} />;
  notifications.renderScene = () => <Notifications follows={getFollows()} />;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
  timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;
  
  if (Platform.OS !== 'web') stateNavigator.navigate('home');
  else stateNavigator.start();
  
  return stateNavigator;
}
