import React from 'react';
import { View } from 'react-native';
import { NavigationMotion, SharedElementMotion } from 'navigation-react-mobile';
import { MobileHistoryManager } from 'navigation-react-mobile';

const NavigationStack = ({unmountedStyle, mountedStyle, crumbedStyle, sharedElementTransition, duration, renderScene, children}) => (
    <NavigationMotion
        unmountedStyle={unmountedStyle || {translate: 100}}
        mountedStyle={mountedStyle || {translate: 0}}
        crumbStyle={crumbedStyle || {translate: 0}}        
        sharedElementMotion={sharedElementTransition}
        duration={duration}
        renderScene={renderScene}>
          {typeof children !== 'function' ?
            ({translate}, scene, key) => (
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
              ) : children}
    </NavigationMotion>
)

NavigationStack.HistoryManager = MobileHistoryManager;
NavigationStack.SharedElementTransition = SharedElementMotion;

export default NavigationStack;
