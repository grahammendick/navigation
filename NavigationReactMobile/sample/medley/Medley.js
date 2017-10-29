import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default ({stateNavigator}) => (
  <NavigationMotion
    unmountedStyle={state => state.unmountedStyle}
    mountedStyle={state => state.mountedStyle}
    crumbStyle={state => state.crumbStyle}
    duration={state => state.duration}
    easing={state => state.easing}
    stateNavigator={stateNavigator}>
    {({translateX  = 0, translateY = 0}, scene, key) => (
      <div key={key}
        className="scene"
        style={{transform: `translate(${translateX * 300}px, ${translateY * 460}px)`}}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
