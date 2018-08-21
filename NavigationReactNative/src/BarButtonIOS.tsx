import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';
declare var NVBarButton: any;

var BarButtonIOS = props => <NVBarButton {...props} key={props.systemItem} />;

export default Platform.OS === 'ios' ? requireNativeComponent('NVBarButton', BarButtonIOS as any) : () => null;
