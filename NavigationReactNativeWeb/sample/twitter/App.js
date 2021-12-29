import React, {useState} from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';
import {getFollows} from './data';

var stateNavigator = createStateNavigator();

const notificationsNavigator = new StateNavigator(stateNavigator);
  stateNavigator.navigate('home');
  if (Platform.OS !== 'web')
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
        badge={!notified ? '' + getFollows().length : null} 
        onPress={() => {setNotified(true)}}>
        <Stack navigator={notificationsNavigator} />
      </TabBarItem>
    </TabBar>
  ) : (
    <Stack navigator={stateNavigator} />
  );
};

export default App;
