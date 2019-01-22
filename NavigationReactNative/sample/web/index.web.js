import React from 'react';
import {render} from 'react-native';
import {NavigationHandler} from 'navigation-react';
import {NavigationMotion} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';

const stateNavigator = createStateNavigator();

stateNavigator.start();

render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationMotion
        unmountedStyle={{opacity: 0}}
        mountedStyle={{opacity: 1}}
        crumbStyle={{opacity: 0}}>
        {({opacity}, scene, key) => (
        <div key={key}
            style={{opacity}}>
            {scene}
        </div>
        )}
    </NavigationMotion>
  </NavigationHandler>,
  document.getElementById('content')
)
