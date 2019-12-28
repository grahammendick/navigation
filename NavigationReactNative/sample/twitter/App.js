import React, {useState} from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
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
home.renderScene = () => <Home tweets={getHome()} follows={getFollows()} />;
notifications.renderScene = () => <Notifications follows={getFollows()} />;
tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)}  />;
timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)}  />;

const notificationsNavigator = new StateNavigator(stateNavigator);
stateNavigator.navigate('home');
notificationsNavigator.navigate('notifications');

export default () => {
  const [notified, setNotified] = useState(false);
  return (
    <TabBar bottomTabs={false} selectedTintColor='blue'>
      <TabBarItem title="Home">
        <NavigationHandler stateNavigator={stateNavigator}>
          <NavigationStack
            crumbStyle={from => from ? 'scale_in' : 'scale_out'}
            unmountStyle={from => from ? 'slide_in' : 'slide_out'} />
        </NavigationHandler>
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        badge={!notified ? getFollows().length : null} 
        onPress={() => {setNotified(true)}}>
        <NavigationHandler stateNavigator={notificationsNavigator}>
          <NavigationStack
            primary={false}
            crumbStyle={from => from ? 'scale_in' : 'scale_out'}
            unmountStyle={from => from ? 'slide_in' : 'slide_out'} />
        </NavigationHandler>
      </TabBarItem>
    </TabBar>
  );
}
