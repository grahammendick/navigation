import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const CoordinatorLayout = (props) => <NVCoordinatorLayout {...props} style={{flex: 1}} />;

const NVCoordinatorLayout = requireNativeComponent<any>('NVCoordinatorLayout', null)

export default Platform.OS === 'android' ? CoordinatorLayout : ({children}) => children;

