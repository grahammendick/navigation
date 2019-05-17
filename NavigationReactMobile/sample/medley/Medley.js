import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default () => (
  <NavigationMotion
    unmountedStyle={state => state.unmountedStyle}
    mountedStyle={state => state.mountedStyle}
    crumbStyle={state => state.crumbStyle}
    duration={1000}>
    {({translateX = 0, translateY = 0}, scene, key, active) => (
      <div key={key}
        className="scene"
        style={{transform: `translate(${translateX}%, ${translateY}%)`}}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
