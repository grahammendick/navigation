import React, {useState} from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getFollows, getTweet, getTimeline} from './data';

const stateNavigator = new StateNavigator([
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);
const {home, notifications, tweet, timeline} = stateNavigator.states;
const HomeLayout = Platform.OS === 'ios' ? Home : Tabs;
home.renderScene = () => <HomeLayout tweets={getHome()} follows={getFollows()} />;
notifications.renderScene = () => <Notifications follows={getFollows()} />;
tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;

const notificationsNavigator = new StateNavigator(stateNavigator);
stateNavigator.navigate('home');
notificationsNavigator.navigate('notifications');

const Stack = ({navigator}) => (
  <NavigationHandler stateNavigator={navigator}>
    <NavigationStack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'} />
  </NavigationHandler>
);

const App = () => {
  const [notified, setNotified] = useState(false);
  return Platform.OS === 'ios' ? (
    <TabBar>
      <TabBarItem title="Home" image={require('./home.png')}>
        <Stack navigator={stateNavigator} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        badge={!notified ? getFollows().length : null} 
        onPress={() => {setNotified(true)}}>
        <Stack navigator={notificationsNavigator} />
      </TabBarItem>
    </TabBar>
  ) : (
    <Stack navigator={stateNavigator} />
  );
};

export default App;
