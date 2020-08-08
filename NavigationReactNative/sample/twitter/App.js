import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getNotifications, getTweet, getTimeline} from './data';

const stateNavigator = new StateNavigator([
  {key: 'tabs'},
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);
const {tabs, home, notifications, tweet, timeline} = stateNavigator.states;
tabs.renderScene = () => <Tabs tweets={getHome()} notifications={getNotifications()} />;
home.renderScene = () => <Home tweets={getHome()} />;
notifications.renderScene = () => <Notifications notifications={getNotifications()} />;
tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;

stateNavigator.navigate('tabs');

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'} />
  </NavigationHandler>
);

export default App;
