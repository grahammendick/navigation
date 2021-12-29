import React from 'react';
import { View } from 'react-native';
import { NavigationMotion } from 'navigation-react-mobile';

const NavigationStack = () => (
    <NavigationMotion
        unmountedStyle={{translate: 100}}
        mountedStyle={{translate: 0}}
        crumbStyle={{translate: 0}}>
        {({translate}, scene, key) => (
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
          )}
    </NavigationMotion>
)

export default NavigationStack;
