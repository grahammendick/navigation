import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getFollows, getTweet, getTimeline} from './data';

var stateNavigator = new StateNavigator([
  {key: 'home', title: 'Home'},
  {key: 'notifications', title: 'Notifications'},
  {key: 'tweet', title: 'Tweet', trackCrumbTrail: true},
  {key: 'timeline', title: 'Timeline', trackCrumbTrail: true}
]);
const {home, notifications, tweet, timeline} = stateNavigator.states;
home.renderScene = () => <Home tweets={getHome()} follows={getFollows()} />;
notifications.renderScene = () => <Notifications follows={getFollows()} />;
tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;

for(var key in stateNavigator.states) {
  var state = stateNavigator.states[key];
  state.getCrumbStyle = from => from ? 'scale_in' : 'scale_out';
  state.getUnmountStyle = from => from ? 'slide_in' : 'slide_out';
}

timeline.getTitle = ({sceneTitle}) => sceneTitle;

var stateNavigators = [stateNavigator, new StateNavigator(stateNavigator)];
stateNavigator.navigate('home');
stateNavigators[1].navigate('notifications');

addNavigateHandlers(stateNavigators);

export default ({crumb, tab = 0}) => (
  <NavigationHandler stateNavigator={stateNavigators[tab]}>
    <Scene crumb={crumb} tab={tab} />
  </NavigationHandler>
);
