import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default () => (
  <NavigationMotion
    unmountedStyle={(state) => (
      state.key !== 'photo' ? {translate: 100, scale: 1, opacity: 1} : {translate: 0, scale: 1, opacity: 0}
    )}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={(state, data, crumbs, nextState) => (
      nextState.key !== 'photo' ? {translate: 5, scale: 0.9, opacity: 0} : {translate: 0, scale: 1, opacity: 0}
    )}>
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
