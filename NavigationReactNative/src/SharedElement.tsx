import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

var SharedElement = ({ style, children, ...props }) => (
    Platform.OS == 'android'
        ? <NVSharedElement {...props} style={style}>{children}</NVSharedElement>
        : <View style={style}>{children}</View>
);

var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
