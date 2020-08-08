import React, {useState, useMemo, useContext} from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem, NavigationBar} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

const useStateNavigator = start => {
  const {stateNavigator} = useContext(NavigationContext);
  return useMemo(() => {
    const navigator = new StateNavigator(stateNavigator);
    navigator.navigate(start);
    return navigator;
  }, [])
};

const Stack = ({stateNavigator}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack />
  </NavigationHandler>
);

export default ({tweets, notifications}) => {
  const [notified, setNotified] = useState(false);
  const homeNavigator = useStateNavigator('home');
  const notificationsNavigator = useStateNavigator('notifications');
  return (
    <>
      <NavigationBar hidden={true} />
      <TabBar primary={true} selectedTintColor="#1da1f2">
        <TabBarItem title="Home" image={require('./home.png')}>
          {Platform.OS === 'android'
            ? <Home tweets={tweets} />
            : <Stack stateNavigator={homeNavigator} />}
        </TabBarItem>
        <TabBarItem
          title="Notifications"
          image={require('./notifications.png')}
          badge={!notified ? notifications.length : null} 
          onPress={() => {setNotified(true)}}>
          {Platform.OS === 'android'
            ? <Notifications notifications={notifications} />
            : <Stack stateNavigator={notificationsNavigator} />}        
        </TabBarItem>
      </TabBar>
    </>
  );
}
