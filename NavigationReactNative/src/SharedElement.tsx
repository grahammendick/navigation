import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

var SharedElement = ({ style, ...props }) => (
    Platform.OS == 'android' ? <NVSharedElement {...props} style={style} /> : <View style={style} />
);

var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
