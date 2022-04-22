import React, {useState, useMemo, useContext} from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem, NavigationBar} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tweet from './Tweet';
import Timeline from './Timeline';
import Stack from './Stack';
import {getNotifications} from './data';

const useStateNavigator = start => {
  const {stateNavigator} = useContext(NavigationContext);
  return useMemo(() => {
    const navigator = new StateNavigator(stateNavigator);
    navigator.navigate(start);
    return navigator;
  }, [])
};

export default () => {
  const [notified, setNotified] = useState(false);
  const homeNavigator = useStateNavigator('home');
  const notificationsNavigator = useStateNavigator('notifications');
  return (
    <>
      <NavigationBar hidden={true} />
      <TabBar primary={true} barTintColor={Platform.OS === 'android' ? null : 'rgb(247,247,247)'} selectedTintColor={Platform.OS === 'android' ? '#1da1f2' : null}>
        <TabBarItem title="Home" image={require('./home.png')}>
          {Platform.OS === 'ios'
            ? (<NavigationHandler stateNavigator={homeNavigator}>
                <Stack>
                  <Stack.Scene name="home" component={<Home />} />
                  <Stack.Scene name="tweet" component={<Tweet />} />
                  <Stack.Scene name="timeline" component={<Timeline />} />
                </Stack>
              </NavigationHandler>)
            : <Home />}
        </TabBarItem>
        <TabBarItem
          title="Notifications"
          image={require('./notifications.png')}
          badge={!notified ? getNotifications().length : null} 
          onPress={() => {setNotified(true)}}>
          {Platform.OS === 'ios'
            ? (<NavigationHandler stateNavigator={notificationsNavigator}>
                <Stack>
                  <Stack.Scene name="notifications" component={<Notifications />} />
                  <Stack.Scene name="tweet" component={<Tweet />} />
                  <Stack.Scene name="timeline" component={<Timeline />} />
                </Stack>
              </NavigationHandler>)
            : <Notifications />}
        </TabBarItem>
      </TabBar>
    </>
  );
}
