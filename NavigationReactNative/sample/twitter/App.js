import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, TabBarIOS, TabBarItemIOS} from 'navigation-react-native';
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

timeline.getTitle = ({sceneTitle}) => sceneTitle;

var notificationsNavigator = new StateNavigator(stateNavigator);
stateNavigator.navigate('home');
notificationsNavigator.navigate('notifications');

var Stack = ({stateNavigator}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      title={({getTitle, title}, data) => getTitle ? getTitle(data) : title}
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'scale_in' : 'scale_out'}>
    </NavigationStack>
  </NavigationHandler>
);

export default () => (
  <TabBarIOS style={{flex: 1}}>
    <Stack stateNavigator={stateNavigator} />
    <Stack stateNavigator={notificationsNavigator} />
  </TabBarIOS>
);
