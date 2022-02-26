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
import Stack from './Stack';

const App = () => (
  <Stack
    crumbStyle={from => from ? 'scale_in' : 'scale_out'}
    unmountStyle={from => from ? 'slide_in' : 'slide_out'}
  >
    <Stack.Scene name="tabs" renderScene={() => <Tabs tweets={getHome()} notifications={getNotifications()} />} />
    <Stack.Scene name="home" renderScene={() => <Home tweets={getHome()} />} />
    <Stack.Scene name="notifications" renderScene={() => <Notifications notifications={getNotifications()} />} />
    <Stack.Scene name="tweet" trackCrumbTrail renderScene={({id}) => <Tweet tweet={getTweet(id)}  />} />
    <Stack.Scene name="timeline" trackCrumbTrail renderScene={({id}) => <Timeline timeline={getTimeline(id)}  />} />
  </Stack>
);

export default App;
