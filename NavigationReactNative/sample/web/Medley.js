import React from 'react';
import NavigationMotion from './NavigationMotion';
import spring from './spring';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    crumbStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({translateX, translateY}, scene) => (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(${translateX * 100}px, ${translateY * 100}px)`,
        }}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
