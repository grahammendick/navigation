import React from 'react';
import {View} from 'react-native';
import {NavigationStack} from 'navigation-react-native';

export default (props) => (
  <NavigationStack.SharedElementTransition
    {...props}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {(style, name, {left, top, width, height, color}) => (
      <View key={name}
        style={{
          position: 'absolute',
          left, top, width, height,
          transformOrigin: 'top left',
          transform: [
            {translateX: style.left - left}, 
            {translateY: style.top - top},
            {scaleX:  style.width / width},
            {scaleY: style.height / height}
          ],      
          backgroundColor: color,
        }}>
      </View>
    )}
  </NavigationStack.SharedElementTransition>
);
