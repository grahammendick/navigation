import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import Home from './Home';
import {getHome, getFollows, getTweet, getTimeline} from './data';

var stateNavigator = new StateNavigator([
  {key: 'home', title: 'Home'},
  {key: 'notifications', title: 'Notifications'},
  {key: 'tweet', title: 'Tweet', trackCrumbTrail: true},
  {key: 'timeline', title: 'Timeline', trackCrumbTrail: true}
]);
const {home, notifications, tweet, timeline} = stateNavigator.states;
home.renderScene = () => <Home tweets={getHome()} follows={getFollows()} />;

var stateNavigators = [stateNavigator, new StateNavigator(stateNavigator)];
stateNavigator.navigate('home');
stateNavigators[1].navigate('notifications');

addNavigateHandlers(stateNavigators);

export default ({crumb, tab}) => (
  <NavigationHandler stateNavigator={stateNavigators[tab]}>
    <Scene crumb={crumb} tab={tab} />
  </NavigationHandler>
);
