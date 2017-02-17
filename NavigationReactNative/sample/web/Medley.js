import React from 'react';
import NavigationMotion from './NavigationMotion';
import spring from './spring';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    crumbStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    stateNavigator={stateNavigator}>
    {({translateX, translateY}, scene) => (
      <div
        style={{
          position: 'absolute',
          transform: `translate(${translateX * 400}px, ${translateY * 600}px)`,
        }}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
