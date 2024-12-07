import React from 'react';
import { requireNativeComponent } from 'react-native';

var SharedElement = ({ style, children, ...props }) => (
    <NVSharedElement {...props} style={style}>{children}</NVSharedElement>
);

var NVSharedElement = global.nativeFabricUIManager ? require('./SharedElementNativeComponent').default : requireNativeComponent('NVSharedElement');

export default SharedElement;
