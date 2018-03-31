import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default () => (
  <NavigationMotion
    unmountedStyle={{translate: 100, scale: 1, opacity: 1}}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={{translate: 5, scale: 0.9, opacity: 0}}>
    {({translate, scale, opacity}, scene, key, active) => (
      <div key={key}
        className="scene"
        style={{
          transform: `translate(${translate}%, 0) scale(${scale}, ${scale})`,
          opacity
        }}>
        {scene}
      </div>
    )}
  </NavigationMotion>
);
