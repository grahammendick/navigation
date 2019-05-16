import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default ({app}) => (
  <NavigationMotion
    app={app}
    unmountedStyle={state => state.unmountedStyle}
    mountedStyle={state => state.mountedStyle}
    crumbStyle={state => state.crumbStyle}
    duration={1000}>
    {({translateX = 0, translateY = 0}) => (
      <div
        className="scene"
        style={{transform: `translate(${translateX}%, ${translateY}%)`}} />
    )}
  </NavigationMotion>
);
