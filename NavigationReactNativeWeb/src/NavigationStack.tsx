import React from 'react';
import { View } from 'react-native';
import { NavigationMotion, Scene, SharedElementMotion } from 'navigation-react-mobile';
import { MobileHistoryManager } from 'navigation-react-mobile';

const cloneScenes = (children, nested = false) => (
  React.Children.map(children, scene => (
    (scene.type === Scene || nested)
      ? React.cloneElement(scene, { crumbStyle: scene.props.crumbedStyle })
      : React.cloneElement(scene, null, cloneScenes(scene.props.children, true) as any)
  ))
);

const NavigationStack = ({unmountedStyle, mountedStyle, crumbedStyle, sharedElementTransition, duration, renderScene, renderTransition, children}) => (
    <NavigationMotion
        unmountedStyle={unmountedStyle || {translate: 100}}
        mountedStyle={mountedStyle || {translate: 0}}
        crumbStyle={crumbedStyle || {translate: 0}}        
        sharedElementMotion={sharedElementTransition}
        duration={duration}
        renderScene={renderScene}
        renderMotion={typeof children !== 'function' ? renderTransition || renderMotion : undefined}>
        {typeof children !== 'function' ? cloneScenes(children) : (children || renderMotion)}
    </NavigationMotion>
);

const renderMotion = ({translate}, scene, key) => (
  <View key={key}
    style={{
      transform: `translate(${translate}%)` as any,
      position: 'absolute',
      backgroundColor: '#fff',
      left: 0, right: 0, top: 0, bottom: 0,
      overflow: 'hidden',
    }}>
    {scene}
  </View>
);

NavigationStack.Scene = Scene;
NavigationStack.HistoryManager = MobileHistoryManager;
NavigationStack.SharedElementTransition = SharedElementMotion;

export default NavigationStack;
