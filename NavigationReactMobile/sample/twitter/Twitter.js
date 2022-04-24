import React from 'react';
import {NavigationMotion, Scene} from 'navigation-react-mobile';
import PhotoZoom from './PhotoZoom';
import Home from './Home';
import Tweet from './Tweet';
import Timeline from './Timeline';
import Photo from './Photo';

export default () => (
  <NavigationMotion
    unmountedStyle={(state, data, crumbs) => {
      var {state: previousState, data: previousData} = crumbs[crumbs.length - 1];
      var sharePhoto = state.key === 'photo' && !(previousState.key === 'tweet' && previousData.id === data.id);
      return !sharePhoto ? {translate: 100, scale: 1, opacity: 1} : {translate: 0, scale: 1, opacity: 0};
    }}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={(state, data, crumbs, nextState) => (
      nextState.key !== 'photo' ? {translate: 5, scale: 0.9, opacity: 0} : {translate: 0, scale: 1, opacity: 0}
    )}
    sharedElementMotion={({sharedElements, ...props}) => {
      sharedElements = sharedElements.filter(share => share.oldElement.data.enable || share.mountedElement.data.enable);
      return <PhotoZoom {...props} sharedElements={sharedElements} />;
    }}
    renderMotion={({translate, scale, opacity}, scene, key) => (
      <div key={key}
        className="scene"
        style={{
          transform: `translate(${translate}%) scale(${scale}, ${scale})`,
          opacity
        }}>
        {scene}
      </div>
    )}>
    <Scene stateKey="home"><Home /></Scene>
    <Scene stateKey="tweet"><Tweet /></Scene>
    <Scene stateKey="timeline"><Timeline /></Scene>
    <Scene stateKey="photo"><Photo /></Scene>
  </NavigationMotion>
);
