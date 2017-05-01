import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {SharedElementMotion} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => data}
    onAnimating={(name, oldRef, mountedRef) => {
      oldRef.setNativeProps({style:{opacity: 0}});
      mountedRef.setNativeProps({style:{opacity: 0}});
    }}
    onAnimated={(name, oldRef, mountedRef) => {
      if (oldRef)
        oldRef.setNativeProps({style:{opacity: 1}});
      mountedRef.setNativeProps({style:{opacity: 1}});
    }}
    duration={500}
    stateNavigator={stateNavigator}>
    {({x, y, w, h}, name, {image, text}) => (
      name.startsWith('image') ? <Image
        source={image}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
        }}>
      </Image> : <View
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
