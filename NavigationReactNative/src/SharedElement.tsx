import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

var SharedElement = (props) => (
    Platform.OS == 'android' ? <NVSharedElement {...props} /> : <View {...props} />
);

var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
