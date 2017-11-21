import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default ({stateNavigator}) => (
  <NavigationMotion
    unmountedStyle={state => state.unmountedStyle}
    mountedStyle={state => state.mountedStyle}
    crumbStyle={state => state.crumbStyle}
    duration={1000}
    stateNavigator={stateNavigator}>
    {({translateX = 0, translateY = 0}, scene, key, active) => {
      var {clientWidth, clientHeight} = document.documentElement;
      return <div key={key}
        className="scene"
        style={{
          overflow: active ? 'auto' : 'hidden',
          transform: `translate(${translateX * clientWidth}px, ${translateY * clientHeight}px)`
        }}>
        {scene}
      </div>
    }}
  </NavigationMotion>
);
