import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';
declare var NVBarButton: any;

var BarButtonIOS = props => <NVBarButton key={props.systemItem} {...props} />;

export default Platform.OS === 'ios' ? requireNativeComponent('NVBarButton', BarButtonIOS as any) : () => null;
