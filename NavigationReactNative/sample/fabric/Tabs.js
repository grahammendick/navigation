import React, {useState, useMemo, useContext} from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import {NavigationStack, Scene, TabBar, TabBarItem, NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getNotifications} from './data';

const useStateNavigator = () => {
  const {stateNavigator} = useContext(NavigationContext);
  return useMemo(() => new StateNavigator(stateNavigator), [])
};

export default () => {
  const [notified, setNotified] = useState(false);
  const homeNavigator = useStateNavigator();
  const notificationsNavigator = useStateNavigator();
  return (
    <CoordinatorLayout>
      <NavigationBar hidden={true} />
      <TabBar bottomTabs={true} primary={true} barTintColor={Platform.OS === 'android' ? 'white' : 'rgb(247,247,247)'} selectedTintColor={Platform.OS === 'android' ? '#1da1f2' : null}>
        <TabBarItem title="Home" image={require('./home.png')}>
          {Platform.OS === 'ios'
            ? (<NavigationHandler stateNavigator={homeNavigator}>
                <NavigationStack>
                  <Scene stateKey="home"><Home /></Scene>
                  <Scene stateKey="tweet"><Tweet /></Scene>
                  <Scene stateKey="timeline"><Timeline /></Scene>
                </NavigationStack>
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
                <NavigationStack>
                  <Scene stateKey="notifications"><Notifications /></Scene>
                  <Scene stateKey="tweet"><Tweet /></Scene>
                  <Scene stateKey="timeline"><Timeline /></Scene>
                </NavigationStack>
              </NavigationHandler>)
            : <Notifications />}
        </TabBarItem>
      </TabBar>
    </CoordinatorLayout>
  );
}
