import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default ({stateNavigator}) => (
  <NavigationMotion
    unmountedStyle={{translate: 1, scale: 1, opacity: 1}}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={{translate: 0.05, scale: 0.9, opacity: 0}}
    stateNavigator={stateNavigator}>
    {({translate, scale, opacity}, scene, key, active) => {
      var {clientWidth} = document.documentElement;
      return <div key={key}
        className="scene"
        style={{
          overflow: active ? 'auto' : 'hidden',
          transform: `translate(${translate * clientWidth}px) scale(${scale}, ${scale})`,
          opacity
        }}>
        {scene}
      </div>
    }}
  </NavigationMotion>
);
