import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, TabBar, TabBarItem} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';
import {getFollows} from './data';

var stateNavigator = createStateNavigator();

const notificationsNavigator = new StateNavigator(stateNavigator);
notificationsNavigator.historyManager.disabled = true;
notificationsNavigator.historyManager.stop();
notificationsNavigator.navigate('notifications');

const Stack = ({navigator}) => (
  <NavigationHandler stateNavigator={navigator}>
    <NavigationStack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'}
      unmountedStyle={{translate: 100, scale: 1, opacity: 1}}
      mountedStyle={{translate: 0, scale: 1, opacity: 1}}
      crumbedStyle={{translate: 5, scale: 0.9, opacity: 0}}>
      {({translate, scale, opacity}, scene, key) => (
        <View key={key}
          style={{
            transform: `translate(${translate}%) scale(${scale}, ${scale})`,
            opacity,
            position: 'absolute',
            backgroundColor: '#fff',
            left: 0, right: 0, top: 0, bottom: 0,
            overflow: 'hidden'
          }}>
          {scene}
        </View>
      )}
    </NavigationStack>
  </NavigationHandler>
);

const App = () => {
  const [notified, setNotified] = useState(false);
  return Platform.OS === 'ios' ? (
    <TabBar barTintColor="#fff">
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
