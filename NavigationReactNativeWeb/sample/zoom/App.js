import React from 'react';
import {View} from 'react-native';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';
import ZoomShared from './ZoomShared';

var stateNavigator = createStateNavigator();

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      unmountedStyle={{opacity: 0}}
      mountedStyle={{opacity: 1}}
      crumbedStyle={{opacity: 0}}
      sharedElements={(_, {color}) => color && [color]}
      sharedElementTransition={props => <ZoomShared {...props} />}>
      {({opacity}, scene, key) => (
        <View key={key}
          style={{
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
export default App;
