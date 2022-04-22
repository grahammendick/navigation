import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getHome, getNotifications, getTweet, getTimeline} from './data';
import Stack from './Stack';

const stateNavigator = new StateNavigator([
  {key: 'tabs'},
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);
stateNavigator.navigate('tabs');

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Stack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'}
    >
      <Stack.Scene name="tabs" renderScene={() => <Tabs tweets={getHome()} notifications={getNotifications()} />} />
      <Stack.Scene name="home" renderScene={() => <Home tweets={getHome()} />} />
      <Stack.Scene name="notifications" renderScene={() => <Notifications notifications={getNotifications()} />} />
      <Stack.Scene name="tweet" renderScene={({id}) => <Tweet tweet={getTweet(id)}  />} />
      <Stack.Scene name="timeline" renderScene={({id}) => <Timeline timeline={getTimeline(id)}  />} />
    </Stack>
  </NavigationHandler>
);

export default App;
