import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {SharedElementMotion} from 'navigation-react-native';

export default (props) => (
  <SharedElementMotion
    {...props}
    elementStyle={(name, data) => data}
    style={styles.motion}
    onAnimating={(name, ref) => {ref.setNativeProps({style:{opacity: 0}})}}
    onAnimated={(name, ref) => {ref.setNativeProps({style:{opacity: 1}})}}>
    {({x, y, w, h}, name, {image, text}) => (
      name.startsWith('image') ? <Image key={name}
        source={image}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
        }}>
      </Image> : <View key={name}
        style={[{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
        }, styles.priceLabel]}>
          <Text style={styles.priceLabelText}>
            ${text}
          </Text>
        </View>
    )}
  </SharedElementMotion>
);

const styles = StyleSheet.create({
  motion: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  priceLabel: {
    backgroundColor: 'rgba(0, 0, 0, .75)',
    paddingVertical: 7.5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  priceLabelText: {
    fontSize: 19,
    textAlign: 'right',
    color: 'white',
  },
});
