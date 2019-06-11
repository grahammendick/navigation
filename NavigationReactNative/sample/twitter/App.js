import React from 'react';
import {Platform} from 'react-native';
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

var notificationsNavigator = new StateNavigator(stateNavigator);
stateNavigator.navigate('home');

export default () => (
  Platform.OS === 'ios' ? (
    <TabBarIOS>
      <TabBarItemIOS title="Home">
        <NavigationHandler stateNavigator={stateNavigator}>
          <NavigationStack title={({title}, {sceneTitle}) => sceneTitle || title} />
        </NavigationHandler>
      </TabBarItemIOS>
      <TabBarItemIOS title="Notifications" onPress={() => {
        if (!notificationsNavigator.stateContext.state)
          notificationsNavigator.navigate('notifications');
      }}>
        <NavigationHandler stateNavigator={notificationsNavigator}>
          <NavigationStack title={({title}, {sceneTitle}) => sceneTitle || title} />
        </NavigationHandler>
      </TabBarItemIOS>
    </TabBarIOS>
  ) : (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack
        crumbStyle={from => from ? 'scale_in' : 'scale_out'}
        unmountStyle={from => from ? 'slide_in' : 'slide_out'}>
      </NavigationStack>
    </NavigationHandler>
  )
);
