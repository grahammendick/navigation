import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default ({stateNavigator}) => (
  <NavigationMotion
    unmountedStyle={state => state.unmountedStyle}
    mountedStyle={state => state.mountedStyle}
    crumbStyle={state => state.crumbStyle}
    duration={1000}
    stateNavigator={stateNavigator}>
    {({translateX = 0, translateY = 0}, scene, key) => (
      <div key={key}
        className="scene"
        style={{transform: `translate(${translateX * window.innerWidth}px, ${translateY * window.innerHeight}px)`}}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
