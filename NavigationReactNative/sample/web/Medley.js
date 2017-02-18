import React from 'react';
import NavigationMotion from './NavigationMotion';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={state => state.mountedStyle()}
    crumbStyle={state => state.crumbStyle()}
    stateNavigator={stateNavigator}>
    {({translateX  = 0, translateY = 0}, scene, url) => (
      <div
        key={url}
        style={{
          position: 'absolute',
          transform: `translate(${translateX * 300}px, ${translateY * 460}px)`,
        }}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
